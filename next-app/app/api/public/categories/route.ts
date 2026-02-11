import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"

// GET /api/public/categories - Get all active categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
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
            stores: {
              where: {
                isActive: true,
                isVerified: true,
              },
            },
          },
        },
      },
    })

    return successResponse(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return errorResponse("Failed to fetch categories", 500)
  }
}
