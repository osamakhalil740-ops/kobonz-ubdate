import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, getPaginationParams, createPaginatedResponse, errorResponse } from "@/lib/api-utils"

// GET /api/admin/stores - List all stores with pagination
export async function GET(request: NextRequest) {
  const auth = await checkApiAuth(request, "stores:read")
  if (!auth.authorized) return auth.error

  try {
    const { page, pageSize, skip } = getPaginationParams(request)
    const { searchParams } = new URL(request.url)
    
    // Build filters
    const where: any = {}
    
    if (searchParams.get("verified") !== null) {
      where.isVerified = searchParams.get("verified") === "true"
    }
    
    if (searchParams.get("active") !== null) {
      where.isActive = searchParams.get("active") === "true"
    }
    
    if (searchParams.get("search")) {
      where.OR = [
        { name: { contains: searchParams.get("search")!, mode: "insensitive" } },
        { email: { contains: searchParams.get("search")!, mode: "insensitive" } },
      ]
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
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
              coupons: true,
            },
          },
        },
      }),
      prisma.store.count({ where }),
    ])

    return createPaginatedResponse(stores, total, page, pageSize)
  } catch (error) {
    console.error("Error fetching stores:", error)
    return errorResponse("Failed to fetch stores", 500)
  }
}
