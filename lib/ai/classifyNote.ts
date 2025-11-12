import { generateAIObject } from "./provider";
import { z } from "zod";

export type NoteType =
  | "idea"
  | "task"
  | "contact"
  | "link"
  | "image"
  | "voice"
  | "misc"
  | "nope"
  | "unclassified";

export type ClassificationResult = {
  type: NoteType;
  tags: string[];
};

// Zod schema for classification
const ClassificationSchema = z.object({
  type: z.enum([
    "idea",
    "task",
    "contact",
    "link",
    "image",
    "voice",
    "misc",
    "nope",
    "unclassified",
  ]),
  tags: z.array(z.string()).max(5),
});

/**
 * Classify note content using Vercel AI SDK
 * Uses cost-efficient model (gpt-4o-mini) for classification
 */
export async function classifyNoteContent(
  content: string
): Promise<ClassificationResult> {
  try {
    if (!content || content.trim().length === 0) {
      return { type: "unclassified", tags: [] };
    }

    const prompt = `Analyze this note and classify it. Return the most appropriate type and extract 1-5 relevant tags.

Note types:
- idea: creative thoughts, brainstorming, concepts
- task: action items, todos, reminders
- contact: people, names, contact info
- link: URLs, references to external content
- image: visual content, photos, screenshots
- voice: audio recordings, transcriptions
- misc: general notes that don't fit other categories
- nope: spam, irrelevant, or content to ignore
- unclassified: unable to determine type

Note content:
${content}`;

    const result = await generateAIObject({
      prompt,
      systemPrompt: "You are a note classification assistant. Analyze notes and categorize them accurately.",
      schema: ClassificationSchema,
      tier: "cheap", // Use cost-efficient model
      provider: "openai",
    });

    // Sanitize tags
    const sanitizedTags = result.object.tags
      .slice(0, 5)
      .map((tag) => tag.toLowerCase().trim())
      .filter((tag) => tag.length > 0 && tag.length < 50);

    return {
      type: result.object.type,
      tags: sanitizedTags,
    };
  } catch (error) {
    console.error("[Classification] Error classifying note:", error);
    // Return safe defaults on error
    return {
      type: "unclassified",
      tags: [],
    };
  }
}
