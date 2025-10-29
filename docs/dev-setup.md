---
title: "Local Development Setup"
author: cursor-agent
updated: 2025-10-29
---

# Local Development Setup

This document defines how to set up a working local environment for the Wrelik Notes or Nope (MindStorm) app.

It covers:

- CLI tools you must install
- How to run the app locally
- How to run migrations
- How to deploy to staging/production

All steps here are mandatory. Diverging from this guide will cause environment drift.

## 1. Prerequisites

### Node & pnpm

- Use Node.js LTS.
- Enable pnpm via corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
```

### Doppler CLI (required)

Doppler manages all environment variables for dev, staging, and production.

Install:

```bash
brew install dopplerhq/cli/doppler   # macOS
doppler login
doppler setup
```

You must be logged into Doppler before running the app locally.

### Supabase CLI

Used for deploying and testing Edge Functions.

```bash
brew install supabase/tap/supabase
supabase --version
```

### Vercel CLI

Used for preview and deploy of the Next.js app.

```bash
pnpm dlx vercel --version
```

### Prisma CLI

Prisma is bundled in the repo. No global install needed. We call it via pnpm.

## 2. Environment Variables

All secrets and environment variables come from Doppler.
You do not manually create .env.local.

We support three environments in Doppler:

- dev
- staging
- prod

These environments define (at minimum):

```
NEON_DATABASE_URL
OPENAI_API_KEY
CRON_SECRET
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_JWT_SECRET
SUPABASE_BUCKET_ATTACHMENTS
SUPABASE_BUCKET_VAULT
```

Doppler is the canonical source of truth.
.env.local is considered a generated convenience file and must not be committed.

## 3. Running the App Locally

To start Next.js locally (with env vars from Doppler):

```bash
doppler run -- pnpm dev
```

This will:

- Launch the Next.js app
- Connect to Neon (current dev DB) or Supabase Dev
- Expose local routes like /app, /mindstorm, /vault

Open the browser and confirm:

- The dashboard renders
- You can create a note
- No console errors appear

All validation MUST be done in the browser. Headless-only tests are not considered valid.

## 4. Database & Prisma

Prisma is used to talk to the Postgres database (Neon in current local dev, Supabase in staging/prod).

To apply migrations:

```bash
doppler run -- pnpm prisma migrate dev
```

To regenerate Prisma client:

```bash
doppler run -- pnpm prisma generate
```

To push schema changes:

```bash
doppler run -- pnpm db:push
```

To open Prisma Studio:

```bash
doppler run -- pnpm db:studio
```

Never run Prisma commands without `doppler run --`.
We always want the right DATABASE_URL injected.

## 5. Supabase Edge Functions / Cron Jobs

We run background compute in Supabase Edge Functions:

- embedNotes
- reclusterNotes
- generateWeeklyInsights

To deploy a function:

```bash
doppler run -- supabase functions deploy embedNotes
```

Each cron-like function:

- Must verify the Authorization header:

```
Authorization: Bearer <CRON_SECRET>
```

- CRON_SECRET is stored in Doppler for each environment.

Do not invoke these functions without passing CRON_SECRET in staging/prod.

## 6. Building, Linting, Type-Checking

Before pushing or opening a PR:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

The build step runs `next build`, which should reflect Vercel behavior.

## 7. UI Development Guidelines

### Shared UI Primitives

The application uses standardized UI primitives that should be reused across pages:

- **AppShell** - Main layout wrapper for all app pages
- **PageHeader** - Standardized page headers with title, description, and actions
- **CardGrid** - Responsive grid wrapper for card layouts
- **ItemCard** - Domain-agnostic card component with thumbnail, tags, and actions
- **TagChip** - Metadata pill/chip component

These components are located in `/components/ui/` and `/components/layout/`. Always reuse these building blocks instead of creating custom layouts. They use consistent design tokens defined in CSS custom properties (`--radius-card`, `--radius-input`, `--radius-chip`).

### Component Development

When creating new components:

1. Check if existing UI primitives can be reused
2. Follow the established patterns in `/components/ui/`
3. Use Tailwind classes with design tokens
4. Include proper TypeScript interfaces
5. Test in browser environment (not just TypeScript compilation)

## 8. Deploying to Staging / Production

### Staging (Vercel + Supabase Staging Project)

1. Ensure Doppler staging env is up to date.
2. Ensure Supabase staging project is seeded or migrated.
3. Deploy app:

```bash
vercel deploy
```

4. Sync Doppler → Vercel environment for staging runtime variables.

### Production (Vercel + Supabase Production Project)

1. Ensure Doppler prod env is correct.
2. Ensure Supabase prod migrations have been applied.
3. Deploy app:

```bash
vercel deploy --prod
```

4. Supabase Edge Functions must also be deployed with production Doppler values:

```bash
doppler run -- supabase functions deploy generateWeeklyInsights
```

## 8. Mintlify Docs

User-facing documentation (guides, onboarding, marketing-facing feature explainers) lives under /mintlify/.

To preview docs locally:

```bash
pnpm dlx mintlify dev
```

To publish docs:

```bash
pnpm dlx mintlify publish
```

All public copy MUST follow the tone rules in BRAND_VOICE.md:

- Calm, clear, capable.
- No hype.
- Do not personify AI.

Internal engineering docs stay in /docs/, not in mintlify/.

## 9. Change Control

When any of the following change:

- Required CLI versions
- New environment variables
- New Supabase function
- New cron behavior
- New deployment step

You MUST:

1. Update this file (/docs/dev-setup.md) with the new instructions.
2. Update /docs/deployment.md or /docs/cron.md if applicable.
3. Append an entry to CHANGELOG.md:

```
## 2025-10-29 22:05 ET
- [devx] Updated dev-setup.md with Doppler CLI requirements and supabase functions deploy workflow.
- [infra] Added CRON_SECRET requirement for reclusterNotes edge function.
```

Every changelog entry MUST include timestamp in ET (America/New_York).
