# Vercel Deployment Setup Guide

This guide walks through deploying the Noteornope app to Vercel and configuring all required environment variables.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you haven't already
2. **Vercel CLI**: Install globally if not already installed:
   ```bash
   npm i -g vercel
   ```
3. **Doppler CLI**: Ensure you have Doppler CLI installed and authenticated (see `DOPPLER.md`)

## Step 1: Link Project to Vercel

From the project root:

```bash
vercel link
```

When prompted:
- **Which scope?** → Select your organization (e.g., "Wrelik")
- **Link to existing project?** → Yes
- **What's the name of your existing project?** → `klutr`

This creates `.vercel/project.json` and `.vercel/.gitignore`.

## Step 2: Sync Environment Variables from Doppler to Vercel

### Option A: Manual Sync (Recommended for first-time setup)

1. **Get variables from Doppler:**
   ```bash
   doppler secrets download --no-file --format env
   ```

2. **For each variable, add to Vercel:**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add DATABASE_URL preview
   vercel env add DATABASE_URL development
   
   vercel env add OPENAI_API_KEY production
   vercel env add OPENAI_API_KEY preview
   vercel env add OPENAI_API_KEY development
   
   vercel env add CRON_SECRET production
   vercel env add CRON_SECRET preview
   vercel env add CRON_SECRET development
   ```

### Option B: Bulk Import (Advanced)

If you have a `.env` file from Doppler, you can use the Vercel dashboard:
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Upload `.env` file or add variables individually

## Step 3: Verify Required Variables

Required environment variables:

| Variable | Description | Required For |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) | Database connection |
| `OPENAI_API_KEY` | OpenAI API key | AI features (clustering, insights) |
| `CRON_SECRET` | Secret for cron endpoint auth | Cron job security |

Verify all are set:
```bash
vercel env ls
```

## Step 4: Cron Jobs (Handled by Supabase)

**Note:** All cron jobs are handled by Supabase Edge Functions with pg_cron scheduling. No Vercel cron configuration is needed.

Cron jobs are configured via Supabase:
- **Edge Functions**: Located in `/supabase/functions/` (nightly-cluster, nightly-stacks, weekly-insights)
- **Scheduling**: Configured via pg_cron extension in Supabase (see `supabase/migrations/005_cron_jobs.sql`)
- **Documentation**: See `docs/cron.md` for complete details

The API routes under `/app/api/cron/` remain available for manual testing/debugging but are not scheduled by Vercel.

## Step 5: Test Local Production Build

Before deploying, test the production build locally:

```bash
# Build the app
npm run build

# Start production server
npm start
```

Verify:
- App builds without errors
- Prisma client is generated (via `postinstall` script)
- Database connection works (if `DATABASE_URL` is set locally)
- No TypeScript errors (we removed `ignoreBuildErrors`)

## Step 6: Deploy to Vercel

### Preview Deployment

```bash
vercel
```

This creates a preview deployment. Visit the provided URL to test.

### Production Deployment

```bash
vercel --prod
```

This deploys to your production domain.

## Step 7: Verify Deployment

### Health Check

Test the health endpoint:
```bash
curl https://your-project.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T...",
  "environment": "production"
}
```

### Cron Endpoints (Manual Testing Only)

The cron API routes are available for manual testing but are not scheduled by Vercel. All automated scheduling is handled by Supabase Edge Functions.

To manually test a cron endpoint (replace `YOUR_CRON_SECRET`):
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-project.vercel.app/api/cron/nightly-cluster
```

Should return `{ error: "Unauthorized" }` if secret is wrong, or job results if correct.

**Note:** For production cron jobs, use Supabase Edge Functions. See `docs/cron.md` for details.

## Step 8: Monitor Builds

Check deployment status:
```bash
vercel ls
```

View logs:
```bash
vercel logs
```

## Troubleshooting

### Build Fails with "Prisma Client not generated"

**Solution:** The `postinstall` script should generate Prisma client automatically. If not:
```bash
npm run postinstall
```

### Environment Variables Not Found

**Solution:** Ensure variables are set for the correct environment:
```bash
vercel env ls
```

Add missing variables:
```bash
vercel env add VARIABLE_NAME production
```

### Cron Jobs Return 401 Unauthorized

**Solution:** 
1. Verify `CRON_SECRET` is set in Vercel environment variables (for manual testing only)
2. Check that cron requests include the header: `Authorization: Bearer ${CRON_SECRET}`
3. **Note:** Production cron jobs are handled by Supabase Edge Functions, not Vercel. See `docs/cron.md` for Supabase cron configuration.

### Database Connection Fails

**Solution:**
1. Verify `DATABASE_URL` is set correctly
2. Check Supabase database allows connections from Vercel IPs (usually open by default)
3. Test connection string locally:
   ```bash
   doppler run -- npx prisma db push
   ```

## Next Steps

- [ ] Set up custom domain (if needed)
- [ ] Configure Vercel Analytics (if desired)
- [ ] Verify Supabase cron jobs are configured (see `docs/cron.md`)
- [ ] Configure preview deployments for pull requests
- [ ] Set up monitoring and alerts

## References

- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Environment Variables**: https://vercel.com/docs/projects/environment-variables
- **Cron Jobs**: See `docs/cron.md` (handled by Supabase Edge Functions)
- **Doppler Integration**: See `DOPPLER.md`

