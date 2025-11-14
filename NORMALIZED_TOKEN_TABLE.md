# Normalized Design Token Table

**Last Updated:** 2025-01-27  
**Status:** Unified & Documented

## Color Tokens

### Brand Colors

| Token | Light Mode | Dark Mode | Usage | Tailwind Class | CSS Variable |
|-------|------------|-----------|-------|----------------|--------------|
| Primary (Charcoal) | `#2B2E3F` | `#2B2E3F` | Main brand color, text, surfaces | `bg-primary`, `text-primary`, `border-primary` | `var(--color-primary)` |
| Accent Mint | `#00C896` | `#00C896` | Primary accent, CTAs, highlights | `bg-accent-mint`, `text-accent-mint` | `var(--color-accent-mint)` |
| Accent Coral | `#FF6B6B` | `#FF6B6B` | Secondary accent, secondary actions | `bg-accent-coral`, `text-accent-coral` | `var(--color-accent-coral)` |

**Legacy Aliases:** `mint`, `coral`, `charcoal` (backward compatible)

### UI State Colors

| Token | Light Mode | Dark Mode | Usage | Tailwind Class | CSS Variable |
|-------|------------|-----------|-------|----------------|--------------|
| Background | `#FFFFFF` | `#1B1D29` | Main background | `bg-background` | `var(--color-background)` |
| Foreground | `#2B2E3F` | `#F5F7FA` | Primary text | `text-foreground` | `var(--color-foreground)` |
| Card | `#FFFFFF` | `#232634` | Card backgrounds | `bg-card` | `var(--color-card)` |
| Card Foreground | `#2B2E3F` | `#F5F7FA` | Card text | `text-card-foreground` | `var(--color-card-foreground)` |
| Border | `oklch(0.85 0 0)` | `#2B2E3F` | Borders, dividers | `border-border` | `var(--color-border)` |
| Muted | `oklch(0.97 0 0)` | `#232634` | Muted backgrounds | `bg-muted` | `var(--color-muted)` |
| Muted Foreground | `oklch(0.556 0 0)` | `#C7CAD4` | Muted text | `text-muted-foreground` | `var(--color-muted-foreground)` |
| Destructive | `oklch(0.577 0.245 27.325)` | `oklch(0.396 0.141 25.723)` | Error states | `bg-destructive`, `text-destructive` | `var(--color-destructive)` |
| Ring | `oklch(0.708 0 0)` | `#00C896` | Focus rings | `ring-ring` | `var(--color-ring)` |

### Layered Backgrounds

| Token | Light Mode | Dark Mode | Usage | Tailwind Class | CSS Variable |
|-------|------------|-----------|-------|----------------|--------------|
| BG-0 | `#fdfdfd` | `#1B1D29` | Deepest layer | `bg-bg-0` | `var(--color-bg-0)` |
| BG-1 | `#f8f8f8` | `#232634` | Middle layer | `bg-bg-1` | `var(--color-bg-1)` |
| BG-2 | `#f0f2f5` | `#2B2E3F` | Surface layer | `bg-bg-2` | `var(--color-bg-2)` |

### Text Colors

| Token | Light Mode | Dark Mode | Usage | Tailwind Class | CSS Variable |
|-------|------------|-----------|-------|----------------|--------------|
| Text Primary | `#2B2E3F` | `#F5F7FA` | Primary text | `text-text-primary` | `var(--color-text-primary)` |
| Text Secondary | `#3A3D42` | `#C7CAD4` | Secondary text | `text-text-secondary` | `var(--color-text-secondary)` |

## Typography Tokens

### Font Families

| Token | Value | Usage | CSS Variable |
|-------|-------|-------|--------------|
| Display | `Inter, Geist, system-ui` | Headings | `var(--font-display)` |
| Body | `Satoshi, Geist, Inter, system-ui` | Body text | `var(--font-body)` |
| Mono | `Geist Mono, system monospace` | Code, monospace | `var(--font-mono)` |

### Font Sizes

| Token | Value | Pixels | Usage | Tailwind Class |
|-------|-------|--------|-------|----------------|
| xs | `0.75rem` | 12px | Small labels | `text-xs` |
| sm | `0.875rem` | 14px | Small text | `text-sm` |
| base | `1rem` | 16px | Body default | `text-base` |
| lg | `1.125rem` | 18px | Large body | `text-lg` |
| xl | `1.25rem` | 20px | Small headings | `text-xl` |
| 2xl | `1.5rem` | 24px | Medium headings | `text-2xl` |
| 3xl | `1.875rem` | 30px | Large headings | `text-3xl` |
| 4xl | `2.25rem` | 36px | Extra large headings | `text-4xl` |
| 5xl | `3rem` | 48px | Hero headings | `text-5xl` |

### Font Weights

| Token | Value | Usage | Tailwind Class |
|-------|-------|-------|----------------|
| thin | `100` | Thin text | `font-thin` |
| light | `300` | Light text | `font-light` |
| normal | `400` | Body default | `font-normal` |
| medium | `500` | Medium emphasis | `font-medium` |
| semibold | `600` | Headings default | `font-semibold` |
| bold | `700` | Strong emphasis | `font-bold` |

### Line Heights

| Token | Value | Usage | Tailwind Class |
|-------|-------|-------|----------------|
| Body | `1.6` | Paragraphs | `leading-relaxed` |
| Tight | `1.25` | Headings | `leading-tight` |
| None | `1` | Single line | `leading-none` |

## Spacing Tokens (4px Rhythm)

| Token | Value | Pixels | Usage | Tailwind Class |
|-------|-------|--------|-------|----------------|
| 0 | `0` | 0px | No spacing | `p-0`, `m-0`, `gap-0` |
| 1 | `0.25rem` | 4px | Minimal spacing | `p-1`, `m-1`, `gap-1` |
| 2 | `0.5rem` | 8px | Small spacing | `p-2`, `m-2`, `gap-2` |
| 3 | `0.75rem` | 12px | Medium-small | `p-3`, `m-3`, `gap-3` |
| 4 | `1rem` | 16px | Medium spacing | `p-4`, `m-4`, `gap-4` |
| 6 | `1.5rem` | 24px | **Card padding** | `p-6`, `m-6`, `gap-6` |
| 8 | `2rem` | 32px | Large spacing | `p-8`, `m-8`, `gap-8` |
| 12 | `3rem` | 48px | Extra large | `p-12`, `m-12`, `gap-12` |
| 16 | `4rem` | 64px | Section spacing | `p-16`, `m-16` |
| 24 | `6rem` | 96px | **Section vertical** | `py-24` |

### Common Patterns

| Pattern | Value | Usage |
|---------|-------|-------|
| Card padding | `p-6` (24px) | Standard card padding |
| Card gap | `gap-6` (24px) | Standard card internal spacing |
| Button padding | `px-4 py-2` (16px/8px) | Standard button padding |
| Input padding | `px-3 py-1` (12px/4px) | Standard input padding |
| Section spacing | `py-24` (96px) | Marketing section vertical spacing |

## Border Radius Tokens

| Token | Value | Pixels | Usage | Tailwind Class | CSS Variable |
|-------|-------|--------|-------|----------------|--------------|
| sm | `0.5rem` | 8px | Small elements, chips | `rounded-sm` | `var(--radius-sm)` |
| md | `0.75rem` | 12px | Buttons, inputs (default) | `rounded-md` | `var(--radius-md)` |
| lg | `1rem` | 16px | Cards, modals (primary) | `rounded-lg` | `var(--radius-lg)` |
| xl | `1.25rem` | 20px | Large cards | `rounded-xl` | `var(--radius-xl)` |
| 2xl | `1rem` | 16px | Marketing sections | `rounded-2xl` | `var(--radius-2xl)` |
| full | `9999px` | - | Pills, avatars | `rounded-full` | - |
| card | `1rem` | 16px | Card default | `rounded-card` | `var(--radius-card)` |
| input | `0.5rem` | 8px | Input default | `rounded-input` | `var(--radius-input)` |
| chip | `9999px` | - | Chips, pills | `rounded-chip` | `var(--radius-chip)` |

## Shadow Tokens

| Token | Value | Usage | Tailwind Class | CSS Variable |
|-------|-------|-------|----------------|--------------|
| xs | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Subtle elevation (inputs) | `shadow-xs` | `var(--shadow-xs)` |
| sm | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Small elevation (buttons) | `shadow-sm` | `var(--shadow-sm)` |
| md | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Medium elevation (cards hover) | `shadow-md` | `var(--shadow-md)` |
| lg | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Large elevation (cards, panels) | `shadow-lg` | `var(--shadow-lg)` |
| xl | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | Extra large (modals, dropdowns) | `shadow-xl` | `var(--shadow-xl)` |
| 2xl | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | Maximum elevation (marketing) | `shadow-2xl` | `var(--shadow-2xl)` |
| depth | `0 4px 12px rgba(0, 0, 0, 0.25)` | Enhanced depth | `shadow-depth` | `var(--shadow-depth)` |

### Dark Mode Shadows

Dark mode uses enhanced opacity for better depth perception:
- `shadow-sm-dark`: `0 1px 2px 0 rgb(0 0 0 / 0.3)`
- `shadow-md-dark`: `0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)`
- `shadow-lg-dark`: `0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.4)`

Applied automatically via `.dark` selector.

## Motion & Animation Tokens

### Durations

| Token | Value | Usage | Tailwind Class |
|-------|-------|-------|----------------|
| fast | `150ms` | Micro-interactions | `duration-fast` |
| DEFAULT | `200ms` | Standard transitions | `duration-200` or default |
| slow | `300ms` | Complex animations | `duration-slow` or `duration-300` |

### Easing Functions

| Token | Value | Usage | Tailwind Class |
|-------|-------|-------|----------------|
| DEFAULT | `ease-out` | Most transitions | Default or `ease-out` |
| smooth | `ease-in-out` | Complex animations | `ease-in-out` |
| snappy | `ease-in` | Entrances | `ease-in` |

### Common Patterns

| Pattern | Classes | Usage |
|---------|---------|-------|
| Hover | `transition-colors duration-200` | Color changes |
| Shadow | `transition-shadow duration-200` | Shadow changes |
| Transform | `transition-transform duration-300` | Scale, translate |
| All | `transition-all duration-300` | Multiple properties |

## Icon Sizing Tokens

| Token | Value | Pixels | Usage | Tailwind Class |
|-------|-------|--------|-------|----------------|
| xs | `0.75rem` | 12px | Inline with small text | `size-3` |
| sm | `1rem` | 16px | Default button icons | `size-4` |
| md | `1.25rem` | 20px | Medium buttons, headers | `size-5` |
| lg | `1.5rem` | 24px | Large buttons, feature icons | `size-6` |
| xl | `2rem` | 32px | Hero sections, marketing | `size-8` |

**Default:** `size-4` (16px)

## Component-Specific Tokens

### Buttons

| Property | Default | Small | Large |
|----------|---------|-------|-------|
| Height | `h-9` (36px) | `h-8` (32px) | `h-10` (40px) |
| Padding | `px-4 py-2` | `px-3` | `px-6` |
| Radius | `rounded-md` (12px) | `rounded-md` | `rounded-md` |
| Shadow | `shadow-sm` | `shadow-sm` | `shadow-sm` |

### Cards

| Property | Value | Token |
|----------|-------|-------|
| Padding | `p-6` (24px) | Standard |
| Gap | `gap-6` (24px) | Standard |
| Radius | `rounded-lg` (16px) | Primary |
| Shadow | `shadow-sm` (default), `shadow-md` (hover) | Standard |

### Inputs

| Property | Value | Token |
|----------|-------|-------|
| Height | `h-9` (36px) | Standard |
| Padding | `px-3 py-1` (12px/4px) | Standard |
| Radius | `rounded-md` (8px) | Input token |
| Shadow | `shadow-xs` | Subtle |

### Modals/Dialogs

| Property | Value | Token |
|----------|-------|-------|
| Radius | `rounded-lg` (16px) | Primary |
| Padding | `p-6` (24px) | Standard |
| Shadow | `shadow-lg` or `shadow-xl` | Elevated |
| Max Width | `max-w-lg` (512px) | Default |

## Usage Guidelines

### When to Use Tokens

1. **Always use tokens** for colors, spacing, radius, shadows
2. **Prefer Tailwind classes** over CSS variables when possible
3. **Use CSS variables** for dynamic theming or complex calculations
4. **Use semantic names** (`primary`, `accent-mint`) over literal names (`charcoal`, `mint-green`)

### Migration Priority

1. ✅ **Core tokens** - Unified in Tailwind config and CSS
2. ✅ **Critical components** - Fixed hardcoded values
3. ⏳ **Marketing components** - Legacy tokens still functional
4. ⏳ **Spacing audit** - Validate consistency across components
5. ⏳ **Typography audit** - Verify font usage consistency

## Token Naming Conventions

1. **Semantic over literal**: `primary` not `charcoal`, `accent-mint` not `mint-green`
2. **Consistent prefixes**: CSS vars use `--color-`, Tailwind uses direct names
3. **Mode-aware**: Light/dark variants handled automatically via CSS variables
4. **Component-specific**: Use semantic names (`card`, `input`) not generic (`bg-1`, `surface-2`)

## Future Enhancements

- [ ] Opacity scale tokens (10, 20, 30, etc.)
- [ ] Z-index scale tokens
- [ ] Breakpoint tokens documentation
- [ ] TypeScript types for token values
- [ ] Token usage linting rules
