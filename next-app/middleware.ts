import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { Role } from "@prisma/client"

// Define protected routes and their required roles
const protectedRoutes: Record<string, Role[]> = {
  "/dashboard": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER, Role.AFFILIATE, Role.MARKETER, Role.USER],
  "/admin": [Role.SUPER_ADMIN, Role.ADMIN],
  "/super-admin": [Role.SUPER_ADMIN],
  "/store": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER],
  "/affiliate": [Role.SUPER_ADMIN, Role.ADMIN, Role.AFFILIATE],
  "/marketer": [Role.SUPER_ADMIN, Role.ADMIN, Role.MARKETER],
}

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/error",
  "/api/auth",
  "/marketplace",
  "/coupons",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get token from request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // No token - redirect to login
  if (!token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Check if user is banned
  if (token.bannedUntil && new Date(token.bannedUntil as string) > new Date()) {
    return NextResponse.redirect(new URL("/auth/banned", request.url))
  }

  // Check if user is active
  if (token.isActive === false) {
    return NextResponse.redirect(new URL("/auth/inactive", request.url))
  }

  // Check role-based access for protected routes
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      const userRole = token.role as Role
      
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        return NextResponse.redirect(new URL(getDashboardForRole(userRole), request.url))
      }
    }
  }

  // Phase 7: Enhanced Security Headers
  const response = NextResponse.next()
  
  // Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "SAMEORIGIN") // Changed from DENY to allow iframe on same origin
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-DNS-Prefetch-Control", "on")
  
  // HTTPS enforcement in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }
  
  // Content Security Policy (CSP)
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-inline/eval
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'self'",
    ].join("; ")
  )
  
  // Add user info to headers for API routes
  if (pathname.startsWith("/api/")) {
    response.headers.set("X-User-Id", token.id as string)
    response.headers.set("X-User-Role", token.role as string)
  }

  return response
}

/**
 * Get appropriate dashboard URL based on user role
 */
function getDashboardForRole(role: Role): string {
  switch (role) {
    case Role.SUPER_ADMIN:
      return "/super-admin"
    case Role.ADMIN:
      return "/admin"
    case Role.STORE_OWNER:
      return "/store/dashboard"
    case Role.AFFILIATE:
      return "/affiliate/dashboard"
    case Role.MARKETER:
      return "/marketer/dashboard"
    case Role.USER:
    default:
      return "/dashboard"
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
