"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Download, Trash2 } from "lucide-react"

/**
 * Phase 7: GDPR Data Management
 * Allows users to export and delete their data
 */

export function DataDeletion() {
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleExportData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/export-data", {
        method: "POST",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `kobonz-data-export-${new Date().toISOString()}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert("Failed to export data. Please try again.")
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
      })

      if (response.ok) {
        // Redirect to goodbye page or home
        window.location.href = "/auth/account-deleted"
      } else {
        alert("Failed to delete account. Please contact support.")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Export Data */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Download className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold">Export Your Data</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Download a copy of all your personal data stored in Kobonz. This
              includes your profile, coupons, redemptions, and activity history.
            </p>
            <Button
              onClick={handleExportData}
              disabled={loading}
              variant="outline"
            >
              {loading ? "Preparing Export..." : "Download My Data"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-destructive">
              Delete Account
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action
              cannot be undone.
            </p>

            {!showConfirmation ? (
              <Button
                variant="destructive"
                onClick={() => setShowConfirmation(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete My Account
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg bg-destructive/10 p-4">
                  <p className="text-sm font-medium text-destructive">
                    Are you absolutely sure?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This will permanently delete:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Your profile and account information</li>
                    <li>• All your coupons and stores (if applicable)</li>
                    <li>• Your redemption history</li>
                    <li>• All analytics and activity data</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Yes, Delete Everything"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
