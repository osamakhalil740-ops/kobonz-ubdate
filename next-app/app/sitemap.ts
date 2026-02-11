import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

/**
 * Phase 7: Dynamic Sitemap Generation
 * Automatically generates sitemap with all public pages
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/coupons`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  // Get all active coupons
  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      status: "APPROVED",
    },
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  const couponPages: MetadataRoute.Sitemap = coupons.map((coupon) => ({
    url: `${baseUrl}/coupons/${coupon.id}`,
    lastModified: coupon.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  // Get all active stores
  const stores = await prisma.store.findMany({
    where: {
      isActive: true,
      status: "APPROVED",
    },
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  const storePages: MetadataRoute.Sitemap = stores.map((store) => ({
    url: `${baseUrl}/stores/${store.id}`,
    lastModified: store.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [...staticPages, ...couponPages, ...storePages]
}

