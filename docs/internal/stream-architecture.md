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

- Stream drops stored in component state (will migrate to global state/API)
- Optimistic updates for instant feedback
- Background AI processing doesn't block UI

## AI Integration Points

### Current (Placeholder)

- `tagNotes()` - Simple keyword-based tagging
- `classifyDrop()` - File type classification
- `summarizeStream()` - Mock stream summaries
- `suggestBoard()` - Mock board suggestions
- `analyzeMuse()` - Mock weekly insights

### Future

- Connect to OpenAI embeddings for semantic tagging
- Use Supabase vector search for similarity matching
- Implement real-time AI processing via edge functions
- Add streaming responses for AI-generated content

## Mock Data

Stream uses mock data from `/lib/mockData.ts`:

- `mockStreamDrops` - Array of StreamDrop objects
- `mockBoards` - Array of Board objects
- `mockMuseInsights` - Array of MuseInsight objects

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

## Future Enhancements

1. Real-time synchronization across devices
2. Voice note transcription
3. Image OCR and content extraction
4. Advanced search with semantic understanding
5. Collaborative boards (team features)
6. Export and backup functionality
