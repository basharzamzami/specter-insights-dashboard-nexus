-- Fix the database schema for Clerk authentication compatibility

-- Update all user reference columns to TEXT instead of UUID
ALTER TABLE public.users ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.competitor_profiles ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE public.campaigns ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE public.personas ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE public.ask_specter_logs ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.action_logs ALTER COLUMN triggered_by TYPE TEXT;
ALTER TABLE public.user_settings ALTER COLUMN user_id TYPE TEXT;

-- Drop existing RLS policies that use auth.uid()
DROP POLICY IF EXISTS "Users can view their own competitor profiles" ON public.competitor_profiles;
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can view their own personas" ON public.personas;
DROP POLICY IF EXISTS "Users can view their own ask specter logs" ON public.ask_specter_logs;
DROP POLICY IF EXISTS "Users can view their own action logs" ON public.action_logs;
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;

-- Create new RLS policies that work with Clerk
-- Since we can't use auth.uid() with Clerk, we'll create permissive policies for now
-- In production, you'd implement custom JWT verification

CREATE POLICY "Allow authenticated users to manage competitor profiles" ON public.competitor_profiles
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage campaigns" ON public.campaigns
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage personas" ON public.personas
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage ask specter logs" ON public.ask_specter_logs
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage action logs" ON public.action_logs
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage settings" ON public.user_settings
  FOR ALL USING (true);

-- Update foreign key constraints
ALTER TABLE public.competitor_profiles DROP CONSTRAINT IF EXISTS competitor_profiles_created_by_fkey;
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_created_by_fkey;
ALTER TABLE public.personas DROP CONSTRAINT IF EXISTS personas_created_by_fkey;
ALTER TABLE public.ask_specter_logs DROP CONSTRAINT IF EXISTS ask_specter_logs_user_id_fkey;
ALTER TABLE public.action_logs DROP CONSTRAINT IF EXISTS action_logs_triggered_by_fkey;
ALTER TABLE public.user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;