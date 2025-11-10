# Quick Start: Deployment Validation

**Ready in 3 minutes** ⏱️

## 1. Setup Environment (1 min)

```bash
# Copy environment template
cp .env.example .env

# Edit and add your secrets
nano .env
```

**Required secrets:**
```bash
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://....supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CRON_SECRET=... # Generate with: openssl rand -base64 32
```

## 2. Test Locally (1 min)

```bash
# Run validation
node ./scripts/validate-deploy.js --predeploy --verbose

# Should see: ✓ All validation checks passed!
```

## 3. Configure CI (1 min)

Add secrets to GitHub:

**Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

Or just add `DOPPLER_TOKEN` if using Doppler.

## 4. Push to Test

```bash
git add .
git commit -m "Add deployment validation"
git push
```

Check **Actions** tab in GitHub to see validation running! ✅

---

## What Gets Validated?

✅ Environment variables configured  
✅ OpenAI API working (embeddings + chat)  
✅ Supabase database connected  
✅ Supabase Auth working  
✅ Supabase Storage accessible  
✅ CRON secrets valid  
✅ App health check passing  

## Need Help?

- **Setup Issues:** See `/DEPLOYMENT_VALIDATION_SETUP.md`
- **Troubleshooting:** See `/apps/app/docs/deploy-validation.md`
- **Script Help:** See `/scripts/README.md`
- **Implementation Details:** See `/VALIDATION_IMPLEMENTATION_SUMMARY.md`

## Next Steps

1. ✅ Test locally (you should do this now!)
2. ✅ Add GitHub secrets
3. ✅ Push to trigger CI
4. 🔲 Create Supabase storage bucket (see setup guide)
5. 🔲 Configure Vercel environment variables
6. 🔲 Optional: Enable post-deploy validation

**Time to first validation:** < 3 minutes  
**Time to full setup:** < 15 minutes

Happy deploying! 🚀
