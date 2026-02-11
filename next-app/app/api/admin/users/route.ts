import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, getPaginationParams, createPaginatedResponse, errorResponse } from "@/lib/api-utils"

// GET /api/admin/users - List all users with pagination
export async function GET(request: NextRequest) {
  const auth = await checkApiAuth(request, "users:read")
  if (!auth.authorized) return auth.error

  try {
    const { page, pageSize, skip } = getPaginationParams(request)
    const { searchParams } = new URL(request.url)
    
    // Build filters
    const where: any = {}
    
    if (searchParams.get("role")) {
      where.role = searchParams.get("role")
    }
    
    if (searchParams.get("active") !== null) {
      where.isActive = searchParams.get("active") === "true"
    }
    
    if (searchParams.get("verified") !== null) {
      where.isVerified = searchParams.get("verified") === "true"
    }
    
    if (searchParams.get("search")) {
      where.OR = [
        { name: { contains: searchParams.get("search")!, mode: "insensitive" } },
        { email: { contains: searchParams.get("search")!, mode: "insensitive" } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          isVerified: true,
          credits: true,
          createdAt: true,
          lastLoginAt: true,
          bannedUntil: true,
          _count: {
            select: {
              stores: true,
              coupons: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return createPaginatedResponse(users, total, page, pageSize)
  } catch (error) {
    console.error("Error fetching users:", error)
    return errorResponse("Failed to fetch users", 500)
  }
}
