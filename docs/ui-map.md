# UI Surface Vocabulary

This document maps the shared design primitives used across all feature views in the Notes or Nope application.

## Figma → Component Mapping

This design language comes from the "Bookmark App — Community" Figma file and is now canonical for the first shipped aesthetic. The following mappings describe how Figma concepts translate to shipped components:

- **SidebarNav** → Persistent left rail navigation for /app routes

  - Renders navigation links to Notes, MindStorm, Stacks, Vault, Insights, Memory, Nope
  - Part of AppShell layout component

- **PageHeader** → Page-level heading bar (Figma top row on BBQ/Podcast/Wishlist)

  - Displays page title, optional description, and action buttons
  - Consistent spacing and typography across all pages

- **CardGrid** → Responsive tile layout

  - Adapts from 1 column (mobile) to 4 columns (desktop)
  - Provides consistent spacing and gap management

- **ItemCard** → Bookmark/tile style card with tags and actions

  - Displays thumbnail, title, description, tags, and action buttons
  - Supports favorite/pin functionality and custom actions

- **TagChip** → Pill-style metadata label

  - Used for tags, categories, and metadata display
  - Supports custom color variants
  - Includes tooltip explaining tag system on hover

- **SectionSummary** → Collapsible summary component below PageHeader

  - Displays 1-2 sentence description of section purpose
  - Remembers collapsed state per section in localStorage
  - Animated expand/collapse with framer-motion
  - Used on all section pages to provide context

- **HelpCenter** → Modal dialog with searchable help articles

  - Accessible from help icon in TopBar
  - Organized by section with search functionality
  - Provides feature explanations and usage tips

- **TourCallout** → Onboarding tooltip positioned relative to target elements
  - Used for section-specific walkthroughs
  - Supports 1-3 step tours per section
  - Persists completion state per section

## Shared Surface Primitives

### Layout Components

- **AppShell**: Main layout wrapper with sidebar navigation and content area

  - Props: `activeRoute` (string), `showDemoBadge` (boolean)
  - Renders: SidebarNav, TopBar, ScrollArea with main content
  - Usage: Wraps all authenticated pages

- **PageHeader**: Consistent page title and description layout

  - Props: `title` (string), `description` (optional string), `actions` (optional ReactNode)
  - Layout: Left side has title + description, right side has actions
  - Usage: All feature pages for consistent header styling

- **CardGrid**: Responsive grid wrapper for card layouts
  - Props: `children` (ReactNode), `className` (optional string)
  - Layout: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
  - Usage: All pages displaying collections of items

### Card Components

- **ItemCard**: Domain-agnostic card component with thumbnail, tags, and actions

  - Props: `thumbnailUrl`, `title`, `description`, `tags`, `pinned`, `onClick`, `onFavorite`, `actionsRight`
  - Features: framer-motion animations, ARIA labels on icon buttons
  - Usage: Notes, Stacks, MindStorm clusters, Vault items, Insights, Memory, Nope items

- **TagChip**: Small badge component for displaying tags
  - Props: `label` (string), `colorClassName` (optional string)
  - Styling: `rounded-[var(--radius-chip)] text-xs font-medium lowercase`
  - Usage: Within ItemCard and other components for tag display

### Specialized Components

- **QuickCaptureBar**: Text area and save button for quick note creation

  - Props: `onCreate` (function), `isCreating` (boolean)
  - Features: Keyboard shortcuts (Cmd/Ctrl + Enter), disabled AI classify button
  - Usage: All Notes page for quick note capture

- **SortAndFilterStub**: Reusable sort/filter control for collection pages

  - Features: DropdownMenu for sort and filter options, console.log placeholders
  - Usage: Stack detail pages, future MindStorm filtering

- **VaultLockScreen**: Locked state component for encrypted notes

  - Props: `onUnlock` (function)
  - Usage: Vault page when locked

- **InsightCard**: Specialized card for weekly insights

  - Props: `week`, `summary`, `sentiment`
  - Usage: Insights page for AI-generated summaries

- **TimelineGrid**: Grid component for timeline/memory display
  - Props: `items`, `onRevisit`
  - Usage: Memory Lane page for temporal navigation

## Page Layouts

All pages follow the same structural pattern:

```tsx
<AppShell activeRoute="...">
  <div className="max-w-5xl mx-auto space-y-6">
    <PageHeader title="..." description="..." actions={...} />
    <CardGrid>
      <ItemCard ... />
    </CardGrid>
  </div>
</AppShell>
```

### Route-Specific Implementations

These primitives are reused across all feature pages to maintain visual consistency:

- **`/app`** (All Notes): SidebarNav + PageHeader + QuickCaptureBar + CardGrid of ItemCard for notes
- **`/app/stacks`** (Smart Stacks): SidebarNav + PageHeader + CardGrid of ItemCard for stacks
- **`/app/stacks/[stackSlug]`** (Stack Detail): SidebarNav + PageHeader with SortAndFilterStub + CardGrid of stack items
- **`/app/mindstorm`** (MindStorm): SidebarNav + PageHeader with ReclusterButton + CardGrid of clusters (showDemoBadge=true)
- **`/app/vault`** (Vault): SidebarNav + PageHeader + VaultLockScreen OR CardGrid of locked ItemCards
- **`/app/insights`** (Weekly Insights): SidebarNav + PageHeader with GenerateButton + InsightCard components
- **`/app/memory`** (Memory Lane): SidebarNav + PageHeader + TimelineGrid component
- **`/app/nope`** (Nope Bin): SidebarNav + PageHeader + CardGrid of ItemCard with Restore actions

All pages share the same structural skeleton: AppShell wraps SidebarNav and content area, PageHeader provides consistent header styling, and CardGrid + ItemCard deliver the bookmark-style tile layout.

## Visual System

The visual system derives from the "Bookmark App — Community" Figma file, specifically the BBQ/Podcast/Wishlist patterns. This design language is canonical for the first shipped aesthetic and establishes the foundation for all feature views:

- **Color Palette**: Neutral backgrounds with accent colors for tags and actions
- **Brand Colors**: Deep indigo (`--color-brand-indigo`), lime green (`--color-brand-lime`), and coral (`--color-brand-coral`) used selectively for section icons, summary borders, and accent elements
- **Typography**: Consistent font sizing (text-2xl for headers, text-lg for card titles)
- **Spacing**: Consistent padding (p-6 md:p-8) and gap spacing (gap-6)
- **Border Radius**: CSS custom properties for consistent rounded corners
- **Shadows**: Subtle hover effects with `hover:shadow-md`

## Accessibility

- All icon-only buttons have `aria-label` attributes
- Keyboard navigation support (Cmd/Ctrl + Enter for quick save)
- Semantic HTML structure with proper heading hierarchy
- Color contrast compliance for text and interactive elements

## Responsive Behavior

- Mobile-first design with breakpoint-specific layouts
- Sidebar collapses to sheet on mobile devices
- Card grid adapts from 1 column (mobile) to 4 columns (desktop)
- Touch-friendly button sizes and spacing

This vocabulary establishes the canonical design language for early MindStorm UI development and ensures consistency across all feature views.
