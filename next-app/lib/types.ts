import { Prisma } from '@prisma/client'

// Export Prisma types for use in the application
export type User = Prisma.UserGetPayload<{}>
export type Store = Prisma.StoreGetPayload<{}>
export type Category = Prisma.CategoryGetPayload<{}>
export type Location = Prisma.LocationGetPayload<{}>
export type Coupon = Prisma.CouponGetPayload<{}>
export type Redemption = Prisma.RedemptionGetPayload<{}>
export type AffiliateLink = Prisma.AffiliateLinkGetPayload<{}>
export type CreditLog = Prisma.CreditLogGetPayload<{}>
export type CreditRequest = Prisma.CreditRequestGetPayload<{}>
export type CreditKey = Prisma.CreditKeyGetPayload<{}>

// User with relations
export type UserWithStores = Prisma.UserGetPayload<{
  include: { stores: true }
}>

export type UserWithCoupons = Prisma.UserGetPayload<{
  include: { coupons: true }
}>

// Store with relations
export type StoreWithOwner = Prisma.StoreGetPayload<{
  include: { owner: true, category: true }
}>

export type StoreWithCoupons = Prisma.StoreGetPayload<{
  include: { coupons: true }
}>

// Coupon with relations
export type CouponWithRelations = Prisma.CouponGetPayload<{
  include: {
    user: true
    store: true
    category: true
  }
}>

export type CouponWithRedemptions = Prisma.CouponGetPayload<{
  include: {
    redemptions: true
  }
}>

// Redemption with relations
export type RedemptionWithRelations = Prisma.RedemptionGetPayload<{
  include: {
    coupon: true
    user: true
    affiliateLink: {
      include: {
        affiliate: true
      }
    }
  }
}>

// Form input types (for creating/updating entities)
export type CreateUserInput = Omit<Prisma.UserCreateInput, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUserInput = Prisma.UserUpdateInput

export type CreateStoreInput = Omit<Prisma.StoreCreateInput, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateStoreInput = Prisma.StoreUpdateInput

export type CreateCouponInput = Omit<Prisma.CouponCreateInput, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateCouponInput = Prisma.CouponUpdateInput

export type CreateCategoryInput = Omit<Prisma.CategoryCreateInput, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateCategoryInput = Prisma.CategoryUpdateInput

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Filter and query types
export interface CouponFilters {
  categoryId?: string
  country?: string
  city?: string
  district?: string
  isGlobal?: boolean
  isActive?: boolean
  discountType?: string
  minDiscount?: number
  maxDiscount?: number
}

export interface StoreFilters {
  categoryId?: string
  country?: string
  city?: string
  district?: string
  isActive?: boolean
  isVerified?: boolean
}

export interface UserFilters {
  role?: string
  isActive?: boolean
  isVerified?: boolean
  country?: string
}
