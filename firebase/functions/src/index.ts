
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Simple logger for Firebase Functions
const logger = {
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  }
};

// A callable function to securely track a coupon click
export const trackCouponClickCallable = functions.https.onCall(
  async (request) => {
    const { couponId } = request.data as { couponId?: string };
    if (!couponId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Coupon ID is required."
      );
    }
    const couponRef = db.collection("coupons").doc(couponId);
    try {
      await couponRef.update({
        clicks: admin.firestore.FieldValue.increment(1),
      });
      return { success: true };
    } catch (error) {
      logger.error("Failed to track click for coupon:", couponId, error);
      // We don't throw an error back to the user to not break their view
      return { success: false };
    }
  }
);


// A callable function to securely redeem a coupon
export const redeemCouponCallable = functions.https.onCall(
  async (request) => {
    // 1. Authentication & Authorization Check
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be logged in to redeem a coupon."
      );
    }
    const redeemingUserId = request.auth.uid;
    const redeemingUserDoc = await db
      .collection("shops")
      .doc(redeemingUserId)
      .get();
    if (!redeemingUserDoc.exists) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "User account not found. Please make sure you're logged in."
      );
    }

    const { couponId, affiliateId } = request.data as {
      couponId?: string;
      affiliateId?: string;
    };
    if (!couponId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Coupon ID is required."
      );
    }

    try {
      // 2. Run as a Transaction for Data Integrity
      await db.runTransaction(async (transaction) => {
        // Step 1: All Reads (MUST come before writes)
        const couponRef = db.collection("coupons").doc(couponId);
        const couponDoc = await transaction.get(couponRef);

        if (!couponDoc.exists) {
          throw new functions.https.HttpsError("not-found", "Coupon not found.");
        }

        const couponData = couponDoc.data() as any;
        const shopOwnerId = couponData.shopOwnerId;
        const shopRef = db.collection("shops").doc(shopOwnerId);
        const shopDoc = await transaction.get(shopRef);

        const affiliateRef = affiliateId ?
          db.collection("shops").doc(affiliateId) :
          null;
        const affiliateDoc = affiliateRef ?
          await transaction.get(affiliateRef) :
          null;

        const referrerRef =
          shopDoc.exists && shopDoc.data()?.referredBy ?
            db.collection("shops").doc(shopDoc.data()?.referredBy) :
            null;
        const referrerDoc = referrerRef ?
          await transaction.get(referrerRef) :
          null;

        let referralDocRef: admin.firestore.QueryDocumentSnapshot | null = null;
        if (
          shopDoc.exists &&
          !shopDoc.data()?.hasRedeemedFirstCoupon &&
          shopDoc.data()?.referredBy
        ) {
          const referralsQuery = db
            .collection("referrals")
            .where("referredId", "==", shopOwnerId)
            .limit(1);
          const referralQuerySnap = await transaction.get(referralsQuery);
          if (!referralQuerySnap.empty) {
            referralDocRef = referralQuerySnap.docs[0];
          }
        }

        // Step 2: All Validations
        if (couponData.usesLeft <= 0) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            "Coupon has no uses left."
          );
        }

        if (couponData.validityType === "expiryDate" && couponData.expiryDate) {
          if (couponData.expiryDate.toDate() < new Date()) {
            throw new functions.https.HttpsError(
              "failed-precondition",
              "This coupon has expired."
            );
          }
        }

        // Additional validation for days-based validity
        if (couponData.validityType === "days" && couponData.validityDays) {
          const createdAt = couponData.createdAt?.toDate ? couponData.createdAt.toDate() : new Date();
          const expiryDate = new Date(createdAt.getTime() + couponData.validityDays * 24 * 60 * 60 * 1000);
          if (expiryDate < new Date()) {
            throw new functions.https.HttpsError(
              "failed-precondition",
              "This coupon has expired."
            );
          }
        }

        // Step 3: All Writes
        transaction.update(couponRef, {
          usesLeft: admin.firestore.FieldValue.increment(-1),
        });

        const redemptionRef = db.collection("redemptions").doc();
        const redemptionData: any = {
          couponId: couponDoc.id,
          couponTitle: couponData.title,
          shopOwnerId: couponData.shopOwnerId,
          redeemedAt: admin.firestore.FieldValue.serverTimestamp(),
          customerId: redeemingUserId,
        };

        // Award customer reward points
        if (couponData.customerRewardPoints > 0) {
          const customerRef = db.collection("shops").doc(redeemingUserId);
          transaction.update(customerRef, {
            credits: admin.firestore.FieldValue.increment(couponData.customerRewardPoints)
          });
          
          redemptionData.customerRewardEarned = couponData.customerRewardPoints;

          // Log customer reward in admin logs
          const customerLogRef = db.collection("adminCreditLogs").doc();
          transaction.set(customerLogRef, {
            type: "Customer Reward",
            shopId: redeemingUserId,
            shopName: redeemingUserDoc.data()?.name || "Unknown",
            amount: couponData.customerRewardPoints,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // Handle Affiliate Commission
        if (
          affiliateDoc?.exists &&
          affiliateId !== couponData.shopOwnerId &&
          couponData.affiliateCommission > 0
        ) {
          const affiliateData = affiliateDoc.data() as any;
          const commission = couponData.affiliateCommission;
          transaction.update(affiliateRef!, {
            credits: admin.firestore.FieldValue.increment(commission),
          });
          redemptionData.affiliateId = affiliateId;
          redemptionData.commissionEarned = commission;

          const adminLogRefCommission = db.collection("adminCreditLogs").doc();
          transaction.set(adminLogRefCommission, {
            type: "Affiliate Commission",
            shopId: affiliateId,
            shopName: affiliateData.name,
            amount: commission,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // Handle Referral Bonus Trigger
        if (
          shopDoc.exists &&
          !shopDoc.data()?.hasRedeemedFirstCoupon &&
          referrerDoc?.exists &&
          referralDocRef
        ) {
          transaction.update(shopRef, {hasRedeemedFirstCoupon: true});
          const referrerData = referrerDoc.data() as any;
          const bonus = 10000;
          transaction.update(referrerRef!, {
            credits: admin.firestore.FieldValue.increment(bonus),
          });
          transaction.update(referralDocRef.ref, {status: "rewarded"});

          const adminLogRefBonus = db.collection("adminCreditLogs").doc();
          transaction.set(adminLogRefBonus, {
            type: "Referrer Bonus",
            shopId: referrerDoc.id,
            shopName: referrerData.name,
            amount: bonus,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        transaction.set(redemptionRef, redemptionData);
      });

      return {success: true, message: "Coupon redeemed successfully!"};
    } catch (error: any) {
      logger.error("Redemption failed:", error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        "internal",
        "An internal error occurred during redemption."
      );
    }
  }
);
