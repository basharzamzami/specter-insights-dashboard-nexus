-- Create additional tables needed for enhanced functionality

-- Table for real-time intelligence feeds
CREATE TABLE IF NOT EXISTS public.intelligence_feeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('news', 'hiring', 'product', 'review', 'social', 'financial')),
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  url TEXT,
  competitor TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  impact TEXT NOT NULL CHECK (impact IN ('positive', 'negative', 'neutral')),
  data JSONB,
  is_trending BOOLEAN DEFAULT false,
  tracking_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for SEO keyword tracking
CREATE TABLE IF NOT EXISTS public.seo_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  domain TEXT NOT NULL,
  rank INTEGER,
  previous_rank INTEGER,
  search_volume INTEGER,
  difficulty INTEGER,
  traffic_estimate INTEGER,
  rank_change INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for competitor tracking  
CREATE TABLE IF NOT EXISTS public.competitor_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  company_name TEXT NOT NULL,
  seo_score INTEGER,
  organic_traffic INTEGER,
  paid_traffic INTEGER,
  backlinks INTEGER,
  keywords INTEGER,
  market_share DECIMAL(5,2),
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for social media posts scheduling
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[],
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
  post_id TEXT,
  engagement_metrics JSONB,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for operational history logs
CREATE TABLE IF NOT EXISTS public.operation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL,
  description TEXT,
  target TEXT,
  result TEXT,
  metrics JSONB,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.intelligence_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operation_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for intelligence_feeds
CREATE POLICY "Users can view intelligence feeds" ON public.intelligence_feeds
  FOR SELECT USING (true);

CREATE POLICY "Users can insert intelligence feeds" ON public.intelligence_feeds  
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update intelligence feeds" ON public.intelligence_feeds
  FOR UPDATE USING (true);

-- Create RLS policies for seo_keywords
CREATE POLICY "Users can view SEO keywords" ON public.seo_keywords
  FOR SELECT USING (true);

CREATE POLICY "Users can insert SEO keywords" ON public.seo_keywords
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update SEO keywords" ON public.seo_keywords
  FOR UPDATE USING (true);

-- Create RLS policies for competitor_tracking
CREATE POLICY "Users can view competitor tracking" ON public.competitor_tracking
  FOR SELECT USING (true);

CREATE POLICY "Users can insert competitor tracking" ON public.competitor_tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update competitor tracking" ON public.competitor_tracking
  FOR UPDATE USING (true);

-- Create RLS policies for scheduled_posts
CREATE POLICY "Users can view their scheduled posts" ON public.scheduled_posts
  FOR SELECT USING (auth.uid()::text = created_by);

CREATE POLICY "Users can insert their scheduled posts" ON public.scheduled_posts
  FOR INSERT WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their scheduled posts" ON public.scheduled_posts
  FOR UPDATE USING (auth.uid()::text = created_by);

-- Create RLS policies for operation_history
CREATE POLICY "Users can view their operation history" ON public.operation_history
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their operation history" ON public.operation_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_intelligence_feeds_type ON public.intelligence_feeds(type);
CREATE INDEX IF NOT EXISTS idx_intelligence_feeds_priority ON public.intelligence_feeds(priority);
CREATE INDEX IF NOT EXISTS idx_intelligence_feeds_trending ON public.intelligence_feeds(is_trending);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_domain ON public.seo_keywords(domain);
CREATE INDEX IF NOT EXISTS idx_competitor_tracking_domain ON public.competitor_tracking(domain);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user ON public.scheduled_posts(created_by);
CREATE INDEX IF NOT EXISTS idx_operation_history_user ON public.operation_history(user_id);

-- Create triggers for updating timestamps
CREATE TRIGGER update_intelligence_feeds_updated_at
  BEFORE UPDATE ON public.intelligence_feeds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seo_keywords_updated_at
  BEFORE UPDATE ON public.seo_keywords
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitor_tracking_updated_at
  BEFORE UPDATE ON public.competitor_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at
  BEFORE UPDATE ON public.scheduled_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();