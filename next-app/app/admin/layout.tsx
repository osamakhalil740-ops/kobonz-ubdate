import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-helpers"
import { Role } from "@prisma/client"
import { AdminNav } from "@/components/dashboard/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Require ADMIN or SUPER_ADMIN role
  await requireRole([Role.ADMIN, Role.SUPER_ADMIN])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <AdminNav />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
