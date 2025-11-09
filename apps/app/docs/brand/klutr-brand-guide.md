# Klutr Brand Guide

## 1. Brand Summary

Klutr is an AI-powered notes app that blends creativity and intelligence.

The visual identity uses a split brain–bulb icon with bold navy outlines and bright coral/mint fills to represent human thought and machine insight.

## 2. Logo

### Variants

- **Primary logo**: icon + wordmark + tagline
- **Dark logo**: icon + white wordmark + mint tagline
- **Icon-only**: favicon / app icon

### Clear Space

Equal to the height of the "K" in "Klutr" on all sides.

### Minimum Sizes

- Full logo with tagline ≥ 160px width
- Wordmark only ≥ 120px
- Icon-only ≥ 32px

### Usage Rules

- Use the light logo on backgrounds lighter than #EDEEF1
- Use the dark logo on backgrounds darker than #333333
- Never alter outline color or rotate the mark
- Filament and outline are always the same color: #2B2E3F

## 3. Colors

| Name | Light | Dark | Hex |
|------|-------|------|-----|
| Wordmark | Deep Navy | White | #2B2E3F / #FFFFFF |
| Coral (brain) | #FF6B6B | #FF7D7D | |
| Mint (bulb) | #00C896 | #33E0B4 | |
| Outline / Filament | #2B2E3F | #2B2E3F | |
| Background | #F7F7F9 | #111111 | |

## 4. Typography

- **Wordmark**: bold geometric sans-serif
- **Tagline**: Montserrat Medium, all caps
- **Light mode color**: #FF6B6B
- **Dark mode color**: #00C896
- **Letter-spacing**: +0.08em
- **Placement**: 18px below baseline

## 5. Favicon / App Icon

- Simplified brain–bulb icon, no text.
- Coral left, mint right, navy outline.
- Transparent background.
- 32×32, 192×192, and apple-touch exports recommended.
- For app use, circular or rounded-square version allowed.

## 6. App UI Usage

- **Header light mode**: background #F7F7F9, light logo
- **Header dark mode**: background #111111, dark logo
- **Primary CTA**: coral (#FF6B6B) with white text
- **Secondary CTA**: mint (#00C896) with dark text
- **Outlines/icons**: always navy (#2B2E3F)

## 7. Asset Locations

All brand assets are located in `/public/brand/`:

- `klutr-logo-light.png` - Light mode logo (icon + wordmark + tagline)
- `klutr-logo-dark.png` - Dark mode logo (icon + white wordmark + mint tagline)
- `klutr-favicon.png` - Base favicon (icon-only)
- `favicon-32x32.png` - 32×32 favicon
- `favicon-192x192.png` - 192×192 favicon
- `apple-touch-icon.png` - Apple touch icon (180×180)

## 8. CSS Variables

Brand colors are available as CSS custom properties in `app/globals.css`:

**Light Mode:**
- `--klutr-wordmark`: #2B2E3F
- `--klutr-background`: #F7F7F9
- `--klutr-coral`: #FF6B6B
- `--klutr-mint`: #00C896
- `--klutr-outline`: #2B2E3F
- `--klutr-text-primary-light`: #2B2E3F
- `--klutr-text-accent-light`: #FF6B6B

**Dark Mode:**
- `--klutr-wordmark`: #FFFFFF
- `--klutr-coral`: #FF7D7D
- `--klutr-mint`: #33E0B4
- `--klutr-outline`: #2B2E3F (unchanged)
- `--klutr-text-primary-dark`: #FFFFFF
- `--klutr-text-accent-dark`: #00C896

**Common:**
- `--klutr-surface-dark`: #111111

**Tailwind Access:**
These can be accessed in Tailwind via the `--color-` prefixed variables:
- `var(--color-klutr-coral)`, `var(--color-klutr-mint)`, etc.

