# Setup Guide

This guide covers the setup steps required to run Klutr locally and deploy to production.

## Prerequisites

- Node.js 18+ and npm/pnpm
- Doppler CLI installed and configured
- Supabase account and project
- Neon PostgreSQL database (or compatible PostgreSQL)
- OpenAI API key (for AI features)

## Environment Variables

All environment variables are managed via Doppler. Required variables:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)
- `SUPABASE_URL` - Server-side Supabase URL (can be same as NEXT_PUBLIC)

### Database
- `DATABASE_URL` - PostgreSQL connection string (Supabase database, format: `postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres`)

### OpenAI
- `OPENAI_API_KEY` - OpenAI API key for AI features (tagging, summarization, insights)

### Optional
- `POSTHOG_KEY` - PostHog project key (for analytics)
- `POSTHOG_HOST` - PostHog host URL (default: https://app.posthog.com)

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd Noteornope
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Doppler

```bash
# Login to Doppler
doppler login

# Setup project (if not already configured)
doppler setup

# Verify environment variables are loaded
doppler run -- env | grep SUPABASE
```

### 4. Setup Supabase

#### Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Note your project URL and API keys

#### Create Storage Bucket
1. Navigate to Storage in Supabase Dashboard
2. Click "New bucket"
3. Name: `stream-files`
4. Public bucket: **Yes** (for public file access)
5. File size limit: 10MB (or as needed)
6. Allowed MIME types: `image/*, application/pdf, text/*, audio/*`

#### Configure Storage Policies
1. Go to Storage → Policies → `stream-files`
2. Create policy for authenticated users:
   - Policy name: "Authenticated users can upload"
   - Allowed operation: INSERT
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'stream-files'`
3. Create policy for public read:
   - Policy name: "Public read access"
   - Allowed operation: SELECT
   - Target roles: anon, authenticated
   - Policy definition: `bucket_id = 'stream-files'`

#### Configure CORS (if needed)
If accessing files from different domains, configure CORS in Supabase:
1. Go to Storage → Settings
2. Add CORS rules for your domain(s)

### 5. Setup Database

#### Create Supabase Database
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or use existing project
3. Go to Settings → Database → Connection string
4. Copy the connection string (use the "URI" format)
5. Add to Doppler as `DATABASE_URL`

#### Run Migrations
```bash
# Generate Prisma client
doppler run -- npx prisma generate

# Push schema to database (development)
doppler run -- npx prisma db push

# Or run migrations (production)
doppler run -- npx prisma migrate deploy
```

#### Verify Database Schema
```bash
# Open Prisma Studio to verify tables
doppler run -- npx prisma studio
```

### 6. Configure OpenAI

1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Add to Doppler as `OPENAI_API_KEY`
3. Verify key has access to:
   - `gpt-4o-mini` (for summaries and insights)
   - `text-embedding-3-small` (for embeddings, future)

### 7. Run Development Server

```bash
doppler run -- pnpm dev
```

The app should be available at `http://localhost:3000`

## Production Deployment

### Environment Variables

Ensure all environment variables are set in your hosting platform:

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add all required variables
3. Ensure `NEXT_PUBLIC_*` variables are available at build time

#### Other Platforms
- Set environment variables in your platform's configuration
- Ensure Doppler integration is configured (if using)

### Database Migrations

Run migrations before deploying:

```bash
doppler run -- npx prisma migrate deploy
```

### Build and Deploy

```bash
# Build for production
doppler run -- pnpm build

# Start production server
doppler run -- pnpm start
```

## Supabase Storage Setup Details

### Bucket Configuration

**Bucket Name:** `stream-files`

**Settings:**
- Public: Yes
- File size limit: 10MB
- Allowed MIME types:
  - `image/jpeg`
  - `image/png`
  - `image/gif`
  - `image/webp`
  - `application/pdf`
  - `text/plain`
  - `audio/mpeg`
  - `audio/wav`
  - `audio/webm`

### Storage Policies

#### Policy 1: Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'stream-files');
```

#### Policy 2: Public Read
```sql
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'stream-files');
```

#### Policy 3: User-specific Delete (Optional)
```sql
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'stream-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### File Organization

Files are organized by user ID:
```
stream-files/
  {userId}/
    {timestamp}-{random}.{ext}
```

Example:
```
stream-files/
  abc123/
    1700000000000-xyz789.jpg
    1700000001000-def456.pdf
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is accessible from your IP
- Verify SSL mode is set correctly

### Supabase Storage Issues
- Verify bucket exists and is public
- Check storage policies are configured
- Verify service role key has correct permissions
- Check CORS settings if accessing from different domain

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check cookies are enabled
- Verify auth state is being tracked correctly

### OpenAI API Issues
- Verify API key is valid
- Check API key has sufficient credits
- Verify model access (gpt-4o-mini)

### Migration Issues
- If migration fails, check database schema state
- Use `prisma db push` for development (resets schema)
- Use `prisma migrate deploy` for production (applies migrations)

## Development Tips

### Using Prisma Studio
```bash
doppler run -- npx prisma studio
```
Opens a GUI to view and edit database records.

### Viewing Logs
```bash
# View Doppler logs
doppler logs

# View application logs
doppler run -- pnpm dev
```

### Testing API Routes
```bash
# Test with curl
doppler run -- curl http://localhost:3000/api/stream/list

# Or use Postman/Insomnia with environment variables
```

## Security Notes

- Never commit `.env` files
- Use Doppler for all environment variables
- Keep service role keys secret
- Rotate API keys regularly
- Use RLS (Row Level Security) in Supabase for data isolation
- Verify file uploads are validated (size, type)
- Sanitize user inputs

## Next Steps

After setup:
1. Run the testing checklist (`docs/internal/testing-checklist.md`)
2. Verify all API routes work correctly
3. Test file uploads to Supabase Storage
4. Test authentication flow
5. Verify AI features work with OpenAI API

