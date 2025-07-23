-- Warfare System Database Tables
-- Real-time competitive intelligence warfare infrastructure

-- Threat Alerts Table - Real-time competitive threats
CREATE TABLE IF NOT EXISTS public.threat_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    threat_type TEXT NOT NULL CHECK (threat_type IN ('seo_movement', 'new_ad_campaign', 'review_surge', 'content_publish', 'social_activity', 'funding_news', 'hiring_spree')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    competitor_name TEXT NOT NULL,
    
    -- Threat details (JSONB for flexibility)
    threat JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Response recommendations (JSONB for flexibility)
    response JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'responding', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunity Alerts Table - Market opportunities for exploitation
CREATE TABLE IF NOT EXISTS public.opportunity_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('keyword_gap', 'competitor_weakness', 'market_shift', 'review_opportunity', 'content_gap', 'ad_opportunity')),
    priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    
    -- Opportunity details (JSONB for flexibility)
    opportunity JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Exploitation strategy (JSONB for flexibility)
    exploitation JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'planning', 'executing', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warfare Strategies Table - Coordinated attack strategies
CREATE TABLE IF NOT EXISTS public.warfare_strategies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    target_competitor TEXT NOT NULL,
    strategy_type TEXT NOT NULL CHECK (strategy_type IN ('seo_attack', 'ad_hijack', 'review_warfare', 'content_domination', 'social_disruption')),
    priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    
    -- Attack vector details (JSONB for flexibility)
    attack_vector JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Expected outcome (JSONB for flexibility)
    expected_outcome JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitive Intelligence Table - Enhanced competitor profiles
CREATE TABLE IF NOT EXISTS public.competitive_intelligence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    competitor_id TEXT NOT NULL,
    competitor_name TEXT NOT NULL,
    website TEXT,
    industry TEXT NOT NULL,
    location TEXT NOT NULL,
    
    -- SEO warfare data (JSONB for flexibility)
    seo_data JSONB DEFAULT '{}'::jsonb,
    
    -- Ad warfare data (JSONB for flexibility)
    ad_data JSONB DEFAULT '{}'::jsonb,
    
    -- Social warfare data (JSONB for flexibility)
    social_data JSONB DEFAULT '{}'::jsonb,
    
    -- Review warfare data (JSONB for flexibility)
    review_data JSONB DEFAULT '{}'::jsonb,
    
    -- Vulnerability assessment (JSONB for flexibility)
    vulnerabilities JSONB DEFAULT '[]'::jsonb,
    
    -- Threat level assessment
    threat_level TEXT NOT NULL DEFAULT 'medium' CHECK (threat_level IN ('critical', 'high', 'medium', 'low')),
    
    -- Last intelligence update
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warfare Campaigns Table - Active warfare campaigns
CREATE TABLE IF NOT EXISTS public.warfare_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    campaign_name TEXT NOT NULL,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('seo_domination', 'ad_warfare', 'review_assault', 'content_siege', 'social_disruption', 'multi_vector')),
    target_competitors TEXT[] NOT NULL DEFAULT '{}',
    
    -- Campaign objectives (JSONB for flexibility)
    objectives JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Campaign tactics (JSONB for flexibility)
    tactics JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Campaign metrics (JSONB for flexibility)
    metrics JSONB DEFAULT '{}'::jsonb,
    
    -- Budget and resources
    budget DECIMAL(10,2),
    allocated_resources JSONB DEFAULT '{}'::jsonb,
    
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Intelligence Table - Industry and market data
CREATE TABLE IF NOT EXISTS public.market_intelligence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    industry TEXT NOT NULL,
    location TEXT NOT NULL,
    
    -- Market data (JSONB for flexibility)
    market_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Trend analysis (JSONB for flexibility)
    trends JSONB DEFAULT '[]'::jsonb,
    
    -- Opportunity analysis (JSONB for flexibility)
    opportunities JSONB DEFAULT '[]'::jsonb,
    
    -- Threat analysis (JSONB for flexibility)
    threats JSONB DEFAULT '[]'::jsonb,
    
    data_source TEXT NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Surveillance Logs Table - Track all monitoring activities
CREATE TABLE IF NOT EXISTS public.surveillance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    surveillance_type TEXT NOT NULL CHECK (surveillance_type IN ('seo_scan', 'ad_monitor', 'social_watch', 'review_track', 'content_scan', 'business_intel')),
    target_competitor TEXT NOT NULL,
    
    -- Surveillance data (JSONB for flexibility)
    data_collected JSONB DEFAULT '{}'::jsonb,
    
    -- Detection results (JSONB for flexibility)
    detections JSONB DEFAULT '[]'::jsonb,
    
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('running', 'completed', 'failed')),
    execution_time_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_threat_alerts_user_id ON public.threat_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_severity ON public.threat_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_status ON public.threat_alerts(status);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_created_at ON public.threat_alerts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_opportunity_alerts_user_id ON public.opportunity_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_alerts_priority ON public.opportunity_alerts(priority);
CREATE INDEX IF NOT EXISTS idx_opportunity_alerts_status ON public.opportunity_alerts(status);
CREATE INDEX IF NOT EXISTS idx_opportunity_alerts_created_at ON public.opportunity_alerts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_warfare_strategies_user_id ON public.warfare_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_warfare_strategies_priority ON public.warfare_strategies(priority);
CREATE INDEX IF NOT EXISTS idx_warfare_strategies_status ON public.warfare_strategies(status);
CREATE INDEX IF NOT EXISTS idx_warfare_strategies_created_at ON public.warfare_strategies(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_competitive_intelligence_user_id ON public.competitive_intelligence(user_id);
CREATE INDEX IF NOT EXISTS idx_competitive_intelligence_threat_level ON public.competitive_intelligence(threat_level);
CREATE INDEX IF NOT EXISTS idx_competitive_intelligence_last_updated ON public.competitive_intelligence(last_updated DESC);

CREATE INDEX IF NOT EXISTS idx_warfare_campaigns_user_id ON public.warfare_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_warfare_campaigns_status ON public.warfare_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_warfare_campaigns_created_at ON public.warfare_campaigns(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_market_intelligence_user_id ON public.market_intelligence(user_id);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_industry ON public.market_intelligence(industry);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_location ON public.market_intelligence(location);

CREATE INDEX IF NOT EXISTS idx_surveillance_logs_user_id ON public.surveillance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_surveillance_logs_target ON public.surveillance_logs(target_competitor);
CREATE INDEX IF NOT EXISTS idx_surveillance_logs_created_at ON public.surveillance_logs(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE public.threat_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warfare_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warfare_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveillance_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for data isolation
CREATE POLICY "Users can only access their own threat alerts" ON public.threat_alerts
    FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can only access their own opportunity alerts" ON public.opportunity_alerts
    FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can only access their own warfare strategies" ON public.warfare_strategies
    FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can only access their own competitive intelligence" ON public.competitive_intelligence
    FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can only access their own warfare campaigns" ON public.warfare_campaigns
    FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can only access their own market intelligence" ON public.market_intelligence
    FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can only access their own surveillance logs" ON public.surveillance_logs
    FOR ALL USING (user_id = auth.jwt() ->> 'sub');

-- Add comments for documentation
COMMENT ON TABLE public.threat_alerts IS 'Real-time competitive threats requiring immediate response';
COMMENT ON TABLE public.opportunity_alerts IS 'Market opportunities ready for exploitation';
COMMENT ON TABLE public.warfare_strategies IS 'Coordinated attack strategies for market domination';
COMMENT ON TABLE public.competitive_intelligence IS 'Enhanced competitor profiles with vulnerability assessments';
COMMENT ON TABLE public.warfare_campaigns IS 'Active warfare campaigns targeting competitors';
COMMENT ON TABLE public.market_intelligence IS 'Industry and market intelligence data';
COMMENT ON TABLE public.surveillance_logs IS 'Audit trail of all surveillance activities';

-- Log the warfare system deployment
DO $$
BEGIN
  RAISE NOTICE 'WARFARE SYSTEM DEPLOYED: Real-time competitive intelligence infrastructure ready';
  RAISE NOTICE 'TABLES CREATED: 7 warfare tables with RLS policies';
  RAISE NOTICE 'INDEXES CREATED: Performance optimized for real-time operations';
  RAISE NOTICE 'SECURITY ENABLED: Complete data isolation between users';
END $$;
