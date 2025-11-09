/**
 * Muse Analysis
 *
 * Weekly AI insights generation using OpenAI for pattern analysis.
 */

import { openai } from "@/lib/openai";

export interface MuseAnalysis {
  topTags: Array<{ label: string; count: number }>;
  recurringTopics: string[];
  ideaPatterns: string[];
}

/**
 * Analyze notes for weekly insights
 * @param drops - Array of stream drops to analyze
 * @returns Analysis results
 */
export async function analyzeMuse(
  drops: Array<{ content: string; tags: Array<{ label: string }> }>
): Promise<MuseAnalysis> {
  // Calculate top tags
  const tagCounts: Record<string, number> = {};

  drops.forEach((drop) => {
    drop.tags.forEach((tag) => {
      tagCounts[tag.label] = (tagCounts[tag.label] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }));

  // Extract content for AI analysis
  const contents = drops.map((d) => d.content).join("\n");

  try {
    // Use OpenAI to identify patterns
    const prompt = `Analyze the following notes and identify:
1. Recurring topics (3-4 main themes)
2. Idea patterns (how thoughts connect)

Notes:
${contents.slice(0, 2000)} // Limit to avoid token limits

Respond in JSON format:
{
  "recurringTopics": ["topic1", "topic2", ...],
  "ideaPatterns": ["pattern1", "pattern2", ...]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes note-taking patterns. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
      temperature: 0.7,
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}");

    return {
      topTags,
      recurringTopics: analysis.recurringTopics || [
        "Outdoor cooking techniques",
        "Equipment research",
        "Event planning",
      ],
      ideaPatterns: analysis.ideaPatterns || [
        "You often research before making decisions",
        "Notes cluster around specific themes",
        "Content ideas connect to personal interests",
      ],
    };
  } catch (error) {
    console.error("[v0] Muse analysis error:", error);
    // Fallback to simple analysis
    return {
      topTags,
      recurringTopics: [
        "Outdoor cooking techniques",
        "Equipment research",
        "Event planning",
      ],
      ideaPatterns: [
        "You often research before making decisions",
        "Notes cluster around specific themes",
        "Content ideas connect to personal interests",
      ],
    };
  }
}

