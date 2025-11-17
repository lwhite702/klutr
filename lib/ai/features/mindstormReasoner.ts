/**
 * MindStorm Reasoner Feature Module
 * 
 * AI-powered reasoning for note clustering and theme detection
 */

import { generateAIObject, generateAIText } from "@/lib/ai/provider";
import { z } from "zod";

export interface ClusterAnalysisParams {
  notes: Array<{ id: string; content: string }>;
  userId?: string;
}

const ClusterSchema = z.object({
  clusters: z.array(
    z.object({
      theme: z.string(),
      noteIds: z.array(z.string()),
      confidence: z.number().min(0).max(1),
    })
  ),
});

/**
 * Analyze notes and suggest optimal clustering
 */
export async function analyzeNoteClusters(
  params: ClusterAnalysisParams
): Promise<{ theme: string; noteIds: string[]; confidence: number }[]> {
  const { notes, userId } = params;

  if (notes.length === 0) return [];

  const notesSample = notes.slice(0, 50); // Limit for token efficiency

  const prompt = `Analyze these notes and group them by theme:

${notesSample.map((n, i) => `${i + 1}. [${n.id}] ${n.content.slice(0, 100)}`).join("\n")}

Group related notes together and identify the theme for each cluster. Return JSON with:
- clusters: array of { theme, noteIds, confidence }`;

  const result = await generateAIObject({
    prompt,
    systemPrompt:
      "You are a note clustering specialist. Group related notes by theme.",
    schema: ClusterSchema,
    tier: "CHEAP", // Use cost-efficient model for clustering
    feature: "mindstorm",
    userId,
  });

  return result.object.clusters;
}

/**
 * Generate cluster name from notes
 */
export async function generateClusterName(params: {
  notes: string[];
  userId?: string;
}): Promise<string> {
  const { notes, userId } = params;

  const prompt = `Generate a short, descriptive name (2-3 words) for a cluster containing these notes:

${notes.slice(0, 10).map((n, i) => `${i + 1}. ${n.slice(0, 80)}`).join("\n")}

Return only the cluster name, nothing else.`;

  const result = await generateAIText({
    prompt,
    systemPrompt: "You are a concise cluster naming assistant.",
    tier: "CHEAP",
    feature: "mindstorm",
    userId,
    temperature: 0.5,
  });

  return result.text.trim().replace(/["']/g, "");
}

