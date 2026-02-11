/**
 * Review and Rating Service
 * Manages shop and coupon reviews
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
  runTransaction,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ShopReview, CouponReview, ShopRating, ReviewFilters } from '../types/reviews.types';
import { logger } from '../utils/logger';
import { analytics } from '../config/monitoring';

class ReviewService {
  private readonly COLLECTIONS = {
    SHOP_REVIEWS: 'shopReviews',
    COUPON_REVIEWS: 'couponReviews',
    SHOP_RATINGS: 'shopRatings',
  };

  /**
   * Submit a shop review
   */
  async submitShopReview(
    shopId: string,
    userId: string,
    userName: string,
    rating: number,
    title: string,
    comment: string,
    images?: string[]
  ): Promise<{ success: boolean; reviewId?: string; message: string }> {
    try {
      // Check if user already reviewed this shop
      const existingReview = await this.getUserShopReview(shopId, userId);
      if (existingReview) {
        return { success: false, message: 'You have already reviewed this shop' };
      }

      const reviewRef = doc(collection(db, this.COLLECTIONS.SHOP_REVIEWS));
      const review: ShopReview = {
        id: reviewRef.id,
        shopId,
        userId,
        userName,
        rating,
        title,
        comment,
        images: images || [],
        verifiedPurchase: false, // TODO: Check if user has redeemed coupons from this shop
        helpful: 0,
        notHelpful: 0,
        status: 'approved', // Auto-approve for now, can add moderation later
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(reviewRef, review);
      await this.updateShopRating(shopId);

      analytics.track('shop_review_submitted', {
        shop_id: shopId,
        user_id: userId,
        rating,
      });

      return { 
        success: true, 
        reviewId: reviewRef.id,
        message: 'Review submitted successfully' 
      };
    } catch (error) {
      logger.error('Error submitting shop review:', error);
      return { success: false, message: 'Failed to submit review' };
    }
  }

  /**
   * Get user's review for a shop
   */
  private async getUserShopReview(shopId: string, userId: string): Promise<ShopReview | null> {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.SHOP_REVIEWS),
        where('shopId', '==', shopId),
        where('userId', '==', userId),
        firestoreLimit(1)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      return snapshot.docs[0].data() as ShopReview;
    } catch (error) {
      logger.error('Error getting user shop review:', error);
      return null;
    }
  }

  /**
   * Get shop reviews with filters
   */
  async getShopReviews(
    shopId: string,
    filters: ReviewFilters
  ): Promise<ShopReview[]> {
    try {
      let q = query(
        collection(db, this.COLLECTIONS.SHOP_REVIEWS),
        where('shopId', '==', shopId),
        where('status', '==', 'approved')
      );

      // Apply rating filter
      if (filters.rating) {
        q = query(q, where('rating', '==', filters.rating));
      }

      // Apply verified filter
      if (filters.verifiedOnly) {
        q = query(q, where('verifiedPurchase', '==', true));
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'recent':
          q = query(q, orderBy('createdAt', 'desc'));
          break;
        case 'helpful':
          q = query(q, orderBy('helpful', 'desc'));
          break;
        case 'rating_high':
          q = query(q, orderBy('rating', 'desc'));
          break;
        case 'rating_low':
          q = query(q, orderBy('rating', 'asc'));
          break;
      }

      q = query(q, firestoreLimit(filters.limit));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as ShopReview);
    } catch (error) {
      logger.error('Error getting shop reviews:', error);
      return [];
    }
  }

  /**
   * Get shop rating summary
   */
  async getShopRating(shopId: string): Promise<ShopRating | null> {
    try {
      const docRef = doc(db, this.COLLECTIONS.SHOP_RATINGS, shopId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as ShopRating;
      }

      return null;
    } catch (error) {
      logger.error('Error getting shop rating:', error);
      return null;
    }
  }

  /**
   * Update shop rating summary
   */
  private async updateShopRating(shopId: string): Promise<void> {
    try {
      // Get all approved reviews for this shop
      const q = query(
        collection(db, this.COLLECTIONS.SHOP_REVIEWS),
        where('shopId', '==', shopId),
        where('status', '==', 'approved')
      );

      const snapshot = await getDocs(q);
      const reviews = snapshot.docs.map(doc => doc.data() as ShopReview);

      if (reviews.length === 0) return;

      // Calculate statistics
      const totalReviews = reviews.length;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;

      const ratingDistribution = {
        1: reviews.filter(r => r.rating === 1).length,
        2: reviews.filter(r => r.rating === 2).length,
        3: reviews.filter(r => r.rating === 3).length,
        4: reviews.filter(r => r.rating === 4).length,
        5: reviews.filter(r => r.rating === 5).length,
      };

      const reviewsWithResponse = reviews.filter(r => r.merchantResponse).length;
      const responseRate = (reviewsWithResponse / totalReviews) * 100;

      const rating: ShopRating = {
        shopId,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution,
        verified: true,
        responseRate: Math.round(responseRate),
      };

      await setDoc(doc(db, this.COLLECTIONS.SHOP_RATINGS, shopId), rating);
    } catch (error) {
      logger.error('Error updating shop rating:', error);
    }
  }

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(reviewId: string, isHelpful: boolean): Promise<boolean> {
    try {
      const reviewRef = doc(db, this.COLLECTIONS.SHOP_REVIEWS, reviewId);
      
      await updateDoc(reviewRef, {
        [isHelpful ? 'helpful' : 'notHelpful']: increment(1),
      });

      analytics.track('review_marked_helpful', {
        review_id: reviewId,
        is_helpful: isHelpful,
      });

      return true;
    } catch (error) {
      logger.error('Error marking review helpful:', error);
      return false;
    }
  }

  /**
   * Add merchant response to review
   */
  async addMerchantResponse(
    reviewId: string,
    merchantId: string,
    response: string
  ): Promise<boolean> {
    try {
      const reviewRef = doc(db, this.COLLECTIONS.SHOP_REVIEWS, reviewId);
      
      await updateDoc(reviewRef, {
        merchantResponse: {
          response,
          respondedAt: new Date(),
          respondedBy: merchantId,
        },
        updatedAt: new Date(),
      });

      const reviewDoc = await getDoc(reviewRef);
      const review = reviewDoc.data() as ShopReview;
      await this.updateShopRating(review.shopId);

      analytics.track('merchant_responded_to_review', {
        review_id: reviewId,
        merchant_id: merchantId,
      });

      return true;
    } catch (error) {
      logger.error('Error adding merchant response:', error);
      return false;
    }
  }

  /**
   * Submit a coupon review
   */
  async submitCouponReview(
    couponId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string,
    wasSuccessful: boolean,
    valueForMoney: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const reviewRef = doc(collection(db, this.COLLECTIONS.COUPON_REVIEWS));
      const review: CouponReview = {
        id: reviewRef.id,
        couponId,
        userId,
        userName,
        rating,
        comment,
        wasSuccessful,
        valueForMoney,
        helpful: 0,
        notHelpful: 0,
        createdAt: new Date(),
      };

      await setDoc(reviewRef, review);

      analytics.track('coupon_review_submitted', {
        coupon_id: couponId,
        user_id: userId,
        rating,
        was_successful: wasSuccessful,
      });

      return { success: true, message: 'Review submitted successfully' };
    } catch (error) {
      logger.error('Error submitting coupon review:', error);
      return { success: false, message: 'Failed to submit review' };
    }
  }
}

export const reviewService = new ReviewService();
