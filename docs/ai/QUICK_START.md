# AI Engine Quick Start Guide

## For Developers

### Using AI Features

```typescript
import { 
  classifyNoteContent,
  generateSparkResponse,
  generateMuseRemix,
  generateWeeklySummary,
} from "@/lib/ai/features";

// Classify a note
const result = await classifyNoteContent("Meeting tomorrow", userId);

// Spark contextual assistant
const response = await generateSparkResponse({
  noteContent: "Project ideas...",
  userPrompt: "What are the priorities?",
  userId,
});

// Muse idea remixing
const remix = await generateMuseRemix({
  ideaA: "Build AI app",
  ideaB: "Focus on privacy",
  userId,
});

// Weekly insights
const insights = await generateWeeklySummary({
  notes: weekNotes,
  topTags: ["work", "learning"],
  noteCount: 42,
  userId,
});
```

### Model Tiers

Use appropriate tier for each task:

```typescript
tier: "CHEAP"      // Classification, tagging
tier: "MEDIUM"     // Chat, insights, summaries
tier: "EXPENSIVE"  // Complex reasoning
tier: "CHAT"       // GPT-5 conversations
tier: "CODE"       // Code generation
tier: "EMBEDDING"  // Vector search
tier: "LEGACY"     // Fallback only
```

## For Admins

### Quick Admin Tasks

**Check costs**:
```bash
curl https://klutr.app/api/admin/ai/usage?summary=true
```

**Downgrade expensive feature**:
```bash
curl -X POST https://klutr.app/api/admin/ai/override/tier \
  -H "Content-Type: application/json" \
  -d '{"feature":"spark","tier":"CHEAP"}'
```

**Disable problematic feature**:
```bash
curl -X POST https://klutr.app/api/admin/ai/toggle/feature \
  -H "Content-Type: application/json" \
  -d '{"feature":"muse","enabled":false}'
```

**Emergency shutdown**:
```bash
curl -X POST https://klutr.app/api/admin/ai/kill-switch \
  -H "Content-Type: application/json" \
  -d '{"enabled":true,"reason":"Cost spike"}'
```

### Becoming an Admin

```sql
-- Run in Supabase SQL editor
UPDATE users SET is_admin = TRUE WHERE email = 'your@email.com';
```

## Database Setup

### Run Migrations

```bash
# Apply AI admin tables
psql $DATABASE_URL < supabase/migrations/008_ai_admin_tables.sql

# Add user roles
psql $DATABASE_URL < supabase/migrations/009_add_user_roles.sql
```

### Verify Setup

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'ai_%';

-- Check feature flags
SELECT * FROM ai_feature_flags;

-- Check kill switch
SELECT * FROM ai_kill_switch;
```

## Monitoring

### Real-Time Costs

```bash
# Today's costs
curl "https://klutr.app/api/admin/ai/cost?period=daily&startDate=$(date -u +%Y-%m-%d)"

# This week's costs
curl "https://klutr.app/api/admin/ai/cost?period=weekly"
```

### Recent Errors

```bash
# Last 50 errors
curl "https://klutr.app/api/admin/ai/logs?limit=50"

# Errors for specific feature
curl "https://klutr.app/api/admin/ai/logs?feature=spark"
```

### Feature Status

```bash
# All features
curl "https://klutr.app/api/admin/ai/features"

# Model catalog
curl "https://klutr.app/api/admin/ai/models"
```

## Common Scenarios

### Scenario 1: Reduce Costs

```bash
# 1. Check which features are expensive
curl "https://klutr.app/api/admin/ai/usage?summary=true"

# 2. Downgrade expensive features
curl -X POST https://klutr.app/api/admin/ai/override/tier \
  -d '{"feature":"spark","tier":"CHEAP"}'

# 3. Monitor impact
curl "https://klutr.app/api/admin/ai/cost"
```

### Scenario 2: Provider Failover

```bash
# Route to backup provider
curl -X POST https://klutr.app/api/admin/ai/override/gateway-routing \
  -d '{"providerOrder":["anthropic","openai"]}'
```

### Scenario 3: Test New Model

```bash
# Override MEDIUM to use GPT-5
curl -X POST https://klutr.app/api/admin/ai/override/model \
  -d '{"tier":"MEDIUM","modelId":"gpt-5"}'

# Monitor results
curl "https://klutr.app/api/admin/ai/usage?model=gpt-5"
```

## Documentation

- **Architecture**: `docs/ai/engine.md`
- **Admin Guide**: `docs/ai/admin.md`
- **Features**: `docs/ai/features.md`
- **Implementation**: `docs/ai/IMPLEMENTATION_COMPLETE.md`
- **This Guide**: `docs/ai/QUICK_START.md`

## Support

For questions:
- Check docs first: `docs/ai/`
- Review code: `lib/ai/provider.ts`
- Test locally: `pnpm dev`
- Check logs: Database or Vercel dashboard

