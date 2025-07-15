-- First, drop all foreign key constraints that reference the users table
ALTER TABLE public.competitors DROP CONSTRAINT IF EXISTS competitors_client_id_fkey;
ALTER TABLE public.marketing_campaigns DROP CONSTRAINT IF EXISTS marketing_campaigns_client_id_fkey;
ALTER TABLE public.user_activity_logs DROP CONSTRAINT IF EXISTS user_activity_logs_user_id_fkey;

-- Now update the users table ID column to TEXT
ALTER TABLE public.users ALTER COLUMN id TYPE TEXT;

-- Update all related columns to TEXT
ALTER TABLE public.competitors ALTER COLUMN client_id TYPE TEXT;
ALTER TABLE public.marketing_campaigns ALTER COLUMN client_id TYPE TEXT;
ALTER TABLE public.user_activity_logs ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.competitor_profiles ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE public.campaigns ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE public.personas ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE public.ask_specter_logs ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.action_logs ALTER COLUMN triggered_by TYPE TEXT;
ALTER TABLE public.user_settings ALTER COLUMN user_id TYPE TEXT;