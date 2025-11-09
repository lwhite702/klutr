/**
 * Drop Classification - Placeholder
 *
 * Future: AI classification of drops (text, image, file, voice)
 * using computer vision and content analysis.
 */

export type DropClassification = "text" | "image" | "file" | "voice";

/**
 * Classify a drop based on its content
 * @param content - The drop content
 * @param fileType - Optional file MIME type
 * @returns Classification type
 */
export async function classifyDrop(
  content: string,
  fileType?: string
): Promise<DropClassification> {
  // Placeholder: Simple classification based on file type
  if (fileType) {
    if (fileType.startsWith("image/")) {
      return "image";
    }
    if (fileType.startsWith("audio/")) {
      return "voice";
    }
    return "file";
  }

  // Default to text if no file type
  return "text";
}

