# Design Token Audit & Unification - Summary

**Date:** 2025-01-27  
**Status:** In Progress

## Overview

Comprehensive audit and unification of design tokens across Klutr app, docs, and marketing site.

## Changes Made

### 1. Tailwind Config (`tailwind.config.js`)
- ✅ Updated all color tokens to reference CSS variables for theme support
- ✅ Added unified brand color tokens (`primary`, `accent-mint`, `accent-coral`)
- ✅ Added backward-compatible aliases (`mint`, `coral`, `charcoal`)
- ✅ Standardized border radius tokens
- ✅ Unified shadow tokens
- ✅ Added transition duration and timing defaults

### 2. CSS Variables (`app/globals.css`)
- ✅ Consolidated border radius definitions
- ✅ Unified shadow token system (xs, sm, md, lg, xl, 2xl, depth)
- ✅ Maintained legacy `--klutr-*` variables for backward compatibility
- ✅ Ensured all tokens are properly defined in `:root` and `.dark`

### 3. Component Updates
- ✅ Fixed hardcoded colors in `app/(app)/spark/page.tsx`:
  - Replaced `#ff6b6b` with `text-accent-coral` and `bg-accent-coral`
- ✅ Fixed hardcoded colors in `components/layout/TopBar.tsx`:
  - Replaced inline `style` with `bg-accent-coral text-white` classes
  - Removed unused `brandColors` import
- ✅ Fixed hardcoded colors in `app/(marketing)/page.tsx`:
  - Replaced inline `style={{ color: '#2B2E3F' }}` with `text-primary` class
  - Updated button to use `bg-accent-coral` token

### 4. Documentation
- ✅ Created `DESIGN_TOKENS.md` with comprehensive token reference
- ✅ Documented migration patterns and best practices

## Token Structure

### Colors
**Primary Brand:**
- `primary` / `charcoal`: `#2B2E3F`
- `accent-mint` / `mint`: `#00C896`
- `accent-coral` / `coral`: `#FF6B6B`

**Usage:**
- Tailwind: `bg-primary`, `text-accent-mint`, `border-accent-coral`
- CSS: `var(--color-primary)`, `var(--color-accent-mint)`, `var(--color-accent-coral)`
- TypeScript: `brandColors.charcoal`, `brandColors.mint`, `brandColors.coral`

### Border Radius
- `sm`: 8px (0.5rem) - Small elements
- `md`: 12px (0.75rem) - Buttons, inputs
- `lg`: 16px (1rem) - Cards, modals (default)
- `xl`: 20px (1.25rem) - Large cards
- `2xl`: 16px (1rem) - Marketing sections

### Shadows
- `xs`: Subtle elevation (inputs)
- `sm`: Small elevation (buttons)
- `md`: Medium elevation (cards hover)
- `lg`: Large elevation (cards, panels)
- `xl`: Extra large (modals, dropdowns)
- `2xl`: Maximum elevation (marketing)

### Spacing
Uses Tailwind's default 4px rhythm (0, 1, 2, 3, 4, 6, 8, 12, 16, 24...)

### Typography
- **Display/Headings**: Inter (fallback: Geist, system)
- **Body**: Satoshi (fallback: Geist, Inter, system)
- **Mono**: Geist Mono (fallback: system monospace)

## Remaining Work

### High Priority
1. **Replace legacy `--klutr-*` variable usage** in components:
   - `components/layout/TopBar.tsx` - `var(--klutr-mint)`
   - `components/marketing/MarketingHeader.tsx` - Multiple `var(--klutr-*)` usages
   - `components/marketing/Hero.tsx` - Multiple `var(--klutr-*)` usages
   - `components/marketing/HowItWorks.tsx` - Multiple `var(--klutr-*)` usages
   - `components/marketing/FeatureGrid.tsx` - Multiple `var(--klutr-*)` usages
   - `app/(marketing)/page.tsx` - Multiple `var(--klutr-*)` usages
   - `components/insights/InsightCard.tsx` - `var(--klutr-outline)`

2. **Standardize border radius usage**:
   - Replace `rounded-[var(--radius-chip)]` with `rounded-chip` or `rounded-full`
   - Ensure consistent radius values across cards, buttons, inputs

3. **Validate spacing consistency**:
   - Audit card padding (should be `p-6` = 24px)
   - Audit card gaps (should be `gap-6` = 24px)
   - Audit section spacing (should follow 4px rhythm)

### Medium Priority
4. **Typography consistency**:
   - Verify all headings use `font-display` (Inter)
   - Verify all body text uses `font-body` (Satoshi)
   - Standardize font weights (headings: `font-semibold`, body: `font-normal`)

5. **Shadow consistency**:
   - Replace custom shadow values with token classes
   - Ensure dark mode shadows use enhanced depth

6. **Motion consistency**:
   - Standardize transition durations (default: 200ms)
   - Standardize easing functions (default: ease-out)

### Low Priority
7. **Icon sizing**:
   - Audit icon sizes across components
   - Ensure consistent sizing (default: `size-4` = 16px)

8. **Remove unused tokens**:
   - Clean up duplicate or unused CSS variables
   - Remove legacy tokens after migration complete

## Migration Strategy

### Phase 1: Core Tokens (✅ Complete)
- Unified Tailwind config
- Consolidated CSS variables
- Fixed critical hardcoded values

### Phase 2: Component Migration (In Progress)
- Replace `var(--klutr-*)` with Tailwind classes
- Standardize border radius usage
- Normalize spacing values

### Phase 3: Validation (Pending)
- Visual audit of all components
- Cross-browser testing
- Dark mode validation

### Phase 4: Cleanup (Pending)
- Remove legacy tokens
- Update documentation
- Create token usage guidelines

## Token Mapping Reference

### Legacy → Unified
- `--klutr-mint` → `bg-accent-mint` / `text-accent-mint`
- `--klutr-coral` → `bg-accent-coral` / `text-accent-coral`
- `--klutr-wordmark` → `text-primary`
- `--klutr-background` → `bg-background`
- `--klutr-surface-dark` → `bg-card` (dark mode)
- `--klutr-outline` → `border-border`
- `--klutr-text-primary-light` → `text-foreground` (light mode)
- `--klutr-text-primary-dark` → `text-foreground` (dark mode)

## Recommendations

1. **Use Tailwind classes over CSS variables** when possible for better IntelliSense and consistency
2. **Prefer semantic names** (`primary`, `accent-mint`) over literal names (`charcoal`, `mint-green`)
3. **Use CSS variables** only when dynamic theming is needed or for complex calculations
4. **Document token decisions** in component comments when deviating from defaults
5. **Run visual regression tests** after token changes to catch inconsistencies

## Files Modified

- `tailwind.config.js` - Unified token configuration
- `app/globals.css` - Consolidated CSS variables
- `app/(app)/spark/page.tsx` - Fixed hardcoded colors
- `components/layout/TopBar.tsx` - Fixed hardcoded colors, removed unused import
- `app/(marketing)/page.tsx` - Fixed hardcoded colors
- `DESIGN_TOKENS.md` - Token documentation (new)
- `TOKEN_MIGRATION_SUMMARY.md` - This file (new)

## Next Steps

1. Continue replacing `var(--klutr-*)` usage in marketing components
2. Audit and standardize spacing across all cards and panels
3. Validate typography consistency in dashboard, auth, and settings
4. Create visual regression test suite
5. Update component library documentation with token usage examples
