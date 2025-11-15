# Changelog

All notable changes to Klutr will be documented in this file.

## 2025-11-15 08:30 ET

- [ui] Refined authenticated app shell using Fintask-inspired layout while preserving stream-first architecture
- [ui] Updated AppShell to match Fintask 3-part structure (sidebar, main content, right panel area)
- [ui] Enhanced TopBar with larger Klutr branding, tagline, and improved visual hierarchy
- [ui] Refined SidebarNav with Fintask-inspired styling and visible keyboard shortcut hints (⌘K, ⌘M, ⌘I, ⌘H)
- [ui] Polished Stream layout with Fintask-inspired card styling, improved spacing, and centered column (max-width 960px)
- [ui] Updated StreamMessage cards with cleaner borders, shadows, and hover effects matching Fintask patterns
- [ui] Enhanced PanelContainer and PanelHeader with Fintask-like visual polish and improved typography
- [ui] Updated Boards and Nope pages with Fintask-inspired layouts and consistent page headers
- [brand] Increased Klutr logo presence in header (h-7, larger than before) with tagline visible on large screens
- [brand] Maintained Klutr brand colors (coral, mint) while adopting Fintask structural patterns

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
- [fix] Fixed feature pages error - corrected BaseHub query syntax (removed _eq filter, fetch all then filter client-side, removed media union fields that require inline fragments)
- [feature] Added getFeatureBySlug helper function to lib/queries/features.ts with proper error handling and draft mode fallback
- [seo] Added generateMetadata to feature pages with OpenGraph and Twitter card support
- [docs] Updated CHANGELOG with production polish work

## 2025-01-XX XX:XX ET

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

*For full details, see the git commit history and documentation in `/docs`.*
