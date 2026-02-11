import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { Role } from "@prisma/client"
import { hasPermission, Permission } from "./permissions"

/**
 * Get pagination parameters from URL
 */
export function getPaginationParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "20")
  
  return {
    page: Math.max(1, page),
    pageSize: Math.min(100, Math.max(1, pageSize)),
    skip: (Math.max(1, page) - 1) * Math.min(100, Math.max(1, pageSize)),
  }
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}

/**
 * Check API authorization
 */
export async function checkApiAuth(
  request: NextRequest,
  requiredPermission?: Permission
) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token || !token.id) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    }
  }

  const userRole = token.role as Role

  // Check if user is active
  if (token.isActive === false) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: "Account is inactive" },
        { status: 403 }
      ),
    }
  }

  // Check if user is banned
  if (token.bannedUntil && new Date(token.bannedUntil as string) > new Date()) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: "Account is banned" },
        { status: 403 }
      ),
    }
  }

  // Check permission if required
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      ),
    }
  }

  return {
    authorized: true,
    userId: token.id as string,
    userRole,
    token,
  }
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    ...(message && { message }),
    data,
  })
}
