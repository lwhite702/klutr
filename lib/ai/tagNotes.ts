/**
 * AI Tagging Logic
 *
 * Uses keyword-based tagging with fallback. Future: Will use OpenAI embeddings
 * and semantic similarity to find similar notes and suggest tags.
 */

/**
 * Tag notes based on content keywords
 * @param content - The note content to analyze
 * @returns Array of tag labels
 */
export async function tagNotes(content: string): Promise<string[]> {
  // Enhanced keyword-based tagging with better patterns
  const keywords: Record<string, string[]> = {
    task: ["need", "remember", "check", "todo", "do", "should", "must", "remind"],
    idea: ["think", "consider", "maybe", "could", "idea", "thought", "wonder"],
    cooking: ["recipe", "cook", "grill", "smoke", "bbq", "food", "meal", "kitchen"],
    gear: ["equipment", "tool", "buy", "upgrade", "purchase", "device", "hardware"],
    work: ["client", "project", "meeting", "deadline", "work", "job", "business"],
    contact: ["call", "email", "message", "reach out", "contact", "person", "someone"],
    reference: ["screenshot", "image", "document", "file", "save", "link", "url"],
    content: ["podcast", "episode", "blog", "article", "write", "post", "video"],
    research: ["study", "learn", "research", "read", "book", "paper", "article"],
    personal: ["family", "friend", "home", "personal", "life", "health"],
  };

  const contentLower = content.toLowerCase();
  const detectedTags: string[] = [];
  const tagScores: Record<string, number> = {};

  // Score tags based on keyword matches
  for (const [tag, words] of Object.entries(keywords)) {
    const matches = words.filter((word) => contentLower.includes(word)).length;
    if (matches > 0) {
      tagScores[tag] = matches;
    }
  }

  // Sort by score and take top 5
  const sortedTags = Object.entries(tagScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  // Always return at least one tag
  return sortedTags.length > 0 ? sortedTags : ["note"];
}

