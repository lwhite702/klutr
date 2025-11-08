---
title: "Architecture Overview"
author: cursor-agent
updated: 2025-10-29
---

# Architecture Overview

## Purpose Statement

This document serves as the canonical reference for technical decisions, system architecture, and implementation patterns in the Noteornope (MindStorm) application. All agents must reference this document when making architectural changes and update it when introducing new patterns or technologies.

## Current Stack (Phase 1)

### Frontend

- **Next.js 16** - App Router, TypeScript, React Server Components
- **shadcn/ui** - Component library with Tailwind CSS
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety and developer experience

### Backend & Database

- **Neon Postgres** - Primary database with pgvector extension
- **Prisma ORM** - Database access and schema management
- **pgvector** - Vector similarity search for note clustering
- **OpenAI API** - AI classification and clustering (gpt-4o-mini)

### Infrastructure

- **Doppler** - Environment variable management across all environments
- **Manual Cron** - API routes under `/api/cron/` with CRON_SECRET validation
- **Vercel** - Deployment platform

### Current Data Flow

```
User Input → Next.js API Route → Prisma → Neon Postgres
                ↓
            OpenAI API (classification)
                ↓
            pgvector (embeddings)
                ↓
            Manual clustering via API
```

## Target Stack (Phase 5)

### Frontend

- **Next.js 16** - App Router, TypeScript, React Server Components
- **shadcn/ui** - Component library with Tailwind CSS
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety and developer experience

### Backend & Database

- **Supabase Postgres** - Primary database with pgvector extension
- **Prisma ORM** - Database access and schema management
- **pgvector** - Vector similarity search for note clustering
- **OpenAI API** - AI classification and clustering (gpt-4o-mini)

### Infrastructure

- **Supabase Auth** - User authentication (email/password + OAuth)
- **Supabase Storage** - File attachments bucket
- **Supabase Edge Functions** - Serverless functions for cron jobs
- **Row-Level Security (RLS)** - Database-level access control
- **Doppler** - Environment variable management across all environments
- **Vercel** - Deployment platform

### Target Data Flow

```
User Input → Next.js API Route → Prisma → Supabase Postgres
                ↓                    ↓
            OpenAI API         Supabase Auth (RLS)
                ↓                    ↓
            pgvector           Supabase Storage
                ↓                    ↓
        Supabase Edge Functions (cron)
```

## ASCII Architecture Diagrams

### Current Architecture (Phase 1)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   API Routes    │    │   Neon Postgres │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │   Pages   │  │◄──►│  │   CRUD    │  │◄──►│  │   Notes   │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │Components│  │◄──►│  │   Cron    │  │◄──►│  │ pgvector   │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   shadcn/ui     │    │   OpenAI API    │    │    Doppler      │
│   Tailwind      │    │   (gpt-4o-mini) │    │  Environment    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Target Architecture (Phase 5)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Supabase      │    │   Supabase      │
│                 │    │   Edge Functions│    │   Postgres      │
│  ┌───────────┐  │    │                 │    │                 │
│  │   Pages   │  │◄──►│  ┌───────────┐  │◄──►│  ┌───────────┐  │
│  └───────────┘  │    │  │   Auth    │  │    │  │   Notes   │  │
│                 │    │  └───────────┘  │    │  │  (RLS)    │  │
│  ┌───────────┐  │    │                 │    │  └───────────┘  │
│  │Components│  │◄──►│  ┌───────────┐  │◄──►│  ┌───────────┐  │
│  └───────────┘  │    │  │  Storage  │  │    │  │ pgvector   │  │
└─────────────────┘    │  └───────────┘  │    │  └───────────┘  │
         │              └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   shadcn/ui     │    │   OpenAI API    │    │    Doppler      │
│   Tailwind      │    │   (gpt-4o-mini) │    │  Environment    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Migration Path

The migration from Neon to Supabase follows these phases (detailed in `/docs/roadmap.md`):

1. **Phase 1:** Continue with Neon for rapid development
2. **Phase 2:** Set up Supabase environment and test connection
3. **Phase 3:** Migrate Prisma schema and implement RLS
4. **Phase 4:** Replace manual cron with Supabase Edge Functions
5. **Phase 5:** Complete cutover and remove Neon dependencies

## Component Organization

### Shared UI Primitives

The application uses standardized UI primitives aligned with the Figma design system:

- **AppShell** (`/components/layout/AppShell.tsx`) - Main layout wrapper for all app pages with responsive sidebar and main content area
- **PageHeader** (`/components/ui/PageHeader.tsx`) - Standardized page headers with title, optional description, and actions area
- **CardGrid** (`/components/ui/CardGrid.tsx`) - Responsive grid wrapper (1/2/3/4 columns) for card layouts
- **ItemCard** (`/components/ui/ItemCard.tsx`) - Domain-agnostic card component with thumbnail, tags, and actions
- **TagChip** (`/components/notes/TagChip.tsx`) - Metadata pill/chip component with optional custom colors

These components should be reused across pages instead of creating custom layouts. They use consistent design tokens defined in CSS custom properties.

### UI Surface Vocabulary

All pages (MindStorm, Stacks, Vault, Insights, Memory, Nope) share a consistent design language built on shared primitives:

- **Shared Surface Pattern**: SidebarNav + PageHeader + CardGrid + ItemCard

  - SidebarNav provides persistent left rail navigation for all /app routes
  - PageHeader delivers consistent page-level heading bars
  - CardGrid enables responsive tile layouts (1–4 columns)
  - ItemCard supplies bookmark/tile style cards with tags and actions

- **Visual System**: Derived from "Bookmark App — Community" Figma reference (BBQ/Podcast/Wishlist patterns)

  - This design language is canonical for the first shipped aesthetic
  - MindStorm, Stacks, Vault, Insights, Memory, and Nope all use this visual language so the product feels coherent

- **Responsive Behavior**: Mobile-first with sidebar collapse and adaptive card grids
- **Accessibility**: ARIA labels on all icon-only buttons, keyboard navigation support
- **Animation**: framer-motion for consistent card mount animations

This vocabulary establishes the canonical design language for early MindStorm UI development. The Vault screen is allowed to diverge in the future (darker theme) but will still respect the same layout primitives (SidebarNav + PageHeader + CardGrid + ItemCard). See `/docs/ui-map.md` for detailed component specifications and usage patterns.

### Design Tokens

CSS custom properties for consistent styling:

- `--radius-card: 0.75rem` - Standard card border radius
- `--radius-input: 0.5rem` - Form input border radius
- `--radius-chip: 9999px` - Full-rounded chip/pill radius

### `/components` Structure

```
components/
├── layout/           # AppShell, SidebarNav, TopBar, MobileNavSheet
├── notes/            # NoteCard, QuickCaptureBar, ClusterChip, TagChip
├── stacks/           # StackCard
├── vault/            # VaultList, VaultLockScreen
├── insights/         # InsightCard
├── memory/           # TimelineGrid
├── tour/             # TourCallout
└── ui/               # shadcn/ui components (button, card, dialog, etc.)
```

### `/lib` Structure

```
lib/
├── ai/               # AI-related utilities
│   ├── analyzeTimeline.ts
│   ├── buildSmartStacks.ts
│   ├── classifyNote.ts
│   ├── clusterNotes.ts
│   ├── embedNote.ts
│   └── generateWeeklyInsights.ts
├── auth.ts           # Authentication utilities
├── clientApi.ts      # Client-side API calls
├── db.ts             # Database connection and utilities
├── dto.ts            # Data transfer objects
├── encryption.ts     # Vault encryption utilities
├── onboarding.ts    # User onboarding flow
├── openai.ts         # OpenAI API integration
├── useGuidedTour.ts  # Tour system
└── utils.ts          # General utilities
```

## API Route Patterns

### Standard Error Handling

```typescript
try {
  // Route logic
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error("API Error:", error);
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
```

### Authentication Checks

```typescript
// Phase 1: No auth (development)
// Phase 3+: Supabase auth check
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Response Shapes

```typescript
// Success response
{ success: true, data: T }

// Error response
{ success: false, error: string }

// Paginated response
{ success: true, data: T[], pagination: { page: number, total: number } }
```

## AI/ML Integration

### Embedding Pipeline

1. **Note Creation:** User creates note via QuickCaptureBar
2. **Classification:** OpenAI classifies note content and generates tags
3. **Embedding:** Note content converted to vector using OpenAI embeddings
4. **Storage:** Vector stored in pgvector column in database
5. **Clustering:** Similar vectors grouped into clusters

### Classification Flow

```typescript
// 1. Send note to OpenAI for classification
const classification = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "Classify this note content and suggest relevant tags.",
    },
    {
      role: "user",
      content: noteContent,
    },
  ],
});

// 2. Extract tags and categories
const tags = extractTags(classification.choices[0].message.content);

// 3. Generate embedding for clustering
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: noteContent,
});
```

### Clustering Algorithm

1. **Similarity Search:** Use pgvector to find notes with similar embeddings
2. **Threshold-based Grouping:** Group notes above similarity threshold
3. **Manual Override:** Allow users to merge/split clusters
4. **Re-clustering:** Trigger fresh clustering when patterns change

## Security Architecture

### Authentication Model (Phase 3+)

- **Supabase Auth:** Email/password + optional OAuth providers
- **JWT Tokens:** Stateless authentication with automatic refresh
- **Session Management:** Handled by Supabase client libraries

### Data Ownership

- **Row-Level Security (RLS):** Database-level access control
- **User Isolation:** Users can only access their own notes
- **Admin Access:** Service role key for system operations

### Vault Encryption

- **Client-Side Only:** Encryption happens in browser, never on server
- **AES-GCM:** Industry-standard encryption algorithm
- **Key Derivation:** PBKDF2 from user password
- **Zero-Knowledge:** Server never sees plaintext vault contents

### RLS Policies (Phase 3)

```sql
-- Users can only see their own notes
CREATE POLICY "Users can view own notes"
ON notes FOR SELECT
USING (auth.uid() = user_id);

-- Users can only modify their own notes
CREATE POLICY "Users can modify own notes"
ON notes FOR ALL
USING (auth.uid() = user_id);
```

## Feature Flags Architecture

### Overview

PostHog feature flags enable controlled beta testing and phased rollouts without code deployments. Flags are managed in PostHog dashboard and take effect immediately.

### Implementation

- **Client-side**: `lib/posthog/client.ts` - Singleton PostHog JS client for browser
- **Server-side**: `lib/posthog/server.ts` - PostHog Node client for API routes and server components
- **Middleware**: `lib/featureFlags.ts` - Centralized flag management with in-memory caching (5min TTL)
- **Component**: `components/ui/FeatureGate.tsx` - React component for conditional rendering

### Flag Constants

All feature flags are defined in `FEATURE_FLAGS` enum:
- `spark-beta` - Spark feature beta
- `muse-ai` - Muse AI feature
- `orbit-experimental` - Orbit experimental view
- `vault-enhanced` - Enhanced vault features
- `klutr-global-disable` - Global kill switch (disables all experimental features)

### Caching Strategy

- In-memory cache with 5-minute TTL
- Cache key format: `flag:${flag}:${userId || 'anonymous'}`
- Automatically invalidates expired entries
- Can be upgraded to Redis for multi-instance deployments

### Fail-Safe Behavior

- **Fail closed**: If PostHog is unavailable, flags default to `false` (disabled)
- **Kill switch**: `klutr-global-disable` flag disables all experimental features when enabled
- **Error handling**: All flag checks catch errors and return `false` to prevent app crashes

### Usage Patterns

**Client-side (React components):**
```tsx
import { FeatureGate } from "@/components/ui/FeatureGate";

<FeatureGate flag="spark-beta">
  <SparkInterface />
</FeatureGate>
```

**Server-side (API routes):**
```tsx
import { getFeatureFlag } from "@/lib/posthog/server";

const enabled = await getFeatureFlag("spark-beta", user.id);
```

**Programmatic (anywhere):**
```tsx
import { featureEnabled, FEATURE_FLAGS } from "@/lib/featureFlags";

const enabled = await featureEnabled(FEATURE_FLAGS.SPARK_BETA, userId);
```

### Debug Route

`/debug/flags` - Protected route showing all active flags for current user. Useful for development and testing.

## Data Model

### Core Prisma Models

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  notes     Note[]
  clusters  Cluster[]
  stacks    Stack[]
  insights  Insight[]
  vaultNotes VaultNote[]
}

model Note {
  id          String   @id @default(cuid())
  content     String
  tags        String[]
  embedding   Unsupported("vector(1536)")?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])
  cluster     Cluster? @relation(fields: [clusterId], references: [id])
  clusterId   String?
}

model Cluster {
  id        String   @id @default(cuid())
  name      String
  userId    String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  notes     Note[]
}

model Stack {
  id        String   @id @default(cuid())
  name      String
  pinned    Boolean  @default(false)
  userId    String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}

model VaultNote {
  id        String   @id @default(cuid())
  ciphertext String
  iv        String
  userId    String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}
```

## Background Jobs

### Current Implementation (Phase 1)

- **Manual API Routes:** `/api/cron/nightly-cluster`, `/api/cron/nightly-stacks`, `/api/cron/weekly-insights`
- **CRON_SECRET Validation:** All routes require `Authorization: Bearer <CRON_SECRET>` header
- **External Triggering:** Manual or external cron service calls these endpoints

### Target Implementation (Phase 4)

- **Supabase Edge Functions:** Serverless functions triggered by pg_cron
- **Automatic Scheduling:** Database-level cron scheduling
- **Secret Management:** Environment variables in Supabase
- **Error Handling:** Built-in retry logic and logging

### Job Descriptions

- **nightly-cluster:** Re-embed all notes, regenerate clusters based on new content
- **nightly-stacks:** Analyze note patterns, rebuild smart stacks
- **weekly-insights:** Generate AI summary of week's note-taking activity

## Agent Update Requirements

This document MUST be updated whenever:

- New technologies are added to the stack
- Database schema changes are made
- API route patterns are modified
- Security policies are updated
- Migration phases are completed
- New architectural decisions are made

## Marketing vs App Route Groups

The application uses Next.js route groups to separate public marketing pages from authenticated app pages:

### Route Group Structure

- **`(marketing)`** - Public routes that don't require authentication
  - `/` - Landing page
  - `/login` - Login page
  - Layout: `app/(marketing)/layout.tsx` - Includes SEO metadata, no AppShell

- **`(app)`** - Authenticated routes that require Supabase Auth
  - `/app` - Main dashboard (all notes)
  - `/app/mindstorm` - MindStorm clusters
  - `/app/stacks` - Smart Stacks
  - `/app/vault` - Encrypted vault
  - `/app/insights` - Weekly insights
  - `/app/memory` - Memory Lane timeline
  - `/app/nope` - Nope Bin
  - Layout: `app/(app)/layout.tsx` - Wraps all pages with AppShell (Sidebar + TopBar)

### Authentication Middleware

The `middleware.ts` file at the root handles authentication:

- **Public Routes**: `/`, `/login`, `/api/*`, static assets - No authentication required
- **Protected Routes**: All `/app/*` routes - Require valid Supabase Auth session
- **Redirect Logic**: Unauthenticated users accessing `/app/*` are redirected to `/login?redirect=/app/...`

### Middleware Implementation

```typescript
// middleware.ts uses @supabase/ssr createServerClient
// - Checks session via cookies
// - Refreshes expired tokens automatically
// - Redirects unauthenticated users to login
```

### Layout Hierarchy

```
app/layout.tsx (root)
├── ThemeProvider
├── Analytics
└── Route Groups:
    ├── (marketing)/layout.tsx
    │   └── SEO metadata only
    └── (app)/layout.tsx
        └── AppShell wrapper
            ├── SidebarNav
            └── TopBar
```

## References

- **Roadmap:** `/docs/roadmap.md`
- **Database Schema:** `/docs/database.md`
- **Vault Security:** `/docs/vault.md`
- **Cron Jobs:** `/docs/cron.md`
- **Product Requirements:** `/PRD.md`
