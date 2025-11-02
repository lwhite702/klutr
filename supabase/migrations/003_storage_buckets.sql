-- Create storage buckets for file uploads
-- Note: This is SQL representation; actual bucket creation should be done via Supabase dashboard or API

-- Files bucket for general attachments (images, voice memos, documents)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'files',
  'files',
  false, -- Private bucket
  10485760, -- 10MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/webm', 'application/pdf', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for files bucket
-- Allow all operations for now (will be restricted when auth is enabled)
CREATE POLICY "Allow all uploads for now"
  ON storage.objects
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (bucket_id = 'files');

CREATE POLICY "Allow all downloads for now"
  ON storage.objects
  FOR SELECT
  TO authenticated, anon
  USING (bucket_id = 'files');

CREATE POLICY "Allow all updates for now"
  ON storage.objects
  FOR UPDATE
  TO authenticated, anon
  USING (bucket_id = 'files');

CREATE POLICY "Allow all deletes for now"
  ON storage.objects
  FOR DELETE
  TO authenticated, anon
  USING (bucket_id = 'files');

-- Service role can access everything
CREATE POLICY "Service role can access all files"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'files');
