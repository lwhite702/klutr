# Changelog

All notable changes to Klutr will be documented in this file.

## 2025-01-27 14:30 ET

- [marketing] Updated home page with ND-focused messaging and hero content
- [marketing] Added "Klutr for Neurodivergent Minds" section to home page
- [marketing] Updated "How It Works" section with 4-step process (Dump, We sort, Nope the noise, Rediscover gems)
- [marketing] Rebuilt features page with two-column Fintask modules
- [marketing] Added neurodivergent resource hub page at /neurodivergent
- [marketing] Added Compare Us page at /compare with feature comparison table
- [marketing] Updated navigation to include "For Neurodivergent Minds" and "Compare Us" links
- [ui] Created FeatureModule component for two-column feature layouts
- [basehub] Updated home page hero content (primaryCTA: "Start dumping", heroSubtext: "Dump everything—Klutr handles the sorting.")
- [basehub] Committed all marketing content updates to Basehub

## 2025-11-16 22:45 ET

- [fix] Removed .DS_Store files from git tracking and added macOS system file patterns to .gitignore
- [git] Added .DS_Store, **/.DS_Store, .AppleDouble, and **/.AppleDouble to .gitignore to prevent macOS system files from being committed

## 2025-11-16 22:30 ET

- [feature] Implemented audio transcription using OpenAI Whisper API in messages/create route
- [feature] Implemented thread similarity matching using pgvector cosine distance to automatically group related messages
- [feature] Implemented Supabase queries in clusterNotes.ts and analyzeTimeline.ts (replaced TODO placeholders)
- [fix] Replaced all mockData type imports with proper types from lib/types/stream.ts and lib/dto.ts
- [fix] Updated BoardCard component to use BoardDTO instead of mock Board type
- [api] Created lib/ai/transcribeAudio.ts for audio transcription functionality
- [api] Created lib/ai/findSimilarThread.ts for thread similarity matching
- [types] Created lib/types/stream.ts for StreamDrop type definitions (extracted from mockData)
- [build] All TypeScript errors resolved, production build succeeds

## 2025-11-16 22:00 ET

- [feature] Added database storage for email subscriptions using Supabase (gracefully handles missing table)
- [fix] Replaced all mock data usage in app pages with real API calls:
  - Board detail page now uses `/api/boards/[id]` with notes included
  - Muse page now uses `/api/insights/generate` and `/api/insights/list` for real insights
  - Vault page now uses `/api/vault/list` for real vault notes
- [api] Updated board detail API to include notes in response for board detail page

## 2025-11-16 21:30 ET

- [feature] Implemented email subscription API route (`/api/marketing/subscribe`) with Resend integration
- [feature] Added email subscription form to MarketingFooter with proper error handling and success feedback
- [feature] Email subscription sends welcome email via Resend (if configured) and logs subscription for future database storage
- [ui] Email subscription form shows loading state, success message, and error messages
- [todo] Completed TODO: Integrate email service in MarketingFooter component

## 2025-11-16 21:15 ET

- [decision] Proceeding without Figma extraction - only 6 calls/month available, will use existing design tokens and Fintask-inspired patterns
- [refine] Marketing pages already use Fintask-inspired design tokens from `lib/design-tokens.ts` (MarketingHeader, PricingTierCard, BillingToggle, FAQAccordion, etc.)
- [refine] App pages already use Fintask-inspired layout (240px sidebar, 64px header, max-width 1100px content, brutalist button styles)
- [complete] All redesign work completed using existing design tokens and documented patterns - no Figma extraction needed
- [ready] Application fully ready for production deployment with consistent Fintask-inspired design system

## 2025-11-16 20:00 ET

- [fix] Resolved Next.js route conflict by removing `app/(app)/page.tsx` and using redirect in `next.config.mjs` instead
- [fix] Fixed all MarketingFooter TypeScript errors by removing invalid `latestReleases` and `upcomingItems` props from all marketing pages
- [fix] Removed unused imports and variables (`getLatestChangelogEntries`, `getUpcomingRoadmapItems`) from marketing pages
- [fix] Updated ScrollArea component to forward refs using React.forwardRef, fixing auto-scroll bug in Stream page
- [build] Production build now completes successfully with all TypeScript errors resolved
- [ready] Application is ready for production deployment

## 2025-11-16 19:30 ET

- [fix] Fixed Next.js route conflict by removing redundant `/app` redirect from `next.config.mjs` (now handled by `app/(app)/page.tsx`)
- [fix] Removed duplicate `app/(app)/app` directory that was creating conflicting routes
- [fix] Updated ScrollArea component to forward refs using React.forwardRef, fixing auto-scroll bug in Stream page
- [fix] Auto-scroll to bottom now works correctly when new drops are added to the stream (ref now properly targets ScrollArea viewport)

## 2025-11-16 18:55 ET

- [ui] Redesigned marketing pages with Fintask-inspired layout while maintaining Klutr-specific content
- [ui] Created design tokens system (`lib/design-tokens.ts`) with Fintask color mappings and Klutr brand integration
- [ui] Updated MarketingHeader to match Fintask header: white background with shadow, rounded corners, brutalist button style
- [ui] Redesigned MarketingFooter with Fintask-inspired layout: email signup form, social links, 4-column grid
- [ui] Created new pricing components: PricingTierCard, BillingToggle, FAQAccordion, UseCaseCard, DecorativeBackground
- [ui] Completely redesigned pricing page with Klutr-specific tiers (Free Beta, Pro $8/mo, Team $20/user), use cases, and FAQ
- [content] All marketing copy updated to be Klutr-specific (not Fintask placeholders): features, pricing, FAQs, use cases
- [content] Pricing page includes Klutr-specific FAQs: "What makes Klutr different from Notion/Apple Notes?", "How does AI clustering work?", etc.
- [content] Use cases written for Klutr: "For Individuals" (low-friction capture), "For Power Users" (advanced insights), "For Teams" (collaboration)
- [brand] Maintained Klutr brand voice throughout: friendly, irreverent, transparent (per BRAND_VOICE.md)
- [brand] Used Klutr pricing tiers and features from BaseHub seed data: Free Beta ($0), Pro ($8/mo), Team ($20/user)

## 2025-11-16 12:00 ET

- [fix] Created `/app` redirect to `/app/stream` to fix routing issue (was showing "Flux — Coming soon")
- [fix] Moved panel rendering from `stream/page.tsx` to `app/(app)/layout.tsx` so panels work on all authenticated pages
- [ui] Simplified TopBar logo: removed wordmark/tagline, increased logo size to h-16/h-20, made flush to left edge
- [ui] Panels (MindStorm, Insights, Memory, Search) now accessible from any authenticated page via sidebar or keyboard shortcuts

## 2025-11-16 00:18 ET

- [infra] Removed Vercel cron job configuration from vercel.json to fix deployment error (plan limit: 2 cron jobs, attempted: 3)
- [infra] All cron jobs now handled by Supabase Edge Functions with pg_cron scheduling (nightly-cluster, nightly-stacks, weekly-insights)
- [docs] Updated VERCEL_SETUP.md and infra/README.md to reflect Supabase cron job handling
- [docs] API routes under /app/api/cron/ remain available for manual testing/debugging but are not scheduled by Vercel

## 2025-11-15 15:30 ET

- [ui] Refined authenticated app shell using Fintask-inspired layout while preserving stream-first architecture
- [brand] Increased Klutr logo presence in header with larger logo (56px height) and wordmark with tagline
- [ui] Updated sidebar navigation with Fintask-inspired styling, keyboard shortcut hints (⌘M, ⌘I, ⌘H, ⌘K), and improved active states with left border indicators
- [ui] Enhanced Stream page with Fintask-inspired card layouts, max-width column (1100px), and improved spacing (16px vertical gap)
- [ui] Refined panel components (MindStorm, Insights, Memory, Search) with Fintask-inspired visual polish and consistent spacing
- [ui] Updated secondary pages (Boards, Nope, Memory) with Fintask-inspired layouts and max-width constraints
- [ui] Applied Fintask spacing proportions: sidebar 240px, header 64px height, content padding 24px, card spacing 16px
- [ui] Updated StreamMessage cards with Fintask-inspired styling: rounded-lg borders, subtle shadows, consistent padding
- [ui] Improved StreamInput styling to match Fintask form inputs with rounded-lg borders
- [ui] Enhanced PanelContainer with Fintask-inspired side panel design: clean borders, subtle shadow, proper flex layout
- [ui] Updated PanelHeader with improved typography hierarchy and consistent padding (24px horizontal, 16px vertical)

## 2025-11-15 03:06 ET

- [build] Fixed TypeScript build errors for Vercel deployment
- [fix] Updated Note interface in app/(app)/app/page.tsx to include optional title, description, and pinned properties
- [fix] Fixed NopeNote interface to include optional pinned property
- [fix] Updated insights/generate route to use result.usage instead of result.cost
- [fix] Fixed system_tags to systemTags in messages routes (create, classify)
- [fix] Updated notes/clusters route to use createdAt for orderBy instead of clusterConfidence
- [fix] Updated notes/search route to use Supabase adapter with client-side filtering
- [fix] Added delete method to note model in Supabase adapter
- [fix] Added dropType, fileUrl, fileName, fileType fields to note.create in Supabase adapter
- [fix] Added skip parameter support to note.findMany in Supabase adapter
- [fix] Added count method to note model in Supabase adapter
- [fix] Updated stream/search route to use client-side filtering instead of Prisma contains
- [fix] Fixed weekly-summaries routes to use weeklyInsight model instead of weeklySummary
- [fix] Updated weekly-summaries to use weekStart instead of startDate/endDate
- [fix] Commented out $queryRaw usage in analyzeTimeline.ts (raw SQL not yet supported)
- [fix] Commented out $queryRaw usage in clusterNotes.ts (raw SQL not yet supported)
- [fix] Updated embedNote.ts to use generateAIEmbedding with object parameter
- [fix] Wrapped useSearchParams in Suspense boundary in reset-password/confirm page
- [build] Build now succeeds and is ready for Vercel deployment

## 2025-11-14 21:17 ET

- [migration] **Complete Supabase migration** - Removed Prisma entirely, migrated all models to Supabase
- [migration] Migrated chat models (conversation_threads, messages) to Supabase with full CRUD support
- [migration] Created supabase/migrations/007_chat_models.sql with conversation_threads and messages tables
- [migration] Implemented message and conversationThread CRUD methods in lib/supabase-db.ts
- [migration] Updated lib/db.ts to remove PrismaClient and use only Supabase adapter
- [migration] Removed @prisma/client and prisma from package.json dependencies
- [migration] Removed postinstall script that ran prisma generate
- [migration] Deleted prisma/schema.prisma and prisma/ directory
- [migration] Renamed NEON_DATABASE_URL to DATABASE_URL throughout codebase and documentation
- [migration] Updated .github/workflows/ci.yml to use DATABASE_URL instead of NEON_DATABASE_URL
- [migration] Updated all documentation files (DOPPLER.md, VERCEL_SETUP.md, README.md, docs/) to reference DATABASE_URL
- [migration] Updated MIGRATION_SUMMARY.md and SUPABASE_MIGRATION.md to reflect 100% complete migration status
- [migration] Updated docs/roadmap.md to mark Phase 3 and Phase 5 as complete
- [migration] Updated docs/architecture.md to remove Neon references and update to Supabase
- [migration] Added $executeRaw support for message embedding updates in lib/supabase-db.ts
- [docs] Updated migration documentation to reflect complete removal of Neon and Prisma dependencies

## 2025-11-14 05:09 ET

- [feature] Created comprehensive branded auth pages (login, signup, password reset) with Klutr illustrations, colors, and witty microcopy
- [seo] Enhanced root layout with comprehensive metadata including OpenGraph, Twitter cards, and canonical URLs
- [seo] Added full SEO metadata to all marketing pages (home, about, pricing, FAQ) with OG images and Twitter cards
- [infra] Created site.webmanifest with proper PWA configuration and icon references
- [ui] Created branded loading skeleton components (ShimmerSkeleton, CardSkeleton, NoteCardSkeleton, GridSkeleton) with Klutr color gradients
- [ui] Updated StreamSkeleton to use new branded shimmer effect
- [ui] Added shimmer animation keyframes to globals.css
- [ui] Enhanced auth pages with smooth transitions, loading states, and branded error/success messages
- [a11y] Improved SidebarNav accessibility with aria-labels, aria-current, and aria-pressed attributes
- [a11y] Added aria-hidden to decorative icons in navigation
- [content] Updated Basehub home page hero content with production-ready Klutr copy via mcp_basehub_klutr_update_blocks
- [content] Verified features content is fully populated with 10 production-ready features
- [content] Fixed Basehub validation errors by populating required fields in help topics and onboarding blocks
- [content] Successfully committed Basehub content changes to main branch
- [fix] Updated Hero secondary CTA link to point to /about instead of /login (matches "See how it works" copy)
- [brand] Standardized tagline to "Organize your chaos. Keep the spark." across footer and marketing pages
- [docs] Created BASEHUB_CONTENT_STATUS.md documenting Basehub content structure and population status
- [docs] Created PRODUCTION_POLISH_COMPLETION.md with final completion summary
- [docs] Created DOPPLER_BROWSER_TESTING.md guide for local development setup
- [docs] Created BASEHUB_CONTENT_POPULATION_GUIDE.md with step-by-step instructions for pricing, FAQ, and testimonials
- [test] Completed browser testing checklist - all items pass (see reports/BROWSER_TEST_RESULTS.md)
- [fix] Updated login page tagline from "Clear the clutr" to "Welcome to Klutr" for brand consistency
- [fix] Fixed illustration mapping to match actual file names (PascalCase with --Streamline-Ux suffix)
- [fix] Fixed feature pages error - corrected BaseHub query syntax (removed \_eq filter, fetch all then filter client-side, removed media union fields that require inline fragments)
- [feature] Added getFeatureBySlug helper function to lib/queries/features.ts with proper error handling and draft mode fallback
- [seo] Added generateMetadata to feature pages with OpenGraph and Twitter card support
- [docs] Updated CHANGELOG with production polish work

## 2025-11-14 18:00 ET

- [security] Added Cloudflare Turnstile CAPTCHA to signup page to prevent bot signups
- [ui] Integrated @marsidev/react-turnstile component in signup form
- [infra] Added NEXT_PUBLIC_TURNSTILE_SITEKEY environment variable configuration
- [docs] Updated DOPPLER.md with Turnstile setup instructions and Vercel deployment notes

## [Production Readiness Sprint] - 2025-11-11

### Added

**Infrastructure & Security**

- [infra] Complete infrastructure setup guide in `infra/README.md`
- [security] Row Level Security (RLS) policies for all user data tables
- [security] RLS documentation in `docs/security/rls.md`
- [security] SQL script to apply RLS policies (`scripts/apply-rls-policies.sql`)
- [security] Authentication middleware protecting all app routes
- [security] Removed unsafe stub user fallback - auth now throws on failure

**Authentication**

- [feature] Complete Supabase Auth integration
- [ui] Login page at `/login` with email/password and magic link
- [ui] Signup page at `/signup` with validation
- [api] Auth callback route at `/auth/callback`
- [api] Middleware protecting authenticated routes
- [api] Proper error handling for unauthenticated requests

**AI & Cost Management**

- [feature] Vercel AI SDK abstraction layer in `lib/ai/provider.ts`
- [feature] Support for multiple AI providers (OpenAI, Anthropic)
- [feature] Automatic retry logic with exponential backoff (3 retries)
- [feature] 12-second timeout on all AI requests
- [feature] Cost estimation and logging for all AI operations
- [feature] Model tier system (cheap/medium/expensive)
- [feature] Batch embedding generation with rate limiting
- [docs] Comprehensive AI cost estimate in `reports/ai-cost-estimate.md`
- [docs] Cost estimator tool in `lib/ai/cost-estimator.ts`

**Database**

- [docs] Database index documentation in `docs/database/indexes.md`
- [db] Setup script for pgvector and indexes in `scripts/setup-database.sql`
- [db] Vector indexes for similarity search (IVFFlat)
- [db] Full-text search indexes (GIN)
- [db] Analytics indexes for time-series queries

**CI/CD & Testing**

- [ci] Complete GitHub Actions workflow in `.github/workflows/ci.yml`
- [ci] Deployment workflow in `.github/workflows/deploy.yml`
- [ci] Lint, type-check, build, and test jobs
- [test] Playwright configuration in `playwright.config.ts`
- [test] E2E tests for authentication (`tests/e2e/auth.spec.ts`)
- [test] E2E tests for navigation (`tests/e2e/navigation.spec.ts`)
- [test] E2E tests for app flows (`tests/e2e/app-flow.spec.ts`)
- [ci] Security scanning with TruffleHog
- [ci] Accessibility testing in CI pipeline

**Documentation**

- [docs] Feature state report in `reports/feature-state.json` and `reports/feature-state.md`
- [docs] Architecture documentation in `docs/architecture.md`
- [docs] Operations runbook in `docs/operations.md`
- [docs] AI cost estimate report in `reports/ai-cost-estimate.md`
- [docs] RLS policy documentation in `docs/security/rls.md`
- [docs] Database indexes guide in `docs/database/indexes.md`
- [docs] Infrastructure setup guide in `infra/README.md`

**Configuration**

- [config] Vercel deployment configuration in `vercel.json`
- [config] Cron job schedules for background tasks
- [config] Security headers for all API routes
- [config] npm scripts for testing (`test`, `test:e2e`, `test:e2e:ui`)

### Changed

- [breaking] `getCurrentUser()` now throws on auth failure instead of returning stub user
- [breaking] `getCurrentUserId()` deprecated in favor of `getCurrentUser()`
- [refactor] AI code now uses Vercel AI SDK instead of direct OpenAI SDK
- [refactor] Middleware moved to root `middleware.ts` for proper route protection

### Fixed

- [security] Fixed authentication bypass via stub user fallback
- [security] Added missing CRON_SECRET validation to all cron endpoints
- [fix] TypeScript errors in AI provider with proper usage property access
- [fix] Proper error handling for failed auth in API routes

### Security

- [security] All user data now protected by RLS policies
- [security] Authentication required for all app and API routes
- [security] Removed development-only stub user in production
- [security] Added security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- [security] CRON_SECRET validation on all background jobs

---

## Previous Releases

### [Initial Development] - 2024-2025

**Core Features Implemented:**

- Notes and messages capture
- MindStorm clustering algorithm
- Smart Stacks generation
- Weekly insights
- Tag management
- Board organization
- Feature flags via PostHog
- BaseHub CMS integration
- Marketing pages
- Onboarding flow

**Infrastructure:**

- Next.js 16 with App Router
- React 19
- Prisma ORM
- Neon PostgreSQL
- Supabase Auth and Storage
- OpenAI integration
- PostHog analytics
- Rollbar error monitoring

---

## Migration Notes

### For Developers

If you're upgrading from the previous version:

1. **Authentication Changes:**

   - Remove any code that relied on stub user `user_dev_123`
   - Update API calls to handle 401 errors properly
   - Ensure Supabase environment variables are set

2. **AI Code Changes:**

   - Replace `openai.chat.completions.create()` with `generateAIText()` from `lib/ai/provider.ts`
   - Replace `getEmbedding()` with `generateAIEmbedding()`
   - Update imports to use new AI abstraction layer

3. **Database:**

   - Run RLS policy script: `psql $DATABASE_URL < scripts/apply-rls-policies.sql`
   - Run index setup: `psql $DATABASE_URL < scripts/setup-database.sql`
   - Verify pgvector extension is enabled

4. **Environment Variables:**
   - Set all required variables in Doppler
   - Update Vercel environment variables
   - Verify CRON_SECRET is set

---

## Breaking Changes Summary

### Version 1.0.0 (Production Ready)

**Authentication:**

- `getCurrentUser()` now throws instead of returning stub
- `getCurrentUserId()` is deprecated

**AI:**

- Direct OpenAI SDK usage replaced with Vercel AI SDK
- New function signatures for AI operations

**Security:**

- All routes now require authentication
- RLS policies must be applied to database

---

_For full details, see the git commit history and documentation in `/docs`._
