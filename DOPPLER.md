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

### Installing Doppler CLI

**Note:** This project does **not** use Doppler CLI integration for production builds. Vercel builds use environment variables configured directly in Vercel. Doppler CLI is only required for local development.

#### Installation Methods

##### Option 1: Universal Installer (Recommended)

```bash
curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh
```

This works on macOS, Linux, and Windows (with WSL/Git Bash).

##### Option 2: Package Managers

- **macOS (Homebrew):**

  ```bash
  brew install doppler
  ```

- **macOS/Linux (npm):**

  ```bash
  npm install -g doppler
  ```

- **Windows (Scoop):**

  ```bash
  scoop install doppler
  ```

- **Windows (Chocolatey):**

  ```bash
  choco install doppler
  ```

##### Option 3: Manual Installation

1. Download the appropriate binary from [Doppler's releases page](https://github.com/DopplerHQ/cli/releases)
2. Extract and add to your PATH
3. Verify installation:

   ```bash
   doppler --version
   ```

#### Authentication and Project Setup

1. **Login to Doppler** (opens browser for authentication):

   ```bash
   doppler login
   ```

   Or use a service token:

   ```bash
   doppler configure set token <YOUR_TOKEN>
   ```

2. **Setup Doppler project** (interactive setup):

   ```bash
   doppler setup
   ```

   When prompted:

   - Select your **project**: `noteornope`
   - Select your **config**: `dev` (or `prd` for production secrets)

3. **Verify configuration**:

   ```bash
   doppler configure get
   ```

4. **Run development server** (with Doppler injecting env vars):

   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev` - Start development server with Doppler env vars (uses `doppler run -- next dev`)
- `pnpm build` - Build for production (**does not use Doppler** - Vercel uses env vars directly)
- `pnpm start` - Start production server (**does not use Doppler** - requires env vars in environment)
- `pnpm db:push` - Run Prisma database migration with Doppler env vars (uses `doppler run -- npx prisma db push`)
- `pnpm db:generate` - Generate Prisma client (runs automatically via `postinstall` script)
- `pnpm db:studio` - Open Prisma Studio with Doppler env vars (uses `doppler run -- npx prisma studio`)

**Note:** The `postinstall` script automatically runs `prisma generate` after package installation, ensuring the Prisma client is always generated during builds (including Vercel deployments).

## Deployment

### Vercel Environment Variable Setup

For Vercel deployments, environment variables must be manually synced from Doppler to Vercel. **Vercel builds do not use Doppler CLI** (the `build` script runs `next build` directly).

#### Sync Process

1. **Export variables from Doppler:**

   ```bash
   doppler secrets download --no-file --format env
   ```

2. **Add each variable to Vercel** for all environments (production, preview, development):

   ```bash
   # Production
   vercel env add NEON_DATABASE_URL production
   vercel env add OPENAI_API_KEY production
   vercel env add CRON_SECRET production

   # Preview (for PR deployments)
   vercel env add NEON_DATABASE_URL preview
   vercel env add OPENAI_API_KEY preview
   vercel env add CRON_SECRET preview

   # Development (local dev with vercel dev)
   vercel env add NEON_DATABASE_URL development
   vercel env add OPENAI_API_KEY development
   vercel env add CRON_SECRET development
   ```

3. **Verify variables are set:**

   ```bash
   vercel env ls
   ```

#### Important Notes

- **Build-time variables**: All required variables must be set in Vercel **before** the build runs
- **Prisma generation**: The `postinstall` script runs during Vercel builds, so `NEON_DATABASE_URL` must be available at build time (even if only for Prisma client generation)
- **CRON_SECRET**: Required for cron endpoint authentication. Vercel Cron jobs will automatically include this in headers if configured
- **Do not commit secrets**: Never commit actual secret values to git. Use Vercel's environment variable interface or CLI

#### Alternative: Vercel Dashboard

You can also set variables via the Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add each variable manually, selecting the appropriate environments
3. Copy values from Doppler (use `doppler secrets get VARIABLE_NAME --plain`)

See `VERCEL_SETUP.md` for complete deployment instructions.

### Other Platforms

For other deployment platforms (Netlify, etc.), ensure the environment variables are set in the platform's environment variable settings, or configure Doppler integration if available.
