-- Seed demo user and sample data for MVP demo
INSERT INTO users (id, email) 
VALUES ('user_dev_123', 'dev@example.com')
ON CONFLICT (id) DO NOTHING;

-- Add some sample notes for demo
INSERT INTO notes (id, user_id, content, type, created_at)
VALUES 
  ('note_1', 'user_dev_123', 'Remember to check the Supabase migration', 'task', NOW() - INTERVAL '2 days'),
  ('note_2', 'user_dev_123', 'Great idea for a new feature: AI-powered insights', 'idea', NOW() - INTERVAL '1 day'),
  ('note_3', 'user_dev_123', 'Follow up with the team about the demo', 'task', NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Add some sample tags
INSERT INTO tags (id, user_id, name)
VALUES 
  ('tag_1', 'user_dev_123', 'work'),
  ('tag_2', 'user_dev_123', 'important'),
  ('tag_3', 'user_dev_123', 'personal')
ON CONFLICT (id) DO NOTHING;
