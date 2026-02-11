import { NextRequest, NextResponse } from "next/server"
import { rateLimit, getRateLimitIdentifier, getClientIp, RateLimits } from "@/lib/rate-limit"

/**
 * Phase 7: Rate Limit Middleware
 * Apply rate limiting to specific routes
 */

export async function rateLimitMiddleware(
  request: NextRequest,
  config = RateLimits.read
): Promise<NextResponse | null> {
  const ip = getClientIp(request.headers)
  const identifier = getRateLimitIdentifier(ip, undefined, request.nextUrl.pathname)

  const result = await rateLimit(identifier, config)

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Please try again later",
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toString(),
        },
      }
    )
  }

  // Add rate limit headers to response
  const response = NextResponse.next()
  response.headers.set("X-RateLimit-Limit", result.limit.toString())
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString())
  response.headers.set("X-RateLimit-Reset", result.reset.toString())

  return null // Allow request to proceed
}
