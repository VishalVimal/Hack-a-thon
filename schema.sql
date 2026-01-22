-- 1. Profiles Table (Extends auth.users)
create table public.profiles (
  id uuid references auth.users not null,
  email text,
  full_name text,
  role text check (role in ('candidate', 'recruiter')) default 'candidate',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. Jobs Table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  skills_required text[], -- Array of strings
  recruiter_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.jobs enable row level security;

create policy "Jobs are viewable by everyone."
  on jobs for select
  using ( true );

create policy "Recruiters can insert jobs."
  on jobs for insert
  with check ( auth.uid() = recruiter_id );

-- 3. Applications Table
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) not null,
  candidate_id uuid references public.profiles(id) not null,
  resume_path text not null, -- Path in Storage
  status text default 'submitted',
  score numeric, -- For AI ranking
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.applications enable row level security;

create policy "Candidates can view own applications."
  on applications for select
  using ( auth.uid() = candidate_id );

create policy "Recruiters can view applications for their jobs."
  on applications for select
  using ( exists (
    select 1 from jobs
    where jobs.id = applications.job_id
    and jobs.recruiter_id = auth.uid()
  ));

create policy "Candidates can insert applications."
  on applications for insert
  with check ( auth.uid() = candidate_id );

-- 4. Storage Bucket Setup (Run this in SQL Editor isn't enough, must create bucket in UI usually, but policies help)
-- Make sure to create a bucket named 'resumes' in the dashboard first!
