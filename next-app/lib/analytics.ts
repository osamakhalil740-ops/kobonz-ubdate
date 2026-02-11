import { redis } from "./redis"

/**
 * Phase 6: Analytics Service
 * Redis-based real-time analytics tracking
 */

// ============================================
// REDIS KEY NAMESPACES (isolated from existing keys)
// ============================================

const ANALYTICS_PREFIX = "analytics"

// Key generators
const keys = {
  // Real-time counters
  couponViews: (couponId: string) => `${ANALYTICS_PREFIX}:coupon:${couponId}:views`,
  couponClicks: (couponId: string) => `${ANALYTICS_PREFIX}:coupon:${couponId}:clicks`,
  couponCopies: (couponId: string) => `${ANALYTICS_PREFIX}:coupon:${couponId}:copies`,
  
  storeViews: (storeId: string) => `${ANALYTICS_PREFIX}:store:${storeId}:views`,
  storeClicks: (storeId: string) => `${ANALYTICS_PREFIX}:store:${storeId}:clicks`,
  
  affiliateViews: (linkId: string) => `${ANALYTICS_PREFIX}:affiliate:${linkId}:views`,
  affiliateClicks: (linkId: string) => `${ANALYTICS_PREFIX}:affiliate:${linkId}:clicks`,
  
  // Time-series data (hourly buckets)
  couponViewsHourly: (couponId: string, timestamp: string) => 
    `${ANALYTICS_PREFIX}:coupon:${couponId}:views:hourly:${timestamp}`,
  couponClicksHourly: (couponId: string, timestamp: string) => 
    `${ANALYTICS_PREFIX}:coupon:${couponId}:clicks:hourly:${timestamp}`,
  
  // User activity tracking
  userActivity: (userId: string) => `${ANALYTICS_PREFIX}:user:${userId}:activity`,
  
  // Global stats
  globalViews: () => `${ANALYTICS_PREFIX}:global:views`,
  globalClicks: () => `${ANALYTICS_PREFIX}:global:clicks`,
  globalRedemptions: () => `${ANALYTICS_PREFIX}:global:redemptions`,
}

// ============================================
// ANALYTICS TRACKING FUNCTIONS
// ============================================

export const analyticsService = {
  /**
   * Track coupon view
   */
  async trackCouponView(couponId: string, userId?: string) {
    const timestamp = getHourlyBucket()
    const pipeline = redis.pipeline()
    
    // Increment counters
    pipeline.incr(keys.couponViews(couponId))
    pipeline.incr(keys.couponViewsHourly(couponId, timestamp))
    pipeline.incr(keys.globalViews())
    
    // Set TTL on hourly bucket (30 days)
    pipeline.expire(keys.couponViewsHourly(couponId, timestamp), 30 * 24 * 60 * 60)
    
    // Track user activity if authenticated
    if (userId) {
      pipeline.zadd(keys.userActivity(userId), {
        score: Date.now(),
        member: `view:coupon:${couponId}`,
      })
    }
    
    await pipeline.exec()
  },

  /**
   * Track coupon click (redirect to merchant)
   */
  async trackCouponClick(couponId: string, userId?: string) {
    const timestamp = getHourlyBucket()
    const pipeline = redis.pipeline()
    
    pipeline.incr(keys.couponClicks(couponId))
    pipeline.incr(keys.couponClicksHourly(couponId, timestamp))
    pipeline.incr(keys.globalClicks())
    
    pipeline.expire(keys.couponClicksHourly(couponId, timestamp), 30 * 24 * 60 * 60)
    
    if (userId) {
      pipeline.zadd(keys.userActivity(userId), {
        score: Date.now(),
        member: `click:coupon:${couponId}`,
      })
    }
    
    await pipeline.exec()
  },

  /**
   * Track coupon code copy
   */
  async trackCouponCopy(couponId: string, userId?: string) {
    const pipeline = redis.pipeline()
    
    pipeline.incr(keys.couponCopies(couponId))
    
    if (userId) {
      pipeline.zadd(keys.userActivity(userId), {
        score: Date.now(),
        member: `copy:coupon:${couponId}`,
      })
    }
    
    await pipeline.exec()
  },

  /**
   * Track store view
   */
  async trackStoreView(storeId: string, userId?: string) {
    const pipeline = redis.pipeline()
    
    pipeline.incr(keys.storeViews(storeId))
    pipeline.incr(keys.globalViews())
    
    if (userId) {
      pipeline.zadd(keys.userActivity(userId), {
        score: Date.now(),
        member: `view:store:${storeId}`,
      })
    }
    
    await pipeline.exec()
  },

  /**
   * Track store click
   */
  async trackStoreClick(storeId: string, userId?: string) {
    const pipeline = redis.pipeline()
    
    pipeline.incr(keys.storeClicks(storeId))
    pipeline.incr(keys.globalClicks())
    
    if (userId) {
      pipeline.zadd(keys.userActivity(userId), {
        score: Date.now(),
        member: `click:store:${storeId}`,
      })
    }
    
    await pipeline.exec()
  },

  /**
   * Track affiliate link view
   */
  async trackAffiliateLinkView(linkId: string, affiliateId: string) {
    const pipeline = redis.pipeline()
    
    pipeline.incr(keys.affiliateViews(linkId))
    pipeline.zadd(keys.userActivity(affiliateId), {
      score: Date.now(),
      member: `affiliate:view:${linkId}`,
    })
    
    await pipeline.exec()
  },

  /**
   * Track affiliate link click
   */
  async trackAffiliateLinkClick(linkId: string, affiliateId: string) {
    const pipeline = redis.pipeline()
    
    pipeline.incr(keys.affiliateClicks(linkId))
    pipeline.zadd(keys.userActivity(affiliateId), {
      score: Date.now(),
      member: `affiliate:click:${linkId}`,
    })
    
    await pipeline.exec()
  },

  /**
   * Track redemption (called after successful redemption)
   */
  async trackRedemption(couponId: string, userId?: string) {
    const pipeline = redis.pipeline()
    
    pipeline.incr(keys.globalRedemptions())
    
    if (userId) {
      pipeline.zadd(keys.userActivity(userId), {
        score: Date.now(),
        member: `redeem:coupon:${couponId}`,
      })
    }
    
    await pipeline.exec()
  },

  // ============================================
  // ANALYTICS RETRIEVAL
  // ============================================

  /**
   * Get coupon analytics
   */
  async getCouponAnalytics(couponId: string) {
    const [views, clicks, copies] = await Promise.all([
      redis.get(keys.couponViews(couponId)),
      redis.get(keys.couponClicks(couponId)),
      redis.get(keys.couponCopies(couponId)),
    ])

    return {
      views: Number(views) || 0,
      clicks: Number(clicks) || 0,
      copies: Number(copies) || 0,
      clickThroughRate: Number(views) > 0 ? (Number(clicks) / Number(views)) * 100 : 0,
      copyRate: Number(views) > 0 ? (Number(copies) / Number(views)) * 100 : 0,
    }
  },

  /**
   * Get coupon analytics for time range
   */
  async getCouponAnalyticsHourly(couponId: string, hours: number = 24) {
    const now = new Date()
    const hourlyData: Array<{ timestamp: string; views: number; clicks: number }> = []

    for (let i = 0; i < hours; i++) {
      const hourDate = new Date(now.getTime() - i * 60 * 60 * 1000)
      const timestamp = getHourlyBucket(hourDate)

      const [views, clicks] = await Promise.all([
        redis.get(keys.couponViewsHourly(couponId, timestamp)),
        redis.get(keys.couponClicksHourly(couponId, timestamp)),
      ])

      hourlyData.unshift({
        timestamp,
        views: Number(views) || 0,
        clicks: Number(clicks) || 0,
      })
    }

    return hourlyData
  },

  /**
   * Get store analytics
   */
  async getStoreAnalytics(storeId: string) {
    const [views, clicks] = await Promise.all([
      redis.get(keys.storeViews(storeId)),
      redis.get(keys.storeClicks(storeId)),
    ])

    return {
      views: Number(views) || 0,
      clicks: Number(clicks) || 0,
      clickThroughRate: Number(views) > 0 ? (Number(clicks) / Number(views)) * 100 : 0,
    }
  },

  /**
   * Get affiliate link analytics
   */
  async getAffiliateLinkAnalytics(linkId: string) {
    const [views, clicks] = await Promise.all([
      redis.get(keys.affiliateViews(linkId)),
      redis.get(keys.affiliateClicks(linkId)),
    ])

    return {
      views: Number(views) || 0,
      clicks: Number(clicks) || 0,
      clickThroughRate: Number(views) > 0 ? (Number(clicks) / Number(views)) * 100 : 0,
    }
  },

  /**
   * Get global platform analytics
   */
  async getGlobalAnalytics() {
    const [views, clicks, redemptions] = await Promise.all([
      redis.get(keys.globalViews()),
      redis.get(keys.globalClicks()),
      redis.get(keys.globalRedemptions()),
    ])

    return {
      totalViews: Number(views) || 0,
      totalClicks: Number(clicks) || 0,
      totalRedemptions: Number(redemptions) || 0,
    }
  },

  /**
   * Get user recent activity
   */
  async getUserRecentActivity(userId: string, limit: number = 20) {
    const activities = await redis.zrange(keys.userActivity(userId), -limit, -1, {
      rev: true,
      withScores: true,
    })

    return activities.map((item: any, index: number) => {
      if (index % 2 === 0) {
        const [action, type, id] = item.split(":")
        return {
          action,
          type,
          id,
          timestamp: activities[index + 1] as number,
        }
      }
      return null
    }).filter(Boolean)
  },

  // ============================================
  // BATCH OPERATIONS
  // ============================================

  /**
   * Get multiple coupons analytics (for dashboard)
   */
  async getMultipleCouponsAnalytics(couponIds: string[]) {
    const results = await Promise.all(
      couponIds.map(id => this.getCouponAnalytics(id))
    )

    return couponIds.reduce((acc, id, index) => {
      acc[id] = results[index]
      return acc
    }, {} as Record<string, any>)
  },

  /**
   * Reset analytics for a resource (admin only)
   */
  async resetAnalytics(type: "coupon" | "store" | "affiliate", resourceId: string) {
    const keysToDelete: string[] = []

    if (type === "coupon") {
      keysToDelete.push(
        keys.couponViews(resourceId),
        keys.couponClicks(resourceId),
        keys.couponCopies(resourceId)
      )
    } else if (type === "store") {
      keysToDelete.push(
        keys.storeViews(resourceId),
        keys.storeClicks(resourceId)
      )
    } else if (type === "affiliate") {
      keysToDelete.push(
        keys.affiliateViews(resourceId),
        keys.affiliateClicks(resourceId)
      )
    }

    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete)
    }
  },
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get hourly bucket timestamp (YYYY-MM-DD-HH format)
 */
function getHourlyBucket(date: Date = new Date()): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hour = String(date.getUTCHours()).padStart(2, "0")
  return `${year}-${month}-${day}-${hour}`
}

/**
 * Get daily bucket timestamp (YYYY-MM-DD format)
 */
function getDailyBucket(date: Date = new Date()): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
