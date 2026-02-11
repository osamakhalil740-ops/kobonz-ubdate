"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { formatCouponStatus, getStatusBadgeVariant } from "@/lib/coupon-utils"
import Link from "next/link"

interface Coupon {
  id: string
  title: string
  code: string | null
  discountType: string
  discountValue: number
  status: string
  views: number
  clicks: number
  usesCount: number
  maxUses: number
  createdAt: string
  store: {
    name: string
  } | null
  category: {
    name: string
  }
  _count: {
    redemptions: number
  }
}

export default function StoreCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
      })
      
      const response = await fetch(`/api/store/coupons?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setCoupons(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [currentPage])

  const handleDelete = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return

    try {
      const response = await fetch(`/api/store/coupons/${couponId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        fetchCoupons()
      }
    } catch (error) {
      console.error("Error deleting coupon:", error)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Coupons</h1>
          <p className="text-muted-foreground">Manage your coupon listings</p>
        </div>
        <Button asChild>
          <Link href="/store/coupons/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Coupon
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>View and manage your coupons</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No coupons found</p>
              <Button asChild>
                <Link href="/store/coupons/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Coupon
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{coupon.title}</p>
                          {coupon.code && (
                            <p className="text-xs text-muted-foreground">Code: {coupon.code}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{coupon.store?.name || "No Store"}</TableCell>
                      <TableCell>
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `$${coupon.discountValue}`}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{coupon.views} views</span>
                          </div>
                          <div className="text-muted-foreground">
                            {coupon.clicks} clicks
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.usesCount} / {coupon.maxUses}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(coupon.status as any)}>
                          {formatCouponStatus(coupon.status as any)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/store/coupons/${coupon.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(coupon.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
