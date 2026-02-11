"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  TrendingUp, 
  DollarSign,
  Settings,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/affiliate/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Links",
    href: "/affiliate/links",
    icon: LinkIcon,
  },
  {
    title: "Earnings",
    href: "/affiliate/earnings",
    icon: TrendingUp,
  },
  {
    title: "Payouts",
    href: "/affiliate/payouts",
    icon: DollarSign,
  },
  {
    title: "Settings",
    href: "/affiliate/settings",
    icon: Settings,
  },
]

export function AffiliateNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Affiliate Panel</h2>
        <p className="text-sm text-muted-foreground">Earn commissions</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/api/auth/signout">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Link>
        </Button>
      </div>
    </div>
  )
}
