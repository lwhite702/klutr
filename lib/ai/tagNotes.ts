/**
 * AI Tagging Logic - Placeholder
 *
 * Future: This will connect to Supabase vector search or OpenAI embeddings
 * to automatically tag notes based on content analysis.
 */

/**
 * Tag notes based on content keywords
 * @param content - The note content to analyze
 * @returns Array of tag labels
 */
export async function tagNotes(content: string): Promise<string[]> {
  // Placeholder: Simple keyword-based tagging
  const keywords: Record<string, string[]> = {
    task: ["need", "remember", "check", "todo", "do"],
    idea: ["think", "consider", "maybe", "could", "idea"],
    cooking: ["recipe", "cook", "grill", "smoke", "bbq", "food"],
    gear: ["equipment", "tool", "buy", "upgrade", "purchase"],
    work: ["client", "project", "meeting", "deadline", "work"],
    contact: ["call", "email", "message", "reach out", "contact"],
    reference: ["screenshot", "image", "document", "file", "save"],
    content: ["podcast", "episode", "blog", "article", "write"],
  };

  const contentLower = content.toLowerCase();
  const detectedTags: string[] = [];

  for (const [tag, words] of Object.entries(keywords)) {
    if (words.some((word) => contentLower.includes(word))) {
      detectedTags.push(tag);
    }
  }

  // Always return at least one tag
  return detectedTags.length > 0 ? detectedTags : ["note"];
}

