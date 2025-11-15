import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { createErrorResponse } from "@/lib/validation/middleware";

/**
 * GET /api/weekly-summaries/list
 * Get user's weekly summaries
 * 
 * Query params:
 * - limit: number of summaries to return (default: 10)
 */
export async function GET(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse("Database not available", 503);
    }

    const user = await getCurrentUser(req);
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    const summaries = await prisma.weeklyInsight.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        weekStart: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      summaries: summaries.map(s => ({
        id: s.id,
        summary: s.summary,
        startDate: s.startDate,
        endDate: s.endDate,
        noteCount: s.noteCount,
        topTags: s.topTags,
        createdAt: s.createdAt,
      })),
      total: summaries.length,
    });
  } catch (error) {
    console.error("[API] List weekly summaries error:", error);
    return createErrorResponse("Failed to fetch weekly summaries", 500);
  }
}
