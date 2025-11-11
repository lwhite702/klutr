# Infrastructure Setup Guide

**Last Updated:** 2025-01-27

This guide provides step-by-step instructions to replicate the Klutr infrastructure setup.

## Prerequisites

- Supabase account and project
- Doppler account (for secrets management)
- Vercel account (for deployment)
- OpenAI API key
- PostHog account (for feature flags and analytics)

## Step 1: Supabase Setup

### Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Note your project URL and API keys:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: Found in Settings > API
   - Service Role Key: Found in Settings > API (keep secret!)

### Enable Extensions

1. Go to Database > Extensions
2. Enable `pgvector` extension (required for embeddings)

### Create Storage Buckets

1. Go to Storage
2. Create bucket: `stream-files` (public)
3. Create bucket: `vault-encrypted` (private)

### Configure Auth

1. Go to Authentication > URL Configuration
2. Add redirect URLs:
   - `http://localhost:3000/**` (development)
   - `https://your-domain.vercel.app/**` (production)
   - `https://*.vercel.app/**` (preview deployments)

3. Configure email provider (Resend):
   - Go to Project Settings > Auth > SMTP Settings
   - Use Resend SMTP credentials
   - Upload email templates from `/emails/` directory

## Step 2: Doppler Setup

### Install Doppler CLI

```bash
# macOS
brew install doppler

# Linux
curl -Ls --tlsv1.2 https://cli.doppler.com/install.sh | sh

# Windows
scoop install doppler
```

### Login and Setup

```bash
doppler login
doppler setup
```

### Create Project and Config

```bash
doppler projects create klutr
doppler setup --project klutr --config dev
```

### Add Secrets

Add all required environment variables:

```bash
# Supabase
doppler secrets set NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
doppler secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
doppler secrets set SUPABASE_URL=https://your-project.supabase.co
doppler secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
doppler secrets set OPENAI_API_KEY=your-openai-key

# PostHog
doppler secrets set POSTHOG_SERVER_KEY=your-posthog-server-key
doppler secrets set POSTHOG_API_KEY=your-posthog-api-key
doppler secrets set NEXT_PUBLIC_POSTHOG_KEY=your-posthog-public-key
doppler secrets set NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com

# Cron
doppler secrets set CRON_SECRET=generate-random-secret-here

# Vercel (for deployment)
doppler secrets set VERCEL_TOKEN=your-vercel-token

# Database (migrate from Neon to Supabase)
doppler secrets set DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### Create Production Config

```bash
doppler setup --project klutr --config prod
# Repeat secret setting for production values
```

## Step 3: Database Migration

### Migrate from Neon to Supabase

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider   = "postgresql"
     url        = env("DATABASE_URL")  // Now points to Supabase
     extensions = [vector]
   }
   ```

2. Run migrations:
   ```bash
   doppler run -- npx prisma migrate dev
   ```

3. Verify pgvector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

4. Apply RLS policies (see `docs/security/rls.md`)

## Step 4: Vercel Deployment

### Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com)
2. Import your GitHub repository
3. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: `/` (or project root)
   - Build Command: `pnpm build`
   - Output Directory: `.next`

### Configure Environment Variables

1. Go to Project Settings > Environment Variables
2. Connect Doppler integration:
   - Install Doppler Vercel integration
   - Link Doppler project and config
   - Select which secrets to sync

Or manually add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `POSTHOG_SERVER_KEY`
- `CRON_SECRET`
- `DATABASE_URL`

### Configure Cron Jobs

1. Go to Project Settings > Cron Jobs
2. Add cron jobs:
   - `nightly-cluster`: `0 2 * * *` (2 AM daily)
   - `nightly-stacks`: `0 3 * * *` (3 AM daily)
   - `weekly-insights`: `0 4 * * 1` (4 AM Mondays)

3. Set Authorization header:
   ```
   Authorization: Bearer ${CRON_SECRET}
   ```

## Step 5: PostHog Setup

1. Create PostHog project
2. Get API keys:
   - Server Key (for server-side feature flags)
   - API Key (for admin operations)
   - Public Key (for client-side tracking)

3. Configure feature flags:
   - Go to Feature Flags
   - Create flags:
     - `embeddings`
     - `classification`
     - `klutr_global_disable` (kill switch)

## Step 6: Verify Setup

### Test Health Endpoint

```bash
curl https://your-domain.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "checks": {
    "database": { "status": "ok" },
    "supabaseAuth": { "status": "ok" },
    "supabaseStorage": { "status": "ok" },
    "aiProvider": { "status": "ok" }
  },
  "timestamp": "...",
  "environment": "production"
}
```

### Test Database Connection

```bash
doppler run -- npx prisma studio
```

### Test Supabase Storage

```bash
# Upload test file via API
curl -X POST https://your-domain.vercel.app/api/stream/upload \
  -H "Authorization: Bearer your-token" \
  -F "file=@test.txt"
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Verify network access (no IP restrictions)

### Supabase Auth Issues

- Verify redirect URLs are configured
- Check email templates are uploaded
- Verify SMTP settings (Resend)

### Vercel Deployment Issues

- Check build logs for errors
- Verify environment variables are set
- Check function timeout settings (max 60s for Hobby plan)

### Cron Job Issues

- Verify `CRON_SECRET` is set
- Check cron job URLs are correct
- Verify authorization header format

## Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Service role key never exposed to client
- [ ] `CRON_SECRET` is strong and random
- [ ] Environment variables secured in Doppler
- [ ] Supabase storage buckets have correct permissions
- [ ] Vercel environment variables are encrypted
- [ ] PostHog keys are properly scoped

## Cost Monitoring

- Monitor OpenAI API usage in OpenAI dashboard
- Set up billing alerts
- Track Supabase usage (database, storage, bandwidth)
- Monitor Vercel usage (function invocations, bandwidth)

## Support

For issues:
1. Check logs in Vercel Dashboard
2. Check Supabase logs
3. Review health endpoint status
4. Check Doppler secret values
