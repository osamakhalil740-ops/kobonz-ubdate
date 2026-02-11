import { Queue, Worker, QueueEvents } from "bullmq"
import { Redis } from "ioredis"
import { prisma } from "./prisma"
import { redis as upstashRedis } from "./redis"
import { AnalyticsPeriod } from "@prisma/client"

/**
 * Phase 6: BullMQ Queue Setup
 * Background job processing for analytics aggregation
 */

// ============================================
// REDIS CONNECTION (separate from Upstash)
// ============================================

// BullMQ requires standard Redis (ioredis), not Upstash REST API
// This uses the standard Redis connection for queue processing
const redisConnection = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })
  : null // Optional: Queue is disabled if REDIS_URL not provided

// ============================================
// QUEUE DEFINITIONS
// ============================================

export const queues = {
  analytics: redisConnection
    ? new Queue("analytics-aggregation", {
        connection: redisConnection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
          },
          removeOnFail: {
            count: 50, // Keep last 50 failed jobs
          },
        },
      })
    : null,

  notifications: redisConnection
    ? new Queue("email-notifications", {
        connection: redisConnection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: {
            count: 50,
          },
          removeOnFail: {
            count: 50,
          },
        },
      })
    : null,
}

// ============================================
// QUEUE HELPERS
// ============================================

export const queueHelpers = {
  /**
   * Schedule hourly analytics aggregation
   */
  async scheduleHourlyAggregation() {
    if (!queues.analytics) {
      console.warn("Analytics queue not initialized (REDIS_URL not set)")
      return
    }

    await queues.analytics.add(
      "aggregate-hourly",
      { period: "hourly" },
      {
        repeat: {
          pattern: "0 * * * *", // Every hour at minute 0
        },
        jobId: "hourly-aggregation",
      }
    )
  },

  /**
   * Schedule daily analytics aggregation
   */
  async scheduleDailyAggregation() {
    if (!queues.analytics) return

    await queues.analytics.add(
      "aggregate-daily",
      { period: "daily" },
      {
        repeat: {
          pattern: "0 0 * * *", // Every day at midnight
        },
        jobId: "daily-aggregation",
      }
    )
  },

  /**
   * Schedule weekly analytics aggregation
   */
  async scheduleWeeklyAggregation() {
    if (!queues.analytics) return

    await queues.analytics.add(
      "aggregate-weekly",
      { period: "weekly" },
      {
        repeat: {
          pattern: "0 0 * * 0", // Every Sunday at midnight
        },
        jobId: "weekly-aggregation",
      }
    )
  },

  /**
   * Schedule monthly analytics aggregation
   */
  async scheduleMonthlyAggregation() {
    if (!queues.analytics) return

    await queues.analytics.add(
      "aggregate-monthly",
      { period: "monthly" },
      {
        repeat: {
          pattern: "0 0 1 * *", // First day of month at midnight
        },
        jobId: "monthly-aggregation",
      }
    )
  },

  /**
   * Queue email notification
   */
  async queueEmail(data: {
    to: string
    subject: string
    template: string
    variables: Record<string, any>
  }) {
    if (!queues.notifications) {
      console.warn("Notification queue not initialized (REDIS_URL not set)")
      return
    }

    await queues.notifications.add("send-email", data)
  },

  /**
   * Get queue stats
   */
  async getQueueStats(queueName: "analytics" | "notifications") {
    const queue = queues[queueName]
    if (!queue) return null

    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ])

    return { waiting, active, completed, failed }
  },
}

// ============================================
// WORKER PROCESSORS
// ============================================

/**
 * Analytics aggregation worker
 */
export function createAnalyticsWorker() {
  if (!redisConnection) {
    console.warn("Analytics worker not started (REDIS_URL not set)")
    return null
  }

  const worker = new Worker(
    "analytics-aggregation",
    async (job) => {
      const { period } = job.data

      console.log(`[Analytics Worker] Starting ${period} aggregation`)

      // Get time range based on period
      const { start, end } = getTimeRange(period)

      // Aggregate coupon analytics
      await aggregateCouponAnalytics(period, start, end)

      // Aggregate store analytics
      await aggregateStoreAnalytics(period, start, end)

      // Aggregate affiliate analytics
      await aggregateAffiliateAnalytics(period, start, end)

      console.log(`[Analytics Worker] Completed ${period} aggregation`)

      return { success: true, period, start, end }
    },
    {
      connection: redisConnection,
      concurrency: 1, // Process one job at a time
    }
  )

  worker.on("completed", (job) => {
    console.log(`[Analytics Worker] Job ${job.id} completed`)
  })

  worker.on("failed", (job, err) => {
    console.error(`[Analytics Worker] Job ${job?.id} failed:`, err)
  })

  return worker
}

/**
 * Email notification worker
 */
export function createEmailWorker() {
  if (!redisConnection) {
    console.warn("Email worker not started (REDIS_URL not set)")
    return null
  }

  const worker = new Worker(
    "email-notifications",
    async (job) => {
      const { to, subject, template, variables } = job.data

      console.log(`[Email Worker] Sending email to ${to}`)

      // Import email service dynamically to avoid circular dependencies
      const { sendTemplateEmail } = await import("./email-templates")

      await sendTemplateEmail({ to, subject, template, variables })

      return { success: true, to }
    },
    {
      connection: redisConnection,
      concurrency: 5, // Process 5 emails concurrently
    }
  )

  worker.on("completed", (job) => {
    console.log(`[Email Worker] Email sent to ${job.returnvalue.to}`)
  })

  worker.on("failed", (job, err) => {
    console.error(`[Email Worker] Failed to send email:`, err)
  })

  return worker
}

// ============================================
// AGGREGATION FUNCTIONS
// ============================================

async function aggregateCouponAnalytics(
  period: AnalyticsPeriod,
  start: Date,
  end: Date
) {
  // Get all active coupons
  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      userId: true,
    },
  })

  for (const coupon of coupons) {
    // Get analytics from Redis
    const viewsKey = `analytics:coupon:${coupon.id}:views`
    const clicksKey = `analytics:coupon:${coupon.id}:clicks`
    const copiesKey = `analytics:coupon:${coupon.id}:copies`

    const [views, clicks, copies] = await Promise.all([
      upstashRedis.get(viewsKey),
      upstashRedis.get(clicksKey),
      upstashRedis.get(copiesKey),
    ])

    // Get redemptions from database
    const redemptions = await prisma.redemption.count({
      where: {
        couponId: coupon.id,
        redeemedAt: {
          gte: start,
          lte: end,
        },
      },
    })

    // Store in database (upsert to handle re-runs)
    await prisma.analyticsSummary.upsert({
      where: {
        resourceType_resourceId_period_periodStart: {
          resourceType: "coupon",
          resourceId: coupon.id,
          period,
          periodStart: start,
        },
      },
      create: {
        resourceType: "coupon",
        resourceId: coupon.id,
        userId: coupon.userId,
        period,
        periodStart: start,
        periodEnd: end,
        views: Number(views) || 0,
        clicks: Number(clicks) || 0,
        copies: Number(copies) || 0,
        redemptions,
      },
      update: {
        views: Number(views) || 0,
        clicks: Number(clicks) || 0,
        copies: Number(copies) || 0,
        redemptions,
        updatedAt: new Date(),
      },
    })
  }
}

async function aggregateStoreAnalytics(
  period: AnalyticsPeriod,
  start: Date,
  end: Date
) {
  const stores = await prisma.store.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      userId: true,
    },
  })

  for (const store of stores) {
    const viewsKey = `analytics:store:${store.id}:views`
    const clicksKey = `analytics:store:${store.id}:clicks`

    const [views, clicks] = await Promise.all([
      upstashRedis.get(viewsKey),
      upstashRedis.get(clicksKey),
    ])

    await prisma.analyticsSummary.upsert({
      where: {
        resourceType_resourceId_period_periodStart: {
          resourceType: "store",
          resourceId: store.id,
          period,
          periodStart: start,
        },
      },
      create: {
        resourceType: "store",
        resourceId: store.id,
        userId: store.userId,
        period,
        periodStart: start,
        periodEnd: end,
        views: Number(views) || 0,
        clicks: Number(clicks) || 0,
      },
      update: {
        views: Number(views) || 0,
        clicks: Number(clicks) || 0,
        updatedAt: new Date(),
      },
    })
  }
}

async function aggregateAffiliateAnalytics(
  period: AnalyticsPeriod,
  start: Date,
  end: Date
) {
  const affiliateLinks = await prisma.affiliateLink.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      affiliateId: true,
    },
  })

  for (const link of affiliateLinks) {
    const viewsKey = `analytics:affiliate:${link.id}:views`
    const clicksKey = `analytics:affiliate:${link.id}:clicks`

    const [views, clicks] = await Promise.all([
      upstashRedis.get(viewsKey),
      upstashRedis.get(clicksKey),
    ])

    const conversions = await prisma.redemption.count({
      where: {
        affiliateLinkId: link.id,
        redeemedAt: {
          gte: start,
          lte: end,
        },
      },
    })

    await prisma.analyticsSummary.upsert({
      where: {
        resourceType_resourceId_period_periodStart: {
          resourceType: "affiliate_link",
          resourceId: link.id,
          period,
          periodStart: start,
        },
      },
      create: {
        resourceType: "affiliate_link",
        resourceId: link.id,
        userId: link.affiliateId,
        period,
        periodStart: start,
        periodEnd: end,
        views: Number(views) || 0,
        clicks: Number(clicks) || 0,
        conversions,
      },
      update: {
        views: Number(views) || 0,
        clicks: Number(clicks) || 0,
        conversions,
        updatedAt: new Date(),
      },
    })
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getTimeRange(period: string): { start: Date; end: Date } {
  const now = new Date()
  const end = new Date(now)

  let start: Date

  switch (period) {
    case "hourly":
      start = new Date(now.getTime() - 60 * 60 * 1000)
      break
    case "daily":
      start = new Date(now)
      start.setDate(start.getDate() - 1)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)
      break
    case "weekly":
      start = new Date(now)
      start.setDate(start.getDate() - 7)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)
      break
    case "monthly":
      start = new Date(now)
      start.setMonth(start.getMonth() - 1)
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setDate(1)
      end.setHours(0, 0, 0, 0)
      break
    default:
      start = new Date(now.getTime() - 60 * 60 * 1000)
  }

  return { start, end }
}

// ============================================
// QUEUE INITIALIZATION
// ============================================

/**
 * Initialize all queues and workers
 * Call this in your server startup (e.g., in a separate worker process)
 */
export async function initializeQueues() {
  if (!redisConnection) {
    console.warn("Queues not initialized: REDIS_URL environment variable not set")
    console.warn("Analytics aggregation will be disabled. This is optional for development.")
    return null
  }

  console.log("Initializing BullMQ queues...")

  // Schedule recurring jobs
  await queueHelpers.scheduleHourlyAggregation()
  await queueHelpers.scheduleDailyAggregation()
  await queueHelpers.scheduleWeeklyAggregation()
  await queueHelpers.scheduleMonthlyAggregation()

  // Start workers (in production, run this in a separate process)
  const analyticsWorker = createAnalyticsWorker()
  const emailWorker = createEmailWorker()

  console.log("✅ BullMQ queues initialized")

  return { analyticsWorker, emailWorker }
}

/**
 * Graceful shutdown
 */
export async function shutdownQueues() {
  if (queues.analytics) await queues.analytics.close()
  if (queues.notifications) await queues.notifications.close()
  if (redisConnection) await redisConnection.quit()
  
  console.log("✅ BullMQ queues shut down gracefully")
}
