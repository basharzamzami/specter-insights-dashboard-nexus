-- 🔥 WARM LEAD SEIZURE SYSTEM DATABASE SCHEMA
-- Creates tables for the comprehensive lead intelligence and conversion system

-- Warm Leads table - Core lead profiles and behavior data
CREATE TABLE IF NOT EXISTS warm_leads (
    id TEXT PRIMARY KEY CHECK (length(id) >= 5 AND length(id) <= 100 AND id ~ '^[a-zA-Z0-9_-]+$'),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT CHECK (email IS NULL OR (length(email) <= 254 AND email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')),
    phone TEXT CHECK (phone IS NULL OR (length(phone) >= 7 AND length(phone) <= 20 AND phone ~ '^[+]?[0-9\s\-\(\)]+$')),
    company TEXT CHECK (company IS NULL OR (length(company) >= 1 AND length(company) <= 100)),
    source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'google_ads', 'facebook_ads', 'linkedin', 'organic', 'referral', 'direct', 'email', 'social')),
    first_detected TIMESTAMPTZ NOT NULL DEFAULT NOW() CHECK (first_detected <= NOW()),
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW() CHECK (last_activity >= first_detected AND last_activity <= NOW() + INTERVAL '1 hour'),
    warmth_score INTEGER NOT NULL DEFAULT 0 CHECK (warmth_score >= 0 AND warmth_score <= 100),
    status TEXT NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'qualified', 'seized', 'converted', 'cold', 'unsubscribed')),
    behavior_data JSONB NOT NULL DEFAULT '{}' CHECK (jsonb_typeof(behavior_data) = 'object'),
    seizure_history JSONB NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(seizure_history) = 'array'),
    closer_grid JSONB DEFAULT '{}' CHECK (closer_grid IS NULL OR jsonb_typeof(closer_grid) = 'object'),
    conversion_value DECIMAL(10,2) DEFAULT 0 CHECK (conversion_value >= 0 AND conversion_value <= 1000000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Additional constraints
    CONSTRAINT valid_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL),
    CONSTRAINT valid_activity_timeline CHECK (last_activity >= first_detected),
    CONSTRAINT valid_conversion_status CHECK (
        (status = 'converted' AND conversion_value > 0) OR
        (status != 'converted' AND conversion_value >= 0)
    )
);

-- Seizure Activity Logs - Track all system actions and performance
CREATE TABLE IF NOT EXISTS seizure_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lead_id TEXT REFERENCES warm_leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('detection', 'qualification', 'seizure_planning', 'execution', 'conversion', 'error', 'rate_limit')),
    activity_data JSONB NOT NULL DEFAULT '{}' CHECK (jsonb_typeof(activity_data) = 'object'),
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT CHECK (error_message IS NULL OR (length(error_message) >= 1 AND length(error_message) <= 1000)),
    processing_time_ms INTEGER CHECK (processing_time_ms IS NULL OR processing_time_ms >= 0),
    ip_address INET,
    user_agent TEXT CHECK (user_agent IS NULL OR length(user_agent) <= 500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_error_state CHECK (
        (success = true AND error_message IS NULL) OR
        (success = false AND error_message IS NOT NULL)
    ),
    CONSTRAINT valid_lead_reference CHECK (
        (activity_type IN ('qualification', 'seizure_planning', 'execution', 'conversion') AND lead_id IS NOT NULL) OR
        (activity_type NOT IN ('qualification', 'seizure_planning', 'execution', 'conversion'))
    )
);

-- Seizure System Settings - User-configurable system parameters
CREATE TABLE IF NOT EXISTS seizure_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    warmth_threshold INTEGER NOT NULL DEFAULT 65 CHECK (warmth_threshold >= 0 AND warmth_threshold <= 100),
    ad_channels JSONB NOT NULL DEFAULT '["facebook", "google"]',
    ab_testing_mode BOOLEAN NOT NULL DEFAULT false,
    auto_dialer_enabled BOOLEAN NOT NULL DEFAULT false,
    email_templates JSONB DEFAULT '{}',
    sms_templates JSONB DEFAULT '{}',
    ad_templates JSONB DEFAULT '{}',
    integration_settings JSONB DEFAULT '{}', -- API keys, webhook URLs, etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seizure Actions - Individual campaign actions and their status
CREATE TABLE IF NOT EXISTS seizure_actions (
    id TEXT PRIMARY KEY,
    lead_id TEXT REFERENCES warm_leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('email', 'sms', 'ad', 'chat', 'call')),
    trigger_day INTEGER NOT NULL DEFAULT 0,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'sent', 'delivered', 'opened', 'clicked', 'converted', 'failed')),
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    conversion_value DECIMAL(10,2) DEFAULT 0,
    platform_response JSONB DEFAULT '{}',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lead Behavior Tracking - Detailed behavioral data for scoring
CREATE TABLE IF NOT EXISTS lead_behavior_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id TEXT REFERENCES warm_leads(id) ON DELETE CASCADE,
    session_id TEXT,
    event_type TEXT NOT NULL, -- 'page_view', 'form_interaction', 'email_open', 'ad_click', etc.
    event_data JSONB NOT NULL DEFAULT '{}',
    page_url TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_campaign TEXT,
    utm_medium TEXT,
    device_type TEXT,
    location TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversion Funnels - Track lead progression through conversion stages
CREATE TABLE IF NOT EXISTS conversion_funnels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lead_id TEXT REFERENCES warm_leads(id) ON DELETE CASCADE,
    funnel_stage TEXT NOT NULL, -- 'awareness', 'interest', 'consideration', 'intent', 'evaluation', 'purchase'
    stage_entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    stage_completed_at TIMESTAMPTZ,
    stage_duration_seconds INTEGER,
    conversion_probability DECIMAL(5,2), -- 0.00 to 100.00
    stage_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Analytics - System performance metrics and ROI tracking
CREATE TABLE IF NOT EXISTS seizure_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    leads_detected INTEGER DEFAULT 0,
    leads_qualified INTEGER DEFAULT 0,
    seizures_executed INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    cost_per_lead DECIMAL(8,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
    roi DECIMAL(8,2) DEFAULT 0, -- Return on Investment percentage
    avg_warmth_score DECIMAL(5,2) DEFAULT 0,
    avg_time_to_conversion_hours INTEGER DEFAULT 0,
    performance_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_warm_leads_user_id ON warm_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_warm_leads_warmth_score ON warm_leads(warmth_score DESC);
CREATE INDEX IF NOT EXISTS idx_warm_leads_status ON warm_leads(status);
CREATE INDEX IF NOT EXISTS idx_warm_leads_source ON warm_leads(source);
CREATE INDEX IF NOT EXISTS idx_warm_leads_created_at ON warm_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_warm_leads_last_activity ON warm_leads(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_warm_leads_email ON warm_leads(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_warm_leads_phone ON warm_leads(phone) WHERE phone IS NOT NULL;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_warm_leads_user_status_score ON warm_leads(user_id, status, warmth_score DESC);
CREATE INDEX IF NOT EXISTS idx_warm_leads_user_activity ON warm_leads(user_id, last_activity DESC);

CREATE INDEX IF NOT EXISTS idx_seizure_logs_user_id ON seizure_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_seizure_logs_lead_id ON seizure_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_seizure_logs_activity_type ON seizure_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_seizure_logs_created_at ON seizure_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seizure_logs_success ON seizure_logs(success);
CREATE INDEX IF NOT EXISTS idx_seizure_logs_user_activity_time ON seizure_logs(user_id, activity_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_seizure_actions_lead_id ON seizure_actions(lead_id);
CREATE INDEX IF NOT EXISTS idx_seizure_actions_status ON seizure_actions(status);
CREATE INDEX IF NOT EXISTS idx_seizure_actions_scheduled_for ON seizure_actions(scheduled_for);

CREATE INDEX IF NOT EXISTS idx_lead_behavior_tracking_lead_id ON lead_behavior_tracking(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_behavior_tracking_event_type ON lead_behavior_tracking(event_type);
CREATE INDEX IF NOT EXISTS idx_lead_behavior_tracking_created_at ON lead_behavior_tracking(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversion_funnels_lead_id ON conversion_funnels(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_funnel_stage ON conversion_funnels(funnel_stage);

CREATE INDEX IF NOT EXISTS idx_seizure_performance_user_id ON seizure_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_seizure_performance_date ON seizure_performance(date DESC);

-- Row Level Security (RLS) policies
ALTER TABLE warm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE seizure_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seizure_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seizure_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_behavior_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE seizure_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can manage their own warm leads" ON warm_leads
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own seizure logs" ON seizure_logs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own seizure settings" ON seizure_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own seizure actions" ON seizure_actions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own behavior tracking" ON lead_behavior_tracking
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM warm_leads 
            WHERE warm_leads.id = lead_behavior_tracking.lead_id 
            AND warm_leads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own conversion funnels" ON conversion_funnels
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own performance data" ON seizure_performance
    FOR ALL USING (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_warm_lead_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_seizure_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_seizure_actions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER trigger_update_warm_leads_updated_at
    BEFORE UPDATE ON warm_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_warm_lead_updated_at();

CREATE TRIGGER trigger_update_seizure_settings_updated_at
    BEFORE UPDATE ON seizure_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_seizure_settings_updated_at();

CREATE TRIGGER trigger_update_seizure_actions_updated_at
    BEFORE UPDATE ON seizure_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_seizure_actions_updated_at();

-- Sample data for testing (optional)
-- INSERT INTO seizure_settings (user_id, warmth_threshold, ad_channels) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 65, '["facebook", "google", "linkedin"]');

COMMENT ON TABLE warm_leads IS 'Core warm lead profiles with behavior data and seizure history';
COMMENT ON TABLE seizure_logs IS 'Activity logs for all seizure system operations';
COMMENT ON TABLE seizure_settings IS 'User-configurable system parameters and templates';
COMMENT ON TABLE seizure_actions IS 'Individual campaign actions and their execution status';
COMMENT ON TABLE lead_behavior_tracking IS 'Detailed behavioral event tracking for lead scoring';
COMMENT ON TABLE conversion_funnels IS 'Lead progression tracking through conversion stages';
COMMENT ON TABLE seizure_performance IS 'System performance metrics and ROI analytics';
