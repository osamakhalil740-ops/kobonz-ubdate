import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAffiliateCookieName, getAffiliateCookieExpiry } from "@/lib/affiliate-utils"

// GET /go/[code] - Affiliate redirect with tracking
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const couponId = searchParams.get("coupon")

    if (!couponId) {
      // Redirect to homepage if no coupon specified
      return NextResponse.redirect(new URL("/marketplace", request.url))
    }

    // Find affiliate link
    const affiliateLink = await prisma.affiliateLink.findUnique({
      where: { trackingCode: params.code },
      include: {
        coupon: {
          select: {
            id: true,
            status: true,
            isActive: true,
          },
        },
      },
    })

    if (!affiliateLink) {
      // Invalid tracking code - redirect to coupon without tracking
      return NextResponse.redirect(new URL(`/coupons/${couponId}`, request.url))
    }

    // Check if link matches coupon
    if (affiliateLink.couponId !== couponId) {
      // Mismatch - redirect without tracking
      return NextResponse.redirect(new URL(`/coupons/${couponId}`, request.url))
    }

    // Check if affiliate link is active
    if (!affiliateLink.isActive) {
      return NextResponse.redirect(new URL(`/coupons/${couponId}`, request.url))
    }

    // Check if coupon is active
    if (affiliateLink.coupon.status !== "ACTIVE" || !affiliateLink.coupon.isActive) {
      return NextResponse.redirect(new URL(`/coupons/${couponId}`, request.url))
    }

    // Increment click count
    await prisma.affiliateLink.update({
      where: { id: affiliateLink.id },
      data: {
        clicks: {
          increment: 1,
        },
      },
    })

    // Also increment coupon clicks
    await prisma.coupon.update({
      where: { id: couponId },
      data: {
        clicks: {
          increment: 1,
        },
      },
    })

    // Create response with redirect
    const response = NextResponse.redirect(new URL(`/coupons/${couponId}`, request.url))

    // Set affiliate cookie (30 days)
    const cookieName = getAffiliateCookieName()
    const cookieExpiry = getAffiliateCookieExpiry()
    
    // Store tracking code in cookie for attribution
    response.cookies.set(cookieName, affiliateLink.trackingCode, {
      expires: cookieExpiry,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Affiliate redirect error:", error)
    
    // Fallback redirect to coupon
    const couponId = new URL(request.url).searchParams.get("coupon")
    if (couponId) {
      return NextResponse.redirect(new URL(`/coupons/${couponId}`, request.url))
    }
    
    return NextResponse.redirect(new URL("/marketplace", request.url))
  }
}
