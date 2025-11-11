/**
 * Horizon UI Theme Configuration
 * 
 * Unified design system tokens for Klutr marketing site and app.
 * Aligned with Horizon UI patterns while maintaining Klutr brand identity.
 */

export const theme = {
  colors: {
    primary: '#2B2E3F', // Charcoal - Primary Dark
    secondary: '#00C896', // Mint Green - Accent
    accent: '#FFE8E0', // Light coral tint
    neutral: '#FAFAFA', // Neutral background
    coral: '#FF6B6B', // Coral Red - Accent 2
    mint: '#00C896', // Mint Green - Accent
    charcoal: '#2B2E3F', // Charcoal - Primary Dark
    background: '#FAFAFA',
  },
  typography: {
    heading: {
      fontFamily: 'Inter, Geist, sans-serif',
      fontWeight: 600,
    },
    body: {
      fontFamily: 'Satoshi, Geist, Inter, sans-serif',
      fontWeight: 400,
    },
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem', // 2xl equivalent
    xl: '1.25rem',
    '2xl': '1rem', // Primary border radius
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // For cards
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)', // For modals
  },
} as const

export type Theme = typeof theme

