# Doppler Configuration for Noteornope

This project uses Doppler for environment variable management instead of local `.env` files.

## Required Environment Variables

### Current Variables (Phase 1)

The following environment variables are currently configured in Doppler:

- `NEON_DATABASE_URL` - PostgreSQL connection string from Neon
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `CRON_SECRET` - Secret key for authenticating cron job endpoints

### Target Variables (Phase 2+)

The following variables will be added to Doppler during Supabase migration:

- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side Supabase admin key
- `SUPABASE_ANON_KEY` - Client-side Supabase public key

### Migration Notes

- Doppler handles all environments (dev, staging, production)
- No `.env` files are committed to the repository
- Phase 2 setup: Add Supabase variables to Doppler before migration
- Phase 5 cleanup: Remove Neon variables from Doppler after cutover

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
