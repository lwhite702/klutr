/**
 * Board Suggestions
 *
 * AI-suggested board groupings based on note patterns and clustering.
 */

export interface BoardSuggestion {
  name: string;
  description: string;
  tags: Array<{ label: string }>;
  confidence: number;
}

/**
 * Suggest boards based on note patterns
 * @param drops - Array of stream drops to analyze
 * @returns Array of board suggestions
 */
export async function suggestBoard(
  drops: Array<{ content: string; tags: Array<{ label: string }> }>
): Promise<BoardSuggestion[]> {
  // Analyze tag patterns
  const tagCounts: Record<string, number> = {};
  const tagContents: Record<string, string[]> = {};

  drops.forEach((drop) => {
    drop.tags.forEach((tag) => {
      tagCounts[tag.label] = (tagCounts[tag.label] || 0) + 1;
      if (!tagContents[tag.label]) {
        tagContents[tag.label] = [];
      }
      tagContents[tag.label].push(drop.content);
    });
  });

  const suggestions: BoardSuggestion[] = [];

  // Suggest boards for tags that appear frequently
  const frequentTags = Object.entries(tagCounts)
    .filter(([, count]) => count >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  frequentTags.forEach(([tag, count]) => {
    // Generate better board name and description
    const name = tag
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    const sampleContent = tagContents[tag]?.slice(0, 3).join(", ") || "";
    const description = sampleContent.length > 100
      ? `${sampleContent.substring(0, 100)}...`
      : `Notes related to ${tag}`;

    suggestions.push({
      name: `${name} Board`,
      description,
      tags: [{ label: tag }],
      confidence: Math.min(count / 10, 1),
    });
  });

  return suggestions;
}

