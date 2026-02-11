import { getCurrentUser } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Ticket, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Store Owner Dashboard - Kobonz",
  description: "Manage your stores and coupons",
}

async function getStoreOwnerStats(userId: string) {
  const [storeCount, couponCount, totalRedemptions, totalViews] = await Promise.all([
    prisma.store.count({ where: { ownerId: userId } }),
    prisma.coupon.count({ where: { userId } }),
    prisma.redemption.count({
      where: {
        coupon: { userId },
      },
    }),
    prisma.coupon.aggregate({
      where: { userId },
      _sum: { views: true },
    }),
  ])

  return {
    storeCount,
    couponCount,
    totalRedemptions,
    totalViews: totalViews._sum.views || 0,
  }
}

export default async function StoreOwnerDashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const stats = await getStoreOwnerStats(user.id)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">
          Manage your stores and coupons
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storeCount}</div>
            <p className="text-xs text-muted-foreground">
              Total stores created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Coupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.couponCount}</div>
            <p className="text-xs text-muted-foreground">
              Total coupons created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redemptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRedemptions}</div>
            <p className="text-xs text-muted-foreground">
              Total coupon uses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Coupon impressions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" asChild>
              <Link href="/store/coupons/new">
                <Ticket className="h-4 w-4 mr-2" />
                Create New Coupon
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/store/my-stores">
                <Store className="h-4 w-4 mr-2" />
                Manage Stores
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/store/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credits:</span>
              <span className="font-medium">{user.credits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium">{user.role.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>✅ Store Owner Dashboard</CardTitle>
          <CardDescription>Manage your business on Kobonz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Create and manage stores</p>
            <p>• Create, edit, and delete coupons</p>
            <p>• View coupon performance metrics</p>
            <p>• Track redemptions and views</p>
            <p>• Manage store profile</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
