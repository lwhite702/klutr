# Deployment Checklist for Klutr MVP

Use this checklist to deploy the Klutr app with Supabase backend.

## Pre-Deployment

### 1. Supabase Setup
- [ ] Create Supabase project at https://supabase.com
- [ ] Run all 4 SQL migrations in order (001-004)
- [ ] Verify tables exist in Table Editor
- [ ] Check storage bucket "files" is created
- [ ] Test database connection locally

### 2. Environment Variables
Configure these in your deployment platform (Vercel/Netlify):

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
OPENAI_API_KEY=[your-openai-key]

# Optional but recommended
CRON_SECRET=[random-secret-for-cron-jobs]
```

### 3. Code Verification
- [ ] All dependencies installed (`pnpm install`)
- [ ] TypeScript compiles without errors
- [ ] No console errors in development
- [ ] All API routes respond correctly

## Local Testing

### Core Features
- [ ] **Create Note**: Quick capture works, AI classifies
- [ ] **List Notes**: All notes appear correctly
- [ ] **Update Note**: Edits save successfully
- [ ] **Delete/Archive**: Notes move to Nope section
- [ ] **Tags**: Auto-tagging works via AI

### Advanced Features
- [ ] **Smart Stacks**: AI generates note collections
- [ ] **Clustering**: Notes group by similarity
- [ ] **Weekly Insights**: Summary generation works
- [ ] **Memory Lane**: Timeline view displays
- [ ] **Vault**: Encrypted notes save/load correctly

### API Endpoints
Test each endpoint manually or with curl:

```bash
# Create note
curl -X POST http://localhost:3000/api/notes/create \
  -H "Content-Type: application/json" \
  -d '{"content":"Test note","type":"misc"}'

# List notes
curl http://localhost:3000/api/notes/list

# List stacks
curl http://localhost:3000/api/stacks/list

# Generate insights
curl -X POST http://localhost:3000/api/insights/generate
```

## Deployment Steps

### Option A: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push code to GitHub
   git add .
   git commit -m "Migrate to Supabase backend"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import project from GitHub
   - Add environment variables (see above)
   - Deploy

3. **Post-Deployment Checks**
   - [ ] Visit deployed URL
   - [ ] Create a test note
   - [ ] Verify it appears in database
   - [ ] Check browser console for errors

### Option B: Other Platforms

**Netlify**:
- Build command: `pnpm build`
- Publish directory: `.next`
- Add environment variables in Netlify dashboard

**Railway/Fly.io**:
- Use Dockerfile if needed
- Set environment variables
- Deploy via CLI

## Post-Deployment

### 1. Verify Functionality
- [ ] Homepage loads correctly
- [ ] Create note works
- [ ] AI classification runs
- [ ] Notes persist in database
- [ ] Stacks generate correctly
- [ ] Vault encryption works

### 2. Monitor Logs
Check for errors in:
- [ ] Vercel/Netlify deployment logs
- [ ] Supabase logs (Dashboard > Logs)
- [ ] Browser console (no errors)

### 3. Performance Check
- [ ] Page load time < 3 seconds
- [ ] API responses < 1 second
- [ ] No memory leaks
- [ ] Database queries efficient

### 4. Setup Cron Jobs (Optional)

**If using Vercel Cron**:
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/nightly-cluster",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/nightly-stacks",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/weekly-insights",
      "schedule": "0 0 * * 1"
    }
  ]
}
```

**If using Supabase Edge Functions**:
- Convert cron routes to Edge Functions
- Set up pg_cron in Supabase
- Test cron execution

## Security Hardening (Before Production)

### Current State: MVP Demo Mode
- ⚠️ All endpoints open (no auth)
- ⚠️ Single demo user
- ⚠️ RLS policies permissive

### Production Hardening Steps
1. **Enable Supabase Auth**
   - Uncomment auth code in `/lib/auth.ts`
   - Update RLS policies to check `auth.uid()`
   - Add signup/login flows
   - Test user isolation

2. **Update RLS Policies**
   ```sql
   -- Replace permissive policies with strict ones
   DROP POLICY IF EXISTS "Allow all operations on notes for now" ON notes;
   
   CREATE POLICY "Users can only access own notes"
   ON notes FOR ALL
   USING (auth.uid()::text = user_id);
   ```

3. **Add Rate Limiting**
   - Review `/lib/validation/middleware.ts`
   - Adjust rate limits as needed
   - Enable Redis for distributed rate limiting

4. **Security Headers**
   - Add CSP headers
   - Enable CORS restrictions
   - Add security headers middleware

## Monitoring Setup

### Supabase Dashboard
- [ ] Set up email alerts for errors
- [ ] Monitor database size
- [ ] Track API usage
- [ ] Review slow queries

### Application Monitoring
- [ ] Add Sentry/LogRocket for error tracking
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Enable analytics (optional)

## Rollback Plan

If deployment fails:

1. **Quick Rollback**
   - Revert to previous Vercel deployment
   - Or: `git revert HEAD && git push`

2. **Database Rollback**
   - Supabase keeps automatic backups
   - Restore from backup if needed

3. **Switch to Maintenance Mode**
   - Deploy maintenance page
   - Fix issues in staging
   - Re-deploy when ready

## Success Criteria

Deployment is successful when:
- [ ] App loads without errors
- [ ] Users can create and view notes
- [ ] AI classification works
- [ ] Database queries succeed
- [ ] No console errors
- [ ] Performance is acceptable (< 3s load time)
- [ ] All core features work end-to-end

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Docs**: See `/docs` folder

## Troubleshooting Common Issues

### Issue: "Database connection failed"
- **Fix**: Check environment variables are set correctly
- **Check**: Supabase project is not paused

### Issue: "OpenAI API errors"
- **Fix**: Verify OPENAI_API_KEY is set
- **Check**: OpenAI account has credits

### Issue: "RLS policy blocks query"
- **Fix**: Check policies allow anon access for MVP
- **Check**: Service role key is used for server operations

### Issue: "File uploads fail"
- **Fix**: Verify storage bucket exists
- **Check**: Bucket policies allow uploads
- **Check**: MIME types are whitelisted

---

**Ready to Deploy?** Start with Section 1: Pre-Deployment

**Questions?** Review MIGRATION_COMPLETE.md for more details
