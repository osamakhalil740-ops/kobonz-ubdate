import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"
import { shouldReleaseEarning } from "@/lib/affiliate-utils"

// GET /api/cron/process-earnings - Process pending earnings (30-day release)
// This should be called by a cron job daily
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (basic security)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "dev-secret"

    if (authHeader !== `Bearer ${cronSecret}`) {
      return errorResponse("Unauthorized", 401)
    }

    // Get all pending earnings older than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const pendingEarnings = await prisma.affiliateEarning.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          lte: thirtyDaysAgo,
        },
      },
      include: {
        affiliate: {
          select: {
            id: true,
            affiliatePending: true,
            affiliateBalance: true,
          },
        },
      },
    })

    let processedCount = 0
    let totalAmount = 0

    // Process each earning
    for (const earning of pendingEarnings) {
      try {
        // Update earning status to AVAILABLE
        await prisma.affiliateEarning.update({
          where: { id: earning.id },
          data: { status: "AVAILABLE" },
        })

        // Move from pending to available balance
        await prisma.user.update({
          where: { id: earning.affiliateId },
          data: {
            affiliatePending: { decrement: earning.commission },
            affiliateBalance: { increment: earning.commission },
          },
        })

        processedCount++
        totalAmount += earning.commission
      } catch (error) {
        console.error(`Error processing earning ${earning.id}:`, error)
      }
    }

    return successResponse({
      processed: processedCount,
      totalAmount,
      message: `Processed ${processedCount} earnings totaling $${totalAmount.toFixed(2)}`,
    })
  } catch (error) {
    console.error("Error processing earnings:", error)
    return errorResponse("Failed to process earnings", 500)
  }
}
