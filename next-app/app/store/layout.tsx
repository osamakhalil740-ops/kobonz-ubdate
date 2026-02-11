import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-helpers"
import { Role } from "@prisma/client"
import { StoreNav } from "@/components/dashboard/store-nav"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Require STORE_OWNER, ADMIN, or SUPER_ADMIN role
  await requireRole([Role.STORE_OWNER, Role.ADMIN, Role.SUPER_ADMIN])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <StoreNav />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
