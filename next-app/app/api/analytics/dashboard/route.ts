import { NextRequest, NextResponse } from "next/server"
import { analyticsService } from "@/lib/analytics"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Phase 6: Dashboard Analytics
 * GET /api/analytics/dashboard
 */

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const role = session.user.role

    // Get global stats (admin only)
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      const globalStats = await analyticsService.getGlobalAnalytics()

      // Get platform-wide summaries
      const platformSummaries = await prisma.analyticsSummary.findMany({
        where: {
          period: "DAILY",
          periodStart: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        orderBy: {
          periodStart: "desc",
        },
      })

      // Aggregate by day
      const dailyStats = platformSummaries.reduce((acc, summary) => {
        const date = summary.periodStart.toISOString().split("T")[0]
        if (!acc[date]) {
          acc[date] = {
            date,
            views: 0,
            clicks: 0,
            redemptions: 0,
            conversions: 0,
          }
        }
        acc[date].views += summary.views || 0
        acc[date].clicks += summary.clicks || 0
        acc[date].redemptions += summary.redemptions || 0
        acc[date].conversions += summary.conversions || 0
        return acc
      }, {} as Record<string, any>)

      return NextResponse.json({
        global: globalStats,
        daily: Object.values(dailyStats),
      })
    }

    // Store owner stats
    if (role === "STORE_OWNER") {
      // Get user's coupons
      const coupons = await prisma.coupon.findMany({
        where: {
          userId,
          isActive: true,
        },
        select: { id: true, title: true },
      })

      const couponIds = coupons.map(c => c.id)

      // Get analytics for all coupons
      const analytics = await analyticsService.getMultipleCouponsAnalytics(couponIds)

      // Get summaries
      const summaries = await prisma.analyticsSummary.findMany({
        where: {
          resourceType: "coupon",
          resourceId: { in: couponIds },
          period: "DAILY",
          periodStart: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          periodStart: "desc",
        },
      })

      return NextResponse.json({
        coupons: coupons.map(coupon => ({
          ...coupon,
          analytics: analytics[coupon.id],
        })),
        summaries,
      })
    }

    // Affiliate stats
    if (role === "AFFILIATE") {
      const affiliateLinks = await prisma.affiliateLink.findMany({
        where: {
          affiliateId: userId,
          isActive: true,
        },
        select: { 
          id: true, 
          trackingCode: true,
          coupon: {
            select: { title: true },
          },
        },
      })

      const linkAnalytics = await Promise.all(
        affiliateLinks.map(async (link) => ({
          ...link,
          analytics: await analyticsService.getAffiliateLinkAnalytics(link.id),
        }))
      )

      return NextResponse.json({
        links: linkAnalytics,
      })
    }

    // Regular user - recent activity
    const recentActivity = await analyticsService.getUserRecentActivity(userId, 20)

    return NextResponse.json({
      recentActivity,
    })
  } catch (error) {
    console.error("Dashboard analytics error:", error)
    return NextResponse.json(
      { error: "Failed to get dashboard analytics" },
      { status: 500 }
    )
  }
}
