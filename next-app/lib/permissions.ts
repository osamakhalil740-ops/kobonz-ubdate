import { Role } from "@prisma/client"

/**
 * Permission definitions for role-based access control
 */
export const PERMISSIONS = {
  // User management
  "users:read": [Role.SUPER_ADMIN, Role.ADMIN],
  "users:create": [Role.SUPER_ADMIN, Role.ADMIN],
  "users:update": [Role.SUPER_ADMIN, Role.ADMIN],
  "users:delete": [Role.SUPER_ADMIN],
  "users:ban": [Role.SUPER_ADMIN, Role.ADMIN],
  
  // Store management
  "stores:read": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER],
  "stores:create": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER],
  "stores:update": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER],
  "stores:delete": [Role.SUPER_ADMIN, Role.ADMIN],
  "stores:verify": [Role.SUPER_ADMIN, Role.ADMIN],
  
  // Coupon management
  "coupons:read": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER, Role.AFFILIATE, Role.MARKETER, Role.USER],
  "coupons:create": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER],
  "coupons:update": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER],
  "coupons:delete": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER],
  "coupons:approve": [Role.SUPER_ADMIN, Role.ADMIN],
  "coupons:redeem": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER, Role.AFFILIATE, Role.MARKETER, Role.USER],
  
  // Category management
  "categories:read": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER, Role.AFFILIATE, Role.MARKETER, Role.USER],
  "categories:create": [Role.SUPER_ADMIN, Role.ADMIN],
  "categories:update": [Role.SUPER_ADMIN, Role.ADMIN],
  "categories:delete": [Role.SUPER_ADMIN, Role.ADMIN],
  
  // Credit management
  "credits:read": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER, Role.AFFILIATE],
  "credits:grant": [Role.SUPER_ADMIN, Role.ADMIN],
  "credits:request": [Role.STORE_OWNER, Role.AFFILIATE],
  "credits:approve": [Role.SUPER_ADMIN, Role.ADMIN],
  
  // Affiliate system
  "affiliates:read": [Role.SUPER_ADMIN, Role.ADMIN, Role.AFFILIATE],
  "affiliates:create": [Role.SUPER_ADMIN, Role.ADMIN, Role.AFFILIATE],
  "affiliates:update": [Role.SUPER_ADMIN, Role.ADMIN, Role.AFFILIATE],
  "affiliates:delete": [Role.SUPER_ADMIN, Role.ADMIN],
  
  // Analytics
  "analytics:read": [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_OWNER, Role.MARKETER],
  "analytics:export": [Role.SUPER_ADMIN, Role.ADMIN],
  
  // System settings
  "settings:read": [Role.SUPER_ADMIN, Role.ADMIN],
  "settings:update": [Role.SUPER_ADMIN],
} as const

export type Permission = keyof typeof PERMISSIONS

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission]
  return allowedRoles ? allowedRoles.includes(role) : false
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return Object.entries(PERMISSIONS)
    .filter(([_, roles]) => roles.includes(role))
    .map(([permission]) => permission as Permission)
}

/**
 * Role hierarchy levels (higher number = more powerful)
 */
export const ROLE_HIERARCHY = {
  [Role.USER]: 0,
  [Role.MARKETER]: 1,
  [Role.AFFILIATE]: 2,
  [Role.STORE_OWNER]: 3,
  [Role.ADMIN]: 4,
  [Role.SUPER_ADMIN]: 5,
} as const

/**
 * Check if a role is higher or equal in hierarchy
 */
export function isRoleHigherOrEqual(role: Role, comparedTo: Role): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[comparedTo]
}

/**
 * Check if a user can manage another user (based on role hierarchy)
 */
export function canManageUser(managerRole: Role, targetRole: Role): boolean {
  // Super admin can manage anyone
  if (managerRole === Role.SUPER_ADMIN) return true
  
  // Admin can manage everyone except super admin
  if (managerRole === Role.ADMIN && targetRole !== Role.SUPER_ADMIN) return true
  
  // Others cannot manage users
  return false
}
