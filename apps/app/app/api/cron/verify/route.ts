import { NextResponse } from "next/server";

/**
 * CRON_SECRET Verification Endpoint
 * 
 * Validates that the Authorization header contains the correct CRON_SECRET.
 * Used by deployment validation scripts to verify cron authentication is configured correctly.
 * 
 * Auth: Requires Authorization: Bearer <CRON_SECRET> header
 * Response: { success: boolean, message?: string, error?: string }
 * Side effects: None (read-only validation)
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret) {
      return NextResponse.json(
        { 
          success: false, 
          error: "CRON_SECRET not configured in environment" 
        },
        { status: 500 }
      );
    }
    
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing Authorization header" 
        },
        { status: 401 }
      );
    }
    
    const providedSecret = authHeader.replace(/^Bearer\s+/i, '');
    
    if (providedSecret !== expectedSecret) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid CRON_SECRET" 
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "CRON_SECRET validated successfully",
    });
  } catch (error) {
    console.error("[cron/verify] Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
