import { NextResponse } from "next/server"

/**
 * CRON_SECRET Verification Endpoint
 * 
 * Validates that requests include the correct CRON_SECRET in the Authorization header.
 * Used by deployment validation scripts to verify cron authentication is configured.
 * 
 * Auth: Bearer token must match CRON_SECRET env var
 * Response: { success: boolean, message: string }
 * Side effects: None (read-only)
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.CRON_SECRET
    
    if (!expectedSecret) {
      console.error("[cron/verify] CRON_SECRET not configured")
      return NextResponse.json(
        { success: false, message: "CRON_SECRET not configured" },
        { status: 500 }
      )
    }
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Missing Authorization header" },
        { status: 401 }
      )
    }
    
    const providedSecret = authHeader.replace(/^Bearer\s+/i, '').trim()
    
    if (providedSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: "Invalid CRON_SECRET" },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "CRON_SECRET validated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[cron/verify] Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
