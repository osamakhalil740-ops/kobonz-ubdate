import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Phase 7: GDPR - Delete User Account
 * DELETE /api/user/delete-account
 * 
 * Permanently deletes user account and all associated data
 */

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Use transaction to ensure all data is deleted atomically
    await prisma.$transaction(async (tx) => {
      // Delete all user-related data
      // Cascade deletes will handle most relations, but we'll be explicit

      // Delete notifications
      await tx.notification.deleteMany({ where: { userId } })

      // Delete analytics summaries
      await tx.analyticsSummary.deleteMany({ where: { userId } })

      // Delete affiliate earnings
      await tx.affiliateEarning.deleteMany({ where: { affiliateId: userId } })

      // Delete payout requests
      await tx.payoutRequest.deleteMany({ where: { affiliateId: userId } })

      // Delete affiliate links
      await tx.affiliateLink.deleteMany({ where: { affiliateId: userId } })

      // Delete redemptions
      await tx.redemption.deleteMany({ where: { userId } })

      // Delete credit logs
      await tx.creditLog.deleteMany({ where: { userId } })

      // Delete credit requests
      await tx.creditRequest.deleteMany({ where: { userId } })

      // Delete credit keys
      await tx.creditKey.deleteMany({ where: { userId } })

      // Delete coupons (created by user)
      await tx.coupon.deleteMany({ where: { userId } })

      // Delete stores
      await tx.store.deleteMany({ where: { userId } })

      // Delete sessions
      await tx.session.deleteMany({ where: { userId } })

      // Delete accounts
      await tx.account.deleteMany({ where: { userId } })

      // Finally, delete the user
      await tx.user.delete({ where: { id: userId } })
    })

    // Clear session cookies
    const response = NextResponse.json({ 
      success: true,
      message: "Account deleted successfully" 
    })

    // Clear auth cookies
    response.cookies.delete("next-auth.session-token")
    response.cookies.delete("__Secure-next-auth.session-token")

    return response
  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}
