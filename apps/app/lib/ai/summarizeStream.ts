/**
 * Stream Summarization
 *
 * Generates AI summaries of stream activity using OpenAI.
 */

import { openai } from "@/lib/openai";

/**
 * Summarize stream drops
 * @param drops - Array of stream drops to summarize
 * @returns Summary text
 */
export async function summarizeStream(
  drops: Array<{ content: string; tags: Array<{ label: string }> }>
): Promise<string> {
  if (drops.length === 0) {
    return "Your stream is empty. Start adding drops to see summaries.";
  }

  try {
    // Build context from drops
    const recentDrops = drops.slice(0, 10).map((d) => d.content).join("\n");
    const tagCounts: Record<string, number> = {};
    
    drops.forEach((drop) => {
      drop.tags.forEach((tag) => {
        tagCounts[tag.label] = (tagCounts[tag.label] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => `${tag} (${count})`)
      .join(", ");

    // Use OpenAI to generate summary
    const prompt = `Summarize the following stream of notes in 2-3 sentences. Focus on main themes and patterns.

Recent notes:
${recentDrops}

Top tags: ${topTags}

Summary:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes note-taking patterns.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || `Your stream contains ${drops.length} drops. Top themes: ${topTags}.`;
  } catch (error) {
    console.error("[v0] Summarization error:", error);
    // Fallback to simple summary
    const tagCounts: Record<string, number> = {};
    drops.forEach((drop) => {
      drop.tags.forEach((tag) => {
        tagCounts[tag.label] = (tagCounts[tag.label] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);
    return `Your stream contains ${drops.length} drops. Top themes: ${topTags.join(", ")}.`;
  }

