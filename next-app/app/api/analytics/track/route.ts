import { NextRequest, NextResponse } from "next/server"
import { analyticsService } from "@/lib/analytics"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Phase 6: Analytics Tracking API
 * POST /api/analytics/track
 */

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const { type, resourceId, action } = body

    if (!type || !resourceId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: type, resourceId, action" },
        { status: 400 }
      )
    }

    const userId = session?.user?.id

    // Track based on type and action
    switch (type) {
      case "coupon":
        if (action === "view") {
          await analyticsService.trackCouponView(resourceId, userId)
        } else if (action === "click") {
          await analyticsService.trackCouponClick(resourceId, userId)
        } else if (action === "copy") {
          await analyticsService.trackCouponCopy(resourceId, userId)
        }
        break

      case "store":
        if (action === "view") {
          await analyticsService.trackStoreView(resourceId, userId)
        } else if (action === "click") {
          await analyticsService.trackStoreClick(resourceId, userId)
        }
        break

      case "affiliate":
        if (action === "view") {
          const { affiliateId } = body
          if (!affiliateId) {
            return NextResponse.json(
              { error: "Missing affiliateId for affiliate tracking" },
              { status: 400 }
            )
          }
          await analyticsService.trackAffiliateLinkView(resourceId, affiliateId)
        } else if (action === "click") {
          const { affiliateId } = body
          if (!affiliateId) {
            return NextResponse.json(
              { error: "Missing affiliateId for affiliate tracking" },
              { status: 400 }
            )
          }
          await analyticsService.trackAffiliateLinkClick(resourceId, affiliateId)
        }
        break

      default:
        return NextResponse.json(
          { error: `Invalid type: ${type}` },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json(
      { error: "Failed to track analytics" },
      { status: 500 }
    )
  }
}
