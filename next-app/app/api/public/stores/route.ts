import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, createPaginatedResponse, errorResponse } from "@/lib/api-utils"
import { normalizeArabic, containsArabic } from "@/lib/search-utils"

// GET /api/public/stores - Public store listing with search and filters
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = getPaginationParams(request)
    const { searchParams } = new URL(request.url)
    
    // Build filters
    const where: any = {
      isActive: true,
      isVerified: true,
    }
    
    // Search query
    const searchQuery = searchParams.get("q")
    if (searchQuery) {
      const normalizedQuery = containsArabic(searchQuery) 
        ? normalizeArabic(searchQuery) 
        : searchQuery.toLowerCase()
      
      where.OR = [
        { name: { contains: normalizedQuery, mode: "insensitive" } },
        { description: { contains: normalizedQuery, mode: "insensitive" } },
      ]
    }
    
    // Category filter
    if (searchParams.get("category")) {
      where.categoryId = searchParams.get("category")
    }
    
    // Location filters
    if (searchParams.get("country")) {
      where.country = searchParams.get("country")
    }
    
    if (searchParams.get("city")) {
      where.city = searchParams.get("city")
    }
    
    if (searchParams.get("district")) {
      where.district = searchParams.get("district")
    }
    
    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    
    const orderBy: any = {}
    switch (sortBy) {
      case "name":
        orderBy.name = sortOrder
        break
      case "newest":
        orderBy.createdAt = sortOrder
        break
      default:
        orderBy.createdAt = sortOrder
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
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
    console.error("Error fetching public stores:", error)
    return errorResponse("Failed to fetch stores", 500)
  }
}
