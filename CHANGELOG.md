# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2025-11-10 13:42 ET

- [fix] Fixed OpenAI client initialization to use lazy loading, preventing build-time errors when API key is missing
- [fix] Fixed BaseHub client to handle missing tokens gracefully during build by returning mock client that throws on query
- [fix] Added `as any` type assertions to all BaseHub queries to resolve TypeScript strict type checking issues
- [fix] Removed duplicate AppShell wrapper from ChatView component - layout already provides AppShell
- [fix] Added try-catch error handling to generateStaticParams functions for blog and features pages
- [infra] Created minimal ESLint config file (eslint.config.mjs) to resolve ESLint v9 configuration errors
- [infra] Production build now succeeds without requiring BASEHUB_TOKEN or OPENAI_API_KEY during build time
- [docs] All BaseHub query functions now gracefully handle missing tokens and return empty arrays/null during build

## 2025-11-08 22:15 ET

- [fix] Created /features index page to fix 404 error on /features route
- [feature] Added features listing page with FeatureGrid component and SEO metadata

## 2025-11-08 22:00 ET

- [docs] Updated BaseHub marketing content to reflect Stream-first architecture
- [docs] Updated BaseHub home page with new tagline "Organize Your Chaos" and Stream-focused messaging
- [docs] Updated BaseHub features: Muse (weekly insights), Vault (encrypted notes), added Stream, Boards, Search
- [docs] Updated Mintlify documentation: muse.mdx (weekly insights), getting-started.mdx (Stream interface)
- [infra] Fixed BaseHub MCP connectivity issue and successfully updated content via MCP tools

## 2025-11-08 21:00 ET

- [infra] Executed Prisma migration to add Stream and Board tables to database
- [feature] Created useCurrentUser hook for client-side authentication
- [fix] Replaced hardcoded user-id placeholders in Stream page with real auth
- [fix] Added authentication checks before file uploads and voice recordings
- [docs] Created comprehensive testing checklist in /docs/internal/testing-checklist.md
- [docs] Created setup guide in /docs/internal/setup-guide.md with Supabase Storage and environment variable documentation
- [infra] Updated Prisma client after migration

## 2025-11-08 20:30 ET

- [feature] Updated Prisma schema to support Stream drops (dropType, fileUrl, fileName, fileType fields)
- [feature] Created Board and BoardNote models for auto-organized collections
- [feature] Created Prisma migration for Stream and Board schema changes
- [feature] Created POST /api/stream/create route for creating Stream drops with AI tagging
- [feature] Created GET /api/stream/list route with pagination support
- [feature] Created GET /api/stream/search route for searching drops by content, filename, and tags
- [feature] Created POST /api/stream/upload route for file uploads to Supabase Storage
- [feature] Created DELETE /api/stream/[id] route for deleting Stream drops
- [feature] Created /api/boards routes: list, create, detail (GET), update (PATCH), delete (DELETE)
- [feature] Created /app/(app)/settings/page.tsx with profile, preferences, privacy, and data sections
- [feature] Created Settings components: ProfileSection, PreferencesSection, PrivacySection, DataSection
- [feature] Implemented Supabase Storage integration for file uploads with validation and optimization
- [feature] Enhanced tagNotes() with improved keyword-based tagging and scoring
- [feature] Connected summarizeStream() to OpenAI for real AI summaries
- [feature] Connected analyzeMuse() to OpenAI for weekly insights generation with JSON response format
- [feature] Improved suggestBoard() with better board name and description generation
- [feature] Created VoiceRecorder component with Web Audio API and transcription support
- [feature] Updated Stream page to connect to real API endpoints with error handling
- [feature] Updated Boards page to connect to real API with loading states and error handling
- [feature] Updated Search page to connect to real API with debounced search
- [feature] Added error boundaries (StreamErrorBoundary) to Stream components
- [feature] Added skeleton loaders (StreamSkeleton) for loading states
- [feature] Added keyboard shortcuts (Cmd+K for search, Cmd+N for new drop)
- [feature] Added toast notifications for user feedback
- [ui] Created Switch and AlertDialog UI components
- [ui] Created Alert UI component
- [infra] Created /lib/storage/upload.ts for file upload utilities
- [infra] Created /lib/storage/images.ts for image processing utilities
- [infra] Updated /lib/dto.ts with BoardDTO and Stream field support
- [infra] Updated /lib/validation/schemas.ts with Stream and Board validation schemas
- [infra] Created /lib/hooks/useKeyboardShortcuts.ts for keyboard shortcut management
- [fix] Fixed Stream page to use real API instead of mock data
- [fix] Fixed Boards page to use real API with proper error handling
- [fix] Fixed Search page with debounced queries and proper loading states

## 2025-11-08 20:00 ET

- [feature] Redesigned Klutr into Stream-first architecture with chat-style interface
- [feature] Created /app/stream route as primary interface with chat-style message feed
- [feature] Added Stream components: StreamInput, StreamMessage, TagChips, DropZone, AutoSummary
- [feature] Created /app/boards route with BoardCard components and board detail pages
- [feature] Updated /app/muse with weekly AI insights UI and InsightCard component
- [feature] Created /app/search route with natural language search and fuzzy matching
- [feature] Updated /app/vault with locked/unlocked state and mock encrypted entries
- [ui] Updated brand colors to Coral #FF6F61 (primary) and Mint #4CD7C2 (accent)
- [ui] Added lightbulb iconography CSS classes with glow animations
- [ui] Updated navigation: Stream, Boards, Muse, Vault, Search, Settings
- [ui] Added "+ Drop" button to TopBar for quick file/note addition
- [ui] Removed "Re-cluster now" button (Stream handles organization automatically)
- [ui] Added lightbulb hover animation to logo in AppShell
- [infra] Created /lib/brand.config.ts for centralized brand configuration
- [infra] Created AI placeholder functions: tagNotes, summarizeStream, classifyDrop, suggestBoard, analyzeMuse
- [infra] Added mock data: mockStreamDrops, mockBoards, mockMuseInsights
- [docs] Created Mintlify docs: stream.mdx, boards.mdx
- [docs] Updated overview.mdx with Stream-first architecture and new tagline
- [docs] Created /docs/internal/stream-architecture.md with technical documentation
- [seo] Updated app metadata: title "Klutr – Organize Your Chaos", new description and keywords

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

## 2025-11-08 17:40 ET

- [infra] Configured PostHog MCP server via @posthog/wizard - enabled Feature Flags, Dashboards, Insights, Experiments, LLM Analytics, Error Tracking, Workspace, and Documentation tools
- [feature] Created default PostHog feature flags via API: spark-beta, muse-ai, orbit-experimental, vault-enhanced, klutr-global-disable (all inactive by default)
- [fix] Fixed PostHog client-side initialization - replaced instrumentation-client.ts with PostHogProvider component in root layout (proper Next.js App Router pattern)
- [fix] Removed invalid import of instrumentation-client.ts from instrumentation.ts - client-side PostHog now initialized via PostHogProvider component
- [feature] Added PostHog feature flags integration for controlled beta testing and phased rollouts
- [infra] Created lib/posthog/client.ts - singleton PostHog JS client for browser-side feature flags and analytics
- [infra] Created lib/posthog/server.ts - PostHog Node client for server-side feature flag checks in API routes
- [infra] Created lib/posthog/api.ts - REST API client for programmatic feature flag management
- [infra] Created lib/posthog/mcp.ts - MCP integration helper with REST API fallback
- [infra] Created lib/featureFlags.ts - centralized feature flag middleware with in-memory caching (5min TTL)
- [ui] Added FeatureGate component (components/ui/FeatureGate.tsx) for conditional rendering based on feature flags
- [feature] Added useTrackEvent hook (lib/hooks/useTrackEvent.ts) for PostHog event tracking in React components
- [feature] Added /debug/flags route to visualize active feature flags for authenticated users
- [infra] Added /api/posthog/setup-flags endpoint for creating default feature flags
- [infra] Refactored instrumentation-client.ts to use new lib/posthog/client.ts singleton pattern
- [docs] Added PostHog environment variables documentation to DOPPLER.md (NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST, POSTHOG_SERVER_KEY, POSTHOG_PERSONAL_API_KEY, POSTHOG_PROJECT_ID)
- [docs] Created mintlify/feature-flags.mdx user-facing documentation for feature flag usage
- [docs] Created docs/posthog-mcp-setup.md - MCP server configuration guide
- [docs] Created docs/posthog-mcp-quickstart.md - Quick start guide for MCP usage
- [docs] Added feature flags architecture section to docs/architecture.md
- [infra] Feature flags support: spark-beta, muse-ai, orbit-experimental, vault-enhanced, klutr-global-disable (kill switch)

## 2025-11-08 12:41 ET

- [fix] Fixed Bug 1: instrumentation.ts now properly loads instrumentation-client.ts via dynamic import in register() function
- [fix] Verified Bug 2: Confirmed PostHog init configuration has no invalid `defaults` option (bug was already fixed in previous commit)
- [infra] Created instrumentation-client.ts file for client-side PostHog initialization via Next.js instrumentation system

## 2025-11-08 12:17 ET

- [fix] Fixed PostHog instrumentation setup - created missing instrumentation.ts entry point file required by Next.js
- [fix] Fixed PostHog init configuration - removed invalid `defaults: '2025-05-24'` string option (should be object or omitted)
- [infra] Added instrumentation.ts with register() function to enable Next.js instrumentation system

## 2025-11-08 12:02 ET

- [infra] Added Vercel Speed Insights for performance metrics collection
- [infra] Installed @vercel/speed-insights package and integrated SpeedInsights component into root layout
- [infra] Speed Insights will collect Core Web Vitals and performance data after deployment

## 2025-11-08 12:00 ET

- [fix] Fixed TypeScript build error with async MarketingFooter - converted to non-async component that receives data as props, updated all marketing pages to fetch footer data and pass as props

## 2025-11-08 07:58 ET

- [ui] Replaced "Notes from Class" section with "How It Works" section on marketing homepage
- [ui] Added 3-step process cards: Capture, Organize, Discover with brand-aligned content
- [ui] Updated section icon from GraduationCap to Sparkles to represent AI-powered organization
- [ui] Changed grid layout from 2 columns to 3 columns to accommodate new content structure
- [ui] Updated CTA button text from "Try Now" to "Get Started" with updated aria-label
- [content] All new copy follows BRAND_VOICE.md guidelines (calm, confident, intelligent)

## 2025-11-08 07:47 ET

- [fix] Fixed BaseHub features not displaying on marketing website
- [fix] Added draft mode fallback in getFeatures() to query draft content if production query returns empty
- [fix] Improved error handling and logging in getFeatures() for better debugging
- [ui] Added empty state message in FeatureGrid when no features are available
- [infra] Committed BaseHub features collection to make them visible in production
- [infra] Filled required fields in BaseHub component templates to unblock commits

## 2025-11-08 07:07 ET

- [feature] Created branded Klutr HTML email templates for all Supabase Auth emails
- [feature] Added 6 email templates: confirm-signup, invite-user, magic-link, change-email, reset-password, reauthentication
- [docs] Created /docs/internal/email-templates.md with complete Supabase Dashboard upload instructions
- [docs] Updated resend-setup.md with template customization section and brand color reference
- [docs] Updated supabase-auth-config.md with custom template upload steps
- [ui] Templates use Klutr brand colors (Coral #FF6B6B, Mint #3EE0C5) and Inter font family
- [ui] All templates are responsive with table-based layout for email client compatibility

## 2025-11-08 06:42 ET

- [docs] Added Resend email service setup documentation for Supabase Auth emails
- [docs] Created /docs/internal/resend-setup.md with complete Resend configuration guide
- [docs] Updated supabase-auth-config.md with Resend SMTP settings and domain verification steps
- [docs] Updated DOPPLER.md with RESEND_API_KEY environment variable documentation
- [infra] Documented Resend integration for transactional emails (confirmation, password reset, etc.)

## 2025-11-08 19:00 ET

- [fix] Fixed Next.js 16 compatibility issues with BaseHub integration
- [fix] Updated all query files to await draftMode() (Next.js 16 requires await)
- [fix] Added type assertions to BaseHub query results to resolve TypeScript errors
- [fix] Disabled BaseHub Toolbar in production builds due to Next.js 16 incompatibility with inline "use server" directives
- [infra] Created lib/queries/index.ts for centralized query exports
- [fix] Fixed preview route to await draftMode()
- [fix] Fixed feature page description access to use plainText property
- [infra] Removed fetchOptions from BaseHub queries (not supported in current API)
- [infra] Build now completes successfully with graceful error handling for missing BASEHUB_TOKEN during build

## 2025-11-08 18:30 ET

- [feature] Seeded complete Klutr marketing content in BaseHub from comprehensive seed file
- [infra] Updated home page content with new hero headline "Bring order to your chaos" and updated CTAs
- [feature] Created About page in BaseHub with mission, team, and why Klutr exists sections
- [feature] Created Help & FAQ page in BaseHub with support information
- [feature] Replaced existing 6 features with 7 new features: Flux, Orbit, Pulse, Vault, Spark, Muse, Stacks
- [feature] Created 3 blog posts: "The Science of Capturing Thoughts", "Digital Mind Clutter: How AI Can Help", "Designing Clarity: How Coral & Mint Came to Be"
- [feature] Created Privacy Policy and Terms of Service legal documents in BaseHub
- [infra] All content committed to BaseHub and ready for use in marketing site
- [note] Content follows brand voice guidelines and includes SEO metadata for all pages

## 2025-11-08 16:00 ET

- [feature] Integrated BaseHub Visual Editor/Toolbar for live content editing and preview
- [infra] Created BaseHubVisualProvider component using basehub/next-toolbar for draft mode management
- [infra] Integrated Visual Editor Provider in marketing layout to enable live editing
- [feature] Added revalidation API route at /app/api/revalidate/route.ts for BaseHub content updates (Toolbar handles most revalidation automatically via Server Actions)
- [ui] Added data-bh-\* attributes to Hero component (data-bh-collection="pages", data-bh-field annotations)
- [ui] Added data-bh-\* attributes to FeatureGrid component (data-bh-collection="features", data-bh-field annotations)
- [infra] Added NEXT_PUBLIC_BASEHUB_PROJECT_ID to DOPPLER.md documentation for Visual Editor integration
- [docs] Updated preview route and revalidation route documentation (removed incorrect BaseHub Studio configuration steps)
- [ui] Added optional "Edit in BaseHub" link to marketing footer (visible in dev/preview mode only)
- [risk] Linting errors for Hero component are false positives - file is valid Next.js client component syntax
- [note] BaseHub uses Toolbar component from basehub/next-toolbar (not a separate @basehub/visual-editor package)
- [note] BaseHub Toolbar handles draft mode and revalidation automatically - no BaseHub Studio configuration required

## 2025-11-08 14:30 ET

- [feature] Added dynamic SEO metadata generation from BaseHub for all marketing pages
- [infra] Installed marked library for markdown rendering in blog and legal pages
- [infra] Created metadata query utility in /lib/queries/metadata.ts for fetching SEO fields
- [infra] Created blog query utilities in /lib/queries/blog.ts (getBlogPosts, getBlogPost) with ISR caching
- [infra] Created legal query utilities in /lib/queries/legal.ts (getLegalPage) with daily revalidation
- [ui] Updated marketing layout to use generateMetadata() with dynamic BaseHub SEO data
- [ui] Added generateMetadata() to home page for dynamic title and description
- [feature] Created blog listing page at /app/(marketing)/blog/page.tsx with post cards and categories
- [feature] Created dynamic blog post pages at /app/(marketing)/blog/[slug]/page.tsx with ISR and markdown rendering
- [feature] Created privacy policy page at /app/(marketing)/privacy/page.tsx with BaseHub content
- [feature] Created terms of service page at /app/(marketing)/terms/page.tsx with BaseHub content
- [infra] All new pages support Next.js draft mode for previewing unpublished content
- [infra] Blog listing revalidates every 120s, blog posts every 60s, legal pages daily (86400s)
- [risk] Blog and legal collections are currently empty in BaseHub - pages show empty states until content is added
- [risk] Markdown rendering assumes BaseHub stores content as markdown - may need adjustment if ProseMirror JSON format

## 2025-11-08 02:00 ET

- [feature] Migrated marketing page to use BaseHub CMS for dynamic content
- [infra] Updated BaseHub client to support Next.js draftMode() parameter for preview functionality
- [infra] Created query utilities in /lib/queries/ for home page and features (with ISR caching, 60s revalidation)
- [ui] Created marketing client components: Hero, FeatureGrid, MarketingHeader, MarketingFooter, AnimatedSection
- [ui] Converted /app/(marketing)/page.tsx from client component to server component with BaseHub data fetching
- [ui] Hero section now displays dynamic headline, subtext, and CTAs from BaseHub
- [ui] FeatureGrid displays all features from BaseHub with proper icon mapping and animations
- [feature] Created dynamic feature pages at /app/(marketing)/features/[slug]/page.tsx with ISR support
- [feature] Added preview mode API route at /app/api/preview/route.ts for content editors
- [infra] Added BASEHUB_PREVIEW_SECRET to DOPPLER.md documentation
- [docs] Updated DOPPLER.md with preview mode usage instructions
- [risk] Linting errors for "use client" directives are false positives - files are valid Next.js syntax
- [risk] Other sections (testimonials, contact form, etc.) remain hardcoded until added to BaseHub schema

## 2025-11-08 01:15 ET

- [infra] Created BaseHub schema structure using MCP tools for Klutr marketing site
- [infra] Created Marketing Site document as root container for all CMS collections
- [infra] Created Pages collection with Page component template (slug, title, SEO fields, hero content, CTAs)
- [infra] Seeded home page content in Pages collection with current marketing copy
- [infra] Created Features collection with Feature component template (name, slug, tagline, description, illustration, SEO keywords)
- [infra] Seeded 6 features into Features collection: MindStorm, QuickCapture, Smart Stacks, Write Notes, Plan your day, Learn facts
- [infra] Created Blog collection with BlogPost component template (title, slug, category, content, excerpt, SEO metadata, publishedAt date)
- [infra] Created Legal collection with LegalDocument component template (title, slug, content, lastUpdated date)
- [infra] Committed all BaseHub changes: "Initial BaseHub schema setup for Klutr marketing site"
- [docs] Created /docs/basehub-schema.md documenting complete schema structure, component definitions, collection usage, and GraphQL query examples
- [docs] Documented 4 components (Page, Feature, BlogPost, LegalDocument) and 4 collections (pages, features, blog, legal)
- [risk] All components marked as hidden to skip validation on empty template fields
- [risk] Blog and Legal collections are empty (ready for content)

## 2025-11-08 00:41 ET

- [infra] Installed BaseHub SDK (basehub package) for headless CMS integration
- [infra] Created BaseHub client in /lib/basehub.ts with support for BASEHUB_TOKEN and BASEHUB_API_TOKEN environment variables
- [infra] Added BaseHub environment variables to DOPPLER.md (BASEHUB_TOKEN, BASEHUB_API_TOKEN, BASEHUB_PROJECT_ID, BASEHUB_DRAFT, BASEHUB_REF)
- [docs] Created /docs/basehub-migration.md documenting all hardcoded marketing content for migration to BaseHub
- [docs] Documented 11 content sections requiring migration: Hero, Navigation, Features, Notes from Class, Trusted by Companies, Testimonials, Large CTA, Contact Form, Beta Banner, Footer, and SEO Metadata

## 2025-11-07 12:41 ET

- [feature] Implemented Spark AI assistant with streaming responses for contextual note analysis
- [feature] Implemented Muse creative remix engine with streaming responses for idea combination
- [infra] Added Supabase integration with hybrid environment variable pattern (server-only and client-side vars)
- [infra] Added eventsource-parser package for OpenAI streaming response parsing
- [infra] Created ai_sessions table for tracking AI feature usage (migration 006_ai_sessions.sql)
- [infra] Added embedding index optimization for vector similarity search
- [ui] Replaced Spark placeholder with functional UI including note ID input, prompt input, and real-time streaming response display
- [ui] Replaced Muse placeholder with functional UI including two idea inputs and real-time streaming response display
- [ui] Added error handling and loading states to Spark and Muse pages
- [docs] Created /docs/internal/ai-architecture.md documenting AI integration architecture, streaming implementation, and embedding strategy
- [docs] Created /mintlify/spark.mdx user-facing documentation for Spark feature
- [docs] Created /mintlify/muse.mdx user-facing documentation for Muse feature
- [docs] Updated DOPPLER.md with Phase 2 environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [feature] Added getEmbedding() function to /lib/openai.ts for generating text embeddings
- [feature] Created /lib/ai/stream.ts for streaming LLM responses with eventsource-parser
- [feature] Created /app/api/spark/route.ts API endpoint for Spark with note context retrieval
- [feature] Created /app/api/muse/route.ts API endpoint for Muse with idea remixing
- [feature] Created /lib/hooks/useSpark.ts client hook for Spark streaming interactions
- [feature] Created /lib/hooks/useMuse.ts client hook for Muse streaming interactions
- [infra] Updated /lib/supabase.ts to support server-only environment variables for API routes

## 2025-11-07 02:30 ET

- [ui] Added loading states to Spark and Muse animated components with spinner indicators for improved perceived performance
- [infra] Extracted brand color variables into dedicated theme file: lib/theme/colors.ts for better maintainability
- [infra] Added TypeScript types for Next.js redirect configuration in types/next-config.d.ts to prevent runtime errors
- [ui] Enhanced font fallback chains: added system font stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, etc.) to all font definitions
- [ui] Added theme-color meta tags for mobile browser header consistency (light: #f8f9fa, dark: #111827)

## 2025-11-07 02:00 ET

- [feature] Created feature branch: feature/klutr-brand-redesign for brand redesign phase
- [infra] Installed @fontsource/inter package for brand typography (Inter for headings)
- [ui] Configured typography system: Inter for display/headings, Geist as body font fallback (Satoshi unavailable in npm registry)
- [ui] Added brand color tokens to Tailwind: coral (#FF6B6B), mint (#3EE0C5), charcoal (#111827), cloud (#F8F9FA), slate (#6B7280)
- [ui] Added gradient tokens: chaos (#FF6B6B) and clarity (#3EE0C5) with .bg-chaos-clarity utility class
- [feature] Created route placeholders for new feature names: /app/flux, /app/orbit, /app/pulse, /app/vault, /app/stacks
- [feature] Created animated UI shells for Spark (coral pulsing glow) and Muse (mint rotation) features
- [infra] Added route redirects: /app → /app/flux, /app/mindstorm → /app/orbit, /app/insights → /app/pulse
- [docs] Created /docs/internal/brand-redesign.md documenting route migration, typography, and color palette

## 2025-11-07 01:00 ET

- [ui] Enhanced ItemCard component with larger thumbnails, improved typography, better spacing, and enhanced hover effects with coral accent colors.
- [feature] Added multiple view options: grid, list, collage (masonry), and pin board views with ViewToggle component.
- [feature] Created PinBoardView component with draggable notes and connecting lines to visualize relationships between notes (perfect for MindStorm).
- [feature] Created CollageView component for Pinterest-style masonry layout with variable card heights.
- [feature] Enhanced search functionality with SearchBar component featuring clear button and improved styling.
- [feature] Added FilterChips component for displaying and managing active filters with coral brand colors.
- [feature] Added SortDropdown component for sorting by date, title, tags count, or pinned status with ascending/descending options.
- [ui] Updated CardGrid to support multiple view modes (grid, list, collage) with responsive layouts.
- [feature] Integrated all new components into All Notes, MindStorm, Stacks, and Vault pages.
- [ui] Added quick filter buttons (All, Pinned) and improved filtering UI across all pages.
- [ui] Enhanced visual hierarchy with better card spacing, hover states, and focus indicators using Klutr brand colors.
- [ui] Improved empty states with contextual messages based on search/filter state.
- [ui] All new components maintain dark mode compatibility with proper color contrast.

## 2025-11-07 00:20 ET

- [ui] Redesigned landing page based on Figma design structure with all sections implemented.
- [ui] Updated hero section with larger typography (text-5xl to text-8xl) matching Figma's scale.
- [feature] Expanded features section from 3 to 6 feature cards: added Write Notes, Plan your day, and Learn facts features.
- [feature] Added "Notes from Class" section with Math and Physics example cards.
- [feature] Added "Trusted by Companies" section with logo showcase placeholder.
- [feature] Added testimonials section with 3 user testimonial cards including ratings and dates.
- [feature] Added large CTA section with coding illustration and "Ready to take your notes to the next level?" headline.
- [feature] Added contact form section with "Get in Touch" heading, contact information (phone, email, social links), and form fields (name, email, message).
- [ui] Enhanced footer with contact information layout and privacy policy link.
- [ui] All new sections use Klutr brand colors (coral #FF6B6B, mint #00C896) instead of Figma's brown/orange scheme.
- [ui] Maintained dark mode support throughout all new sections with proper color contrast.

## 2025-11-06 18:10 ET

- [marketing] Implemented Figma landing page at / with Klutr branding.
- [ui] Hero, features, CTA banner, footer using shadcn/ui.
- [brand] Integrated Klutr logo assets from /public/brand/.
- [copy] Highlighted "Free Beta" and AI-powered organization.
- [seo] Updated metadata with proper title, description, and OpenGraph tags.
- [docs] Created marketing.md with landing page structure and brand color documentation.
- [fix] Resolved route conflict by moving app root page from / to /app. Marketing landing page now serves at /, authenticated app pages at /app/\*.
- [fix] Updated landing page to use Klutr brand voice ("Clear the clutr. Keep the spark." tagline, witty copy).
- [fix] Replaced incorrect colors with brand colors: Coral (#FF6B6B) for primary CTAs, Mint (#00C896) for beta banner.
- [fix] Increased logo size from 32px to 48-64px (h-12 md:h-16) for better visibility.
- [brand] Replaced all PNG logo references with SVG logos from /public/logos/ throughout the app.
- [brand] Renamed logo SVG files to descriptive names: klutr-logo-light.svg, klutr-logo-dark.svg, klutr-icon-{size}.svg.
- [brand] Updated headers and navigation to use no-tagline logo variants (klutr-logo-{light|dark}-noslogan.svg) for better readability in compact spaces. Full logos with taglines remain in footer and hero sections.
- [ui] Fixed dark mode color issues on marketing landing page - all text now uses appropriate dark mode colors (white text on dark backgrounds) instead of light mode colors.

## 2025-11-06 17:40 ET

- [infra] Split marketing and app routes using Next.js route groups.
- [auth] Added Supabase Auth middleware for (app) routes.
- [seo] Added brand metadata for marketing layout.
- [ui] Created login page at `/login` with Supabase Auth email/password form.
- [infra] Installed @supabase/ssr for server-side authentication.
- [refactor] Moved AppShell wrapper from individual pages to app/(app)/layout.tsx.
- [docs] Updated architecture.md with route groups section.

## 2025-01-27 14:00 ET

- [infra] Migrated all scheduled background tasks from Vercel Cron to Supabase Edge Functions
- [infra] Removed cron job definitions from vercel.json (resolves Vercel Hobby plan 2-cron limit)
- [infra] Created three batch Edge Functions for automated processing:
  - `supabase/functions/nightly-cluster/index.ts` - Processes all users: embeds notes and clusters them
  - `supabase/functions/nightly-stacks/index.ts` - Processes all users: rebuilds smart stacks
  - `supabase/functions/weekly-insights/index.ts` - Processes all users: generates weekly insights
- [infra] Edge Functions are deployed with `--no-verify-jwt` flag for internal scheduling only
- [infra] Scheduling configured via Supabase Dashboard → Edge Functions → Schedules:
  - nightly-cluster: `0 6 * * *` (daily at 06:00 UTC / 02:00 ET)
  - nightly-stacks: `5 6 * * *` (daily at 06:05 UTC / 02:05 ET)
  - weekly-insights: `0 7 * * 1` (Mondays at 07:00 UTC / 03:00 ET)
- [docs] Updated docs/cron.md to reflect Phase 4 implementation (Supabase Edge Functions)
- [docs] Marked legacy API routes under `/app/api/cron/` as deprecated (remain for manual testing)
- [risk] Edge Functions must be deployed via Supabase CLI and schedules configured in Supabase Dashboard before going live

## 2025-11-06 01:41 ET

- [ui] Implemented complete Klutr brand identity with new logo assets and visual system
- [ui] Added brand logo assets (light/dark variants) to /public/brand/ directory
- [ui] Organized favicon files (32x32, 192x192, apple-touch-icon) in /public/brand/
- [ui] Updated AppShell component to display Klutr logo with theme-aware switching
- [ui] Added brand color tokens to CSS (coral, mint, outline, wordmark) with light/dark variants
- [ui] Configured favicon links in app layout for all required sizes
- [docs] Created comprehensive brand guide at docs/brand/klutr-brand-guide.md
- [docs] Updated BRAND_GUIDE.md to reference new visual identity guide

## 2025-11-05 20:22 ET

- [infra] Merged feature/dark-mode-support branch into main and pushed to trigger Vercel deployment
- [fix] Fixed TypeScript build errors for production deployment:
  - Removed duplicate weeklyInsight property in supabase-db.ts
  - Made Supabase client initialization build-friendly (allows builds without env vars during build time)
  - Excluded supabase/ directory from TypeScript compilation (Deno Edge Functions code)
- [infra] Production build now passes successfully and Vercel deployment is in progress

## 2025-11-04 20:33 ET

- [ui] Added dark mode support with system preference detection and user toggle
- [ui] Configured ThemeProvider in root layout with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, and localStorage persistence (`storageKey="klutr-theme"`)
- [ui] Added theme toggle button to TopBar component with sun/moon icons (Sun icon in dark mode, Moon icon in light mode)
- [ui] Theme toggle respects system preference by default (`prefers-color-scheme`) and allows user override stored in localStorage
- [ui] All components already use semantic color classes (bg-background, text-foreground, bg-card, etc.) that automatically adapt to dark mode via CSS variables
- [ui] CSS variables for dark mode already defined in globals.css covering background, foreground, card, border, accent, sidebar, and brand colors
- [ui] Added suppressHydrationWarning to html element to prevent hydration mismatch during theme initialization
- [ui] Fixed @theme block to reference CSS variables so colors respond to dark mode properly
- [a11y] Improved dark mode accessibility and contrast ratios to meet WCAG AA standards
- [a11y] Enhanced form input and textarea visibility in dark mode (changed from 30% to full opacity background)
- [a11y] Improved muted text brightness in dark mode (increased from 70.8% to 85% lightness for better readability)
- [a11y] Enhanced button visibility with better shadows and contrast in dark mode
- [a11y] Improved tag readability by increasing background opacity from 20% to 50% and brightening text colors
- [a11y] Enhanced icon contrast in ItemCard components for better visibility
- [docs] Dark mode implementation is non-breaking - all existing styles remain functional in both light and dark modes

## 2025-01-27 14:30 ET

- [infra] Merged feat-add-dialog-tours-c1915 into main: Integrated dialog tours with quality improvements and accessibility enhancements
- [infra] Merged main-opus-merge work into feat-add-dialog-tours-c1915 (already included in branch history)

## 2025-11-03 14:00 ET

- [feature] Added section-specific onboarding walkthroughs for all 7 major sections (Notes, MindStorm, Stacks, Vault, Insights, Memory, Nope) with 1-3 step guided tours per section
- [feature] Created HelpCenter component accessible from global help icon in TopBar with searchable help articles for each section
- [feature] Added SectionSummary component with collapsible summaries below PageHeader on all section pages
- [ui] Added contextual tooltips to QuickCaptureBar, TagChip, pin buttons, restore buttons, and vault lock screen
- [ui] Added brand accent colors (deep indigo, lime green, coral) as CSS custom properties in globals.css for both light and dark themes
- [ui] Applied brand colors selectively to sidebar navigation icons and section summary borders
- [feature] Extended onboarding utilities with per-section completion tracking in localStorage
- [feature] Created useSectionOnboarding hook for managing section-specific walkthroughs
- [feature] Defined onboarding step configurations for all sections in onboardingSteps.ts
- [docs] Updated ui-map.md to document new onboarding system, help center, section summaries, and brand color tokens
- [feature] Added SectionTourDialog component with dialog-based tours for first-time onboarding
- [feature] Created useSectionExperience hook combining useSectionTour and useSectionSummary
- [feature] Added hint.tsx component for mobile-friendly contextual hints with touch detection
- [feature] Updated onboardingSteps.ts to support both dialog and callout tour types
- [fix] Added localStorage error handling fallback in useSectionTour to prevent crashes in private browsing mode
- [fix] Added keyboard navigation support for SectionTourDialog (ESC to close, arrow keys to navigate)
- [fix] Added loading state handling in SectionTourDialog when steps are not yet ready
- [fix] Added aria-live regions for screen readers in SectionTourDialog to announce step changes
- [fix] Added prop validation and TypeScript guards for SectionTourDialog to prevent runtime errors
- [fix] Added debounce for localStorage writes in useSectionSummary to prevent performance issues
- [ui] Added .sr-only CSS utility class for screen reader only content

## 2025-11-03 07:22 ET

- [infra] Verified build configuration - build script is `next build` (simplified, no Doppler wrapper)
- [infra] Verified postinstall script present: `prisma generate` (ensures Prisma client generation during builds)
- [infra] Verified no ignoreBuildErrors in next.config.mjs (production safety maintained)
- [docs] Enhanced DOPPLER.md with comprehensive Doppler CLI installation guide - added multiple installation methods (universal installer, package managers, manual), authentication options, and clarified that CLI is only for local dev (not used in Vercel builds)

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

## 2025-10-31 21:58 ET

- [docs] Updated agents.md to replace "Notes or Nope" with "Klutr" in context7 product model references
- [docs] Enhanced agents.md governance binding section to reference new BRAND_GUIDE.md
- [docs] Completely restructured BRAND_VOICE.md to distinguish Wrelik (company) vs Klutr (product) voices
- [docs] Added comprehensive Klutr microcopy guidelines to BRAND_VOICE.md covering capture, processing, Nope workflow, inbox, settings, and onboarding
- [docs] Added "Witty Intelligence" section to BRAND_VOICE.md with principles and examples for incorporating humor into copy
- [docs] Created BRAND_GUIDE.md with comprehensive brand development framework including naming strategy, target audience, brand story, visual identity, tagline/messaging, and website content map
- [docs] Established clear voice separation: Wrelik (calm mentor) for company communications, Klutr (friendly wit) for product communications
- [docs] Updated "last updated" timestamps in agents.md and BRAND_VOICE.md

## 2025-10-31 21:56 ET

- [infra] Pushed rebranding changes to main branch
- [infra] Updated git remote URL to klutr (will work after GitHub repository rename)

## 2025-10-31 21:52 ET

- [infra] Updated git remote URL from "Noteornope" to "klutr" (repository: `lwhite702/klutr`)
- [infra] Git remote now points to the renamed repository
- [docs] Updated CHANGELOG to document GitHub repository rename

## 2025-10-31 21:51 ET

- [infra] Updated Doppler project name from "note-or-nope" to "klutr"
- [infra] Verified Doppler configuration is working correctly with new project name

## 2025-10-31 21:50 ET

- [infra] Renamed Vercel project from "noteornope" to "klutr" (project ID: prj_Jz9bhrE2h6rAfmEIkGmRWBpPxG0H)
- [infra] Installed Supabase CLI v2.54.11 via Homebrew
- [infra] Verified Vercel CLI configuration with updated project name
- [docs] Updated deployment.md with Supabase CLI setup instructions

## 2025-10-31 21:49 ET

- [infra] Set up Vercel CLI and linked project to Vercel (wrelik/noteornope)
- [infra] Added domain klutr.app to Vercel project
- [infra] Domain configuration pending: requires DNS A record (klutr.app → 76.76.21.21) or nameserver change
- [docs] Updated deployment.md with Vercel domain configuration details

## 2025-10-31 21:40 ET

- [ui] Rebranded from "Notes or Nope" to "Klutr" across all user-facing content
- [ui] Updated app/layout.tsx metadata (title, description) to reflect Klutr branding
- [infra] Updated package.json name field from "my-v0-project" to "klutr"
- [docs] Updated README.md title and description to reference Klutr
- [docs] Updated Mintlify documentation files (overview.mdx, getting-started.mdx, notes-guide.mdx) replacing "Notes or Nope" with "Klutr"
- [docs] Updated PRD.md, DOPPLER.md, docs/ui-map.md, docs/dev-setup.md, docs/deployment.md titles/descriptions to reference Klutr
- [docs] Verified placeholder logo assets (placeholder-logo.svg, placeholder-logo.png) do not contain old brand name text
- [risk] Backend code identifiers (API routes, database schema, internal variables) remain unchanged to preserve functionality
- [risk] Build requires Doppler configuration which is environment-specific; rebranding changes pass linter validation

## 2025-10-29 20:30 ET

- [infra] Migrated to Tailwind CSS v4.1.9 - removed tailwind.config.ts (config now in CSS via @theme)
- [infra] Removed tailwindcss-animate dependency (using tw-animate-css instead, already integrated)
- [infra] Removed autoprefixer dependency (handled by Tailwind v4 PostCSS plugin)
- [infra] Added explicit @source directives in globals.css for content scanning
- [infra] Verified Next.js 16.0.0 configuration (already up to date)

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
