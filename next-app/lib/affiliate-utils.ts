/**
 * Affiliate system utilities
 */

/**
 * Generate unique affiliate tracking code
 */
export function generateTrackingCode(length: number = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  let code = ""
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Create affiliate link URL
 */
export function createAffiliateLink(
  trackingCode: string,
  couponId: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
): string {
  return `${baseUrl}/go/${trackingCode}?coupon=${couponId}`
}

/**
 * Calculate CTR (Click-Through Rate)
 */
export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0
  return (clicks / impressions) * 100
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(conversions: number, clicks: number): number {
  if (clicks === 0) return 0
  return (conversions / clicks) * 100
}

/**
 * Calculate EPC (Earnings Per Click)
 */
export function calculateEPC(earnings: number, clicks: number): number {
  if (clicks === 0) return 0
  return earnings / clicks
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Check if earning should be moved from PENDING to AVAILABLE
 * (30 days after redemption)
 */
export function shouldReleaseEarning(redemptionDate: Date): boolean {
  const daysSince = Math.floor((Date.now() - redemptionDate.getTime()) / (1000 * 60 * 60 * 24))
  return daysSince >= 30
}

/**
 * Get cookie name for affiliate tracking
 */
export function getAffiliateCookieName(): string {
  return 'kobonz_affiliate_ref'
}

/**
 * Get cookie expiry (30 days from now)
 */
export function getAffiliateCookieExpiry(): Date {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 30)
  return expiry
}
