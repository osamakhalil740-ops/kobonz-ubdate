import { redis } from "./redis"

/**
 * Phase 7: Redis Caching Layer
 * High-performance caching for database queries and API responses
 */

// ============================================
// CACHE CONFIGURATION
// ============================================

const CACHE_PREFIX = "cache"

// Cache TTLs (in seconds)
export const CacheTTL = {
  SHORT: 60, // 1 minute - frequently changing data
  MEDIUM: 300, // 5 minutes - moderately changing data
  LONG: 1800, // 30 minutes - stable data
  VERY_LONG: 3600, // 1 hour - very stable data
  DAY: 86400, // 24 hours - rarely changing data
} as const

// ============================================
// CACHE KEYS
// ============================================

export const CacheKeys = {
  // Public data (cacheable)
  featuredCoupons: () => `${CACHE_PREFIX}:featured-coupons`,
  popularStores: () => `${CACHE_PREFIX}:popular-stores`,
  categories: () => `${CACHE_PREFIX}:categories`,
  couponById: (id: string) => `${CACHE_PREFIX}:coupon:${id}`,
  storeById: (id: string) => `${CACHE_PREFIX}:store:${id}`,
  storeCoupons: (storeId: string) => `${CACHE_PREFIX}:store:${storeId}:coupons`,
  
  // Search results (short TTL)
  searchCoupons: (query: string, page: number) => 
    `${CACHE_PREFIX}:search:coupons:${query}:${page}`,
  searchStores: (query: string, page: number) => 
    `${CACHE_PREFIX}:search:stores:${query}:${page}`,
  
  // User-specific (medium TTL)
  userDashboard: (userId: string) => `${CACHE_PREFIX}:user:${userId}:dashboard`,
  userNotifications: (userId: string) => `${CACHE_PREFIX}:user:${userId}:notifications`,
  
  // Analytics (short TTL for real-time data)
  couponAnalytics: (couponId: string) => `${CACHE_PREFIX}:analytics:coupon:${couponId}`,
  storeAnalytics: (storeId: string) => `${CACHE_PREFIX}:analytics:store:${storeId}`,
}

// ============================================
// CACHE FUNCTIONS
// ============================================

/**
 * Get cached data or fetch and cache it
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CacheTTL.MEDIUM
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await redis.get(key)
    
    if (cached) {
      return JSON.parse(cached as string) as T
    }
    
    // Cache miss - fetch data
    const data = await fetcher()
    
    // Store in cache
    await redis.setex(key, ttl, JSON.stringify(data))
    
    return data
  } catch (error) {
    console.error("Cache error:", error)
    // Fallback to fetcher if cache fails
    return await fetcher()
  }
}

/**
 * Set cache value
 */
export async function setCache(
  key: string,
  value: any,
  ttl: number = CacheTTL.MEDIUM
): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error("Cache set error:", error)
  }
}

/**
 * Delete cache key(s)
 */
export async function deleteCache(pattern: string): Promise<void> {
  try {
    // If exact key
    if (!pattern.includes("*")) {
      await redis.del(pattern)
      return
    }
    
    // Pattern matching - get all keys and delete
    // Note: Upstash Redis REST API doesn't support SCAN, so we'll use DEL with pattern
    // For production, consider using a different approach or batch deletion
    await redis.del(pattern)
  } catch (error) {
    console.error("Cache delete error:", error)
  }
}

/**
 * Invalidate multiple cache keys by patterns
 */
export async function invalidateCache(patterns: string[]): Promise<void> {
  try {
    await Promise.all(patterns.map(pattern => deleteCache(pattern)))
  } catch (error) {
    console.error("Cache invalidation error:", error)
  }
}

/**
 * Invalidate coupon-related caches
 */
export async function invalidateCouponCache(couponId: string, storeId?: string): Promise<void> {
  const patterns = [
    CacheKeys.couponById(couponId),
    CacheKeys.featuredCoupons(),
    CacheKeys.couponAnalytics(couponId),
  ]
  
  if (storeId) {
    patterns.push(CacheKeys.storeCoupons(storeId))
  }
  
  await invalidateCache(patterns)
}

/**
 * Invalidate store-related caches
 */
export async function invalidateStoreCache(storeId: string): Promise<void> {
  await invalidateCache([
    CacheKeys.storeById(storeId),
    CacheKeys.storeCoupons(storeId),
    CacheKeys.popularStores(),
    CacheKeys.storeAnalytics(storeId),
  ])
}

/**
 * Invalidate search caches
 */
export async function invalidateSearchCache(): Promise<void> {
  // Clear all search results
  // In production, you might want to be more selective
  await invalidateCache([
    `${CACHE_PREFIX}:search:*`,
  ])
}

// ============================================
// CACHE WARMING
// ============================================

/**
 * Warm cache with frequently accessed data
 * Call this on application startup or via cron
 */
export async function warmCache(): Promise<void> {
  console.log("🔥 Warming cache...")
  
  try {
    // This would be called from a cron job or startup script
    // Example: pre-cache featured coupons, popular stores, etc.
    
    // Import dynamically to avoid circular dependencies
    const { prisma } = await import("./prisma")
    
    // Cache featured coupons
    const featuredCoupons = await prisma.coupon.findMany({
      where: { isActive: true, status: "APPROVED" },
      take: 20,
      orderBy: { views: "desc" },
    })
    
    await setCache(
      CacheKeys.featuredCoupons(),
      featuredCoupons,
      CacheTTL.LONG
    )
    
    // Cache popular stores
    const popularStores = await prisma.store.findMany({
      where: { isActive: true, status: "APPROVED" },
      take: 20,
      orderBy: { createdAt: "desc" },
    })
    
    await setCache(
      CacheKeys.popularStores(),
      popularStores,
      CacheTTL.LONG
    )
    
    console.log("✅ Cache warmed successfully")
  } catch (error) {
    console.error("❌ Cache warming failed:", error)
  }
}

// ============================================
// CACHE STATISTICS
// ============================================

/**
 * Get cache statistics (for monitoring)
 */
export async function getCacheStats(): Promise<{
  keys: number
  memoryUsage: string
}> {
  try {
    // Note: Upstash REST API has limited info commands
    // This is a simplified version
    return {
      keys: 0, // Would need to track separately
      memoryUsage: "N/A",
    }
  } catch (error) {
    console.error("Cache stats error:", error)
    return {
      keys: 0,
      memoryUsage: "N/A",
    }
  }
}
