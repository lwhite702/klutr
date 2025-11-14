/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - use CSS variables for theme support
        primary: 'var(--color-primary)',
        'accent-mint': 'var(--color-accent-mint)',
        'accent-coral': 'var(--color-accent-coral)',
        // Legacy brand color names (for backward compatibility)
        mint: 'var(--color-accent-mint)',
        coral: 'var(--color-accent-coral)',
        charcoal: 'var(--color-primary)',
        // UI colors from CSS variables
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        popover: 'var(--color-popover)',
        'popover-foreground': 'var(--color-popover-foreground)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        destructive: 'var(--color-destructive)',
        'destructive-foreground': 'var(--color-destructive-foreground)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        // Sidebar colors
        sidebar: 'var(--color-sidebar)',
        'sidebar-foreground': 'var(--color-sidebar-foreground)',
        'sidebar-primary': 'var(--color-sidebar-primary)',
        'sidebar-primary-foreground': 'var(--color-sidebar-primary-foreground)',
        'sidebar-accent': 'var(--color-sidebar-accent)',
        'sidebar-accent-foreground': 'var(--color-sidebar-accent-foreground)',
        'sidebar-border': 'var(--color-sidebar-border)',
        'sidebar-ring': 'var(--color-sidebar-ring)',
        // Chart colors
        'chart-1': 'var(--color-chart-1)',
        'chart-2': 'var(--color-chart-2)',
        'chart-3': 'var(--color-chart-3)',
        'chart-4': 'var(--color-chart-4)',
        'chart-5': 'var(--color-chart-5)',
        // Brand accent colors
        'brand-indigo': 'var(--color-brand-indigo)',
        'brand-lime': 'var(--color-brand-lime)',
        'brand-coral': 'var(--color-brand-coral)',
        'brand-indigo-foreground': 'var(--color-brand-indigo-foreground)',
        'brand-lime-foreground': 'var(--color-brand-lime-foreground)',
        'brand-coral-foreground': 'var(--color-brand-coral-foreground)',
        // Layered backgrounds
        'bg-0': 'var(--color-bg-0)',
        'bg-1': 'var(--color-bg-1)',
        'bg-2': 'var(--color-bg-2)',
        // Text colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      borderRadius: {
        // Use CSS variables for consistent theming
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        card: 'var(--radius-card)',
        input: 'var(--radius-input)',
        chip: 'var(--radius-chip)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        depth: 'var(--shadow-depth)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        fast: '150ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease-out',
      },
    },
  },
  plugins: [],
}

