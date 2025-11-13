# Hybrid Stream-First Architecture Plan

**Date:** 2025-11-11  
**Version:** 1.0  
**Status:** Ready for Review & Approval

---

## 🎯 Executive Summary

**Goal:** Transform Klutr from a multi-page app into a hybrid stream-first architecture where:
- `/stream` is the main interface (landing page)
- MindStorm, Insights, Memory, Search are accessible as **panels/overlays**
- Boards, Vault, Nope remain as **separate pages** (makes sense functionally)
- All existing API logic remains unchanged (zero backend changes)

**Estimated Time:** 6-8 hours total
**Risk Level:** Low (incremental approach, can rollback easily)

---

## 📐 Current vs. Proposed Architecture

### Current Structure (Multi-Page)
```
Landing: /app (dashboard)
         ├─ /stream (chat interface)
         ├─ /mindstorm (full page)
         ├─ /insights (full page)
         ├─ /memory (full page)
         ├─ /search (full page)
         ├─ /boards (full page)
         ├─ /vault (full page)
         └─ /nope (full page)
```

### Proposed Structure (Hybrid)
```
Landing: /stream (main interface)
         │
         ├─ Quick Access Panels (overlays):
         │  ├─ 🧠 MindStorm Panel (right sidebar)
         │  ├─ 💡 Insights Panel (modal/drawer)
         │  ├─ 📚 Memory Panel (timeline drawer)
         │  └─ 🔍 Search Panel (command palette)
         │
         └─ Separate Pages (still accessible):
            ├─ /boards → Collections management
            ├─ /boards/[id] → Board detail
            ├─ /vault → Secure vault (encryption)
            ├─ /nope → Archive/trash
            └─ /stacks/[stack] → Cluster detail
```

---

## 🏗️ Detailed Component Architecture

### Phase 1: Core Infrastructure (2 hours)

#### 1.1 Panel State Management
**File:** `lib/hooks/usePanelState.ts`

```typescript
type PanelType = 'mindstorm' | 'insights' | 'memory' | 'search' | null;

interface PanelState {
  activePanel: PanelType;
  isOpen: boolean;
  openPanel: (panel: PanelType) => void;
  closePanel: () => void;
  togglePanel: (panel: PanelType) => void;
}

export function usePanelState(): PanelState
```

**Purpose:** Centralized state for which panel is open
**Complexity:** Low
**Time:** 30 min

---

#### 1.2 Panel Container Component
**File:** `components/panels/PanelContainer.tsx`

```typescript
interface PanelContainerProps {
  type: PanelType;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'right' | 'left';
}

export function PanelContainer({ ... }: PanelContainerProps)
```

**Features:**
- Slide-in animation from right (or left)
- Backdrop click to close
- Resize handle (optional for v2)
- Keyboard shortcuts (Escape to close)
- Mobile: Full-screen drawer

**Complexity:** Medium
**Time:** 1 hour

---

#### 1.3 Enhanced Sidebar Navigation
**File:** `components/layout/SidebarNav.tsx` (update existing)

**Add Panel Triggers:**
```typescript
const panelItems = [
  { id: 'mindstorm', icon: Brain, label: 'MindStorm', shortcut: 'M' },
  { id: 'insights', icon: Lightbulb, label: 'Insights', shortcut: 'I' },
  { id: 'memory', icon: Clock, label: 'Memory', shortcut: 'H' },
  { id: 'search', icon: Search, label: 'Search', shortcut: 'K' },
];

const pageItems = [
  { href: '/boards', icon: Grid, label: 'Boards' },
  { href: '/vault', icon: Lock, label: 'Vault' },
  { href: '/nope', icon: Trash, label: 'Nope Bin' },
];
```

**Visual Design:**
```
┌─────────────────┐
│  📱 Stream      │ ← Active (bold)
├─────────────────┤
│  🧠 MindStorm   │ ← Click opens panel
│  💡 Insights    │
│  📚 Memory      │
│  🔍 Search      │
├─────────────────┤
│  🗂️ Boards      │ ← Navigate to page
│  🔐 Vault       │
│  🚫 Nope Bin    │
└─────────────────┘
```

**Complexity:** Low
**Time:** 30 min

---

### Phase 2: Panel Components (3 hours)

#### 2.1 MindStorm Panel
**File:** `components/panels/MindStormPanel.tsx`

**Extract from:** `app/(app)/mindstorm/page.tsx`

**Structure:**
```typescript
export function MindStormPanel() {
  // Reuse exact logic from mindstorm/page.tsx
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // All existing hooks and functions...
  
  return (
    <div className="h-full flex flex-col">
      <PanelHeader 
        title="MindStorm" 
        description="Your thoughts grouped by theme"
        action={<ReclusterButton />}
      />
      <ScrollArea className="flex-1">
        {isLoading ? <Skeleton /> : <ClusterGrid clusters={clusters} />}
      </ScrollArea>
    </div>
  );
}
```

**Changes:**
- Wrap in panel-friendly layout
- Remove page-level padding
- Add panel header component
- Keep all business logic identical

**Complexity:** Low (mostly copy-paste + wrapper)
**Time:** 45 min

---

#### 2.2 Insights Panel
**File:** `components/panels/InsightsPanel.tsx`

**Extract from:** `app/(app)/insights/page.tsx`

**Structure:**
```typescript
export function InsightsPanel() {
  // Reuse exact logic from insights/page.tsx
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  return (
    <div className="h-full flex flex-col">
      <PanelHeader 
        title="Insights" 
        description="AI-generated patterns from your notes"
        action={<GenerateButton onClick={handleGenerate} loading={isGenerating} />}
      />
      <ScrollArea className="flex-1 p-4">
        {insights.map(insight => (
          <InsightCard key={insight.id} {...insight} />
        ))}
      </ScrollArea>
    </div>
  );
}
```

**Complexity:** Low
**Time:** 30 min

---

#### 2.3 Memory Panel (Timeline Drawer)
**File:** `components/panels/MemoryPanel.tsx`

**Extract from:** `app/(app)/memory/page.tsx`

**Special Consideration:** Timeline view works well in a drawer

**Structure:**
```typescript
export function MemoryPanel() {
  // Reuse exact logic from memory/page.tsx
  const [summaries, setSummaries] = useState<WeeklySummary[]>([]);
  
  return (
    <div className="h-full flex flex-col">
      <PanelHeader 
        title="Memory Lane" 
        description="Your note-taking timeline"
        action={<GenerateWeekButton />}
      />
      <ScrollArea className="flex-1 p-4">
        <TimelineGrid items={summaries} onRevisit={handleRevisit} />
      </ScrollArea>
    </div>
  );
}
```

**Complexity:** Low
**Time:** 30 min

---

#### 2.4 Search Panel (Command Palette Style)
**File:** `components/panels/SearchPanel.tsx`

**Extract from:** `app/(app)/search/page.tsx`

**Special Design:** Full-screen modal with search-first UX

**Structure:**
```typescript
export function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh]">
        <SearchInput 
          value={query} 
          onChange={setQuery}
          autoFocus
          placeholder="Search notes, files, and tags..."
        />
        <ScrollArea className="flex-1 mt-4">
          {isSearching ? <Skeleton /> : (
            <SearchResults results={results} onSelect={handleSelect} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
```

**Keyboard Shortcuts:**
- `Cmd+K` to open
- `Escape` to close
- Arrow keys to navigate results
- `Enter` to select

**Complexity:** Medium (modal + keyboard nav)
**Time:** 1 hour

---

### Phase 3: Stream Page Integration (1.5 hours)

#### 3.1 Enhanced Stream Layout
**File:** `app/(app)/stream/page.tsx` (update)

**Add Panel Integration:**
```typescript
export default function StreamPage() {
  const { activePanel, openPanel, closePanel } = usePanelState();
  const [drops, setDrops] = useState<StreamDrop[]>([]);
  
  // All existing stream logic...
  
  return (
    <div className="relative h-full">
      {/* Main Stream Interface */}
      <div className={cn(
        "transition-all duration-300",
        activePanel ? "mr-[400px]" : "mr-0" // Make room for panel
      )}>
        <StreamInput onSend={handleSend} />
        <ScrollArea>
          {drops.map(drop => <StreamMessage key={drop.id} drop={drop} />)}
        </ScrollArea>
      </div>
      
      {/* Panel Overlays */}
      <PanelContainer 
        type="mindstorm" 
        isOpen={activePanel === 'mindstorm'}
        onClose={closePanel}
        width="lg"
      >
        <MindStormPanel />
      </PanelContainer>
      
      <PanelContainer 
        type="insights" 
        isOpen={activePanel === 'insights'}
        onClose={closePanel}
        width="md"
      >
        <InsightsPanel />
      </PanelContainer>
      
      <PanelContainer 
        type="memory" 
        isOpen={activePanel === 'memory'}
        onClose={closePanel}
        width="lg"
      >
        <MemoryPanel />
      </PanelContainer>
      
      <SearchPanel 
        isOpen={activePanel === 'search'}
        onClose={closePanel}
      />
    </div>
  );
}
```

**Complexity:** Medium
**Time:** 1 hour

---

#### 3.2 Keyboard Shortcuts Integration
**File:** `lib/hooks/useGlobalShortcuts.ts`

**Add Global Shortcuts:**
```typescript
export function useGlobalShortcuts() {
  const { openPanel } = usePanelState();
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch(e.key) {
          case 'k': openPanel('search'); break;
          case 'm': openPanel('mindstorm'); break;
          case 'i': openPanel('insights'); break;
          case 'h': openPanel('memory'); break;
        }
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openPanel]);
}
```

**Complexity:** Low
**Time:** 30 min

---

### Phase 4: Routing & Navigation (1.5 hours)

#### 4.1 Redirect /app to /stream
**File:** `app/(app)/app/page.tsx`

```typescript
import { redirect } from 'next/navigation';

export default function AppPage() {
  redirect('/stream');
}
```

**Complexity:** Trivial
**Time:** 2 min

---

#### 4.2 Keep Old Routes (Optional Fallback)
**Decision:** Keep `/mindstorm`, `/insights`, `/memory` routes as fallbacks

**Options:**

**Option A: Remove entirely** (recommended)
- Delete page files
- Routes become 404
- Forces users to use panels

**Option B: Keep as standalone pages**
- Works for deep links
- Can be shared
- More flexibility

**Recommendation:** Option B - Keep routes but deprecate in UI

**Time:** 5 min (if removing) or 0 min (if keeping)

---

#### 4.3 Update SidebarNav Links
**File:** `components/layout/SidebarNav.tsx`

**Change from:**
```typescript
<NavLink href="/mindstorm">MindStorm</NavLink>
```

**Change to:**
```typescript
<NavButton onClick={() => openPanel('mindstorm')}>MindStorm</NavButton>
```

**Complexity:** Low
**Time:** 15 min

---

### Phase 5: UI/UX Polish (2 hours)

#### 5.1 Panel Animations
**File:** `components/panels/PanelContainer.tsx`

**Add Framer Motion:**
```typescript
import { motion, AnimatePresence } from 'framer-motion';

const panelVariants = {
  closed: { x: '100%', opacity: 0 },
  open: { x: 0, opacity: 1 },
};

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial="closed"
      animate="open"
      exit="closed"
      variants={panelVariants}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

**Complexity:** Low
**Time:** 30 min

---

#### 5.2 Mobile Responsive Panels
**File:** `components/panels/PanelContainer.tsx`

**Mobile Behavior:**
- Panels become full-screen sheets
- Use shadcn/ui `Sheet` component
- Swipe to close gesture

```typescript
const isMobile = useMediaQuery('(max-width: 768px)');

if (isMobile) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh]">
        {children}
      </SheetContent>
    </Sheet>
  );
}
```

**Complexity:** Medium
**Time:** 1 hour

---

#### 5.3 Panel Header Component
**File:** `components/panels/PanelHeader.tsx`

```typescript
interface PanelHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
}

export function PanelHeader({ title, description, action, onClose }: PanelHeaderProps) {
  return (
    <div className="border-b px-6 py-4 flex items-start justify-between">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action}
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

**Complexity:** Low
**Time:** 30 min

---

## 📊 Implementation Timeline

### Week 1: Core Infrastructure
| Day | Phase | Tasks | Hours |
|-----|-------|-------|-------|
| 1 | Phase 1 | Panel state, container, sidebar | 2h |
| 2 | Phase 2.1-2.2 | MindStorm + Insights panels | 1.5h |
| 3 | Phase 2.3-2.4 | Memory + Search panels | 1.5h |
| 4 | Phase 3 | Stream integration | 1.5h |
| 5 | Phase 4 | Routing updates | 0.5h |
| 6-7 | Phase 5 | Polish & mobile | 2h |

**Total:** 9 hours (can compress to 6-8h with focus)

---

## 🎨 Visual Design Spec

### Desktop Layout (1920x1080)
```
┌──────────────────────────────────────────────────────────────────┐
│  [Logo]  Klutr                              [@user] 🔔 ⚙️        │
├────────┬─────────────────────────────────┬─────────────────────┤
│        │                                 │                     │
│  📱    │   Stream Messages               │   MindStorm Panel   │
│  🧠 ←  │   ───────────────────          │   ───────────────   │
│  💡    │   User: "Meeting notes..."     │   📊 Analytics      │
│  📚    │   ───────────────────          │   (12 notes)        │
│  🔍    │   AI: "Cluster created"        │                     │
│ ───    │   ───────────────────          │   🎯 Goals          │
│  🗂️    │   User: "Todo list"            │   (8 notes)         │
│  🔐    │   ───────────────────          │                     │
│  🚫    │   [Input box]                  │   💼 Work           │
│        │                                 │   (15 notes)        │
│        │                                 │                     │
│        │                                 │   [Re-cluster] [X]  │
└────────┴─────────────────────────────────┴─────────────────────┘
  60px        Flexible (600-1000px)            400px panel
```

### Mobile Layout (375x812)
```
┌─────────────────────────────┐
│  ☰  Klutr          [@user]  │
├─────────────────────────────┤
│                             │
│   Stream Messages           │
│   ───────────────────       │
│   User: "Meeting notes..."  │
│   ───────────────────       │
│   AI: "Cluster created"     │
│   ───────────────────       │
│   User: "Todo list"         │
│   ───────────────────       │
│                             │
│   [Input box]               │
│                             │
│   [🧠] [💡] [📚] [🔍]      │← Quick access
└─────────────────────────────┘

Tap 🧠 → Full screen sheet slides up
```

---

## 🔧 Technical Decisions

### State Management
**Choice:** React Context + Zustand (lightweight)

**Why:**
- No Redux needed (overkill)
- Context for panel state (rarely changes)
- Zustand for stream state (frequent updates)

**Files:**
- `lib/stores/panelStore.ts` (Zustand)
- `lib/contexts/PanelContext.tsx` (React Context wrapper)

---

### Animation Library
**Choice:** Framer Motion

**Why:**
- Already in project (Next.js App Router friendly)
- Excellent spring animations
- AnimatePresence for enter/exit
- Small bundle size with tree-shaking

**Alternative:** CSS transitions (lighter but less flexible)

---

### Panel Width Strategy
**Desktop:**
- Small (300px): Search
- Medium (400px): Insights, Memory
- Large (500px): MindStorm

**Mobile:**
- All panels: Full screen (100vw)

---

### Keyboard Shortcuts
**Standard Shortcuts:**
- `Cmd+K` → Search (industry standard)
- `Cmd+M` → MindStorm
- `Cmd+I` → Insights
- `Cmd+H` → Memory (H for History)
- `Escape` → Close panel

**Considerations:**
- Don't conflict with browser shortcuts
- Show tooltip on hover with shortcut
- Display shortcuts in help center

---

## 🧪 Testing Strategy

### Unit Tests
**Files to test:**
- `usePanelState.test.ts` - State management
- `PanelContainer.test.tsx` - Component rendering
- `useGlobalShortcuts.test.ts` - Keyboard handlers

**Tool:** Jest + React Testing Library

---

### Integration Tests
**Scenarios:**
1. Open panel from sidebar → Panel appears
2. Close panel with X button → Panel disappears
3. Close panel with backdrop click → Panel disappears
4. Keyboard shortcut → Opens correct panel
5. Mobile: Panel becomes full-screen sheet

**Tool:** Playwright (already configured)

---

### Manual Testing Checklist
- [ ] Desktop: Panel slides in smoothly
- [ ] Desktop: Backdrop click closes panel
- [ ] Desktop: Escape key closes panel
- [ ] Desktop: Multiple panels don't overlap
- [ ] Mobile: Panel is full-screen
- [ ] Mobile: Swipe down closes panel
- [ ] Keyboard shortcuts work
- [ ] All panel content loads correctly
- [ ] Stream remains functional when panel open
- [ ] Navigation between panels is smooth

---

## 🚨 Risk Assessment

### Low Risk ✅
1. **No backend changes** - All APIs stay the same
2. **Incremental rollout** - Can test per-panel
3. **Easy rollback** - Keep old routes as fallback
4. **No data changes** - Pure UI refactor

### Medium Risk ⚠️
1. **Mobile UX** - Need thorough testing on devices
2. **Performance** - Animating large components
3. **State management** - Panel state must be rock-solid

### Mitigation Strategies
1. **Feature flag** - Gate behind PostHog flag
2. **Gradual rollout** - Test with beta users first
3. **Fallback URLs** - Keep old routes working
4. **Performance monitoring** - Track render times

---

## 📈 Success Metrics

### User Experience
- [ ] <200ms panel open time
- [ ] <100ms keyboard shortcut response
- [ ] 0 layout shift (CLS score)
- [ ] Smooth 60fps animations

### Adoption
- [ ] 80% of users discover panels within first session
- [ ] 50% of users use keyboard shortcuts within week
- [ ] <5% users navigate to old URLs

### Performance
- [ ] Lighthouse score >90
- [ ] First Contentful Paint <1s
- [ ] Time to Interactive <2s

---

## 🔄 Rollback Plan

### If Issues Arise
1. **Disable feature flag** in PostHog
2. **Revert sidebar nav** to old links
3. **Keep old routes** accessible
4. **Deploy within 5 minutes**

### Rollback Triggers
- Crash rate >5%
- User complaints >10%
- Performance degradation >20%
- Critical bug found

---

## 📝 Documentation Updates

### For Users
**Files to update:**
- `docs/user-guide/navigation.md` - New keyboard shortcuts
- `docs/user-guide/panels.md` - How to use panels
- In-app help center - Add panel tips

### For Developers
**Files to update:**
- `ARCHITECTURE.md` - New component structure
- `CONTRIBUTING.md` - How to add new panels
- Component Storybook - Panel examples

---

## 🎯 Next Steps After Approval

### Immediate (Phase 1)
1. Create `lib/hooks/usePanelState.ts`
2. Create `components/panels/PanelContainer.tsx`
3. Update `components/layout/SidebarNav.tsx`
4. Test basic panel open/close

### Phase 2
5. Extract MindStormPanel
6. Extract InsightsPanel
7. Extract MemoryPanel
8. Extract SearchPanel

### Phase 3
9. Integrate panels into Stream page
10. Add keyboard shortcuts
11. Update routing

### Phase 4
12. Polish animations
13. Mobile responsive
14. Testing & bug fixes

### Phase 5
15. Documentation
16. Deploy to staging
17. Beta testing
18. Production deployment

---

## ✅ Approval Required

### Questions to Answer:
1. **Panel width** - Approve 300/400/500px sizes?
2. **Keyboard shortcuts** - Approve Cmd+M/I/H/K?
3. **Keep old routes** - Yes or remove entirely?
4. **Mobile behavior** - Full-screen sheets OK?
5. **Animation speed** - 300ms transition acceptable?
6. **Search as modal** - Different pattern from other panels?

### Approvers Needed:
- [ ] Product Owner (you!) - UX decisions
- [ ] Design Lead (if exists) - Visual design
- [ ] Engineering Lead (if team) - Technical approach

---

## 📞 Ready to Execute?

**When approved, I will:**
1. Start with Phase 1 (2 hours)
2. Show you working prototype
3. Get feedback
4. Continue to Phase 2-5
5. Complete in 6-8 hours total

**What I need from you:**
- ✅ Approval of this plan
- ✅ Confirm panel sizes and shortcuts
- ✅ Decide on old route handling
- ✅ Any design preferences/mockups

---

**This is a comprehensive, low-risk, high-value refactor that will dramatically improve the UX while keeping all your hard work intact.** 

Ready to proceed? 🚀
