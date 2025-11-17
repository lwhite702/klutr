---
title: "AI Engine Admin Guide"
author: cursor-agent
updated: 2025-11-17
---

# AI Engine Admin Guide

## Overview

The Klutr AI Engine includes a comprehensive admin control system that allows authorized administrators to monitor, modify, and manage AI behavior in real-time without redeploying the application.

## Admin Authentication

### Becoming an Admin

Admin access is controlled via the `is_admin` flag in the `users` table:

```sql
-- Make a user an admin
UPDATE users SET is_admin = TRUE WHERE email = 'admin@klutr.app';

-- Check admin status
SELECT id, email, is_admin FROM users WHERE is_admin = TRUE;
```

### Admin API Access

All admin AI endpoints require admin authentication:

- Middleware checks: `await requireAdmin()`
- Returns 403 if user is not admin
- All endpoints under `/api/admin/ai/`

## Admin APIs

### 1. Usage Monitoring

#### Get Usage Logs

```http
GET /api/admin/ai/usage
Query params:
  - feature?: string (filter by feature)
  - userId?: string (filter by user)
  - model?: string (filter by model)
  - provider?: string (filter by provider)
  - startDate?: ISO date
  - endDate?: ISO date
  - limit?: number
  - summary?: boolean (return aggregated stats)
```

**Example Request**:
```bash
curl -H "Cookie: ..." \
  "https://klutr.app/api/admin/ai/usage?feature=spark&limit=100"
```

**Example Response**:
```json
{
  "logs": [
    {
      "id": "log_123",
      "user_id": "user_456",
      "feature": "spark",
      "tier": "MEDIUM",
      "model": "gpt-4o",
      "provider": "gateway",
      "input_tokens": 150,
      "output_tokens": 75,
      "estimated_cost": 0.0004,
      "success": true,
      "duration_ms": 1250,
      "created_at": "2025-11-17T20:30:00Z"
    }
  ],
  "count": 1
}
```

#### Get Usage Summary

```bash
curl -H "Cookie: ..." \
  "https://klutr.app/api/admin/ai/usage?summary=true&startDate=2025-11-10"
```

**Response**:
```json
{
  "summary": {
    "totalRequests": 1543,
    "totalCost": 12.45,
    "totalInputTokens": 234567,
    "totalOutputTokens": 123456,
    "successRate": 0.985,
    "averageDuration": 1350,
    "costByFeature": {
      "classify-note": 2.30,
      "spark": 5.60,
      "muse": 3.20,
      "weekly-insights": 1.35
    },
    "costByModel": {
      "gpt-4o-mini": 2.30,
      "gpt-4o": 10.15
    },
    "costByProvider": {
      "gateway": 8.50,
      "openai": 3.95
    }
  }
}
```

### 2. Cost Analytics

```http
GET /api/admin/ai/cost
Query params:
  - period?: 'hourly' | 'daily' | 'weekly' | 'monthly'
  - startDate?: ISO date
  - endDate?: ISO date
```

**Response**:
```json
{
  "summary": { ... },
  "history": [
    {
      "period_start": "2025-11-17T00:00:00Z",
      "period_end": "2025-11-18T00:00:00Z",
      "period_type": "daily",
      "feature": "spark",
      "model": "gpt-4o",
      "provider": "gateway",
      "total_requests": 120,
      "total_input_tokens": 18000,
      "total_output_tokens": 9000,
      "total_cost": 0.63
    }
  ],
  "period": {
    "type": "daily",
    "start": "2025-10-18",
    "end": "2025-11-17"
  }
}
```

### 3. Error Logs

```http
GET /api/admin/ai/logs
Query params:
  - feature?: string
  - userId?: string
  - startDate?: ISO date
  - endDate?: ISO date
  - limit?: number
```

**Response**:
```json
{
  "errors": [
    {
      "id": "error_789",
      "user_id": "user_456",
      "feature": "muse",
      "tier": "MEDIUM",
      "model": "gpt-4o",
      "provider": "gateway",
      "error_message": "AI request timeout",
      "created_at": "2025-11-17T20:25:00Z"
    }
  ],
  "count": 1
}
```

### 4. Model Catalog

```http
GET /api/admin/ai/models
```

**Response**:
```json
{
  "catalog": [
    {
      "tier": "CHEAP",
      "provider": "openai",
      "modelId": "gpt-4o-mini",
      "description": "Fast, cost-effective model for simple tasks",
      "costPer1MInputTokens": 0.15,
      "costPer1MOutputTokens": 0.60
    },
    ...
  ],
  "states": {
    "gateway": { "available": true, "healthy": true },
    "openai": { "available": true, "healthy": true },
    "anthropic": { "available": false, "healthy": false }
  }
}
```

### 5. Feature Flags

```http
GET /api/admin/ai/features
```

**Response**:
```json
{
  "features": [
    {
      "id": "flag_123",
      "feature_name": "classify-note",
      "enabled": true,
      "description": "AI-powered note classification and tagging",
      "tier_override": null,
      "model_override": null,
      "created_at": "2025-11-17T00:00:00Z"
    },
    ...
  ]
}
```

## Admin Override Examples

### Scenario 1: Cost Spike Investigation

**Problem**: Spark feature costs spiking, need to reduce immediately

**Solution**:
```bash
# Option A: Downgrade spark to CHEAP tier
curl -X POST -H "Cookie: ..." \
  -H "Content-Type: application/json" \
  -d '{"feature":"spark","tier":"CHEAP"}' \
  https://klutr.app/api/admin/ai/override/tier

# Option B: Disable spark temporarily
curl -X POST -H "Cookie: ..." \
  -H "Content-Type: application/json" \
  -d '{"feature":"spark","enabled":false}' \
  https://klutr.app/api/admin/ai/toggle/feature
```

### Scenario 2: Provider Outage

**Problem**: OpenAI experiencing downtime

**Solution**:
```bash
# Route all requests to Anthropic
curl -X POST -H "Cookie: ..." \
  -H "Content-Type: application/json" \
  -d '{"providerOrder":["anthropic","openai"]}' \
  https://klutr.app/api/admin/ai/override/gateway-routing
```

### Scenario 3: Testing New Model

**Problem**: Want to test GPT-5 for all MEDIUM tier operations

**Solution**:
```bash
# Override MEDIUM tier to use GPT-5
curl -X POST -H "Cookie: ..." \
  -H "Content-Type: application/json" \
  -d '{"tier":"MEDIUM","modelId":"gpt-5"}' \
  https://klutr.app/api/admin/ai/override/model
```

### Scenario 4: Emergency Shutdown

**Problem**: Unexpected cost spike, need to stop all AI immediately

**Solution**:
```bash
# Activate kill switch
curl -X POST -H "Cookie: ..." \
  -H "Content-Type: application/json" \
  -d '{"enabled":true,"reason":"Investigating cost spike"}' \
  https://klutr.app/api/admin/ai/kill-switch

# All AI requests will fail until deactivated
```

## Monitoring Best Practices

### Daily Checks

1. **Review cost summary**: `GET /api/admin/ai/cost`
2. **Check error rate**: `GET /api/admin/ai/logs?limit=20`
3. **Verify feature health**: `GET /api/admin/ai/features`

### Weekly Reviews

1. Analyze cost trends by feature
2. Identify optimization opportunities
3. Review model performance
4. Check for unusual usage patterns

### Monthly Actions

1. Aggregate cost data for budgeting
2. Evaluate model performance vs cost
3. Consider tier adjustments
4. Plan model upgrades/changes

## Troubleshooting

### High Costs

**Symptoms**: Cost summary shows unexpected spending

**Investigation**:
1. Check `GET /api/admin/ai/usage?summary=true`
2. Identify which features/models are expensive
3. Review recent usage logs for that feature
4. Check if any user has unusual activity

**Actions**:
- Downgrade feature tier
- Disable feature temporarily
- Add rate limiting for specific users
- Review prompts for optimization opportunities

### High Error Rate

**Symptoms**: Many entries in error logs

**Investigation**:
1. Check `GET /api/admin/ai/logs`
2. Group errors by feature and model
3. Look for patterns (timeouts, rate limits, auth errors)

**Actions**:
- Switch provider if one is failing
- Adjust timeout if needed
- Check API key validity
- Review feature flag configuration

### Provider Unavailable

**Symptoms**: Errors indicating provider failures

**Investigation**:
1. Check `GET /api/admin/ai/models` for provider states
2. Review error logs for provider-specific errors
3. Check Vercel AI Gateway dashboard

**Actions**:
- Configure provider routing to prefer working provider
- Temporarily disable failing provider
- Monitor provider status pages

## Reference

### All Admin Endpoints

```
GET  /api/admin/ai/usage           # Usage logs and summary
GET  /api/admin/ai/cost            # Cost analytics and trends
GET  /api/admin/ai/models          # Model catalog and states
GET  /api/admin/ai/features        # Feature flags list
GET  /api/admin/ai/logs            # Error logs
POST /api/admin/ai/override/model  # Set model override
POST /api/admin/ai/override/tier   # Set tier override
POST /api/admin/ai/override/gateway-routing # Set routing override
POST /api/admin/ai/toggle/feature  # Enable/disable feature
GET  /api/admin/ai/kill-switch     # Get kill switch status
POST /api/admin/ai/kill-switch     # Activate/deactivate kill switch
```

### Database Tables

```
ai_usage_logs        # Every AI request
ai_error_logs        # Every AI error
ai_overrides         # Active overrides
ai_feature_flags     # Feature toggles
ai_cost_history      # Aggregated costs
ai_kill_switch       # Global kill switch
```

## Support

For questions or issues:
- Implementation: `lib/ai/provider.ts`
- Database schema: `supabase/migrations/008_ai_admin_tables.sql`
- Engine docs: `docs/ai/engine.md`
- Feature docs: `docs/ai/features.md`

