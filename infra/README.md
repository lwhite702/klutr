# Klutr Infrastructure Setup Guide

This document provides step-by-step instructions for setting up the complete Klutr infrastructure from scratch.

## Prerequisites

- Node.js 18+ and pnpm
- Vercel account
- Supabase account
- Doppler account
- OpenAI API key
- PostHog account

---

## 1. Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name (e.g., `klutr-production`)
3. Choose a database password (store securely)
4. Choose a region (same as your Vercel deployment region)
5. Wait for project creation (~2 minutes)

### 1.2 Enable pgvector Extension

```sql
-- In Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
```

### 1.3 Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - Confirmation email
   - Magic link email
   - Reset password email
4. Go to **Authentication** > **URL Configuration**
5. Add your site URL: `https://your-domain.com`
6. Add redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### 1.4 Create Storage Buckets

```sql
-- In Supabase SQL Editor
-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', false);

-- Set up RLS policy for storage bucket
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 1.5 Collect Supabase Credentials

From your Supabase project settings:

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **Anon Public Key** → `SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## 2. Database Setup (Neon or Supabase)

### Option A: Use Supabase Database (Recommended)

Supabase includes a PostgreSQL database. If using Supabase for auth and storage, use the same database:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

### Option B: Use Separate Neon Database

If you prefer Neon for the database:

1. Go to [neon.tech](https://neon.tech) and create a project
2. Enable pgvector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Copy the connection string → `DATABASE_URL`

### 2.2 Run Prisma Migrations

```bash
# Install dependencies
pnpm install

# Push schema to database
pnpm db:push

# Verify schema
pnpm db:studio
```

---

## 3. Doppler Setup (Secrets Management)

### 3.1 Create Doppler Project

1. Go to [doppler.com](https://doppler.com) and create account
2. Create a new project: `klutr`
3. Create environments:
   - `development` (local development)
   - `staging` (preview deployments)
   - `production` (production deployment)

### 3.2 Add Secrets to Doppler

For each environment, add these secrets:

#### Database
```
DATABASE_URL=postgresql://...
```

#### Supabase
```
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

#### OpenAI
```
OPENAI_API_KEY=sk-...
```

#### PostHog
```
POSTHOG_API_KEY=phc_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

#### Cron Jobs
```
CRON_SECRET=[generate-random-string]
```

#### Vercel (optional, for API calls)
```
VERCEL_TOKEN=your-vercel-token
```

#### Rollbar (Error Monitoring)
```
ROLLBAR_ACCESS_TOKEN=your-rollbar-token
NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN=your-client-token
```

### 3.3 Install Doppler CLI

```bash
# macOS
brew install dopplerhq/cli/doppler

# Linux
curl -Ls https://cli.doppler.com/install.sh | sh

# Verify installation
doppler --version
```

### 3.4 Login and Configure

```bash
# Login to Doppler
doppler login

# Navigate to project directory
cd /path/to/klutr

# Setup Doppler project
doppler setup --project klutr --config development

# Test secrets access
doppler run -- printenv | grep SUPABASE_URL
```

### 3.5 Local Development

```bash
# Run dev server with Doppler
pnpm dev  # Already configured in package.json

# Run other commands with Doppler
doppler run -- pnpm build
doppler run -- pnpm db:push
```

---

## 4. Vercel Setup

### 4.1 Install Vercel CLI

```bash
npm i -g vercel
vercel login
```

### 4.2 Link Project

```bash
cd /path/to/klutr
vercel link
```

### 4.3 Configure Vercel Environment Variables

#### Option A: Via Doppler Integration (Recommended)

1. Go to Vercel project settings
2. Navigate to **Integrations**
3. Add **Doppler** integration
4. Connect to your Doppler project
5. Map environments:
   - Vercel Production → Doppler production
   - Vercel Preview → Doppler staging
   - Vercel Development → Doppler development

#### Option B: Manual Configuration

```bash
# Set production secrets
   vercel env add DATABASE_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add OPENAI_API_KEY production
vercel env add POSTHOG_API_KEY production
vercel env add CRON_SECRET production
# ... repeat for all secrets

# Repeat for preview and development environments
```

### 4.4 Configure Build Settings

In Vercel project settings:

- **Framework Preset:** Next.js
- **Build Command:** `pnpm build`
- **Install Command:** `pnpm install`
- **Output Directory:** `.next`
- **Node Version:** 18.x or 20.x

### 4.5 Configure Cron Jobs

Create `vercel.json` in project root (already exists, verify):

```json
{
  "crons": [
    {
      "path": "/api/cron/nightly-cluster",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/nightly-stacks",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/weekly-insights",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

### 4.6 Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploy)
git push origin main
```

---

## 5. PostHog Setup

### 5.1 Create PostHog Project

1. Go to [posthog.com](https://posthog.com) and sign up
2. Create a new project
3. Choose US or EU region
4. Copy **Project API Key** → `POSTHOG_API_KEY`
5. Copy **Host URL** → `NEXT_PUBLIC_POSTHOG_HOST`

### 5.2 Create Feature Flags

In PostHog dashboard:

1. Go to **Feature Flags**
2. Create the following flags:
   - `embeddings` - Enable embedding generation
   - `classification` - Enable message classification
   - `vault` - Enable vault encryption
   - `semantic-search` - Enable vector search
   - `smart-stacks` - Enable smart stacks
   - `insights` - Enable insights generation
   - `klutr-global-disable` - Kill switch for all features

3. Set rollout percentages or target specific users

### 5.3 Verify Integration

```bash
# Run the app
pnpm dev

# Check PostHog events in dashboard
# Look for pageviews and custom events
```

---

## 6. OpenAI Setup

### 6.1 Create API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys**
3. Create a new secret key
4. Copy the key → `OPENAI_API_KEY`
5. Set usage limits (recommended: $100/month)

### 6.2 Configure Organization (Optional)

If using OpenAI for a team:
1. Create an organization
2. Add team members
3. Set organization limits
4. Use organization API key

---

## 7. Database Migrations

### 7.1 Initial Setup

```bash
# Push schema to database
doppler run -- pnpm db:push

# Open Prisma Studio to verify
doppler run -- pnpm db:studio
```

### 7.2 Create Migration History (Recommended)

```bash
# Create initial migration
doppler run -- npx prisma migrate dev --name init

# Future migrations
doppler run -- npx prisma migrate dev --name add_feature_x
```

### 7.3 Production Migrations

```bash
# On production (via CI/CD or manual)
npx prisma migrate deploy
```

---

## 8. Verify Setup

### 8.1 Health Check

```bash
# Start dev server
pnpm dev

# Check health endpoint
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "supabase": "connected",
  "openai": "configured"
}
```

### 8.2 Test Authentication

1. Open `http://localhost:3000/login`
2. Sign up with email
3. Check email for confirmation
4. Verify user in Supabase dashboard

### 8.3 Test File Upload

1. Create a note with file attachment
2. Check Supabase Storage bucket
3. Verify file URL in database

### 8.4 Test Embeddings

1. Create a text message
2. Check logs for embedding generation
3. Query database to verify embedding stored

---

## 9. CI/CD Setup (GitHub Actions)

### 9.1 Add GitHub Secrets

In your GitHub repository settings > Secrets:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
DOPPLER_TOKEN=your-doppler-service-token
```

### 9.2 Verify Workflow

The CI/CD workflow will be created in `.github/workflows/ci.yml` (next step)

---

## 10. Monitoring and Observability

### 10.1 Rollbar (Error Tracking)

1. Sign up at [rollbar.com](https://rollbar.com)
2. Create a project
3. Copy access tokens
4. Add to Doppler secrets

### 10.2 Vercel Analytics

Already included via `@vercel/analytics` package. No setup needed.

### 10.3 PostHog Analytics

Already configured. View analytics in PostHog dashboard.

---

## 11. Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] CRON_SECRET configured and validated
- [ ] Service role keys stored securely (never in code)
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] File upload size limits set
- [ ] Supabase Auth email verification required
- [ ] Database connection uses SSL
- [ ] Secrets stored in Doppler (never in .env files)

---

## 12. Cost Optimization

### Expected Monthly Costs (500 active users):

- **Vercel:** $20/month (Pro plan)
- **Supabase:** $25/month (Pro plan)
- **Neon (if separate):** $19/month (Scale plan)
- **OpenAI:** $50-200/month (depends on usage)
- **PostHog:** $0-50/month (generous free tier)
- **Doppler:** $0 (free tier sufficient)
- **Rollbar:** $0 (free tier sufficient)

**Total:** ~$115-315/month

### Cost Controls:

1. Set OpenAI usage limits ($100/month recommended)
2. Implement per-user quotas (see `lib/ai/cost-estimator.ts`)
3. Enable caching for embeddings
4. Use batch processing for background jobs
5. Monitor PostHog costs (can spike with high traffic)

---

## 13. Backup and Disaster Recovery

### Database Backups

**Supabase:**
- Automatic daily backups (retained 7 days on Pro plan)
- Point-in-time recovery (up to 7 days)

**Neon:**
- Automatic daily backups
- Branch-based recovery

### File Storage Backups

Supabase Storage does not have automatic backups. Consider:
- Periodic exports to S3 or Google Cloud Storage
- Versioning enabled on bucket

### Secrets Backup

Doppler automatically maintains secret history. No additional backup needed.

---

## 14. Troubleshooting

### Database Connection Issues

```bash
# Test database connection
doppler run -- npx prisma db pull

# Check connection string format
echo $DATABASE_URL
```

### Supabase Auth Issues

- Verify redirect URLs configured
- Check email provider settings
- Verify JWT secret (auto-configured)

### OpenAI Rate Limits

- Check usage dashboard
- Increase limits or switch to higher tier
- Implement exponential backoff

### Vercel Deployment Failures

- Check build logs
- Verify environment variables set
- Check for missing dependencies

---

## 15. Next Steps

After infrastructure setup:

1. Run Prisma migrations: `pnpm db:push`
2. Set up RLS policies (see `docs/security/rls.md`)
3. Run health check: `curl http://localhost:3000/api/health`
4. Create test user and verify auth flow
5. Deploy to Vercel: `vercel --prod`
6. Run E2E tests (after CI/CD setup)
7. Monitor error rates and performance

---

## Support

For issues with specific services:

- **Supabase:** [supabase.com/support](https://supabase.com/support)
- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Doppler:** [doppler.com/support](https://doppler.com/support)
- **OpenAI:** [platform.openai.com/support](https://platform.openai.com/support)

---

*Last updated: 2025-11-11*
