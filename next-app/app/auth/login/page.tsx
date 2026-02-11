import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Sign In - Kobonz",
  description: "Sign in to your Kobonz account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Kobonz
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Sign in to continue
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
