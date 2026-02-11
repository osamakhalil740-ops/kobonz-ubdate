/**
 * Loyalty Program Service
 * Manages points, tiers, rewards, and achievements
 */

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  getDocs,
  increment,
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  LoyaltyPoints, 
  PointsTransaction, 
  LoyaltyTier, 
  TIER_BENEFITS,
  LoyaltyReward,
  LoyaltyAchievement
} from '../types/loyalty.types';
import { logger } from '../utils/logger';
import { analytics } from '../config/monitoring';

class LoyaltyService {
  private readonly COLLECTIONS = {
    LOYALTY_POINTS: 'loyaltyPoints',
    POINTS_TRANSACTIONS: 'pointsTransactions',
    REWARDS: 'loyaltyRewards',
    ACHIEVEMENTS: 'loyaltyAchievements',
    USER_ACHIEVEMENTS: 'userAchievements',
  };

  /**
   * Get user's loyalty points
   */
  async getUserPoints(userId: string): Promise<LoyaltyPoints | null> {
    try {
      const docRef = doc(db, this.COLLECTIONS.LOYALTY_POINTS, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as LoyaltyPoints;
      }

      // Create initial loyalty account
      return await this.initializeLoyaltyAccount(userId);
    } catch (error) {
      logger.error('Error getting user points:', error);
      return null;
    }
  }

  /**
   * Initialize loyalty account for new user
   */
  private async initializeLoyaltyAccount(userId: string): Promise<LoyaltyPoints> {
    const loyaltyPoints: LoyaltyPoints = {
      userId,
      totalPoints: 0,
      availablePoints: 0,
      usedPoints: 0,
      tier: 'bronze',
      tierProgress: 0,
      lifetimePoints: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, this.COLLECTIONS.LOYALTY_POINTS, userId), loyaltyPoints);
    
    analytics.track('loyalty_account_created', { user_id: userId });
    
    return loyaltyPoints;
  }

  /**
   * Award points to user
   */
  async awardPoints(
    userId: string,
    amount: number,
    reason: string,
    relatedCouponId?: string
  ): Promise<boolean> {
    try {
      const userPoints = await this.getUserPoints(userId);
      if (!userPoints) return false;

      // Calculate multiplier based on tier
      const multiplier = TIER_BENEFITS[userPoints.tier].pointsMultiplier;
      const finalAmount = Math.floor(amount * multiplier);

      // Update points in transaction
      await runTransaction(db, async (transaction) => {
        const pointsRef = doc(db, this.COLLECTIONS.LOYALTY_POINTS, userId);
        const transactionRef = doc(collection(db, this.COLLECTIONS.POINTS_TRANSACTIONS));

        // Update user points
        transaction.update(pointsRef, {
          totalPoints: increment(finalAmount),
          availablePoints: increment(finalAmount),
          lifetimePoints: increment(finalAmount),
          updatedAt: new Date(),
        });

        // Record transaction
        const pointsTransaction: PointsTransaction = {
          id: transactionRef.id,
          userId,
          amount: finalAmount,
          type: 'earned',
          reason,
          relatedCouponId,
          timestamp: new Date(),
        };

        transaction.set(transactionRef, pointsTransaction);
      });

      // Check for tier upgrade
      await this.checkTierUpgrade(userId);

      analytics.track('loyalty_points_awarded', {
        user_id: userId,
        amount: finalAmount,
        reason,
      });

      return true;
    } catch (error) {
      logger.error('Error awarding points:', error);
      return false;
    }
  }

  /**
   * Redeem points for reward
   */
  async redeemPoints(
    userId: string,
    rewardId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const userPoints = await this.getUserPoints(userId);
      if (!userPoints) {
        return { success: false, message: 'Loyalty account not found' };
      }

      const rewardDoc = await getDoc(doc(db, this.COLLECTIONS.REWARDS, rewardId));
      if (!rewardDoc.exists()) {
        return { success: false, message: 'Reward not found' };
      }

      const reward = rewardDoc.data() as LoyaltyReward;

      // Check if user has enough points
      if (userPoints.availablePoints < reward.pointsCost) {
        return { success: false, message: 'Insufficient points' };
      }

      // Check tier eligibility
      if (!reward.availableFor.includes(userPoints.tier)) {
        return { success: false, message: 'Not available for your tier' };
      }

      // Redeem in transaction
      await runTransaction(db, async (transaction) => {
        const pointsRef = doc(db, this.COLLECTIONS.LOYALTY_POINTS, userId);
        const transactionRef = doc(collection(db, this.COLLECTIONS.POINTS_TRANSACTIONS));
        const rewardRef = doc(db, this.COLLECTIONS.REWARDS, rewardId);

        // Deduct points
        transaction.update(pointsRef, {
          availablePoints: increment(-reward.pointsCost),
          usedPoints: increment(reward.pointsCost),
          updatedAt: new Date(),
        });

        // Record transaction
        const pointsTransaction: PointsTransaction = {
          id: transactionRef.id,
          userId,
          amount: -reward.pointsCost,
          type: 'spent',
          reason: `Redeemed: ${reward.title}`,
          timestamp: new Date(),
        };

        transaction.set(transactionRef, pointsTransaction);

        // Update reward redemptions
        transaction.update(rewardRef, {
          currentRedemptions: increment(1),
        });
      });

      analytics.track('loyalty_reward_redeemed', {
        user_id: userId,
        reward_id: rewardId,
        points_cost: reward.pointsCost,
      });

      return { success: true, message: 'Reward redeemed successfully' };
    } catch (error) {
      logger.error('Error redeeming points:', error);
      return { success: false, message: 'Failed to redeem reward' };
    }
  }

  /**
   * Check and upgrade tier if eligible
   */
  private async checkTierUpgrade(userId: string): Promise<void> {
    try {
      const userPoints = await this.getUserPoints(userId);
      if (!userPoints) return;

      const currentTier = userPoints.tier;
      const lifetimePoints = userPoints.lifetimePoints;

      let newTier: LoyaltyTier = currentTier;

      // Determine new tier
      if (lifetimePoints >= TIER_BENEFITS.platinum.requiredPoints) {
        newTier = 'platinum';
      } else if (lifetimePoints >= TIER_BENEFITS.gold.requiredPoints) {
        newTier = 'gold';
      } else if (lifetimePoints >= TIER_BENEFITS.silver.requiredPoints) {
        newTier = 'silver';
      } else {
        newTier = 'bronze';
      }

      // Calculate tier progress
      let tierProgress = 0;
      if (newTier === 'bronze') {
        tierProgress = (lifetimePoints / TIER_BENEFITS.silver.requiredPoints) * 100;
      } else if (newTier === 'silver') {
        tierProgress = ((lifetimePoints - TIER_BENEFITS.silver.requiredPoints) / 
                       (TIER_BENEFITS.gold.requiredPoints - TIER_BENEFITS.silver.requiredPoints)) * 100;
      } else if (newTier === 'gold') {
        tierProgress = ((lifetimePoints - TIER_BENEFITS.gold.requiredPoints) / 
                       (TIER_BENEFITS.platinum.requiredPoints - TIER_BENEFITS.gold.requiredPoints)) * 100;
      } else {
        tierProgress = 100;
      }

      // Update tier if changed
      if (newTier !== currentTier) {
        await updateDoc(doc(db, this.COLLECTIONS.LOYALTY_POINTS, userId), {
          tier: newTier,
          tierProgress: Math.min(tierProgress, 100),
          updatedAt: new Date(),
        });

        analytics.track('loyalty_tier_upgraded', {
          user_id: userId,
          old_tier: currentTier,
          new_tier: newTier,
        });
      } else if (tierProgress !== userPoints.tierProgress) {
        await updateDoc(doc(db, this.COLLECTIONS.LOYALTY_POINTS, userId), {
          tierProgress: Math.min(tierProgress, 100),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      logger.error('Error checking tier upgrade:', error);
    }
  }

  /**
   * Get user's transaction history
   */
  async getTransactionHistory(
    userId: string,
    limitCount: number = 50
  ): Promise<PointsTransaction[]> {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.POINTS_TRANSACTIONS),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as PointsTransaction);
    } catch (error) {
      logger.error('Error getting transaction history:', error);
      return [];
    }
  }

  /**
   * Get available rewards
   */
  async getAvailableRewards(userTier: LoyaltyTier): Promise<LoyaltyReward[]> {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.REWARDS),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(q);
      const rewards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LoyaltyReward));

      // Filter by tier eligibility
      return rewards.filter(reward => 
        reward.availableFor.includes(userTier)
      );
    } catch (error) {
      logger.error('Error getting rewards:', error);
      return [];
    }
  }
}

export const loyaltyService = new LoyaltyService();
