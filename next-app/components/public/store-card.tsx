import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Ticket } from "lucide-react"

interface StoreCardProps {
  store: {
    id: string
    name: string
    description: string | null
    logo: string | null
    city: string
    country: string
    category: {
      id: string
      name: string
      slug: string
      icon: string | null
    }
    _count: {
      coupons: number
    }
  }
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link href={`/stores/${store.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start gap-4">
            {store.logo ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary">
                  {store.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-1">{store.name}</CardTitle>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{store.city}, {store.country}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {store.description && (
            <CardDescription className="line-clamp-2 mb-4">
              {store.description}
            </CardDescription>
          )}

          <div className="flex items-center justify-between">
            <Badge variant="secondary">{store.category.name}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Ticket className="h-4 w-4" />
              <span>{store._count.coupons} coupons</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
