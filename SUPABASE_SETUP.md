# Supabase Migration Setup Guide

This document provides step-by-step instructions for setting up the Supabase backend for the Klutr app.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Supabase CLI installed: `npm install -g supabase`
- Access to Doppler for environment variable management

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the details:
   - **Name**: klutr-mvp (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
   - **Plan**: Start with the Free tier for development
4. Wait for the project to be created (~2 minutes)

## Step 2: Get Supabase Credentials

Once your project is created:

1. Go to Project Settings > API
2. Copy the following values:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

3. Go to Project Settings > Database
4. Copy the connection string:
   - **Connection string**: This is your `SUPABASE_DATABASE_URL`

## Step 3: Configure Environment Variables

Add these variables to your Doppler configuration:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
SUPABASE_DATABASE_URL=postgresql://postgres:[password]@db.[your-project-id].supabase.co:5432/postgres

# Keep existing OpenAI key
OPENAI_API_KEY=[your-existing-key]
```

Or add them directly via Doppler CLI:

```bash
doppler secrets set NEXT_PUBLIC_SUPABASE_URL "https://[your-project-id].supabase.co"
doppler secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY "[your-anon-key]"
doppler secrets set SUPABASE_SERVICE_ROLE_KEY "[your-service-role-key]"
doppler secrets set SUPABASE_DATABASE_URL "postgresql://postgres:[password]@db.[your-project-id].supabase.co:5432/postgres"
```

## Step 4: Run Database Migrations

There are two ways to run the migrations:

### Option A: Using Supabase SQL Editor (Recommended for MVP)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste into SQL Editor and click "Run"
   - Repeat for `002_row_level_security.sql`
   - Repeat for `003_storage_buckets.sql`
   - Repeat for `004_seed_data.sql`

### Option B: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref [your-project-id]

# Run migrations
supabase db push
```

## Step 5: Configure Storage Buckets

1. Go to Storage in your Supabase dashboard
2. Verify the "files" bucket was created
3. If not, create it manually:
   - Click "New bucket"
   - Name: `files`
   - Public: No (keep private)
   - File size limit: 10 MB
   - Allowed MIME types: 
     - image/jpeg, image/png, image/gif, image/webp
     - audio/mpeg, audio/wav, audio/webm
     - application/pdf, text/plain

## Step 6: Verify Database Setup

1. Go to Table Editor in Supabase dashboard
2. Verify these tables exist:
   - users
   - notes
   - tags
   - note_tags
   - smart_stacks
   - weekly_insights
   - vault_notes

3. Check that the demo user and sample notes were created:
   - Open the `users` table
   - You should see `demo@klutr.app`
   - Open the `notes` table
   - You should see 5 sample notes

## Step 7: Test the Connection

Run the app locally to verify everything works:

```bash
# Install dependencies (if not already done)
pnpm install

# Run the development server
doppler run -- pnpm dev
```

The app should start at http://localhost:3000

## Step 8: Update Prisma Schema (Optional)

If you want to use Prisma with Supabase, update the datasource in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("SUPABASE_DATABASE_URL")
  extensions = [vector]
}
```

Then regenerate the Prisma client:

```bash
doppler run -- npx prisma generate
```

## Troubleshooting

### Connection Issues

If you can't connect to Supabase:
- Verify all environment variables are set correctly
- Check that your IP is not blocked (Supabase doesn't restrict by default)
- Ensure the database password doesn't contain special characters that need escaping

### Migration Errors

If migrations fail:
- Make sure you're running them in the correct order
- Check for any existing tables that might conflict
- Review the error message in the SQL Editor

### Storage Issues

If file uploads don't work:
- Verify the storage bucket exists
- Check the bucket policies in Storage > Policies
- Ensure the MIME types are allowed

## Next Steps

Once Supabase is set up:

1. ✅ Database schema is created
2. ✅ Storage buckets are configured
3. ✅ Row Level Security is enabled (but permissive for MVP)
4. ⏳ Update API routes to use Supabase
5. ⏳ Convert cron jobs to Edge Functions
6. ⏳ Test all features end-to-end

## Security Notes

**Important**: The current RLS policies allow all operations without authentication. This is intentional for the MVP demo. Before going to production:

1. Enable Supabase Auth
2. Update RLS policies to require `auth.uid()`
3. Add proper user authentication flows
4. Restrict storage bucket access by user

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
