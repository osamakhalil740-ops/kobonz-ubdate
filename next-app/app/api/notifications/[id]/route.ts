import { NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/notifications"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Phase 6: Single Notification API
 * PATCH /api/notifications/[id] - Mark as read
 * DELETE /api/notifications/[id] - Delete notification
 */

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const notificationId = params.id

    await notificationService.markAsRead(notificationId, session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mark notification as read error:", error)
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const notificationId = params.id

    await notificationService.delete(notificationId, session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete notification error:", error)
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    )
  }
}
