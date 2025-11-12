import { prisma } from "../db"
import { openai } from "../openai"
import { retry, withTimeout } from "../utils"

export async function generateWeeklyInsights(userId: string): Promise<void> {
  try {
    // Get the start of the current week (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Adjust to Monday
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() + diff)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

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
    })

    if (notes.length === 0) {
      console.log("[v0] No notes found for weekly insights")
      return
    }

    // Prepare content for analysis
    const noteSummary = notes
      .slice(0, 50) // Limit to 50 most recent notes
      .map((n: { type: string; content: string }) => `[${n.type}] ${n.content.slice(0, 200)}`)
      .join("\n\n")

    const prompt = `Analyze these notes from the past week and provide:
1. A 2-3 sentence summary of the main themes and patterns
2. The dominant sentiment (choose one: positive, negative, mixed, neutral, determined, anxious, excited, reflective)

Notes:
${noteSummary}

Respond with JSON:
{
  "summary": "...",
  "sentiment": "..."
}`

    const result = await retry(
      async () => {
        return await withTimeout(
          openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a thoughtful analyst helping someone understand patterns in their thinking.",
              },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
          }),
          30000, // 30 second timeout
          "Insights generation timed out",
        )
      },
      { maxAttempts: 2, delayMs: 2000 },
    )

    const responseContent = result.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error("No response from OpenAI")
    }

    const parsed = JSON.parse(responseContent) as { summary: string; sentiment: string }

    // Upsert the weekly insight
    await prisma.weeklyInsight.upsert({
      where: {
        userId_weekStart: {
          userId,
          weekStart,
        },
      },
      create: {
        userId,
        weekStart,
        summary: parsed.summary,
        sentiment: parsed.sentiment,
        noteCount: notes.length,
      },
      update: {
        summary: parsed.summary,
        sentiment: parsed.sentiment,
        noteCount: notes.length,
      },
    })

    console.log(`[v0] Generated weekly insight for ${notes.length} notes`)
  } catch (error) {
    console.error("[v0] Weekly insights error:", error)
    throw new Error(`Failed to generate weekly insights: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
