import { NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/notifications"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

/**
 * Phase 6: Unread Count API
 * GET /api/notifications/unread-count
 */

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const count = await notificationService.getUnreadCount(session.user.id)

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Get unread count error:", error)
    return NextResponse.json(
      { error: "Failed to get unread count" },
      { status: 500 }
    )
  }
}

