// Application constants

// Credit system
export const CREDITS = {
  SIGNUP_BONUS: 100,
  REFERRAL_BONUS: 50,
  REFERRER_BONUS: 100,
  MIN_COUPON_CREATION_COST: 10,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Coupon limits
export const COUPON_LIMITS = {
  MIN_DISCOUNT: 1,
  MAX_DISCOUNT_PERCENTAGE: 100,
  MIN_MAX_USES: 1,
  MAX_MAX_USES: 100000,
  MIN_VALIDITY_DAYS: 1,
  MAX_VALIDITY_DAYS: 365,
} as const

// Role permissions
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'], // All permissions
  ADMIN: [
    'users:read',
    'users:update',
    'stores:read',
    'stores:update',
    'coupons:read',
    'coupons:approve',
    'categories:manage',
    'credits:manage',
  ],
  STORE_OWNER: [
    'stores:create',
    'stores:update:own',
    'coupons:create',
    'coupons:update:own',
    'coupons:delete:own',
  ],
  AFFILIATE: [
    'coupons:read',
    'affiliate-links:create',
    'affiliate-links:read:own',
  ],
  MARKETER: [
    'coupons:read',
    'analytics:read',
  ],
  USER: [
    'coupons:read',
    'coupons:redeem',
  ],
} as const

// Session and security
export const SECURITY = {
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  PASSWORD_MIN_LENGTH: 8,
  REFERRAL_CODE_LENGTH: 8,
  TRACKING_CODE_LENGTH: 12,
  KEY_CODE_LENGTH: 16,
} as const

// File upload limits
export const UPLOAD = {
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_LOGO_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  FULL: 'MMMM dd, yyyy HH:mm',
  SHORT: 'MM/dd/yyyy',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${SECURITY.PASSWORD_MIN_LENGTH} characters`,
  DISCOUNT_INVALID: 'Please enter a valid discount value',
  DATE_INVALID: 'Please select a valid date',
  DATE_PAST: 'Date must be in the future',
} as const

// API routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  USERS: {
    LIST: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
  STORES: {
    LIST: '/api/stores',
    GET: (id: string) => `/api/stores/${id}`,
    CREATE: '/api/stores',
    UPDATE: (id: string) => `/api/stores/${id}`,
    DELETE: (id: string) => `/api/stores/${id}`,
  },
  COUPONS: {
    LIST: '/api/coupons',
    GET: (id: string) => `/api/coupons/${id}`,
    CREATE: '/api/coupons',
    UPDATE: (id: string) => `/api/coupons/${id}`,
    DELETE: (id: string) => `/api/coupons/${id}`,
    REDEEM: (id: string) => `/api/coupons/${id}/redeem`,
  },
  CATEGORIES: {
    LIST: '/api/categories',
    GET: (id: string) => `/api/categories/${id}`,
    CREATE: '/api/categories',
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
  },
} as const
