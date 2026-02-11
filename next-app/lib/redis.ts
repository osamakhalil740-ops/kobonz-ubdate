import { Redis } from "@upstash/redis"

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Redis helper functions for session caching
export const redisHelpers = {
  // Get session from cache
  async getSession(userId: string) {
    const cached = await redis.get(`session:${userId}`)
    return cached ? JSON.parse(cached as string) : null
  },

  // Set session in cache (15 min TTL)
  async setSession(userId: string, data: any) {
    await redis.setex(
      `session:${userId}`,
      15 * 60, // 15 minutes
      JSON.stringify(data)
    )
  },

  // Delete session from cache
  async deleteSession(userId: string) {
    await redis.del(`session:${userId}`)
  },

  // Store refresh token (30 days TTL)
  async setRefreshToken(userId: string, tokenHash: string) {
    await redis.setex(
      `refresh:${userId}`,
      30 * 24 * 60 * 60, // 30 days
      tokenHash
    )
  },

  // Get refresh token
  async getRefreshToken(userId: string) {
    return await redis.get(`refresh:${userId}`)
  },

  // Delete refresh token
  async deleteRefreshToken(userId: string) {
    await redis.del(`refresh:${userId}`)
  },

  // Store email verification token (24 hours)
  async setVerificationToken(email: string, token: string) {
    await redis.setex(
      `verify:${email}`,
      24 * 60 * 60, // 24 hours
      token
    )
  },

  // Get verification token
  async getVerificationToken(email: string) {
    return await redis.get(`verify:${email}`)
  },

  // Delete verification token
  async deleteVerificationToken(email: string) {
    await redis.del(`verify:${email}`)
  },

  // Store password reset token (1 hour)
  async setPasswordResetToken(email: string, token: string) {
    await redis.setex(
      `reset:${email}`,
      60 * 60, // 1 hour
      token
    )
  },

  // Get password reset token
  async getPasswordResetToken(email: string) {
    return await redis.get(`reset:${email}`)
  },

  // Delete password reset token
  async deletePasswordResetToken(email: string) {
    await redis.del(`reset:${email}`)
  },
}
