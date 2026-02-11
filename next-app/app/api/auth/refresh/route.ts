import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, createAccessToken } from "@/lib/jwt"
import { redisHelpers } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      )
    }

    // Verify refresh token
    const payload = await verifyToken(refreshToken)

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user is active and not banned
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 403 }
      )
    }

    if (user.bannedUntil && user.bannedUntil > new Date()) {
      return NextResponse.json(
        { error: "Account is banned" },
        { status: 403 }
      )
    }

    // Create new access token
    const newAccessToken = await createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      isVerified: user.isVerified,
    })

    // Update session in Redis
    await redisHelpers.setSession(user.id, {
      id: user.id,
      role: user.role,
      email: user.email,
    })

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    )
  }
}
