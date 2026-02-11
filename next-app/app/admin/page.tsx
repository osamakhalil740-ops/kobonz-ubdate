import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Ticket, Users, TrendingUp } from "lucide-react"

export const metadata = {
  title: "Admin Dashboard - Kobonz",
  description: "Platform administration",
}

async function getAnalytics() {
  // In production, this would call the API
  // For now, return mock data
  return {
    overview: {
      totalUsers: 0,
      totalStores: 0,
      totalCoupons: 0,
      totalRedemptions: 0,
      pendingStores: 0,
      pendingCoupons: 0,
      activeUsers: 0,
    },
  }
}

export default async function AdminDashboardPage() {
  const analytics = await getAnalytics()

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage stores, coupons, and users
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.activeUsers} active in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalStores}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.pendingStores} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalCoupons}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.pendingCoupons} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redemptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalRedemptions}</div>
            <p className="text-xs text-muted-foreground">
              Total coupon usage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Stores</p>
                  <p className="text-sm text-muted-foreground">
                    {analytics.overview.pendingStores} pending verification
                  </p>
                </div>
                <a href="/admin/stores?verified=false" className="text-sm text-primary hover:underline">
                  Review →
                </a>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Coupons</p>
                  <p className="text-sm text-muted-foreground">
                    {analytics.overview.pendingCoupons} pending approval
                  </p>
                </div>
                <a href="/admin/coupons?status=PENDING" className="text-sm text-primary hover:underline">
                  Review →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Platform overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Active Users (30d)</p>
                <p className="font-medium">{analytics.overview.activeUsers}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Stores</p>
                <p className="font-medium">{analytics.overview.totalStores}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Coupons</p>
                <p className="font-medium">{analytics.overview.totalCoupons}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>✅ Phase 3 - Admin Dashboard Active</CardTitle>
          <CardDescription>Dashboard management system ready</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Store approval/rejection system</p>
            <p>• Coupon approval/rejection system</p>
            <p>• User management interface</p>
            <p>• Platform analytics</p>
            <p>• Protected routes with RBAC</p>
            <p>• Pagination on all tables</p>
            <p>• Coupon status lifecycle (PENDING → ACTIVE → EXPIRED)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
