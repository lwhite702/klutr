---
title: "Background Jobs and Cron Documentation"
author: cursor-agent
updated: 2025-10-29
---

# Background Jobs and Cron Documentation

## Overview

Background jobs handle automated tasks that don't require user interaction, such as AI clustering, stack generation, and weekly insights. The system transitions from manual API routes (Phase 1) to automated Supabase Edge Functions (Phase 4).

## Current Implementation (Phase 1)

### Manual API Routes

All cron jobs are implemented as API routes under `/api/cron/`:

- **`/api/cron/nightly-cluster`** - Re-embed notes and regenerate clusters
- **`/api/cron/nightly-stacks`** - Analyze patterns and rebuild smart stacks
- **`/api/cron/weekly-insights`** - Generate AI summary of week's activity

### Security

All cron routes are protected by `Authorization: Bearer <CRON_SECRET>` header validation:

```typescript
// Example from /api/cron/nightly-cluster/route.ts
const authHeader = request.headers.get("authorization");
const token = authHeader?.replace("Bearer ", "");

if (token !== process.env.CRON_SECRET) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Environment Variables

- **`CRON_SECRET`** - Secret key for authenticating cron endpoints
- Managed via Doppler across all environments
- Must be set in external cron service (Vercel Cron, GitHub Actions, etc.)

## Cron Schedule

### Daily Jobs

- **Nightly Embeddings Refresh:** 2:00 AM ET daily

  - Re-embeds all notes with latest OpenAI embeddings
  - Regenerates clusters based on updated embeddings
  - Ensures clustering stays current with new content

- **Smart Stacks Rebuild:** 2:30 AM ET daily
  - Analyzes note patterns and relationships
  - Rebuilds smart stacks based on clustering results
  - Updates stack priorities and groupings

### Weekly Jobs

- **Weekly Insights Generation:** Sundays 3:00 AM ET
  - Analyzes past week's note-taking activity
  - Generates AI summary of patterns and trends
  - Creates personalized insights for user

## Target Implementation (Phase 4)

### Supabase Edge Functions

Replace manual API routes with Supabase Edge Functions:

- **`nightly-cluster`** - Edge Function for clustering
- **`nightly-stacks`** - Edge Function for stack generation
- **`weekly-insights`** - Edge Function for insights

### Automated Scheduling

Use pg_cron extension to trigger Edge Functions:

```sql
-- Schedule nightly clustering
SELECT cron.schedule(
  'nightly-cluster',
  '0 2 * * *',  -- 2:00 AM ET daily
  'SELECT net.http_post(
    url:=''https://your-project.supabase.co/functions/v1/nightly-cluster'',
    headers:=''{"Authorization": "Bearer ' || current_setting(''app.cron_secret'') || '"}''::jsonb
  );'
);

-- Schedule nightly stacks
SELECT cron.schedule(
  'nightly-stacks',
  '30 2 * * *',  -- 2:30 AM ET daily
  'SELECT net.http_post(
    url:=''https://your-project.supabase.co/functions/v1/nightly-stacks'',
    headers:=''{"Authorization": "Bearer ' || current_setting(''app.cron_secret'') || '"}''::jsonb
  );'
);

-- Schedule weekly insights
SELECT cron.schedule(
  'weekly-insights',
  '0 3 * * 0',  -- 3:00 AM ET Sundays
  'SELECT net.http_post(
    url:=''https://your-project.supabase.co/functions/v1/weekly-insights'',
    headers:=''{"Authorization": "Bearer ' || current_setting(''app.cron_secret'') || '"}''::jsonb
  );'
);
```

### Secret Management

Environment variables managed in Supabase:

- **`CRON_SECRET`** - Set in Supabase project settings
- **`OPENAI_API_KEY`** - Available to Edge Functions
- **`SUPABASE_SERVICE_ROLE_KEY`** - For database access

## Job Descriptions

### nightly-cluster

**Purpose:** Re-embed all notes and regenerate clusters

**Process:**

1. **Fetch Notes:** Retrieve all notes from database
2. **Generate Embeddings:** Create new embeddings using OpenAI API
3. **Update Database:** Store new embeddings in pgvector columns
4. **Cluster Analysis:** Use pgvector similarity search to group notes
5. **Update Clusters:** Create/update cluster records
6. **Cleanup:** Remove orphaned clusters

**Input:** None (processes all notes)
**Output:** Updated cluster assignments
**Duration:** ~5-10 minutes for 1000 notes
**Error Handling:** Retry failed embeddings, log errors

### nightly-stacks

**Purpose:** Analyze patterns and rebuild smart stacks

**Process:**

1. **Analyze Clusters:** Review recent cluster changes
2. **Pattern Detection:** Identify recurring themes and topics
3. **Stack Generation:** Create smart stacks based on patterns
4. **Priority Calculation:** Determine stack importance scores
5. **Update Stacks:** Create/update stack records
6. **Cleanup:** Remove outdated stacks

**Input:** Cluster data from nightly-cluster
**Output:** Updated smart stacks
**Duration:** ~2-3 minutes
**Error Handling:** Skip failed analyses, continue with others

### weekly-insights

**Purpose:** Generate AI summary of week's note-taking activity

**Process:**

1. **Data Collection:** Gather notes from past 7 days
2. **Pattern Analysis:** Identify trends and themes
3. **AI Generation:** Use OpenAI to create insights summary
4. **Formatting:** Structure insights for user consumption
5. **Storage:** Save insights to database
6. **Notification:** Trigger user notification (future)

**Input:** Notes from past week
**Output:** Weekly insights summary
**Duration:** ~1-2 minutes
**Error Handling:** Generate partial insights if some data fails

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

```bash
# Test nightly-cluster
curl -X POST https://your-app.vercel.app/api/cron/nightly-cluster \
  -H "Authorization: Bearer $CRON_SECRET"

# Test nightly-stacks
curl -X POST https://your-app.vercel.app/api/cron/nightly-stacks \
  -H "Authorization: Bearer $CRON_SECRET"

# Test weekly-insights
curl -X POST https://your-app.vercel.app/api/cron/weekly-insights \
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

## Migration Strategy

### Phase 1 → Phase 4 Transition

1. **Create Edge Functions:** Develop Supabase Edge Functions
2. **Test Functions:** Verify functions work correctly
3. **Set up pg_cron:** Configure automated scheduling
4. **Parallel Operation:** Run both systems temporarily
5. **Switch Over:** Point scheduling to Edge Functions
6. **Remove API Routes:** Delete manual cron endpoints
7. **Cleanup:** Remove CRON_SECRET from environment

### Rollback Plan

- **Keep API Routes:** Maintain manual routes during transition
- **Environment Variables:** Keep CRON_SECRET available
- **Monitoring:** Watch for issues during transition
- **Quick Switch:** Ability to revert to manual routes if needed

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
