"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Check, X, Search } from "lucide-react"

interface Store {
  id: string
  name: string
  email: string
  isVerified: boolean
  isActive: boolean
  createdAt: string
  owner: {
    name: string
    email: string
  }
  category: {
    name: string
  }
  _count: {
    coupons: number
  }
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")

  const fetchStores = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(search && { search }),
      })
      
      const response = await fetch(`/api/admin/stores?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setStores(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching stores:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [currentPage, search])

  const handleApprove = async (storeId: string) => {
    try {
      const response = await fetch(`/api/admin/stores/${storeId}/approve`, {
        method: "PATCH",
      })
      
      if (response.ok) {
        fetchStores()
      }
    } catch (error) {
      console.error("Error approving store:", error)
    }
  }

  const handleReject = async (storeId: string) => {
    try {
      const response = await fetch(`/api/admin/stores/${storeId}/reject`, {
        method: "PATCH",
      })
      
      if (response.ok) {
        fetchStores()
      }
    } catch (error) {
      console.error("Error rejecting store:", error)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Management</h1>
        <p className="text-muted-foreground">Approve and manage stores</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
          <CardDescription>Review and approve store applications</CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : stores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stores found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Coupons</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{store.owner.name}</p>
                          <p className="text-xs text-muted-foreground">{store.owner.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{store.category.name}</TableCell>
                      <TableCell>{store._count.coupons}</TableCell>
                      <TableCell>
                        {store.isVerified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!store.isVerified && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(store.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(store.id)}
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
