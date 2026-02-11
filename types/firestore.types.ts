/**
 * Firestore Document Types
 * Proper types for Firestore documents
 */

import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

/**
 * Firestore document with data
 */
export interface FirestoreDocument<T = DocumentData> {
  id: string;
  data: T;
}

/**
 * Type-safe fromFirestore converter
 */
export function fromFirestore<T>(doc: QueryDocumentSnapshot | DocumentSnapshot): FirestoreDocument<T> | null {
  if (!doc.exists()) {
    return null;
  }
  
  const data = doc.data() as T;
  return {
    id: doc.id,
    data
  };
}

/**
 * Firestore timestamp converter
 */
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

/**
 * Convert Firestore timestamp to ISO string
 */
export function firestoreTimestampToISO(timestamp: FirestoreTimestamp | Date | string | undefined): string {
  if (!timestamp) {
    return new Date().toISOString();
  }
  
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  
  if ('toDate' in timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  
  return new Date().toISOString();
}

/**
 * Real-time update data type
 */
export type RealTimeUpdateType = 'shops' | 'redemptions' | 'coupons' | 'customers';

export interface RealTimeUpdate<T = unknown> {
  type: RealTimeUpdateType;
  data: T[];
}

/**
 * Activity log data
 */
export interface ActivityLogData {
  userId: string;
  userName: string;
  action: string;
  type: string;
  timestamp: Date;
  details?: Record<string, unknown>;
  page?: string;
  priority?: 'high' | 'medium' | 'low';
  [key: string]: unknown;
}

/**
 * Customer data from redemptions
 */
export interface CustomerRedemptionData {
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAge?: number;
  customerGender?: string;
  customerCity?: string;
  customerCountry?: string;
  couponId: string;
  couponTitle?: string;
  shopOwnerId: string;
  shopOwnerName?: string;
  affiliateId?: string | null;
  affiliateName?: string | null;
  redeemedAt: string | Date;
  discountValue?: number;
  timestamp?: string | Date;
  isVerifiedCustomer?: boolean;
  hasCompleteProfile?: boolean;
}

/**
 * Shop creation tracking data
 */
export interface ShopCreationData {
  id: string;
  name: string;
  email: string;
  roles: string[];
  credits: number;
  signupDate: Date | string;
  referredBy?: string;
  country?: string;
  city?: string;
  category?: string;
}

/**
 * Intelligence insights types
 */
export interface ShopInsight {
  shopId: string;
  shopName: string;
  totalCoupons: number;
  activeCoupons: number;
  totalRedemptions: number;
  totalCustomers: number;
  totalRevenue: number;
  averageRevenuePerCustomer: string;
  customerRetention: string;
  topPerformingCoupon?: string;
}

export interface AffiliateInsight {
  affiliateId: string;
  affiliateName: string;
  totalRedemptions: number;
  totalCustomers: number;
  totalCommissionsEarned: number;
  shopsWorkedWith: number;
  averageCommissionPerRedemption: string;
  customerQuality: {
    verified: number;
    completeProfiles: number;
    qualityScore: string;
  };
}

export interface CustomerActivity {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalRedemptions: number;
  shopsVisited: number;
  affiliatesUsed: number;
  totalSavings: number;
  lastActivity: number;
  acquisitionSource: string;
  isVerified: boolean;
  hasCompleteProfile: boolean;
}

export interface GlobalAnalytics {
  totalShops: number;
  activeShops: number;
  totalAffiliates: number;
  activeAffiliates: number;
  totalCoupons: number;
  activeCoupons: number;
  totalRedemptions: number;
  totalUniqueCustomers: number;
  totalRevenue: number;
  totalCommissions: number;
  networkEfficiency: string;
  systemHealth: {
    healthScore: string;
    activeShopsPercent: string;
    activeAffiliatesPercent: string;
    customerSatisfaction: string;
  };
}

export interface IntelligenceData {
  shopInsights: ShopInsight[];
  affiliateInsights: AffiliateInsight[];
  customerActivity: CustomerActivity[];
  globalAnalytics: GlobalAnalytics;
  lastUpdated: string;
}
