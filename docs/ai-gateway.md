# Vercel AI Gateway Integration

This document describes the Vercel AI Gateway integration for Klutr's AI features.

## Overview

Vercel AI Gateway provides a unified API for accessing multiple AI providers (OpenAI, Anthropic, Google, xAI, etc.) with built-in features like automatic failover, cost tracking, and analytics.

**Key Benefits:**

- **Single API**: Access all AI providers through one consistent interface
- **No Vendor Lock-in**: Switch providers or use multiple providers without code changes
- **Automatic Failover**: If a provider is down, requests automatically route to backup providers
- **Cost Tracking**: Built-in analytics for AI spending across all providers
- **Request Logging**: Monitor all AI requests in Vercel dashboard
- **Load Balancing**: Distribute requests across multiple providers for better reliability

## Architecture

### Provider Hierarchy

Klutr's AI provider abstraction (`lib/ai/provider.ts`) supports three modes:

1. **AI Gateway Mode (Default)**: All requests route through Vercel AI Gateway
2. **Direct Provider Mode**: Direct connection to OpenAI or Anthropic
3. **Hybrid Mode**: Gateway with fallback to direct provider if gateway is unavailable

```typescript
// Default: AI Gateway
await generateAIText({
  prompt: "Analyze this note",
  tier: "cheap",
  provider: "gateway", // Uses AI Gateway
});

// Direct provider access
await generateAIText({
  prompt: "Analyze this note",
  tier: "cheap",
  provider: "openai", // Direct OpenAI access
});
```

### Model Configuration

AI Gateway uses the format `provider/model-name`:

```typescript
export const MODELS = {
  CHEAP: {
    gateway: "openai/gpt-4o-mini",
    openai: "gpt-4o-mini",
    anthropic: "claude-3-haiku-20240307",
  },
  MEDIUM: {
    gateway: "openai/gpt-4o",
    openai: "gpt-4o",
    anthropic: "claude-3-5-sonnet-20241022",
  },
  EXPENSIVE: {
    gateway: "anthropic/claude-3-opus-20240229",
    openai: "gpt-4-turbo",
    anthropic: "claude-3-opus-20240229",
  },
};
```

## Authentication

AI Gateway supports multiple authentication methods:

### Option 1: AI_GATEWAY_API_KEY (Recommended for Local Dev)

Set in Doppler for local development:

```bash
AI_GATEWAY_API_KEY=your_api_key_here
```

Get your API key from [Vercel Dashboard → AI Gateway](https://vercel.com/dashboard/ai-gateway).

### Option 2: VERCEL_OIDC_TOKEN (Automatic in Production)

In Vercel deployments, `VERCEL_OIDC_TOKEN` is automatically available. The provider client will use this if `AI_GATEWAY_API_KEY` is not set.

### Option 3: Fallback to Direct Provider

If neither gateway key is available, the system falls back to direct provider access using `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`.

## Advanced Features

### 1. Provider Routing

Control which providers handle your requests:

```typescript
await generateAIText({
  prompt: "Analyze this note",
  tier: "medium",
  gatewayOptions: {
    order: ["openai", "anthropic"], // Try OpenAI first, then Anthropic
  },
});
```

### 2. Provider Restriction

Limit requests to specific providers:

```typescript
await generateAIText({
  prompt: "Analyze this note",
  tier: "medium",
  gatewayOptions: {
    only: ["openai", "anthropic"], // Only use these providers
  },
});
```

### 3. Model Fallbacks

Define fallback models if the primary model is unavailable:

```typescript
await generateAIText({
  prompt: "Analyze this note",
  tier: "medium",
  gatewayOptions: {
    models: ["openai/gpt-5-nano", "gemini-2.0-flash"], // Fallback models
  },
});
```

### 4. Usage Tracking

Track AI usage per end-user or feature:

```typescript
await generateAIText({
  prompt: "Analyze this note",
  tier: "medium",
  gatewayOptions: {
    user: "user-abc-123", // Track per user
    tags: ["spark", "note-analysis"], // Categorize for analytics
  },
});
```

### 5. Combined Options

All gateway options can be combined:

```typescript
await generateAIText({
  prompt: "Analyze this note",
  tier: "medium",
  gatewayOptions: {
    order: ["openai", "anthropic"], // Prefer OpenAI
    only: ["openai", "anthropic"], // Restrict to these two
    models: ["openai/gpt-5-nano"], // Fallback model
    user: userId, // Track per user
    tags: ["spark", "contextual-analysis"], // Analytics tags
  },
});
```

## Implementation Examples

### Basic Text Generation

```typescript
import { generateAIText } from "@/lib/ai/provider";

const result = await generateAIText({
  prompt: "Explain quantum computing",
  systemPrompt: "You are a helpful AI assistant",
  tier: "cheap",
  temperature: 0.7,
});

console.log(result.text);
console.log("Cost:", result.usage.estimatedCost);
```

### Structured Output

```typescript
import { generateAIObject } from "@/lib/ai/provider";
import { z } from "zod";

const schema = z.object({
  category: z.string(),
  tags: z.array(z.string()),
  sentiment: z.enum(["positive", "negative", "neutral"]),
});

const result = await generateAIObject({
  prompt: 'Classify this note: "Great progress on the project!"',
  schema,
  tier: "cheap",
});

console.log(result.object);
// { category: 'work', tags: ['project', 'progress'], sentiment: 'positive' }
```

### Streaming Responses

```typescript
import { streamAIText } from "@/lib/ai/provider";

const stream = await streamAIText({
  prompt: "Write a story about...",
  tier: "medium",
  temperature: 0.9,
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

### Embeddings

```typescript
import { generateAIEmbedding } from "@/lib/ai/provider";

const result = await generateAIEmbedding({
  text: "This is my note content",
});

console.log(result.embedding); // [0.123, -0.456, ...]
console.log("Dimensions:", result.embedding.length); // 1536
```

## Current Usage in Klutr

### Spark (Contextual AI Assistant)

**Endpoint:** `/api/spark`

Uses AI Gateway via the streaming wrapper in `lib/ai/stream.ts`:

```typescript
// lib/ai/stream.ts wraps OpenAI streaming
// Will be migrated to use streamAIText() from provider.ts
await streamLLMResponse(fullPrompt, (text) => {
  controller.enqueue(new TextEncoder().encode(text));
});
```

### Muse (Creative Remix Engine)

**Endpoint:** `/api/muse`

Similar streaming implementation for idea remixing.

### Note Classification

**Location:** `lib/ai/classifyNote.ts`

Uses `generateAIObject()` with structured output:

```typescript
await generateAIObject({
  prompt: `Classify this note: "${content}"`,
  schema: classificationSchema,
  tier: "cheap",
});
```

### Embeddings Generation

**Location:** `lib/ai/openai.ts` and various API routes

Uses `generateAIEmbedding()` for vector search:

```typescript
const { embedding } = await generateAIEmbedding({
  text: noteContent,
});
```

## Cost Tracking

The AI provider includes built-in cost estimation and logging:

```typescript
import { getCostSummary, resetCostTracker } from "@/lib/ai/provider";

// Get current session costs
const summary = getCostSummary();
console.log({
  totalRequests: summary.totalRequests,
  totalCost: summary.totalCost,
  costByModel: summary.costByModel,
  costByProvider: summary.costByProvider,
});

// Reset tracker (e.g., at the start of a billing period)
resetCostTracker();
```

## Migration Strategy

### Phase 1: Gateway Infrastructure (Current)

- ✅ Installed `@ai-sdk/gateway` package
- ✅ Updated `lib/ai/provider.ts` to support AI Gateway
- ✅ Documented environment variables in `DOPPLER.md`
- ✅ Created comprehensive documentation

### Phase 2: Gradual Migration

1. **Test Gateway in Development**

   - Set `AI_GATEWAY_API_KEY` in local Doppler
   - Verify all AI features work through gateway
   - Compare costs and performance

2. **Migrate Non-Critical Features First**

   - Start with note classification (low-stakes)
   - Then embeddings generation (batch operations)
   - Finally streaming features (Spark/Muse)

3. **Update Streaming Implementation**
   - Replace `lib/ai/stream.ts` OpenAI-specific code
   - Use `streamAIText()` from provider abstraction
   - Maintain backward compatibility

### Phase 3: Production Rollout

1. **Add Gateway Key to Vercel**

   ```bash
   vercel env add AI_GATEWAY_API_KEY production
   ```

2. **Monitor via Vercel Dashboard**

   - Track request counts
   - Monitor costs per model
   - Watch for errors or failover events

3. **Enable Advanced Features**
   - Configure provider routing for reliability
   - Add usage tracking by user/feature
   - Set up cost alerts

## Monitoring and Analytics

### Vercel Dashboard

View AI Gateway analytics at: [Vercel Dashboard → AI Gateway](https://vercel.com/dashboard/ai-gateway)

**Available Metrics:**

- Total requests per provider
- Cost per model
- Error rates and failover events
- Request latency
- Usage by endpoint/user (if tracking enabled)

### Application-Level Logging

Cost logging is enabled by default in `lib/ai/provider.ts`:

```typescript
const defaultConfig = {
  enableCostLogging: true,
};
```

This logs every AI request with:

- Model used
- Provider (gateway, openai, anthropic)
- Input/output token counts
- Estimated cost

## Security Considerations

### API Key Storage

- **Development**: Store in Doppler (`AI_GATEWAY_API_KEY`)
- **Production**: Use Vercel OIDC token (automatic) or set via Vercel env vars
- **Never commit** API keys to git

### Provider Keys

Even with AI Gateway, you still need provider-specific keys:

- `OPENAI_API_KEY` - Required for OpenAI models via gateway
- `ANTHROPIC_API_KEY` - Required for Anthropic models via gateway

The gateway routes requests to providers using your keys.

### Fallback Security

The provider implementation includes graceful fallback:

1. Try AI Gateway with `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`
2. If gateway unavailable, fall back to direct provider access
3. If direct access fails, throw descriptive error

This ensures AI features remain functional even if gateway is temporarily unavailable.

## Troubleshooting

### Gateway Not Available

**Symptom:** Console warning: `[AI Gateway] No API key found`

**Solution:**

1. Set `AI_GATEWAY_API_KEY` in Doppler (local dev)
2. Or set in Vercel environment variables (production)
3. Or verify `VERCEL_OIDC_TOKEN` is available (Vercel deployments)

### Fallback to Direct Provider

**Symptom:** Console warning: `[AI] Gateway not available, falling back to direct OpenAI access`

**Cause:** Gateway client initialization failed

**Impact:** Requests will use direct provider access (no gateway benefits)

**Solution:** Check API key configuration and network connectivity

### High Costs

**Investigation:**

1. Check Vercel AI Gateway dashboard for breakdown
2. Review application logs for cost estimates
3. Use `getCostSummary()` to track session costs

**Optimization:**

- Use cheaper models (`tier: 'cheap'`) for simple tasks
- Batch embedding operations
- Cache AI responses when appropriate
- Set up cost alerts in Vercel dashboard

## Future Enhancements

### Planned Features

1. **Smart Routing**

   - Automatic provider selection based on model availability
   - Cost-optimized routing (cheapest available model)
   - Latency-based routing (fastest provider)

2. **Enhanced Caching**

   - Cache AI responses for duplicate requests
   - Semantic similarity caching (for similar prompts)
   - User-specific cache with expiration

3. **Advanced Analytics**

   - Per-user cost tracking
   - Feature-level cost attribution
   - Cost trends and predictions

4. **Multi-Model Strategies**
   - Use cheap models for drafts, expensive for final output
   - Parallel requests to multiple models, use first response
   - Ensemble voting for classification tasks

## References

- [Vercel AI Gateway Documentation](https://vercel.com/docs/ai-gateway)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [AI Gateway Dashboard](https://vercel.com/dashboard/ai-gateway)
- Klutr Implementation: `lib/ai/provider.ts`
- Environment Variables: `DOPPLER.md`
