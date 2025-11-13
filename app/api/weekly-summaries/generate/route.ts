import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { createErrorResponse } from "@/lib/validation/middleware";
import { generateAIText } from "@/lib/ai/provider";

/**
 * POST /api/weekly-summaries/generate
 * Generate weekly summary from user's notes
 * 
 * Creates a summary of the past week's notes
 */
export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse("Database not available", 503);
    }

    const user = await getCurrentUser(req);

    // Get notes from the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyNotes = await prisma.note.findMany({
      where: {
        userId: user.id,
        archived: false,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (weeklyNotes.length === 0) {
      return NextResponse.json({
        summary: null,
        message: "No notes from the past week to summarize.",
      });
    }

    // Aggregate weekly data
    const allTags = weeklyNotes.flatMap((note: typeof weeklyNotes[number]) => 
      note.tags.map((nt: typeof note.tags[number]) => nt.tag.name)
    );
    const tagCounts = allTags.reduce((acc: Record<string, number>, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([tag]) => tag);

    // Sample notes for AI
    const sampleContent = weeklyNotes
      .slice(0, 30)
      .map((note: typeof weeklyNotes[number]) => note.content.slice(0, 100))
      .join('\n- ');

    // Generate weekly summary using AI
    const prompt = `Summarize this user's week based on their notes.

Week period: ${oneWeekAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}
Total notes: ${weeklyNotes.length}
Top themes: ${topTags.join(', ')}

Sample notes:
- ${sampleContent}

Create a concise, engaging summary (3-4 sentences) that:
1. Captures the main themes and activities
2. Highlights any patterns or focus areas
3. Uses a warm, encouraging tone`;

    const result = await generateAIText({
      prompt,
      systemPrompt: "You are a helpful note summarization assistant. Create engaging weekly summaries.",
      tier: "cheap", // Use cost-efficient model
      provider: "openai",
    });

    const summary = result.text.trim();

    // Store summary in database
    const weeklySummary = await prisma.weeklySummary.create({
      data: {
        userId: user.id,
        startDate: oneWeekAgo,
        endDate: new Date(),
        summary,
        noteCount: weeklyNotes.length,
        topTags,
      },
    });

    return NextResponse.json({
      summary: {
        id: weeklySummary.id,
        summary: weeklySummary.summary,
        startDate: weeklySummary.startDate,
        endDate: weeklySummary.endDate,
        noteCount: weeklySummary.noteCount,
        topTags: weeklySummary.topTags,
      },
      usage: result.usage,
    });
  } catch (error) {
    console.error("[API] Generate weekly summary error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to generate weekly summary",
      500
    );
  }
}
