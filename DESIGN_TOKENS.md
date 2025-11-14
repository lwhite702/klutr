# Klutr Design Token System

**Last Updated:** 2025-01-27

## Overview

This document defines the unified design token system for Klutr. All design values should reference these tokens rather than hardcoded values.

## Color Tokens

### Brand Colors (Semantic)
- **Primary (Charcoal)**: `#2B2E3F` - Main brand color, used for text and surfaces
- **Accent Mint**: `#00C896` - Primary accent, used for CTAs and highlights
- **Accent Coral**: `#FF6B6B` - Secondary accent, used for secondary actions

### Usage in Code
- **CSS Variables**: `var(--color-primary)`, `var(--color-accent-mint)`, `var(--color-accent-coral)`
- **Tailwind Classes**: `bg-primary`, `text-accent-mint`, `border-accent-coral`
- **TypeScript**: `brandColors.charcoal`, `brandColors.mint`, `brandColors.coral`

### UI State Colors
- **Background**: Light `#FFFFFF` / Dark `#1B1D29`
- **Foreground**: Light `#2B2E3F` / Dark `#F5F7FA`
- **Card**: Light `#FFFFFF` / Dark `#232634`
- **Border**: Light `oklch(0.85 0 0)` / Dark `#2B2E3F`
- **Muted**: Light `oklch(0.97 0 0)` / Dark `#232634`
- **Destructive**: `oklch(0.577 0.245 27.325)` (light) / `oklch(0.396 0.141 25.723)` (dark)

## Typography

### Font Families
- **Display/Headings**: `Inter` (fallback: `Geist`, system fonts)
- **Body**: `Satoshi` (fallback: `Geist`, `Inter`, system fonts)
- **Mono**: `Geist Mono` (fallback: system monospace)

### Font Sizes (Tailwind Scale)
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px) - **Body default**
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)
- `text-5xl`: 3rem (48px)

### Font Weights
- `font-thin`: 100
- `font-light`: 300
- `font-normal`: 400 - **Body default**
- `font-medium`: 500
- `font-semibold`: 600 - **Headings default**
- `font-bold`: 700

### Line Heights
- Body: `1.6` (default)
- Headings: `leading-tight` or `leading-none`
- Small text: `leading-relaxed`

## Spacing Scale (4px Rhythm)

All spacing uses Tailwind's default 4px rhythm:
- `0`: 0px
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `12`: 3rem (48px)
- `16`: 4rem (64px)
- `24`: 6rem (96px)

### Common Patterns
- **Card padding**: `p-6` (24px)
- **Card gap**: `gap-6` (24px)
- **Button padding**: `px-4 py-2` (16px horizontal, 8px vertical)
- **Input padding**: `px-3 py-1` (12px horizontal, 4px vertical)
- **Section spacing**: `py-24` (96px vertical)

## Border Radius

- **sm**: `0.5rem` (8px) - Small elements, chips
- **md**: `0.75rem` (12px) - Buttons, inputs (default)
- **lg**: `1rem` (16px) - Cards, modals (primary)
- **xl**: `1.25rem` (20px) - Large cards
- **2xl**: `1rem` (16px) - Marketing sections
- **full**: `9999px` - Pills, avatars

### CSS Variables
- `--radius`: `1rem` (16px) - Primary radius
- `--radius-card`: `1rem` (16px)
- `--radius-input`: `0.5rem` (8px)
- `--radius-chip`: `9999px`

## Shadows

### Depth Levels
- **xs**: `shadow-xs` - Subtle elevation (inputs)
- **sm**: `shadow-sm` - Small elevation (buttons)
- **md**: `shadow-md` - Medium elevation (cards hover)
- **lg**: `shadow-lg` - Large elevation (cards, panels)
- **xl**: `shadow-xl` - Extra large (modals, dropdowns)
- **2xl**: `shadow-2xl` - Maximum elevation (marketing cards)

### Dark Mode
Dark mode shadows use increased opacity for better depth perception.

## Motion & Animations

### Durations
- **Fast**: `duration-150` (150ms) - Micro-interactions
- **Default**: `duration-200` (200ms) - Standard transitions
- **Slow**: `duration-300` (300ms) - Complex animations

### Easing
- **Default**: `ease-out` - Most transitions
- **Smooth**: `ease-in-out` - Complex animations
- **Snappy**: `ease-in` - Entrances

### Common Patterns
- **Hover**: `transition-colors duration-200`
- **Shadow**: `transition-shadow duration-200`
- **Transform**: `transition-transform duration-300`
- **All**: `transition-all duration-300`

## Icon Sizing

- **xs**: `size-3` (12px) - Inline with small text
- **sm**: `size-4` (16px) - Default button icons
- **md**: `size-5` (20px) - Medium buttons, headers
- **lg**: `size-6` (24px) - Large buttons, feature icons
- **xl**: `size-8` (32px) - Hero sections, marketing

### Usage Pattern
```tsx
<Icon className="size-4" /> // Default
<Icon className="h-5 w-5" /> // Explicit sizing
```

## Component-Specific Tokens

### Buttons
- **Height**: Default `h-9` (36px), Small `h-8` (32px), Large `h-10` (40px)
- **Padding**: Default `px-4 py-2`, Small `px-3`, Large `px-6`
- **Radius**: `rounded-md` (12px)
- **Shadow**: `shadow-sm` (default), `shadow-md` (dark mode)

### Cards
- **Padding**: `p-6` (24px)
- **Gap**: `gap-6` (24px)
- **Radius**: `rounded-lg` (16px) or `rounded-xl` (16px)
- **Shadow**: `shadow-sm` (default), `shadow-md` (hover)

### Inputs
- **Height**: `h-9` (36px)
- **Padding**: `px-3 py-1` (12px horizontal, 4px vertical)
- **Radius**: `rounded-md` (8px)
- **Shadow**: `shadow-xs`

### Modals/Dialogs
- **Radius**: `rounded-lg` (16px)
- **Padding**: `p-6` (24px)
- **Shadow**: `shadow-lg` or `shadow-xl`
- **Max width**: `max-w-lg` (512px) default

## Migration Guide

### Replacing Hardcoded Colors
```tsx
// ❌ Bad
<div className="text-[#2B2E3F]">
<button style={{ backgroundColor: '#00C896' }}>

// ✅ Good
<div className="text-primary">
<button className="bg-accent-mint">
```

### Replacing Hardcoded Spacing
```tsx
// ❌ Bad
<div style={{ padding: '24px', gap: '16px' }}>

// ✅ Good
<div className="p-6 gap-4">
```

### Replacing Hardcoded Radius
```tsx
// ❌ Bad
<div className="rounded-[12px]">

// ✅ Good
<div className="rounded-md">
```

## Token Naming Conventions

1. **Semantic over literal**: Use `primary` not `charcoal`, `accent-mint` not `mint-green`
2. **Consistent prefixes**: CSS vars use `--color-`, Tailwind uses direct names
3. **Mode-aware**: Light/dark variants handled automatically via CSS variables
4. **Component-specific**: Use semantic names (`card`, `input`) not generic (`bg-1`, `surface-2`)

## Future Considerations

- Consider adding opacity scale tokens (10, 20, 30, etc.)
- Standardize z-index scale
- Add breakpoint tokens documentation
- Create TypeScript types for token values
