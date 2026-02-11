import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, createPaginatedResponse, errorResponse } from "@/lib/api-utils"
import { CouponStatus } from "@prisma/client"
import { prepareSearchQuery, createSearchText, normalizeArabic, containsArabic } from "@/lib/search-utils"

// GET /api/public/coupons - Public coupon listing with search and filters
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = getPaginationParams(request)
    const { searchParams } = new URL(request.url)
    
    // Build filters
    const where: any = {
      status: CouponStatus.ACTIVE,
      isActive: true,
      isApproved: true,
    }
    
    // Check expiry
    where.OR = [
      { expiryDate: null },
      { expiryDate: { gte: new Date() } },
    ]
    
    // Search query
    const searchQuery = searchParams.get("q")
    if (searchQuery) {
      const normalizedQuery = containsArabic(searchQuery) 
        ? normalizeArabic(searchQuery) 
        : searchQuery.toLowerCase()
      
      where.OR = [
        { title: { contains: normalizedQuery, mode: "insensitive" } },
        { description: { contains: normalizedQuery, mode: "insensitive" } },
        { code: { contains: normalizedQuery, mode: "insensitive" } },
      ]
    }
    
    // Category filter
    if (searchParams.get("category")) {
      where.categoryId = searchParams.get("category")
    }
    
    // Location filters
    if (searchParams.get("country")) {
      where.OR = [
        { isGlobal: true },
        { countries: { has: searchParams.get("country") } },
      ]
    }
    
    if (searchParams.get("city")) {
      where.OR = [
        { isGlobal: true },
        { cities: { has: searchParams.get("city") } },
      ]
    }
    
    if (searchParams.get("district")) {
      where.OR = [
        { isGlobal: true },
        { districts: { has: searchParams.get("district") } },
      ]
    }
    
    // Discount type filter
    if (searchParams.get("discountType")) {
      where.discountType = searchParams.get("discountType")
    }
    
    // Discount range filter
    if (searchParams.get("minDiscount")) {
      where.discountValue = { gte: parseFloat(searchParams.get("minDiscount")!) }
    }
    
    if (searchParams.get("maxDiscount")) {
      where.discountValue = {
        ...where.discountValue,
        lte: parseFloat(searchParams.get("maxDiscount")!),
      }
    }
    
    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    
    const orderBy: any = {}
    switch (sortBy) {
      case "popular":
        orderBy.views = sortOrder
        break
      case "discount":
        orderBy.discountValue = sortOrder
        break
      case "newest":
        orderBy.createdAt = sortOrder
        break
      case "redemptions":
        orderBy.usesCount = sortOrder
        break
      default:
        orderBy.createdAt = sortOrder
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.coupon.count({ where }),
    ])

    return createPaginatedResponse(coupons, total, page, pageSize)
  } catch (error) {
    console.error("Error fetching public coupons:", error)
    return errorResponse("Failed to fetch coupons", 500)
  }
}
