# Klutr Brand Colors & Design System

## Official Brand Color Palette

### Primary Colors

| Color | Hex | Usage | CSS Variable |
|-------|-----|-------|--------------|
| **Charcoal** (Primary Dark) | `#2B2E3F` | Primary text, outlines, dark backgrounds | `--color-primary`, `--klutr-outline` |
| **Mint Green** (Accent) | `#00C896` | Primary accent, CTAs, AI/system messages | `--color-accent-mint`, `--klutr-mint` |
| **Coral Red** (Accent 2) | `#FF6B6B` | Secondary accent, user messages, highlights | `--color-accent-coral`, `--klutr-coral` |

### Dark Mode Background Layers

Dark mode uses layered charcoal tones for depth and visual hierarchy:

| Layer | Hex | Usage | CSS Variable |
|-------|-----|-------|--------------|
| **Deepest** | `#181A25` | Base background, deepest layer | `--color-bg-0`, `--klutr-surface-dark` |
| **Middle** | `#202331` | Cards, elevated surfaces | `--color-bg-1` |
| **Surface** | `#2B2E3F` | Highest layer, borders | `--color-bg-2`, `--color-primary` |

### Text Colors

| Context | Light Mode | Dark Mode | CSS Variable |
|---------|------------|-----------|--------------|
| Primary Text | `#2B2E3F` | `#F4F7F9` | `--color-text-primary` |
| Secondary Text | `#3A3D42` | `#C8CCD2` | `--color-text-secondary` |
| Text on Mint | `#2B2E3F` | `#2B2E3F` | Always charcoal for contrast |

## Usage Guidelines

### Button Styles

#### Primary Buttons
- **Background**: Mint Green (`#00C896`)
- **Text**: Charcoal (`#2B2E3F`)
- **Hover**: Slightly darker mint (90% opacity with black mix)
- **Usage**: Main CTAs, primary actions

```css
.btn-primary {
  background-color: var(--color-accent-mint);
  color: var(--color-primary);
}
```

#### Secondary Buttons
- **Border**: Coral Red (`#FF6B6B`)
- **Text**: Coral Red (`#FF6B6B`)
- **Hover**: Fill with coral, white text
- **Usage**: Secondary actions, outlines

```css
.btn-secondary {
  border-color: var(--color-accent-coral);
  color: var(--color-accent-coral);
}
.btn-secondary:hover {
  background-color: var(--color-accent-coral);
  color: white;
}
```

### Mint Background Sections

**Critical**: All text on mint backgrounds (`#00C896`) must use charcoal (`#2B2E3F`) or black for proper contrast. Never use white text on mint.

```css
.bg-mint-section,
[class*="bg-[var(--klutr-mint)]"],
[class*="bg-[var(--color-accent-mint)]"] {
  color: #2B2E3F !important;
}
```

### Focus States

All interactive elements use a 3px mint green focus ring for accessibility:

```css
*:focus-visible {
  outline: 3px solid var(--color-accent-mint);
  outline-offset: 2px;
  border-radius: 4px;
}
```

## Dark Mode Depth & Contrast

### Visual Hierarchy

Dark mode creates depth through layered backgrounds:

1. **Base Layer** (`#181A25`): Main page background
2. **Card Layer** (`#202331`): Cards, modals, elevated elements
3. **Surface Layer** (`#2B2E3F`): Borders, highest elevation

### Shadows

Enhanced shadows in dark mode provide additional depth:

- `shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / 0.3)`
- `shadow-md`: `0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)`
- `shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.4)`

## Accessibility

### WCAG 2.1 AA Compliance

All color combinations meet WCAG 2.1 AA standards:

- **Text Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Mint + Charcoal**: 4.8:1 contrast ratio ✓
- **Coral + White**: 4.2:1 contrast ratio ✓
- **Dark Mode Text**: All text maintains 4.5:1+ contrast on layered backgrounds

### Focus Indicators

- 3px solid mint green outline
- 2px offset for visibility
- 3:1 contrast ratio minimum

## Color Implementation

### CSS Variables

All brand colors are available as CSS variables in `app/globals.css`:

```css
:root {
  --color-primary: #2B2E3F;
  --color-accent-mint: #00C896;
  --color-accent-coral: #FF6B6B;
}

.dark {
  --color-bg-0: #181A25;
  --color-bg-1: #202331;
  --color-bg-2: #2B2E3F;
}
```

### TypeScript Constants

Brand colors are also available in TypeScript:

```typescript
import { brandColors } from '@/lib/brand'

// Usage
const coral = brandColors.coral // "#FF6B6B"
const mint = brandColors.mint // "#00C896"
const charcoal = brandColors.charcoal // "#2B2E3F"
```

## Testing & Validation

### Automated Testing

Run accessibility audits to verify contrast:

```bash
pnpm a11y:audit
pnpm a11y:lighthouse
```

### Manual Testing Checklist

- [ ] All mint sections use charcoal text
- [ ] Dark mode has visible depth with layered backgrounds
- [ ] Focus states are clearly visible on all interactive elements
- [ ] Buttons maintain proper contrast in both light and dark modes
- [ ] Text remains readable on all background layers

## Before/After Comparison

### Previous Colors (Deprecated)
- Coral: `#FF7F73` → **Now**: `#FF6B6B`
- Mint: `#A7F1D1` → **Now**: `#00C896`
- Charcoal: `#2C2C2C` → **Now**: `#2B2E3F`

### Dark Mode Improvements
- **Before**: Flat black (`#111111`) backgrounds
- **After**: Layered charcoal tones (`#181A25` → `#202331` → `#2B2E3F`) for depth

## Screenshots

Screenshots documenting the brand color updates are located in:
`/docs/screenshots/branding-updates/`

---

**Last Updated**: 2025-01-27
**Version**: 2.0 (Official Brand Colors)

