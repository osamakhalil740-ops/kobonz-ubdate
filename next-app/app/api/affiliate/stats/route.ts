import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, errorResponse, successResponse } from "@/lib/api-utils"
import { calculateCTR, calculateConversionRate, calculateEPC } from "@/lib/affiliate-utils"

// GET /api/affiliate/stats - Get affiliate statistics
export async function GET(request: NextRequest) {
  const auth = await checkApiAuth(request, "affiliates:read")
  if (!auth.authorized) return auth.error

  try {
    // Get user with affiliate balances
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        affiliateBalance: true,
        affiliatePending: true,
        affiliateTotalEarned: true,
      },
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    // Get total clicks and conversions from all links
    const linkStats = await prisma.affiliateLink.aggregate({
      where: { affiliateId: auth.userId },
      _sum: {
        clicks: true,
        conversions: true,
      },
      _count: true,
    })

    const totalClicks = linkStats._sum.clicks || 0
    const totalConversions = linkStats._sum.conversions || 0
    const totalLinks = linkStats._count || 0

    // Get earnings breakdown
    const [pendingEarnings, availableEarnings, paidEarnings] = await Promise.all([
      prisma.affiliateEarning.aggregate({
        where: {
          affiliateId: auth.userId,
          status: "PENDING",
        },
        _sum: { commission: true },
        _count: true,
      }),
      prisma.affiliateEarning.aggregate({
        where: {
          affiliateId: auth.userId,
          status: "AVAILABLE",
        },
        _sum: { commission: true },
        _count: true,
      }),
      prisma.affiliateEarning.aggregate({
        where: {
          affiliateId: auth.userId,
          status: "PAID",
        },
        _sum: { commission: true },
        _count: true,
      }),
    ])

    // Calculate metrics
    const conversionRate = calculateConversionRate(totalConversions, totalClicks)
    const epc = calculateEPC(user.affiliateTotalEarned, totalClicks)

    // Get recent earnings
    const recentEarnings = await prisma.affiliateEarning.findMany({
      where: { affiliateId: auth.userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        coupon: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Get top performing links
    const topLinks = await prisma.affiliateLink.findMany({
      where: { affiliateId: auth.userId },
      take: 5,
      orderBy: { conversions: "desc" },
      include: {
        coupon: {
          select: {
            id: true,
            title: true,
            affiliateCommission: true,
          },
        },
      },
    })

    return successResponse({
      overview: {
        balance: user.affiliateBalance,
        pending: user.affiliatePending,
        totalEarned: user.affiliateTotalEarned,
        totalLinks,
        totalClicks,
        totalConversions,
        conversionRate,
        epc,
      },
      earnings: {
        pending: {
          amount: pendingEarnings._sum.commission || 0,
          count: pendingEarnings._count,
        },
        available: {
          amount: availableEarnings._sum.commission || 0,
          count: availableEarnings._count,
        },
        paid: {
          amount: paidEarnings._sum.commission || 0,
          count: paidEarnings._count,
        },
      },
      recentEarnings,
      topLinks,
    })
  } catch (error) {
    console.error("Error fetching affiliate stats:", error)
    return errorResponse("Failed to fetch affiliate statistics", 500)
  }
}
