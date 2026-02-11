"use client"

import { useEffect, useRef } from "react"

/**
 * Phase 6: Analytics Tracker Component
 * Automatically tracks views for coupons and stores
 */

interface AnalyticsTrackerProps {
  type: "coupon" | "store"
  resourceId: string
  trackView?: boolean
  children?: React.ReactNode
}

export function AnalyticsTracker({
  type,
  resourceId,
  trackView = true,
  children,
}: AnalyticsTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (!trackView || tracked.current) return

    // Track view on mount
    trackAnalytics("view")
    tracked.current = true
  }, [type, resourceId, trackView])

  async function trackAnalytics(action: "view" | "click" | "copy") {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          resourceId,
          action,
        }),
      })
    } catch (error) {
      // Fail silently - analytics shouldn't break UX
      console.debug("Analytics tracking failed:", error)
    }
  }

  return <>{children}</>
}

/**
 * Hook for manual tracking
 */
export function useAnalyticsTracker(type: "coupon" | "store", resourceId: string) {
  async function trackClick() {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          resourceId,
          action: "click",
        }),
      })
    } catch (error) {
      console.debug("Analytics tracking failed:", error)
    }
  }

  async function trackCopy() {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          resourceId,
          action: "copy",
        }),
      })
    } catch (error) {
      console.debug("Analytics tracking failed:", error)
    }
  }

  return { trackClick, trackCopy }
}
