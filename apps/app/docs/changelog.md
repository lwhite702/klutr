# Changelog Documentation

Version: 1.0  
Last updated: 2025-01-XX (America/New_York)

## Overview

The Klutr changelog is powered by Basehub CMS, allowing content editors to manage changelog entries directly in BaseHub Studio without code changes.

## Basehub Schema

### Changelog Collection

**Location:** `marketingSite.changelog`

**Component Template:** `changelogEntry`

**Fields:**
- `title` (text, required) - Entry title
- `slug` (text, required) - URL-friendly slug
- `description` (rich-text) - Entry description/content
- `version` (text) - Version number (e.g., "1.2.0")
- `releaseDate` (date) - Publication date
- `category` (select) - Entry category:
  - `feature` - New features
  - `ui` - UI/UX changes
  - `infra` - Infrastructure updates
  - `docs` - Documentation updates
  - `risk` - Known issues or risks
- `tags` (array of text) - Additional tags for filtering

## Querying Changelog Entries

### Get All Entries

**File:** `lib/queries/changelog.ts`

```typescript
import { getChangelogEntries } from '@/lib/queries/changelog'

const entries = await getChangelogEntries()
```

### Get Latest Entries

```typescript
import { getLatestChangelogEntries } from '@/lib/queries/changelog'

const latest = await getLatestChangelogEntries(3) // Get 3 most recent
```

## Displaying Changelog

### Changelog Page

**Location:** `app/(marketing)/changelog/page.tsx`

- Lists all changelog entries
- Groups entries by release date (month/year)
- Displays category badges
- Supports ISR (Incremental Static Regeneration) with 120s revalidation

### Footer Integration

**Location:** `components/marketing/MarketingFooter.tsx`

- Shows latest 2 changelog entries
- Links to full changelog page

## ISR Configuration

**Revalidation:** 120 seconds

Changelog entries are cached and revalidated every 2 minutes to balance freshness with performance.

**Configuration:**
```typescript
export const revalidate = 120
```

## Adding Changelog Entries

### Via BaseHub Studio

1. Navigate to BaseHub Studio
2. Open the `changelog` collection
3. Click "Add Entry"
4. Fill in all required fields:
   - Title
   - Slug (auto-generated from title)
   - Description
   - Category
   - Release date
5. Add optional fields:
   - Version number
   - Tags
6. Publish the entry

### Entry Format

**Title Format:**
- Be specific and descriptive
- Use present tense: "Add manual re-clustering trigger"
- Keep under 70 characters

**Description:**
- Explain what changed and why
- Use markdown for formatting
- Include user-facing benefits

**Category Guidelines:**
- `feature` - New functionality users can access
- `ui` - Visual or interaction changes
- `infra` - Backend improvements
- `docs` - Documentation updates
- `risk` - Known issues, limitations, or breaking changes

**Example Entry:**
```
Title: Add manual re-clustering trigger to MindStorm
Slug: manual-reclustering-trigger
Category: feature
Description: Users can now manually trigger note re-clustering from the MindStorm page. This bypasses scheduled nightly clustering for immediate results.
Version: 1.3.0
Release Date: 2025-01-15
Tags: ["mindstorm", "clustering", "ai"]
```

## Automation

### Manual Process (Current)

Changelog entries are currently added manually via BaseHub Studio. Future automation options:

1. **GitHub Actions:** Parse commit messages and create entries
2. **Webhook Integration:** Auto-create entries on release tags
3. **CLI Tool:** Generate entries from git history

### Future Enhancements

- Automatic entry creation from git commits
- Integration with release workflow
- Changelog generation from PR descriptions
- Automated categorization based on file changes

## Preview Mode

Changelog entries support Next.js draft mode for previewing unpublished content:

1. Visit `/api/preview?secret=YOUR_SECRET`
2. Navigate to `/changelog`
3. See unpublished entries
4. Exit preview mode via `/api/preview/exit`

## Best Practices

1. **Regular Updates:** Add entries for each significant change
2. **Clear Titles:** Use descriptive, action-oriented titles
3. **User-Focused:** Write descriptions from user perspective
4. **Categorization:** Use appropriate categories for filtering
5. **Versioning:** Include version numbers for major releases
6. **Timeliness:** Add entries close to release date

## References

- **Basehub Schema:** `/docs/basehub-schema.md`
- **Changelog Queries:** `/lib/queries/changelog.ts`
- **Changelog Page:** `/app/(marketing)/changelog/page.tsx`

