import { MetadataRoute } from "next"

/**
 * Phase 7: Robots.txt Generation
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/marketplace", "/coupons", "/stores"],
        disallow: [
          "/admin",
          "/dashboard",
          "/store",
          "/affiliate",
          "/api",
          "/auth/verify-email",
          "/auth/reset-password",
        ],
      },
      // Block aggressive crawlers
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
