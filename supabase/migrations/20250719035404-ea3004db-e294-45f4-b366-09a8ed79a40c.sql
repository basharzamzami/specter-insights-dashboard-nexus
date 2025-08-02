-- Fix multi-tenant data isolation by enabling RLS on all tables
-- This will prevent data bleed between users

-- Enable RLS on all tables that should be user-scoped
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disruption_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentiment_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ask_specter_logs ENABLE ROW LEVEL SECURITY;

-- Add missing policies for tables that have RLS enabled but no policies
CREATE POLICY "Users can manage their own action logs" 
ON public.action_logs 
FOR ALL 
USING (triggered_by = (auth.jwt() ->> 'sub'::text))
WITH CHECK (triggered_by = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can manage their own campaign posts" 
ON public.campaign_posts 
FOR ALL 
USING (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_posts.campaign_id AND campaigns.created_by = (auth.jwt() ->> 'sub'::text)))
WITH CHECK (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_posts.campaign_id AND campaigns.created_by = (auth.jwt() ->> 'sub'::text)));

CREATE POLICY "Users can manage their own competitors" 
ON public.competitors 
FOR ALL 
USING (client_id = (auth.jwt() ->> 'sub'::text))
WITH CHECK (client_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can manage their own data sources" 
ON public.data_sources 
FOR ALL 
USING (EXISTS (SELECT 1 FROM competitors WHERE competitors.id = data_sources.competitor_id AND competitors.client_id = (auth.jwt() ->> 'sub'::text)))
WITH CHECK (EXISTS (SELECT 1 FROM competitors WHERE competitors.id = data_sources.competitor_id AND competitors.client_id = (auth.jwt() ->> 'sub'::text)));

CREATE POLICY "Users can manage their own marketing campaigns" 
ON public.marketing_campaigns 
FOR ALL 
USING (client_id = (auth.jwt() ->> 'sub'::text))
WITH CHECK (client_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can manage their own sentiment analysis" 
ON public.sentiment_analysis 
FOR ALL 
USING (EXISTS (SELECT 1 FROM data_sources ds JOIN competitors c ON c.id = ds.competitor_id WHERE ds.id = sentiment_analysis.data_source_id AND c.client_id = (auth.jwt() ->> 'sub'::text)))
WITH CHECK (EXISTS (SELECT 1 FROM data_sources ds JOIN competitors c ON c.id = ds.competitor_id WHERE ds.id = sentiment_analysis.data_source_id AND c.client_id = (auth.jwt() ->> 'sub'::text)));

CREATE POLICY "Users can manage their own specter logs" 
ON public.ask_specter_logs 
FOR ALL 
USING (user_id = (auth.jwt() ->> 'sub'::text))
WITH CHECK (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can manage their own activity logs" 
ON public.user_activity_logs 
FOR ALL 
USING (user_id = (auth.jwt() ->> 'sub'::text))
WITH CHECK (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can manage their own settings" 
ON public.user_settings 
FOR ALL 
USING (user_id = (auth.jwt() ->> 'sub'::text))
WITH CHECK (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can view their own user record" 
ON public.users 
FOR SELECT 
USING (id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can update their own user record" 
ON public.users 
FOR UPDATE 
USING (id = (auth.jwt() ->> 'sub'::text))
WITH CHECK (id = (auth.jwt() ->> 'sub'::text));