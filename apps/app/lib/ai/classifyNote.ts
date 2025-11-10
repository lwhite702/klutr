import { supabase } from "../supabase";
import { retry, withTimeout } from "@klutr/utils";

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

export async function classifyNoteContent(
  content: string
): Promise<ClassificationResult> {
  try {
    const result = await retry(
      async () => {
        return await withTimeout(
          supabase.functions.invoke("classify-note", {
            body: { content },
          }),
          15000, // 15 second timeout
          "Classification request timed out"
        );
      },
      { maxAttempts: 2, delayMs: 1000 }
    );

    const data = result.data || result;

    // Validate the response
    const validTypes: NoteType[] = [
      "idea",
      "task",
      "contact",
      "link",
      "image",
      "voice",
      "misc",
      "nope",
      "unclassified",
    ];
    if (!validTypes.includes(data.type)) {
      data.type = "unclassified";
    }

    // Ensure tags is an array
    if (!Array.isArray(data.tags)) {
      data.tags = [];
    }

    // Limit to 5 tags and sanitize
    data.tags = data.tags
      .slice(0, 5)
      .map((tag: string) => String(tag).toLowerCase().trim())
      .filter((tag: string) => tag.length > 0 && tag.length < 50);

    return data as ClassificationResult;
  } catch (error) {
    console.error("[v0] Classification error:", error);
    // Return safe defaults on error
    return {
      type: "unclassified",
      tags: [],
    };
  }
}
