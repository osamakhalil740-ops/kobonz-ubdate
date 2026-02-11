import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"

// GET /api/public/coupons/[id] - Get single coupon (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            description: true,
            logo: true,
            coverImage: true,
            country: true,
            city: true,
            district: true,
            addressLine1: true,
            phone: true,
            email: true,
            website: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            description: true,
          },
        },
        user: {
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
    })

    if (!coupon) {
      return errorResponse("Coupon not found", 404)
    }

    // Check if coupon is active and approved
    if (coupon.status !== "ACTIVE" || !coupon.isActive || !coupon.isApproved) {
      return errorResponse("Coupon is not available", 404)
    }

    // Check if expired
    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return errorResponse("Coupon has expired", 404)
    }

    // Increment view count
    await prisma.coupon.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    return successResponse(coupon)
  } catch (error) {
    console.error("Error fetching coupon:", error)
    return errorResponse("Failed to fetch coupon", 500)
  }
}
