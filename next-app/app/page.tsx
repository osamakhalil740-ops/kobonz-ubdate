import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🎉 Kobonz Next Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Isolated Next.js Application - Running on Port 3001
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">✅ Phase 1 Complete</CardTitle>
                <CardDescription>Foundation & Core Setup</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Next.js 14 with App Router</li>
                  <li>✓ TypeScript configured</li>
                  <li>✓ Tailwind CSS + shadcn/ui</li>
                  <li>✓ Prisma ORM configured</li>
                  <li>✓ PostgreSQL schema designed</li>
                  <li>✓ Modular project structure</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🔐 Phase 2 Complete</CardTitle>
                <CardDescription>Authentication & Authorization</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ NextAuth.js integration</li>
                  <li>✓ Email & Google OAuth</li>
                  <li>✓ JWT tokens (15min + 30day)</li>
                  <li>✓ Redis session caching</li>
                  <li>✓ Role-based access control</li>
                  <li>✓ Email verification & reset</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center mb-8">
            <Button asChild size="lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
          
          <Card className="text-left">
            <CardHeader>
              <CardTitle>🚀 Ready to Use</CardTitle>
              <CardDescription>Complete authentication system implemented</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  ✅ Authentication Features:
                </h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-green-700 dark:text-green-300">
                  <div>• Email & Password login</div>
                  <div>• Google OAuth 2.0</div>
                  <div>• Email verification</div>
                  <div>• Password reset</div>
                  <div>• JWT tokens (15min)</div>
                  <div>• Refresh tokens (30d)</div>
                  <div>• Redis caching</div>
                  <div>• Role-based access</div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                  ⚠️ Setup Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                  Configure these services before using authentication:
                </p>
                <ol className="list-decimal list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>PostgreSQL database (Neon.tech)</li>
                  <li>Google OAuth credentials</li>
                  <li>Upstash Redis instance</li>
                  <li>Resend email API key</li>
                  <li>Run: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">npm run db:push</code></li>
                </ol>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  See <code>PHASE_2_SETUP.md</code> for detailed instructions
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                  🔒 Zero Impact on Production
                </h3>
                <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>Separate port (3001 vs 3000)</li>
                  <li>Separate database (PostgreSQL vs Firebase)</li>
                  <li>Independent authentication</li>
                  <li>Production app 100% untouched</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
