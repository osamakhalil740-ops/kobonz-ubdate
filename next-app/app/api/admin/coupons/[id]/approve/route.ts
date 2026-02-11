import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, errorResponse, successResponse } from "@/lib/api-utils"
import { CouponStatus } from "@prisma/client"

// PATCH /api/admin/coupons/[id]/approve - Approve a coupon
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await checkApiAuth(request, "coupons:approve")
  if (!auth.authorized) return auth.error

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
    })

    if (!coupon) {
      return errorResponse("Coupon not found", 404)
    }

    // Check if already approved
    if (coupon.status === CouponStatus.APPROVED || coupon.status === CouponStatus.ACTIVE) {
      return errorResponse("Coupon is already approved", 400)
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        status: CouponStatus.ACTIVE,
        isApproved: true,
        isActive: true,
      },
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
        category: true,
      },
    })

    return successResponse(updatedCoupon, "Coupon approved successfully")
  } catch (error) {
    console.error("Error approving coupon:", error)
    return errorResponse("Failed to approve coupon", 500)
  }
}
