-- Seed data for MVP demo
-- This creates a demo user and sample notes for testing

-- Insert demo user
INSERT INTO public.users (id, email, created_at, updated_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'demo@klutr.app',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample notes for demo
INSERT INTO public.notes (id, user_id, content, type, created_at)
VALUES
  (
    'b0000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Build a note-taking app with AI-powered organization',
    'idea',
    NOW() - INTERVAL '5 days'
  ),
  (
    'b0000000-0000-0000-0000-000000000002'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Research vector databases for similarity search',
    'task',
    NOW() - INTERVAL '4 days'
  ),
  (
    'b0000000-0000-0000-0000-000000000003'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Meeting with Sarah about product roadmap',
    'misc',
    NOW() - INTERVAL '3 days'
  ),
  (
    'b0000000-0000-0000-0000-000000000004'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Check out Supabase documentation for Edge Functions',
    'link',
    NOW() - INTERVAL '2 days'
  ),
  (
    'b0000000-0000-0000-0000-000000000005'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Implement end-to-end encryption for vault feature',
    'task',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample tags
INSERT INTO public.tags (id, user_id, name)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'product'
  ),
  (
    'c0000000-0000-0000-0000-000000000002'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'technical'
  ),
  (
    'c0000000-0000-0000-0000-000000000003'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'meeting'
  )
ON CONFLICT (user_id, name) DO NOTHING;

-- Link notes to tags
INSERT INTO public.note_tags (note_id, tag_id)
VALUES
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid),
  ('b0000000-0000-0000-0000-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid),
  ('b0000000-0000-0000-0000-000000000003'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid),
  ('b0000000-0000-0000-0000-000000000004'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid),
  ('b0000000-0000-0000-0000-000000000005'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid)
ON CONFLICT DO NOTHING;
