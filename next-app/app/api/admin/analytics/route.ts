import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, errorResponse, successResponse } from "@/lib/api-utils"

// GET /api/admin/analytics - Get platform analytics
export async function GET(request: NextRequest) {
  const auth = await checkApiAuth(request, "analytics:read")
  if (!auth.authorized) return auth.error

  try {
    // Get counts
    const [
      totalUsers,
      totalStores,
      totalCoupons,
      totalRedemptions,
      pendingStores,
      pendingCoupons,
      activeUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.coupon.count(),
      prisma.redemption.count(),
      prisma.store.count({ where: { isVerified: false } }),
      prisma.coupon.count({ where: { status: "PENDING" } }),
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ])

    // Get recent activity
    const recentCoupons = await prisma.coupon.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        category: {
          select: { name: true },
        },
      },
    })

    const recentStores = await prisma.store.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: { name: true, email: true },
        },
        category: {
          select: { name: true },
        },
      },
    })

    // Top categories
    const topCategories = await prisma.category.findMany({
      take: 5,
      include: {
        _count: {
          select: {
            coupons: true,
            stores: true,
          },
        },
      },
      orderBy: {
        coupons: {
          _count: "desc",
        },
      },
    })

    // User role distribution
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        id: true,
      },
    })

    return successResponse({
      overview: {
        totalUsers,
        totalStores,
        totalCoupons,
        totalRedemptions,
        pendingStores,
        pendingCoupons,
        activeUsers,
      },
      recentActivity: {
        coupons: recentCoupons,
        stores: recentStores,
      },
      topCategories,
      usersByRole: usersByRole.map(r => ({
        role: r.role,
        count: r._count.id,
      })),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return errorResponse("Failed to fetch analytics", 500)
  }
}
