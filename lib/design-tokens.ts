/**
 * Fintask-Inspired Design Tokens
 *
 * Design tokens extracted from Fintask CSS snippets, mapped to Klutr brand colors
 * and adapted for use across marketing pages.
 */

// Color Mappings (Fintask → Klutr)
export const designColors = {
  // Fintask colors (for reference)
  fintask: {
    purple: "#975BEC",
    darkPurple: "#7345B3",
    coral: "#FC4F24",
    yellow: "#FAFF5A",
    lightYellow: "#F9F9E5",
    lightYellowBg: "#FCFCE8",
    white: "#FFFFFF",
    black: "#000000",
  },
  // Klutr brand colors
  klutr: {
    coral: "#FF6B6B", // Klutr coral (close to Fintask #FC4F24)
    mint: "#00C896", // Klutr mint (can use for primary actions)
    charcoal: "#2B2E3F", // Klutr charcoal (for text and borders)
    offWhite: "#FAFAFA", // Klutr off-white
  },
  // Mapped colors (use these in components)
  primary: "#FF6B6B", // Klutr coral for primary actions
  accent: "#975BEC", // Purple accent (or use #00C896 for mint)
  highlight: "#FAFF5A", // Yellow for featured tiers
  background: {
    light: "#F9F9E5", // Light yellow for section backgrounds
    lighter: "#FCFCE8", // Even lighter for CTA sections
    white: "#FFFFFF",
  },
  border: {
    subtle: "rgba(0, 0, 0, 0.04)",
    medium: "rgba(0, 0, 0, 0.1)",
    strong: "#000000",
  },
  text: {
    primary: "#000000",
    secondary: "rgba(0, 0, 0, 0.72)",
    muted: "rgba(0, 0, 0, 0.48)",
    light: "rgba(0, 0, 0, 0.4)",
  },
} as const;

// Typography Scale
export const typography = {
  fontFamily: {
    heading: "Inter, 'Cabinet Grotesk', system-ui, sans-serif", // Cabinet Grotesk preferred, Inter fallback
    body: "Satoshi, 'Switzer', system-ui, sans-serif", // Switzer preferred, Satoshi fallback
    button: "'Public Sans', system-ui, sans-serif",
    decorative: "'Caveat', cursive", // For FAQ label and decorative text
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    "4xl": "40px",
    "5xl": "48px",
    "6xl": "56px",
    "7xl": "64px",
    "8xl": "72px",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: "1.2",
    normal: "1.5",
    relaxed: "1.6",
  },
} as const;

// Spacing Scale
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "40px",
  "4xl": "48px",
  "5xl": "64px",
  "6xl": "80px",
} as const;

// Border Radius
export const borderRadius = {
  sm: "4px",
  md: "12px",
  lg: "24px",
  xl: "48px",
  pill: "52px", // For buttons
  full: "9999px",
} as const;

// Shadows
export const shadows = {
  header: "0px 8px 100px rgba(0, 0, 0, 0.03)",
  button: "4px 4px 0px #000000", // Brutalist style
  buttonHover: "6px 6px 0px #000000",
  card: "0px 2px 8px rgba(0, 0, 0, 0.04)",
  cardHover: "0px 4px 16px rgba(0, 0, 0, 0.08)",
} as const;

// Layout Constants
export const layout = {
  maxWidth: "1440px",
  containerPadding: {
    desktop: "80px",
    mobile: "24px",
  },
  sectionGap: {
    sm: "24px",
    md: "32px",
    lg: "40px",
    xl: "48px",
  },
  cardPadding: "32px",
  buttonPadding: {
    sm: "12px 24px",
    md: "16px 32px",
    lg: "16px 32px",
  },
} as const;

// Breakpoints (matching Tailwind defaults)
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Helper function to get color with opacity
export function withOpacity(color: string, opacity: number): string {
  // Convert hex to rgba if needed
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}

// Gradient utilities
export const gradients = {
  hero: "linear-gradient(184.97deg, #FC4F24 4%, #F3B0FF 109.29%)",
  heroKlutr: "linear-gradient(184.97deg, #FF6B6B 4%, #00C896 109.29%)", // Klutr version
} as const;
