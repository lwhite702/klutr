# Klutr Architecture

**Last Updated:** 2025-11-11

---

## System Overview

Klutr is a Next.js 16 application with a PostgreSQL database, Supabase for authentication and storage, and OpenAI for AI features.

### Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, TailwindCSS
- **Backend:** Next.js API Routes, Server Components
- **Database:** Neon PostgreSQL with pgvector extension
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **AI:** OpenAI (via Vercel AI SDK)
- **Analytics:** PostHog
- **Monitoring:** Rollbar, Vercel Analytics
- **Deployment:** Vercel
- **Secrets:** Doppler

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                               │
│  (Next.js App Router, React 19, TailwindCSS)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├──────────────────────────────┐
                     │                              │
          ┌──────────▼─────────┐       ┌───────────▼──────────┐
          │  Next.js API       │       │  Server Components   │
          │  Routes            │       │  (RSC)               │
          └──────────┬─────────┘       └───────────┬──────────┘
                     │                              │
          ┌──────────▼──────────────────────────────▼─────────┐
          │              Middleware Layer                      │
          │  - Authentication (Supabase)                       │
          │  - Rate Limiting                                   │
          │  - Validation                                      │
          └──────────┬────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
┌─────────▼────────┐  ┌────────▼────────┐  ┌─────────────────┐
│  Prisma ORM      │  │  Supabase       │  │  AI Provider     │
│  (Database)      │  │  (Auth/Storage) │  │  (Vercel AI SDK) │
└─────────┬────────┘  └────────┬────────┘  └────────┬─────────┘
          │                    │                     │
┌─────────▼────────┐  ┌────────▼────────┐  ┌────────▼─────────┐
│  Neon Postgres   │  │  Supabase       │  │  OpenAI API      │
│  + pgvector      │  │  Infrastructure │  │  - GPT-4o-mini   │
└──────────────────┘  └─────────────────┘  │  - Embeddings    │
                                           └──────────────────┘

External Services:
  - PostHog (Analytics & Feature Flags)
  - Rollbar (Error Monitoring)
  - Doppler (Secrets Management)
  - Vercel (Hosting & Deployment)
```

---

## Core Components

### 1. Authentication Flow

```typescript
// Middleware protects routes
middleware.ts
  → createServerClient(Supabase)
  → getUser()
  → if (!user) redirect to /login

// Auth helpers
lib/auth.ts
  → getCurrentUser() - throws if not authenticated
  → getServerSession() - returns null if not authenticated
```

**RLS Security:**
- All user data protected by Row Level Security
- Policies enforce `auth.uid() = userId`
- Service role bypasses RLS for admin operations

### 2. Data Flow

**User Creates Note:**
```
Client
  → POST /api/messages/create
    → Middleware validates auth + rate limit
    → getCurrentUser()
    → Prisma.message.create()
    → Background jobs:
      - Generate embedding (if feature flag enabled)
      - Classify message (if feature flag enabled)
      - Update thread metadata
```

**Embedding Generation:**
```
Background Job
  → lib/ai/provider.ts
    → generateAIEmbedding()
      → Vercel AI SDK
        → OpenAI text-embedding-3-small
      → Cost logging
      → Retry on failure
    → Store in messages.embedding (pgvector)
```

**Clustering:**
```
Cron Job (nightly)
  → api/cron/nightly-cluster
    → CRON_SECRET validation
    → For each user:
      - Fetch notes with embeddings
      - Calculate centroids by type
      - Assign clusters via cosine similarity
      - Update notes.cluster
```

### 3. AI Provider Abstraction

```typescript
lib/ai/provider.ts exports:
  - generateAIText()       // Simple text generation
  - generateAIObject()     // Structured output with schema
  - streamAIText()         // Streaming responses
  - generateAIEmbedding()  // Vector embeddings
  - generateAIEmbeddingsBatch() // Batch processing

Features:
  - Automatic retries (3x with exponential backoff)
  - 12-second timeout
  - Cost tracking and logging
  - Provider switching (OpenAI/Anthropic)
  - Model tiers (cheap/medium/expensive)
```

### 4. Feature Flags

```typescript
lib/featureFlags.ts
  → PostHog server/client integration
  → Caching (5-minute TTL)
  → Kill switch (KLUTR_GLOBAL_DISABLE)
  → Fail-safe defaults (flags default to off)

Usage:
  const enabled = await featureEnabled('embeddings', userId)
  if (enabled) { /* generate embedding */ }
```

---

## Database Schema

### Key Tables

**users**
- `id` (cuid, PK)
- `email` (unique)
- `createdAt`, `updatedAt`

**messages** (main content table)
- `id` (cuid, PK)
- `type` (text/audio/image/file/link)
- `content` (text, nullable)
- `fileUrl` (text, nullable)
- `transcription` (text, nullable)
- `embedding` (vector(1536), nullable)
- `threadId` (FK → conversation_threads)
- `userId` (FK → users)

**notes** (legacy, being migrated to messages)
- Similar structure to messages
- Used for Stream and MindStorm

**conversation_threads**
- Groups related messages
- Auto-generated or user-specified
- System tags for classification

**smart_stacks**
- AI-generated note groupings
- `cluster`, `summary`, `noteCount`

**vault_notes**
- Client-side encrypted blobs
- Only stores ciphertext

### Indexes

See `docs/database/indexes.md` for full details.

**Key Indexes:**
- `notes_embedding_idx` (IVFFlat for vector search)
- `messages_embedding_idx` (IVFFlat for vector search)
- `notes_content_search_idx` (GIN for full-text search)
- User-specific indexes on all tables

---

## API Routes Structure

```
/api
  /auth
    /callback          # Supabase auth callback
  /cron
    /nightly-cluster   # Clustering job
    /nightly-stacks    # Smart stacks generation
    /weekly-insights   # Weekly insights
  /messages
    /create            # Create message
    /embed             # Generate embedding
    /classify          # Classify message
  /notes               # Legacy notes API
  /boards              # Boards management
  /stacks              # Smart stacks API
  /vault               # Vault operations
  /insights            # Insights generation
  /mindstorm           # Clustering operations
  /health              # Health check endpoint
```

### API Authentication

All API routes (except public and cron) require:
1. Supabase JWT token in cookies
2. `getCurrentUser()` validation
3. Rate limiting (via middleware)

Cron routes require:
- `CRON_SECRET` header match

---

## Background Jobs

### Nightly Clustering (2 AM)
```
GET /api/cron/nightly-cluster
  → For each user with notes:
    - Calculate centroids
    - Assign clusters
    - Update confidence scores
```

### Nightly Stacks (3 AM)
```
GET /api/cron/nightly-stacks
  → For each user:
    - Group notes by cluster
    - Generate summaries
    - Create/update SmartStack records
```

### Weekly Insights (9 AM Monday)
```
GET /api/cron/weekly-insights
  → For each user:
    - Aggregate past week's notes
    - Generate AI insights
    - Analyze sentiment
    - Store WeeklyInsight record
```

---

## Feature Flag Strategy

### Current Flags

- `embeddings` - Enable embedding generation
- `classification` - Enable message classification
- `semantic-search` - Enable vector similarity search
- `smart-stacks` - Enable smart stack generation
- `insights` - Enable insights generation
- `vault` - Enable vault encryption
- `klutr-global-disable` - Kill switch for all features

### Usage

```typescript
// Server-side
const enabled = await featureEnabled('embeddings', userId)

// Client-side
import { useFeatureFlag } from '@/lib/hooks/useFeatureFlag'
const enabled = useFeatureFlag('embeddings')
```

---

## Security Architecture

### Defense in Depth

1. **Network Layer**
   - Vercel edge network
   - DDoS protection
   - HTTPS only

2. **Application Layer**
   - Middleware authentication
   - Rate limiting (per-user, per-endpoint)
   - Input validation (Zod schemas)
   - CSRF protection (Supabase)

3. **Database Layer**
   - Row Level Security (RLS)
   - Prepared statements (Prisma)
   - Connection pooling
   - SSL connections

4. **Data Layer**
   - Client-side vault encryption
   - Secure file uploads (Supabase signed URLs)
   - No sensitive data in logs

### RLS Policies

Every user data table has policies:
- Users can only read their own data
- Users can only insert for themselves
- Users can only update their own data
- Users can only delete their own data

See `docs/security/rls.md` for full policy definitions.

---

## Performance Optimization

### Database

- Indexed queries (see `docs/database/indexes.md`)
- Connection pooling via Prisma
- Prepared statements
- Vector index for fast similarity search

### API

- Server-side caching (Next.js)
- Static generation for marketing pages
- Streaming responses for AI
- Batch operations for embeddings

### Frontend

- React Server Components
- Streaming SSR
- Code splitting
- Image optimization
- Font optimization (Inter preloaded)

---

## Cost Management

### AI Costs (see `reports/ai-cost-estimate.md`)

- Per-user quotas
- Rate limiting
- Batch processing
- Cheap models for simple tasks
- Cost logging and monitoring

### Infrastructure Costs

- Vercel: $20/month (Pro)
- Supabase: $25/month (Pro)
- Neon: $19/month (Scale)
- OpenAI: Variable ($50-200/month typical)
- PostHog: $0-50/month
- Total: ~$115-315/month for 500 users

---

## Monitoring and Observability

### Error Tracking
- Rollbar for server-side errors
- Rollbar client for browser errors
- Structured logging via `lib/logger.ts`

### Analytics
- Vercel Analytics (Web Vitals)
- PostHog (user behavior, feature flags)

### Health Checks
```
GET /api/health
  → Checks database connection
  → Checks Supabase availability
  → Returns status JSON
```

---

## Deployment Architecture

### Vercel

**Production:**
- Branch: `main`
- Domain: `klutr.app` (example)
- Environment: `production`
- Secrets: Via Doppler integration

**Preview:**
- All PRs get preview deployments
- Environment: `preview`
- Secrets: Via Doppler staging config

**Development:**
- Local development via `pnpm dev`
- Environment: `development`
- Secrets: Via `doppler run`

### CI/CD Pipeline

```
GitHub Push/PR
  → GitHub Actions
    → Lint + Type Check
    → Build
    → Unit Tests
    → E2E Tests (Playwright)
    → Accessibility Tests
    → Security Scan
  → If main branch:
    → Deploy to Vercel Production
    → Run smoke tests
```

---

## Future Architecture Considerations

### Scalability

**Current Limits:**
- ~10K active users (single Neon database)
- ~100 req/s (Vercel Serverless)

**Scaling Path:**
- Database read replicas
- Redis caching layer
- Background job queue (BullMQ)
- CDN for static assets
- Edge functions for global latency

### Feature Additions

**Planned:**
- Real-time collaboration (WebSockets)
- Mobile app (React Native)
- Browser extension
- API for third-party integrations
- Webhooks

**Technical Debt:**
- Migrate from `notes` to `messages` table
- Consolidate duplicate AI functions
- Add more comprehensive tests
- Implement proper job queue

---

*Last updated: 2025-11-11*
