/**
 * Loyalty Program Types
 */

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyPoints {
  userId: string;
  totalPoints: number;
  availablePoints: number;
  usedPoints: number;
  tier: LoyaltyTier;
  tierProgress: number; // Percentage to next tier
  lifetimePoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number; // Positive for earned, negative for spent
  type: 'earned' | 'spent' | 'expired' | 'bonus';
  reason: string;
  relatedCouponId?: string;
  relatedOrderId?: string;
  timestamp: Date;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_coupon' | 'exclusive_deal' | 'bonus_points';
  value: number; // Discount percentage or bonus points
  availableFor: LoyaltyTier[];
  expiryDate?: Date;
  isActive: boolean;
  maxRedemptions?: number;
  currentRedemptions: number;
}

export interface TierBenefits {
  tier: LoyaltyTier;
  name: string;
  icon: string;
  color: string;
  requiredPoints: number;
  benefits: string[];
  pointsMultiplier: number; // 1x, 1.5x, 2x, 3x
  exclusiveDeals: boolean;
  prioritySupport: boolean;
  birthdayBonus: number;
}

export const TIER_BENEFITS: Record<LoyaltyTier, TierBenefits> = {
  bronze: {
    tier: 'bronze',
    name: 'Bronze Member',
    icon: '🥉',
    color: '#CD7F32',
    requiredPoints: 0,
    benefits: [
      'Earn 1 point per coupon redemption',
      'Access to loyalty rewards',
      'Monthly newsletter',
    ],
    pointsMultiplier: 1,
    exclusiveDeals: false,
    prioritySupport: false,
    birthdayBonus: 10,
  },
  silver: {
    tier: 'silver',
    name: 'Silver Member',
    icon: '🥈',
    color: '#C0C0C0',
    requiredPoints: 100,
    benefits: [
      'Earn 1.5x points per redemption',
      'Early access to new deals',
      'Silver-exclusive coupons',
      'Priority customer support',
    ],
    pointsMultiplier: 1.5,
    exclusiveDeals: true,
    prioritySupport: true,
    birthdayBonus: 25,
  },
  gold: {
    tier: 'gold',
    name: 'Gold Member',
    icon: '🥇',
    color: '#FFD700',
    requiredPoints: 500,
    benefits: [
      'Earn 2x points per redemption',
      'Gold-exclusive premium coupons',
      'VIP customer support',
      'Free shipping on orders',
      'Extended coupon validity',
    ],
    pointsMultiplier: 2,
    exclusiveDeals: true,
    prioritySupport: true,
    birthdayBonus: 50,
  },
  platinum: {
    tier: 'platinum',
    name: 'Platinum Member',
    icon: '💎',
    color: '#E5E4E2',
    requiredPoints: 2000,
    benefits: [
      'Earn 3x points per redemption',
      'Platinum-exclusive luxury deals',
      'Dedicated account manager',
      'First access to all new features',
      'Unlimited coupon extensions',
      'Invite-only special events',
    ],
    pointsMultiplier: 3,
    exclusiveDeals: true,
    prioritySupport: true,
    birthdayBonus: 100,
  },
};

export interface LoyaltyAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'coupons_redeemed' | 'points_earned' | 'referrals' | 'streak_days';
  rewardPoints: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}
