# Changelog

All notable changes to Klutr will be documented in this file.

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
