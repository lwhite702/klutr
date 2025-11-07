# Klutr Brand Redesign - Phase 1 Documentation

## Overview

This document tracks the brand redesign preparation phase for Klutr, including route migrations, typography configuration, and brand token setup.

## Route Migration

### New Routes Created

All new routes are located in `/app/(app)/`:

- **Flux** (`/app/flux`) - Replaces `/app/app` (Notes)
- **Orbit** (`/app/orbit`) - Replaces `/app/mindstorm` (MindStorm)
- **Pulse** (`/app/pulse`) - Replaces `/app/insights` (Insights)
- **Vault** (`/app/vault`) - Existing feature, placeholder created
- **Stacks** (`/app/stacks`) - Existing feature, placeholder created
- **Spark** (`/app/spark`) - New feature: Contextual AI Assistant
- **Muse** (`/app/muse`) - New feature: Creative Exploration

### Redirects

Route redirects are configured in `next.config.mjs`:

- `/app` → `/app/flux` (permanent: false)
- `/app/mindstorm` → `/app/orbit` (permanent: false)
- `/app/insights` → `/app/pulse` (permanent: false)

### Current Status

All routes currently display placeholder content: "Coming soon in the Klutr beta."

Spark and Muse include animated UI shells:
- **Spark**: Coral pulsing glow animation (opacity animation)
- **Muse**: Mint rotation animation (360° continuous rotation)

## Typography

### Font Configuration

**Display Font (Headings):**
- **Primary**: Inter (via Next.js font optimization)
- **Fallback**: Geist, sans-serif
- **Usage**: `font-display` class or `var(--font-display)`
- **CSS Variable**: `--font-display`

**Body Font:**
- **Primary**: Geist (existing)
- **Fallback**: Inter, sans-serif
- **Usage**: `font-body` class or `var(--font-body)`
- **CSS Variable**: `--font-body`

### Implementation

Fonts are configured in:
- `app/layout.tsx`: Inter imported via `next/font/google`
- `app/globals.css`: Font variables defined in `@theme` block

### Note on Satoshi

Satoshi font is not available in the npm registry (`@fontsource/satoshi`). Geist is used as the body font with Inter as fallback. If Satoshi becomes available or is needed, it can be added via:
- Google Fonts (if available)
- Custom font loading
- Alternative font service

## Color Palette

### Brand Colors

All colors are defined in `app/globals.css` under the `@theme` block:

| Color | Hex | CSS Variable | Tailwind Class |
|-------|-----|--------------|----------------|
| Coral | #FF6B6B | `--color-coral` | `text-coral`, `bg-coral` |
| Mint | #3EE0C5 | `--color-mint` | `text-mint`, `bg-mint` |
| Charcoal | #111827 | `--color-charcoal` | `text-charcoal`, `bg-charcoal` |
| Cloud | #F8F9FA | `--color-cloud` | `text-cloud`, `bg-cloud` |
| Slate | #6B7280 | `--color-slate` | `text-slate`, `bg-slate` |

### Gradient Tokens

| Token | Color | CSS Variable | Usage |
|-------|-------|--------------|-------|
| Chaos | #FF6B6B | `--color-chaos` | Start of gradient |
| Clarity | #3EE0C5 | `--color-clarity` | End of gradient |

### Gradient Utility

A utility class is available for the chaos-to-clarity gradient:

```css
.bg-chaos-clarity {
  background: linear-gradient(135deg, #FF6B6B 0%, #3EE0C5 100%);
}
```

Usage: `className="bg-chaos-clarity"`

## Next Steps

### Phase 2: Full Feature Implementation

1. **Navigation Updates**
   - Update `SidebarNav.tsx` with new feature names
   - Add Spark and Muse to navigation
   - Update icons and colors to match brand

2. **Feature Redesigns**
   - **Flux**: Implement Stream View, coral FAB, coral-to-mint visual metaphor
   - **Orbit**: Implement orbit map visualization, Constellation mode, mint accents
   - **Pulse**: Implement Mind Pulse digest, Echo Finder, Focus Drift, mint gradients
   - **Vault**: Add coral-to-mint lock transition, Privacy Rings UI
   - **Stacks**: Add coral progress bars, mint momentum meters

3. **Spark Feature**
   - Build inline AI assistance UI
   - Implement contextual suggestion system
   - Create `/api/spark/suggest` endpoint
   - Add coral glow animation for "thinking" state

4. **Muse Feature**
   - Build AI remix interface
   - Implement "Chaos Dice" button
   - Create `/api/muse/remix` endpoint
   - Add iridescent gradient overlay and kinetic particles

5. **Landing Page**
   - Update hero section with new brand messaging
   - Add animated preview of Flux → Orbit → Pulse transitions
   - Update feature showcase with new names

6. **Documentation**
   - Update Mintlify docs with new feature names
   - Create internal docs for Spark and Muse architecture

## Technical Notes

- All routes use `AppShell` component for consistent layout
- Framer Motion is used for animations (already installed)
- Color tokens are accessible via Tailwind classes
- Typography uses Next.js font optimization for performance
- Route redirects are non-permanent to allow for future changes

## Dependencies

- `@fontsource/inter`: Installed
- `framer-motion`: Already installed
- `next`: Already installed (16.0.0)

## Files Modified

- `app/layout.tsx`: Added Inter font import
- `app/globals.css`: Added typography and color tokens
- `next.config.mjs`: Added route redirects
- `CHANGELOG.md`: Added Phase 1 entry

## Files Created

- `app/(app)/flux/page.tsx`
- `app/(app)/orbit/page.tsx`
- `app/(app)/pulse/page.tsx`
- `app/(app)/vault/page.tsx` (placeholder)
- `app/(app)/stacks/page.tsx` (placeholder)
- `app/(app)/spark/page.tsx` (animated shell)
- `app/(app)/muse/page.tsx` (animated shell)
- `docs/internal/brand-redesign.md` (this file)

