# UI Components Documentation

Version: 1.0  
Last updated: 2025-01-XX (America/New_York)

## Overview

This document describes reusable Horizon UI-inspired components for both the Klutr marketing site and app. All components are built on top of shadcn/ui and styled to match Horizon UI patterns while maintaining Klutr's coral and mint brand identity.

## Design System

### Base Framework

- **UI Library:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS v4
- **Design Inspiration:** Horizon UI Tailwind PRO Kit
- **Theme Configuration:** `lib/ui/theme.ts`

### Core Principles

1. **Consistency:** All components use the same design tokens
2. **Accessibility:** Built on Radix UI for full keyboard and screen reader support
3. **Responsive:** Mobile-first design with breakpoint considerations
4. **Dark Mode:** Full support for light and dark themes
5. **Performance:** Optimized animations and minimal re-renders

## Component Categories

### Marketing Components

#### Hero Component

**Location:** `components/marketing/Hero.tsx`

**Features:**
- Animated lightbulb hero element
- Tagline: "Organize your chaos."
- Coral/mint gradient backgrounds
- Horizon UI button variants with rounded-2xl
- Framer Motion animations

**Usage:**
```tsx
<Hero
  heroHeadline="Clear the clutr. Keep the spark."
  heroSubtext="Klutr is the frictionless inbox for your brain..."
  primaryCTA="Try for Free"
  secondaryCTA="Log in"
/>
```

#### FeatureGrid Component

**Location:** `components/marketing/FeatureGrid.tsx`

**Features:**
- Interactive cards with hover states
- Horizon UI card patterns (rounded-2xl, shadow-xl)
- Gradient icon backgrounds
- Smooth transitions and animations

**Usage:**
```tsx
<FeatureGrid features={features} />
```

### App Components

#### StreamMessage Component

**Location:** `components/stream/StreamMessage.tsx`

**Features:**
- Chat-like message bubbles
- User messages: coral background, right-aligned
- System messages: mint background, left-aligned
- File previews and image thumbnails
- Tag chips integration

**Usage:**
```tsx
<StreamMessage drop={drop} isUser={true} />
```

#### DropZone Component

**Location:** `components/stream/DropZone.tsx`

**Features:**
- Drag-and-drop file upload overlay
- Visual feedback on drag over
- Horizon UI dropzone patterns
- Backdrop blur and shadow-2xl

**Usage:**
```tsx
<DropZone onDrop={handleFileUpload}>
  {children}
</DropZone>
```

#### StreamInput Component

**Location:** `components/stream/StreamInput.tsx`

**Features:**
- Chat-style input bar
- Rounded-2xl border radius
- Coral send button with shadow-xl
- Auto-expanding textarea

**Usage:**
```tsx
<StreamInput
  onSend={handleSend}
  onFileUpload={handleFileUpload}
  placeholder="Type your thoughts..."
/>
```

#### InsightCard Component

**Location:** `components/insights/InsightCard.tsx`

**Features:**
- Data visualization cards
- Horizon UI card styling
- Sentiment badges
- Hover effects with shadow-xl

**Usage:**
```tsx
<InsightCard
  week="Week of Jan 1, 2025"
  summary="Your notes show a focus on..."
  sentiment="positive"
/>
```

## Layout Components

### AppShell

**Location:** `components/layout/AppShell.tsx`

**Features:**
- Horizon dashboard layout
- Sidebar navigation
- Mint gradient topbar
- Responsive mobile navigation

### TopBar

**Location:** `components/layout/TopBar.tsx`

**Features:**
- Mint gradient background (`from-[var(--klutr-mint)]/10`)
- Search input
- Theme toggle
- User menu

## Design Patterns

### Cards

**Pattern:**
- Border radius: `rounded-2xl`
- Shadow: `shadow-lg` (default), `shadow-xl` (hover)
- Border: `border-[var(--klutr-outline)]/20`
- Hover: `hover:shadow-xl transition-all duration-300`

**Example:**
```tsx
<Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-[var(--klutr-outline)]/20">
  {/* content */}
</Card>
```

### Buttons

**Primary Button:**
- Background: `bg-[var(--klutr-coral)]`
- Hover: `hover:bg-[var(--klutr-coral)]/90`
- Border radius: `rounded-2xl`
- Shadow: `shadow-xl`

**Example:**
```tsx
<Button className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white rounded-2xl shadow-xl">
  Get Started
</Button>
```

### Message Bubbles

**User Messages:**
- Background: `bg-[var(--klutr-coral)]`
- Text: `text-white`
- Alignment: `justify-end`
- Border radius: `rounded-2xl rounded-br-sm`

**System Messages:**
- Background: `bg-[var(--klutr-mint)]/20 dark:bg-[var(--klutr-mint)]/10`
- Text: `text-[var(--klutr-text-primary-light)]`
- Alignment: `justify-start`
- Border radius: `rounded-2xl rounded-bl-sm`

### Badges & Tags

**Pattern:**
- Border radius: `rounded-2xl`
- Background: `bg-[var(--klutr-mint)]/20`
- Border: `border-[var(--klutr-mint)]/40`

**Example:**
```tsx
<Badge className="rounded-2xl bg-[var(--klutr-mint)]/20 border-[var(--klutr-mint)]/40">
  Tag Label
</Badge>
```

## Typography Classes

### Headings

- `font-display` - Inter font family for headings
- `font-semibold` or `font-bold` - Heading weights

### Body Text

- `font-body` - Geist/Satoshi font family for body
- `leading-relaxed` - Comfortable line height

## Animation Patterns

### Framer Motion

**Fade In Up:**
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}
```

**Stagger Children:**
```tsx
variants={{
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}}
```

### Lightbulb Glow

**CSS Class:**
```css
.lightbulb-glow {
  filter: drop-shadow(0 0 8px rgba(255, 127, 115, 0.4));
  transition: filter 0.3s ease-in-out;
}
```

## Responsive Breakpoints

- **Mobile:** Default (< 768px)
- **Tablet:** `md:` (≥ 768px)
- **Desktop:** `lg:` (≥ 1024px)
- **Wide:** `xl:` (≥ 1280px)

## Dark Mode Support

All components automatically support dark mode via:
- CSS variables that change with `.dark` class
- `next-themes` ThemeProvider
- Tailwind `dark:` variants

## Best Practices

1. **Use CSS Variables:** Always reference brand colors via CSS variables, not hardcoded values
2. **Consistent Spacing:** Use Tailwind spacing scale consistently
3. **Accessibility:** Include proper ARIA labels and keyboard navigation
4. **Performance:** Use Framer Motion sparingly, prefer CSS transitions when possible
5. **Responsive:** Test all components at mobile, tablet, and desktop breakpoints
6. **Dark Mode:** Test components in both light and dark themes

## Component Checklist

When creating new components:

- [ ] Uses Horizon UI design patterns (rounded-2xl, shadow-xl/2xl)
- [ ] Supports dark mode
- [ ] Responsive across all breakpoints
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Uses brand colors via CSS variables
- [ ] Typography uses font-display/font-body classes
- [ ] Animations are smooth and performant
- [ ] Follows Wrelik brand voice guidelines

## References

- **Brand Guidelines:** `/docs/brand-guidelines.md`
- **Theme Configuration:** `/lib/ui/theme.ts`
- **shadcn/ui Docs:** https://ui.shadcn.com
- **Horizon UI:** Figma design reference

