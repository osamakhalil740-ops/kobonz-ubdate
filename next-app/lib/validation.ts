import { z } from "zod"

/**
 * Phase 7: Enhanced Validation Schemas
 * Comprehensive Zod schemas for input validation and XSS prevention
 */

// ============================================
// COMMON VALIDATORS
// ============================================

// Sanitize HTML input to prevent XSS
const sanitizeHtml = (value: string) => {
  return value
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

// Custom string validator with XSS protection
export const safeString = (options?: { min?: number; max?: number; required?: boolean }) =>
  z
    .string()
    .trim()
    .transform(sanitizeHtml)
    .pipe(
      z
        .string()
        .min(options?.min || 0)
        .max(options?.max || 1000)
    )
    .refine((val) => {
      if (options?.required && val.length === 0) return false
      return true
    })

// Email validation
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase()
  .max(255)

// Password validation (strong password)
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

// URL validation
export const urlSchema = z
  .string()
  .url("Invalid URL")
  .max(2048)
  .refine((url) => {
    try {
      const parsed = new URL(url)
      return ["http:", "https:"].includes(parsed.protocol)
    } catch {
      return false
    }
  }, "URL must use HTTP or HTTPS protocol")

// Slug validation (URL-safe)
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")

// Phone number validation (international)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")

// Coupon code validation
export const couponCodeSchema = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[A-Z0-9-_]+$/, "Coupon code must be uppercase alphanumeric with hyphens/underscores")

// Date validation
export const dateSchema = z.coerce.date()

// Future date validation
export const futureDateSchema = z.coerce
  .date()
  .refine((date) => date > new Date(), "Date must be in the future")

// Positive number
export const positiveNumberSchema = z.number().positive()

// Percentage (0-100)
export const percentageSchema = z.number().min(0).max(100)

// ============================================
// AUTH SCHEMAS
// ============================================

export const registerSchema = z.object({
  name: safeString({ min: 2, max: 100, required: true }),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["USER", "STORE_OWNER", "AFFILIATE"]).optional(),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
})

// ============================================
// COUPON SCHEMAS
// ============================================

export const createCouponSchema = z.object({
  title: safeString({ min: 3, max: 200, required: true }),
  description: safeString({ max: 2000 }),
  code: couponCodeSchema.optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING", "BUY_ONE_GET_ONE"]),
  discountValue: positiveNumberSchema.optional(),
  minimumPurchase: positiveNumberSchema.optional(),
  maximumDiscount: positiveNumberSchema.optional(),
  startDate: dateSchema.optional(),
  endDate: futureDateSchema.optional(),
  maxUses: z.number().int().positive().optional(),
  storeId: z.string().cuid(),
  category: safeString({ max: 100 }).optional(),
  tags: z.array(safeString({ max: 50 })).optional(),
  affiliateUrl: urlSchema.optional(),
})

export const updateCouponSchema = createCouponSchema.partial()

// ============================================
// STORE SCHEMAS
// ============================================

export const createStoreSchema = z.object({
  name: safeString({ min: 2, max: 100, required: true }),
  slug: slugSchema,
  description: safeString({ max: 2000 }),
  website: urlSchema,
  logo: urlSchema.optional(),
  category: safeString({ max: 100 }),
  tags: z.array(safeString({ max: 50 })).optional(),
})

export const updateStoreSchema = createStoreSchema.partial()

// ============================================
// USER SCHEMAS
// ============================================

export const updateProfileSchema = z.object({
  name: safeString({ min: 2, max: 100 }).optional(),
  bio: safeString({ max: 500 }).optional(),
  avatar: urlSchema.optional(),
  phone: phoneSchema.optional(),
  notificationPreferences: z
    .object({
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
    })
    .optional(),
})

// ============================================
// SEARCH SCHEMAS
// ============================================

export const searchSchema = z.object({
  q: safeString({ max: 200 }),
  category: safeString({ max: 100 }).optional(),
  minDiscount: z.coerce.number().min(0).max(100).optional(),
  maxDiscount: z.coerce.number().min(0).max(100).optional(),
  sort: z.enum(["recent", "popular", "discount", "expiring"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// ============================================
// PAGINATION SCHEMA
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// ============================================
// ID VALIDATION
// ============================================

export const idSchema = z.string().cuid("Invalid ID format")

// ============================================
// FILTER SCHEMAS
// ============================================

export const dateRangeSchema = z.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
})

export const statusFilterSchema = z.enum(["PENDING", "APPROVED", "REJECTED", "ALL"]).default("ALL")

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate request body against schema
 */
export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return {
        success: false,
        error: `${firstError.path.join(".")}: ${firstError.message}`,
      }
    }
    return { success: false, error: "Invalid request body" }
  }
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const params = Object.fromEntries(searchParams.entries())
    const data = schema.parse(params)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return {
        success: false,
        error: `${firstError.path.join(".")}: ${firstError.message}`,
      }
    }
    return { success: false, error: "Invalid query parameters" }
  }
}

/**
 * Sanitize object (recursively clean all string values)
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    const value = sanitized[key]
    
    if (typeof value === "string") {
      sanitized[key] = sanitizeHtml(value) as any
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeHtml(item) : item
      ) as any
    }
  }
  
  return sanitized
}
