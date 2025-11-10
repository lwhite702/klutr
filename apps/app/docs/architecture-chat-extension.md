---
title: "Chat-Centric Architecture Extension"
author: cursor-agent
updated: 2025-01-27
---

# Chat-Centric Architecture Extension

## Purpose Statement

This document extends the base architecture overview (`/docs/architecture.md`) to support Klutr's transformation into a **chat-first, multimodal note interface**. The chat-centric model improves user experience by:

1. **Natural Interaction**: Users interact with Klutr through conversation, making it feel more intuitive and less structured than traditional note-taking
2. **Multimodal Input**: Seamlessly handle text, audio, images, files, and links in a unified interface
3. **Automatic Organization**: Messages are automatically grouped into threads based on semantic similarity, reducing manual organization overhead
4. **Contextual Understanding**: Thread-based conversations provide better context for AI-powered insights and recommendations
5. **Progressive Disclosure**: Users can drop anything without thinking about structure; organization happens behind the scenes

The new paradigm: *"Klutr organizes your chaos — one conversation at a time."*

## Data Model Changes

### New Models

#### ConversationThread

Represents a conversation thread containing related messages. Threads are automatically created or matched based on message similarity.

```prisma
model ConversationThread {
  id          String   @id @default(cuid())
  title       String?  // Auto-generated or user-provided
  system_tags String[] @default([]) // AI-generated organization tags
  userId      String
  createdAt   DateTime @default(now())
  messages    Message[]
  user        User     @relation(fields: [userId], references: [id])

  @@index([userId, createdAt])
  @@map("conversation_threads")
}
```

**Key Characteristics:**
- `title`: Optional, can be auto-generated from first message or user-provided
- `system_tags`: Array of strings for AI-generated organization (e.g., ["work", "project-alpha", "meeting-notes"])
- Threads are user-scoped and ordered by creation time

#### Message

Represents individual messages within a conversation thread. Messages can be text, audio, images, files, or links.

```prisma
model Message {
  id           String      @id @default(cuid())
  type         MessageType
  content      String?     @db.Text // For text messages
  fileUrl      String?     // Supabase Storage URL for attachments
  transcription String?    @db.Text // For audio transcription
  metadata     Json?       // Flexible additional data
  embedding    Unsupported("vector(1536)")? // For semantic search
  threadId     String
  userId       String
  createdAt    DateTime    @default(now())

  thread       ConversationThread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  user         User               @relation(fields: [userId], references: [id])

  @@index([threadId, createdAt])
  @@index([userId, createdAt])
  @@map("messages")
}
```

**Key Characteristics:**
- `type`: Enum (text, audio, image, file, link) determines how message is rendered
- `content`: Text content for text messages, null for non-text types
- `fileUrl`: Supabase Storage URL for file/image/audio attachments
- `transcription`: Text transcription for audio messages (generated via OpenAI Whisper)
- `metadata`: JSON field for flexible schema evolution (e.g., image dimensions, file size, link preview)
- `embedding`: Vector embedding for semantic similarity search and clustering

#### MessageType Enum

```prisma
enum MessageType {
  text   // Plain text messages
  audio  // Voice/audio recordings
  image  // Image uploads
  file   // File attachments
  link   // URL links
}
```

### Updated User Model

```prisma
model User {
  // ... existing fields ...
  threads ConversationThread[] // New relation
}
```

### Comparison: Note vs Message Architecture

| Aspect | Note Model (Legacy) | Message Model (New) |
|--------|---------------------|---------------------|
| **Organization** | Standalone notes | Messages grouped in threads |
| **Context** | Individual notes | Conversation context |
| **Input Types** | Text, file, image, voice (via dropType) | Explicit MessageType enum |
| **Transcription** | Not stored | Stored in `transcription` field |
| **Metadata** | Fixed fields | Flexible JSON `metadata` field |
| **Clustering** | Per-note clustering | Per-message + thread-level organization |
| **UI Pattern** | List/grid of notes | Chat interface with threads |

## Updated AI Flow

### Per-Message Processing Pipeline

```
User Drop → Message Creation → Background Processing
                                    ↓
                    ┌──────────────┴──────────────┐
                    ↓                              ↓
            Embedding Generation          Classification
                    ↓                              ↓
            Vector Storage (pgvector)    Thread Matching
                    ↓                              ↓
            Similarity Search            Title/Tag Generation
                    ↓                              ↓
            Thread Association          Thread Update
```

### 1. Embedding Generation

Every message (text or transcribed audio) generates an embedding:

```typescript
// Pseudocode for message embedding
async function embedMessage(messageId: string) {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  
  // For text messages, use content directly
  // For audio, use transcription
  const textToEmbed = message.type === 'audio' 
    ? message.transcription 
    : message.content;
  
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: textToEmbed,
  });
  
  await prisma.message.update({
    where: { id: messageId },
    data: { embedding: embedding.data[0].embedding },
  });
}
```

### 2. Classification and Thread Matching

Messages are classified and matched to existing threads based on semantic similarity:

```typescript
// Pseudocode for thread matching
async function classifyAndMatchThread(messageId: string) {
  const message = await prisma.message.findUnique({ 
    where: { id: messageId },
    include: { thread: true }
  });
  
  // Generate embedding if not exists
  if (!message.embedding) {
    await embedMessage(messageId);
    message = await prisma.message.findUnique({ where: { id: messageId } });
  }
  
  // Find similar messages using pgvector
  const similarMessages = await prisma.$queryRaw`
    SELECT m.id, m.thread_id, 
           (m.embedding <=> ${message.embedding}::vector) as distance
    FROM messages m
    WHERE m.user_id = ${message.userId}
      AND m.id != ${message.id}
      AND m.embedding IS NOT NULL
    ORDER BY distance
    LIMIT 5
  `;
  
  // If similarity threshold met, use existing thread
  const SIMILARITY_THRESHOLD = 0.3; // Cosine distance
  const bestMatch = similarMessages[0];
  
  let threadId = message.threadId;
  if (bestMatch && bestMatch.distance < SIMILARITY_THRESHOLD) {
    threadId = bestMatch.thread_id;
    await prisma.message.update({
      where: { id: messageId },
      data: { threadId },
    });
  }
  
  // Classify message and update thread
  const classification = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Classify this message and suggest thread title and tags." },
      { role: "user", content: message.content || message.transcription },
    ],
  });
  
  // Update thread with classification
  await prisma.conversationThread.update({
    where: { id: threadId },
    data: {
      title: classification.title || undefined,
      system_tags: classification.tags || [],
    },
  });
}
```

### 3. Audio Transcription

Audio messages are transcribed using OpenAI Whisper:

```typescript
// Pseudocode for audio transcription
async function transcribeAudio(messageId: string) {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  
  if (message.type !== 'audio' || !message.fileUrl) {
    throw new Error('Message is not an audio type');
  }
  
  // Download audio from Supabase Storage
  const audioBuffer = await downloadFromStorage(message.fileUrl);
  
  // Transcribe using OpenAI Whisper
  const transcription = await openai.audio.transcriptions.create({
    file: audioBuffer,
    model: "whisper-1",
    language: "en",
    response_format: "text",
  });
  
  // Store transcription
  await prisma.message.update({
    where: { id: messageId },
    data: { transcription: transcription.text },
  });
  
  // Generate embedding from transcription
  await embedMessage(messageId);
}
```

## Revised Data Flow Diagram

### Chat-Centric Data Flow

```
┌─────────────────┐
│   User Drop     │
│  (text/audio/   │
│  image/file)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  DropComposer   │
│  (UI Component) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐
│  POST /api/     │───►│  Supabase      │
│  messages/create│    │  Storage        │
└────────┬────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Message Record │
│  (Prisma)       │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
│  Embedding      │ │ Transcription│ │ Classification│
│  (OpenAI)       │ │ (Whisper)    │ │ (GPT-4o-mini)│
└────────┬────────┘ └──────┬───────┘ └──────┬───────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────────────────────────────────────┐
│  Thread Matching & Organization                │
│  (pgvector similarity search)                  │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ ConversationThread│
│  (with title &   │
│   system_tags)   │
└─────────────────┘
```

## Feature Naming Mapping

| Old Feature Name | New Feature Name | Notes |
|-----------------|------------------|-------|
| Notes | Messages | Individual items in a conversation |
| MindStorm | Threads/Topics | Clustered conversation threads |
| QuickCapture | DropComposer | Input interface for messages |
| Smart Stacks | Smart Threads | AI-organized thread collections |
| Stream | Chat | Main chat interface |
| Note Tags | System Tags | AI-generated organization tags |

## Route and Layout Hierarchy

### New Chat Routes

```
app/
├── (app)/
│   ├── chat/
│   │   ├── page.tsx              # Main chat interface
│   │   └── components/
│   │       ├── DropComposer.tsx  # Input bar
│   │       ├── MessageBubble.tsx # Message rendering
│   │       ├── ThreadList.tsx    # Left sidebar
│   │       └── InsightStrip.tsx # Right AI panel
│   ├── threads/                  # Thread browser (future)
│   └── ... (existing routes)
```

### Layout Structure

```
app/(app)/layout.tsx (AppShell)
└── app/(app)/chat/page.tsx
    ├── ThreadList (left sidebar)
    ├── ChatView (center)
    │   └── MessageBubble[] (messages)
    └── InsightStrip (right panel)
        └── DropComposer (bottom)
```

### Route Protection

Chat routes are protected by:
1. Supabase Auth middleware (existing)
2. Feature flag: `chat-interface` (new)

## Integration Notes

### BaseHub

**No changes required.** BaseHub continues to serve marketing content (pages, features, blog, legal) as before. The chat interface is an app feature and doesn't affect marketing content.

### Supabase

#### Row-Level Security (RLS)

New tables require RLS policies:

```sql
-- Enable RLS on conversation_threads
ALTER TABLE conversation_threads ENABLE ROW LEVEL SECURITY;

-- Users can only see their own threads
CREATE POLICY "Users can view own threads"
ON conversation_threads FOR SELECT
USING ((SELECT auth.uid()) = user_id);

-- Users can create their own threads
CREATE POLICY "Users can create own threads"
ON conversation_threads FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can update their own threads
CREATE POLICY "Users can update own threads"
ON conversation_threads FOR UPDATE
USING ((SELECT auth.uid()) = user_id);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only see messages in their threads
CREATE POLICY "Users can view own messages"
ON messages FOR SELECT
USING (
  thread_id IN (
    SELECT id FROM conversation_threads 
    WHERE user_id = (SELECT auth.uid())
  )
);

-- Users can create messages in their threads
CREATE POLICY "Users can create own messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
  thread_id IN (
    SELECT id FROM conversation_threads 
    WHERE user_id = (SELECT auth.uid())
  )
  AND user_id = (SELECT auth.uid())
);
```

#### Supabase Storage

File attachments (images, audio, files) are stored in Supabase Storage:

```typescript
// Pseudocode for file upload
async function uploadFile(file: File, userId: string): Promise<string> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('message-attachments')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('message-attachments')
    .getPublicUrl(fileName);
  
  return publicUrl;
}
```

**Storage Bucket Setup:**
- Bucket name: `message-attachments`
- Public: `false` (private bucket)
- RLS policies: Users can only access their own files

## Migration Plan

### Phase 1: Coexistence

**Goal:** Both Note and Message models active, no breaking changes.

**Actions:**
1. Add ConversationThread and Message models to Prisma schema
2. Run migration: `npx prisma migrate dev --name add_conversation_message_models`
3. Enable RLS on new tables
4. Deploy with feature flag `chat-interface` disabled by default

**Timeline:** Week 1

### Phase 2: Dual-Write

**Goal:** New UX endpoints create Messages, existing Notes remain.

**Actions:**
1. Implement `/api/messages/create` endpoint
2. Implement chat UI components
3. Enable `chat-interface` feature flag for beta users
4. Monitor usage and gather feedback

**Timeline:** Week 2-3

### Phase 3: Migration Script

**Goal:** Convert existing Notes to Messages within auto-created threads.

**Pseudocode:**

```typescript
async function migrateNotesToMessages() {
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    });
    
    // Group notes by cluster or create individual threads
    const notesByCluster = groupBy(notes, (n) => n.cluster || 'unclustered');
    
    for (const [cluster, clusterNotes] of Object.entries(notesByCluster)) {
      // Create thread from first note or cluster name
      const threadTitle = clusterNotes[0].content.slice(0, 50) || `Thread ${cluster}`;
      
      const thread = await prisma.conversationThread.create({
        data: {
          userId: user.id,
          title: threadTitle,
          system_tags: extractTags(clusterNotes),
        },
      });
      
      // Convert notes to messages
      for (const note of clusterNotes) {
        await prisma.message.create({
          data: {
            type: mapNoteTypeToMessageType(note.type, note.dropType),
            content: note.content,
            fileUrl: note.fileUrl,
            transcription: null, // Not available for legacy notes
            metadata: {
              migratedFrom: 'note',
              originalNoteId: note.id,
              originalType: note.type,
            },
            embedding: note.embedding, // Copy existing embedding
            threadId: thread.id,
            userId: user.id,
            createdAt: note.createdAt,
          },
        });
      }
    }
  }
}

function mapNoteTypeToMessageType(noteType: string, dropType?: string): MessageType {
  if (dropType === 'voice') return 'audio';
  if (dropType === 'image') return 'image';
  if (dropType === 'file') return 'file';
  if (noteType === 'link') return 'link';
  return 'text';
}
```

**Timeline:** Week 4

### Phase 4: Deprecation

**Goal:** Note model marked as deprecated, new features use Messages only.

**Actions:**
1. Mark Note endpoints as deprecated in API docs
2. Update UI to use Messages exclusively
3. Keep Note model for read-only access during transition
4. Plan eventual removal (6+ months)

**Timeline:** Week 5+

## Index and Performance Guidance

### Recommended Indexes

```prisma
// ConversationThread indexes
@@index([userId, createdAt]) // User thread queries, chronological

// Message indexes
@@index([threadId, createdAt]) // Thread message ordering
@@index([userId, createdAt]) // User message queries
```

### Performance Considerations

1. **Embedding Generation**: Run asynchronously in background to avoid blocking message creation
2. **Thread Matching**: Use pgvector similarity search with LIMIT to avoid full table scans
3. **Pagination**: Always paginate thread and message queries (default: 50 items)
4. **Caching**: Cache thread summaries and recent messages in Redis (future optimization)

### Query Patterns

```typescript
// Get user's threads (paginated)
const threads = await prisma.conversationThread.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
  take: 50,
  skip: page * 50,
  include: {
    messages: {
      take: 1,
      orderBy: { createdAt: 'desc' },
    },
  },
});

// Get messages in a thread (paginated)
const messages = await prisma.message.findMany({
  where: { threadId },
  orderBy: { createdAt: 'asc' },
  take: 100,
  skip: page * 100,
});
```

## Example API Shapes

### Create Message Request

```typescript
// POST /api/messages/create
{
  type: "text" | "audio" | "image" | "file" | "link",
  content?: string, // Required for text type
  file?: File, // Required for audio/image/file types
  url?: string, // Required for link type
  threadId?: string, // Optional: create new thread if not provided
}
```

### Create Message Response

```typescript
{
  success: true,
  data: {
    id: string,
    type: MessageType,
    content: string | null,
    fileUrl: string | null,
    transcription: string | null,
    threadId: string,
    userId: string,
    createdAt: string,
    thread: {
      id: string,
      title: string | null,
      system_tags: string[],
    },
  },
  error: null,
}
```

### Embed Message Request

```typescript
// POST /api/messages/embed
{
  messageId: string,
}
```

### Classify Message Request

```typescript
// POST /api/messages/classify
{
  messageId: string,
}
```

## References

- **Base Architecture:** `/docs/architecture.md`
- **Database Schema:** `/docs/database.md`
- **Supabase Integration:** `/docs/internal/supabase-auth-config.md`
- **Vault Security:** `/docs/vault.md`

