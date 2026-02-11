import { NextRequest, NextResponse } from "next/server"
import { analyticsService } from "@/lib/analytics"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Phase 6: Get Coupon Analytics
 * GET /api/analytics/coupon/[id]
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const couponId = params.id

    // Get coupon to verify ownership
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
      select: { 
        id: true, 
        userId: true, 
        title: true,
        views: true,
        clicks: true,
      },
    })

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      )
    }

    // Check authorization (owner, admin, or public basic stats)
    const isOwner = session?.user?.id === coupon.userId
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"

    if (!isOwner && !isAdmin) {
      // Public users get limited stats
      return NextResponse.json({
        id: coupon.id,
        title: coupon.title,
        views: coupon.views || 0,
      })
    }

    // Get real-time analytics from Redis
    const analytics = await analyticsService.getCouponAnalytics(couponId)

    // Get hourly breakdown (last 24 hours)
    const searchParams = request.nextUrl.searchParams
    const includeHourly = searchParams.get("includeHourly") === "true"
    
    let hourlyData = null
    if (includeHourly) {
      hourlyData = await analyticsService.getCouponAnalyticsHourly(couponId, 24)
    }

    // Get aggregated data from database
    const summaries = await prisma.analyticsSummary.findMany({
      where: {
        resourceType: "coupon",
        resourceId: couponId,
      },
      orderBy: {
        periodStart: "desc",
      },
      take: 30, // Last 30 periods
    })

    return NextResponse.json({
      realtime: analytics,
      hourly: hourlyData,
      summaries,
    })
  } catch (error) {
    console.error("Get coupon analytics error:", error)
    return NextResponse.json(
      { error: "Failed to get analytics" },
      { status: 500 }
    )
  }
}
