import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"

// GET /api/public/stores/[id] - Get single store (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            description: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        coupons: {
          where: {
            status: "ACTIVE",
            isActive: true,
            isApproved: true,
            OR: [
              { expiryDate: null },
              { expiryDate: { gte: new Date() } },
            ],
          },
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            coupons: true,
          },
        },
      },
    })

    if (!store) {
      return errorResponse("Store not found", 404)
    }

    // Check if store is active and verified
    if (!store.isActive || !store.isVerified) {
      return errorResponse("Store is not available", 404)
    }

    return successResponse(store)
  } catch (error) {
    console.error("Error fetching store:", error)
    return errorResponse("Failed to fetch store", 500)
  }
}
