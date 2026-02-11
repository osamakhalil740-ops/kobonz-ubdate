import * as Sentry from "@sentry/nextjs"

/**
 * Phase 9: Sentry Client Configuration
 * Error tracking and performance monitoring for client-side
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Replay sampling
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0, // 10% in production

  // Integrations
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
    new Sentry.BrowserTracing({
      // Set sampling rate for performance monitoring
      tracePropagationTargets: [
        "localhost",
        /^https:\/\/.*\.kobonz\.com/,
      ],
    }),
  ],

  // Filter out known errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    // Random plugins/extensions
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    // Facebook borked
    "fb_xd_fragment",
    // ISP "optimizing" proxy
    "bmi_SafeAddOnload",
    "EBCallBackMessageReceived",
    // Chrome extensions
    "chrome-extension://",
    "moz-extension://",
    // Network errors
    "Network request failed",
    "Failed to fetch",
    // ResizeObserver loop limit exceeded (not critical)
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
  ],

  // Before send hook - filter/modify events
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === "development") {
      console.error("Sentry event (dev):", event)
      return null
    }

    // Filter out specific errors
    if (event.exception) {
      const error = hint.originalException
      if (error && typeof error === "object" && "message" in error) {
        // Don't send network errors to Sentry
        if (
          error.message.includes("fetch") ||
          error.message.includes("network")
        ) {
          return null
        }
      }
    }

    return event
  },

  // Enrich events with user context
  beforeBreadcrumb(breadcrumb) {
    // Filter out console breadcrumbs in production
    if (
      breadcrumb.category === "console" &&
      process.env.NODE_ENV === "production"
    ) {
      return null
    }
    return breadcrumb
  },
})

// Set user context when available
export function setSentryUser(user: {
  id: string
  email?: string
  username?: string
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  })
}

// Clear user context on logout
export function clearSentryUser() {
  Sentry.setUser(null)
}
