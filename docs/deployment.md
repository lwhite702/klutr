---
title: "Deployment & Environment Configuration"
author: cursor-agent
updated: 2025-10-29
---

# Deployment & Environment Configuration

This document defines the deployment process for the Wrelik **Notes or Nope (MindStorm)** app.

## Overview

- **Frontend:** Vercel
- **Backend:** Supabase
- **Docs:** Mintlify
- **Optional Marketing:** Netlify

## Deployment Stack

### 🧠 Vercel (App Hosting)

Host the main app on **Vercel**, the canonical environment for Next.js App Router.

**Why Vercel:**

- Maintained by the creators of Next.js
- Full Server Actions + Edge Runtime compatibility
- Fast build times and zero-config deployment
- Tight Supabase SDK integration

**Key Routes Deployed:**

- `/app` - Main notes interface
- `/app/mindstorm` - AI clustering view
- `/app/stacks` - Smart groupings
- `/app/vault` - Encrypted notes
- `/app/insights` - Weekly AI summaries
- `/app/memory` - Timeline view
- `/app/nope` - Rejected notes archive

### 🗄️ Supabase (Backend)

Host and manage all backend systems here.

**Supabase Modules:**

- **Postgres** with pgvector for embeddings
- **Auth** (email/password + optional OAuth)
- **Storage** for images, attachments, vault data
- **Edge Functions** for cron tasks
- **RLS** (Row Level Security) for user isolation

**Supabase Edge Functions to Deploy:**

- `/functions/embedNotes` - Generate embeddings for new notes
- `/functions/reclusterNotes` - Regenerate clusters based on embeddings
- `/functions/generateWeeklyInsights` - Create weekly AI summaries

### 📘 Mintlify (Docs)

Host user-facing guides and product documentation on Mintlify Cloud.

**Docs Structure:**

```
/mintlify/
├── overview.mdx
├── getting-started.mdx
├── notes-guide.mdx
├── mindstorm.mdx
├── vault.mdx
├── stacks.mdx
├── insights.mdx
└── memory-lane.mdx
```

### 🌐 Netlify (Optional Marketing Site)

If a static landing page is introduced (e.g. notesornope.com), host it on Netlify.

**Reasoning:**

- Keeps marketing deploys separate from app deploys
- Prevents marketing traffic from impacting app scaling
- Simple CI/CD for static content

## Environments

| Stage          | Platform      | Database | Purpose           |
| -------------- | ------------- | -------- | ----------------- |
| **Local**      | Neon          | Dev      | Developer sandbox |
| **Staging**    | Supabase Dev  | Staging  | QA testing        |
| **Production** | Supabase Prod | Live     | Public app        |

## Environment Variables

### Required Variables

| Variable                        | Description                   | Environment | Phase |
| ------------------------------- | ----------------------------- | ----------- | ----- |
| `NEON_DATABASE_URL`             | PostgreSQL connection string | All         | Phase 1 (current) |
| `OPENAI_API_KEY`                | OpenAI API access key         | All         | Phase 1+ |
| `CRON_SECRET`                   | Protects internal cron routes | All         | Phase 1+ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL          | All         | Phase 2+ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key             | All         | Phase 2+ |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-side admin key         | All         | Phase 2+ |
| `SUPABASE_JWT_SECRET`           | JWT signing secret            | All         | Phase 2+ |
| `SUPABASE_BUCKET_ATTACHMENTS`   | Public file bucket name       | All         | Phase 2+ |
| `SUPABASE_BUCKET_VAULT`         | Encrypted private bucket name | All         | Phase 2+ |

### Example `.env.local`

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret

# AI Services
OPENAI_API_KEY=sk-xxx

# Security
CRON_SECRET=your-super-secret-cron-key

# Storage Buckets
SUPABASE_BUCKET_ATTACHMENTS=attachments
SUPABASE_BUCKET_VAULT=vault_encrypted
```

## Build & Deploy Commands

### Local Development

```bash
# Start development server
pnpm dev

# Run database migrations
pnpm db:push

# Generate Prisma client
pnpm db:generate
```

### Vercel Deployment

**Prerequisites:**
- Link project: `vercel link` (select project "klutr")
- Sync environment variables from Doppler (see `DOPPLER.md`)

```bash
# Deploy to preview (for testing)
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View environment variables
vercel env ls
```

**Important:** 
- Vercel builds use `next build` (no Doppler CLI wrapper)
- All environment variables must be set in Vercel dashboard/CLI before deployment
- Prisma client is generated automatically via `postinstall` script
- See `VERCEL_SETUP.md` for detailed setup instructions

### Supabase Edge Functions

```bash
# Deploy all functions
supabase functions deploy embedNotes
supabase functions deploy reclusterNotes
supabase functions deploy generateWeeklyInsights

# Deploy specific function
supabase functions deploy embedNotes --project-ref your-project-ref
```

### Mintlify Documentation

```bash
# Start local docs server
mintlify dev

# Publish to Mintlify Cloud
mintlify publish

# Validate docs build
mintlify build
```

## Security Configuration

### Supabase Edge Functions Security

```typescript
// Security check for Edge Functions
if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
  return new Response("Unauthorized", { status: 401 });
}
```

### Database Extensions

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

### RLS Policies Example

```sql
-- Enable RLS on notes table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Users can only access their own notes
CREATE POLICY "User can access their own notes" ON notes
  FOR ALL
  USING (auth.uid() = user_id);
```

## Deployment Pipeline

### 1. Local Development

- **Database:** Neon Postgres (development)
- **Command:** `pnpm dev`
- **Testing:** Full frontend in browser
- **Supabase:** Proxied via `.env.local`

### 2. Staging Environment

- **Platform:** Vercel (staging branch)
- **Database:** Supabase Dev instance
- **Testing:** RLS, embeddings, edge function triggers
- **Purpose:** QA testing before production

### 3. Production Environment

- **Platform:** Vercel (main branch)
- **Database:** Supabase Production
- **Documentation:** Mintlify Cloud published
- **Marketing:** Optional Netlify site

## Directory Structure

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (routes)/          # Page routes
│   └── layout.tsx         # Root layout
├── lib/                   # Shared utilities
│   ├── supabase/         # Supabase client
│   ├── openai/           # AI integration
│   └── utils/            # General utilities
├── mintlify/             # User-facing docs
├── docs/                 # Internal technical docs
│   ├── architecture.md
│   ├── deployment.md
│   ├── vault.md
│   ├── roadmap.md
│   └── cron.md
├── prisma/               # Database schema
├── public/               # Static assets
└── CHANGELOG.md          # Change history
```

## Vercel Configuration

### Build Configuration

- **Build Command**: `next build` (no Doppler wrapper - Vercel uses env vars directly)
- **Install Command**: `npm install` (or `pnpm install`)
- **Output Directory**: `.next` (default for Next.js)
- **Prisma Generation**: Automatic via `postinstall` script

### Environment Variables

Environment variables are managed in Vercel dashboard or via CLI (see `DOPPLER.md` for sync instructions). Do not hardcode values in `vercel.json`.

**Current Phase 1 Variables:**
- `NEON_DATABASE_URL` - Required for database connection
- `OPENAI_API_KEY` - Required for AI features
- `CRON_SECRET` - Required for cron endpoint authentication

### Health Check Endpoint

The app includes `/api/health` endpoint for Vercel monitoring:

```bash
curl https://your-project.vercel.app/api/health
```

Returns: `{ status: "ok", timestamp: string, environment: string }`

### Cron Jobs Configuration

If using Vercel Cron, cron jobs must include `Authorization: Bearer ${CRON_SECRET}` header. All cron routes (`/api/cron/*`) validate this secret.

See `VERCEL_SETUP.md` for complete deployment guide.

## Post-Deploy Checklist

### ✅ Environment Verification

- [ ] Environment variables verified in Vercel dashboard
- [ ] Supabase connection tested
- [ ] OpenAI API key validated
- [ ] CRON_SECRET configured

### ✅ Database Setup

- [ ] Supabase RLS enabled on all tables
- [ ] pgvector extension installed
- [ ] Database migrations applied
- [ ] Test data created

### ✅ Edge Functions

- [ ] All cron functions deployed
- [ ] Functions authorized with CRON_SECRET
- [ ] Function triggers tested
- [ ] Error handling verified

### ✅ Application Testing

- [ ] Browser test for `/app` → create → classify → view
- [ ] Vault encryption/decryption working
- [ ] MindStorm clustering functional
- [ ] Stacks generation working
- [ ] Insights generation tested

### ✅ Documentation

- [ ] Mintlify docs build passes validation
- [ ] Internal docs updated in `/docs/`
- [ ] CHANGELOG.md entry added
- [ ] Deployment guide current

## Monitoring & Maintenance

### Health Checks

- **Vercel:** Monitor build times and deployment success
- **Supabase:** Track database performance and connection limits
- **Edge Functions:** Monitor execution times and error rates
- **OpenAI:** Track API usage and rate limits

### Performance Monitoring

- **Core Web Vitals:** Track LCP, FID, CLS metrics
- **Database Queries:** Monitor slow queries and connection usage
- **Edge Function Performance:** Track execution duration
- **API Response Times:** Monitor external service calls

### Error Handling

- **Vercel:** Built-in error tracking and logging
- **Supabase:** Database error monitoring
- **Edge Functions:** Structured error logging
- **Client-Side:** Error boundary implementation

## Troubleshooting

### Common Issues

**Build Failures:**

- Check environment variables in Vercel dashboard
- Verify Prisma schema compatibility
- Ensure all dependencies are installed

**Database Connection Issues:**

- Verify Supabase URL and keys
- Check RLS policies are correctly configured
- Ensure database migrations are applied

**Edge Function Errors:**

- Verify CRON_SECRET matches between Vercel and Supabase
- Check function logs in Supabase dashboard
- Ensure OpenAI API key is valid

**Performance Issues:**

- Monitor database query performance
- Check Edge Function execution times
- Optimize OpenAI API usage

## References

- **Architecture:** `/docs/architecture.md`
- **Vault Security:** `/docs/vault.md`
- **Cron Jobs:** `/docs/cron.md`
- **Database Schema:** `/docs/database.md`
- **Roadmap:** `/docs/roadmap.md`
- **Brand Voice:** `/BRAND_VOICE.md`
- **Agent Rules:** `/agents.md`
