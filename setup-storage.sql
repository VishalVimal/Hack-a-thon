-- Enable Storage
-- Make sure you have enabled Storage in your Supabase project dashboard first.

-- Create the 'resumes' bucket if it doesn't exist through SQL (if supported by your permission level)
-- Alternatively, create it manually in the Storage section of the Supabase Dashboard.
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload resumes
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

-- Policy: Allow authenticated users to view/download resumes
CREATE POLICY "Allow authenticated downloads"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'resumes');
