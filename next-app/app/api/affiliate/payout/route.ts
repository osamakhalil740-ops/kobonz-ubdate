import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, errorResponse, successResponse, getPaginationParams, createPaginatedResponse } from "@/lib/api-utils"
import { z } from "zod"

const payoutRequestSchema = z.object({
  amount: z.number().min(10, "Minimum payout is $10"),
  method: z.string().optional(),
  payoutEmail: z.string().email("Invalid email address"),
  payoutNotes: z.string().optional(),
})

// GET /api/affiliate/payout - Get payout requests
export async function GET(request: NextRequest) {
  const auth = await checkApiAuth(request, "affiliates:read")
  if (!auth.authorized) return auth.error

  try {
    const { page, pageSize, skip } = getPaginationParams(request)

    const [requests, total] = await Promise.all([
      prisma.payoutRequest.findMany({
        where: { userId: auth.userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.payoutRequest.count({ where: { userId: auth.userId } }),
    ])

    return createPaginatedResponse(requests, total, page, pageSize)
  } catch (error) {
    console.error("Error fetching payout requests:", error)
    return errorResponse("Failed to fetch payout requests", 500)
  }
}

// POST /api/affiliate/payout - Request payout
export async function POST(request: NextRequest) {
  const auth = await checkApiAuth(request, "affiliates:read")
  if (!auth.authorized) return auth.error

  try {
    const body = await request.json()
    const validatedData = payoutRequestSchema.parse(body)

    // Get user's available balance
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        affiliateBalance: true,
        affiliatePending: true,
      },
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    // Check if user has enough available balance
    if (user.affiliateBalance < validatedData.amount) {
      return errorResponse(
        `Insufficient available balance. You have $${user.affiliateBalance.toFixed(2)} available.`,
        400
      )
    }

    // Check for pending payout requests
    const pendingRequest = await prisma.payoutRequest.findFirst({
      where: {
        userId: auth.userId,
        status: { in: ["PENDING", "APPROVED", "PROCESSING"] },
      },
    })

    if (pendingRequest) {
      return errorResponse("You already have a pending payout request", 400)
    }

    // Create payout request
    const payoutRequest = await prisma.payoutRequest.create({
      data: {
        userId: auth.userId,
        amount: validatedData.amount,
        method: validatedData.method,
        payoutEmail: validatedData.payoutEmail,
        payoutNotes: validatedData.payoutNotes,
        status: "PENDING",
      },
    })

    // Deduct from available balance (will be returned if rejected)
    await prisma.user.update({
      where: { id: auth.userId },
      data: {
        affiliateBalance: { decrement: validatedData.amount },
      },
    })

    return successResponse(
      payoutRequest,
      "Payout request submitted successfully. We'll process it within 3-5 business days."
    )
  } catch (error) {
    console.error("Payout request error:", error)

    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message, 400)
    }

    return errorResponse("Failed to create payout request", 500)
  }
}
