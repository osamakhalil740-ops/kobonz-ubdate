"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

/**
 * Phase 7: GDPR Cookie Consent Banner
 * Compliant with EU GDPR regulations
 */

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const CONSENT_KEY = "kobonz-cookie-consent"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      // Show banner after short delay for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    savePreferences(allAccepted)
    setShowBanner(false)
  }

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    savePreferences(necessaryOnly)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs))
    
    // Trigger analytics initialization if accepted
    if (prefs.analytics && typeof window !== "undefined") {
      // Initialize analytics (e.g., Google Analytics)
      // window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    }
    
    // Trigger marketing if accepted
    if (prefs.marketing && typeof window !== "undefined") {
      // Initialize marketing tools
      // window.gtag?.('consent', 'update', { ad_storage: 'granted' })
    }
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <Card className="mx-auto max-w-4xl border-2 bg-background p-6 shadow-2xl">
        {!showSettings ? (
          <>
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">🍪 Cookie Consent</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, serve personalized
                content, and analyze our traffic. By clicking "Accept All", you consent
                to our use of cookies.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 text-xs">
                <Link
                  href="/privacy"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/cookies"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Cookie Policy
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  Customize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptNecessary}
                >
                  Necessary Only
                </Button>
                <Button size="sm" onClick={handleAcceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">Cookie Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Customize your cookie preferences below.
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                <div className="flex-1">
                  <h4 className="font-medium">Necessary Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Essential for the website to function properly. These cannot be
                    disabled.
                  </p>
                </div>
                <div className="flex h-6 items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="h-4 w-4 cursor-not-allowed opacity-50"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                <div className="flex-1">
                  <h4 className="font-medium">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website by
                    collecting anonymous information.
                  </p>
                </div>
                <div className="flex h-6 items-center">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    className="h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                <div className="flex-1">
                  <h4 className="font-medium">Marketing Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Used to track visitors across websites to display relevant
                    advertisements.
                  </p>
                </div>
                <div className="flex h-6 items-center">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, marketing: e.target.checked })
                    }
                    className="h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Back
              </Button>
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

/**
 * Hook to check if consent has been given
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved) {
      setConsent(JSON.parse(saved))
    }
  }, [])

  return consent
}
