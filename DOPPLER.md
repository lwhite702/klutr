# Doppler Configuration for Klutr

This project uses Doppler for environment variable management instead of local `.env` files.

## Required Environment Variables

### Supabase Variables (Required)

The following environment variables are required for Supabase:

- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase project URL (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Client-side Supabase public key (required)
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side Supabase admin key (required, keep secret!)
- `OPENAI_API_KEY` - OpenAI API key for AI features (used by Edge Functions)
- `CRON_SECRET` - Secret key for authenticating cron job endpoints (optional)

### Legacy Variables (Deprecated)

The following variables are from the previous Neon setup and can be removed:

- `NEON_DATABASE_URL` - PostgreSQL connection string from Neon (no longer used)
- `DATABASE_URL` - Alternative database URL (no longer used)

### Setup Instructions

1. **Get Supabase credentials** from your Supabase project dashboard (Settings ? API)
2. **Add to Doppler**:
   ```bash
   doppler secrets set NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   doppler secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
   doppler secrets set SUPABASE_SERVICE_ROLE_KEY="eyJ..."
   doppler secrets set OPENAI_API_KEY="sk-..."
   doppler secrets set CRON_SECRET="your-secret-here"
   ```

3. **For Edge Functions**, set secrets in Supabase Dashboard:
   - Go to Edge Functions ? Settings for each function
   - Add: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### Migration Notes

- Doppler handles all environments (dev, staging, production)
- No `.env` files are committed to the repository
- Supabase migration is complete - Neon variables can be removed

## Setup Instructions

1. **Install Doppler CLI** (if not already installed):

   ```bash
   curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh
   ```

2. **Login to Doppler**:

   ```bash
   doppler login
   ```

3. **Setup Doppler project**:

   ```bash
   doppler setup
   ```

4. **Run development server**:

   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev` - Start development server with Doppler env vars
- `pnpm build` - Build for production with Doppler env vars
- `pnpm start` - Start production server with Doppler env vars
- `pnpm db:push` - Run Prisma database migration with Doppler env vars
- `pnpm db:generate` - Generate Prisma client with Doppler env vars
- `pnpm db:studio` - Open Prisma Studio with Doppler env vars

## Deployment

For production deployments (Netlify/Vercel), ensure the environment variables are set in the deployment platform's environment variable settings, or configure Doppler integration if available.
