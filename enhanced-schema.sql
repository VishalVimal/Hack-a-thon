-- Enhanced Database Schema for Production Recruitment Platform
-- Run this AFTER the basic schema to add missing fields

-- Add missing fields to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS salary_min INTEGER,
ADD COLUMN IF NOT EXISTS salary_max INTEGER,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')) DEFAULT 'full-time',
ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead')) DEFAULT 'mid',
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS benefits TEXT[],
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('draft', 'open', 'closed', 'paused')) DEFAULT 'open',
ADD COLUMN IF NOT EXISTS application_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS remote_ok BOOLEAN DEFAULT false;

-- Add missing fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS salary_expectation_min INTEGER,
ADD COLUMN IF NOT EXISTS salary_expectation_max INTEGER,
ADD COLUMN IF NOT EXISTS availability TEXT CHECK (availability IN ('immediate', '2-weeks', '1-month', 'not-looking')) DEFAULT 'immediate';

-- Add missing fields to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS recruiter_notes TEXT,
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN IF NOT EXISTS interview_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS feedback TEXT,
ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Create interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES public.applications(id) NOT NULL,
  recruiter_id uuid REFERENCES public.profiles(id) NOT NULL,
  candidate_id uuid REFERENCES public.profiles(id) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table for candidate-recruiter communication
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES public.applications(id) NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) NOT NULL,
  receiver_id uuid REFERENCES public.profiles(id) NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create saved_jobs table for bookmarking
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id uuid REFERENCES public.profiles(id) NOT NULL,
  job_id uuid REFERENCES public.jobs(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(candidate_id, job_id)
);

-- Enable RLS for new tables
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interviews
CREATE POLICY "Users can view interviews they're involved in"
  ON interviews FOR SELECT
  USING (auth.uid() = recruiter_id OR auth.uid() = candidate_id);

CREATE POLICY "Recruiters can create interviews"
  ON interviews FOR INSERT
  WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Participants can update interviews"
  ON interviews FOR UPDATE
  USING (auth.uid() = recruiter_id OR auth.uid() = candidate_id);

-- RLS Policies for messages
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for saved_jobs
CREATE POLICY "Candidates can view their saved jobs"
  ON saved_jobs FOR SELECT
  USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can save jobs"
  ON saved_jobs FOR INSERT
  WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Candidates can remove saved jobs"
  ON saved_jobs FOR DELETE
  USING (auth.uid() = candidate_id);

-- Update applications policies to allow recruiters to update status
CREATE POLICY "Recruiters can update applications for their jobs"
  ON applications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = applications.job_id
    AND jobs.recruiter_id = auth.uid()
  ));

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to applications table
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();