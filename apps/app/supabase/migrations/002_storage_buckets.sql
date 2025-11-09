-- Create storage buckets for file uploads
-- Note: These will be created via Supabase dashboard or API, but documenting here

-- Bucket for images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Bucket for voice memos
-- INSERT INTO storage.buckets (id, name, public) VALUES ('voice-memos', 'voice-memos', true);

-- Bucket for other files
-- INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true);

-- Storage policies (will be created when auth is enabled)
-- For now, all buckets will be public-read, private-write

-- Policy: Allow authenticated users to upload files
-- CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'images' OR bucket_id = 'voice-memos' OR bucket_id = 'files');

-- Policy: Allow public read access
-- CREATE POLICY "Public can read files" ON storage.objects FOR SELECT
--   USING (bucket_id = 'images' OR bucket_id = 'voice-memos' OR bucket_id = 'files');

-- Policy: Allow users to delete own files
-- CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE
--   USING (bucket_id = 'images' OR bucket_id = 'voice-memos' OR bucket_id = 'files');
