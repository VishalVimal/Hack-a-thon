-- Security Enhancements for Database Schema
-- Run this to add security-related fields for JWT, password hashing, and PDF verification

-- Add security fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add company_name to profiles for recruiters
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Create table for storing PDF hashes and metadata
CREATE TABLE IF NOT EXISTS public.resume_hashes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  file_hash TEXT NOT NULL,
  combined_hash TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  original_filename TEXT NOT NULL,
  upload_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster hash lookups
CREATE INDEX IF NOT EXISTS idx_resume_hashes_file_hash ON public.resume_hashes(file_hash);
CREATE INDEX IF NOT EXISTS idx_resume_hashes_user_id ON public.resume_hashes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_hashes_application_id ON public.resume_hashes(application_id);

-- Enable RLS for resume_hashes
ALTER TABLE public.resume_hashes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resume_hashes
CREATE POLICY "Users can view their own resume hashes"
  ON resume_hashes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume hashes"
  ON resume_hashes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Recruiters can view resume hashes for their job applications"
  ON resume_hashes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM applications a
    JOIN jobs j ON j.id = a.job_id
    WHERE a.id = resume_hashes.application_id
    AND j.recruiter_id = auth.uid()
  ));

-- Add PDF hash field to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS resume_hash TEXT,
ADD COLUMN IF NOT EXISTS resume_file_size INTEGER;

-- Create table for tracking login attempts and security events
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('login_success', 'login_failed', 'password_changed', 'account_locked', 'token_refreshed', 'suspicious_activity')),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for security events
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(event_type);

-- Enable RLS for security_events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for security_events
CREATE POLICY "Users can view their own security events"
  ON security_events FOR SELECT
  USING (auth.uid() = user_id);

-- Create table for token blacklist (for logout functionality)
CREATE TABLE IF NOT EXISTS public.token_blacklist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  user_id uuid REFERENCES public.profiles(id),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  blacklisted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for token blacklist
CREATE INDEX IF NOT EXISTS idx_token_blacklist_token_hash ON public.token_blacklist(token_hash);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_expires_at ON public.token_blacklist(expires_at);

-- Enable RLS for token_blacklist
ALTER TABLE public.token_blacklist ENABLE ROW LEVEL SECURITY;

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.token_blacklist
  WHERE expires_at < timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to check for duplicate PDF uploads
CREATE OR REPLACE FUNCTION check_duplicate_resume(p_file_hash TEXT, p_user_id UUID)
RETURNS TABLE (
  is_duplicate BOOLEAN,
  previous_upload_id UUID,
  previous_upload_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true as is_duplicate,
    id as previous_upload_id,
    upload_timestamp as previous_upload_date
  FROM public.resume_hashes
  WHERE file_hash = p_file_hash 
    AND user_id = p_user_id
  ORDER BY upload_timestamp DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TIMESTAMP WITH TIME ZONE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO public.security_events (user_id, event_type, ip_address, user_agent, metadata)
  VALUES (p_user_id, p_event_type, p_ip_address, p_user_agent, p_metadata)
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle failed login attempts
CREATE OR REPLACE FUNCTION handle_failed_login(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_attempts INTEGER;
BEGIN
  -- Increment failed login attempts
  UPDATE public.profiles
  SET failed_login_attempts = failed_login_attempts + 1
  WHERE id = p_user_id
  RETURNING failed_login_attempts INTO v_attempts;
  
  -- Lock account if too many failed attempts (5 or more)
  IF v_attempts >= 5 THEN
    UPDATE public.profiles
    SET 
      account_locked_until = timezone('utc'::text, now()) + INTERVAL '30 minutes',
      is_active = false
    WHERE id = p_user_id;
    
    -- Log the account lock event
    PERFORM log_security_event(p_user_id, 'account_locked', NULL, NULL, 
      jsonb_build_object('reason', 'too_many_failed_attempts', 'attempts', v_attempts));
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle successful login
CREATE OR REPLACE FUNCTION handle_successful_login(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    failed_login_attempts = 0,
    last_login = timezone('utc'::text, now()),
    is_active = true,
    account_locked_until = NULL
  WHERE id = p_user_id;
  
  -- Log the successful login
  PERFORM log_security_event(p_user_id, 'login_success');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE public.resume_hashes IS 'Stores SHA-256 hashes of uploaded resumes for integrity verification and duplicate detection';
COMMENT ON TABLE public.security_events IS 'Audit log for security-related events including logins, password changes, and suspicious activities';
COMMENT ON TABLE public.token_blacklist IS 'Stores invalidated JWT tokens for logout functionality';
COMMENT ON COLUMN public.profiles.password_hash IS 'Bcrypt hash of user password for additional security layer';
COMMENT ON COLUMN public.profiles.is_active IS 'Whether the user account is active and can login';
COMMENT ON COLUMN public.profiles.failed_login_attempts IS 'Counter for failed login attempts, resets on successful login';
COMMENT ON COLUMN public.profiles.account_locked_until IS 'Timestamp until which the account is locked due to failed login attempts';
