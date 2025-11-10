# Klutr Deployment Validation Scripts

This directory contains scripts for validating OpenAI and Supabase connectivity before and after deployments.

## Quick Start

### Local Pre-Deploy Validation

```bash
# Using Doppler (recommended)
doppler run -- node ./scripts/validate-deploy.js --predeploy --verbose

# Using local .env file
node ./scripts/validate-deploy.js --predeploy --verbose

# Using shell wrapper
./scripts/validate-deploy.sh --predeploy --verbose
```

### Post-Deploy Validation

```bash
# Validate deployed application
node ./scripts/validate-deploy.js --postdeploy --url https://klutr.app --verbose
```

## Scripts

### `validate-deploy.js`

Main validation script that performs comprehensive checks:
- Environment variables validation
- OpenAI API connectivity (embeddings + chat completion)
- Supabase database, auth, and storage
- CRON secret validation
- Application health check

**Features:**
- Automatic retries (3 attempts with exponential backoff)
- Timeouts (10 seconds per check)
- Token masking for security
- Structured JSON output
- Audit trail in `tmp/` directory

### `validate-deploy.sh`

Shell wrapper for `validate-deploy.js`. Provides:
- Simple shell integration
- Exit code propagation
- Path handling

## Required Environment Variables

```bash
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CRON_SECRET=...
```

For post-deploy checks, also configure:
```bash
NEXT_PUBLIC_APP_URL=https://klutr.app
```

## Exit Codes

- `0` - All checks passed ✓
- `1` - One or more checks failed ✗
- `2` - Invalid usage or missing required env vars

## Output

Results are saved to `tmp/deploy-validate-<timestamp>.json`:

```json
{
  "success": true,
  "checks": [
    { "name": "env-vars", "ok": true, "durationMs": 23 },
    { "name": "openai-embed", "ok": true, "durationMs": 420 },
    ...
  ],
  "timestamp": "2025-11-10T18:23:45.123Z"
}
```

## CI/CD Integration

### GitHub Actions

See `.github/workflows/ci.yml` for pre-deploy validation setup.

### Vercel

Post-deploy validation can be triggered via:
1. GitHub Action on `deployment_status` event
2. Vercel Deploy Hook + external trigger
3. Manual execution after deploy

## Troubleshooting

See `/apps/app/docs/deploy-validation.md` for comprehensive troubleshooting guide.

### Common Issues

**Timeout errors:**
- Check network connectivity
- Verify service status (OpenAI/Supabase)
- Consider increasing timeout if needed

**OpenAI quota exceeded:**
- Check account billing and usage
- Wait for quota reset

**Supabase storage fails:**
- Create `test-bucket` in Supabase dashboard
- Configure bucket policies for service role access

**CRON secret mismatch:**
- Verify secret matches across all environments
- Regenerate and update if needed

## Development

### Adding New Checks

1. Add check function in `validate-deploy.js`:
```javascript
async function checkNewService() {
  const startTime = Date.now();
  try {
    // ... test logic
    recordCheck('new-service', true, Date.now() - startTime);
    return true;
  } catch (error) {
    recordCheck('new-service', false, Date.now() - startTime, error.message, 'Fix instructions');
    return false;
  }
}
```

2. Call in `main()` function
3. Update documentation
4. Test locally before committing

### Testing

```bash
# Test with verbose logging
node ./scripts/validate-deploy.js --predeploy --verbose

# Verify exit codes
echo $?  # Should be 0 for success, 1 for failure
```

## Documentation

- [Full Documentation](/apps/app/docs/deploy-validation.md)
- [CHANGELOG](/apps/app/CHANGELOG.md)

## Support

For issues or questions, contact the Klutr engineering team.
