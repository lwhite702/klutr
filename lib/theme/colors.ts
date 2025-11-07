/**
 * Klutr Brand Color Constants
 *
 * Single source of truth for brand colors used throughout the application.
 * These values are referenced in globals.css and can be imported in TypeScript/JavaScript.
 */

export const brandColors = {
  coral: "#ff6b6b",
  mint: "#3ee0c5",
  charcoal: "#111827",
  cloud: "#f8f9fa",
  slate: "#6b7280",
} as const;

export const gradientColors = {
  chaos: "#ff6b6b",
  clarity: "#3ee0c5",
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
