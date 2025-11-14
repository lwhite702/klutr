# Klutr Operations Runbook

**Last Updated:** 2025-11-11

This document provides operational procedures for Klutr, including deployment, monitoring, troubleshooting, and maintenance tasks.

---

## Table of Contents

1. [Deployment](#deployment)
2. [Monitoring](#monitoring)
3. [Troubleshooting](#troubleshooting)
4. [Maintenance Tasks](#maintenance-tasks)
5. [Incident Response](#incident-response)
6. [Backup and Recovery](#backup-and-recovery)

---

## Deployment

### Production Deployment

**Automatic (Recommended):**
```bash
# Push to main branch
git push origin main

# GitHub Actions will:
# 1. Run CI tests
# 2. Build application
# 3. Deploy to Vercel
# 4. Run smoke tests
```

**Manual:**
```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Preview Deployment

Every PR automatically creates a preview deployment:
1. Open PR on GitHub
2. Wait for Vercel bot to comment with preview URL
3. Test preview deployment
4. Merge when ready

### Rollback

**Option 1: Vercel Dashboard**
1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous working deployment
4. Click "Promote to Production"

**Option 2: Revert commit**
```bash
# Revert the bad commit
git revert <commit-sha>
git push origin main

# Auto-deploys reverted version
```

### Environment Variables

**Update via Doppler:**
```bash
# Add/update secret
doppler secrets set KEY=value --project klutr --config production

# Verify
doppler secrets get KEY --project klutr --config production

# Redeploy to apply changes
vercel --prod
```

**Update via Vercel:**
```bash
# Set environment variable
vercel env add KEY production

# Redeploy
vercel --prod
```

---

## Monitoring

### Health Checks

**Endpoint:**
```bash
curl https://klutr.app/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "supabase": "connected",
  "openai": "configured"
}
```

**Alerts:**
- Health check fails → Page on-call engineer
- Response time > 500ms → Warning
- Response time > 1000ms → Critical

### Dashboard URLs

- **Vercel Analytics:** https://vercel.com/klutr/analytics
- **Supabase Dashboard:** https://supabase.com/dashboard/project/[PROJECT_ID]
- **PostHog:** https://app.posthog.com/
- **Rollbar:** https://rollbar.com/klutr/
- **Neon Console:** https://console.neon.tech/

### Key Metrics to Monitor

**Application:**
- Request rate (req/s)
- Response time (p50, p95, p99)
- Error rate (%)
- Deployment frequency

**Database:**
- Active connections
- Query time (p95)
- Database size
- Index hit rate (should be > 95%)

**AI:**
- API requests per day
- Cost per day
- Error rate
- Average latency

**Auth:**
- Sign-ups per day
- Active users
- Failed login attempts

### Alerts Configuration

**Critical (Page immediately):**
- Health check down for > 2 minutes
- Error rate > 5% for > 5 minutes
- Database connection failure
- AI cost > $50/day

**Warning (Email):**
- Response time > 500ms for > 10 minutes
- Database connections > 80%
- AI error rate > 10%
- Failed background jobs

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Symptoms:**
```
Error: Can't reach database server
```

**Diagnosis:**
```bash
# Check database status
curl https://api.neon.tech/v2/projects/[PROJECT_ID] \
  -H "Authorization: Bearer $NEON_API_KEY"

# Test connection
psql $NEON_DATABASE_URL -c "SELECT 1"
```

**Resolution:**
1. Check Neon dashboard for outages
2. Verify `NEON_DATABASE_URL` is correct
3. Check Prisma connection pool settings
4. Restart Vercel deployment

#### 2. Authentication Failures

**Symptoms:**
- Users can't log in
- 401 Unauthorized errors
- Redirect loops

**Diagnosis:**
```bash
# Check Supabase status
curl https://[PROJECT_REF].supabase.co/auth/v1/health

# Verify environment variables
doppler secrets get NEXT_PUBLIC_SUPABASE_URL --config production
doppler secrets get NEXT_PUBLIC_SUPABASE_ANON_KEY --config production
```

**Resolution:**
1. Verify Supabase project is active
2. Check redirect URLs in Supabase dashboard
3. Verify JWT secret is correct
4. Clear user cookies and retry

#### 3. High AI Costs

**Symptoms:**
- OpenAI bill > $100/day
- Cost alerts firing

**Diagnosis:**
```bash
# Check OpenAI usage
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check feature flag status
curl https://klutr.app/api/debug/flags
```

**Resolution:**
1. Enable kill switch: Set `klutr-global-disable` flag to `true`
2. Check for runaway loops in background jobs
3. Verify rate limiting is working
4. Review recent code changes
5. Set OpenAI usage limits in dashboard

#### 4. Background Jobs Not Running

**Symptoms:**
- Clustering not updating
- Insights not generating
- Stacks not being created

**Diagnosis:**
```bash
# Check cron job logs in Vercel
vercel logs --follow

# Manually trigger job
curl -X GET https://klutr.app/api/cron/nightly-cluster \
  -H "Authorization: Bearer $CRON_SECRET"
```

**Resolution:**
1. Verify `CRON_SECRET` is set correctly
2. Check Vercel cron configuration
3. Review job logs for errors
4. Manually trigger job to test
5. Check database for recent job runs

#### 5. Slow Query Performance

**Symptoms:**
- Pages loading slowly
- Database timeout errors
- High CPU usage

**Diagnosis:**
```sql
-- Find slow queries
SELECT
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check for missing indexes
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct < 0.1;
```

**Resolution:**
1. Add missing indexes
2. Optimize queries
3. Increase connection pool size
4. Consider read replicas

---

## Maintenance Tasks

### Daily

- [ ] Check health endpoint
- [ ] Review error rates in Rollbar
- [ ] Check AI cost for anomalies

### Weekly

- [ ] Review Vercel analytics
- [ ] Check database growth
- [ ] Review slow queries
- [ ] Check for unused indexes
- [ ] Review feature flag usage

### Monthly

- [ ] Audit user permissions
- [ ] Review and rotate API keys
- [ ] Check for dependency updates
- [ ] Review and archive old data
- [ ] Test backup restoration
- [ ] Review cost optimization opportunities

### Quarterly

- [ ] Security audit
- [ ] Performance review
- [ ] Capacity planning
- [ ] Disaster recovery drill
- [ ] Update runbooks
- [ ] Review and update RLS policies

---

## Database Maintenance

### Reindex

```sql
-- Reindex all tables (during low-traffic period)
REINDEX DATABASE klutr;

-- Reindex specific table
REINDEX TABLE notes;

-- Reindex vector indexes
REINDEX INDEX notes_embedding_idx;
REINDEX INDEX messages_embedding_idx;
```

### Vacuum

```sql
-- Analyze all tables
ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE notes;

-- Full vacuum (reclaims space)
VACUUM FULL notes;
```

### Update Statistics

```sql
-- Update query planner statistics
ANALYZE notes;
ANALYZE messages;
```

### Check Index Usage

```sql
-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Incident Response

### Severity Levels

**P0 (Critical):**
- Site down
- Data breach
- Complete service unavailable

**P1 (High):**
- Major feature broken
- High error rate
- Performance degradation

**P2 (Medium):**
- Minor feature broken
- Intermittent issues
- Non-critical bug

**P3 (Low):**
- Cosmetic issues
- Feature requests
- Nice-to-have fixes

### Incident Response Process

1. **Detect**
   - Alert fires or user reports issue
   - On-call engineer notified

2. **Assess**
   - Determine severity
   - Check monitoring dashboards
   - Gather initial information

3. **Respond**
   - Follow runbook procedures
   - Communicate status to team
   - Implement workaround if needed

4. **Resolve**
   - Deploy fix
   - Verify resolution
   - Update status page

5. **Post-Mortem**
   - Write incident report
   - Document lessons learned
   - Create action items

### Communication Template

```
INCIDENT: [Title]
STATUS: [Investigating/Identified/Monitoring/Resolved]
SEVERITY: [P0/P1/P2/P3]
START TIME: [ISO timestamp]
AFFECTED: [What's impacted]

UPDATES:
- [Timestamp] [Update message]
- [Timestamp] [Update message]

ROOT CAUSE: [After resolution]
RESOLUTION: [How it was fixed]
PREVENTION: [Action items]
```

---

## Backup and Recovery

### Database Backups

**Neon:**
- Automatic daily backups (7-day retention)
- Point-in-time recovery available

**Manual Backup:**
```bash
# Export database
pg_dump $NEON_DATABASE_URL > backup-$(date +%Y%m%d).sql

# Compress
gzip backup-$(date +%Y%m%d).sql

# Upload to S3 (if configured)
aws s3 cp backup-$(date +%Y%m%d).sql.gz s3://klutr-backups/
```

**Restore:**
```bash
# Download backup
aws s3 cp s3://klutr-backups/backup-20251111.sql.gz .

# Decompress
gunzip backup-20251111.sql.gz

# Restore
psql $NEON_DATABASE_URL < backup-20251111.sql
```

### File Storage Backups

Supabase Storage does not have automatic backups. Consider:
1. Periodic exports to S3
2. Versioning enabled on bucket
3. Documented restore procedure

### Code Backups

- GitHub is source of truth
- All commits backed up
- Tags for major releases

---

## Emergency Contacts

**On-Call Engineer:** [Setup PagerDuty/OpsGenie]

**Service Contacts:**
- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.com
- Neon Support: support@neon.tech
- OpenAI Support: support@openai.com

---

## Runbook Maintenance

This runbook should be updated:
- After every incident
- When procedures change
- During quarterly reviews
- When new features are deployed

Last reviewed: 2025-11-11  
Next review: 2025-02-11

---

*Last updated: 2025-11-11*
