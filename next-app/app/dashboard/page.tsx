import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-helpers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata = {
  title: "Dashboard - Kobonz",
  description: "Your Kobonz dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your account
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Credits</CardTitle>
              <CardDescription>Your available credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.credits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role</CardTitle>
              <CardDescription>Your account type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold capitalize">
                {user.role.toLowerCase().replace("_", " ")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {user.isVerified ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-600 font-medium">Not Verified</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🎉 Authentication System Active</CardTitle>
            <CardDescription>Phase 2 Complete - Your account is secured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ Active Security Features:
              </h3>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>• NextAuth.js authentication</li>
                <li>• Email & Password (bcrypt, 12 salt rounds)</li>
                <li>• Google OAuth 2.0 integration</li>
                <li>• JWT-based sessions (15 min access tokens)</li>
                <li>• Refresh tokens (30 days, HttpOnly cookies)</li>
                <li>• Redis session caching (Upstash)</li>
                <li>• Role-based access control (RBAC)</li>
                <li>• Edge Middleware route protection</li>
                <li>• Email verification with Resend</li>
                <li>• Password reset flow</li>
                <li>• CSRF protection</li>
                <li>• Secure cookies (HttpOnly, SameSite)</li>
              </ul>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Email:</span> {user.email}
                  </div>
                  <div>
                    <span className="font-medium">Name:</span> {user.name}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span> {user.role}
                  </div>
                  <div>
                    <span className="font-medium">Joined:</span>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/settings">Account Settings</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600" asChild>
                    <Link href="/api/auth/signout">Sign Out</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
