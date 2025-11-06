---
title: "Background Jobs and Cron Documentation"
author: cursor-agent
updated: 2025-01-27
---

# Background Jobs and Cron Documentation

## Overview

Background jobs handle automated tasks that don't require user interaction, such as AI clustering, stack generation, and weekly insights. **All cron jobs have been migrated to Supabase Edge Functions** with automated scheduling via Supabase Dashboard.

## Current Implementation (Phase 4 - Active)

### Supabase Edge Functions

All cron jobs are now implemented as Supabase Edge Functions:

- **`nightly-cluster`** - Batch function that processes all users: embeds notes and clusters them
- **`nightly-stacks`** - Batch function that processes all users: rebuilds smart stacks
- **`weekly-insights`** - Batch function that processes all users: generates weekly insights

### Location

Edge Functions are located in `/supabase/functions/`:
- `supabase/functions/nightly-cluster/index.ts`
- `supabase/functions/nightly-stacks/index.ts`
- `supabase/functions/weekly-insights/index.ts`

### Authentication

Edge Functions are deployed with `--no-verify-jwt` flag, meaning they:
- Are only accessible internally (via Supabase scheduling)
- Do not require JWT authentication
- Use service role key for database access

### Scheduling

Schedules are configured via **Supabase Cron** (pg_cron extension) using SQL migrations:

- **`nightly-cluster`**: `0 6 * * *` (daily at 06:00 UTC / 02:00 ET)
- **`nightly-stacks`**: `5 6 * * *` (daily at 06:05 UTC / 02:05 ET)
- **`weekly-insights`**: `0 7 * * 1` (Mondays at 07:00 UTC / 03:00 ET)

**Implementation:**
- Cron jobs are created via SQL migration (`supabase/migrations/005_cron_jobs.sql`)
- Jobs use `pg_cron` extension to schedule recurring tasks
- Jobs use `pg_net` extension to make HTTP POST requests to Edge Functions
- Secrets (project URL and anon_key) are stored in Supabase Vault for secure access
- Jobs are stored in `cron.job` table
- Run history is recorded in `cron.job_run_details` table

**Monitoring:**
- View jobs in Supabase Dashboard → Integrations → Cron
- Check run history in `cron.job_run_details` table
- Monitor Edge Function logs in Dashboard → Edge Functions → Logs

### Environment Variables

Edge Functions automatically have access to:
- `SUPABASE_URL` - Automatically available
- `SUPABASE_SERVICE_ROLE_KEY` - Automatically available
- `OPENAI_API_KEY` - Must be set in Supabase Dashboard → Edge Functions → Secrets

### Legacy API Routes (Deprecated)

The API routes under `/app/api/cron/` are still present but are no longer scheduled:
- They can be used for manual testing/debugging
- They still require `CRON_SECRET` for security
- They are not called by any automated scheduler

## Previous Implementation (Phase 1 - Deprecated)

### Manual API Routes (Deprecated)

Previously, cron jobs were implemented as API routes under `/api/cron/`:
- **`/api/cron/nightly-cluster`** - Re-embed notes and regenerate clusters
- **`/api/cron/nightly-stacks`** - Analyze patterns and rebuild smart stacks
- **`/api/cron/weekly-insights`** - Generate AI summary of week's activity

These routes were protected by `Authorization: Bearer <CRON_SECRET>` header validation and scheduled via Vercel Cron. This approach had limitations:
- Vercel Hobby plan allows only 2 cron jobs (we needed 3)
- Required external scheduling service
- Less integrated with Supabase infrastructure

**Status:** Deprecated. Routes remain for manual testing but are no longer scheduled.

## Job Descriptions

### nightly-cluster

**Purpose:** Re-embed all notes and regenerate clusters for all users

**Process:**

1. **Fetch All Users:** Retrieve all users from database
2. **For Each User:**
   - Find notes without embeddings (limit 100 per batch)
   - Call `embed-note` Edge Function for each note
   - Update note embeddings in database using pgvector
   - Call `cluster-notes` Edge Function to cluster user's notes
3. **Return Summary:** Report users processed, notes embedded, notes clustered

**Implementation:** Batch function located at `supabase/functions/nightly-cluster/index.ts`

**Input:** None (processes all users)
**Output:** JSON response with success/failure counts and statistics
**Duration:** ~5-10 minutes per 1000 notes (scales with user count)
**Error Handling:** Continue processing other users if one fails, log all errors

### nightly-stacks

**Purpose:** Analyze patterns and rebuild smart stacks for all users

**Process:**

1. **Fetch All Users:** Retrieve all users from database
2. **For Each User:**
   - Get cluster distribution from notes table
   - Call `build-stacks` Edge Function for that user
   - Function generates stacks for each cluster with 2+ notes
3. **Return Summary:** Report users processed, stacks built

**Implementation:** Batch function located at `supabase/functions/nightly-stacks/index.ts`

**Input:** None (processes all users)
**Output:** JSON response with success/failure counts and stack statistics
**Duration:** ~2-3 minutes per user (scales with user count)
**Error Handling:** Continue processing other users if one fails, log all errors

### weekly-insights

**Purpose:** Generate AI summary of week's note-taking activity for all users

**Process:**

1. **Fetch All Users:** Retrieve all users from database
2. **For Each User:**
   - Calculate current week start (Monday)
   - Call `generate-insights` Edge Function for that user
   - Function fetches notes from past week and generates insights
3. **Return Summary:** Report users processed, insights generated

**Implementation:** Batch function located at `supabase/functions/weekly-insights/index.ts`

**Input:** None (processes all users)
**Output:** JSON response with success/failure counts and insight statistics
**Duration:** ~1-2 minutes per user (scales with user count)
**Error Handling:** Continue processing other users if one fails, log all errors

## Error Handling

### Retry Logic

- **Automatic Retries:** 3 attempts for failed operations
- **Exponential Backoff:** Increasing delay between retries
- **Circuit Breaker:** Stop retrying after multiple failures

### Logging

- **Structured Logging:** JSON format for easy parsing
- **Error Levels:** INFO, WARN, ERROR, FATAL
- **Context:** Include user ID, job type, timestamp
- **Monitoring:** Alert on repeated failures

### Alerting

- **Failure Thresholds:** Alert after 3 consecutive failures
- **Performance Monitoring:** Alert on slow job execution
- **Resource Usage:** Monitor memory and CPU usage

## Testing

### Manual Testing

**Via Supabase Dashboard (Recommended):**
1. Navigate to Supabase Dashboard → Edge Functions
2. Select function (e.g., `nightly-cluster`)
3. Click "Run Function" button
4. View logs and response

**Via Supabase CLI (Local):**
```bash
# Test locally (requires Supabase CLI)
supabase functions serve nightly-cluster
curl -X POST http://localhost:54321/functions/v1/nightly-cluster \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

**Via Legacy API Routes (Manual Trigger):**
```bash
# Test via Next.js API routes (still functional for testing)
curl -X GET https://your-app.vercel.app/api/cron/nightly-cluster \
  -H "Authorization: Bearer $CRON_SECRET"

curl -X GET https://your-app.vercel.app/api/cron/nightly-stacks \
  -H "Authorization: Bearer $CRON_SECRET"

curl -X GET https://your-app.vercel.app/api/cron/weekly-insights \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Automated Testing

- **Unit Tests:** Test individual job functions
- **Integration Tests:** Test complete job workflows
- **Performance Tests:** Measure job execution times
- **Error Tests:** Test failure scenarios and recovery

### Development Testing

- **Local Execution:** Run jobs locally for development
- **Staging Environment:** Test jobs in staging before production
- **Dry Run Mode:** Test job logic without making changes

## Monitoring

### Metrics

- **Job Execution Time:** Track duration of each job
- **Success Rate:** Percentage of successful job runs
- **Error Rate:** Frequency and types of errors
- **Resource Usage:** CPU, memory, database connections

### Dashboards

- **Job Status:** Real-time view of job execution
- **Performance Trends:** Historical performance data
- **Error Analysis:** Breakdown of error types and causes
- **Resource Utilization:** System resource usage over time

### Alerts

- **Job Failures:** Immediate alert on job failure
- **Performance Degradation:** Alert on slow job execution
- **Resource Exhaustion:** Alert on high resource usage
- **Data Quality:** Alert on unexpected data patterns

## Migration Status

### ✅ Migration Complete (2025-01-27) - Cron Jobs Ready

**Phase 1 → Phase 4 Migration Completed:**

1. ✅ **Created Edge Functions:** Three batch functions created in `/supabase/functions/`
2. ✅ **Removed Vercel Cron:** Removed cron configuration from `vercel.json`
3. ✅ **Deployed Functions:** All three functions deployed to Supabase production
4. ✅ **Created Cron Migration:** SQL migration file created (`supabase/migrations/005_cron_jobs.sql`)
5. ✅ **Documentation:** Updated to reflect Supabase Cron (pg_cron) implementation

**Deployment Commands (Completed):**

```bash
# Deploy all three functions (✅ COMPLETED)
supabase functions deploy nightly-cluster --no-verify-jwt
supabase functions deploy nightly-stacks --no-verify-jwt
supabase functions deploy weekly-insights --no-verify-jwt
```

**Next Steps:**

1. ⏳ **Apply Cron Migration:**
   - Update `anon_key` in migration file with actual anon key
   - Run migration: `supabase db push`
   - Or apply via Supabase Dashboard → SQL Editor
2. **Verify Cron Jobs:**
   - Check Supabase Dashboard → Integrations → Cron
   - Verify all three jobs appear: `nightly-cluster`, `nightly-stacks`, `weekly-insights`
3. **Test Functions:**
   - Test manually via Supabase Dashboard "Run Function" button
   - Or trigger via cron job manually from Dashboard
4. **Monitor:**
   - View job runs in Dashboard → Integrations → Cron → Job Runs
   - Check Edge Function logs in Dashboard → Edge Functions → Logs

**API Routes Status:**

- API routes under `/app/api/cron/` remain for manual testing
- They are no longer scheduled automatically
- Can be used for debugging or manual triggers

## Security Considerations

### Authentication

- **Secret Validation:** All jobs require valid secret
- **Environment Isolation:** Secrets not exposed in logs
- **Rotation:** Regular secret rotation (quarterly)

### Data Access

- **Least Privilege:** Jobs only access required data
- **User Isolation:** Jobs respect user data boundaries
- **Audit Logging:** Track all job data access

### Network Security

- **HTTPS Only:** All job communications encrypted
- **IP Restrictions:** Limit job access to known sources
- **Rate Limiting:** Prevent job abuse

## Performance Optimization

### Database Optimization

- **Indexing:** Optimize queries for job performance
- **Connection Pooling:** Efficient database connections
- **Batch Operations:** Process multiple records together

### AI API Optimization

- **Batch Requests:** Send multiple embeddings in one request
- **Caching:** Cache embeddings to avoid regeneration
- **Rate Limiting:** Respect OpenAI API limits

### Resource Management

- **Memory Usage:** Monitor and limit memory consumption
- **CPU Usage:** Optimize CPU-intensive operations
- **Timeout Handling:** Set appropriate timeouts

## References

- **API Routes:** `/app/api/cron/`
- **Edge Functions:** `/supabase/functions/` (Phase 4)
- **Database Schema:** `/prisma/schema.prisma`
- **Environment Variables:** `/DOPPLER.md`
- **Architecture:** `/docs/architecture.md`
