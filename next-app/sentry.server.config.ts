import * as Sentry from "@sentry/nextjs"

/**
 * Phase 9: Sentry Server Configuration
 * Error tracking and performance monitoring for server-side
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Integrations
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Prisma({ client: undefined }), // Will auto-detect Prisma client
  ],

  // Before send hook
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === "development") {
      console.error("Sentry event (dev):", event)
      return null
    }

    // Add server context
    if (event.request) {
      event.request.url = event.request.url?.replace(/\?.*$/, "") // Remove query params
    }

    return event
  },

  // Ignore specific transactions
  ignoreTransactions: [
    // Health checks
    "/api/health",
    // Static assets
    "/_next/static/*",
    "/favicon.ico",
  ],
})

// Helper to capture errors with context
export function captureServerError(
  error: Error,
  context?: {
    userId?: string
    endpoint?: string
    method?: string
    [key: string]: any
  }
) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("request", context)
      if (context.userId) {
        scope.setUser({ id: context.userId })
      }
    }
    Sentry.captureException(error)
  })
}
