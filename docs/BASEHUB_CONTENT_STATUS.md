# Basehub Content Status

**Last Updated:** 2025-11-14 05:09 ET

## Overview

This document tracks the status of Basehub content population for Klutr's marketing pages. The Basehub structure has been created, but content queries need to be implemented and content needs to be populated.

## Current Status

### Structure ✅

- Basehub content structure has been fetched and documented
- Content models exist for:
  - Hero blocks
  - Feature grids
  - Testimonials
  - How it works steps
  - CTA blocks
  - Pricing plans
  - FAQ items
  - About content

### Queries ⚠️

- Query functions exist in `lib/basehub/queries/blocks.ts`
- Currently return `null` placeholders
- Need to be implemented with actual GraphQL queries

### Content ✅

- Hero content updated with production-ready Klutr copy ✅
- Features content fully populated with 10 features ✅
- Other blocks need content population

## Content Models

### Hero Block

**Basehub Document ID:** `AXj79IHsUGa7oHEfYC8P8`

**Fields:**

- `headline` (Text) - Main headline
- `subheadline` (RichText) - Subheadline text
- `primaryCtaText` (Text) - Primary CTA button text
- `primaryCtaUrl` (Text) - Primary CTA URL
- `secondaryCtaText` (Text) - Secondary CTA button text
- `secondaryCtaUrl` (Text) - Secondary CTA URL

**Current Content:**

- Headline: "Organize your chaos. Keep the spark." ✅ Updated
- Primary CTA: "Get started free" ✅ Updated
- Secondary CTA: "See how it works" ✅ Updated
- Subheadline: Already has production-ready content

**Status:** ✅ Content updated via Basehub MCP on 2025-11-14

### Features Block

**Basehub Document ID:** `Hrm9Lcdf4tLNzea8BWWvF`

**Fields:**

- `items` (Component array) - Feature items
  - `title` (Text)
  - `description` (Text)
  - `icon` (Text)

**Current Content:**

- ✅ 10 features fully populated:
  - Flux: "Capture everything instantly."
  - Orbit: "See how your ideas connect."
  - Pulse: "Reflect on patterns and progress."
  - Vault: "Encrypted notes that only you can read"
  - Spark: "Get meaningful AI insight, not noise."
  - Muse: "Weekly AI insights about your thinking patterns"
  - Stacks: "Turn inspiration into execution."
  - Stream: "Chat-style interface where all your thoughts flow naturally"
  - Boards: "Auto-organized collections of related notes"
  - Search: "Natural language search across your entire stream"

**Status:** ✅ Features content is production-ready and fully populated

### Pricing Block

**Basehub Document ID:** `kVjQWBq2yTR5ijOpPgRek`

**Fields:**

- `title` (Text)
- `description` (RichText)
- `plans` (Component array)
  - `name` (Text)
  - `description` (Text)
  - `price` (Text)
  - `period` (Text)
  - `features` (Component array)
  - `ctaText` (Text)
  - `ctaUrl` (Text)
  - `popular` (Boolean)

**Status:** Structure exists, content needs population

### FAQ Block

**Basehub Document IDs:** Multiple FAQ items exist

**Fields:**

- `question` (Text)
- `answer` (RichText)

**Status:** Multiple FAQ items exist, content needs review

## Implementation Steps

### 1. Update Hero Content ✅ COMPLETED

**Updated on 2025-11-14 using `mcp_basehub_klutr_update_blocks`:**

```typescript
// Updated home page hero content
mcp_basehub_klutr_update_blocks({
  data: [
    {
      id: "c88310c48406ab6f77a40", // heroHeadline block ID
      value: "Organize your chaos. Keep the spark.",
    },
    {
      id: "65acf7f1d0d85a2e75368", // primaryCTA block ID
      value: "Get started free",
    },
    {
      id: "3fb94d8fda20346f93498", // secondaryCTA block ID
      value: "See how it works",
    },
  ],
});
```

**Result:** All hero content successfully updated in Basehub draft mode.

**Note:** ✅ Commit successful! Fixed missing required fields in help topics and onboarding blocks, then committed all changes.

### 2. Implement GraphQL Queries

Update `lib/basehub/queries/blocks.ts` to use actual GraphQL queries:

```typescript
export async function getHomePageBlocks() {
  const { isEnabled } = await draftMode();
  const client = basehubClient(isEnabled);

  const result = await client.query({
    hero: {
      headline: true,
      subheadline: { json: true },
      primaryCtaText: true,
      primaryCtaUrl: true,
      secondaryCtaText: true,
      secondaryCtaUrl: true,
    },
    features: {
      items: {
        title: true,
        description: true,
        icon: true,
      },
    },
    // ... other blocks
  });

  return {
    heroBlock: result.hero
      ? {
          title: result.hero.headline,
          subtitle: result.hero.subheadline?.json,
          ctaText: result.hero.primaryCtaText,
          ctaLink: result.hero.primaryCtaUrl,
        }
      : null,
    // ... other blocks
  };
}
```

### 3. Populate Content

- Update hero content via Basehub MCP
- Populate features with Klutr-specific content
- Add pricing plans
- Review and update FAQ items
- Add testimonials
- Create "How it works" steps

### 4. Verify Fallbacks

Ensure all components have proper fallback content:

- Check `components/marketing/Hero.tsx` fallbacks
- Check `components/marketing/FeatureGrid.tsx` fallbacks
- Verify all marketing components handle null Basehub content gracefully

## Fallback Content

All marketing components should have permanent, on-brand fallback content that displays when Basehub is unavailable:

- **Hero:** "Organize your chaos. Keep the spark."
- **Features:** Default feature list from `lib/mockData.ts` or hardcoded
- **Pricing:** "Free during Beta" messaging
- **FAQ:** Common questions hardcoded

## Next Steps

1. ✅ Document Basehub structure (this file)
2. ✅ Update hero content via Basehub MCP
3. ⏳ Implement GraphQL queries in `blocks.ts`
4. ⏳ Populate remaining content blocks (pricing, FAQ, testimonials)
5. ✅ Verify fallback content is on-brand (Hero component has "Organize your chaos." fallback)
6. ⏳ Test content loading with Basehub unavailable
7. ⏳ Fix required field validation errors to enable commit

## Notes

- Basehub queries currently return null - this is intentional until queries are implemented
- Frontend components already have fallback content
- Content updates should match BRAND_VOICE.md tone
- All content should be production-ready, no placeholders
