import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"
import { getAffiliateCookieName, shouldReleaseEarning } from "@/lib/affiliate-utils"
import { getToken } from "next-auth/jwt"

// POST /api/public/coupons/[id]/redeem - Redeem a coupon with affiliate tracking
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user if authenticated
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Get coupon
    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
    })

    if (!coupon) {
      return errorResponse("Coupon not found", 404)
    }

    // Check if coupon is active
    if (coupon.status !== "ACTIVE" || !coupon.isActive || !coupon.isApproved) {
      return errorResponse("Coupon is not available", 400)
    }

    // Check if expired
    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return errorResponse("Coupon has expired", 400)
    }

    // Check if uses are available
    if (coupon.usesLeft <= 0) {
      return errorResponse("Coupon has no uses left", 400)
    }

    // Get affiliate tracking from cookie
    const cookieName = getAffiliateCookieName()
    const trackingCode = request.cookies.get(cookieName)?.value

    let affiliateLinkId: string | null = null
    let affiliateLink: any = null

    if (trackingCode) {
      // Find affiliate link
      affiliateLink = await prisma.affiliateLink.findUnique({
        where: { trackingCode },
      })

      // Validate affiliate link matches this coupon
      if (affiliateLink && affiliateLink.couponId === coupon.id && affiliateLink.isActive) {
        affiliateLinkId = affiliateLink.id
      }
    }

    // Get IP and user agent for tracking
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Create redemption
    const redemption = await prisma.redemption.create({
      data: {
        couponId: coupon.id,
        userId: token?.id as string | null,
        affiliateLinkId,
        affiliateCommission: coupon.affiliateCommission,
        customerRewardPoints: coupon.customerRewardPoints,
        ipAddress,
        userAgent,
      },
    })

    // Update coupon usage
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        usesCount: { increment: 1 },
        usesLeft: { decrement: 1 },
      },
    })

    // If there's an affiliate, create earning record and update link
    if (affiliateLink && coupon.affiliateCommission > 0) {
      // Create affiliate earning (starts as PENDING)
      await prisma.affiliateEarning.create({
        data: {
          affiliateId: affiliateLink.affiliateId,
          couponId: coupon.id,
          redemptionId: redemption.id,
          commission: coupon.affiliateCommission,
          status: "PENDING", // Will be AVAILABLE after 30 days
        },
      })

      // Update affiliate link conversions
      await prisma.affiliateLink.update({
        where: { id: affiliateLink.id },
        data: {
          conversions: { increment: 1 },
        },
      })

      // Update affiliate pending balance
      await prisma.user.update({
        where: { id: affiliateLink.affiliateId },
        data: {
          affiliatePending: { increment: coupon.affiliateCommission },
          affiliateTotalEarned: { increment: coupon.affiliateCommission },
        },
      })
    }

    // Award customer reward points if user is authenticated
    if (token?.id && coupon.customerRewardPoints > 0) {
      await prisma.user.update({
        where: { id: token.id as string },
        data: {
          credits: { increment: coupon.customerRewardPoints },
        },
      })

      // Create credit log
      await prisma.creditLog.create({
        data: {
          userId: token.id as string,
          type: "CUSTOMER_REWARD",
          amount: coupon.customerRewardPoints,
          balance: 0, // Will be updated by trigger or manually
          description: `Reward for redeeming: ${coupon.title}`,
        },
      })
    }

    return successResponse({
      redemption: {
        id: redemption.id,
        couponCode: coupon.code,
        discount: `${coupon.discountType === "PERCENTAGE" ? coupon.discountValue + "%" : "$" + coupon.discountValue}`,
        rewardPoints: coupon.customerRewardPoints,
      },
      message: "Coupon redeemed successfully!",
    })
  } catch (error) {
    console.error("Coupon redemption error:", error)
    return errorResponse("Failed to redeem coupon", 500)
  }
}
