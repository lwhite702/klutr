-- Klutr Row Level Security Policies
-- Run this script on your Supabase database to enable RLS

-- ========================================
-- Enable RLS on all tables
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Users Table Policies
-- ========================================

CREATE POLICY "Users can read own data"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own data"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ========================================
-- Notes Table Policies
-- ========================================

CREATE POLICY "Users can read own notes"
ON notes FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can create own notes"
ON notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own notes"
ON notes FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own notes"
ON notes FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ========================================
-- Tags Table Policies
-- ========================================

CREATE POLICY "Users can read own tags"
ON tags FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can create own tags"
ON tags FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own tags"
ON tags FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own tags"
ON tags FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ========================================
-- Note Tags Table Policies
-- ========================================

CREATE POLICY "Users can read own note tags"
ON note_tags FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_tags."noteId"
    AND notes."userId" = auth.uid()
  )
);

CREATE POLICY "Users can create own note tags"
ON note_tags FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_tags."noteId"
    AND notes."userId" = auth.uid()
  )
);

CREATE POLICY "Users can delete own note tags"
ON note_tags FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_tags."noteId"
    AND notes."userId" = auth.uid()
  )
);

-- ========================================
-- Smart Stacks Table Policies
-- ========================================

CREATE POLICY "Users can read own stacks"
ON smart_stacks FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can create own stacks"
ON smart_stacks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own stacks"
ON smart_stacks FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own stacks"
ON smart_stacks FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ========================================
-- Weekly Insights Table Policies
-- ========================================

CREATE POLICY "Users can read own insights"
ON weekly_insights FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can create own insights"
ON weekly_insights FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own insights"
ON weekly_insights FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ========================================
-- Vault Notes Table Policies
-- ========================================

CREATE POLICY "Users can read own vault notes"
ON vault_notes FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can create own vault notes"
ON vault_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own vault notes"
ON vault_notes FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ========================================
-- Boards Table Policies
-- ========================================

CREATE POLICY "Users can read own boards"
ON boards FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can create own boards"
ON boards FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own boards"
ON boards FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own boards"
ON boards FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ========================================
-- Board Notes Table Policies
-- ========================================

CREATE POLICY "Users can read own board notes"
ON board_notes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = board_notes."boardId"
    AND boards."userId" = auth.uid()
  )
);

CREATE POLICY "Users can create own board notes"
ON board_notes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = board_notes."boardId"
    AND boards."userId" = auth.uid()
  )
);

CREATE POLICY "Users can delete own board notes"
ON board_notes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = board_notes."boardId"
    AND boards."userId" = auth.uid()
  )
);

-- ========================================
-- Conversation Threads Table Policies
-- ========================================

CREATE POLICY "Users can read own threads"
ON conversation_threads FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can create own threads"
ON conversation_threads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own threads"
ON conversation_threads FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own threads"
ON conversation_threads FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ========================================
-- Messages Table Policies
-- ========================================

CREATE POLICY "Users can read own messages"
ON messages FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can create own messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own messages"
ON messages FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own messages"
ON messages FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ========================================
-- Verify RLS is enabled
-- ========================================

SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
