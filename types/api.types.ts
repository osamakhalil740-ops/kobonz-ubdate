/**
 * API Type Definitions
 * 
 * Provides type-safe interfaces for API responses and requests
 * Reduces usage of 'any' type throughout the application
 */

import { Coupon, Shop, Redemption } from '../types';

/**
 * Firestore Document Data
 */
export interface FirestoreDocumentData {
  [key: string]: any;
}

/**
 * Customer Data Interface (from shopCustomerData collection)
 */
export interface CustomerData {
  id: string;
  shopOwnerId: string;
  couponId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  isVerifiedCustomer: boolean;
  hasCompleteProfile: boolean;
  timestamp: string;
  createdAt?: string;
  source: 'redemption' | 'manual' | 'import';
  redemptionId?: string;
}

/**
 * Affiliate Activity Interface
 */
export interface AffiliateActivity {
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  totalRedemptions: number;
  totalCommission: number;
  couponsPromoted: string[];
  lastActivityDate: string;
}

/**
 * Shop Intelligence Data
 */
export interface ShopIntelligence {
  shopId: string;
  shopName: string;
  totalRevenue: number;
  totalRedemptions: number;
  totalAffiliates: number;
  totalCustomers: number;
  averageRedemptionValue: number;
  topCoupons: Array<{
    couponId: string;
    title: string;
    redemptions: number;
  }>;
}

/**
 * Affiliate Intelligence Data
 */
export interface AffiliateIntelligence {
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  totalCommissions: number;
  totalRedemptions: number;
  conversionRate: number;
  averageCommissionPerRedemption: number;
  topShops: Array<{
    shopId: string;
    shopName: string;
    redemptions: number;
    commission: number;
  }>;
  customerQuality: {
    verifiedCustomers: number;
    totalCustomers: number;
    verificationRate: number;
  };
}

/**
 * Customer Intelligence Data
 */
export interface CustomerIntelligence {
  customerId: string;
  customerName: string;
  customerEmail: string;
  totalRedemptions: number;
  totalRewardsEarned: number;
  averageSpending: number;
  isVerified: boolean;
  shopVisits: Array<{
    shopId: string;
    shopName: string;
    visits: number;
  }>;
  lastActivity: string;
}

/**
 * Global Intelligence Data (for Super Admin)
 */
export interface GlobalIntelligence {
  shops: ShopIntelligence[];
  affiliates: AffiliateIntelligence[];
  customers: CustomerIntelligence[];
  globalStats: {
    totalShops: number;
    totalAffiliates: number;
    totalCustomers: number;
    totalRedemptions: number;
    totalRevenue: number;
    averageRedemptionValue: number;
    networkEfficiency: number;
  };
  timestamp: string;
}

/**
 * Cloud Function Response Types
 */
export interface CloudFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RedeemCouponResponse {
  success: boolean;
  message: string;
  redemptionId?: string;
  commissionEarned?: number;
  rewardPointsEarned?: number;
}

export interface TrackClickResponse {
  success: boolean;
  clicks: number;
}

/**
 * API Query Options
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * API Error Response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Real-time Listener Data
 */
export interface RealtimeListenerData<T = any> {
  type: 'shops' | 'coupons' | 'redemptions' | 'customers';
  data: T[];
  timestamp: string;
}

/**
 * Credit Transaction
 */
export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent' | 'granted' | 'refunded';
  reason: string;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Validation Result (from Cloud Functions)
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Location Search Result
 */
export interface LocationSearchResult {
  country: string;
  countryCode: string;
  city: string;
  district?: string;
  matchScore: number;
}

/**
 * Analytics Data
 */
export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  metrics: {
    impressions: number;
    clicks: number;
    redemptions: number;
    revenue: number;
    conversionRate: number;
  };
  breakdown: Array<{
    date: string;
    value: number;
  }>;
}
