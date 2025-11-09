/**
 * Klutr Brand Configuration
 *
 * Centralized brand identity constants for colors, typography, logos, and animations.
 * This is the single source of truth for brand styling across the application.
 */

// Brand Colors
export const brandColors = {
  coral: "#FF6F61", // Primary brand color
  mint: "#4CD7C2", // Accent brand color
  offWhite: "#FAFAFA", // Background color
  charcoal: "#2C2C2C", // Text color
} as const;

// Typography
export const typography = {
  heading: {
    fontFamily: "Inter, system-ui, sans-serif",
    fallback: "system-ui, -apple-system, sans-serif",
  },
  body: {
    fontFamily: "Satoshi, system-ui, sans-serif",
    fallback: "system-ui, -apple-system, sans-serif",
  },
} as const;

// Logo Paths
export const logoPaths = {
  light: "/logos/klutr-logo-light-noslogan.svg",
  dark: "/logos/klutr-logo-dark-noslogan.svg",
  icon: {
    tiny: "/logos/klutr-icon-tiny.svg",
    small: "/logos/klutr-icon-small.svg",
    medium: "/logos/klutr-icon-medium.svg",
    large: "/logos/klutr-icon-large.svg",
  },
} as const;

// Animation Defaults
export const animations = {
  lightbulbGlow: {
    duration: 2,
    ease: "easeInOut",
  },
  messageTransition: {
    duration: 0.3,
    ease: "easeOut",
  },
  fadeIn: {
    duration: 0.2,
    ease: "easeIn",
  },
} as const;

// Brand Type Definitions
export type BrandColor = (typeof brandColors)[keyof typeof brandColors];
export type LogoVariant = keyof typeof logoPaths;
export type IconSize = keyof typeof logoPaths.icon;

/**
 * Get brand color by name
 */
export function getBrandColor(color: keyof typeof brandColors): string {
  return brandColors[color];
}

/**
 * Get logo path for theme
 */
export function getLogoPath(theme: "light" | "dark"): string {
  return theme === "light" ? logoPaths.light : logoPaths.dark;
}

/**
 * Get icon path by size
 */
export function getIconPath(size: IconSize): string {
  return logoPaths.icon[size];
}

