import { prisma } from "../db";
import { supabase } from "../supabase";
import { retry, withTimeout } from "@/lib/utils";

export async function generateWeeklyInsights(userId: string): Promise<void> {
  try {
    // Get the start of the current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    // Fetch notes from the past week
    const notes = await prisma.note.findMany({
      where: {
        userId,
        createdAt: {
          gte: weekStart,
          lt: weekEnd,
        },
        archived: false,
      },
      select: {
        content: true,
        type: true,
        cluster: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (notes.length === 0) {
      console.log("[v0] No notes found for weekly insights");
      return;
    }

    // Prepare content for analysis
    const noteSummary = notes
      .slice(0, 50) // Limit to 50 most recent notes
      .map((n: any) => `[${n.type}] ${n.content.slice(0, 200)}`)
      .join("\n\n");

    // Use Supabase Edge Function for insights generation
    const result = await retry(
      async () => {
        return await withTimeout(
          supabase.functions.invoke("generate-insights", {
            body: { userId },
          }),
          30000, // 30 second timeout
          "Insights generation timed out"
        );
      },
      { maxAttempts: 2, delayMs: 2000 }
    );

    const parsed = result.data || {
      summary: "Analyzing your notes...",
      sentiment: "neutral",
    };

    // Edge function handles the upsert, but we can also do it here if needed
    const { data: existing } = (await prisma.weeklyInsight?.findFirst?.({
      where: {
        userId,
        weekStart,
      },
    })) || { data: null };

    if (existing) {
      await prisma.weeklyInsight?.update?.({
        where: { id: existing.id },
        data: {
          summary: parsed.summary,
          sentiment: parsed.sentiment,
          noteCount: notes.length,
        },
      });
    } else {
      await prisma.weeklyInsight?.create?.({
        data: {
          userId,
          weekStart,
          summary: parsed.summary,
          sentiment: parsed.sentiment,
          noteCount: notes.length,
        },
      });
    }

    console.log(`[v0] Generated weekly insight for ${notes.length} notes`);
  } catch (error) {
    console.error("[v0] Weekly insights error:", error);
    throw new Error(
      `Failed to generate weekly insights: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
