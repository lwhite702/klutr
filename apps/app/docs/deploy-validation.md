# Deployment Validation Documentation

**Last updated:** 2025-11-10  
**Status:** Active  
**Maintained by:** Klutr Engineering

## Overview

Klutr's deployment validation system provides automated pre-deploy and post-deploy checks to ensure that critical service connections (OpenAI, Supabase) are functioning correctly before and after deployments. This prevents broken deployments from reaching production and provides fast feedback on configuration issues.

## Architecture

### Validation Flow

```
┌─────────────────┐
│   Code Change   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   GitHub Push   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Pre-Deploy Validation (CI) │
│  - Env vars check           │
│  - OpenAI connectivity      │
│  - Supabase connectivity    │
│  - Auth/Storage/DB tests    │
└────────┬────────────────────┘
         │
         ▼
    ┌─────────┐
    │ Pass?   │
    └────┬────┘
         │ Yes
         ▼
┌─────────────────┐
│  Vercel Deploy  │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────┐
│ Post-Deploy Validation (opt) │
│  - All pre-deploy checks     │
│  - CRON secret validation    │
│  - App health check          │
└──────────────────────────────┘
```

## Components

### 1. Validation Script (`/scripts/validate-deploy.js`)

Node.js script that performs all validation checks with retry logic and timeouts.

**Features:**
- Retry logic (3 attempts with exponential backoff)
- Timeouts (10s per check)
- Structured JSON output
- Security: Masks sensitive tokens in logs
- Cleanup: Removes test artifacts automatically

**Usage:**

```bash
# Pre-deploy validation (local or CI)
node ./scripts/validate-deploy.js --predeploy --verbose

# Post-deploy validation (against deployed URL)
node ./scripts/validate-deploy.js --postdeploy --url https://klutr.app

# With Doppler
doppler run -- node ./scripts/validate-deploy.js --predeploy --verbose
```

**Exit codes:**
- `0` - All checks passed
- `1` - One or more checks failed
- `2` - Invalid usage / missing required env vars

### 2. Shell Wrapper (`/scripts/validate-deploy.sh`)

Lightweight bash wrapper for the Node.js script. Provides simple shell integration.

```bash
# Same usage as Node.js script
./scripts/validate-deploy.sh --predeploy --verbose
```

### 3. API Endpoints

#### `/api/cron/verify`

**Purpose:** Validates CRON_SECRET for deployment validation and cron job authentication.

**Method:** `POST` or `GET`

**Auth:** Requires `Authorization: Bearer <CRON_SECRET>` header

**Response:**
```json
{
  "ok": true,
  "message": "CRON_SECRET verified successfully",
  "timestamp": "2025-11-10T18:23:45.123Z"
}
```

**Status codes:**
- `200` - CRON_SECRET valid
- `401` - Invalid or missing CRON_SECRET
- `500` - Server error (CRON_SECRET not configured)

#### `/api/health/check-deploy`

**Purpose:** Provides runtime diagnostics for deployed application.

**Method:** `GET`

**Auth:** None (public, but sensitive data masked)

**Response:**
```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "message": "Database connectivity verified"
  },
  "environment": {
    "configured": true,
    "present": ["SUPABASE_URL", "OPENAI_API_KEY", ...],
    "missing": [],
    "nodeEnv": "production"
  },
  "featureFlags": {
    "enabled": true,
    "configured": true
  },
  "timestamp": "2025-11-10T18:23:45.123Z"
}
```

**Status codes:**
- `200` - Health check successful (may show degraded status in response)
- `500` - Health check failed

### 4. GitHub Actions Workflow (`.github/workflows/ci.yml`)

**Job:** `validate-deployment`

Runs pre-deploy validation in CI before allowing deployment.

**Steps:**
1. Checkout code
2. Setup Node.js and pnpm
3. Install Doppler CLI (if DOPPLER_TOKEN available)
4. Run pre-deploy validation
5. Upload validation results as artifacts
6. Comment on PR if validation fails

**Required Secrets:**
- `DOPPLER_TOKEN` (preferred) - OR -
- Individual secrets: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`

**Configuration:**
```yaml
# Runs on all pushes and PRs to main/develop/feature/* branches
# Blocks deployment if validation fails
# Uploads results as artifacts (30 day retention)
```

### 5. Vercel Configuration (`vercel.json`)

Updated to include cron job definitions for existing endpoints.

**Cron schedules:**
- `/api/cron/nightly-cluster` - Daily at 2:00 AM UTC
- `/api/cron/nightly-stacks` - Daily at 3:00 AM UTC
- `/api/cron/weekly-insights` - Weekly on Sunday at 4:00 AM UTC

**Note:** For post-deploy validation via Vercel hooks, you'll need to set up a Deploy Hook or GitHub Action trigger (see "Post-Deploy Validation" section).

## Validation Checks

### 1. Environment Variables Check
Verifies all required env vars are present and valid.

**Required vars:**
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

**Validation:**
- Presence check
- Format validation (e.g., SUPABASE_URL must start with https://)

**Remediation:** Set missing variables in Doppler or local `.env` file.

### 2. OpenAI Embedding Check
Tests OpenAI embeddings API with a test input.

**Test:** Calls `text-embedding-3-small` model with input "klutr validation test"

**Expected:** Returns numeric embedding array with length > 0

**Remediation:**
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has quota
- Test manually: `curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models`

### 3. OpenAI Classification Check
Tests OpenAI chat completion API.

**Test:** Calls `gpt-4o-mini` model with classification prompt

**Expected:** Returns valid chat completion response

**Remediation:**
- Verify `OPENAI_API_KEY` has access to `gpt-4o-mini`
- Check quota limits

### 4. Supabase Database Check
Tests database connectivity via Supabase REST API.

**Test:** Attempts simple query (e.g., SELECT from notes table with limit 1)

**Expected:** HTTP 200 response

**Remediation:**
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase project status
- Verify database is not paused

### 5. Supabase Auth Check
Tests Supabase Auth API connectivity.

**Test:** Lists users via Admin API (limit 1)

**Expected:** HTTP 200 response (empty array is OK)

**Remediation:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` has admin permissions
- Check Supabase Auth is enabled

### 6. Supabase Storage Check
Tests storage upload/download with cleanup.

**Test:**
1. Upload test file (`klutr-validate-<timestamp>.txt`)
2. Download and verify content matches
3. Delete test file

**Expected:** Upload succeeds, download matches, cleanup succeeds

**Remediation:**
- Verify storage bucket exists (default: `test-bucket`)
- Check storage policies allow service role access
- Verify CORS settings if needed

**Note:** If cleanup fails, test file remains but validation continues.

### 7. CRON Secret Check
Tests CRON_SECRET validation endpoint.

**Test:** POST to `/api/cron/verify` with `Authorization: Bearer <CRON_SECRET>`

**Expected:** `{ ok: true }` response

**Remediation:**
- Verify `CRON_SECRET` matches between deployment env and local
- Check `/api/cron/verify` endpoint is deployed and accessible

### 8. App Health Check (Post-Deploy Only)
Tests deployed application runtime status.

**Test:** GET `/api/health/check-deploy`

**Expected:** `{ status: "ok", database: { connected: true }, ... }`

**Remediation:**
- Verify deployment succeeded
- Check application logs for errors
- Ensure database connectivity in production

## Environment Setup

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables (via Doppler or .env)
doppler setup

# Run validation
doppler run -- node ./scripts/validate-deploy.js --predeploy --verbose
```

### CI/CD (GitHub Actions)

**Required GitHub Secrets:**
- `DOPPLER_TOKEN` (recommended) OR
- `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`

**Setup:**
1. Add secrets in GitHub repo settings: Settings > Secrets and variables > Actions
2. Push code to trigger CI workflow
3. Monitor workflow in Actions tab

### Vercel Deployment

**Required Environment Variables:**
Set in Vercel project settings (Settings > Environment Variables):

- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_POSTHOG_KEY` (optional)
- `NEXT_PUBLIC_POSTHOG_HOST` (optional)

**Via Doppler Integration:**
Connect Doppler integration in Vercel for automatic secret sync.

## Post-Deploy Validation

### Option A: GitHub Action (Recommended)

Create a separate workflow that runs after Vercel deployment:

```yaml
# .github/workflows/post-deploy-validation.yml
name: Post-Deploy Validation

on:
  deployment_status:

jobs:
  validate:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run post-deploy validation
        env:
          DEPLOY_URL: ${{ github.event.deployment_status.target_url }}
        run: |
          node ./scripts/validate-deploy.js --postdeploy --url "$DEPLOY_URL" --verbose
```

**Note:** This requires Vercel GitHub integration to emit deployment_status events.

### Option B: Manual Trigger

```bash
# After deployment completes
node ./scripts/validate-deploy.js --postdeploy --url https://klutr.app --verbose
```

### Option C: Vercel Deploy Hook + External Service

Use Vercel's Deploy Hooks with an external service (e.g., GitHub Action triggered via webhook) to run validation.

## Troubleshooting

### Validation Fails with Timeout

**Symptom:** Checks fail with "Timeout after 10000ms"

**Solution:**
- Check network connectivity
- Verify service (OpenAI/Supabase) is not experiencing outages
- Increase timeout in script if needed for slow networks

### OpenAI Quota Exceeded

**Symptom:** OpenAI checks fail with 429 or quota error

**Solution:**
- Check OpenAI account billing and usage
- Wait for quota reset
- Upgrade OpenAI account tier if needed

### Supabase Storage Check Fails

**Symptom:** Storage upload/download fails with 403 or 404

**Solution:**
- Create storage bucket named `test-bucket` in Supabase dashboard
- Set bucket policy to allow service role access:
  ```sql
  -- In Supabase SQL editor
  CREATE POLICY "Allow service role all actions"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'test-bucket');
  ```
- Check CORS settings if running from browser context

### Database Connection Issues

**Symptom:** Database check fails in deployed environment

**Solution:**
- Verify Supabase project is not paused (free tier)
- Check connection pooling limits
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correctly set in Vercel

### CRON Secret Mismatch

**Symptom:** CRON check fails with 401 Unauthorized

**Solution:**
- Ensure `CRON_SECRET` is identical in local env, CI, and Vercel
- Regenerate `CRON_SECRET` and update all locations:
  ```bash
  # Generate new secret
  openssl rand -base64 32
  
  # Update in:
  # 1. Doppler
  # 2. GitHub Secrets
  # 3. Vercel Environment Variables
  ```

## Output Examples

### Successful Validation

```json
{
  "success": true,
  "checks": [
    { "name": "env-vars", "ok": true, "durationMs": 23 },
    { "name": "openai-embed", "ok": true, "durationMs": 420 },
    { "name": "openai-classify", "ok": true, "durationMs": 380 },
    { "name": "supabase-db", "ok": true, "durationMs": 156 },
    { "name": "supabase-auth", "ok": true, "durationMs": 234 },
    { "name": "supabase-storage", "ok": true, "durationMs": 890 },
    { "name": "cron-secret", "ok": true, "durationMs": 210 },
    { "name": "app-health", "ok": true, "durationMs": 178 }
  ],
  "timestamp": "2025-11-10T18:23:45.123Z"
}
```

### Failed Validation

```json
{
  "success": false,
  "checks": [
    { "name": "env-vars", "ok": true, "durationMs": 23 },
    { "name": "openai-embed", "ok": true, "durationMs": 420 },
    { 
      "name": "supabase-storage", 
      "ok": false, 
      "durationMs": 1200,
      "details": "Upload failed HTTP 403: Forbidden",
      "remediation": "Verify Supabase Storage is enabled and bucket \"test-bucket\" exists with proper policies. Check CORS settings if needed."
    }
  ],
  "timestamp": "2025-11-10T18:23:45.123Z"
}
```

## Maintenance

### Adding New Checks

1. Add check function to `/scripts/validate-deploy.js`:
```javascript
async function checkNewService() {
  const startTime = Date.now();
  try {
    // Test logic here
    recordCheck('new-service', true, Date.now() - startTime);
    return true;
  } catch (error) {
    recordCheck('new-service', false, Date.now() - startTime, error.message, 'Remediation steps');
    return false;
  }
}
```

2. Call in `main()` function
3. Update documentation
4. Test locally before deploying

### Updating Timeouts/Retries

Edit constants at top of `/scripts/validate-deploy.js`:
```javascript
const TIMEOUT_MS = 10000; // 10 seconds
const RETRY_COUNT = 3;
const RETRY_BASE_DELAY_MS = 400;
```

### Security Best Practices

- Never log full API keys or secrets
- Always mask tokens in output using `maskToken()`
- Use service role keys only on server-side
- Rotate secrets regularly
- Limit CRON_SECRET exposure (use Authorization header, not query params)

## Related Documentation

- [CRON Jobs Documentation](./cron.md)
- [Supabase Migration Guide](./SUPABASE_MIGRATION.md)
- [Deployment Guide](./deployment.md)
- [Environment Setup](./dev-setup.md)

## Support

For issues or questions:
1. Check this documentation
2. Review validation logs and error messages
3. Check Supabase/OpenAI status pages
4. Contact Klutr engineering team

---

**Version:** 1.0.0  
**Last reviewed:** 2025-11-10
