-- Drop ALL foreign key constraints first
ALTER TABLE public.competitors DROP CONSTRAINT IF EXISTS competitors_client_id_fkey;
ALTER TABLE public.marketing_campaigns DROP CONSTRAINT IF EXISTS marketing_campaigns_client_id_fkey;
ALTER TABLE public.user_activity_logs DROP CONSTRAINT IF EXISTS user_activity_logs_user_id_fkey;
ALTER TABLE public.competitor_profiles DROP CONSTRAINT IF EXISTS competitor_profiles_created_by_fkey;
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_created_by_fkey;
ALTER TABLE public.personas DROP CONSTRAINT IF EXISTS personas_created_by_fkey;
ALTER TABLE public.ask_specter_logs DROP CONSTRAINT IF EXISTS ask_specter_logs_user_id_fkey;
ALTER TABLE public.action_logs DROP CONSTRAINT IF EXISTS action_logs_triggered_by_fkey;
ALTER TABLE public.user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;

-- Drop all RLS policies
DROP POLICY IF EXISTS "Users can view their own competitor profiles" ON public.competitor_profiles;
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can view their own personas" ON public.personas;
DROP POLICY IF EXISTS "Users can view their own ask specter logs" ON public.ask_specter_logs;
DROP POLICY IF EXISTS "Users can view their own action logs" ON public.action_logs;
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;