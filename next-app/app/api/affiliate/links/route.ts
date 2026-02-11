import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, getPaginationParams, createPaginatedResponse, errorResponse, successResponse } from "@/lib/api-utils"
import { generateTrackingCode, createAffiliateLink } from "@/lib/affiliate-utils"

// GET /api/affiliate/links - Get affiliate's tracking links
export async function GET(request: NextRequest) {
  const auth = await checkApiAuth(request, "affiliates:read")
  if (!auth.authorized) return auth.error

  try {
    const { page, pageSize, skip } = getPaginationParams(request)

    const [links, total] = await Promise.all([
      prisma.affiliateLink.findMany({
        where: { affiliateId: auth.userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          coupon: {
            select: {
              id: true,
              title: true,
              discountType: true,
              discountValue: true,
              affiliateCommission: true,
              status: true,
            },
          },
        },
      }),
      prisma.affiliateLink.count({ where: { affiliateId: auth.userId } }),
    ])

    // Add full URL to each link
    const linksWithUrls = links.map(link => ({
      ...link,
      url: createAffiliateLink(link.trackingCode, link.couponId),
    }))

    return createPaginatedResponse(linksWithUrls, total, page, pageSize)
  } catch (error) {
    console.error("Error fetching affiliate links:", error)
    return errorResponse("Failed to fetch affiliate links", 500)
  }
}

// POST /api/affiliate/links - Create new affiliate tracking link
export async function POST(request: NextRequest) {
  const auth = await checkApiAuth(request, "affiliates:create")
  if (!auth.authorized) return auth.error

  try {
    const { couponId } = await request.json()

    if (!couponId) {
      return errorResponse("Coupon ID is required", 400)
    }

    // Check if coupon exists and is active
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    })

    if (!coupon) {
      return errorResponse("Coupon not found", 404)
    }

    if (coupon.status !== "ACTIVE" || !coupon.isActive) {
      return errorResponse("Coupon is not active", 400)
    }

    // Check if link already exists
    const existingLink = await prisma.affiliateLink.findUnique({
      where: {
        affiliateId_couponId: {
          affiliateId: auth.userId,
          couponId,
        },
      },
    })

    if (existingLink) {
      return successResponse({
        ...existingLink,
        url: createAffiliateLink(existingLink.trackingCode, existingLink.couponId),
      })
    }

    // Generate unique tracking code
    let trackingCode = generateTrackingCode()
    let isUnique = false
    
    while (!isUnique) {
      const existing = await prisma.affiliateLink.findUnique({
        where: { trackingCode },
      })
      if (!existing) {
        isUnique = true
      } else {
        trackingCode = generateTrackingCode()
      }
    }

    // Create affiliate link
    const link = await prisma.affiliateLink.create({
      data: {
        affiliateId: auth.userId,
        couponId,
        trackingCode,
      },
      include: {
        coupon: {
          select: {
            id: true,
            title: true,
            discountType: true,
            discountValue: true,
            affiliateCommission: true,
          },
        },
      },
    })

    return successResponse({
      ...link,
      url: createAffiliateLink(link.trackingCode, link.couponId),
    }, "Affiliate link created successfully")
  } catch (error) {
    console.error("Error creating affiliate link:", error)
    return errorResponse("Failed to create affiliate link", 500)
  }
}
