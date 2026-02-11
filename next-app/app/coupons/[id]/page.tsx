import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCouponStatus, getStatusBadgeVariant } from "@/lib/coupon-utils"
import { Calendar, Clock, Eye, MapPin, Store, Tag, Ticket, TrendingUp, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"

async function getCoupon(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
  
  try {
    const response = await fetch(`${baseUrl}/api/public/coupons/${id}`, {
      cache: "no-store",
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching coupon:", error)
    return null
  }
}

export default async function CouponDetailsPage({ params }: { params: { id: string } }) {
  const coupon = await getCoupon(params.id)

  if (!coupon) {
    notFound()
  }

  const getDiscountDisplay = () => {
    switch (coupon.discountType) {
      case "PERCENTAGE":
        return `${coupon.discountValue}% OFF`
      case "FIXED":
        return `$${coupon.discountValue} OFF`
      case "BUY_ONE_GET_ONE":
        return "BUY ONE GET ONE FREE"
      case "FREE_SHIPPING":
        return "FREE SHIPPING"
      default:
        return "SPECIAL OFFER"
    }
  }

  const getDaysRemaining = () => {
    if (!coupon.expiryDate) return null
    const days = Math.ceil((new Date(coupon.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const daysRemaining = getDaysRemaining()
  const usagePercentage = (coupon.usesCount / coupon.maxUses) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href="/marketplace" className="hover:text-primary">Home</Link>
          {" / "}
          <Link href="/coupons" className="hover:text-primary">Coupons</Link>
          {" / "}
          <span>{coupon.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coupon Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{coupon.title}</CardTitle>
                    <CardDescription className="text-base">{coupon.description}</CardDescription>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-4 rounded-lg font-bold text-2xl whitespace-nowrap">
                      {getDiscountDisplay()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={getStatusBadgeVariant(coupon.status as any)}>
                    {formatCouponStatus(coupon.status)}
                  </Badge>
                  <Badge variant="secondary">
                    {coupon.category.name}
                  </Badge>
                  {coupon.discountType === "PERCENTAGE" && (
                    <Badge variant="outline">Percentage Discount</Badge>
                  )}
                </div>

                {/* Coupon Code */}
                {coupon.code && (
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <div className="text-sm text-muted-foreground mb-2">Coupon Code:</div>
                    <div className="flex items-center gap-2">
                      <code className="text-2xl font-mono font-bold text-primary flex-1">
                        {coupon.code}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(coupon.code)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary mb-1">
                      <Eye className="h-5 w-5" />
                      {coupon.views}
                    </div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary mb-1">
                      <TrendingUp className="h-5 w-5" />
                      {coupon._count.redemptions}
                    </div>
                    <div className="text-xs text-muted-foreground">Redemptions</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary mb-1">
                      <Ticket className="h-5 w-5" />
                      {coupon.usesLeft}
                    </div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                  </div>
                </div>

                {/* Usage Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">{coupon.usesCount} / {coupon.maxUses}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Expiry Info */}
                {coupon.expiryDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                    {daysRemaining !== null && (
                      <Badge variant={daysRemaining <= 3 ? "destructive" : "secondary"}>
                        {daysRemaining} days left
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Store Information */}
            {coupon.store && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Store Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    {coupon.store.logo ? (
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={coupon.store.logo}
                          alt={coupon.store.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl font-bold text-primary">
                          {coupon.store.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{coupon.store.name}</h3>
                      {coupon.store.description && (
                        <p className="text-muted-foreground mb-3">{coupon.store.description}</p>
                      )}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{coupon.store.city}, {coupon.store.country}</span>
                        </div>
                        {coupon.store.website && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={coupon.store.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" asChild>
                          <Link href={`/stores/${coupon.store.id}`}>
                            View Store Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-none">
              <CardHeader>
                <CardTitle className="text-white text-xl">Ready to Save?</CardTitle>
                <CardDescription className="text-purple-100">
                  {coupon.code ? "Copy the code and use it at checkout" : "Visit the store to redeem this offer"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {coupon.code ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigator.clipboard.writeText(coupon.code)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href={`/stores/${coupon.store?.id}`}>
                      Visit Store
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coupon Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="secondary">{coupon.category.name}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{coupon.discountType.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {new Date(coupon.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {coupon.isGlobal ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <Badge variant="success">Global</Badge>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Locations:</span>
                    <span className="font-medium text-right">
                      {coupon.countries.length > 0 && `${coupon.countries.length} countries`}
                      {coupon.cities.length > 0 && `, ${coupon.cities.length} cities`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
