import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CouponCard } from "@/components/public/coupon-card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Store, Ticket, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Marketplace - Kobonz",
  description: "Discover amazing deals and coupons from local businesses",
}

async function getFeaturedContent() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
  
  try {
    const response = await fetch(`${baseUrl}/api/public/featured?limit=8`, {
      cache: "no-store",
    })
    
    if (!response.ok) {
      return {
        featuredCoupons: [],
        popularCategories: [],
        stats: { totalCoupons: 0, totalStores: 0, totalRedemptions: 0 },
      }
    }
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching featured content:", error)
    return {
      featuredCoupons: [],
      popularCategories: [],
      stats: { totalCoupons: 0, totalStores: 0, totalRedemptions: 0 },
    }
  }
}

export default async function MarketplacePage() {
  const { featuredCoupons, popularCategories, stats } = await getFeaturedContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Discover Amazing Deals
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Browse thousands of coupons from local businesses. Save money on your favorite products and services.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Link href="/coupons">
            <div className="flex items-center gap-2 p-4 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Search for coupons, stores, or categories...</span>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalCoupons}</div>
              <div className="text-sm text-muted-foreground">Active Coupons</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalStores}</div>
              <div className="text-sm text-muted-foreground">Partner Stores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalRedemptions}</div>
              <div className="text-sm text-muted-foreground">Total Savings</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Categories */}
      {popularCategories.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Popular Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category: any) => (
              <Link key={category.id} href={`/coupons?category=${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    {category.icon && (
                      <div className="text-4xl mb-2">{category.icon}</div>
                    )}
                    <div className="font-semibold mb-1">{category.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {category._count.coupons} coupons
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Coupons */}
      {featuredCoupons.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Coupons</h2>
              <p className="text-muted-foreground">Most popular deals right now</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/coupons">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCoupons.map((coupon: any) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-none">
            <CardHeader>
              <Ticket className="h-12 w-12 mb-4" />
              <CardTitle className="text-2xl text-white">Browse All Coupons</CardTitle>
              <CardDescription className="text-purple-100">
                Explore thousands of deals from local businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" asChild>
                <Link href="/coupons">
                  Browse Coupons
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none">
            <CardHeader>
              <Store className="h-12 w-12 mb-4" />
              <CardTitle className="text-2xl text-white">Discover Stores</CardTitle>
              <CardDescription className="text-blue-100">
                Find your favorite local businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" asChild>
                <Link href="/stores">
                  Browse Stores
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Phase 4 Complete Banner */}
      <section className="container mx-auto px-4 py-8">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>✅ Phase 4 - Public Browsing Complete</CardTitle>
            <CardDescription>Full marketplace with search and filtering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p>• Homepage with featured coupons</p>
                <p>• Full-text search (English & Arabic)</p>
                <p>• Advanced filtering system</p>
                <p>• Sorting options</p>
              </div>
              <div>
                <p>• Coupon listings & details</p>
                <p>• Store listings & profiles</p>
                <p>• Optimized database queries</p>
                <p>• Responsive design</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
