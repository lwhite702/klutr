import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { createErrorResponse } from "@/lib/validation/middleware";
import { generateAIText } from "@/lib/ai/provider";

/**
 * POST /api/insights/generate
 * Generate AI insights from user's notes
 * 
 * Analyzes recent notes and provides insights about:
 * - Common themes and patterns
 * - Activity trends
 * - Suggested actions
 */
export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse("Database not available", 503);
    }

    const user = await getCurrentUser(req);

    // Get user's recent notes (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentNotes = await prisma.note.findMany({
      where: {
        userId: user.id,
        archived: false,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Analyze up to 100 recent notes
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (recentNotes.length === 0) {
      return NextResponse.json({
        insights: [],
        message: "Not enough notes to generate insights. Start capturing your thoughts!",
      });
    }

    // Aggregate note data for analysis
    const noteTypes = recentNotes.reduce((acc: Record<string, number>, note: typeof recentNotes[number]) => {
      acc[note.type] = (acc[note.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allTags = recentNotes.flatMap((note: typeof recentNotes[number]) => 
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

    const clusters = recentNotes
      .filter((n: typeof recentNotes[number]) => n.cluster)
      .reduce((acc: Record<string, number>, note: typeof recentNotes[number]) => {
        acc[note.cluster!] = (acc[note.cluster!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Sample recent note content for AI analysis
    const sampleNotes = recentNotes
      .slice(0, 20)
      .map((note: typeof recentNotes[number]) => `- ${note.content.slice(0, 100)}`)
      .join('\n');

    // Generate insights using AI
    const prompt = `Analyze this user's note-taking patterns and generate 3-4 insights.

Note statistics (last 30 days):
- Total notes: ${recentNotes.length}
- Note types: ${JSON.stringify(noteTypes)}
- Top tags: ${topTags.join(', ')}
- Active clusters: ${Object.keys(clusters).length}

Sample recent notes:
${sampleNotes}

Generate insights about:
1. Common themes or topics they're focusing on
2. Their note-taking patterns or habits
3. Potential areas of interest or growth
4. Suggested next actions or areas to explore

Format each insight as a concise, actionable observation (2-3 sentences).
Return as a JSON array of objects with "title" and "description" fields.`;

    const result = await generateAIText({
      prompt,
      systemPrompt: "You are an insightful note analysis assistant. Provide helpful, actionable insights based on user's note patterns.",
      tier: "medium", // Use GPT-4o for better quality insights
      provider: "openai",
    });

    // Parse AI response (should be JSON array)
    let insights;
    try {
      // Extract JSON from response
      const jsonMatch = result.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: parse as plain text and structure it
        const lines = result.text.split('\n').filter(l => l.trim());
        insights = lines.map((line, idx) => ({
          id: `insight-${idx}`,
          title: `Insight ${idx + 1}`,
          description: line.replace(/^[-*]\s*/, '').trim(),
          type: 'pattern',
        }));
      }
    } catch (parseError) {
      console.error("[Insights] Failed to parse AI response:", parseError);
      // Fallback insights based on data
      insights = [
        {
          id: 'insight-tags',
          title: 'Your focus areas',
          description: `You've been actively tagging notes with: ${topTags.slice(0, 3).join(', ')}. This shows focused thinking in these areas.`,
          type: 'top-tags',
        },
        {
          id: 'insight-activity',
          title: 'Note-taking momentum',
          description: `You've created ${recentNotes.length} notes in the last 30 days. Keep up the momentum!`,
          type: 'activity',
        },
      ];
    }

    // Add metadata to insights
    const enrichedInsights = insights.map((insight: any, idx: number) => ({
      id: insight.id || `insight-${idx}`,
      title: insight.title,
      description: insight.description,
      type: insight.type || 'pattern',
      generatedAt: new Date().toISOString(),
      relevance: 'high',
    }));

    // Store insights in database for caching
    // (Optional: implement if you want to persist insights)

    return NextResponse.json({
      insights: enrichedInsights,
      statistics: {
        noteCount: recentNotes.length,
        topTags,
        typeDistribution: noteTypes,
        clusterCount: Object.keys(clusters).length,
      },
      usage: result.usage,
    });
  } catch (error) {
    console.error("[API] Generate insights error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to generate insights",
      500
    );
  }
}

/**
 * GET /api/insights/generate
 * Get cached insights or generate new ones
 */
export async function GET(req: NextRequest) {
  // For now, just call POST to generate
  // In future, could implement caching logic here
  return POST(req);
}
