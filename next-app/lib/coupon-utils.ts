import { CouponStatus, Coupon } from "@prisma/client"

/**
 * Determine coupon status based on various factors
 */
export function determineCouponStatus(coupon: {
  isApproved: boolean
  isActive: boolean
  expiryDate: Date | null
  status: CouponStatus
}): CouponStatus {
  // Check if expired
  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    return CouponStatus.EXPIRED
  }

  // Check if rejected (admin decision)
  if (coupon.status === CouponStatus.REJECTED) {
    return CouponStatus.REJECTED
  }

  // Check if inactive (manually deactivated)
  if (!coupon.isActive) {
    return CouponStatus.INACTIVE
  }

  // Check if approved
  if (coupon.isApproved && coupon.status === CouponStatus.APPROVED) {
    return CouponStatus.ACTIVE
  }

  // Check if pending approval
  if (!coupon.isApproved && coupon.status === CouponStatus.PENDING) {
    return CouponStatus.PENDING
  }

  // Default to current status
  return coupon.status
}

/**
 * Get status badge variant
 */
export function getStatusBadgeVariant(status: CouponStatus): "default" | "success" | "warning" | "destructive" | "secondary" | "outline" | "info" {
  switch (status) {
    case CouponStatus.ACTIVE:
      return "success"
    case CouponStatus.APPROVED:
      return "info"
    case CouponStatus.PENDING:
      return "warning"
    case CouponStatus.EXPIRED:
      return "secondary"
    case CouponStatus.REJECTED:
      return "destructive"
    case CouponStatus.INACTIVE:
      return "outline"
    default:
      return "default"
  }
}

/**
 * Format coupon status for display
 */
export function formatCouponStatus(status: CouponStatus): string {
  switch (status) {
    case CouponStatus.ACTIVE:
      return "Active"
    case CouponStatus.APPROVED:
      return "Approved"
    case CouponStatus.PENDING:
      return "Pending"
    case CouponStatus.EXPIRED:
      return "Expired"
    case CouponStatus.REJECTED:
      return "Rejected"
    case CouponStatus.INACTIVE:
      return "Inactive"
    default:
      return status
  }
}

/**
 * Check if coupon can be edited
 */
export function canEditCoupon(status: CouponStatus): boolean {
  return [CouponStatus.PENDING, CouponStatus.REJECTED, CouponStatus.INACTIVE].includes(status)
}

/**
 * Check if coupon can be deleted
 */
export function canDeleteCoupon(status: CouponStatus): boolean {
  return [CouponStatus.PENDING, CouponStatus.REJECTED, CouponStatus.INACTIVE, CouponStatus.EXPIRED].includes(status)
}

/**
 * Check if coupon can be activated
 */
export function canActivateCoupon(status: CouponStatus): boolean {
  return [CouponStatus.APPROVED, CouponStatus.INACTIVE].includes(status)
}
