"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Check, X, Search } from "lucide-react"
import { formatCouponStatus, getStatusBadgeVariant } from "@/lib/coupon-utils"

interface Coupon {
  id: string
  title: string
  description: string
  code: string | null
  discountType: string
  discountValue: number
  status: string
  createdAt: string
  user: {
    name: string
    email: string
  }
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

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      })
      
      const response = await fetch(`/api/admin/coupons?${params}`)
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
  }, [currentPage, search, statusFilter])

  const handleApprove = async (couponId: string) => {
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}/approve`, {
        method: "PATCH",
      })
      
      if (response.ok) {
        fetchCoupons()
      }
    } catch (error) {
      console.error("Error approving coupon:", error)
    }
  }

  const handleReject = async (couponId: string) => {
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}/reject`, {
        method: "PATCH",
      })
      
      if (response.ok) {
        fetchCoupons()
      }
    } catch (error) {
      console.error("Error rejecting coupon:", error)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Coupon Management</h1>
        <p className="text-muted-foreground">Approve and manage coupons</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>Review and approve coupon submissions</CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No coupons found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Store/Owner</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Redemptions</TableHead>
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
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {coupon.store?.name || "No Store"}
                          </p>
                          <p className="text-xs text-muted-foreground">{coupon.user.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{coupon.category.name}</TableCell>
                      <TableCell>
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `$${coupon.discountValue}`}
                      </TableCell>
                      <TableCell>{coupon._count.redemptions}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(coupon.status as any)}>
                          {formatCouponStatus(coupon.status as any)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {coupon.status === "PENDING" && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(coupon.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(coupon.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
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
