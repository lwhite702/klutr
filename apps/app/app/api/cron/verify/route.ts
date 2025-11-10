import { NextResponse } from "next/server";

/**
 * CRON Secret Verification Endpoint
 * 
 * This endpoint validates the CRON_SECRET header to ensure cron jobs
 * and deployment validation scripts can authenticate properly.
 * 
 * Auth: Requires CRON_SECRET in Authorization header
 * Method: POST
 * Response: { ok: boolean, message: string }
 * Side effects: None (validation only)
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret) {
      console.error("[cron/verify] CRON_SECRET not configured");
      return NextResponse.json(
        { ok: false, message: "CRON_SECRET not configured" },
        { status: 500 }
      );
    }
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      console.warn("[cron/verify] Invalid CRON_SECRET attempt");
      return NextResponse.json(
        { ok: false, message: "Invalid CRON_SECRET" },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      ok: true,
      message: "CRON_SECRET verified successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[cron/verify] Verification error:", error);
    return NextResponse.json(
      { ok: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}

// Also support GET for convenience during testing
export async function GET(request: Request) {
  return POST(request);
}
