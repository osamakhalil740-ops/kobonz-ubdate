import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkApiAuth, errorResponse, successResponse } from "@/lib/api-utils"

// PATCH /api/admin/stores/[id]/reject - Reject a store
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await checkApiAuth(request, "stores:verify")
  if (!auth.authorized) return auth.error

  try {
    const store = await prisma.store.findUnique({
      where: { id: params.id },
    })

    if (!store) {
      return errorResponse("Store not found", 404)
    }

    const updatedStore = await prisma.store.update({
      where: { id: params.id },
      data: {
        isVerified: false,
        isActive: false,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    })

    return successResponse(updatedStore, "Store rejected successfully")
  } catch (error) {
    console.error("Error rejecting store:", error)
    return errorResponse("Failed to reject store", 500)
  }
}
