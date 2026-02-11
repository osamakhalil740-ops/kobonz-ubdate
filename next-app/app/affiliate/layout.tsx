import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-helpers"
import { Role } from "@prisma/client"
import { AffiliateNav } from "@/components/dashboard/affiliate-nav"

export default async function AffiliateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Require AFFILIATE, ADMIN, or SUPER_ADMIN role
  await requireRole([Role.AFFILIATE, Role.ADMIN, Role.SUPER_ADMIN])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <AffiliateNav />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
