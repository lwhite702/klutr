# Deployment Validation Setup Guide

This guide walks you through setting up automated deployment validation for Klutr.

## Quick Start

### 1. Install Dependencies

```bash
# Already done if you've run pnpm install
pnpm install
```

### 2. Configure Environment Variables

#### Option A: Using Doppler (Recommended)

```bash
# Install Doppler CLI
brew install dopplerhq/cli/doppler  # macOS
# or
curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh  # Linux

# Setup Doppler project
cd /workspace
doppler setup

# Verify secrets are available
doppler secrets
```

#### Option B: Using .env File

```bash
# Copy example file
cp .env.example .env

# Edit .env and fill in your secrets
nano .env
```

Required secrets:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

### 3. Run Local Validation

```bash
# Test validation locally
node ./scripts/validate-deploy.js --predeploy --verbose

# Expected output: JSON summary with all checks passing
```

### 4. Setup GitHub Secrets

Add these secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

Required secrets:
- `DOPPLER_TOKEN` (if using Doppler) OR
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

Optional (for post-deploy validation):
- `NEXT_PUBLIC_APP_URL`

### 5. Setup Vercel Environment Variables

**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add the same secrets as GitHub, plus:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_POSTHOG_KEY` (optional)
- `NEXT_PUBLIC_POSTHOG_HOST` (optional)

**Or** connect Doppler integration:
1. Go to Vercel → Integrations → Browse Marketplace
2. Find and install Doppler
3. Connect to your Doppler project
4. Secrets will sync automatically

### 6. Enable GitHub Actions

The CI workflow is already in place at `.github/workflows/ci.yml`.

**On your next push, GitHub Actions will:**
1. Run pre-deploy validation
2. Upload validation results as artifacts
3. Comment on PRs if validation fails
4. Block deployment if critical checks fail

### 7. Setup Post-Deploy Validation (Optional)

```bash
# Enable post-deploy workflow
mv .github/workflows/post-deploy-validation.yml.example .github/workflows/post-deploy-validation.yml

# Commit and push
git add .github/workflows/post-deploy-validation.yml
git commit -m "Enable post-deploy validation"
git push
```

**Requirements:**
- Vercel GitHub integration must be active
- Vercel must send `deployment_status` events to GitHub

## Validation Checks

The validation system performs these checks:

### Pre-Deploy (CI)
✓ Environment variables configured  
✓ OpenAI API connectivity (embeddings)  
✓ OpenAI API connectivity (chat completion)  
✓ Supabase database connectivity  
✓ Supabase Auth API  
✓ Supabase Storage (upload/download/cleanup)  

### Post-Deploy (Production)
✓ All pre-deploy checks  
✓ CRON secret validation  
✓ Application health check  

## Testing the Setup

### Test Pre-Deploy Locally

```bash
# Run validation
node ./scripts/validate-deploy.js --predeploy --verbose

# Check exit code
echo $?  # Should be 0 for success
```

### Test Post-Deploy

```bash
# After deploying to production
node ./scripts/validate-deploy.js --postdeploy --url https://your-app.vercel.app --verbose
```

### Test in CI

```bash
# Push to a feature branch
git checkout -b test/validation
git push -u origin test/validation

# Check GitHub Actions tab for validation results
```

## Troubleshooting

### Validation Fails with "Missing env vars"

**Fix:** Ensure all required environment variables are set in your environment (Doppler or .env)

```bash
# Check which vars are missing
node ./scripts/validate-deploy.js --predeploy --verbose 2>&1 | grep "Missing"
```

### OpenAI Checks Fail

**Possible causes:**
- Invalid API key
- Quota exceeded
- Network connectivity issues

**Fix:**
```bash
# Verify API key manually
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models

# Check quota in OpenAI dashboard
open https://platform.openai.com/usage
```

### Supabase Storage Check Fails

**Fix:** Create storage bucket in Supabase dashboard

1. Go to Supabase Dashboard → Storage
2. Create new bucket named `test-bucket`
3. Set bucket policy:

```sql
-- Run in Supabase SQL Editor
CREATE POLICY "Allow service role all actions"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'test-bucket');
```

### CRON Secret Check Fails

**Fix:** Ensure CRON_SECRET is identical across all environments

```bash
# Generate new secret
openssl rand -base64 32

# Update in:
# 1. Local .env (or Doppler)
# 2. GitHub Secrets
# 3. Vercel Environment Variables
```

### CI Workflow Doesn't Run

**Check:**
1. GitHub Actions is enabled (Settings → Actions → General)
2. Workflow file is valid YAML
3. Branch is included in workflow triggers

### Post-Deploy Validation Doesn't Trigger

**Check:**
1. Vercel GitHub integration is installed
2. `deployment_status` events are enabled in Vercel
3. Workflow file is renamed from `.example` to `.yml`

## CI Workflow Details

The CI workflow (`.github/workflows/ci.yml`) includes:

```yaml
jobs:
  validate-deployment:  # Runs first
    - Checks out code
    - Sets up Node.js and pnpm
    - Installs Doppler CLI
    - Runs pre-deploy validation
    - Uploads results as artifacts
    - Comments on PR if failed
  
  lint:  # Runs after validation
    - Runs ESLint
  
  build:  # Runs after validation
    - Builds Next.js application
```

**Behavior:**
- Validation runs on all pushes and PRs
- Lint and build wait for validation to pass
- PR gets comment with remediation steps if validation fails
- Artifacts are retained for 30 days

## Post-Deploy Workflow Details

The post-deploy workflow (`.github/workflows/post-deploy-validation.yml`) includes:

```yaml
on:
  deployment_status:  # Triggered by Vercel after deploy

jobs:
  validate-post-deploy:
    - Extracts deployment URL
    - Runs validation against production
    - Creates GitHub issue if failed
    - Uploads results as artifacts (90 day retention)
```

**Behavior:**
- Only runs on successful production deployments
- Creates GitHub issue with rollback instructions if failed
- Artifacts retained for 90 days for audit

## Monitoring

### View Validation Results

**GitHub Actions:**
- Go to Actions tab in your repository
- Click on workflow run
- Download artifacts to see full JSON results

**Local:**
- Results saved to `tmp/deploy-validate-<timestamp>.json`
- Contains full details of each check

### Example Successful Output

```json
{
  "success": true,
  "checks": [
    { "name": "env-vars", "ok": true, "durationMs": 23 },
    { "name": "openai-embed", "ok": true, "durationMs": 420 },
    { "name": "openai-classify", "ok": true, "durationMs": 380 },
    { "name": "supabase-db", "ok": true, "durationMs": 156 },
    { "name": "supabase-auth", "ok": true, "durationMs": 234 },
    { "name": "supabase-storage", "ok": true, "durationMs": 890 }
  ],
  "timestamp": "2025-11-10T18:23:45.123Z"
}
```

## Best Practices

1. **Always run validation locally before pushing**
   ```bash
   node ./scripts/validate-deploy.js --predeploy --verbose
   ```

2. **Use Doppler for secret management** - Prevents secret drift between environments

3. **Monitor validation results** - Check GitHub Actions artifacts periodically

4. **Rotate secrets regularly** - Update CRON_SECRET and API keys quarterly

5. **Test in staging first** - Validate changes in staging environment before production

6. **Review failed validations immediately** - Don't merge PRs with failed validation

## Documentation

- [Full Documentation](/apps/app/docs/deploy-validation.md)
- [Script README](/scripts/README.md)
- [CHANGELOG](/apps/app/CHANGELOG.md)

## Support

For issues:
1. Check this guide and documentation
2. Review validation logs
3. Check service status pages (OpenAI, Supabase)
4. Contact Klutr engineering team

---

**Setup Version:** 1.0.0  
**Last Updated:** 2025-11-10
