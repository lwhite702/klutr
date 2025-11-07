-- AI Sessions table for tracking Spark and Muse usage
CREATE TABLE IF NOT EXISTS ai_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text CHECK (feature IN ('spark', 'muse')),
  created_at timestamptz DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_sessions_user_id ON ai_sessions(user_id);

-- Create index on feature for analytics
CREATE INDEX IF NOT EXISTS idx_ai_sessions_feature ON ai_sessions(feature);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_ai_sessions_created_at ON ai_sessions(created_at);

-- Embedding index for vector similarity search (if not already exists)
-- Using L2 distance for cosine similarity (ivfflat with lists=100 for performance)
CREATE INDEX IF NOT EXISTS notes_embedding_idx ON notes 
USING ivfflat (embedding vector_l2_ops) 
WITH (lists = 100);

