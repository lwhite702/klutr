# Hybrid UI Architecture

**Status**: ✅ Implemented  
**Version**: 2.0  
**Date**: 2025-11-15  
**Last Updated**: 2025-11-15 (Fintask-inspired visual refactor)

## Overview

Klutr uses a hybrid stream-first architecture that combines:
- **Primary Stream** (`/app/stream`) as the central hub for content capture
- **Overlay Panels** for detailed features (MindStorm, Insights, Memory, Search)
- **Direct Pages** for distinct features (Boards, Vault, Settings, Nope)

## Visual Design System

### Fintask-Inspired Layout

The authenticated app shell uses a Fintask-inspired layout structure while maintaining Klutr's unique brand identity:

**Layout Structure:**
- **Left Sidebar**: 240px fixed width (persistent navigation)
- **Main Content**: Flexible with max-width constraint (1100px centered)
- **Right Panel Area**: Visual constraint for overlay panels (handled by PanelContainer)

**Spacing Proportions:**
- Sidebar width: 240px (matches Fintask)
- Header height: 64px (h-16)
- Content padding: 24px (p-6)
- Card spacing: 16px vertical gap (space-y-4)
- Panel padding: 24px horizontal (px-6), 16px vertical (py-4)

**Typography:**
- Headings: h1 (32px), h2 (24px), h3 (20px)
- Subheadings: 18px, 16px
- Body text: 14px (text-sm)
- Metadata: 12px (text-xs), 11px for shortcuts
- Font stack: Inter for headings, system fonts for body

**Card Styling:**
- Border radius: 8px (rounded-lg)
- Border: 1px subtle border (border-border)
- Shadow: subtle elevation (shadow-sm, hover:shadow-md)
- Padding: 16px internal (px-4 py-3)
- Background: bg-card with proper contrast

**Brand Integration:**
- Logo: 56px height in header (h-12)
- Wordmark: Visible on large screens (lg:flex)
- Tagline: "Organize your chaos. Keep the spark." in header
- Colors: Coral (#FF6B6B) and Mint (#00C896) from brand palette
- Active states: Left border indicator with brand color

## Architecture Components

### 1. Panel State Management

**File**: `lib/hooks/usePanelState.ts`

Global state management for panel visibility using Zustand:

```typescript
interface PanelState {
  activePanel: PanelType // 'mindstorm' | 'insights' | 'memory' | 'search' | null
  isOpen: boolean
  openPanel: (panel: PanelType) => void
  closePanel: () => void
  togglePanel: (panel: PanelType) => void
}
```

**Usage**:
```typescript
const { activePanel, openPanel, closePanel } = usePanelState();

// Open a panel
openPanel('mindstorm');

// Close current panel
closePanel();
```

### 2. Panel Container

**File**: `components/panels/PanelContainer.tsx`

Generic container for all panel components with:

- **Desktop**: Slide-in panel from right (500px default)
- **Mobile**: Full-screen sheet from bottom (90vh)
- **Animations**: Framer Motion spring animations (300ms)
- **Interactions**:
  - Escape key to close
  - Backdrop click to close
  - Smooth transitions

**Fintask-Inspired Design:**
- Clean borders: border-l border-border
- Subtle shadow: shadow-lg (not shadow-xl)
- Proper flex layout: flex flex-col for proper content flow
- Panel header: Consistent padding (px-6 py-4), clear typography hierarchy

**Props**:
```typescript
interface PanelContainerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl' // 300px, 400px, 500px, 600px
  position?: 'right' | 'left'
  className?: string
}
```

### 3. Panel Components

All panel components follow the same structure:

**MindStormPanel** (`components/panels/MindStormPanel.tsx`):
- Displays note clusters grouped by topic
- Manual re-clustering trigger
- Confidence scores and sample notes

**InsightsPanel** (`components/panels/InsightsPanel.tsx`):
- AI-generated insights from user's notes
- Sorted by relevance
- Generate new insights on demand

**MemoryPanel** (`components/panels/MemoryPanel.tsx`):
- Weekly summaries of note activity
- Timeline view with date ranges
- Auto-generated summaries

**SearchPanel** (`components/panels/SearchPanel.tsx`):
- Modal design (full-screen dialog)
- Semantic + full-text search
- Debounced input (300ms)
- Command palette style

### 4. Enhanced Navigation

**File**: `components/layout/SidebarNav.tsx`

Two types of navigation items:

**Page Links** (direct navigation):
- Stream (`/app/stream`)
- Boards (`/app/boards`)
- Vault (`/app/vault`)
- Nope (`/app/nope`)
- Settings (`/app/settings`)

**Panel Triggers** (overlay panels):
- MindStorm (⌘M)
- Insights (⌘I)
- Memory (⌘H)
- Search (⌘K)

**Fintask-Inspired Styling:**
- Compact icons: 20px (h-5 w-5)
- Clear selected state: Background with brand color tint, left border indicator (2px)
- Keyboard shortcut hints: Visible in nav items (right-aligned, 11px, low-contrast)
- Font sizes: 14px for labels (text-sm), 11px for shortcuts
- Spacing: 10px height (h-10), 12px horizontal padding (px-3)
- Hover state: Subtle background change (hover:bg-accent/50)
- Active state: bg-accent with left border in brand color

### 5. Keyboard Shortcuts

**Global shortcuts** (active in Stream):
- `⌘K` - Open Search
- `⌘M` - Open MindStorm
- `⌘I` - Open Insights
- `⌘H` - Open Memory (History)
- `⌘N` - Focus note input
- `Escape` - Close active panel

**Implementation**: `lib/hooks/useKeyboardShortcuts.ts`

### 6. Responsive Design

**File**: `lib/hooks/useMediaQuery.ts`

Media query hooks for responsive behavior:

```text
const isMobile = useIsMobile(); // < 768px
const isTablet = useIsTablet(); // 768px - 1023px
const isDesktop = useIsDesktop(); // >= 1024px
```

**Breakpoints**:
- Mobile: `< 768px` → Full-screen sheets
- Tablet: `768px - 1023px` → Reduced panel width
- Desktop: `>= 1024px` → Full panel width

## Routing

### Primary Routes

- `/app` → Redirects to `/app/stream`
- `/app/stream` → Main hub with panel overlays
- `/app/boards` → Board management (direct page)
- `/app/vault` → Encrypted notes (direct page)
- `/app/nope` → Archive/cleanup (direct page)
- `/app/settings` → User settings (direct page)

### Legacy Panel Routes (Redirects)

For backward compatibility, old routes redirect and auto-open panels:

```text
/app/mindstorm → /app/stream + opens MindStorm panel
/app/insights → /app/stream + opens Insights panel
/app/memory → /app/stream + opens Memory panel
/app/search → /app/stream + opens Search modal
```

## User Experience

### Desktop Flow

1. User lands on `/app/stream` (note capture interface)
2. Click sidebar icon or press keyboard shortcut
3. Panel slides in from right (300ms spring animation)
4. Stream remains visible underneath
5. Close panel via:
   - Escape key
   - Close button (X)
   - Toggle same panel again
   - Open different panel (replaces current)

### Mobile Flow

1. User lands on `/app/stream` (note capture interface)
2. Tap sidebar icon (keyboard shortcuts less common)
3. Full-screen sheet slides up from bottom
4. Sheet covers stream completely (focus mode)
5. Close sheet via:
   - Swipe down
   - Close button (X)
   - Tap overlay backdrop

### Panel Interactions

**Single Panel at a Time**:
- Only one panel can be open
- Opening a new panel closes the current one
- Smooth transition between panels

**Panel Persistence**:
- Panel state persists during navigation within `/app/stream`
- Panel closes on navigation to other pages
- Reopening a panel restores last viewed state

## Performance

### Optimizations

1. **Lazy Loading**: Panel components only mount when opened
2. **Debounced Search**: 300ms debounce on search input
3. **Optimistic UI**: Immediate visual feedback on actions
4. **Memoized State**: Zustand for efficient global state
5. **Framer Motion**: GPU-accelerated animations

### Bundle Impact

- **Zustand**: ~1KB (state management)
- **Framer Motion**: ~50KB (animations) - already in bundle
- **Panel Components**: ~15KB total (code-split)

## Future Enhancements

### Planned Features

- [ ] Panel resize handles (desktop)
- [ ] Panel position persistence (localStorage)
- [ ] Multi-panel support (side-by-side on wide screens)
- [ ] Panel-specific keyboard shortcuts
- [ ] Panel transition animations between types
- [ ] Deep linking to specific panel states

### Accessibility

- [x] Keyboard navigation (shortcuts + escape)
- [x] ARIA labels on close buttons
- [x] Focus management on panel open/close
- [ ] Screen reader announcements
- [ ] High contrast mode support
- [ ] Reduced motion support

## Testing

### Manual Testing Checklist

Desktop:
- [ ] Panel slides in smoothly from right
- [ ] Escape key closes panel
- [ ] Backdrop click closes panel (if visible)
- [ ] All keyboard shortcuts work
- [ ] Panel width is appropriate (500px default)
- [ ] Panel scrolling works independently

Mobile:
- [ ] Sheet slides up from bottom
- [ ] Sheet covers 90% of viewport
- [ ] Swipe down to close works
- [ ] Touch interactions are smooth
- [ ] No horizontal scroll issues

All Devices:
- [ ] Only one panel open at a time
- [ ] Panel state persists correctly
- [ ] Navigation works as expected
- [ ] Loading states display properly
- [ ] Error states are handled

### Automated Tests

**E2E Tests** (`tests/e2e/panels.spec.ts`):
```typescript
test('should open MindStorm panel from sidebar', async ({ page }) => {
  await page.goto('/app/stream');
  await page.click('[data-panel-trigger="mindstorm"]');
  await expect(page.locator('[data-panel="mindstorm"]')).toBeVisible();
});

test('should close panel on escape key', async ({ page }) => {
  await page.goto('/app/stream');
  await page.click('[data-panel-trigger="mindstorm"]');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-panel="mindstorm"]')).not.toBeVisible();
});
```

## Migration Notes

### From Old Architecture

**Before** (separate pages):

```text
/app/mindstorm → Full page
/app/insights → Full page
/app/memory → Full page
/app/search → Full page
```

**After** (stream + panels):

```text
/app/stream → Hub + overlay panels
  ├─ MindStorm panel (⌘M)
  ├─ Insights panel (⌘I)
  ├─ Memory panel (⌘H)
  └─ Search modal (⌘K)
```

### Breaking Changes

None - all old routes redirect automatically.

### Developer Migration

To add a new panel:

1. Create panel component in `components/panels/`
2. Add panel type to `usePanelState.ts`
3. Register in `SidebarNav.tsx`
4. Add keyboard shortcut in `stream/page.tsx`
5. Add `PanelContainer` wrapper in `stream/page.tsx`

Example:
```tsx
// 1. components/panels/MyNewPanel.tsx
export function MyNewPanel() {
  return (
    <>
      <PanelHeader title="My Feature" onClose={closePanel} />
      <ScrollArea className="flex-1 p-6">
        {/* Content */}
      </ScrollArea>
    </>
  );
}

// 2. Update PanelType in usePanelState.ts
export type PanelType = 'mindstorm' | 'insights' | 'memory' | 'search' | 'mynew' | null;

// 3. Add to SidebarNav.tsx panelItems
{ id: 'mynew', label: 'My Feature', icon: Icon, shortcut: 'Y' }

// 4. Add shortcut in stream/page.tsx
{ key: 'y', meta: true, handler: () => openPanel('mynew') }

// 5. Add container in stream/page.tsx
<PanelContainer isOpen={activePanel === 'mynew'} onClose={closePanel}>
  <MyNewPanel />
</PanelContainer>
```

## Fintask-Inspired Design System

### App Shell Structure

**File**: `components/layout/AppShell.tsx`

The app shell implements a 3-part structure inspired by Fintask's layout:

1. **Left Sidebar** (240px fixed)
   - Persistent navigation
   - Fintask-inspired compact styling
   - Keyboard shortcut hints visible

2. **Main Content Area** (flexible with max-width)
   - Stream: max-width 1100px centered
   - Other pages: max-width 1100px centered
   - Consistent padding: 24px (p-6)

3. **Right Panel Area** (visual constraint)
   - Panels render as overlays via PanelContainer
   - Desktop: Slide-in from right
   - Mobile: Full-screen sheets

### TopBar Design

**File**: `components/layout/TopBar.tsx`

**Layout:**
- Left: Klutr logo (56px height) + wordmark + tagline
- Center: Contextual controls (search, actions)
- Right: User menu (avatar, theme toggle, help)

**Branding:**
- Logo prominently displayed (h-12, 56px)
- Wordmark visible on large screens (lg:flex)
- Tagline: "Organize your chaos. Keep the spark."
- Height: 64px (h-16) matches Fintask

### Stream Layout

**File**: `app/(app)/stream/page.tsx`

**Design:**
- Max-width column: 1100px centered
- Card spacing: 16px vertical gap (space-y-4)
- Fintask-inspired card styling on StreamMessage components
- Consistent padding and typography

### Card Styling Standards

All cards follow Fintask-inspired patterns:

```css
/* Standard card */
.rounded-lg          /* 8px border radius */
.border              /* 1px subtle border */
.bg-card             /* Proper background */
.shadow-sm           /* Subtle elevation */
.hover:shadow-md     /* Enhanced on hover */
.px-4.py-3           /* 16px internal padding */
```

### Typography Scale

Matches Fintask font sizes:

- **Headings**: 
  - h1: 32px (text-3xl)
  - h2: 24px (text-2xl)
  - h3: 20px (text-xl)
- **Subheadings**: 18px, 16px
- **Body**: 14px (text-sm)
- **Metadata**: 12px (text-xs), 11px for shortcuts

### Brand Colors

Applied throughout the UI:

- **Coral** (#FF6B6B): Primary actions, active states, accents
- **Mint** (#00C896): Secondary actions, highlights
- **Charcoal** (#2B2E3F): Text, borders
- **Neutrals**: Backgrounds, muted text

### Responsive Breakpoints

- **Mobile**: < 768px
  - Sidebar: Hidden (hamburger menu)
  - Panels: Full-screen sheets
  - Touch targets: Minimum 44px (h-11)
  
- **Tablet**: 768px - 1023px
  - Sidebar: Visible (240px)
  - Panels: Slide-in (reduced width)
  
- **Desktop**: >= 1024px
  - Full Fintask-like layout
  - All features visible

---

**Questions?** Contact the team or check the implementation in `components/panels/` and `components/layout/`.
