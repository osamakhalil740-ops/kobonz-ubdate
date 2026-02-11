import { redis } from "./redis"

/**
 * Phase 7: Rate Limiting
 * Protect API routes from abuse with Redis-based rate limiting
 */

export interface RateLimitConfig {
  interval: number // Time window in seconds
  uniqueTokenPerInterval: number // Max requests per interval
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// ============================================
// RATE LIMIT CONFIGURATIONS
// ============================================

export const RateLimits = {
  // Very strict - authentication endpoints
  auth: {
    interval: 60 * 15, // 15 minutes
    uniqueTokenPerInterval: 5, // 5 attempts per 15 min
  },
  
  // Strict - write operations
  write: {
    interval: 60, // 1 minute
    uniqueTokenPerInterval: 10, // 10 requests per minute
  },
  
  // Moderate - read operations
  read: {
    interval: 60, // 1 minute
    uniqueTokenPerInterval: 60, // 60 requests per minute
  },
  
  // Generous - public endpoints
  public: {
    interval: 60, // 1 minute
    uniqueTokenPerInterval: 100, // 100 requests per minute
  },
  
  // Analytics tracking (very generous)
  analytics: {
    interval: 60, // 1 minute
    uniqueTokenPerInterval: 200, // 200 requests per minute
  },
} as const

// ============================================
// RATE LIMITER
// ============================================

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = RateLimits.read
): Promise<RateLimitResult> {
  const key = `rate-limit:${identifier}`
  const now = Date.now()
  const windowStart = now - config.interval * 1000

  try {
    // Clean up old entries and count requests in window
    const pipeline = redis.pipeline()
    
    // Remove entries older than the window
    pipeline.zremrangebyscore(key, 0, windowStart)
    
    // Count remaining entries
    pipeline.zcard(key)
    
    // Add current request
    pipeline.zadd(key, { score: now, member: now.toString() })
    
    // Set expiry on the key
    pipeline.expire(key, config.interval)
    
    const results = await pipeline.exec()
    
    // Extract count (second command result)
    const count = (results?.[1] as number) || 0
    
    const remaining = Math.max(0, config.uniqueTokenPerInterval - count - 1)
    const reset = now + config.interval * 1000

    if (count >= config.uniqueTokenPerInterval) {
      return {
        success: false,
        limit: config.uniqueTokenPerInterval,
        remaining: 0,
        reset,
      }
    }

    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining,
      reset,
    }
  } catch (error) {
    console.error("Rate limit error:", error)
    // Fail open - allow request if Redis fails
    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval,
      reset: now + config.interval * 1000,
    }
  }
}

// ============================================
// RATE LIMIT HELPERS
// ============================================

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(
  ip: string | null,
  userId?: string,
  endpoint?: string
): string {
  // Prefer userId for authenticated requests
  if (userId) {
    return `user:${userId}${endpoint ? `:${endpoint}` : ""}`
  }
  
  // Fall back to IP for anonymous requests
  const identifier = ip || "anonymous"
  return `ip:${identifier}${endpoint ? `:${endpoint}` : ""}`
}

/**
 * Get client IP from request headers
 */
export function getClientIp(headers: Headers): string | null {
  // Check common headers for client IP (in priority order)
  const forwardedFor = headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  
  const realIp = headers.get("x-real-ip")
  if (realIp) {
    return realIp
  }
  
  const cfConnectingIp = headers.get("cf-connecting-ip") // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp
  }
  
  return null
}

/**
 * Apply rate limit and return response if exceeded
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RateLimits.read
): Promise<{ allowed: true } | { allowed: false; response: Response }> {
  const result = await rateLimit(identifier, config)

  if (!result.success) {
    return {
      allowed: false,
      response: new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "Please try again later",
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": result.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.reset.toString(),
          },
        }
      ),
    }
  }

  return { allowed: true }
}

// ============================================
// RATE LIMIT MIDDLEWARE HELPER
// ============================================

/**
 * Create a rate-limited API route handler
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  config: RateLimitConfig = RateLimits.read,
  getIdentifier?: (request: Request) => string
) {
  return async (request: Request): Promise<Response> => {
    // Get identifier
    const identifier =
      getIdentifier?.(request) ||
      getRateLimitIdentifier(getClientIp(request.headers))

    // Check rate limit
    const check = await checkRateLimit(identifier, config)

    if (!check.allowed) {
      return check.response
    }

    // Add rate limit headers to response
    const result = await rateLimit(identifier, config)
    const response = await handler(request)

    response.headers.set("X-RateLimit-Limit", result.limit.toString())
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString())
    response.headers.set("X-RateLimit-Reset", result.reset.toString())

    return response
  }
}
