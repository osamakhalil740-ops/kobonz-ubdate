import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, errorResponse, successResponse } from "@/lib/api-utils"

// GET /api/store/coupons/[id] - Get single coupon
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await checkApiAuth(request, "coupons:read")
  if (!auth.authorized) return auth.error

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        store: true,
        category: true,
        _count: {
          select: {
            redemptions: true,
          },
        },
      },
    })

    if (!coupon) {
      return errorResponse("Coupon not found", 404)
    }

    // Check ownership
    if (coupon.userId !== auth.userId && auth.userRole !== "ADMIN" && auth.userRole !== "SUPER_ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    return successResponse(coupon)
  } catch (error) {
    console.error("Error fetching coupon:", error)
    return errorResponse("Failed to fetch coupon", 500)
  }
}

// PATCH /api/store/coupons/[id] - Update coupon
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await checkApiAuth(request, "coupons:update")
  if (!auth.authorized) return auth.error

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
    })

    if (!coupon) {
      return errorResponse("Coupon not found", 404)
    }

    // Check ownership
    if (coupon.userId !== auth.userId && auth.userRole !== "ADMIN" && auth.userRole !== "SUPER_ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    const body = await request.json()
    
    const updatedCoupon = await prisma.coupon.update({
      where: { id: params.id },
      data: body,
      include: {
        store: true,
        category: true,
      },
    })

    return successResponse(updatedCoupon, "Coupon updated successfully")
  } catch (error) {
    console.error("Error updating coupon:", error)
    return errorResponse("Failed to update coupon", 500)
  }
}

// DELETE /api/store/coupons/[id] - Delete coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await checkApiAuth(request, "coupons:delete")
  if (!auth.authorized) return auth.error

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
    })

    if (!coupon) {
      return errorResponse("Coupon not found", 404)
    }

    // Check ownership
    if (coupon.userId !== auth.userId && auth.userRole !== "ADMIN" && auth.userRole !== "SUPER_ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    await prisma.coupon.delete({
      where: { id: params.id },
    })

    return successResponse(null, "Coupon deleted successfully")
  } catch (error) {
    console.error("Error deleting coupon:", error)
    return errorResponse("Failed to delete coupon", 500)
  }
}
