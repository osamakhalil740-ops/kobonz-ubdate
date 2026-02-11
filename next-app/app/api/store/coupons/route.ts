import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, getPaginationParams, createPaginatedResponse, errorResponse, successResponse } from "@/lib/api-utils"
import { CouponStatus } from "@prisma/client"

// GET /api/store/coupons - Get store owner's coupons
export async function GET(request: NextRequest) {
  const auth = await checkApiAuth(request, "coupons:read")
  if (!auth.authorized) return auth.error

  try {
    const { page, pageSize, skip } = getPaginationParams(request)
    const { searchParams } = new URL(request.url)
    
    const where: any = {
      userId: auth.userId,
    }
    
    if (searchParams.get("status")) {
      where.status = searchParams.get("status") as CouponStatus
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
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

// POST /api/store/coupons - Create new coupon
export async function POST(request: NextRequest) {
  const auth = await checkApiAuth(request, "coupons:create")
  if (!auth.authorized) return auth.error

  try {
    const body = await request.json()
    
    const coupon = await prisma.coupon.create({
      data: {
        ...body,
        userId: auth.userId,
        status: CouponStatus.PENDING,
        isApproved: false,
        usesLeft: body.maxUses,
      },
      include: {
        store: true,
        category: true,
      },
    })

    return successResponse(coupon, "Coupon created successfully")
  } catch (error) {
    console.error("Error creating coupon:", error)
    return errorResponse("Failed to create coupon", 500)
  }
}
