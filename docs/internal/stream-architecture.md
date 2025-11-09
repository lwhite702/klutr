# Stream Architecture

## Overview

The Stream is the core interface of Klutr's redesigned architecture. It replaces traditional note views with a chat-style conversational feed where all user input flows naturally and is auto-organized on the backend.

## Component Architecture

### Core Components

- **StreamInput** (`/components/stream/StreamInput.tsx`)

  - Chat-style input bar at bottom of screen
  - Supports text, file upload, and voice recording (placeholder)
  - Fixed position, expands on focus
  - Optimistic updates for instant feedback

- **StreamMessage** (`/components/stream/StreamMessage.tsx`)

  - Unified message bubble component
  - User messages: right-aligned, coral background
  - System/AI messages: left-aligned, mint background
  - Displays file previews, image thumbnails, timestamps, and tags

- **TagChips** (`/components/stream/TagChips.tsx`)

  - Dynamically displays detected tags
  - Color-coded with brand colors
  - Clickable for filtering

- **DropZone** (`/components/stream/DropZone.tsx`)

  - Overlay component for drag-and-drop file uploads
  - Visual feedback on drag over
  - Supports multiple file types

- **AutoSummary** (`/components/stream/AutoSummary.tsx`)
  - Placeholder for future AI summarization
  - Shows "AI is analyzing..." state

## Data Flow

1. User adds drop (text/file/voice) via StreamInput
2. Drop is optimistically added to Stream
3. AI tagging runs in background (`tagNotes()`)
4. Drop is updated with detected tags
5. Drop is automatically organized into Boards based on tags

## State Management

- Stream drops fetched from `/api/stream/list` on mount
- Optimistic updates for instant feedback
- Background AI processing doesn't block UI
- Error boundaries for graceful error handling
- Loading states with skeleton loaders

## AI Integration Points

### Current Implementation

- `tagNotes()` - Enhanced keyword-based tagging with scoring
- `classifyDrop()` - File type classification
- `summarizeStream()` - Connected to OpenAI for real summaries
- `suggestBoard()` - Improved board suggestions with content analysis
- `analyzeMuse()` - Connected to OpenAI for weekly insights with JSON response

### API Routes

- `POST /api/stream/create` - Create new Stream drop with AI tagging
- `GET /api/stream/list` - List Stream drops with pagination
- `GET /api/stream/search` - Search drops by content, filename, and tags
- `POST /api/stream/upload` - Upload files to Supabase Storage
- `DELETE /api/stream/[id]` - Delete Stream drop
- `GET /api/boards/list` - List all boards
- `POST /api/boards/create` - Create new board
- `GET /api/boards/[id]` - Get board details
- `PATCH /api/boards/[id]` - Update board
- `DELETE /api/boards/[id]` - Delete board

### Future Enhancements

- Connect to OpenAI embeddings for semantic tagging
- Use Supabase vector search for similarity matching
- Implement real-time AI processing via edge functions
- Add streaming responses for AI-generated content
- Voice note transcription via OpenAI Whisper

## Data Storage

- Stream drops stored in PostgreSQL via Prisma
- Files stored in Supabase Storage bucket `stream-files`
- Boards stored in PostgreSQL with many-to-many relationship to notes
- AI embeddings stored in PostgreSQL vector columns (future)

## Routes

- `/app/stream` - Main Stream interface
- `/app/boards` - Board listing page
- `/app/boards/[boardId]` - Board detail with filtered Stream
- `/app/muse` - Weekly insights (redesigned)
- `/app/search` - Search across Stream
- `/app/vault` - Encrypted notes (updated)

## Design Patterns

### Chat UI (from Horizon AI Template)

- Message bubbles with rounded corners
- Clear user/AI distinction via color
- Fixed input at bottom
- Smooth scrolling to latest
- Loading states and typing indicators

### Brand Colors

- User messages: Coral (#FF6F61) background, white text
- AI/System messages: Mint (#4CD7C2) background, charcoal text
- Tags: Mint background with charcoal text

## Error Handling & UX

- Error boundaries (StreamErrorBoundary) for graceful error recovery
- Skeleton loaders (StreamSkeleton) for loading states
- Toast notifications for user feedback
- Retry mechanisms for failed operations
- Keyboard shortcuts (Cmd+K for search, Cmd+N for new drop)
- Debounced search queries
- Optimistic updates with rollback on error

## File Upload

- Files uploaded to Supabase Storage via `/api/stream/upload`
- File validation (size limits, type restrictions)
- Image optimization (future: thumbnails via Supabase Image Transform)
- Voice notes recorded via Web Audio API and uploaded as audio files

## Future Enhancements

1. Real-time synchronization across devices
2. Voice note transcription via OpenAI Whisper
3. Image OCR and content extraction
4. Advanced search with semantic understanding using embeddings
5. Collaborative boards (team features)
6. Export and backup functionality
7. Pagination and virtual scrolling for large streams
8. Background job processing for AI operations
