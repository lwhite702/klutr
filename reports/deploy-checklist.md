# Deployment Checklist

**Date:** 2025-11-11  
**Version:** 1.0.0 (Production Ready)

This checklist ensures all production-readiness requirements are met before deploying to production.

---

## Pre-Deployment Checklist

### Infrastructure

- [x] Doppler project created with production config
- [ ] All secrets added to Doppler production environment
- [ ] Supabase project created
- [ ] Supabase Auth enabled and configured
- [ ] Supabase Storage bucket created (`user-uploads`)
- [ ] Database created (Neon or Supabase)
- [ ] pgvector extension enabled
- [ ] OpenAI API key with usage limits set
- [ ] PostHog project created
- [ ] Rollbar project created
- [ ] Vercel project linked
- [ ] Vercel-Doppler integration configured
- [ ] Custom domain configured (if applicable)

### Database

- [ ] Prisma schema pushed: `pnpm db:push`
- [ ] RLS policies applied: `psql < scripts/apply-rls-policies.sql`
- [ ] Vector indexes created: `psql < scripts/setup-database.sql`
- [ ] Test user created in Supabase Auth
- [ ] RLS policies tested with test user
- [ ] Database backups configured

### Environment Variables

#### Required (Production)

- [ ] `NEON_DATABASE_URL` - Database connection string
- [ ] `SUPABASE_URL` - Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public Supabase key
- [ ] `OPENAI_API_KEY` - OpenAI API key
- [ ] `CRON_SECRET` - Secret for cron job auth
- [ ] `POSTHOG_API_KEY` - PostHog API key
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` - Public PostHog key
- [ ] `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL

#### Optional (Recommended)

- [ ] `ROLLBAR_ACCESS_TOKEN` - Error monitoring
- [ ] `NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN` - Client error monitoring
- [ ] `VERCEL_TOKEN` - Vercel API access
- [ ] `ANTHROPIC_API_KEY` - Alternative AI provider

### Code Quality

- [x] All linter warnings resolved: `pnpm lint`
- [x] TypeScript compilation clean: `pnpm tsc --noEmit`
- [x] Build succeeds: `pnpm build`
- [ ] No console.log statements in production code
- [ ] No TODO comments marked as blocking
- [ ] No hardcoded secrets or credentials
- [ ] All environment variables documented

### Security

- [x] RLS policies enabled on all user data tables
- [x] Authentication middleware protecting routes
- [x] CRON_SECRET validation on all cron endpoints
- [x] No stub/mock data in authentication
- [x] Security headers configured in `vercel.json`
- [ ] Supabase redirect URLs configured
- [ ] Rate limiting enabled
- [ ] Input validation on all API endpoints

### Testing

- [x] Playwright E2E tests created
- [ ] E2E tests passing: `pnpm test:e2e`
- [ ] Accessibility tests passing: `pnpm test:accessibility`
- [ ] Manual smoke test on preview deployment
- [ ] Auth flow tested end-to-end
- [ ] File upload tested (when implemented)
- [ ] Background jobs tested manually

### CI/CD

- [x] GitHub Actions workflows created
- [ ] CI passing on main branch
- [ ] All required secrets added to GitHub:
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
  - [ ] `DOPPLER_TOKEN`
- [ ] Deployment workflow tested on preview
- [ ] Rollback procedure documented

### Monitoring

- [ ] Health check endpoint accessible: `/api/health`
- [ ] Vercel Analytics enabled
- [ ] PostHog tracking verified
- [ ] Rollbar error monitoring active
- [ ] Cost alerts set up:
  - [ ] OpenAI usage alert ($50/day)
  - [ ] Vercel alert (if applicable)
- [ ] Uptime monitoring configured (optional)

### Documentation

- [x] README.md up to date
- [x] Architecture documented in `docs/architecture.md`
- [x] Operations runbook in `docs/operations.md`
- [x] RLS policies documented in `docs/security/rls.md`
- [x] Database indexes documented in `docs/database/indexes.md`
- [x] Infrastructure guide in `infra/README.md`
- [x] Feature state report generated
- [x] AI cost estimates documented
- [ ] Customer-facing docs in Mintlify (if applicable)

---

## Deployment Steps

### 1. Pre-Deploy Verification

```bash
# Verify build works
pnpm install
pnpm build

# Run type check
pnpm tsc --noEmit

# Run tests
pnpm test:e2e

# Check for secrets in code
git secrets --scan || trufflehog git file://. --only-verified
```

### 2. Deploy to Vercel

**Option A: Automatic (Recommended)**
```bash
# Push to main branch
git push origin main

# Monitor deployment in Vercel dashboard
# Wait for deployment to complete
```

**Option B: Manual**
```bash
# Deploy via Vercel CLI
vercel --prod

# Note the deployment URL
```

### 3. Post-Deploy Verification

```bash
# Get deployment URL
DEPLOY_URL="https://klutr.app" # or your deployment URL

# 1. Health check
curl -f $DEPLOY_URL/api/health || echo "FAILED: Health check"

# 2. Homepage loads
curl -f $DEPLOY_URL || echo "FAILED: Homepage"

# 3. Login page loads
curl -f $DEPLOY_URL/login || echo "FAILED: Login page"

# 4. Test authentication (manual)
# - Open $DEPLOY_URL/login in browser
# - Sign up with test email
# - Verify email confirmation
# - Sign in
# - Verify redirect to /app

# 5. Test API endpoint (requires auth)
# - Create a note via UI
# - Verify note appears
# - Check database for note
```

### 4. Smoke Tests

Manual tests to perform after deployment:

- [ ] Homepage loads
- [ ] Login page loads
- [ ] Signup flow works
- [ ] Email confirmation sent
- [ ] Login with credentials works
- [ ] Magic link login works
- [ ] App dashboard loads
- [ ] Create a text note
- [ ] Note appears in list
- [ ] Search works
- [ ] User settings accessible
- [ ] Logout works
- [ ] Protected routes redirect to login

### 5. Background Jobs

Test cron jobs (if enabled):

```bash
# Manually trigger jobs to verify they work
curl -X GET $DEPLOY_URL/api/cron/nightly-cluster \
  -H "Authorization: Bearer $CRON_SECRET"

curl -X GET $DEPLOY_URL/api/cron/nightly-stacks \
  -H "Authorization: Bearer $CRON_SECRET"

curl -X GET $DEPLOY_URL/api/cron/weekly-insights \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## Post-Deployment

### Immediate (Within 1 hour)

- [ ] Monitor error rates in Rollbar
- [ ] Check Vercel deployment logs
- [ ] Verify no spike in costs (OpenAI dashboard)
- [ ] Test critical user flows
- [ ] Announce deployment to team

### Within 24 Hours

- [ ] Monitor user signups
- [ ] Check for any 5xx errors
- [ ] Verify background jobs ran
- [ ] Review PostHog events
- [ ] Check database growth

### Within 1 Week

- [ ] Review all metrics
- [ ] Analyze user behavior
- [ ] Check for slow queries
- [ ] Review AI costs
- [ ] Create post-deployment report

---

## Rollback Procedure

If issues are found:

1. **Immediate Rollback (Vercel)**
   - Go to Vercel dashboard
   - Find previous working deployment
   - Click "Promote to Production"

2. **Code Rollback (Git)**
   ```bash
   # Revert the problematic commit
   git revert HEAD
   git push origin main
   ```

3. **Database Rollback (if needed)**
   ```bash
   # Restore from backup (Neon/Supabase)
   # See docs/operations.md for full procedure
   ```

4. **Communication**
   - Notify team of rollback
   - Document issue in incident report
   - Create bug ticket
   - Schedule fix deployment

---

## Known Limitations (OK for v1.0)

These features are not fully implemented but don't block production:

- [ ] File uploads (schema ready, implementation pending)
- [ ] Vault encryption (schema ready, implementation pending)
- [ ] Audio transcription (marked as TODO)
- [ ] Thread similarity matching (marked as TODO)
- [ ] Some Smart Stacks UI components (marked as stub)
- [ ] Comprehensive E2E test coverage (basic tests present)

These will be addressed in post-launch sprints.

---

## Success Criteria

Deployment is successful when:

- ✅ All critical checklist items completed
- ✅ Health check returns 200 OK
- ✅ Users can sign up and log in
- ✅ Users can create and view notes
- ✅ No critical errors in Rollbar (first hour)
- ✅ No unexpected cost spikes
- ✅ Background jobs run successfully
- ✅ Rollback procedure tested and documented

---

## Deployment Sign-Off

**Deployed by:** ___________________________  
**Date/Time:** ___________________________  
**Deployment URL:** ___________________________  
**Git Commit:** ___________________________  

**Sign-off:**
- [ ] Technical Lead
- [ ] DevOps Engineer  
- [ ] Product Manager

---

*Last updated: 2025-11-11*
