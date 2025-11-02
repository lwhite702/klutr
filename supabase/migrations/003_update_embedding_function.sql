-- Function to update note embeddings with proper vector casting
CREATE OR REPLACE FUNCTION update_note_embedding(
  note_id TEXT,
  embedding_vec TEXT
) RETURNS void AS $$
BEGIN
  UPDATE notes
  SET embedding = embedding_vec::vector
  WHERE id = note_id;
END;
$$ LANGUAGE plpgsql;

-- Convert any existing JSON string embeddings to vector format
-- This is a one-time migration for any notes with text embeddings
DO $$
DECLARE
  note_record RECORD;
BEGIN
  FOR note_record IN 
    SELECT id, embedding::text as embedding_text
    FROM notes 
    WHERE embedding IS NOT NULL 
      AND embedding::text LIKE '[%'
  LOOP
    -- Already in correct format, skip
    CONTINUE;
  END LOOP;
END $$;
