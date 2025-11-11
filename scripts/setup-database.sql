-- Klutr Database Setup Script
-- Run this after Prisma schema has been pushed

-- ========================================
-- Enable Extensions
-- ========================================

CREATE EXTENSION IF NOT EXISTS vector;

-- ========================================
-- Create Vector Indexes
-- ========================================

-- Notes embedding index (for similarity search)
CREATE INDEX IF NOT EXISTS notes_embedding_idx ON notes 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Messages embedding index (for similarity search)
CREATE INDEX IF NOT EXISTS messages_embedding_idx ON messages 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ========================================
-- Full-Text Search Indexes
-- ========================================

-- Notes content search
CREATE INDEX IF NOT EXISTS notes_content_search_idx ON notes 
USING gin(to_tsvector('english', content));

-- Messages content search
CREATE INDEX IF NOT EXISTS messages_content_search_idx ON messages 
USING gin(to_tsvector('english', COALESCE(content, '')));

-- Conversation thread titles
CREATE INDEX IF NOT EXISTS conversation_threads_title_search_idx ON conversation_threads 
USING gin(to_tsvector('english', COALESCE(title, '')));

-- ========================================
-- Analytics Indexes
-- ========================================

-- Note creation time (for time-series queries)
CREATE INDEX IF NOT EXISTS notes_createdAt_idx ON notes ("createdAt");

-- Message type and time (for analytics)
CREATE INDEX IF NOT EXISTS messages_type_createdAt_idx ON messages (type, "createdAt");

-- User message activity
CREATE INDEX IF NOT EXISTS messages_userId_type_createdAt_idx 
  ON messages ("userId", type, "createdAt");

-- ========================================
-- Verify Setup
-- ========================================

-- Check extensions
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Check indexes
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verify vector dimensions
SELECT
  COUNT(*) as notes_with_embeddings,
  AVG(array_length(embedding::float[], 1)) as avg_dimensions
FROM notes
WHERE embedding IS NOT NULL;

SELECT
  COUNT(*) as messages_with_embeddings,
  AVG(array_length(embedding::float[], 1)) as avg_dimensions
FROM messages
WHERE embedding IS NOT NULL;
