-- Seed Data for Recruitment Portal

-- 1. Create a mock recruiter profile (You might need to replace the ID with your own actual User ID from auth.users if you want to manage these)
-- Since we can't easily guess a valid auth.users UUID, we will assume you will running this AFTER creating a user in the dashboard.
-- OR, we can insert jobs with a placeholder UUID if RLS is temporarily disabled, but that's risky.

-- BETTER APPROACH: Run this logic to insert jobs linked to 'auth.uid()' when you paste this into the SQL Editor while signed in? 
-- No, SQL Editor runs as admin/postgres. 

-- Let's create a specific mock user and jobs linked to them.
-- NOTE: In Supabase, you usually need an entry in `auth.users` first.
-- The safest way for a demo is to insert Jobs with a dummy UUID, and then likely disable RLS for the 'jobs' READ policy (which we already did: "Jobs are viewable by everyone").

-- Sample Jobs Data
INSERT INTO public.jobs (title, description, skills_required, recruiter_id)
VALUES 
(
  'Senior Frontend Developer', 
  'We are looking for a React expert to lead our frontend team. You will work with modern stack: Vite, Tailwind, Supabase. Remote friendly.', 
  ARRAY['React', 'TypeScript', 'Tailwind', 'Figma'],
  '00000000-0000-0000-0000-000000000000'::uuid -- Placeholder ID (Constraint might fail if profile doesn't exist)
),
(
  'Machine Learning Engineer', 
  'Join our AI team to build recommendation engines. Experience with Python, Scikit-learn, and NLP is a must.', 
  ARRAY['Python', 'PyTorch', 'NLP', 'SQL'],
  '00000000-0000-0000-0000-000000000000'::uuid
),
(
  'Product Designer', 
  'Design beautiful and functional interfaces for our recruitment product. Minimalist aesthetic preferred.', 
  ARRAY['Figma', 'Prototyping', 'UX Research'],
  '00000000-0000-0000-0000-000000000000'::uuid
);

-- IMPORTANT: 
-- The above will fail foreign key constraints if the recruiter_id doesn't exist in `profiles`.
-- To fix this for the DEMO, let's create a dummy profile first.

INSERT INTO public.profiles (id, email, full_name, role)
VALUES 
('00000000-0000-0000-0000-000000000000'::uuid, 'demo_recruiter@example.com', 'Demo Recruiter', 'recruiter')
ON CONFLICT (id) DO NOTHING;
