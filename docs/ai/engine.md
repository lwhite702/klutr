---
title: "Klutr AI Engine"
author: cursor-agent
updated: 2025-11-17
---

# Klutr AI Engine

## Overview

The Klutr AI Engine is a production-grade AI provider abstraction layer that provides:

- **Multi-provider support**: OpenAI, Anthropic, and unified access via Vercel AI Gateway
- **Model tier system**: CHEAP, MEDIUM, EXPENSIVE, CHAT, CODE, EMBEDDING, LEGACY
- **Admin control system**: Real-time model overrides, feature toggles, kill switch
- **Cost tracking**: Automatic logging and analytics for all AI operations
- **Resilience**: Automatic retry with exponential backoff, timeouts, and failover
- **Monitoring**: Comprehensive usage and error logging

## Architecture

### Core Components

```
lib/ai/
├── provider.ts          # Core AI provider abstraction
├── features/            # AI feature modules
│   ├── classifyNote.ts  # Note classification
│   ├── spark.ts         # Contextual assistant
│   ├── muse.ts          # Idea remixer
│   ├── mindstormReasoner.ts # Clustering reasoner
│   ├── weeklyInsights.ts # Weekly summaries
│   └── stacks.ts        # Stack generation

lib/admin/ai/
├── usage.ts             # Usage tracking and analytics
├── overrides.ts         # Model and tier overrides
├── features.ts          # Feature flags and kill switch
└── models.ts            # Model catalog and states

app/api/admin/ai/
├── usage/route.ts       # GET usage logs
├── cost/route.ts        # GET cost analytics
├── models/route.ts      # GET model catalog
├── features/route.ts    # GET feature flags
├── logs/route.ts        # GET error logs
├── override/
│   ├── model/route.ts   # POST model override
│   ├── tier/route.ts    # POST tier override
│   └── gateway-routing/route.ts # POST routing override
├── toggle/
│   └── feature/route.ts # POST feature toggle
└── kill-switch/route.ts # GET/POST kill switch
```

### Database Schema

```sql
ai_usage_logs        # Every AI request logged
ai_error_logs        # Every AI error logged
ai_overrides         # Admin-configured overrides
ai_feature_flags     # Feature enable/disable toggles
ai_cost_history      # Aggregated cost data
ai_kill_switch       # Global emergency disable
```

## Model Tiers

### CHEAP (Cost-Effective)

**Use for**: Classification, tagging, simple analysis

**Models**:

- OpenAI: `gpt-4o-mini` ($0.15/1M input, $0.60/1M output)
- Anthropic: `claude-3-haiku` ($0.25/1M input, $1.25/1M output)
- Gateway: `openai/gpt-4o-mini`

**Features using CHEAP**:

- Note classification
- Tag generation
- Cluster naming

### MEDIUM (Balanced)

**Use for**: Summaries, insights, general chat

**Models**:

- OpenAI: `gpt-4o` ($2.50/1M input, $10.00/1M output)
- Anthropic: `claude-3-5-sonnet` ($3.00/1M input, $15.00/1M output)
- Gateway: `openai/gpt-4o`

**Features using MEDIUM**:

- Spark (contextual assistant)
- Muse (idea remixing)
- Weekly insights

### EXPENSIVE (Complex Reasoning)

**Use for**: Complex analysis, long-form generation

**Models**:

- OpenAI: `gpt-4-turbo` ($10.00/1M input, $30.00/1M output)
- Anthropic: `claude-3-opus` ($15.00/1M input, $75.00/1M output)
- Gateway: `anthropic/claude-3-opus`

**Features using EXPENSIVE**:

- Reserved for future complex reasoning tasks

### CHAT (GPT-5 Series)

**Use for**: Advanced chat interactions

**Models**:

- OpenAI: `gpt-5` ($3.00/1M input, $12.00/1M output)
- Gateway: `openai/gpt-5`

**Features using CHAT**:

- Future chat-based features

### CODE (GPT-5.1 Code)

**Use for**: Code generation and analysis

**Models**:

- OpenAI: `gpt-5.1-code` ($3.50/1M input, $14.00/1M output)
- Gateway: `openai/gpt-5.1-code`

**Features using CODE**:

- Future code-based features

### EMBEDDING (Vector Search)

**Use for**: Semantic search, similarity matching

**Models**:

- OpenAI: `text-embedding-3-small` ($0.02/1M tokens)
- Gateway: `openai/text-embedding-3-small`

**Features using EMBEDDING**:

- Note similarity search
- Cluster analysis

### LEGACY (Fallback)

**Use for**: Basic tasks when other models unavailable

**Models**:

- OpenAI: `gpt-3.5-turbo` ($0.50/1M input, $1.50/1M output)
- Gateway: `openai/gpt-3.5-turbo`

## Admin Control System

### Model Overrides

Override specific tiers to use different models:

```typescript
// Example: Force CHEAP tier to use GPT-5 instead of gpt-4o-mini
POST /api/admin/ai/override/model
{
  "tier": "CHEAP",
  "modelId": "gpt-5"
}
```

### Tier Overrides

Override specific features to use different tiers:

```typescript
// Example: Force "spark" to use EXPENSIVE tier for better quality
POST /api/admin/ai/override/tier
{
  "feature": "spark",
  "tier": "EXPENSIVE"
}
```

### Gateway Routing

Override provider preference order:

```typescript
// Example: Prefer Anthropic over OpenAI
POST /api/admin/ai/override/gateway-routing
{
  "providerOrder": ["anthropic", "openai"]
}
```

### Feature Toggles

Enable/disable specific AI features:

```typescript
// Example: Temporarily disable Muse feature
POST /api/admin/ai/toggle/feature
{
  "feature": "muse",
  "enabled": false
}
```

### Kill Switch

Emergency disable all AI features:

```typescript
// Activate kill switch
POST /api/admin/ai/kill-switch
{
  "enabled": true,
  "reason": "High costs detected - investigating"
}

// Deactivate kill switch
POST /api/admin/ai/kill-switch
{
  "enabled": false
}
```

## Usage Tracking

### Real-Time Logging

Every AI request is automatically logged to `ai_usage_logs`:

```sql
SELECT
  feature,
  model,
  COUNT(*) as requests,
  SUM(input_tokens) as total_input,
  SUM(output_tokens) as total_output,
  SUM(estimated_cost) as total_cost
FROM ai_usage_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY feature, model
ORDER BY total_cost DESC;
```

### Cost Analytics

Get cost breakdown via admin API:

```typescript
// Get cost summary for last 30 days
GET /api/admin/ai/cost?period=daily&startDate=2025-10-18&endDate=2025-11-17
```

### Error Monitoring

All AI errors logged to `ai_error_logs`:

```typescript
// Get recent errors
GET /api/admin/ai/logs?limit=50
```

## Feature Modules

### classifyNote

**Purpose**: Automatic note classification and tagging

**Tier**: CHEAP

**Usage**:

```typescript
import { classifyNoteContent } from "@/lib/ai/features";

const result = await classifyNoteContent("Meeting with team tomorrow", userId);
// { type: "task", tags: ["meeting", "team", "work"] }
```

### spark

**Purpose**: Contextual AI assistant for note analysis

**Tier**: MEDIUM

**Usage**:

```typescript
import { generateSparkResponse } from "@/lib/ai/features";

const response = await generateSparkResponse({
  noteContent: "Project planning notes...",
  userPrompt: "What are the key action items?",
  userId,
});
```

### muse

**Purpose**: Creative idea remixing engine

**Tier**: MEDIUM

**Usage**:

```typescript
import { generateMuseRemix } from "@/lib/ai/features";

const remix = await generateMuseRemix({
  ideaA: "Build a note-taking app",
  ideaB: "Use AI for organization",
  userId,
});
```

### mindstormReasoner

**Purpose**: Note clustering and theme detection

**Tier**: CHEAP

**Usage**:

```typescript
import { analyzeNoteClusters, generateClusterName } from "@/lib/ai/features";

const clusters = await analyzeNoteClusters({
  notes: [{ id: "1", content: "..." }, ...],
  userId,
});

const clusterName = await generateClusterName({
  notes: ["Note 1 content", "Note 2 content"],
  userId,
});
```

### weeklyInsights

**Purpose**: AI-generated weekly summaries

**Tier**: MEDIUM

**Usage**:

```typescript
import { generateWeeklySummary } from "@/lib/ai/features";

const insights = await generateWeeklySummary({
  notes: [...],
  topTags: ["work", "learning", "project"],
  noteCount: 42,
  userId,
});
```

### stacks

**Purpose**: Smart stack generation and summarization

**Tier**: CHEAP

**Usage**:

```typescript
import { generateStackSummary } from "@/lib/ai/features";

const summary = await generateStackSummary({
  clusterName: "Project Planning",
  notes: [...],
  userId,
});
```

## Cost Management

### Automatic Cost Tracking

The provider tracks costs automatically:

```typescript
import { getCostSummary, resetCostTracker } from "@/lib/ai/provider";

// Get current session costs
const summary = getCostSummary();
console.log(`Total: $${summary.totalCost.toFixed(2)}`);

// Reset at start of new billing period
resetCostTracker();
```

### Cost Estimation

Before running expensive operations, estimate costs:

```typescript
// Estimated costs per 1000 notes:
// - Classification (CHEAP): ~$0.50
// - Embeddings (EMBEDDING): ~$0.10
// - Weekly insights (MEDIUM): ~$0.20
// - Spark responses (MEDIUM): ~$0.15 per query
```

## Security

### Admin Authentication

All admin API routes require admin role:

```typescript
// Check in lib/admin/auth.ts
const admin = await requireAdmin(); // Throws if not admin
```

### RLS Policies

Admin tables have no user policies - only accessible via service role:

- `ai_usage_logs` - Admin only
- `ai_error_logs` - Admin only
- `ai_overrides` - Admin only
- `ai_feature_flags` - Admin only
- `ai_kill_switch` - Admin only

### Environment Variables

Required for AI Engine:

```bash
# Provider keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# AI Gateway (optional)
AI_GATEWAY_API_KEY=...

# Auto-available in Vercel
VERCEL_OIDC_TOKEN=...
```

## Monitoring

### Usage Dashboard (Admin API)

```typescript
// Total usage summary
GET /api/admin/ai/usage?summary=true

// Usage by feature
GET /api/admin/ai/usage?feature=spark

// Usage by user
GET /api/admin/ai/usage?userId=user_123

// Recent errors
GET /api/admin/ai/logs?limit=50
```

### Vercel AI Gateway Dashboard

View gateway analytics: https://vercel.com/dashboard/ai-gateway

- Request counts per provider
- Cost per model
- Error rates and failover events
- Latency metrics

## Error Handling

### Automatic Retries

All AI requests include automatic retry logic:

- **Max retries**: 3
- **Timeout**: 12 seconds
- **Backoff**: Exponential (1s, 2s, 4s)

### Graceful Fallbacks

If AI requests fail:

1. Gateway → OpenAI → Anthropic (provider fallback)
2. Error logged to `ai_error_logs`
3. Feature-specific fallback behavior (e.g., classification returns "unclassified")

### Kill Switch

For emergencies, activate global kill switch:

```typescript
POST /api/admin/ai/kill-switch
{
  "enabled": true,
  "reason": "Cost spike detected - investigating"
}
```

All AI features will immediately return error until deactivated.

## Performance

### Optimization Strategies

1. **Batch Processing**: Use `generateAIEmbeddingsBatch` for bulk operations
2. **Rate Limiting**: Automatic 1s delay between batches
3. **Caching**: Consider caching classification results for duplicate content
4. **Tier Selection**: Use CHEAP for simple tasks, reserve EXPENSIVE for complex reasoning

### Expected Performance

- **Classification**: ~500ms per note
- **Embeddings**: ~100ms per text (batched)
- **Spark**: ~2-5s per query
- **Muse**: ~3-6s per remix
- **Clustering**: ~10-30s for 100 notes
- **Weekly insights**: ~5-10s per summary

## Migration from Old System

### Updating Existing Code

**Before**:

```typescript
await generateAIText({
  prompt: "...",
  tier: "cheap", // lowercase
});
```

**After**:

```typescript
await generateAIText({
  prompt: "...",
  tier: "CHEAP", // UPPERCASE
  feature: "my-feature", // Add feature name
  userId, // Add user ID for tracking
});
```

### Import Updates

**Before**:

```typescript
import { classifyNoteContent } from "@/lib/ai/classifyNote";
```

**After** (backward compatible):

```typescript
import { classifyNoteContent } from "@/lib/ai/classifyNote";
// OR
import { classifyNoteContent } from "@/lib/ai/features";
```

## Future Enhancements

### Planned Features

1. **Smart Routing**: Automatic provider selection based on cost/latency
2. **Response Caching**: Cache identical prompts to reduce costs
3. **Cost Budgets**: Per-user/per-feature spending limits
4. **A/B Testing**: Compare model quality across providers
5. **Prompt Optimization**: Automatic prompt engineering for cost reduction

### Roadmap

- **Phase 1** (Complete): Basic provider abstraction
- **Phase 2** (Complete): AI Gateway integration
- **Phase 3** (Complete): Admin control system
- **Phase 4** (Next): Real-time monitoring dashboard
- **Phase 5** (Future): Advanced optimization and caching

## References

- Implementation: `lib/ai/provider.ts`
- Admin API: `app/api/admin/ai/`
- Database schema: `supabase/migrations/008_ai_admin_tables.sql`
- Gateway docs: `docs/ai-gateway.md`
- Admin docs: `docs/ai/admin.md`
