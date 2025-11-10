# Deployment Validation

This document describes the automated deployment validation system that ensures OpenAI and Supabase connections are working before and after deployments.

## Overview

The validation system runs checks in two phases:

1. **Pre-deploy validation**: Runs locally and in CI before deployment to catch issues early
2. **Post-deploy validation**: Runs after deployment to verify the production environment

## Validation Checks

### Pre-deploy Checks

1. **Environment Variables**: Verifies all required env vars are present
2. **OpenAI Embedding**: Tests embedding generation with `text-embedding-3-small`
3. **OpenAI Classification**: Tests chat completion with `gpt-4o-mini`
4. **Supabase Database**: Verifies database connectivity with a simple query
5. **Supabase Auth**: Tests admin API access
6. **Supabase Storage**: Uploads, downloads, and deletes a test file

### Post-deploy Checks

All pre-deploy checks plus:

7. **CRON_SECRET Validation**: Verifies `/api/cron/verify` endpoint
8. **App Health Check**: Calls `/api/health/check-deploy` to verify runtime status

## Usage

### Local Pre-deploy Validation

```bash
# Using local .env file
node ./scripts/validate-deploy.js --predeploy --verbose

# Using Doppler
doppler run -- node ./scripts/validate-deploy.js --predeploy --verbose

# Using shell wrapper
./scripts/validate-deploy.sh --predeploy --verbose
```

### Post-deploy Validation

```bash
# After deployment, validate against production URL
node ./scripts/validate-deploy.js --postdeploy --url "https://your-app.vercel.app" --verbose

# Or using Doppler
doppler run -- node ./scripts/validate-deploy.js --postdeploy --url "https://your-app.vercel.app" --verbose
```

## Required Environment Variables

The validation script requires these environment variables:

- `OPENAI_API_KEY` - OpenAI API key for embeddings and classification
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)
- `CRON_SECRET` - Secret for cron job authentication
- `NEXT_PUBLIC_APP_URL` - (Optional) Deployed app URL for post-deploy checks

## CI Integration

The validation runs automatically in GitHub Actions as part of the CI pipeline:

1. **Lint and Test**: Runs linter and tests
2. **Pre-deploy Validation**: Runs connection checks before build
3. **Build**: Only proceeds if validation passes

See `.github/workflows/ci.yml` for the full workflow.

### GitHub Secrets

Configure these secrets in your GitHub repository:

- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

Or use Doppler GitHub Action to inject secrets:

```yaml
- name: Run pre-deploy validation
  uses: dopplerhq/github-action@v3
  with:
    doppler_token: ${{ secrets.DOPPLER_TOKEN }}
    project: klutr
    config: ci
  env:
    RUN_COMMAND: node ./scripts/validate-deploy.js --predeploy --verbose
```

## Vercel Post-deploy Validation

Vercel doesn't support post-deploy hooks directly in `vercel.json`. Use one of these approaches:

### Option A: Vercel Webhook → GitHub Action (Recommended)

1. **Set up Vercel Webhook**:
   - Go to Vercel Dashboard → Project Settings → Integrations → Webhooks
   - Add webhook URL: `https://api.github.com/repos/OWNER/REPO/dispatches`
   - Event: `deployment.created` or `deployment.succeeded`
   - Secret: Use a GitHub personal access token

2. **Create GitHub Action for Post-deploy**:
   Create `.github/workflows/post-deploy-validation.yml`:

```yaml
name: Post-deploy Validation

on:
  repository_dispatch:
    types: [vercel-deployment]

jobs:
  validate-post-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run post-deploy validation
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          CRON_SECRET: ${{ secrets.CRON_SECRET }}
        run: |
          node ./scripts/validate-deploy.js --postdeploy --url "${{ github.event.client_payload.url }}" --verbose
```

3. **Vercel Webhook Payload**:
   Configure Vercel webhook to send:
   ```json
   {
     "event_type": "vercel-deployment",
     "client_payload": {
       "url": "https://your-app.vercel.app"
     }
   }
   ```

### Option B: Manual Post-deploy Script

Create a script that runs after manual deployments:

```bash
#!/bin/bash
# scripts/post-deploy.sh

DEPLOYED_URL="https://your-app.vercel.app"

doppler run -- node ./scripts/validate-deploy.js --postdeploy --url "$DEPLOYED_URL" --verbose

if [ $? -ne 0 ]; then
  echo "❌ Post-deploy validation failed. Consider rolling back."
  exit 1
fi
```

### Option C: Vercel Deployment Notification

Use Vercel's deployment notifications to trigger validation:

1. Go to Project Settings → Notifications
2. Add webhook for deployment events
3. Configure to call your validation endpoint or GitHub Action

## API Endpoints

### `/api/cron/verify`

Validates CRON_SECRET authentication.

**Method**: `POST`

**Headers**:
```
Authorization: Bearer <CRON_SECRET>
```

**Response**:
```json
{
  "success": true,
  "message": "CRON_SECRET validated successfully",
  "timestamp": "2025-10-31T18:23:45.123Z"
}
```

### `/api/health/check-deploy`

Provides runtime diagnostics for the deployed application.

**Method**: `GET`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-31T18:23:45.123Z",
  "environment": "production",
  "checks": {
    "dbConnected": true,
    "featureFlagsLoaded": true,
    "envVarsConfigured": true
  },
  "dbConnected": true,
  "featureFlagsLoaded": true
}
```

## Output Format

The validation script outputs a JSON summary:

```json
{
  "success": true,
  "checks": [
    {
      "name": "env",
      "ok": true,
      "durationMs": 23
    },
    {
      "name": "openai-embed",
      "ok": true,
      "durationMs": 420
    },
    {
      "name": "supabase-storage",
      "ok": false,
      "durationMs": 1200,
      "details": "403 Forbidden"
    }
  ],
  "timestamp": "2025-10-31T18:23:45.123Z",
  "mode": "pre-deploy",
  "totalDurationMs": 5234
}
```

The summary is also saved to `./tmp/deploy-validate-<timestamp>.json` for audit purposes.

## Error Handling and Remediation

When validation fails, the script provides remediation hints:

### OpenAI Errors

- **Embedding/Classification failed**: Verify `OPENAI_API_KEY` is valid and has quota
- **Test**: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

### Supabase Errors

- **Database failed**: Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- **Auth failed**: Verify service role key has admin permissions
- **Storage failed**: Verify storage bucket exists and CORS is configured

### CRON_SECRET Errors

- **Validation failed**: Verify `CRON_SECRET` matches deployed app configuration
- **Check**: Ensure `/api/cron/verify` endpoint is accessible

### Rollback Instructions

If post-deploy validation fails:

1. **Vercel Dashboard**: Select previous deployment and promote to production
2. **CLI**: `vercel --prod --rollback` (if available)

## Security Considerations

- Secrets are masked in logs (only first 4 and last 4 characters shown)
- Validation script never logs full API keys or tokens
- Post-deploy validation endpoints should be rate-limited in production
- Consider adding authentication to `/api/health/check-deploy` if exposing sensitive info

## Troubleshooting

### Validation Times Out

- Increase `DEFAULT_TIMEOUT_MS` in `validate-deploy.js` (default: 10s)
- Check network connectivity and firewall rules
- Verify service endpoints are accessible

### Storage Test Fails

- Verify bucket name matches your Supabase storage bucket (default: `public`)
- Check storage policies allow service role key access
- Ensure CORS is configured for your domain

### Feature Flags Not Loading

- Verify PostHog is configured and accessible
- Check `POSTHOG_KEY` environment variable (if used)
- Review feature flag cache settings

## Best Practices

1. **Run pre-deploy validation before every deployment**
2. **Set up automated post-deploy validation** via webhooks
3. **Monitor validation results** in CI/CD logs
4. **Keep validation checks fast** (< 30s total)
5. **Clean up test artifacts** automatically (storage files, test DB rows)
6. **Use feature flags** to gate AI calls in CI unless explicitly enabled

## Related Documentation

- [Deployment Guide](./deployment.md)
- [Environment Variables](./dev-setup.md#environment-variables)
- [Cron Jobs](./cron.md)
