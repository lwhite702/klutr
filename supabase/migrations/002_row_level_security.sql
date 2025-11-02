-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_notes ENABLE ROW LEVEL SECURITY;

-- Note: For MVP demo, we'll keep RLS policies simple and not enforce auth
-- These policies allow all operations for now (auth will be added later)

-- Users table policies
CREATE POLICY "Allow all operations on users for now"
  ON public.users
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Notes table policies
CREATE POLICY "Allow all operations on notes for now"
  ON public.notes
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Tags table policies
CREATE POLICY "Allow all operations on tags for now"
  ON public.tags
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Note_tags table policies
CREATE POLICY "Allow all operations on note_tags for now"
  ON public.note_tags
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Smart_stacks table policies
CREATE POLICY "Allow all operations on smart_stacks for now"
  ON public.smart_stacks
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Weekly_insights table policies
CREATE POLICY "Allow all operations on weekly_insights for now"
  ON public.weekly_insights
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Vault_notes table policies
CREATE POLICY "Allow all operations on vault_notes for now"
  ON public.vault_notes
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Service role bypass (for Edge Functions and admin operations)
CREATE POLICY "Service role can access all users"
  ON public.users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all notes"
  ON public.notes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all tags"
  ON public.tags
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all note_tags"
  ON public.note_tags
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all smart_stacks"
  ON public.smart_stacks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all weekly_insights"
  ON public.weekly_insights
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all vault_notes"
  ON public.vault_notes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
