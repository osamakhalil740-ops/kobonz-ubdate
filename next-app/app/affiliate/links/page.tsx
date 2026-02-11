"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Copy, Plus, ExternalLink, TrendingUp } from "lucide-react"
import { calculateConversionRate } from "@/lib/affiliate-utils"

export default function AffiliateLinksPage() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [newCouponId, setNewCouponId] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [currentPage])

  const fetchLinks = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/affiliate/links?page=${currentPage}`)
      const data = await response.json()
      if (data.success) {
        setLinks(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching links:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLink = async () => {
    if (!newCouponId.trim()) return

    setCreating(true)
    try {
      const response = await fetch("/api/affiliate/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId: newCouponId }),
      })

      const data = await response.json()
      if (data.success) {
        setNewCouponId("")
        fetchLinks()
      } else {
        alert(data.error || "Failed to create link")
      }
    } catch (error) {
      console.error("Error creating link:", error)
      alert("Failed to create link")
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Link copied to clipboard!")
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Affiliate Links</h1>
        <p className="text-muted-foreground">Manage your tracking links and monitor performance</p>
      </div>

      {/* Create New Link */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Tracking Link</CardTitle>
          <CardDescription>Enter a coupon ID to generate your affiliate link</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon ID (e.g., from /coupons page)"
              value={newCouponId}
              onChange={(e) => setNewCouponId(e.target.value)}
              disabled={creating}
            />
            <Button onClick={handleCreateLink} disabled={creating || !newCouponId.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              {creating ? "Creating..." : "Create Link"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Links</CardTitle>
          <CardDescription>Track performance of each link</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : links.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No links created yet. Create your first link above!
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coupon</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>CVR</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => {
                    const cvr = calculateConversionRate(link.conversions, link.clicks)
                    return (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{link.coupon.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {link.coupon.discountType === "PERCENTAGE"
                                ? `${link.coupon.discountValue}%`
                                : `$${link.coupon.discountValue}`} off
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${link.coupon.affiliateCommission}
                        </TableCell>
                        <TableCell>{link.clicks}</TableCell>
                        <TableCell>{link.conversions}</TableCell>
                        <TableCell>{cvr.toFixed(1)}%</TableCell>
                        <TableCell>
                          {link.isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(link.url)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <a href={link.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
