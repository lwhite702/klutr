---
title: "AI Features Documentation"
author: cursor-agent
updated: 2025-11-17
---

# AI Features Documentation

## Overview

This document describes all AI-powered features in Klutr and their implementation details.

## Feature Modules

All AI features are implemented as modular functions in `lib/ai/features/`.

### 1. Note Classification (`classifyNote`)

**Purpose**: Automatic note categorization and tag extraction

**Location**: `lib/ai/features/classifyNote.ts`

**Model Tier**: CHEAP (gpt-4o-mini)

**Input**: Note content (string)

**Output**: 
```typescript
{
  type: NoteType, // idea, task, contact, link, image, voice, misc, nope, unclassified
  tags: string[]  // 0-5 relevant tags
}
```

**Example**:
```typescript
import { classifyNoteContent } from "@/lib/ai/features";

const result = await classifyNoteContent(
  "Meeting with Sarah tomorrow at 2pm to discuss Q4 planning",
  userId
);
// { type: "task", tags: ["meeting", "planning", "q4"] }
```

**Cost**: ~$0.0003 per note

**Performance**: ~500ms average

### 2. Spark (Contextual Assistant)

**Purpose**: AI thinking partner that analyzes and expands on notes

**Location**: `lib/ai/features/spark.ts`

**Model Tier**: MEDIUM (gpt-4o)

**Input**: Note content + user question

**Output**: Contextual AI response (string)

**Example**:
```typescript
import { generateSparkResponse } from "@/lib/ai/features";

const response = await generateSparkResponse({
  noteContent: "Ideas for new product features...",
  userPrompt: "What are the most innovative ideas here?",
  userId,
});
```

**Cost**: ~$0.002-0.005 per query

**Performance**: ~2-5s average

**Use Cases**:
- Expand on note ideas
- Ask questions about note content
- Get contextual analysis
- Explore connections

### 3. Muse (Idea Remix Engine)

**Purpose**: Creative synthesis of two separate ideas

**Location**: `lib/ai/features/muse.ts`

**Model Tier**: MEDIUM (gpt-4o)

**Input**: Two note contents

**Output**: Creative remix combining both ideas (string)

**Example**:
```typescript
import { generateMuseRemix } from "@/lib/ai/features";

const remix = await generateMuseRemix({
  ideaA: "Build an AI note-taking app",
  ideaB: "Focus on neurodivergent users",
  userId,
});
// "An AI note-taking app specifically designed for neurodivergent minds..."
```

**Cost**: ~$0.003-0.006 per remix

**Performance**: ~3-6s average

**Temperature**: 0.9 (high creativity)

### 4. MindStorm Reasoner

**Purpose**: AI-powered note clustering and theme detection

**Location**: `lib/ai/features/mindstormReasoner.ts`

**Model Tier**: CHEAP (gpt-4o-mini)

**Functions**:

#### `analyzeNoteClusters()`

Groups notes by theme automatically.

**Input**: Array of notes (up to 50 for token efficiency)

**Output**:
```typescript
Array<{
  theme: string,
  noteIds: string[],
  confidence: number
}>
```

**Example**:
```typescript
import { analyzeNoteClusters } from "@/lib/ai/features";

const clusters = await analyzeNoteClusters({
  notes: [
    { id: "1", content: "Project planning ideas..." },
    { id: "2", content: "Project timeline..." },
    { id: "3", content: "Recipe for pasta..." },
  ],
  userId,
});
// [
//   { theme: "Project Work", noteIds: ["1", "2"], confidence: 0.85 },
//   { theme: "Cooking", noteIds: ["3"], confidence: 0.90 }
// ]
```

#### `generateClusterName()`

Generates concise names for note clusters.

**Input**: Array of note contents

**Output**: 2-3 word cluster name

**Example**:
```typescript
import { generateClusterName } from "@/lib/ai/features";

const name = await generateClusterName({
  notes: [
    "Product roadmap Q1",
    "Feature prioritization",
    "User feedback analysis",
  ],
  userId,
});
// "Product Planning"
```

**Cost**: ~$0.0002-0.0005 per cluster

**Performance**: ~500ms average

### 5. Weekly Insights

**Purpose**: AI-generated weekly summaries and pattern analysis

**Location**: `lib/ai/features/weeklyInsights.ts`

**Model Tier**: MEDIUM (gpt-4o)

**Input**: Week's notes + metadata

**Output**:
```typescript
{
  summary: string,        // 3-4 sentence overview
  keyThemes: string[],    // Main themes identified
  patterns: string[],     // Behavioral patterns
  suggestions: string[]   // Actionable suggestions
}
```

**Example**:
```typescript
import { generateWeeklySummary } from "@/lib/ai/features";

const insights = await generateWeeklySummary({
  notes: weeklyNotes,
  topTags: ["work", "learning", "health"],
  noteCount: 42,
  userId,
});
```

**Cost**: ~$0.005-0.010 per weekly summary

**Performance**: ~5-10s average

**Cron**: Runs weekly on Sunday nights

### 6. Stack Summarization

**Purpose**: Generate summaries for smart stacks

**Location**: `lib/ai/features/stacks.ts`

**Model Tier**: CHEAP (gpt-4o-mini)

**Input**: Cluster name + notes in stack

**Output**:
```typescript
{
  summary: string,      // 2-3 sentence overview
  keyPoints: string[],  // 3-5 key points
  tags: string[]        // 3-5 relevant tags
}
```

**Example**:
```typescript
import { generateStackSummary } from "@/lib/ai/features";

const summary = await generateStackSummary({
  clusterName: "Project Alpha",
  notes: stackNotes,
  userId,
});
```

**Cost**: ~$0.0003-0.0008 per stack

**Performance**: ~800ms average

## Feature Configuration

### Default Tiers

```typescript
const FEATURE_TIERS = {
  "classify-note": "CHEAP",
  "spark": "MEDIUM",
  "muse": "MEDIUM",
  "mindstorm": "CHEAP",
  "weekly-insights": "MEDIUM",
  "stacks": "CHEAP",
  "embeddings": "EMBEDDING",
};
```

### Admin Overrides

Admins can override default tiers per feature:

```typescript
// Force spark to use EXPENSIVE tier for better quality
await setTierOverride({
  feature: "spark",
  tier: "EXPENSIVE",
  adminUserId: admin.id,
});
```

## Integration Patterns

### API Routes

All AI features should be called from API routes (server-side only):

```typescript
// app/api/spark/route.ts
import { generateSparkResponse } from "@/lib/ai/features";

export async function POST(req: Request) {
  const { noteId, prompt } = await req.json();
  const user = await getCurrentUser();

  // Fetch note...
  
  const response = await generateSparkResponse({
    noteContent: note.content,
    userPrompt: prompt,
    userId: user.id,
  });

  return NextResponse.json({ response });
}
```

### Client Components

Client components call API routes, not AI features directly:

```typescript
// components/SparkChat.tsx
async function handleSparkQuery(prompt: string) {
  const response = await fetch("/api/spark", {
    method: "POST",
    body: JSON.stringify({ noteId, prompt }),
  });

  const data = await response.json();
  return data.response;
}
```

## Cost Optimization

### Best Practices

1. **Choose appropriate tier**:
   - CHEAP for simple tasks (classification, tagging)
   - MEDIUM for quality responses (chat, insights)
   - EXPENSIVE only for complex reasoning

2. **Batch operations**:
   - Use `generateAIEmbeddingsBatch` for bulk embeddings
   - Process in chunks of 100

3. **Cache results**:
   - Cache classification for duplicate content
   - Cache weekly insights (don't regenerate)
   - Store Spark responses for similar questions

4. **Optimize prompts**:
   - Keep system prompts concise
   - Limit sample data (e.g., first 50 notes)
   - Use structured output (generateAIObject) instead of parsing text

### Expected Monthly Costs

Based on typical usage patterns:

- **100 users, 50 notes/week each**:
  - Classification: ~$75/month
  - Embeddings: ~$15/month
  - Weekly insights: ~$20/month
  - Spark (10 queries/user/month): ~$100/month
  - Muse (5 remixes/user/month): ~$75/month
  - **Total**: ~$285/month

- **1000 users, 50 notes/week each**:
  - ~$2,850/month

## Admin Controls

### Per-Feature Control

Admins can:
- Change model tier for any feature
- Override specific model for any tier
- Disable features individually
- Monitor costs per feature

### Global Control

Admins can:
- Activate kill switch (disable all AI)
- Configure provider routing
- View aggregated cost analytics
- Export usage logs for auditing

## Compliance

### Data Privacy

- No user data stored in AI vendor logs (OpenAI/Anthropic)
- All prompts and responses logged in Klutr database
- Admin access to logs requires authentication
- Vault notes never sent to AI (client-side encryption)

### Cost Management

- Per-request cost tracking
- Aggregated cost history
- Budget alerts (via admin monitoring)
- Usage caps (via feature flags)

## Future Features

### Planned

1. **Smart Routing**: Auto-select cheapest/fastest provider
2. **Response Caching**: Deduplicate identical prompts
3. **Quality Metrics**: Track response quality vs cost
4. **User Preferences**: Per-user AI settings
5. **Batch Insights**: Process multiple users in parallel

### Under Consideration

1. **Custom Models**: Support for fine-tuned models
2. **Local LLMs**: Privacy-focused local inference
3. **Multi-Model Voting**: Consensus from multiple models
4. **Prompt Templates**: Admin-editable system prompts

## References

- AI Engine: `docs/ai/engine.md`
- Admin Guide: `docs/ai/admin.md`
- Implementation: `lib/ai/provider.ts`, `lib/ai/features/`
- Admin API: `app/api/admin/ai/`

