import { NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/notifications"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Phase 6: Notifications API
 * GET /api/notifications - Get user notifications
 * POST /api/notifications - Create notification (admin only)
 * PATCH /api/notifications - Mark all as read
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

    const searchParams = request.nextUrl.searchParams
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const type = searchParams.get("type") as any

    const result = await notificationService.getUserNotifications(
      session.user.id,
      {
        unreadOnly,
        limit,
        offset,
        type,
      }
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json(
      { error: "Failed to get notifications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only admins can create notifications manually
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, type, title, message, priority, metadata } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const notification = await notificationService.create({
      userId,
      type,
      title,
      message,
      priority,
      metadata,
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Create notification error:", error)
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    if (action === "markAllRead") {
      await notificationService.markAllAsRead(session.user.id)
      return NextResponse.json({ success: true })
    }

    if (action === "deleteAllRead") {
      await notificationService.deleteAllRead(session.user.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Update notifications error:", error)
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    )
  }
}
