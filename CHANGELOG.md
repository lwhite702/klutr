# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Format

Each entry includes:

- **Date and time** in America/New_York timezone (ET)
- **Category tags** in brackets: [feature], [ui], [infra], [docs], [risk], [fix]
- **Brief description** of what changed
- **Context** when helpful (why the change was made, known limitations)

## Categories

- **[feature]** - New functionality or capabilities
- **[ui]** - User interface changes, components, styling
- **[infra]** - Infrastructure, deployment, environment, dependencies
- **[docs]** - Documentation updates, README changes, comments
- **[risk]** - Known risks, limitations, or temporary compromises
- **[fix]** - Bug fixes, error handling improvements

---

## 2025-11-02 19:09 ET

- [fix] Fixed missing mock data for "client-work" stack - added mockStackItems["client-work"] with work-themed items to match stackNameMap

## 2025-11-01 04:25 ET

- [infra] Fixed package.json build scripts - removed Doppler dependency for Vercel builds (Vercel uses env vars directly)
- [infra] Removed ignoreBuildErrors from next.config.mjs for production safety
- [fix] Fixed database URL variable name in lib/db.ts (NEON_NEON_DATABASE_URL → NEON_DATABASE_URL)
- [security] Implemented CRON_SECRET validation in all 3 cron route files (nightly-cluster, nightly-stacks, weekly-insights)
- [infra] Added postinstall script to generate Prisma client during Vercel builds
- [infra] Created /api/health endpoint for Vercel health checks
- [docs] Created VERCEL_SETUP.md with step-by-step deployment instructions
- [docs] Updated DOPPLER.md with Vercel environment variable setup section
- [docs] Updated docs/deployment.md with verified Vercel configuration and Phase 1 variable requirements

## 2025-10-30 22:40 ET

- [ui] Added PageHeader, CardGrid, TagChip, ItemCard components based on Figma bookmark dashboard designs.
- [ui] Updated /app/\* pages to render with AppShell + PageHeader + CardGrid for consistent layout.
- [docs] Created ui-map.md and updated architecture.md with UI Surface Vocabulary.
- [a11y] Added aria-labels to icon actions inside ItemCard.

## 2025-10-28 22:52 ET

- [ui] Added Figma-aligned design tokens (--radius-card, --radius-input, --radius-chip) to globals.css
- [ui] Created PageHeader component for standardized page headers with title, description, and actions
- [ui] Created CardGrid responsive grid wrapper (1/2/3/4 cols) for card layouts
- [ui] Created ItemCard domain-agnostic card with thumbnail, tags, and framer-motion animations
- [ui] Updated TagChip to accept colorClassName prop for custom styling
- [docs] Updated architecture.md and dev-setup.md with shared UI primitives guidance
- [docs] Established UI primitives as standard building blocks across all pages

## 2025-10-29 15:30 ET

- [docs] Created agents.md with complete Wrelik agent operating rules and Context7 MCP requirement
- [docs] Created PRD.md with product vision, current features, personas, and success metrics
- [docs] Created BRAND_VOICE.md with communication standards and UI copy guidelines
- [docs] Created CHANGELOG.md with format specification and bootstrap entry
- [docs] Established complete documentation framework for AI agent governance
- [infra] Updated DOPPLER.md to include Supabase environment variables for Phase 2 migration
- [risk] Documentation framework established but /docs/ directory and technical docs pending creation

## 2025-10-29 16:45 ET

- [docs] Created /docs/ directory for internal technical documentation
- [docs] Created docs/architecture.md with current (Neon) and target (Supabase) stack architecture
- [docs] Created docs/roadmap.md with 5-phase development roadmap and migration strategy
- [docs] Created docs/vault.md with client-side encryption implementation and security details
- [docs] Created docs/cron.md with background job documentation and Supabase Edge Functions plan
- [docs] Created docs/database.md with Prisma schema, RLS policies, and migration guide
- [docs] Completed comprehensive documentation framework for AI agent governance and technical reference

## 2025-10-29 22:45 ET

- [security] Enhanced client-side encryption with AES-GCM integrity verification (authTag)
- [security] Added Redis-based rate limiting for production environments with fallback to in-memory
- [security] Implemented Content Security Policy headers to prevent XSS attacks
- [security] Added comprehensive server-side decryption validation with suspicious content detection
- [validation] Enhanced API response validation with Zod schemas in createSuccessResponse
- [api] Updated vault APIs with secure headers and enhanced validation
- [infra] Added secure error/success response helpers with CSP headers
- [docs] Created comprehensive security utilities in lib/security/ and lib/validation/

## 2025-10-29 22:15 ET

- [security] Added comprehensive input validation and rate limiting to all API endpoints
- [security] Implemented secure encryption utilities that prevent key exposure in error traces
- [security] Added Doppler configuration files to .gitignore to prevent accidental commits
- [reliability] Created ErrorBoundary component for comprehensive React error handling
- [reliability] Implemented proper cleanup hooks for useEffect to prevent memory leaks
- [reliability] Added async state management with loading and error states for all UI operations
- [validation] Integrated Zod schemas for runtime validation of API requests and responses
- [api] Enhanced note creation endpoint with validation, rate limiting, and response validation
- [ui] Updated vault page with secure encryption, error boundaries, and proper error handling
- [infra] Added rate limiting middleware with configurable limits for different operation types

## 2025-10-29 21:15 ET

- [feature] Merged Opus branch scaffold into main as canonical development branch
- [ui] Enhanced AppShell component with activeRoute and showDemoBadge props for per-page flexibility
- [ui] Added demo badge support to TopBar component (shows when showDemoBadge=true)
- [ui] Removed global AppShell wrapper from app/app/layout.tsx for per-page control
- [ui] Updated all 8 pages to explicitly render AppShell with activeRoute prop:
  - /app (Notes) - activeRoute="/app"
  - /app/mindstorm - activeRoute="/app/mindstorm" with showDemoBadge=true
  - /app/stacks - activeRoute="/app/stacks"
  - /app/stacks/[stack] - activeRoute="/app/stacks"
  - /app/vault - activeRoute="/app/vault"
  - /app/insights - activeRoute="/app/insights"
  - /app/memory - activeRoute="/app/memory"
  - /app/nope - activeRoute="/app/nope"
- [ui] Preserved Opus component organization (subdirectories: layout/, notes/, stacks/, etc.)
- [ui] Maintained Opus mock data patterns and animation utilities
- [ui] Kept "Re-cluster now" button functionality in TopBar and MindStorm page
- [infra] All routes build successfully with no TypeScript errors
- [docs] Created main-opus-merge branch for this strategic merge operation
- [risk] Per-page AppShell rendering enables future layout divergence (Vault could have different shell than MindStorm)

## 2025-10-29 17:30 ET

- [infra] Created docs/deployment.md with complete Vercel + Supabase deployment architecture
- [infra] Defined deployment stack: Vercel (frontend), Supabase (backend), Mintlify (docs), Netlify (optional marketing)
- [infra] Documented environment variables, build commands, and security configuration
- [docs] Created /mintlify/ directory for user-facing documentation
- [docs] Created complete Mintlify documentation suite:
  - overview.mdx - Product introduction and value proposition
  - getting-started.mdx - First-time user guide and onboarding
  - notes-guide.mdx - Comprehensive note creation and management guide
  - mindstorm.mdx - AI clustering and automatic organization guide
  - vault.mdx - Encrypted notes and security documentation
  - stacks.mdx - Project-based organization and smart stacks
  - insights.mdx - Weekly AI insights and pattern analysis
  - memory-lane.mdx - Chronological views and activity patterns
- [infra] Established complete deployment pipeline from local dev to production
- [docs] All user-facing documentation follows BRAND_VOICE.md guidelines (calm, clear, confident tone)

## 2025-10-29 18:15 ET

- [test] Comprehensive server and build testing completed successfully
- [test] Development server tested - all routes responding with HTTP 200
- [test] Production build tested - successful compilation and static generation
- [test] TypeScript compilation verified - all type errors resolved
- [fix] Fixed TypeScript implicit 'any' type errors in API routes and AI functions
- [fix] Added explicit type annotations for map functions in insights/list, vault/list, buildSmartStacks, and generateWeeklyInsights
- [test] All 29 routes building successfully (static and dynamic)
- [test] No linting errors detected in app/, components/, lib/ directories
- [infra] Build process verified with Doppler environment variable integration

## 2025-10-29 18:45 ET

- [fix] Fixed critical database schema issue - Prisma schema was looking for wrong environment variable
- [fix] Corrected Prisma schema from NEON_NEON_DATABASE_URL to NEON_DATABASE_URL
- [infra] Successfully ran Prisma db push to create all database tables
- [test] Verified all API endpoints now working correctly with proper database connection
- [test] Tested /api/notes/list, /api/vault/list, /api/stacks/list, /api/insights/list - all returning empty arrays (expected for new database)
- [infra] Database schema now includes all required tables: users, notes, tags, note_tags, smart_stacks, weekly_insights, vault_notes
- [infra] pgvector extension enabled for embedding support
- [test] Application now fully functional with database backend

## 2025-10-29 23:30 ET

- [ui] Implemented shared primitives and Figma-style layouts across all 8 app pages
- [ui] Rebuilt /app pages with consistent card grid aesthetic using AppShell + PageHeader + CardGrid + ItemCard
- [data] Added lib/mockData.ts as single source of truth for BBQ/Podcast/Wishlist themed mock data
- [ui] Created SortAndFilterStub component with shadcn/ui DropdownMenu for collection pages
- [ui] Updated AppShell to pass activeRoute to SidebarNav for proper navigation highlighting
- [ui] Enhanced PageHeader with text-2xl title sizing and mb-6 spacing for consistent layout
- [ui] Enhanced ItemCard with actionsRight prop and text-lg title sizing for better hierarchy
- [ui] Updated all pages to use shared primitives:
  - /app (All Notes): PageHeader + QuickCaptureBar + CardGrid of mockNotes
  - /app/stacks: PageHeader + CardGrid of mockStacks with navigation
  - /app/stacks/[stackSlug]: PageHeader with SortAndFilterStub + CardGrid of stack items
  - /app/mindstorm: PageHeader with ReclusterButton + CardGrid of clusters (showDemoBadge=true)
  - /app/vault: PageHeader + VaultLockScreen OR CardGrid of locked ItemCards
  - /app/insights: PageHeader with GenerateButton + InsightCard components
  - /app/memory: PageHeader + TimelineGrid component for temporal navigation
  - /app/nope: PageHeader + CardGrid with Restore action buttons
- [docs] Created docs/ui-map.md documenting shared primitives and page layout patterns
- [docs] Updated docs/architecture.md with UI Surface Vocabulary subsection
- [ux] Added ARIA labels on all icon-only action buttons in ItemCard for accessibility
- [ux] Established consistent visual system derived from "Bookmark App — Community" Figma reference
- [risk] All pages use mock data only - no backend/Supabase calls implemented yet
