-- RPC function to update note embedding
CREATE OR REPLACE FUNCTION update_note_embedding(
  note_id_param TEXT,
  embedding_param vector(1536)
) RETURNS void AS $$
BEGIN
  UPDATE notes
  SET embedding = embedding_param
  WHERE id = note_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
