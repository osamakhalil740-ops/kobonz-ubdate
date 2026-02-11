"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, MousePointer, Target, Eye, BarChart3 } from "lucide-react"
import { formatCurrency } from "@/lib/affiliate-utils"

export default function AffiliateDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/affiliate/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load statistics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
        <p className="text-muted-foreground">Track your performance and earnings</p>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.overview.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to withdraw
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(stats.overview.pending)}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting 30-day confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.overview.totalEarned)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overview.totalLinks} active links
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              Total sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.conversionRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              Clicks to conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EPC</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.overview.epc)}</div>
            <p className="text-xs text-muted-foreground">
              Earnings per click
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Earnings & Top Links */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Your latest commissions</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentEarnings.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No earnings yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentEarnings.map((earning: any) => (
                  <div key={earning.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{earning.coupon.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(earning.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {formatCurrency(earning.commission)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {earning.status.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>Your best converting coupons</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topLinks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No links yet</p>
            ) : (
              <div className="space-y-4">
                {stats.topLinks.map((link: any) => (
                  <div key={link.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{link.coupon.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {link.clicks} clicks • {link.conversions} conversions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(link.coupon.affiliateCommission)}
                      </p>
                      <p className="text-xs text-muted-foreground">per sale</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Phase 5 Banner */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>✅ Phase 5 - Affiliate System Active</CardTitle>
          <CardDescription>Complete affiliate marketing platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p>• Affiliate registration & tracking</p>
              <p>• Unique tracking links (/go/code)</p>
              <p>• 30-day cookie attribution</p>
              <p>• Click & conversion tracking</p>
            </div>
            <div>
              <p>• Commission calculation</p>
              <p>• Pending vs available balance</p>
              <p>• Payout request system</p>
              <p>• Performance analytics (CTR, EPC)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
