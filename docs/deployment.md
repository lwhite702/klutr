---
title: "Deployment & Environment Configuration"
author: cursor-agent
updated: 2025-10-29
---

# Deployment & Environment Configuration

This document defines the deployment process for the Wrelik **Klutr (MindStorm)** app.

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

```text
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

| Variable                        | Description                   | Environment |
| ------------------------------- | ----------------------------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL          | All         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key             | All         |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-side admin key         | All         |
| `SUPABASE_JWT_SECRET`           | JWT signing secret            | All         |
| `OPENAI_API_KEY`                | OpenAI API access key         | All         |
| `CRON_SECRET`                   | Protects internal cron routes | All         |
| `SUPABASE_BUCKET_ATTACHMENTS`   | Public file bucket name       | All         |
| `SUPABASE_BUCKET_VAULT`         | Encrypted private bucket name | All         |

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

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Check deployment status
vercel ls
```

### Supabase CLI Setup

The Supabase CLI (v2.54.11) is installed and ready to use. To link to your Supabase project:

```bash
# Login to Supabase (opens browser for authentication)
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

### Supabase Edge Functions

```bash
# Deploy all functions
supabase functions deploy embedNotes
supabase functions deploy reclusterNotes
supabase functions deploy generateWeeklyInsights

# Deploy specific function
supabase functions deploy embedNotes --project-ref your-project-ref
```

**Note:** For local development with Supabase, Docker must be running. The CLI will check Docker connectivity when using local development features.

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

```text
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

### Project Setup

The project is linked to Vercel under `wrelik/klutr` (project ID: `prj_Jz9bhrE2h6rAfmEIkGmRWBpPxG0H`). The project has been linked using:

```bash
vercel link --project klutr --yes
```

This creates a `.vercel` directory with project configuration.

**Note:** The project is connected to the GitHub repository `lwhite702/klutr`. If you haven't renamed the repository on GitHub yet, do so in the repository settings, then update the git remote:

```bash
git remote set-url origin https://github.com/lwhite702/klutr.git
vercel git connect https://github.com/lwhite702/klutr.git
```

### Domain Configuration

The domain `klutr.app` has been added to the project. To complete domain setup, configure DNS using one of the following methods:

**Option A: A Record (Recommended)**
Add an A record to your DNS provider:

```dns
Type: A
Name: klutr.app
Value: 76.76.21.21
```

**Option B: Nameservers**
Change your domain's nameservers to Vercel's intended nameservers (check Vercel dashboard for current values).

After DNS configuration, Vercel will automatically verify and configure SSL certificates. You will receive an email notification when verification is complete.

### `vercel.json`

```json
{
  "version": 2,
  "builds": [{ "src": "next.config.mjs", "use": "@vercel/next" }],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/" }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "SUPABASE_JWT_SECRET": "@supabase-jwt-secret",
    "OPENAI_API_KEY": "@openai-api-key",
    "CRON_SECRET": "@cron-secret",
    "SUPABASE_BUCKET_ATTACHMENTS": "@supabase-bucket-attachments",
    "SUPABASE_BUCKET_VAULT": "@supabase-bucket-vault"
  }
}
```

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
