import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, errorResponse, successResponse } from "@/lib/api-utils"
import { Role } from "@prisma/client"

// POST /api/affiliate/register - Upgrade user to affiliate
export async function POST(request: NextRequest) {
  const auth = await checkApiAuth(request)
  if (!auth.authorized) return auth.error

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    // Check if already an affiliate
    if (user.role === Role.AFFILIATE || user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      return errorResponse("User is already an affiliate or has higher privileges", 400)
    }

    // Upgrade to affiliate
    const updatedUser = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        role: Role.AFFILIATE,
        affiliateBalance: 0,
        affiliatePending: 0,
        affiliateTotalEarned: 0,
      },
    })

    return successResponse({
      message: "Successfully registered as an affiliate",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error("Affiliate registration error:", error)
    return errorResponse("Failed to register as affiliate", 500)
  }
}
