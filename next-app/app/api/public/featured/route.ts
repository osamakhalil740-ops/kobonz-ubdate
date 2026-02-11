import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"

export const dynamic = 'force-dynamic'

// GET /api/public/featured - Get featured coupons for homepage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "12")

    // Get featured coupons (most viewed, recent, active)
    const featuredCoupons = await prisma.coupon.findMany({
      where: {
        status: "ACTIVE",
        isActive: true,
        isApproved: true,
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: new Date() } },
        ],
      },
      take: limit,
      orderBy: [
        { views: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
    })

    // Get popular categories
    const popularCategories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      take: 8,
      orderBy: {
        coupons: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: {
            coupons: {
              where: {
                status: "ACTIVE",
                isActive: true,
                isApproved: true,
              },
            },
          },
        },
      },
    })

    // Get statistics
    const [totalCoupons, totalStores, totalRedemptions] = await Promise.all([
      prisma.coupon.count({
        where: {
          status: "ACTIVE",
          isActive: true,
          isApproved: true,
        },
      }),
      prisma.store.count({
        where: {
          isActive: true,
          isVerified: true,
        },
      }),
      prisma.redemption.count(),
    ])

    return successResponse({
      featuredCoupons,
      popularCategories,
      stats: {
        totalCoupons,
        totalStores,
        totalRedemptions,
      },
    })
  } catch (error) {
    console.error("Error fetching featured content:", error)
    return errorResponse("Failed to fetch featured content", 500)
  }
}

