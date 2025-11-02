-- Seed a demo user for MVP testing
INSERT INTO users (id, email) 
VALUES ('user_dev_123', 'dev@example.com')
ON CONFLICT (id) DO NOTHING;

-- Seed some demo notes for testing
INSERT INTO notes (id, user_id, content, type, created_at)
VALUES 
  ('note_1', 'user_dev_123', 'Buy groceries: milk, eggs, bread', 'task', NOW() - INTERVAL '1 day'),
  ('note_2', 'user_dev_123', 'Great idea for a blog post about AI in healthcare', 'idea', NOW() - INTERVAL '2 days'),
  ('note_3', 'user_dev_123', 'Contact info: John Doe - john@example.com', 'contact', NOW() - INTERVAL '3 days'),
  ('note_4', 'user_dev_123', 'https://example.com/useful-resource', 'link', NOW() - INTERVAL '4 days'),
  ('note_5', 'user_dev_123', 'Random thought about the weather', 'misc', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Seed some demo tags
INSERT INTO tags (id, user_id, name)
VALUES 
  ('tag_1', 'user_dev_123', 'personal'),
  ('tag_2', 'user_dev_123', 'work'),
  ('tag_3', 'user_dev_123', 'ideas')
ON CONFLICT DO NOTHING;

-- Link notes to tags
INSERT INTO note_tags (note_id, tag_id)
VALUES 
  ('note_1', 'tag_1'),
  ('note_2', 'tag_3'),
  ('note_2', 'tag_2')
ON CONFLICT DO NOTHING;
