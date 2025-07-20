-- Create threat_alerts table (if not exists)
CREATE TABLE IF NOT EXISTS public.threat_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES public.competitor_profiles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign_recommendations table (if not exists)
CREATE TABLE IF NOT EXISTS public.campaign_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES public.competitor_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('SEO', 'Ads', 'Review Generation', 'Social Media', 'Content Marketing')),
  title TEXT NOT NULL,
  description TEXT,
  details JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'deployed', 'completed', 'cancelled')),
  estimated_budget DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performance_metrics table (if not exists)
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES public.competitor_profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.threat_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for threat_alerts
CREATE POLICY "Users can view their own threat alerts" 
ON public.threat_alerts FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own threat alerts" 
ON public.threat_alerts FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own threat alerts" 
ON public.threat_alerts FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own threat alerts" 
ON public.threat_alerts FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for campaign_recommendations
CREATE POLICY "Users can view their own campaign recommendations" 
ON public.campaign_recommendations FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own campaign recommendations" 
ON public.campaign_recommendations FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own campaign recommendations" 
ON public.campaign_recommendations FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own campaign recommendations" 
ON public.campaign_recommendations FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for performance_metrics
CREATE POLICY "Users can view their own performance metrics" 
ON public.performance_metrics FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own performance metrics" 
ON public.performance_metrics FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_threat_alerts_updated_at
BEFORE UPDATE ON public.threat_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_recommendations_updated_at
BEFORE UPDATE ON public.campaign_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();