# Doppler Configuration for Browser Testing

**Date:** 2025-11-14  
**Purpose:** Enable local development server for browser-based testing

## Quick Setup

### 1. Install Doppler CLI

```bash
# macOS
brew install dopplerhq/cli/doppler

# Linux
curl -Ls https://cli.doppler.com/install.sh | sh

# Windows (PowerShell)
choco install doppler

# Verify installation
doppler --version
```

### 2. Login to Doppler

```bash
doppler login
```

This will open your browser for authentication. Follow the prompts to complete login.

### 3. Configure Project

```bash
# Navigate to project directory
cd /Users/lee/klutr-clean

# Setup Doppler project (interactive)
doppler setup
```

When prompted:

- **Project:** `noteornope` (or your project name)
- **Config:** `dev` (for development)

### 4. Verify Configuration

```bash
# Check current configuration
doppler configure get

# Test secrets access
doppler run -- printenv | grep BASEHUB_TOKEN
```

### 5. Start Development Server

The `pnpm dev` command should already be configured to use Doppler. If not, you can run:

```bash
# Option 1: Use existing pnpm dev (if configured)
pnpm dev

# Option 2: Run with Doppler explicitly
doppler run -- pnpm dev
```

### 6. Alternative: Manual Environment Variables

If Doppler setup is not possible, you can manually set the required environment variables:

```bash
# Set BASEHUB_TOKEN (required for Basehub content)
export NEXT_PUBLIC_BASEHUB_TOKEN="your-basehub-token"

# Then run dev server
pnpm dev
```

**Note:** You'll need to get the Basehub token from your Basehub project settings or Doppler.

## Required Environment Variables

For browser testing, you need at minimum:

- `NEXT_PUBLIC_BASEHUB_TOKEN` - Basehub read token for content fetching
- `BASEHUB_TOKEN` - Basehub API token (if using MCP)

Optional but recommended:

- `NEXT_PUBLIC_SUPABASE_URL` - For auth testing
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - For auth testing

## Troubleshooting

### Error: "You must specify a project"

**Solution:**

```bash
doppler setup --project noteornope --config dev
```

### Error: "The fallback file does not exist"

**Solution:** This means Doppler is not configured. Either:

1. Run `doppler setup` to configure
2. Or manually set `NEXT_PUBLIC_BASEHUB_TOKEN` environment variable

### Error: "Unable to fetch secrets from the Doppler API"

**Solution:**

1. Verify you're logged in: `doppler login`
2. Check project access: `doppler projects`
3. Verify config exists: `doppler configs`

### Server Starts But Basehub Content Missing

**Solution:**

1. Verify `NEXT_PUBLIC_BASEHUB_TOKEN` is set:
   ```bash
   doppler run -- printenv | grep BASEHUB
   ```
2. Check token is valid in Basehub dashboard
3. Verify token has read permissions

## Testing Checklist

Once the server is running:

- [x] Marketing pages load without errors ✅
- [x] Basehub content displays (hero, features) ✅
- [x] Auth pages work (login, signup) ✅
- [x] All links work correctly ✅
- [x] SEO metadata is present (check page source) ✅
- [x] Favicons load correctly ✅
- [x] No console errors (only non-critical warnings) ✅

**Test Results:** See `reports/BROWSER_TEST_RESULTS.md` for complete test report.

## Next Steps

After server is running:

1. Open http://localhost:3000
2. Test all marketing pages
3. Test auth flows
4. Verify links and redirects
5. Check accessibility with browser dev tools
