/**
 * Spark Feature Module
 * 
 * Contextual AI assistant that analyzes and expands on notes
 */

import { generateAIText } from "@/lib/ai/provider";

export interface SparkParams {
  noteContent: string;
  userPrompt: string;
  userId?: string;
}

export async function generateSparkResponse(
  params: SparkParams
): Promise<string> {
  const { noteContent, userPrompt, userId } = params;

  const fullPrompt = `You are Spark, an AI thinking assistant. Analyze and expand on the note:

"${noteContent}"

User question: ${userPrompt}

Provide a thoughtful, contextual response that helps the user understand and explore their note.`;

  const result = await generateAIText({
    prompt: fullPrompt,
    systemPrompt: "You are Spark, a thoughtful AI thinking partner.",
    tier: "MEDIUM", // Use GPT-4o for quality responses
    feature: "spark",
    userId,
    temperature: 0.7,
  });

  return result.text;
}

