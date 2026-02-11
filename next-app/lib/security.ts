import crypto from "crypto"

/**
 * Phase 7: Security Utilities
 * Additional security helpers for CSRF, XSS, and other protections
 */

// ============================================
// CSRF TOKEN GENERATION
// ============================================

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false
  
  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(expectedToken, "hex")
    )
  } catch {
    return false
  }
}

// ============================================
// PASSWORD HASHING
// ============================================

/**
 * Hash password with salt (using Node.js crypto)
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs")
  return await bcrypt.hash(password, 12)
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import("bcryptjs")
  return await bcrypt.compare(password, hash)
}

// ============================================
// SECURE RANDOM GENERATION
// ============================================

/**
 * Generate cryptographically secure random string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

/**
 * Generate secure random number in range
 */
export function generateSecureRandomNumber(min: number, max: number): number {
  const range = max - min + 1
  const bytesNeeded = Math.ceil(Math.log2(range) / 8)
  const randomBytes = crypto.randomBytes(bytesNeeded)
  const randomNumber = randomBytes.readUIntBE(0, bytesNeeded)
  return min + (randomNumber % range)
}

// ============================================
// XSS PROTECTION
// ============================================

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

/**
 * Escape special characters for use in regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// ============================================
// SQL INJECTION PREVENTION
// ============================================

/**
 * Validate that a string is a valid UUID/CUID
 */
export function isValidId(id: string): boolean {
  // CUID format: starts with 'c', followed by timestamp and random chars
  const cuidRegex = /^c[a-z0-9]{24}$/i
  return cuidRegex.test(id)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

// ============================================
// FILE UPLOAD SECURITY
// ============================================

/**
 * Validate file type (MIME type)
 */
export function isValidImageType(mimeType: string): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ]
  return allowedTypes.includes(mimeType)
}

/**
 * Validate file size
 */
export function isValidFileSize(bytes: number, maxMB: number = 5): boolean {
  const maxBytes = maxMB * 1024 * 1024
  return bytes <= maxBytes
}

/**
 * Generate safe filename
 */
export function generateSafeFilename(originalName: string, userId?: string): string {
  // Remove extension
  const extension = originalName.split(".").pop() || "jpg"
  
  // Generate unique filename
  const timestamp = Date.now()
  const random = crypto.randomBytes(8).toString("hex")
  const prefix = userId ? `${userId}-` : ""
  
  return `${prefix}${timestamp}-${random}.${extension}`
}

// ============================================
// IP ADDRESS VALIDATION
// ============================================

/**
 * Validate IPv4 address
 */
export function isValidIPv4(ip: string): boolean {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipv4Regex.test(ip)
}

/**
 * Check if IP is private/localhost
 */
export function isPrivateIP(ip: string): boolean {
  if (!isValidIPv4(ip)) return false

  const parts = ip.split(".").map(Number)

  // Localhost
  if (parts[0] === 127) return true

  // Private ranges
  if (parts[0] === 10) return true
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true
  if (parts[0] === 192 && parts[1] === 168) return true

  return false
}

// ============================================
// URL VALIDATION
// ============================================

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)

    // Only allow http/https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null
    }

    // Rebuild URL to remove any dangerous parts
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}`
  } catch {
    return null
  }
}

/**
 * Check if URL is safe to redirect to
 */
export function isSafeRedirectUrl(url: string, allowedDomains: string[]): boolean {
  try {
    const parsed = new URL(url)

    // Check protocol
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false
    }

    // Check domain
    const hostname = parsed.hostname
    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    )
  } catch {
    // Relative URLs are safe
    return url.startsWith("/") && !url.startsWith("//")
  }
}

// ============================================
// TIMING ATTACK PREVENTION
// ============================================

/**
 * Compare strings in constant time to prevent timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

// ============================================
// SESSION SECURITY
// ============================================

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString("base64url")
}

/**
 * Hash session ID for storage
 */
export function hashSessionId(sessionId: string): string {
  return crypto.createHash("sha256").update(sessionId).digest("hex")
}

// ============================================
// ENCRYPTION/DECRYPTION (for sensitive data)
// ============================================

const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const TAG_LENGTH = 16

/**
 * Encrypt sensitive data
 */
export function encrypt(text: string, secretKey: string): string {
  const key = crypto.scryptSync(secretKey, "salt", KEY_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  const tag = cipher.getAuthTag()

  // Return: iv:tag:encrypted
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedData: string, secretKey: string): string {
  const [ivHex, tagHex, encrypted] = encryptedData.split(":")

  const key = crypto.scryptSync(secretKey, "salt", KEY_LENGTH)
  const iv = Buffer.from(ivHex, "hex")
  const tag = Buffer.from(tagHex, "hex")

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
