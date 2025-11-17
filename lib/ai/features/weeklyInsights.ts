/**
 * Weekly Insights Feature Module
 * 
 * AI-generated weekly summaries and pattern analysis
 */

import { generateAIText, generateAIObject } from "@/lib/ai/provider";
import { z } from "zod";

export interface WeeklySummaryParams {
  notes: Array<{ content: string; createdAt: Date }>;
  topTags: string[];
  noteCount: number;
  userId?: string;
}

const InsightsSchema = z.object({
  summary: z.string(),
  keyThemes: z.array(z.string()),
  patterns: z.array(z.string()),
  suggestions: z.array(z.string()),
});

/**
 * Generate weekly summary with insights
 */
export async function generateWeeklySummary(
  params: WeeklySummaryParams
): Promise<{
  summary: string;
  keyThemes: string[];
  patterns: string[];
  suggestions: string[];
}> {
  const { notes, topTags, noteCount, userId } = params;

  const sampleContent = notes
    .slice(0, 30)
    .map((note) => note.content.slice(0, 100))
    .join("\n- ");

  const prompt = `Analyze this user's week based on their notes.

Total notes: ${noteCount}
Top themes: ${topTags.join(", ")}

Sample notes:
- ${sampleContent}

Provide:
1. A concise summary (3-4 sentences) capturing main themes and activities
2. Key themes identified this week
3. Interesting patterns in note-taking behavior
4. Helpful suggestions for next week

Return as JSON with: summary, keyThemes (array), patterns (array), suggestions (array)`;

  const result = await generateAIObject({
    prompt,
    systemPrompt:
      "You are a note analysis assistant. Create engaging, actionable weekly insights.",
    schema: InsightsSchema,
    tier: "MEDIUM", // Use GPT-4o for quality insights
    feature: "weekly-insights",
    userId,
  });

  return result.object;
}

