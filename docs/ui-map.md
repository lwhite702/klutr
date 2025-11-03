# UI Surface Vocabulary

This document maps the shared design primitives used across all feature views in the Klutr application.

## Figma → Component Mapping

This design language comes from the "Bookmark App — Community" Figma file and is now canonical for the first shipped aesthetic. The following mappings describe how Figma concepts translate to shipped components:

- **SidebarNav** → Persistent left rail navigation for /app routes

  - Renders navigation links to Notes, MindStorm, Stacks, Vault, Insights, Memory, Nope
  - Part of AppShell layout component

- **SectionSummary** → Page-top onboarding strip

  - Lives directly above `PageHeader`
  - Collapsible summary with quick bullets and “Start walkthrough” action
  - Persists collapsed state per section (localStorage)

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

## Shared Surface Primitives

### Layout Components

- **AppShell**: Main layout wrapper with sidebar navigation and content area

  - Props: `activeRoute` (string), `showDemoBadge` (boolean)
  - Renders: SidebarNav, TopBar, ScrollArea with main content
  - Usage: Wraps all authenticated pages

- **SectionSummary**: Collapsible onboarding banner that introduces each surface

  - Props: `sectionId`, `title`, `description`, `highlights`, `onStartTour`, `tourCompleted`, `accent`
  - Behavior: Remembers collapsed state, surfaces “Start walkthrough” CTA, shows completion badge once the tour is done
  - Usage: Every primary page (Notes, MindStorm, Stacks, Vault, Insights, Memory, Nope)

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

- **SectionTourDialog**: Modal walkthrough powered by `useSectionTour`

  - Props: `title`, `subtitle`, `accent`, `tour`
  - Behavior: Multi-step dialog with progress indicator, skip/done controls, and accent styling per section
  - Usage: Auto-opens on first visit to each primary surface and can be replayed from `SectionSummary`

- **HelpCenterLauncher**: Global help dialog mounted in the TopBar

  - Presents witty primers for every section with accent icons
  - Reinforces how to replay walkthroughs or find specific features quickly

- **Hint**: Tooltip/popover helper that adapts to pointer type

  - Desktop = standard tooltip; touch devices = tap-to-dismiss dialog
  - Usage: QuickCaptureBar helper, action icons on ItemCard, Restore buttons in Nope, etc.

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

All pages now follow a guidance-first pattern:

```tsx
<AppShell activeRoute="...">
  <>
    <div className="mx-auto flex max-w-5xl flex-col space-y-6">
      <SectionSummary ... onStartTour={() => tour.startTour({ restart: true })} />
      <PageHeader title="..." description="..." actions={...} />
      {/* page-specific content */}
    </div>
    <SectionTourDialog title="..." accent="..." tour={tour} />
  </>
</AppShell>
```

### Route-Specific Implementations

These primitives are reused across all feature pages to maintain visual consistency:

- **`/app`** (All Notes): SectionSummary + PageHeader + QuickCaptureBar + CardGrid of ItemCard for notes + Notes tour dialog
- **`/app/stacks`** (Smart Stacks): SectionSummary + PageHeader + CardGrid of ItemCard for stacks + Stacks tour dialog
- **`/app/stacks/[stackSlug]`** (Stack Detail): PageHeader with SortAndFilterStub + CardGrid of stack items (SectionSummary planned)
- **`/app/mindstorm`** (MindStorm): SectionSummary + PageHeader with ReclusterButton + CardGrid of clusters (showDemoBadge=true) + MindStorm tour dialog
- **`/app/vault`** (Vault): SectionSummary + PageHeader + VaultLockScreen OR CardGrid of locked ItemCards + Vault tour dialog
- **`/app/insights`** (Weekly Insights): SectionSummary + PageHeader with GenerateButton + InsightCard components + Insights tour dialog
- **`/app/memory`** (Memory Lane): SectionSummary + PageHeader + TimelineGrid component + Memory tour dialog
- **`/app/nope`** (Nope Bin): SectionSummary + PageHeader + CardGrid of ItemCard with Restore actions + Nope tour dialog

All pages share the same structural skeleton: AppShell wraps SidebarNav and content area, SectionSummary orients the user, PageHeader provides consistent header styling, and feature-specific components (CardGrid + ItemCard, TimelineGrid, InsightCard, etc.) deliver the primary experience.

## Visual System

The visual system derives from the "Bookmark App — Community" Figma file, specifically the BBQ/Podcast/Wishlist patterns. This design language is canonical for the first shipped aesthetic and establishes the foundation for all feature views:

- **Color Palette**: Neutral backgrounds with accent pops (`--color-indigo`, `--color-lime`, `--color-coral`) applied to summaries, actions, and help cues
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
