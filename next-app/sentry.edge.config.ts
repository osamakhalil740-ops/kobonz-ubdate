import * as Sentry from "@sentry/nextjs"

/**
 * Phase 9: Sentry Edge Configuration
 * Error tracking for Edge Runtime (middleware, edge functions)
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  debug: false,
})
