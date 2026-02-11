import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Sign Up - Kobonz",
  description: "Create your Kobonz account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Kobonz
          </h1>
          <p className="text-muted-foreground mt-2">
            Create your account and start saving
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
