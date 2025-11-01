# Product Requirements Document - Klutr (MindStorm)

Version: 1.0
Last updated: 2025-10-29 (America/New_York)

## Product Vision & Mission

**Vision:** Your Second Brain
**Mission:** Transform scattered thoughts into organized intelligence through AI-powered note clustering, smart stacks, and encrypted vaults.

Noteornope (codename: MindStorm) is an AI-powered note organization system that helps knowledge workers, researchers, and creators capture, classify, and discover insights from their notes. Unlike traditional note-taking apps, MindStorm uses AI to automatically cluster related ideas, build smart stacks, and generate weekly insights.

## Current State - Feature Set

### Core Features (As-Built)

#### 1. Notes

- **Capture:** Quick note creation via QuickCaptureBar
- **Classify:** AI-powered automatic categorization and tagging
- **Nope:** Reject/archive notes that don't fit current workflow
- **CRUD:** Full create, read, update, delete operations

#### 2. MindStorm

- **Clustering:** AI groups related notes automatically
- **Re-clustering:** Manual trigger to refresh clusters based on new notes
- **Visualization:** Cluster-based note organization

#### 3. Stacks

- **Smart Groupings:** AI-generated collections of related notes
- **Pinning:** Manual stack management and prioritization
- **Detail Views:** Deep-dive into specific stack contents

#### 4. Vault

- **Encrypted Notes:** Client-side AES-GCM encryption for sensitive content
- **Zero-Knowledge:** Server never sees plaintext vault contents
- **Lock Screen:** Secure access control

#### 5. Insights

- **Weekly Summaries:** AI-generated insights from note patterns
- **Trend Analysis:** Identify recurring themes and topics
- **Activity Patterns:** Understand note-taking habits

#### 6. Memory

- **Timeline View:** Chronological note history
- **Activity Tracking:** Note creation and modification patterns
- **Temporal Organization:** Time-based note discovery

#### 7. Nope

- **Rejected Notes Archive:** Store notes that don't fit current workflow
- **Recovery:** Ability to restore archived notes
- **Cleanup:** Maintain focused note collection

## User Personas

### Primary: Knowledge Workers

- **Profile:** Professionals who consume and synthesize information daily
- **Pain Points:** Information overload, scattered notes, difficulty finding connections
- **Goals:** Organize thoughts, discover patterns, maintain focus

### Secondary: Researchers

- **Profile:** Academic and industry researchers managing complex information
- **Pain Points:** Literature management, idea synthesis, citation tracking
- **Goals:** Connect research threads, generate insights, maintain research continuity

### Tertiary: Content Creators

- **Profile:** Writers, podcasters, course creators managing content ideas
- **Pain Points:** Idea capture, content planning, audience insights
- **Goals:** Organize creative ideas, plan content, understand audience interests

## Technical Stack

### Current (Phase 1)

- **Frontend:** Next.js 16 (App Router, TypeScript, React Server Components)
- **UI:** shadcn/ui components + Tailwind CSS
- **Database:** Neon Postgres + pgvector extension
- **ORM:** Prisma
- **AI:** OpenAI API (gpt-4o-mini for classification)
- **Auth:** TBD (planned for Phase 2)
- **Cron:** Manual API routes with CRON_SECRET
- **Environment:** Doppler for all variable management

### Target (Phase 5)

- **Frontend:** Next.js 16 (App Router, TypeScript, React Server Components)
- **UI:** shadcn/ui components + Tailwind CSS
- **Database:** Supabase Postgres + pgvector extension
- **ORM:** Prisma
- **AI:** OpenAI API (gpt-4o-mini for classification)
- **Auth:** Supabase Auth (email/password + OAuth)
- **Storage:** Supabase Storage (attachments bucket)
- **Cron:** Supabase Edge Functions
- **Security:** Row-Level Security (RLS)
- **Environment:** Doppler for all variable management

## Core Features by Section

### Notes Section

**Acceptance Criteria:**

- [ ] Users can create notes via QuickCaptureBar
- [ ] Notes are automatically classified by AI
- [ ] Users can manually tag notes
- [ ] Notes can be marked as "nope" (rejected)
- [ ] Notes support rich text formatting
- [ ] Notes are searchable by content and tags

### MindStorm Section

**Acceptance Criteria:**

- [ ] AI clusters notes automatically based on content similarity
- [ ] Users can trigger manual re-clustering
- [ ] Clusters are visually distinct and navigable
- [ ] Cluster quality improves over time with more notes
- [ ] Users can merge or split clusters manually

### Stacks Section

**Acceptance Criteria:**

- [ ] AI generates smart stacks based on note patterns
- [ ] Users can pin important stacks
- [ ] Stacks show note counts and recent activity
- [ ] Users can create custom stacks
- [ ] Stacks can be shared or made private

### Vault Section

**Acceptance Criteria:**

- [ ] Notes are encrypted client-side using AES-GCM
- [ ] Server never stores plaintext vault contents
- [ ] Users can unlock vault with password
- [ ] Vault supports multiple encrypted notes
- [ ] Keys are derived from user password (PBKDF2)

### Insights Section

**Acceptance Criteria:**

- [ ] Weekly insights generated automatically
- [ ] Insights highlight note patterns and trends
- [ ] Users can view historical insights
- [ ] Insights are personalized to user's note-taking patterns
- [ ] Insights can be exported or shared

### Memory Section

**Acceptance Criteria:**

- [ ] Timeline view shows note creation history
- [ ] Activity patterns are visualized
- [ ] Users can filter by date ranges
- [ ] Memory view helps discover forgotten notes
- [ ] Activity metrics are tracked and displayed

### Nope Section

**Acceptance Criteria:**

- [ ] Rejected notes are archived (not deleted)
- [ ] Users can review archived notes
- [ ] Notes can be restored from archive
- [ ] Archive can be searched and filtered
- [ ] Bulk operations on archived notes

## Success Metrics

### User Engagement

- **Daily Active Users (DAU):** Target 70% of registered users
- **Notes Created per Day:** Target 5+ notes per active user
- **Session Duration:** Target 10+ minutes per session
- **Feature Adoption:** 80% of users try clustering within first week

### Note Retention

- **Note Recovery Rate:** 90% of notes remain accessible after 30 days
- **Archive Usage:** 20% of users actively use Nope section
- **Vault Usage:** 30% of users create encrypted notes

### AI Accuracy

- **Classification Accuracy:** 85% of auto-classified notes are correctly tagged
- **Cluster Quality:** 80% of users find clusters helpful
- **Insight Relevance:** 70% of weekly insights are marked as useful

## Non-Goals

### What We Explicitly Won't Build

- **Real-time Collaboration:** No shared workspaces or live editing
- **Mobile Apps:** Web-first, responsive design only
- **Third-party Integrations:** No API for external apps initially
- **Advanced Analytics:** No detailed user behavior tracking
- **Social Features:** No sharing, following, or community features
- **File Attachments:** No document uploads or media storage initially
- **Offline Support:** Requires internet connection for AI features

## Open Questions

### Technical Decisions

- [ ] Should we support markdown formatting in notes?
- [ ] What's the optimal cluster size for usability?
- [ ] How often should insights be generated?
- [ ] Should vault support multiple passwords or just one?

### Product Decisions

- [ ] Should users be able to export their data?
- [ ] What happens to notes when users delete their account?
- [ ] Should we support note templates?
- [ ] How should we handle duplicate notes?

### Business Decisions

- [ ] What's the pricing model for premium features?
- [ ] Should we offer team accounts?
- [ ] What's the data retention policy?
- [ ] How do we handle GDPR compliance?

## Roadmap Phases

Detailed roadmap is maintained in `/docs/roadmap.md`. Key phases:

1. **Phase 1:** Neon-backed MVP (Current)
2. **Phase 2:** Supabase Setup
3. **Phase 3:** Schema Migration & RLS
4. **Phase 4:** Edge Functions & Automation
5. **Phase 5:** Full Supabase Cutover

## References

- **Architecture:** `/docs/architecture.md`
- **Brand Voice:** `/BRAND_VOICE.md`
- **Agent Rules:** `/agents.md`
- **Roadmap:** `/docs/roadmap.md`
