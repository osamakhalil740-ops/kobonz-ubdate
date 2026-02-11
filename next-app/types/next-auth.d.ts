import { Role } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      isVerified: boolean
      credits: number
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: Role
    isVerified: boolean
    credits: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    isVerified: boolean
    credits: number
    bannedUntil?: Date | null
    isActive?: boolean
  }
}
