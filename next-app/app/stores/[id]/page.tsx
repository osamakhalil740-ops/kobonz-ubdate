import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CouponCard } from "@/components/public/coupon-card"
import { MapPin, Phone, Mail, Globe, Ticket, Store as StoreIcon } from "lucide-react"
import Link from "next/link"

async function getStore(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
  
  try {
    const response = await fetch(`${baseUrl}/api/public/stores/${id}`, {
      cache: "no-store",
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching store:", error)
    return null
  }
}

export default async function StoreProfilePage({ params }: { params: { id: string } }) {
  const store = await getStore(params.id)

  if (!store) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      {store.coverImage && (
        <div className="w-full h-64 bg-gradient-to-br from-purple-600 to-blue-600">
          <img
            src={store.coverImage}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href="/marketplace" className="hover:text-primary">Home</Link>
          {" / "}
          <Link href="/stores" className="hover:text-primary">Stores</Link>
          {" / "}
          <span>{store.name}</span>
        </div>

        {/* Store Header */}
        <div className="flex items-start gap-6 mb-8">
          {store.logo ? (
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0 border-4 border-background shadow-lg">
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border-4 border-background shadow-lg">
              <span className="text-5xl font-bold text-primary">
                {store.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
                {store.description && (
                  <p className="text-lg text-muted-foreground">{store.description}</p>
                )}
              </div>
              <Badge variant="success" className="text-lg px-4 py-2">
                Verified Store
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{store.category.name}</Badge>
              <Badge variant="outline">
                <Ticket className="h-3 w-3 mr-1" />
                {store._count.coupons} Active Coupons
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Coupons */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Active Coupons</h2>
                  <p className="text-muted-foreground">Current deals from this store</p>
                </div>
              </div>

              {store.coupons.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No active coupons at the moment</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {store.coupons.map((coupon: any) => (
                    <CouponCard key={coupon.id} coupon={{ ...coupon, store: { id: store.id, name: store.name, logo: store.logo } }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium mb-1">Address</div>
                    <div className="text-sm text-muted-foreground">
                      {store.addressLine1}
                      {store.addressLine2 && <br />}
                      {store.addressLine2}
                      <br />
                      {store.city}, {store.district}
                      <br />
                      {store.country}
                      {store.postalCode && `, ${store.postalCode}`}
                    </div>
                  </div>
                </div>

                {store.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">Phone</div>
                      <a href={`tel:${store.phone}`} className="text-sm text-primary hover:underline">
                        {store.phone}
                      </a>
                    </div>
                  </div>
                )}

                {store.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">Email</div>
                      <a href={`mailto:${store.email}`} className="text-sm text-primary hover:underline break-all">
                        {store.email}
                      </a>
                    </div>
                  </div>
                )}

                {store.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">Website</div>
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {store.website}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Store Details */}
            <Card>
              <CardHeader>
                <CardTitle>Store Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="secondary">{store.category.name}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Coupons:</span>
                  <span className="font-medium">{store._count.coupons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            {store.website && (
              <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-none">
                <CardHeader>
                  <CardTitle className="text-white">Visit Store</CardTitle>
                  <CardDescription className="text-purple-100">
                    Check out more products and services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full" asChild>
                    <a href={store.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
