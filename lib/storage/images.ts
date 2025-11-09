/**
 * Image Processing Utilities
 *
 * Handles image optimization and thumbnail generation
 */

/**
 * Validate image file
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Image type ${file.type} not supported. Use JPEG, PNG, GIF, or WebP.`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Image size exceeds 10MB limit.`,
    };
  }

  return { valid: true };
}

/**
 * Create image thumbnail URL (placeholder - future: use Supabase Image Transform)
 */
export function getThumbnailUrl(
  imageUrl: string,
  width: number = 300,
  height: number = 300
): string {
  // For now, return original URL
  // Future: Use Supabase Image Transform API
  // return `${imageUrl}?width=${width}&height=${height}&resize=cover`
  return imageUrl;
}

/**
 * Get image dimensions (placeholder - future: extract from image metadata)
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

