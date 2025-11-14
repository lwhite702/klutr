/**
 * Utility functions for note processing
 */

/**
 * Generate a truncated title from note content
 * @param content - The full note content
 * @param maxLength - Maximum length before truncation (default: 50)
 * @returns Truncated title with ellipsis if needed
 */
export function generateNoteTitle(content: string, maxLength = 50): string {
  return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '');
}
