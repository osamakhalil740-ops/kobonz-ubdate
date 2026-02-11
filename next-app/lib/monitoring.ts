/**
 * Phase 7: Performance Monitoring & Error Tracking
 * Client and server-side monitoring utilities
 */

// ============================================
// PERFORMANCE MONITORING
// ============================================

export interface PerformanceMetric {
  name: string
  value: number
  unit: "ms" | "bytes" | "count"
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 100 // Keep last 100 metrics

  /**
   * Record a performance metric
   */
  record(name: string, value: number, unit: "ms" | "bytes" | "count" = "ms") {
    this.metrics.push({
      name,
      value,
      unit,
      timestamp: Date.now(),
    })

    // Trim old metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }
  }

  /**
   * Measure async function execution time
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now()
    try {
      const result = await fn()
      const duration = Date.now() - start
      this.record(name, duration, "ms")
      return result
    } catch (error) {
      const duration = Date.now() - start
      this.record(`${name} (failed)`, duration, "ms")
      throw error
    }
  }

  /**
   * Get metrics summary
   */
  getSummary() {
    const grouped = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = {
          name: metric.name,
          count: 0,
          total: 0,
          min: Infinity,
          max: -Infinity,
          avg: 0,
          unit: metric.unit,
        }
      }

      const group = acc[metric.name]
      group.count++
      group.total += metric.value
      group.min = Math.min(group.min, metric.value)
      group.max = Math.max(group.max, metric.value)
      group.avg = group.total / group.count

      return acc
    }, {} as Record<string, any>)

    return Object.values(grouped)
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = []
  }
}

export const performanceMonitor = new PerformanceMonitor()

// ============================================
// ERROR TRACKING
// ============================================

export interface ErrorLog {
  message: string
  stack?: string
  context?: Record<string, any>
  timestamp: number
  severity: "low" | "medium" | "high" | "critical"
}

class ErrorTracker {
  private errors: ErrorLog[] = []
  private maxErrors = 50 // Keep last 50 errors

  /**
   * Log an error
   */
  log(
    error: Error | string,
    severity: ErrorLog["severity"] = "medium",
    context?: Record<string, any>
  ) {
    const errorLog: ErrorLog = {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: Date.now(),
      severity,
    }

    this.errors.push(errorLog)

    // Trim old errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Console log based on severity
    if (severity === "critical" || severity === "high") {
      console.error("🔴", errorLog)
    } else if (severity === "medium") {
      console.warn("🟡", errorLog)
    } else {
      console.log("🟢", errorLog)
    }

    // In production, send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === "production" && severity !== "low") {
      this.sendToErrorService(errorLog)
    }
  }

  /**
   * Send error to external service
   */
  private sendToErrorService(errorLog: ErrorLog) {
    // Implement integration with Sentry, LogRocket, etc.
    // Example:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(new Error(errorLog.message), {
    //     level: errorLog.severity,
    //     extra: errorLog.context,
    //   })
    // }
  }

  /**
   * Get recent errors
   */
  getErrors() {
    return this.errors
  }

  /**
   * Clear all errors
   */
  clear() {
    this.errors = []
  }
}

export const errorTracker = new ErrorTracker()

// ============================================
// CLIENT-SIDE MONITORING
// ============================================

/**
 * Monitor Web Vitals (Core Web Vitals)
 */
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("📊 Web Vital:", metric)
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // Example: Send to Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // })
  }

  // Record in performance monitor
  performanceMonitor.record(metric.name, metric.value, "ms")
}

/**
 * Monitor API calls
 */
export async function monitoredFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const start = Date.now()
  const endpoint = new URL(url, window.location.origin).pathname

  try {
    const response = await fetch(url, options)
    const duration = Date.now() - start

    performanceMonitor.record(`API: ${endpoint}`, duration, "ms")

    if (!response.ok) {
      errorTracker.log(
        `API Error: ${endpoint} - ${response.status}`,
        response.status >= 500 ? "high" : "medium",
        { url, status: response.status }
      )
    }

    return response
  } catch (error) {
    const duration = Date.now() - start
    performanceMonitor.record(`API: ${endpoint} (failed)`, duration, "ms")

    errorTracker.log(
      error instanceof Error ? error : new Error(String(error)),
      "high",
      { url }
    )

    throw error
  }
}

// ============================================
// SERVER-SIDE MONITORING
// ============================================

/**
 * Log request performance
 */
export function logRequestPerformance(
  method: string,
  path: string,
  duration: number,
  status: number
) {
  const severity = status >= 500 ? "high" : status >= 400 ? "medium" : "low"

  console.log(`[${method}] ${path} - ${status} (${duration}ms)`)

  if (severity !== "low") {
    errorTracker.log(`HTTP ${status}: ${method} ${path}`, severity, {
      method,
      path,
      duration,
      status,
    })
  }
}

/**
 * Wrap API handler with monitoring
 */
export function withMonitoring(
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    const start = Date.now()
    const url = new URL(request.url)

    try {
      const response = await handler(request)
      const duration = Date.now() - start

      logRequestPerformance(
        request.method,
        url.pathname,
        duration,
        response.status
      )

      return response
    } catch (error) {
      const duration = Date.now() - start

      errorTracker.log(
        error instanceof Error ? error : new Error(String(error)),
        "critical",
        {
          method: request.method,
          path: url.pathname,
          duration,
        }
      )

      throw error
    }
  }
}

// ============================================
// HEALTH CHECK
// ============================================

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  timestamp: number
  checks: {
    database: boolean
    redis: boolean
    external: boolean
  }
  metrics: {
    uptime: number
    memory: {
      used: number
      total: number
      percentage: number
    }
  }
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const checks = {
    database: true, // Check database connection
    redis: true, // Check Redis connection
    external: true, // Check external services
  }

  // Determine overall status
  const allHealthy = Object.values(checks).every((v) => v)
  const someHealthy = Object.values(checks).some((v) => v)

  const status = allHealthy
    ? "healthy"
    : someHealthy
    ? "degraded"
    : "unhealthy"

  // Memory usage (Node.js only)
  const memoryUsage = process.memoryUsage()
  const totalMemory = memoryUsage.heapTotal
  const usedMemory = memoryUsage.heapUsed

  return {
    status,
    timestamp: Date.now(),
    checks,
    metrics: {
      uptime: process.uptime(),
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: (usedMemory / totalMemory) * 100,
      },
    },
  }
}
