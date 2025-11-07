# AI Architecture Documentation

This document describes the AI integration architecture for Klutr's Spark and Muse features.

## Overview

Klutr uses OpenAI's API for AI-powered features:
- **Spark**: Contextual AI assistant that analyzes and expands on notes
- **Muse**: Creative remix engine that combines two ideas into novel insights

Both features use streaming responses for real-time user feedback.

## Architecture Components

### 1. OpenAI Client (`/lib/openai.ts`)

Centralized OpenAI client with lazy initialization:

- **Client**: Uses OpenAI SDK with environment variable `OPENAI_API_KEY`
- **Embedding Function**: `getEmbedding()` generates 1536-dimensional vectors using `text-embedding-3-small` model
- **Streaming**: Handled separately in `/lib/ai/stream.ts`

### 2. Streaming Implementation (`/lib/ai/stream.ts`)

Streaming responses use Server-Sent Events (SSE) format:

- **Parser**: Uses `eventsource-parser` library to parse OpenAI's streaming API
- **Model**: `gpt-4o-mini` for cost-effective streaming responses
- **Error Handling**: Graceful error handling with proper cleanup

### 3. Embedding Strategy

**Current Implementation:**
- Embeddings stored directly in `notes.embedding` column (vector(1536))
- Uses `text-embedding-3-small` model (1536 dimensions)
- Index: `ivfflat` with `vector_cosine_ops` for similarity search

**Future Considerations:**
- Multi-model support may require separate `note_embeddings` table
- Current in-table storage is optimal for fixed-size embeddings
- Migration path exists if needed for Phase 3

### 4. Supabase Integration

**Client Configuration:**
- **Client-side**: Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Server-side**: Uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for admin operations

**Database Access:**
- API routes use `supabaseAdmin` client (bypasses RLS)
- Client components use `supabase` client (respects RLS)
- Service role key only used server-side for security

### 5. API Routes

#### Spark API (`/app/api/spark/route.ts`)

**Purpose**: Contextual AI assistant for note analysis

**Flow:**
1. Receives `{ noteId, prompt }` in request body
2. Fetches note content from Supabase using service role key
3. Builds contextual prompt: "You are Spark, an AI thinking assistant..."
4. Streams response using `streamLLMResponse()`
5. Returns `text/plain` streaming response

**Auth**: None (dev mode - auth middleware disabled)

#### Muse API (`/app/api/muse/route.ts`)

**Purpose**: Creative remix engine for idea combination

**Flow:**
1. Receives `{ ideaA, ideaB }` in request body
2. Builds remix prompt: "You are Muse, an idea remixer..."
3. Streams response using `streamLLMResponse()`
4. Returns `text/plain` streaming response

**Auth**: None (dev mode - auth middleware disabled)

### 6. Client Hooks

#### `useSpark` (`/lib/hooks/useSpark.ts`)

**State Management:**
- `loading`: Boolean indicating request in progress
- `response`: Accumulated streaming text
- `error`: Error message if request fails

**Methods:**
- `runSpark(noteId, prompt)`: Initiates streaming request
- `clearResponse()`: Resets state

**Implementation:**
- Uses `ReadableStream` API to read chunks incrementally
- Updates state on each chunk for real-time UI updates

#### `useMuse` (`/lib/hooks/useMuse.ts`)

Similar pattern to `useSpark`:
- `runMuse(ideaA, ideaB)`: Initiates streaming request
- Same state management and streaming pattern

### 7. UI Components

#### Spark Page (`/app/(app)/spark/page.tsx`)

**Features:**
- Input fields for note ID and prompt
- Submit button with loading state
- Real-time streaming response display
- Error handling with user-friendly messages
- Brand color: Coral (#ff6b6b)

#### Muse Page (`/app/(app)/muse/page.tsx`)

**Features:**
- Two input fields for ideas A and B
- Submit button with loading state
- Real-time streaming response display
- Error handling with user-friendly messages
- Brand color: Mint (#3ee0c5)

## Environment Variables

### Required Variables

**Server-only (Doppler):**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key for API routes
- `SUPABASE_ANON_KEY` - Anonymous key for server-side operations
- `OPENAI_API_KEY` - OpenAI API key

**Client-side (NEXT_PUBLIC_ prefix):**
- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key

### Security Considerations

- Service role key **never** exposed to client
- Client components use safer anon key
- API routes use service role only for admin operations
- All secrets managed via Doppler

## Database Schema

### AI Sessions Table

```sql
CREATE TABLE ai_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text CHECK (feature IN ('spark', 'muse')),
  created_at timestamptz DEFAULT now()
);
```

**Purpose**: Track AI feature usage for analytics and rate limiting

**Indexes:**
- `idx_ai_sessions_user_id` - Fast user queries
- `idx_ai_sessions_feature` - Feature analytics
- `idx_ai_sessions_created_at` - Time-based queries

### Embedding Index

Existing index on `notes.embedding`:
- Type: `ivfflat` with `vector_cosine_ops`
- Lists: 100 (optimized for performance)
- Used for similarity search and clustering

## Performance Considerations

1. **Streaming**: Reduces perceived latency by showing partial results
2. **Model Choice**: `gpt-4o-mini` balances cost and quality
3. **Embedding Model**: `text-embedding-3-small` is fast and cost-effective
4. **Vector Index**: `ivfflat` provides fast similarity search

## Future Enhancements

1. **Rate Limiting**: Implement per-user rate limits for AI features
2. **Session Tracking**: Log AI sessions to `ai_sessions` table
3. **Caching**: Cache common embeddings and responses
4. **Multi-model Support**: Support different embedding models per use case
5. **Auth Integration**: Enable proper user authentication and RLS

## Error Handling

- API routes return appropriate HTTP status codes
- Client hooks catch and display errors gracefully
- Streaming errors are logged server-side
- User-friendly error messages in UI

## Testing

- Test streaming responses in browser devtools
- Verify Supabase connection for note retrieval
- Test error cases (missing note, invalid API key)
- Verify real-time UI updates during streaming

