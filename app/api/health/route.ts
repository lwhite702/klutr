import { NextResponse } from "next/server";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { log } from "@/lib/logger";

/**
 * Health check endpoint for Vercel monitoring
 * 
 * Verifies connectivity to:
 * - Database (Prisma/Supabase)
 * - Supabase Auth
 * - Supabase Storage
 * - AI Provider (OpenAI)
 * 
 * Auth: None (public endpoint)
 * Response: { status: "ok"|"degraded"|"down", checks: {...}, timestamp: string }
 * Side effects: None (read-only)
 */
export async function GET() {
  const checks: Record<string, { status: "ok" | "error"; message?: string }> = {};
  let overallStatus: "ok" | "degraded" | "down" = "ok";

  // Check database connectivity
  try {
    if (isDatabaseAvailable()) {
      await prisma.user.findMany({ take: 1 });
      checks.database = { status: "ok" };
    } else {
      checks.database = { status: "error", message: "Database not available" };
      overallStatus = "degraded";
    }
  } catch (error) {
    checks.database = { 
      status: "error", 
      message: error instanceof Error ? error.message : "Database connection failed" 
    };
    overallStatus = "down";
  }

  // Check Supabase Auth
  try {
    const { data, error } = await supabaseAdmin.auth.getSession();
    if (error) {
      checks.supabaseAuth = { status: "error", message: error.message };
      overallStatus = overallStatus === "down" ? "down" : "degraded";
    } else {
      checks.supabaseAuth = { status: "ok" };
    }
  } catch (error) {
    checks.supabaseAuth = { 
      status: "error", 
      message: error instanceof Error ? error.message : "Supabase Auth check failed" 
    };
    overallStatus = overallStatus === "down" ? "down" : "degraded";
  }

  // Check Supabase Storage (list buckets)
  try {
    const { data, error } = await supabaseAdmin.storage.listBuckets();
    if (error) {
      checks.supabaseStorage = { status: "error", message: error.message };
      overallStatus = overallStatus === "down" ? "down" : "degraded";
    } else {
      checks.supabaseStorage = { status: "ok" };
    }
  } catch (error) {
    checks.supabaseStorage = { 
      status: "error", 
      message: error instanceof Error ? error.message : "Supabase Storage check failed" 
    };
    overallStatus = overallStatus === "down" ? "down" : "degraded";
  }

  // Check AI Provider (OpenAI) - lightweight check
  try {
    if (!process.env.OPENAI_API_KEY) {
      checks.aiProvider = { status: "error", message: "OPENAI_API_KEY not configured" };
      overallStatus = overallStatus === "down" ? "down" : "degraded";
    } else {
      // Just check if key exists, don't make actual API call to avoid costs
      checks.aiProvider = { status: "ok" };
    }
  } catch (error) {
    checks.aiProvider = { 
      status: "error", 
      message: error instanceof Error ? error.message : "AI Provider check failed" 
    };
    overallStatus = overallStatus === "down" ? "down" : "degraded";
  }

  // Log health check
  log.info("Health check", { overallStatus, checks });

  const statusCode = overallStatus === "down" ? 503 : overallStatus === "degraded" ? 200 : 200;

  return NextResponse.json(
    {
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    },
    { status: statusCode }
  );
}

