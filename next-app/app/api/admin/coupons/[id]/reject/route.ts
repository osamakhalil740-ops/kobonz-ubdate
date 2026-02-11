import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, errorResponse, successResponse } from "@/lib/api-utils"
import { CouponStatus } from "@prisma/client"

// PATCH /api/admin/coupons/[id]/reject - Reject a coupon
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

    const updatedCoupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        status: CouponStatus.REJECTED,
        isApproved: false,
        isActive: false,
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

    return successResponse(updatedCoupon, "Coupon rejected successfully")
  } catch (error) {
    console.error("Error rejecting coupon:", error)
    return errorResponse("Failed to reject coupon", 500)
  }
}
