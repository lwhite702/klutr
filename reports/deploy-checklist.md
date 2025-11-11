# Deployment Checklist

**Generated:** 2025-01-27

## Pre-Deployment

### Infrastructure
- [ ] Supabase project created and configured
- [ ] pgvector extension enabled
- [ ] Storage buckets created (`stream-files`, `vault-encrypted`)
- [ ] RLS policies applied to all tables
- [ ] Auth redirect URLs configured

### Secrets Management
- [ ] Doppler project created
- [ ] All secrets added to Doppler
- [ ] Production config created in Doppler
- [ ] Vercel-Doppler integration configured

### Database
- [ ] Database migrated to Supabase
- [ ] Prisma migrations applied
- [ ] Test data seeded (if needed)
- [ ] Database indexes verified

### Code
- [ ] All mock data removed from runtime
- [ ] AI abstraction layer using Vercel AI SDK
- [ ] Health check endpoint updated
- [ ] Error handling implemented
- [ ] Logging configured

## Deployment

### Vercel
- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Build settings verified
- [ ] Domain configured
- [ ] SSL certificate verified

### Cron Jobs
- [ ] Cron jobs configured in Vercel
- [ ] `CRON_SECRET` set
- [ ] Authorization headers configured
- [ ] Schedule verified

### PostHog
- [ ] PostHog project created
- [ ] Feature flags configured
- [ ] API keys added to environment
- [ ] Event tracking verified

## Post-Deployment

### Verification
- [ ] Health endpoint returns `ok` status
- [ ] Database connectivity verified
- [ ] Supabase Auth working
- [ ] Supabase Storage accessible
- [ ] AI provider accessible

### Testing
- [ ] User signup flow tested
- [ ] User login flow tested
- [ ] Note creation tested
- [ ] File upload tested
- [ ] Vault encryption/decryption tested
- [ ] Search functionality tested
- [ ] Embedding generation tested

### Monitoring
- [ ] Error monitoring configured (Sentry/Rollbar)
- [ ] Performance monitoring enabled
- [ ] Cost alerts configured
- [ ] Usage tracking enabled

## Rollback Plan

If deployment fails:
1. Revert to previous Vercel deployment
2. Check health endpoint for issues
3. Review Vercel logs
4. Check Supabase logs
5. Verify environment variables

## Success Criteria

- [ ] Health endpoint returns `ok` for all checks
- [ ] No errors in Vercel logs
- [ ] No errors in Supabase logs
- [ ] Users can sign up and log in
- [ ] Core features working (notes, search, vault)
- [ ] AI features working (embeddings, classification)
- [ ] File uploads working
- [ ] Cron jobs executing successfully

## Known Issues

- Database migration from Neon to Supabase incomplete
- Some UI components still use mock data
- RLS policies need to be created and tested
- CI/CD pipeline not yet configured

## Next Steps

1. Complete database migration
2. Replace remaining mock data
3. Create and test RLS policies
4. Set up CI/CD pipeline
5. Add comprehensive E2E tests
