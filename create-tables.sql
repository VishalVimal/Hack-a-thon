-- Complete Database Schema for Recruitment Portal
-- Copy and paste this entire script into Supabase SQL Editor

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL,
  email text,
  full_name text,
  role text CHECK (role IN ('candidate', 'recruiter')) DEFAULT 'candidate',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 2. Jobs Table
CREATE TABLE public.jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  skills_required text[], -- Array of strings
  recruiter_id uuid REFERENCES public.profiles(id) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone."
  ON jobs FOR SELECT
  USING ( true );

CREATE POLICY "Recruiters can insert jobs."
  ON jobs FOR INSERT
  WITH CHECK ( auth.uid() = recruiter_id );

-- 3. Applications Table
CREATE TABLE public.applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid REFERENCES public.jobs(id) NOT NULL,
  candidate_id uuid REFERENCES public.profiles(id) NOT NULL,
  resume_path text NOT NULL, -- Path in Storage
  status text DEFAULT 'submitted',
  score numeric, -- For AI ranking
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applications policies
CREATE POLICY "Candidates can view own applications."
  ON applications FOR SELECT
  USING ( auth.uid() = candidate_id );

CREATE POLICY "Recruiters can view applications for their jobs."
  ON applications FOR SELECT
  USING ( EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = applications.job_id
    AND jobs.recruiter_id = auth.uid()
  ));

CREATE POLICY "Candidates can insert applications."
  ON applications FOR INSERT
  WITH CHECK ( auth.uid() = candidate_id );

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'jobs', 'applications');