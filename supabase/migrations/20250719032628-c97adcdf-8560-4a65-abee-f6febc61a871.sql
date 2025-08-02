-- Fix RLS and user data isolation for Specter Net

-- First, enable RLS on all tables that don't have it
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentiment_analysis ENABLE ROW LEVEL SECURITY;

-- Update user ID columns to TEXT where needed for Clerk compatibility
ALTER TABLE public.disruption_operations ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.operation_history ALTER COLUMN user_id TYPE TEXT;

-- Drop existing overly permissive policies and create proper user-scoped ones
DROP POLICY IF EXISTS "Allow authenticated users to manage competitor profiles" ON public.competitor_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to manage campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Allow authenticated users to manage personas" ON public.personas;
DROP POLICY IF EXISTS "Allow authenticated users to manage ask specter logs" ON public.ask_specter_logs;
DROP POLICY IF EXISTS "Allow authenticated users to manage action logs" ON public.action_logs;
DROP POLICY IF EXISTS "Allow authenticated users to manage settings" ON public.user_settings;

-- Create user-scoped RLS policies for competitor_profiles
CREATE POLICY "Users can view their own competitor profiles" ON public.competitor_profiles
  FOR SELECT USING (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own competitor profiles" ON public.competitor_profiles
  FOR INSERT WITH CHECK (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own competitor profiles" ON public.competitor_profiles
  FOR UPDATE USING (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own competitor profiles" ON public.competitor_profiles
  FOR DELETE USING (created_by = auth.jwt() ->> 'sub');

-- Create user-scoped RLS policies for campaigns
CREATE POLICY "Users can view their own campaigns" ON public.campaigns
  FOR SELECT USING (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own campaigns" ON public.campaigns
  FOR UPDATE USING (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own campaigns" ON public.campaigns
  FOR DELETE USING (created_by = auth.jwt() ->> 'sub');

-- Create user-scoped RLS policies for personas
CREATE POLICY "Users can view their own personas" ON public.personas
  FOR SELECT USING (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own personas" ON public.personas
  FOR INSERT WITH CHECK (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own personas" ON public.personas
  FOR UPDATE USING (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own personas" ON public.personas
  FOR DELETE USING (created_by = auth.jwt() ->> 'sub');

-- Create user-scoped RLS policies for disruption_operations
DROP POLICY IF EXISTS "Allow all actions" ON public.disruption_operations;
DROP POLICY IF EXISTS "Allow all actions for testing" ON public.disruption_operations;

CREATE POLICY "Users can view their own disruption operations" ON public.disruption_operations
  FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own disruption operations" ON public.disruption_operations
  FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own disruption operations" ON public.disruption_operations
  FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own disruption operations" ON public.disruption_operations
  FOR DELETE USING (user_id = auth.jwt() ->> 'sub');

-- Create user-scoped RLS policies for operation_history
DROP POLICY IF EXISTS "Users can view their operation history" ON public.operation_history;
DROP POLICY IF EXISTS "Users can insert their operation history" ON public.operation_history;

CREATE POLICY "Users can view their own operation history" ON public.operation_history
  FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own operation history" ON public.operation_history
  FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- Add soft delete columns to main tables
ALTER TABLE public.competitor_profiles ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.disruption_operations ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.personas ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;