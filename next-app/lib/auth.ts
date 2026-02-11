import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { generateReferralCode } from "@/lib/utils"
import { redis } from "@/lib/redis"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email & Password Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        // Check if user is banned
        if (user.bannedUntil && user.bannedUntil > new Date()) {
          throw new Error(`Account banned until ${user.bannedUntil.toLocaleDateString()}`)
        }

        // Check if account is active
        if (!user.isActive) {
          throw new Error("Account is inactive. Please contact support.")
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        // Check email verification (optional - can be disabled)
        // if (!user.isVerified) {
        //   throw new Error("Please verify your email address")
        // }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
          isVerified: user.isVerified,
        }
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers, create user if doesn't exist
      if (account?.provider === "google" && profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        })

        if (!existingUser) {
          // Create new user from OAuth
          await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name || "User",
              avatar: (profile as any).picture,
              isVerified: true, // OAuth emails are pre-verified
              provider: "google",
              providerId: account.providerAccountId,
              providerData: profile as any,
              referralCode: generateReferralCode(),
              credits: 100, // Signup bonus
            },
          })
        } else if (!existingUser.isActive) {
          return false // Block inactive users
        } else if (existingUser.bannedUntil && existingUser.bannedUntil > new Date()) {
          return false // Block banned users
        }
      }

      return true
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.email = dbUser.email
          token.name = dbUser.name
          token.picture = dbUser.avatar
          token.isVerified = dbUser.isVerified
          token.credits = dbUser.credits

          // Cache session in Redis (15 min TTL matching access token)
          await redis.setex(
            `session:${dbUser.id}`,
            15 * 60, // 15 minutes
            JSON.stringify({
              id: dbUser.id,
              role: dbUser.role,
              email: dbUser.email,
            })
          )
        }
      }

      // Update session (for profile updates)
      if (trigger === "update" && session) {
        token.name = session.name
        token.picture = session.picture
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        session.user.isVerified = token.isVerified as boolean
        session.user.credits = token.credits as number
      }

      return session
    },
  },

  events: {
    async signOut({ token }) {
      // Clear Redis cache on signout
      if (token?.id) {
        await redis.del(`session:${token.id}`)
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
}
