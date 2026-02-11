import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Phase 7: GDPR - Export User Data
 * POST /api/user/export-data
 */

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Gather all user data
    const [user, stores, coupons, redemptions, affiliateLinks, notifications] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            credits: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.store.findMany({
          where: { userId },
        }),
        prisma.coupon.findMany({
          where: { userId },
        }),
        prisma.redemption.findMany({
          where: { userId },
        }),
        prisma.affiliateLink.findMany({
          where: { affiliateId: userId },
        }),
        prisma.notification.findMany({
          where: { userId },
        }),
      ])

    // Compile data export
    const exportData = {
      exportDate: new Date().toISOString(),
      user,
      stores,
      coupons,
      redemptions,
      affiliateLinks,
      notifications,
      _metadata: {
        version: "1.0",
        format: "JSON",
        gdprCompliant: true,
      },
    }

    // Return as JSON file download
    const json = JSON.stringify(exportData, null, 2)
    const blob = new Blob([json], { type: "application/json" })

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="kobonz-data-${userId}-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error("Export data error:", error)
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    )
  }
}
