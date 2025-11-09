# Brand Assets

This directory contains all Klutr brand assets.

## Required Files

When logo assets are available, move and rename them as follows:

- `1.png` → `klutr-logo-light.png` (light mode logo with wordmark + tagline)
- `2.png` → `klutr-logo-dark.png` (dark mode logo with wordmark + tagline)
- `3.png`, `4.png`, `5.png` → Evaluate and use as:
  - `klutr-favicon.png` (base favicon, icon-only)
  - `favicon-32x32.png` (32×32 favicon)
  - `favicon-192x192.png` (192×192 favicon)
  - `apple-touch-icon.png` (180×180 apple touch icon)

## File Specifications

### Logo Files
- **Light logo**: Use on backgrounds lighter than #EDEEF1
- **Dark logo**: Use on backgrounds darker than #333333
- Minimum size with tagline: 160px width
- Minimum size without tagline: 120px width

### Favicon Files
- Icon-only (no text)
- Brain-bulb icon with coral left, mint right, navy outline
- Transparent background
- Standard sizes: 32×32, 192×192, 180×180

## Usage

Files in this directory are served from `/brand/` path (Next.js public directory).

Example: `/brand/klutr-logo-light.png` is accessible at `http://localhost:3000/brand/klutr-logo-light.png`

