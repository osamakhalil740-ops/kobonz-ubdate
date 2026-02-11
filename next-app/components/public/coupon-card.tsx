import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCouponStatus, getStatusBadgeVariant } from "@/lib/coupon-utils"
import { Clock, Eye, Tag, Store } from "lucide-react"

interface CouponCardProps {
  coupon: {
    id: string
    title: string
    description: string
    code: string | null
    discountType: string
    discountValue: number
    views: number
    expiryDate: Date | null
    status: string
    store: {
      id: string
      name: string
      logo: string | null
    } | null
    category: {
      id: string
      name: string
      slug: string
      icon: string | null
    }
  }
}

export function CouponCard({ coupon }: CouponCardProps) {
  const getDiscountDisplay = () => {
    switch (coupon.discountType) {
      case "PERCENTAGE":
        return `${coupon.discountValue}% OFF`
      case "FIXED":
        return `$${coupon.discountValue} OFF`
      case "BUY_ONE_GET_ONE":
        return "BOGO"
      case "FREE_SHIPPING":
        return "FREE SHIPPING"
      default:
        return "DISCOUNT"
    }
  }

  const getDaysRemaining = () => {
    if (!coupon.expiryDate) return null
    const days = Math.ceil((new Date(coupon.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const daysRemaining = getDaysRemaining()

  return (
    <Link href={`/coupons/${coupon.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="line-clamp-2 text-lg">{coupon.title}</CardTitle>
              {coupon.store && (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Store className="h-3 w-3" />
                  <span>{coupon.store.name}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold text-sm whitespace-nowrap">
                {getDiscountDisplay()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2 mb-4">
            {coupon.description}
          </CardDescription>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">
              {coupon.category.name}
            </Badge>
            {coupon.code && (
              <Badge variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {coupon.code}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{coupon.views} views</span>
            </div>
            {daysRemaining !== null && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className={daysRemaining <= 3 ? "text-destructive font-medium" : ""}>
                  {daysRemaining} days left
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
