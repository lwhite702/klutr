import { NextResponse } from "next/server";

/**
 * Health check endpoint for Vercel monitoring
 * 
 * Auth: None (public endpoint)
 * Response: { status: "ok", timestamp: string, environment: string }
 * Side effects: None (read-only)
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
}

