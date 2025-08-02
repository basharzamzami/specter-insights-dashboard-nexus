-- Update all user ID columns to TEXT to support Clerk user IDs
ALTER TABLE public.users ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.competitors ALTER COLUMN client_id TYPE TEXT;
ALTER TABLE public.marketing_campaigns ALTER COLUMN client_id TYPE TEXT;
ALTER TABLE public.user_activity_logs ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.competitor_profiles ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE public.campaigns ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE public.personas ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE public.ask_specter_logs ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.action_logs ALTER COLUMN triggered_by TYPE TEXT;
ALTER TABLE public.user_settings ALTER COLUMN user_id TYPE TEXT;

-- Create new permissive RLS policies for Clerk authentication
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