-- Migration: Add conversation_threads and messages tables for chat functionality
-- This completes the migration from Prisma to Supabase

-- Conversation Threads table
CREATE TABLE IF NOT EXISTS conversation_threads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT,
  system_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT NOT NULL CHECK (type IN ('text', 'audio', 'image', 'file', 'link')),
  content TEXT,
  file_url TEXT,
  transcription TEXT,
  metadata JSONB,
  embedding vector(1536),
  thread_id TEXT NOT NULL REFERENCES conversation_threads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for conversation_threads
CREATE INDEX IF NOT EXISTS idx_conversation_threads_user_created ON conversation_threads(user_id, created_at);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_thread_created ON messages(thread_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_embedding ON messages USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100) WHERE embedding IS NOT NULL;

-- Comments for documentation
COMMENT ON TABLE conversation_threads IS 'Chat conversation threads that group related messages';
COMMENT ON TABLE messages IS 'Individual messages within conversation threads, supporting text, audio, image, file, and link types';
COMMENT ON COLUMN conversation_threads.system_tags IS 'AI-generated organization tags for automatic categorization';
COMMENT ON COLUMN messages.type IS 'Message type: text, audio, image, file, or link';
COMMENT ON COLUMN messages.metadata IS 'Flexible JSON field for additional message data (e.g., image dimensions, file size, link preview)';
COMMENT ON COLUMN messages.embedding IS 'Vector embedding for semantic similarity search and clustering';

