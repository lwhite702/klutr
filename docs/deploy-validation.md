# Deployment Validation

This document describes the automated deployment validation system that ensures OpenAI and Supabase connections are working correctly before and after deployments.

## Overview

The validation system runs two types of checks:

1. **Pre-deploy validation**: Runs locally and in CI before deployment to verify environment configuration and service connectivity
2. **Post-deploy validation**: Runs after deployment to verify the deployed application is functioning correctly

## Validation Checks

### Pre-Deploy Checks

1. **Environment Variables**: Verifies all required env vars are present
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`

2. **OpenAI Embedding**: Tests embedding API with `text-embedding-3-small` model
   - Sends test text: "klutr validation test"
   - Verifies response contains valid embedding array

3. **OpenAI Classification**: Tests chat completion API with `gpt-4o-mini` model
   - Sends classification prompt
   - Verifies parsable JSON response

4. **Supabase Database**: Tests database connectivity via REST API
   - Verifies service role key can access Supabase REST endpoints

5. **Supabase Auth**: Tests authentication service accessibility
   - Calls admin users endpoint (lightweight check)

6. **Supabase Storage**: Tests file upload/download roundtrip
   - Uploads test file to storage bucket
   - Downloads and verifies content matches
   - Cleans up test file automatically

7. **CRON_SECRET**: Validates cron authentication endpoint
   - Calls `/api/cron/verify` with correct secret
   - Verifies 200 response with success payload

8. **Feature Flags**: Checks PostHog configuration (if available)
   - Verifies PostHog keys are configured

### Post-Deploy Checks

1. **Environment Variables**: Same as pre-deploy
2. **CRON_SECRET**: Validates against deployed URL
3. **Deploy Health**: Calls `/api/health/check-deploy` endpoint
   - Verifies database connectivity
   - Checks feature flags availability
   - Validates environment configuration
4. **Feature Flags**: Checks via health endpoint

## Usage

### Local Pre-Deploy Validation

```bash
# Using local .env file
cd apps/app
node ../../scripts/validate-deploy.js --predeploy --verbose

# Using Doppler
cd apps/app
doppler run -- node ../../scripts/validate-deploy.js --predeploy --verbose
```

### Post-Deploy Validation

```bash
# After deployment, validate against production URL
node ./scripts/validate-deploy.js --postdeploy --url "https://your-app.vercel.app" --verbose
```

### Shell Wrapper

```bash
# Pre-deploy
./scripts/validate-deploy.sh --predeploy --verbose

# Post-deploy
./scripts/validate-deploy.sh --postdeploy --url "https://your-app.vercel.app" --verbose
```

## CI Integration

### GitHub Actions

The validation runs automatically in CI via `.github/workflows/ci.yml`:

1. After linting and building, the `validate-predeploy` job runs
2. Uses Doppler to inject environment variables
3. Runs pre-deploy validation checks
4. Uploads validation summary as artifact
5. Fails the workflow if any critical check fails

### Vercel Post-Deploy Hook

Vercel doesn't support post-deploy hooks directly in `vercel.json`. Instead, use one of these approaches:

#### Option A: Vercel Webhook + GitHub Actions (Recommended)

1. In Vercel Dashboard → Project Settings → Git → Deploy Hooks
2. Create a webhook that triggers on "Production Deployment"
3. Webhook URL: `https://api.github.com/repos/{owner}/{repo}/dispatches`
4. Payload:
   ```json
   {
     "event_type": "vercel_deployment",
     "client_payload": {
       "url": "$VERCEL_URL",
       "deployment_id": "$VERCEL_DEPLOYMENT_ID"
     }
   }
   ```
5. The `.github/workflows/post-deploy-validation.yml` workflow automatically listens for `repository_dispatch` events and runs post-deploy validation

**GitHub Token Setup:**
- Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
- Create a token with `actions:write` and `issues:write` permissions
- Add the token as `GITHUB_TOKEN` secret in your repository (usually auto-provided by GitHub Actions)

**Webhook Authentication:**
- Use a GitHub Personal Access Token with `repo` scope
- Add it as a secret in Vercel: `GITHUB_TOKEN`
- In the webhook payload, include: `"Authorization": "Bearer $GITHUB_TOKEN"`

#### Option B: Manual Post-Deploy Script

After each deployment, manually run:

```bash
node ./scripts/validate-deploy.js --postdeploy --url "https://your-app.vercel.app"
```

#### Option C: Vercel CLI Hook

Add to your deployment script:

```bash
# After vercel --prod
vercel --prod
node ./scripts/validate-deploy.js --postdeploy --url "https://your-app.vercel.app"
```

## Output Format

The validation script outputs a JSON summary:

```json
{
  "success": true,
  "mode": "predeploy",
  "timestamp": "2025-10-31T18:23:45.123Z",
  "totalDurationMs": 3421,
  "checks": [
    {
      "name": "env-vars",
      "ok": true,
      "durationMs": 23,
      "details": { "found": 5 }
    },
    {
      "name": "openai-embedding",
      "ok": true,
      "durationMs": 420,
      "details": { "embeddingLength": 1536 }
    }
  ],
  "summary": {
    "passed": 8,
    "failed": 0,
    "skipped": 0,
    "total": 8
  }
}
```

The summary is also saved to `tmp/deploy-validate-<timestamp>.json` for audit purposes.

## Error Handling

### Retry Logic

- Each check retries up to 3 times with exponential backoff
- Base delay: 400ms, doubles each retry (400ms, 800ms, 1600ms)

### Timeouts

- Default timeout per check: 10 seconds
- Timeout errors are caught and reported in the summary

### Failure Remediation

When checks fail, the script provides remediation hints:

- **Missing env vars**: Check Doppler/Vercel configuration
- **OpenAI failures**: Verify API key validity and quota
- **Supabase failures**: Check service role key permissions and project status
- **Storage failures**: Verify bucket exists and CORS policies
- **CRON_SECRET failures**: Verify secret matches between environments

## Security

- Secrets are masked in logs (only first 4 and last 4 characters shown)
- Service role keys are never logged in full
- Test artifacts (files, DB rows) are automatically cleaned up
- Validation endpoints require proper authentication

## Feature Flags

AI-related checks (OpenAI embedding/classification) can be gated behind feature flags:

- Set `VALIDATION_ENABLE_AI_CHECKS=false` in Doppler to skip AI checks in CI
- Useful for staging environments where AI quota may be limited

## Troubleshooting

### Validation Fails in CI

1. Check Doppler configuration: `doppler configs` to verify `ci` config exists
2. Verify `DOPPLER_TOKEN` secret is set in GitHub Actions
3. Check validation logs for specific failure details

### Post-Deploy Validation Fails

1. Verify deployed URL is accessible: `curl https://your-app.vercel.app/api/health`
2. Check Vercel deployment logs for runtime errors
3. Verify environment variables are set in Vercel dashboard
4. Test CRON_SECRET manually: `curl -H "Authorization: Bearer $CRON_SECRET" https://your-app.vercel.app/api/cron/verify`

### Storage Upload Fails

1. Verify `SUPABASE_BUCKET_ATTACHMENTS` env var is set (defaults to "attachments")
2. Check bucket exists in Supabase dashboard
3. Verify service role key has write permissions
4. Check CORS policies allow uploads from validation script origin

## Rollback Procedure

If post-deploy validation fails:

1. **Vercel Dashboard**: 
   - Go to Deployments
   - Find previous successful deployment
   - Click "Promote to Production"

2. **Vercel CLI**:
   ```bash
   vercel --prod --rollback
   ```

3. **Git**:
   ```bash
   git revert <deployment-commit>
   git push origin main
   ```

## Related Files

- `/scripts/validate-deploy.js` - Main validation script
- `/scripts/validate-deploy.sh` - Shell wrapper
- `/apps/app/app/api/cron/verify/route.ts` - CRON_SECRET validation endpoint
- `/apps/app/app/api/health/check-deploy/route.ts` - Deployment health check endpoint
- `/.github/workflows/ci.yml` - CI workflow with pre-deploy validation

## Changelog

- 2025-10-31: Initial implementation of deployment validation system
