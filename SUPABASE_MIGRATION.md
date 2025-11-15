# Supabase Migration Guide

This document outlines the migration from Neon/Prisma to Supabase for the Klutr app.

## Setup Steps

### 1. Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Note your project URL and API keys:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: Found in Settings > API
   - Service Role Key: Found in Settings > API (keep this secret!)

### 2. Configure Environment Variables

Add these to your Doppler configuration (or `.env` file):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key  # Required for Edge Functions
```

### 3. Run Database Migrations

Apply the SQL migrations in `supabase/migrations/`:

1. Connect to your Supabase project's SQL editor
2. Run migrations in order:
   - `001_initial_schema.sql` - Creates all tables
   - `002_storage_buckets.sql` - Storage bucket setup (run manually via dashboard)
   - `003_seed_data.sql` - Demo seed data
   - `004_rpc_functions.sql` - Database functions
   - `007_chat_models.sql` - Chat models (conversation_threads, messages)

Alternatively, use Supabase CLI:
```bash
supabase db push
```

### 4. Set Up Storage Buckets

1. Go to Storage in Supabase dashboard
2. Create these buckets:
   - `images` (public)
   - `voice-memos` (public)
   - `files` (public)

Or use the SQL from `002_storage_buckets.sql` (uncomment the INSERT statements).

### 5. Deploy Edge Functions

Deploy the Edge Functions to Supabase:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy classify-note
supabase functions deploy embed-note
supabase functions deploy cluster-notes
supabase functions deploy build-stacks
supabase functions deploy generate-insights
```

Set environment variables for Edge Functions:
```bash
supabase secrets set OPENAI_API_KEY=your-openai-key
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 6. Test the Migration

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Test key features:
   - Create a note
   - View notes list
   - Tag classification
   - File uploads (if implemented)

## Architecture Changes

### Database Layer

- **Before**: Prisma ORM with Neon PostgreSQL
- **After**: Supabase client with direct PostgreSQL access
- **Migration**: Created `lib/supabase-db.ts` adapter that mimics Prisma API for compatibility
- **Status**: ✅ **Complete** - All models migrated, Prisma removed, using `DATABASE_URL` environment variable

### API Routes

- **Before**: Next.js API routes calling Prisma directly
- **After**: Next.js API routes using Supabase client (via adapter)
- **No breaking changes**: Routes still work the same way

### AI Operations

- **Before**: Direct OpenAI calls in serverless functions
- **After**: Supabase Edge Functions for AI operations
- **Functions**:
  - `classify-note` - Classifies note content
  - `embed-note` - Generates embeddings
  - `cluster-notes` - Clusters notes by similarity
  - `build-stacks` - Builds smart stacks
  - `generate-insights` - Generates weekly insights

### Storage

- **Before**: (Not implemented)
- **After**: Supabase Storage buckets for files
- **Buckets**: `images`, `voice-memos`, `files`

## Key Files

- `lib/supabase.ts` - Supabase client initialization
- `lib/supabase-db.ts` - Database adapter (Prisma-compatible API)
- `lib/db.ts` - Exports adapter as `prisma` for compatibility
- `supabase/migrations/` - SQL migration files
- `supabase/functions/` - Edge Functions code

## Authentication (Future)

The code is structured to easily enable Supabase Auth:

1. Currently uses stub `getCurrentUser()` function
2. User tables are ready for auth integration
3. When enabling auth, update `lib/auth.ts` to use Supabase Auth
4. Enable Row-Level Security (RLS) policies in database

## Troubleshooting

### Edge Functions not working

- Check function logs: `supabase functions logs <function-name>`
- Verify environment variables are set
- Ensure OpenAI API key is valid

### Database connection errors

- Verify Supabase URL and keys are correct
- Check database is accessible
- Verify migrations ran successfully

### Embedding updates failing

- Ensure `update_note_embedding` RPC function exists
- Check pgvector extension is enabled
- Verify embedding format is correct (array of numbers)

## Migration Status: 100% Complete ✅

1. ✅ Database schema migrated (all models including chat models)
2. ✅ Edge Functions created
3. ✅ Storage buckets configured
4. ✅ Prisma removed completely
5. ✅ Environment variable renamed (`NEON_DATABASE_URL` → `DATABASE_URL`)
6. ✅ All documentation updated
7. ⏳ Enable Supabase Auth (when ready)
8. ⏳ Set up RLS policies (when auth enabled)
