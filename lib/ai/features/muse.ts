/**
 * Muse Feature Module
 * 
 * Creative remix engine that combines two ideas into novel insights
 */

import { generateAIText } from "@/lib/ai/provider";

export interface MuseParams {
  ideaA: string;
  ideaB: string;
  userId?: string;
}

export async function generateMuseRemix(params: MuseParams): Promise<string> {
  const { ideaA, ideaB, userId } = params;

  const prompt = `You are Muse, an idea remixer. Combine these two notes into a novel insight.

Idea A: "${ideaA}"

Idea B: "${ideaB}"

Return one short paragraph that blends both ideas creatively. Be insightful and original.`;

  const result = await generateAIText({
    prompt,
    systemPrompt: "You are Muse, a creative idea synthesis engine.",
    tier: "MEDIUM", // Use GPT-4o for creative quality
    feature: "muse",
    userId,
    temperature: 0.9, // Higher creativity
  });

  return result.text;
}

