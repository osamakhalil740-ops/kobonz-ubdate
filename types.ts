export type Role = 'admin' | 'shop-owner' | 'affiliate' | 'user';

export interface Shop {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  credits: number;
  referralCode: string;
  referredBy?: string;
  hasRedeemedFirstCoupon: boolean;
  // New fields for marketplace
  country: string;
  city: string;
  category: string;
  // Detailed address fields
  district: string;
  shopDescription: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  postalCode: string;
  // Ban management fields
  bannedUntil?: string; // ISO string - timestamp when ban expires, null/undefined = not banned
  banReason?: string; // Reason for the ban
  isActive?: boolean; // Account active status (legacy support)
}

export interface Coupon {
  id: string;
  shopOwnerId: string;
  shopOwnerName: string;
  title: string;
  description: string;
  maxUses: number;
  usesLeft: number;
  createdAt: string; // ISO string
  clicks: number; // New field for tracking views

  // New detailed fields
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validityType: 'expiryDate' | 'days';
  expiryDate?: string; // ISO string
  validityDays?: number;
  affiliateCommission: number; // in credits
  customerRewardPoints: number; // Points awarded to customer who redeems
  
  // Location fields for coupon filtering
  // These are automatically set from shop owner's location (country, city, district)
  // isGlobal = true means coupon is valid worldwide (countries/cities/areas will be empty)
  // isGlobal = false means coupon is valid only at shop's location
  countries?: string[]; // List of countries where coupon is valid, empty = global
  cities?: string[]; // Specific cities where valid
  areas?: string[]; // Specific areas/districts where valid
  isGlobal?: boolean; // If true, valid everywhere; if false, valid only at shop location
}

export interface CreateCouponData {
  shopOwnerId: string;
  title: string;
  description: string;
  maxUses: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validityType: 'expiryDate' | 'days';
  /** 
   * Required when validityType is 'expiryDate'. 
   * Must be a valid ISO date string in the future.
   * Will be undefined when validityType is 'days'.
   */
  expiryDate?: string;
  /** 
   * Required when validityType is 'days'. 
   * Must be a positive integer representing number of days.
   * Will be undefined when validityType is 'expiryDate'.
   */
  validityDays?: number;
  affiliateCommission: number;
  customerRewardPoints: number;
  creationCost?: number; // Cost to create this coupon
  // Location: Determined by shop owner's profile + isGlobal flag
  // countries, cities, areas are set automatically based on shop owner's location
  // They are NOT provided by the coupon creation form
  countries?: string[];
  cities?: string[];
  areas?: string[];
  isGlobal?: boolean; // Only field provided by user: true = global, false = shop location
}

/**
 * Conditional type that ensures proper validity fields based on validityType
 */
export type ValidatedCouponData = 
  | (Omit<CreateCouponData, 'validityType' | 'validityDays' | 'expiryDate'> & {
      validityType: 'expiryDate';
      expiryDate: string;
      validityDays?: never;
    })
  | (Omit<CreateCouponData, 'validityType' | 'validityDays' | 'expiryDate'> & {
      validityType: 'days';
      validityDays: number;
      expiryDate?: never;
    });

// Credit Request System
export interface CreditRequest {
  id: string;
  shopOwnerId: string;
  shopOwnerName: string;
  shopOwnerEmail: string;
  requestedAmount: number;
  status: 'pending' | 'key_generated' | 'completed';
  message: string; // Shop owner's request message
  adminResponse?: string; // Admin's response
  requestedAt: string; // ISO string
  processedAt?: string; // ISO string
  processedBy?: string; // Admin email
}

// Credit Activation Key System
export interface CreditKey {
  id: string;
  keyCode: string; // Unique activation key
  requestId: string; // Links to the original credit request
  shopOwnerId: string;
  creditAmount: number;
  isUsed: boolean;
  createdBy: string; // Admin email who created it
  createdAt: string; // ISO string
  usedAt?: string; // ISO string
  expiresAt: string; // ISO string
  description: string; // Purpose of the key
}

export interface Redemption {
    id: string;
    couponId: string;
    couponTitle: string;
    shopOwnerId: string;
    redeemedAt: string; // ISO string
    affiliateId?: string;
    commissionEarned?: number;
    customerId?: string; // User who redeemed the coupon
    customerRewardEarned?: number; // Points earned by customer
}

export interface Referral {
    id: string;
    referrerId: string;
    referredId: string;
    referredShopName: string;
    status: 'pending' | 'rewarded';
    signupDate: string; // ISO string
}

export interface AdminCreditLog {
    id: string;
    type: 'Standard Signup' | 'Referred Signup' | 'Referrer Bonus' | 'Affiliate Commission' | 'Customer Reward' | 'Coupon Creation Cost' | 'Credit Purchase' | 'Admin Grant';
    shopId: string;
    shopName: string;
    amount: number;
    timestamp: string; // ISO string
    details?: string; // Additional information
}