import { SignJWT, jwtVerify } from "jose"
import { Role } from "@prisma/client"

// JWT payload interface
export interface JWTPayload {
  id: string
  email: string
  role: Role
  name: string
  isVerified: boolean
  iat?: number
  exp?: number
}

// Access token expiry: 15 minutes
const ACCESS_TOKEN_EXPIRY = "15m"
// Refresh token expiry: 30 days
const REFRESH_TOKEN_EXPIRY = "30d"

const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET or NEXTAUTH_SECRET not configured")
  }
  return new TextEncoder().encode(secret)
}

/**
 * Parse expiry string to seconds
 */
function parseExpiry(expiry: string): number {
  const unit = expiry.slice(-1)
  const value = parseInt(expiry.slice(0, -1))
  
  switch (unit) {
    case "s": return value
    case "m": return value * 60
    case "h": return value * 60 * 60
    case "d": return value * 24 * 60 * 60
    default: return 15 * 60 // Default to 15 minutes
  }
}

/**
 * Create an access token (15 min expiry)
 */
export async function createAccessToken(payload: JWTPayload): Promise<string> {
  const secret = getJWTSecret()
  const expiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || ACCESS_TOKEN_EXPIRY
  
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(secret)
}

/**
 * Create a refresh token (30 day expiry)
 */
export async function createRefreshToken(payload: JWTPayload): Promise<string> {
  const secret = getJWTSecret()
  const expiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || REFRESH_TOKEN_EXPIRY
  
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(secret)
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getJWTSecret()
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

/**
 * Get token expiry in seconds
 */
export function getTokenExpiry(type: "access" | "refresh"): number {
  if (type === "access") {
    const expiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || ACCESS_TOKEN_EXPIRY
    return parseExpiry(expiry)
  } else {
    const expiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || REFRESH_TOKEN_EXPIRY
    return parseExpiry(expiry)
  }
}

/**
 * Create both access and refresh tokens
 */
export async function createTokenPair(payload: JWTPayload) {
  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken(payload),
    createRefreshToken(payload),
  ])

  return {
    accessToken,
    refreshToken,
    accessTokenExpiry: getTokenExpiry("access"),
    refreshTokenExpiry: getTokenExpiry("refresh"),
  }
}
