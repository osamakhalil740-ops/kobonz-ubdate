import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { hasPermission, Permission } from "@/lib/permissions"
import { redirect } from "next/navigation"

/**
 * Get current session (server-side)
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getSession()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      isVerified: true,
      isActive: true,
      bannedUntil: true,
      credits: true,
      createdAt: true,
    },
  })

  return user
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth() {
  const session = await getSession()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  return session
}

/**
 * Require specific role - redirect if user doesn't have required role
 */
export async function requireRole(roles: Role | Role[]) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

/**
 * Require specific permission - redirect if user doesn't have permission
 */
export async function requirePermission(permission: Permission) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  if (!hasPermission(user.role, permission)) {
    redirect("/unauthorized")
  }

  return user
}

/**
 * Check if current user has permission
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  return hasPermission(user.role, permission)
}

/**
 * Check if current user has role
 */
export async function checkRole(roles: Role | Role[]): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  return allowedRoles.includes(user.role)
}

/**
 * Check if current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return !!session?.user
}
