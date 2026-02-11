/**
 * Reviews and Ratings Types
 */

export interface ShopReview {
  id: string;
  shopId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  helpful: number; // Number of helpful votes
  notHelpful: number;
  merchantResponse?: MerchantResponse;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface MerchantResponse {
  response: string;
  respondedAt: Date;
  respondedBy: string;
}

export interface CouponReview {
  id: string;
  couponId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  wasSuccessful: boolean; // Did the coupon work?
  valueForMoney: number; // 1-5
  helpful: number;
  notHelpful: number;
  createdAt: Date;
}

export interface ShopRating {
  shopId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verified: boolean;
  responseRate: number; // Percentage of reviews with merchant responses
}

export interface ReviewFilters {
  rating?: number;
  verifiedOnly?: boolean;
  sortBy: 'recent' | 'helpful' | 'rating_high' | 'rating_low';
  page: number;
  limit: number;
}
