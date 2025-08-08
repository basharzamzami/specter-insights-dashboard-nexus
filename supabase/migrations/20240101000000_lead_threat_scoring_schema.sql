-- Lead Threat Scoring System Database Schema
-- Production-ready schema for lead threat scoring and analytics

-- Lead threat scores table
CREATE TABLE IF NOT EXISTS lead_threat_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id VARCHAR(255) NOT NULL,
    organization_id UUID NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    threat_level VARCHAR(20) NOT NULL CHECK (threat_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Scoring factors (JSON)
    scoring_factors JSONB NOT NULL DEFAULT '{}',
    threat_indicators JSONB NOT NULL DEFAULT '{}',
    recommended_actions JSONB NOT NULL DEFAULT '{}',
    dynamic_follow_up JSONB NOT NULL DEFAULT '{}',
    competitive_intelligence JSONB NOT NULL DEFAULT '{}',
    
    -- Timestamps
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Indexes
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_threat_scores_lead_id ON lead_threat_scores(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_threat_scores_org_id ON lead_threat_scores(organization_id);
CREATE INDEX IF NOT EXISTS idx_lead_threat_scores_calculated_at ON lead_threat_scores(calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_threat_scores_threat_level ON lead_threat_scores(threat_level);
CREATE INDEX IF NOT EXISTS idx_lead_threat_scores_overall_score ON lead_threat_scores(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_lead_threat_scores_expires_at ON lead_threat_scores(expires_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lead_threat_scores_lead_org_calc ON lead_threat_scores(lead_id, organization_id, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_threat_scores_org_threat_calc ON lead_threat_scores(organization_id, threat_level, calculated_at DESC);

-- Lead scoring events table for audit trail
CREATE TABLE IF NOT EXISTS lead_scoring_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id VARCHAR(255) NOT NULL,
    organization_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    score INTEGER,
    threat_level VARCHAR(20),
    previous_score INTEGER,
    previous_threat_level VARCHAR(20),
    triggered_by VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_scoring_events_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Indexes for scoring events
CREATE INDEX IF NOT EXISTS idx_lead_scoring_events_lead_id ON lead_scoring_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_scoring_events_org_id ON lead_scoring_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_lead_scoring_events_created_at ON lead_scoring_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_scoring_events_event_type ON lead_scoring_events(event_type);

-- Lead scoring configuration table
CREATE TABLE IF NOT EXISTS lead_scoring_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL UNIQUE,
    
    -- Scoring weights
    scoring_weights JSONB NOT NULL DEFAULT '{
        "intent_strength": 0.25,
        "competitive_pressure": 0.20,
        "urgency_indicators": 0.20,
        "budget_authority": 0.15,
        "fit_score": 0.10,
        "engagement_level": 0.05,
        "competitor_influence": 0.05
    }',
    
    -- Threat level thresholds
    threat_thresholds JSONB NOT NULL DEFAULT '{
        "low": 30,
        "medium": 50,
        "high": 75,
        "critical": 90
    }',
    
    -- Configuration options
    auto_follow_up_enabled BOOLEAN DEFAULT true,
    escalation_enabled BOOLEAN DEFAULT true,
    cache_duration_hours INTEGER DEFAULT 24 CHECK (cache_duration_hours > 0),
    
    -- Custom scoring rules
    custom_rules JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_scoring_config_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Lead scoring analytics materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS lead_scoring_analytics AS
SELECT 
    organization_id,
    DATE_TRUNC('day', calculated_at) as date,
    COUNT(*) as total_scores,
    AVG(overall_score) as avg_score,
    COUNT(CASE WHEN threat_level = 'low' THEN 1 END) as low_threat_count,
    COUNT(CASE WHEN threat_level = 'medium' THEN 1 END) as medium_threat_count,
    COUNT(CASE WHEN threat_level = 'high' THEN 1 END) as high_threat_count,
    COUNT(CASE WHEN threat_level = 'critical' THEN 1 END) as critical_threat_count,
    MIN(overall_score) as min_score,
    MAX(overall_score) as max_score,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY overall_score) as median_score
FROM lead_threat_scores
WHERE calculated_at >= NOW() - INTERVAL '90 days'
GROUP BY organization_id, DATE_TRUNC('day', calculated_at);

-- Index for the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_scoring_analytics_org_date ON lead_scoring_analytics(organization_id, date);

-- Function to refresh analytics
CREATE OR REPLACE FUNCTION refresh_lead_scoring_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY lead_scoring_analytics;
END;
$$ LANGUAGE plpgsql;

-- Lead threat score history table (for tracking changes over time)
CREATE TABLE IF NOT EXISTS lead_threat_score_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id VARCHAR(255) NOT NULL,
    organization_id UUID NOT NULL,
    score_snapshot JSONB NOT NULL,
    change_type VARCHAR(50) NOT NULL, -- 'initial', 'update', 'recalculation'
    change_reason VARCHAR(255),
    changed_fields TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_score_history_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Indexes for score history
CREATE INDEX IF NOT EXISTS idx_lead_threat_score_history_lead_id ON lead_threat_score_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_threat_score_history_org_id ON lead_threat_score_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_lead_threat_score_history_created_at ON lead_threat_score_history(created_at DESC);

-- Trigger function to track score changes
CREATE OR REPLACE FUNCTION track_lead_threat_score_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into history table on INSERT
    IF TG_OP = 'INSERT' THEN
        INSERT INTO lead_threat_score_history (
            lead_id, 
            organization_id, 
            score_snapshot, 
            change_type, 
            change_reason
        ) VALUES (
            NEW.lead_id,
            NEW.organization_id,
            row_to_json(NEW),
            'initial',
            'Initial score calculation'
        );
        RETURN NEW;
    END IF;
    
    -- Insert into history table on UPDATE
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO lead_threat_score_history (
            lead_id, 
            organization_id, 
            score_snapshot, 
            change_type, 
            change_reason,
            changed_fields
        ) VALUES (
            NEW.lead_id,
            NEW.organization_id,
            row_to_json(NEW),
            'update',
            'Score recalculation',
            ARRAY(
                SELECT key FROM jsonb_each(to_jsonb(NEW)) 
                WHERE to_jsonb(NEW) -> key != to_jsonb(OLD) -> key
            )
        );
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_track_lead_threat_score_changes ON lead_threat_scores;
CREATE TRIGGER trigger_track_lead_threat_score_changes
    AFTER INSERT OR UPDATE ON lead_threat_scores
    FOR EACH ROW EXECUTE FUNCTION track_lead_threat_score_changes();

-- Function to clean up expired scores
CREATE OR REPLACE FUNCTION cleanup_expired_lead_threat_scores()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM lead_threat_scores 
    WHERE expires_at < NOW() - INTERVAL '7 days'; -- Keep expired scores for 7 days
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Also clean up old events (keep for 90 days)
    DELETE FROM lead_scoring_events 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Clean up old history (keep for 1 year)
    DELETE FROM lead_threat_score_history 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get lead threat score with fallback
CREATE OR REPLACE FUNCTION get_lead_threat_score(
    p_lead_id VARCHAR(255),
    p_organization_id UUID,
    p_max_age_hours INTEGER DEFAULT 24
)
RETURNS TABLE(
    score INTEGER,
    threat_level VARCHAR(20),
    calculated_at TIMESTAMPTZ,
    is_expired BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lts.overall_score,
        lts.threat_level,
        lts.calculated_at,
        (lts.expires_at < NOW()) as is_expired
    FROM lead_threat_scores lts
    WHERE lts.lead_id = p_lead_id 
      AND lts.organization_id = p_organization_id
      AND lts.calculated_at > NOW() - (p_max_age_hours || ' hours')::INTERVAL
    ORDER BY lts.calculated_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get threat score trends
CREATE OR REPLACE FUNCTION get_lead_threat_score_trends(
    p_organization_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
    date DATE,
    avg_score NUMERIC,
    total_scores BIGINT,
    high_threat_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lsa.date::DATE,
        ROUND(lsa.avg_score, 2) as avg_score,
        lsa.total_scores,
        ROUND(
            (lsa.high_threat_count + lsa.critical_threat_count)::NUMERIC / 
            NULLIF(lsa.total_scores, 0) * 100, 2
        ) as high_threat_percentage
    FROM lead_scoring_analytics lsa
    WHERE lsa.organization_id = p_organization_id
      AND lsa.date >= CURRENT_DATE - p_days
    ORDER BY lsa.date;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE lead_threat_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_threat_score_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for lead_threat_scores
CREATE POLICY "Users can view their organization's threat scores" ON lead_threat_scores
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert threat scores for their organization" ON lead_threat_scores
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their organization's threat scores" ON lead_threat_scores
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- Similar policies for other tables
CREATE POLICY "Users can view their organization's scoring events" ON lead_scoring_events
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert scoring events for their organization" ON lead_scoring_events
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their organization's scoring config" ON lead_scoring_config
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their organization's scoring config" ON lead_scoring_config
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON lead_threat_scores TO authenticated;
GRANT SELECT, INSERT ON lead_scoring_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON lead_scoring_config TO authenticated;
GRANT SELECT ON lead_threat_score_history TO authenticated;
GRANT SELECT ON lead_scoring_analytics TO authenticated;

-- Create scheduled job to refresh analytics (if pg_cron is available)
-- SELECT cron.schedule('refresh-lead-scoring-analytics', '0 1 * * *', 'SELECT refresh_lead_scoring_analytics();');

-- Create scheduled job to cleanup expired scores
-- SELECT cron.schedule('cleanup-expired-scores', '0 2 * * *', 'SELECT cleanup_expired_lead_threat_scores();');

-- Comments for documentation
COMMENT ON TABLE lead_threat_scores IS 'Stores calculated lead threat scores with competitive intelligence';
COMMENT ON TABLE lead_scoring_events IS 'Audit trail for all lead scoring events and changes';
COMMENT ON TABLE lead_scoring_config IS 'Organization-specific configuration for lead scoring algorithms';
COMMENT ON TABLE lead_threat_score_history IS 'Historical tracking of lead threat score changes over time';
COMMENT ON MATERIALIZED VIEW lead_scoring_analytics IS 'Pre-aggregated analytics data for lead scoring performance';

COMMENT ON FUNCTION get_lead_threat_score IS 'Retrieves the most recent threat score for a lead with expiration check';
COMMENT ON FUNCTION get_lead_threat_score_trends IS 'Returns threat score trends over a specified time period';
COMMENT ON FUNCTION cleanup_expired_lead_threat_scores IS 'Removes expired threat scores and old audit data';
COMMENT ON FUNCTION refresh_lead_scoring_analytics IS 'Refreshes the materialized view for analytics data';
