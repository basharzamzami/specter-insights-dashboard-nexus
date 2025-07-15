-- Create the enhanced Specter Net database schema

-- Update users table to include role
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'analyst';

-- Create competitor_profiles table
CREATE TABLE IF NOT EXISTS public.competitor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  website TEXT,
  seo_score NUMERIC,
  sentiment_score NUMERIC,
  vulnerabilities TEXT[],
  top_keywords TEXT[],
  estimated_ad_spend NUMERIC,
  ad_activity JSONB,
  social_sentiment JSONB,
  customer_complaints JSONB,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('seo', 'social', 'whisper', 'disruption', 'ad_hijack')),
  target_company TEXT NOT NULL,
  objective TEXT,
  actions JSONB,
  scheduled_date TIMESTAMP WITHOUT TIME ZONE,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'paused')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create personas table
CREATE TABLE IF NOT EXISTS public.personas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  voice_tone TEXT,
  platform TEXT,
  scripts JSONB,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create ask_specter_logs table
CREATE TABLE IF NOT EXISTS public.ask_specter_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  prompt TEXT NOT NULL,
  ai_response TEXT,
  context JSONB,
  timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create action_logs table
CREATE TABLE IF NOT EXISTS public.action_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL,
  triggered_by UUID REFERENCES public.users(id),
  target_id UUID,
  target_type TEXT, -- 'campaign' or 'competitor_profile'
  details JSONB,
  timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create settings table for user preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) UNIQUE,
  aggressive_mode BOOLEAN DEFAULT false,
  stealth_mode BOOLEAN DEFAULT true,
  integrations JSONB DEFAULT '{}',
  notifications JSONB DEFAULT '{}',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.competitor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ask_specter_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user-specific data
CREATE POLICY "Users can view their own competitor profiles" ON public.competitor_profiles
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Users can view their own campaigns" ON public.campaigns
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Users can view their own personas" ON public.personas
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Users can view their own ask specter logs" ON public.ask_specter_logs
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own action logs" ON public.action_logs
  FOR ALL USING (triggered_by = auth.uid());

CREATE POLICY "Users can manage their own settings" ON public.user_settings
  FOR ALL USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_competitor_profiles_updated_at
  BEFORE UPDATE ON public.competitor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();