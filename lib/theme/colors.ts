/**
 * Klutr Brand Color Constants
 *
 * Single source of truth for brand colors used throughout the application.
 * These values are referenced in globals.css and can be imported in TypeScript/JavaScript.
 */

// Official Klutr Brand Colors
export const brandColors = {
  charcoal: "#2B2E3F", // Primary Dark - Charcoal
  mint: "#00C896", // Accent - Mint Green
  coral: "#FF6B6B", // Accent 2 - Coral Red
  cloud: "#f8f9fa",
  slate: "#6b7280",
} as const;

export const gradientColors = {
  chaos: "#FF6B6B", // Coral
  clarity: "#00C896", // Mint
} as const;

/**
 * Generate CSS gradient string for chaos-to-clarity gradient
 */
export function getChaosClarityGradient(
  direction: "135deg" | "90deg" | "180deg" = "135deg"
): string {
  return `linear-gradient(${direction}, ${gradientColors.chaos} 0%, ${gradientColors.clarity} 100%)`;
}

/**
 * Brand color type for TypeScript usage
 */
export type BrandColor = (typeof brandColors)[keyof typeof brandColors];
export type GradientColor =
  (typeof gradientColors)[keyof typeof gradientColors];
