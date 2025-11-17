/**
 * Stacks Feature Module
 * 
 * AI-powered smart stack generation and summarization
 */

import { generateAIText, generateAIObject } from "@/lib/ai/provider";
import { z } from "zod";

export interface StackGenerationParams {
  clusterName: string;
  notes: Array<{ id: string; content: string }>;
  userId?: string;
}

const StackSummarySchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
  tags: z.array(z.string()),
});

/**
 * Generate stack summary from cluster
 */
export async function generateStackSummary(
  params: StackGenerationParams
): Promise<{ summary: string; keyPoints: string[]; tags: string[] }> {
  const { clusterName, notes, userId } = params;

  const notesSample = notes
    .slice(0, 20)
    .map((n, i) => `${i + 1}. ${n.content.slice(0, 150)}`)
    .join("\n");

  const prompt = `Create a summary for a note cluster named "${clusterName}":

Notes in this cluster:
${notesSample}

Provide:
1. A concise summary (2-3 sentences) of what this stack is about
2. Key points (3-5 bullet points)
3. Relevant tags (3-5 tags)

Return as JSON with: summary, keyPoints (array), tags (array)`;

  const result = await generateAIObject({
    prompt,
    systemPrompt:
      "You are a stack summarization assistant. Create clear, actionable summaries.",
    schema: StackSummarySchema,
    tier: "CHEAP", // Use cost-efficient model
    feature: "stacks",
    userId,
  });

  return result.object;
}

