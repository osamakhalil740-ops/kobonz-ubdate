import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, getPaginationParams, createPaginatedResponse, errorResponse } from "@/lib/api-utils"
import { CouponStatus } from "@prisma/client"

// GET /api/admin/coupons - List all coupons with pagination
export async function GET(request: NextRequest) {
  const auth = await checkApiAuth(request, "coupons:read")
  if (!auth.authorized) return auth.error

  try {
    const { page, pageSize, skip } = getPaginationParams(request)
    const { searchParams } = new URL(request.url)
    
    // Build filters
    const where: any = {}
    
    if (searchParams.get("status")) {
      where.status = searchParams.get("status") as CouponStatus
    }
    
    if (searchParams.get("approved") !== null) {
      where.isApproved = searchParams.get("approved") === "true"
    }
    
    if (searchParams.get("search")) {
      where.OR = [
        { title: { contains: searchParams.get("search")!, mode: "insensitive" } },
        { description: { contains: searchParams.get("search")!, mode: "insensitive" } },
        { code: { contains: searchParams.get("search")!, mode: "insensitive" } },
      ]
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              redemptions: true,
            },
          },
        },
      }),
      prisma.coupon.count({ where }),
    ])

    return createPaginatedResponse(coupons, total, page, pageSize)
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return errorResponse("Failed to fetch coupons", 500)
  }
}
