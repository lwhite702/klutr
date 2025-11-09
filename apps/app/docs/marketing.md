# Marketing Landing Page

Version: 1.0  
Last updated: 2025-11-06 (America/New_York)

## Overview

The marketing landing page at `/` (served from `app/(marketing)/page.tsx`) is a lightweight, static page designed to convert visitors into beta users. It does not use AppShell and is optimized for SEO and conversion.

## Design Reference

**Figma Design:**  
https://www.figma.com/design/TeAPwzKXgegTYEnp5Rp1bE/Landing-Page-for-Note-Taking-App--Community-?node-id=31-239

## Page Structure

### Header/Navigation
- **Location:** Sticky header at top of page
- **Components:**
  - Klutr logo (light/dark variants based on theme)
  - Navigation links: Features, Pricing, Discover, About
  - Auth buttons: Log in, Sign Up
- **Behavior:** Sticky positioning with backdrop blur

### Hero Section
- **Headline:** "Note taking, made simple"
- **Subheadline:** Highlights "Free Beta now open" with brand color accent
- **CTAs:**
  - Primary: "Try for Free" (links to `/login`)
  - Secondary: "Learn More" (scrolls to features)
- **Visual:** App mockup placeholder (to be replaced with actual screenshot)
- **Layout:** Two-column on desktop, stacked on mobile

### Features Grid Section
- **Location:** Below hero section
- **Features:**
  1. **MindStorm** - AI-powered clustering
  2. **QuickCapture** - Instant capture of any content
  3. **Smart Stacks** - Intelligent collections
- **Layout:** Responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- **Components:** shadcn/ui Card components with icons from lucide-react
- **Animation:** Framer Motion scroll-triggered fade-in

### Beta CTA Banner
- **Background:** Accent color `#33C3F0` (cyan)
- **Message:** "Free Beta now open"
- **CTA:** "Get Started Free" button
- **Purpose:** Prominent conversion point mid-page

### Footer
- **Sections:**
  - Brand logo and tagline
  - Product links (Features, Pricing)
  - Company links (About, Discover)
  - Legal links (Privacy, Terms)
- **Copyright:** Dynamic year with Klutr branding

## Brand Colors

The landing page uses specific brand colors defined in `app/globals.css`:

```css
--landing-primary: #9B87F5;    /* Purple - primary actions */
--landing-accent: #33C3F0;      /* Cyan - beta banner */
--landing-bg: #F7F7F9;          /* Light gray - page background */
--landing-text: #111827;       /* Dark gray - text */
```

### Usage Guidelines
- **Primary (`#9B87F5`):** Used for primary CTAs, feature icons, hover states
- **Accent (`#33C3F0`):** Used for beta CTA banner background
- **Background (`#F7F7F9`):** Main page background
- **Text (`#111827`):** Primary text color

## SEO Metadata

Defined in `app/(marketing)/layout.tsx`:

- **Title:** "Klutr | Free Beta"
- **Description:** "Capture notes, links, and lists — let AI organize your thoughts. Free beta now available."
- **OpenGraph:** Includes title, description, URL, and image reference

## Accessibility

- All CTAs have descriptive `aria-label` attributes
- Semantic HTML structure (header, main, section, footer)
- Proper heading hierarchy (h1 in hero, h2 for sections)
- Keyboard navigation support
- Sufficient color contrast (WCAG AA compliant)

## Responsive Breakpoints

- **Mobile (< 768px):** Single column, stacked sections
- **Tablet (768px - 1024px):** 2-column feature grid
- **Desktop (> 1024px):** 3-column feature grid, side-by-side hero layout

## Animation

Uses Framer Motion for:
- Hero section: Staggered fade-in on mount
- Features grid: Scroll-triggered fade-in
- Beta banner: Scroll-triggered fade-in

## CTA Placement and Messaging

### Primary CTAs
1. **Hero section:** "Try for Free" - Above the fold
2. **Beta banner:** "Get Started Free" - Mid-page emphasis
3. **Feature cards:** "Try Now" - Per-feature engagement

### Messaging Strategy
- Emphasize "Free Beta" throughout
- Highlight AI-powered organization
- Focus on ease of use and frictionless capture
- No credit card required messaging

## Screenshots

Screenshots of the implemented landing page should be added here for reference:
- [ ] Desktop view
- [ ] Mobile view
- [ ] Tablet view

## Future Enhancements

- Replace app mockup placeholder with actual screenshot
- Add testimonials section
- Add social proof (user count, etc.)
- Add video demo
- A/B test CTA copy and placement

