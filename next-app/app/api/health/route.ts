import { NextResponse } from "next/server"
import { getHealthStatus } from "@/lib/monitoring"

/**
 * Phase 7: Health Check Endpoint
 * GET /api/health
 */

export async function GET() {
  try {
    const health = await getHealthStatus()
    
    const statusCode = 
      health.status === "healthy" ? 200 :
      health.status === "degraded" ? 200 :
      503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    return NextResponse.json(
      { 
        status: "unhealthy",
        error: "Health check failed" 
      },
      { status: 503 }
    )
  }
}
