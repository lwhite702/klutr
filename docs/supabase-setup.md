# Supabase Migration Setup Guide

This document outlines the steps to set up Supabase for the Klutr app migration.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase CLI** (optional, for local development):
   ```bash
   npm install -g supabase
   ```

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `klutr-app` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for MVP

4. Wait for project to be created (2-3 minutes)

## Step 2: Get Project Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - **Keep this secret!**

3. Add these to your Doppler configuration:
   ```bash
   doppler secrets set NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   doppler secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
   doppler secrets set SUPABASE_SERVICE_ROLE_KEY="eyJ..."
   ```

## Step 3: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended for MVP)

1. Go to **SQL Editor** in Supabase Dashboard
2. Create a new query
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the query (check for errors)
5. Repeat for:
   - `supabase/migrations/002_seed_data.sql`
   - `supabase/migrations/003_update_embedding_function.sql`

### Option B: Using Supabase CLI (Advanced)

```bash
# Link to your project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

## Step 4: Enable pgvector Extension

The migrations should enable pgvector automatically, but verify:

1. Go to **SQL Editor**
2. Run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Verify it's enabled in **Database** → **Extensions**

## Step 5: Set Up Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create the following buckets:

   **Bucket 1: `attachments`**
   - Public bucket: ✅ Yes
   - File size limit: 10 MB
   - Allowed MIME types: `image/*`, `audio/*`, `video/*`, `application/pdf`

   **Bucket 2: `vault`**
   - Public bucket: ❌ No (private)
   - File size limit: 5 MB
   - Allowed MIME types: (leave empty or restrict as needed)

3. Set up bucket policies (if using RLS):
   - `attachments`: Allow public read, authenticated write
   - `vault`: Allow authenticated read/write only

## Step 6: Deploy Edge Functions

### Option A: Using Supabase Dashboard

1. Go to **Edge Functions** in Dashboard
2. For each function (`classify-note`, `embed-note`, `cluster-notes`, `generate-insights`):
   - Click "Create Function"
   - Name it (e.g., `classify-note`)
   - Copy contents from `supabase/functions/<function-name>/index.ts`
   - Paste into the editor
   - Deploy

### Option B: Using Supabase CLI

```bash
# Login
supabase login

# Link project
supabase link --project-ref <your-project-ref>

# Deploy functions
supabase functions deploy classify-note
supabase functions deploy embed-note
supabase functions deploy cluster-notes
supabase functions deploy generate-insights
```

### Set Edge Function Secrets

For each Edge Function, set environment variables:

1. Go to **Edge Functions** → Select function → **Settings**
2. Add secrets:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key
   - `CRON_SECRET`: (Optional) Secret for cron job authentication

## Step 7: Update Environment Variables

Add to Doppler (or your environment):

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Optional (for cron jobs)
CRON_SECRET="your-secret-key-here"

# Keep existing
OPENAI_API_KEY="sk-..." # Used by Edge Functions
```

## Step 8: Verify Setup

1. **Test Database Connection**:
   ```bash
   pnpm dev
   # Check console for Supabase connection errors
   ```

2. **Test Storage**:
   - Try uploading a file through the app
   - Check Supabase Dashboard → Storage → `attachments` bucket

3. **Test Edge Functions**:
   - Create a note in the app
   - Check Edge Functions logs in Supabase Dashboard
   - Verify classification and embedding are working

## Troubleshooting

### "Supabase client not initialized"

- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart your dev server after adding env vars

### "Function not found" errors

- Verify Edge Functions are deployed
- Check function names match exactly (case-sensitive)
- Verify service role key has proper permissions

### Embedding errors

- Verify `pgvector` extension is enabled
- Check that `update_note_embedding` function exists (run migration 003)
- Verify embedding dimension matches (1536 for `text-embedding-3-small`)

### Storage upload errors

- Check bucket exists and is properly configured
- Verify bucket policies allow uploads
- Check file size limits

## Next Steps

1. Test all features end-to-end:
   - Create notes
   - Tag notes
   - Upload files
   - Generate stacks
   - View insights

2. Monitor Edge Function logs for errors

3. Set up production deployment with same configuration

## Migration Checklist

- [ ] Supabase project created
- [ ] Database migrations run
- [ ] Storage buckets created
- [ ] Edge Functions deployed
- [ ] Environment variables configured
- [ ] Tested note creation
- [ ] Tested file uploads
- [ ] Tested AI features (classification, embedding)
- [ ] Production build tested
