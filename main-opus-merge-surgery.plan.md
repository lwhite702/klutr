<!-- 2ab73f88-d3e2-43d2-b940-c6c8f88e6620 36e58bfc-d085-43c8-8ec4-46f57ee8b6d5 -->
# Branch Merge: Opus → Main with GPT-5 Strategic Enhancements

## Current State Analysis

**Working Directory**: Contains Opus branch (origin/cursor/.../12cc) content

- Global AppShell in `/app/app/layout.tsx` wraps all pages
- Component organization: subdirectories (`layout/`, `notes/`, `stacks/`, etc.)
- AppShell signature: `{ children: React.ReactNode }`
- Organized, polished, has mockData.ts and animations patterns

**GPT-5 Branch** (origin/cursor/.../52d1): Strategic patterns to harvest

- Per-page AppShell rendering (no global layout wrapper)
- AppShell signature: `{ children, activeRoute, showDemoBadge }`
- TopBar has demo badge support
- "Re-cluster now" button in TopBar with console.log handler

## Implementation Steps

### 1. Create merge branch

- Create `main-opus-merge` branch from current main
- Since working directory already has Opus content, stage and commit it to the merge branch

### 2. Enhance AppShell for flexibility

Update `/components/layout/AppShell.tsx`:

- Add `activeRoute: string` prop
- Add optional `showDemoBadge?: boolean` prop (default false)
- Pass `activeRoute` to SidebarNav if it needs it
- Pass `showDemoBadge` to TopBar

### 3. Add Demo Badge to TopBar

Update `/components/layout/TopBar.tsx`:

- Add optional `showDemoBadge?: boolean` prop
- Render `<Badge variant="secondary">Demo</Badge>` in the right section when enabled
- Position next to user menu/actions area

### 4. Remove global AppShell wrapper

Update `/app/app/layout.tsx`:

- Remove `<AppShell>` wrapper
- Return just `{children}` wrapped in proper semantic HTML structure
- Add theme provider if needed

### 5. Update all pages to explicitly render AppShell

For each page in `/app/app/`:

- `/app/app/page.tsx` (Notes)
- `/app/app/mindstorm/page.tsx`
- `/app/app/stacks/page.tsx`
- `/app/app/stacks/[stack]/page.tsx`
- `/app/app/vault/page.tsx`
- `/app/app/insights/page.tsx`
- `/app/app/memory/page.tsx`
- `/app/app/nope/page.tsx`

Each page should:

```tsx
import { AppShell } from "@/components/layout/AppShell"

export default function PageName() {
  return (
    <AppShell activeRoute="/app/pagename">
      {/* existing page content */}
    </AppShell>
  )
}
```

### 6. Add "Re-cluster now" button

Update `/app/app/mindstorm/page.tsx`:

- Add Button in header section next to title
- onClick handler: `console.log("TODO: trigger recluster")`
- Comment that this will be wired to API in Phase 2

### 7. Verify build and routes

- Run `pnpm build` to ensure no TypeScript errors
- Check all routes render correctly
- Verify no import resolution issues

### 8. Governance documentation

Create/update required docs:

- Create `CHANGELOG.md` with initial entry for this merge
- Verify `agents.md` exists (it does per rules)
- Check for `PRD.md` and `BRAND_VOICE.md` - create if missing

### 9. Commit and document

- Stage all changes
- Commit with message describing merge strategy
- Update CHANGELOG.md with timestamped entry (ET timezone)

## Files Modified

- `/components/layout/AppShell.tsx` - add props
- `/components/layout/TopBar.tsx` - add demo badge
- `/app/app/layout.tsx` - remove global wrapper
- `/app/app/page.tsx` - explicit AppShell
- `/app/app/mindstorm/page.tsx` - explicit AppShell + recluster button
- `/app/app/stacks/page.tsx` - explicit AppShell
- `/app/app/stacks/[stack]/page.tsx` - explicit AppShell
- `/app/app/vault/page.tsx` - explicit AppShell
- `/app/app/insights/page.tsx` - explicit AppShell
- `/app/app/memory/page.tsx` - explicit AppShell
- `/app/app/nope/page.tsx` - explicit AppShell
- `CHANGELOG.md` - create/update

## Success Criteria

- Build completes without errors
- All 8 routes render successfully
- AppShell accepts `activeRoute` and optional `showDemoBadge`
- TopBar conditionally shows demo badge
- Each page explicitly renders its own AppShell wrapper
- "Re-cluster now" button present on MindStorm page
- Opus component organization preserved (subdirectories)
- Mock data and animation patterns intact

### To-dos

- [x] Create main-opus-merge branch and commit current Opus content
- [x] Add activeRoute and showDemoBadge props to AppShell component
- [x] Add demo badge support to TopBar component
- [x] Remove AppShell wrapper from app/app/layout.tsx
- [x] Update all 8 pages to explicitly render AppShell with activeRoute
- [x] Add Re-cluster now button to MindStorm page
- [x] Run build and verify all routes render without errors
- [x] Create/update CHANGELOG.md and verify governance docs exist

## ✅ COMPLETED - All Tasks Successfully Finished

**Branch**: `main-opus-merge`  
**Status**: Ready for pull request into `main`  
**Build**: ✅ Successful (no TypeScript errors)  
**Routes**: ✅ All 8 routes render correctly  
**Architecture**: ✅ Per-page AppShell flexibility implemented

### 🎯 Strategic Benefits Achieved

- **Per-page layout flexibility**: Each page controls its own AppShell rendering
- **Future-proof architecture**: Enables layout divergence (Vault could have different shell than MindStorm)
- **Demo mode support**: Per-page demo badge control
- **Clean separation**: Opus scaffold + GPT-5 flexibility patterns

### 🚀 Next Steps

1. **Pull Request**: Create PR from `main-opus-merge` → `main`
2. **Phase 2**: Begin API wiring and backend integration
3. **Development**: Continue with flexible architecture

---

**Completed**: 2025-10-29 21:30 ET  
**All tasks successfully implemented and verified** ✅
