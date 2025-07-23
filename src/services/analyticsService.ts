import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  competitorsTracked: number;
  activeCampaigns: number;
  marketInsights: number;
  intelligenceScore: number;
}

export interface CompetitorAnalytics {
  totalCompetitors: number;
  highThreatCompetitors: number;
  averageSeoScore: number;
  marketShareCovered: number;
}

export interface CampaignAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  successRate: number;
}

export interface IntelligenceAnalytics {
  totalInsights: number;
  highPriorityAlerts: number;
  trendsIdentified: number;
  opportunitiesFound: number;
}

export class AnalyticsService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Get dashboard statistics for the welcome banner
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [competitors, campaigns, insights] = await Promise.all([
        this.getCompetitorAnalytics(),
        this.getCampaignAnalytics(),
        this.getIntelligenceAnalytics()
      ]);

      // Calculate intelligence score based on data completeness and activity
      const intelligenceScore = this.calculateIntelligenceScore(competitors, campaigns, insights);

      return {
        competitorsTracked: competitors.totalCompetitors,
        activeCampaigns: campaigns.activeCampaigns,
        marketInsights: insights.totalInsights,
        intelligenceScore
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        competitorsTracked: 0,
        activeCampaigns: 0,
        marketInsights: 0,
        intelligenceScore: 0
      };
    }
  }

  /**
   * Get competitor analytics
   */
  async getCompetitorAnalytics(): Promise<CompetitorAnalytics> {
    try {
      const { data: competitors, error } = await supabase
        .from('competitor_profiles')
        .select('*')
        .eq('user_id', this.userId);

      if (error) throw error;

      const totalCompetitors = competitors?.length || 0;
      const highThreatCompetitors = competitors?.filter(c => 
        c.threat_level === 'high' || c.threat_level === 'critical'
      ).length || 0;

      const seoScores = competitors?.map(c => c.seo_rank || 0).filter(score => score > 0) || [];
      const averageSeoScore = seoScores.length > 0 
        ? seoScores.reduce((sum, score) => sum + score, 0) / seoScores.length 
        : 0;

      const marketShares = competitors?.map(c => c.market_share || 0).filter(share => share > 0) || [];
      const marketShareCovered = marketShares.reduce((sum, share) => sum + share, 0);

      return {
        totalCompetitors,
        highThreatCompetitors,
        averageSeoScore,
        marketShareCovered
      };
    } catch (error) {
      console.error('Error fetching competitor analytics:', error);
      return {
        totalCompetitors: 0,
        highThreatCompetitors: 0,
        averageSeoScore: 0,
        marketShareCovered: 0
      };
    }
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(): Promise<CampaignAnalytics> {
    try {
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('created_by', this.userId);

      if (error) throw error;

      const totalCampaigns = campaigns?.length || 0;
      const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
      const completedCampaigns = campaigns?.filter(c => c.status === 'completed').length || 0;
      
      const successRate = totalCampaigns > 0 
        ? Math.round((completedCampaigns / totalCampaigns) * 100) 
        : 0;

      return {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        successRate
      };
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      return {
        totalCampaigns: 0,
        activeCampaigns: 0,
        completedCampaigns: 0,
        successRate: 0
      };
    }
  }

  /**
   * Get intelligence analytics
   */
  async getIntelligenceAnalytics(): Promise<IntelligenceAnalytics> {
    try {
      const { data: feeds, error } = await supabase
        .from('intelligence_feeds')
        .select('*');

      if (error) throw error;

      const totalInsights = feeds?.length || 0;
      const highPriorityAlerts = feeds?.filter(f => f.priority === 'high').length || 0;
      const trendsIdentified = feeds?.filter(f => f.is_trending === true).length || 0;
      const opportunitiesFound = feeds?.filter(f => f.impact === 'positive').length || 0;

      return {
        totalInsights,
        highPriorityAlerts,
        trendsIdentified,
        opportunitiesFound
      };
    } catch (error) {
      console.error('Error fetching intelligence analytics:', error);
      return {
        totalInsights: 0,
        highPriorityAlerts: 0,
        trendsIdentified: 0,
        opportunitiesFound: 0
      };
    }
  }

  /**
   * Calculate intelligence score based on platform usage and data quality
   */
  private calculateIntelligenceScore(
    competitors: CompetitorAnalytics,
    campaigns: CampaignAnalytics,
    insights: IntelligenceAnalytics
  ): number {
    let score = 0;

    // Competitor tracking (30 points max)
    if (competitors.totalCompetitors > 0) {
      score += Math.min(competitors.totalCompetitors * 5, 30);
    }

    // Campaign activity (25 points max)
    if (campaigns.totalCampaigns > 0) {
      score += Math.min(campaigns.totalCampaigns * 5, 20);
      score += Math.min(campaigns.successRate / 4, 5); // Success rate bonus
    }

    // Intelligence insights (25 points max)
    if (insights.totalInsights > 0) {
      score += Math.min(insights.totalInsights * 2, 20);
      score += Math.min(insights.highPriorityAlerts, 5); // High priority bonus
    }

    // Data quality bonus (20 points max)
    if (competitors.averageSeoScore > 0) score += 5;
    if (competitors.marketShareCovered > 0) score += 5;
    if (insights.trendsIdentified > 0) score += 5;
    if (insights.opportunitiesFound > 0) score += 5;

    return Math.min(Math.round(score), 100);
  }

  /**
   * Get trend data for charts
   */
  async getTrendData(days: number = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get competitor tracking trends
      const { data: competitorTrends, error: competitorError } = await supabase
        .from('competitor_profiles')
        .select('created_at')
        .eq('user_id', this.userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (competitorError) throw competitorError;

      // Get campaign trends
      const { data: campaignTrends, error: campaignError } = await supabase
        .from('campaigns')
        .select('created_at, status')
        .eq('created_by', this.userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (campaignError) throw campaignError;

      // Get intelligence trends
      const { data: intelligenceTrends, error: intelligenceError } = await supabase
        .from('intelligence_feeds')
        .select('created_at, priority')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (intelligenceError) throw intelligenceError;

      return {
        competitors: competitorTrends || [],
        campaigns: campaignTrends || [],
        intelligence: intelligenceTrends || []
      };
    } catch (error) {
      console.error('Error fetching trend data:', error);
      return {
        competitors: [],
        campaigns: [],
        intelligence: []
      };
    }
  }

  /**
   * Get performance metrics for the last 30 days
   */
  async getPerformanceMetrics() {
    try {
      const { data: metrics, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', this.userId)
        .gte('period_start', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('period_start');

      if (error) throw error;

      return metrics || [];
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
  }

  /**
   * Get threat alerts summary
   */
  async getThreatAlertsSummary() {
    try {
      const { data: alerts, error } = await supabase
        .from('threat_alerts')
        .select('*')
        .eq('user_id', this.userId)
        .eq('read_status', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const alertsByseverity = (alerts || []).reduce((acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: alerts?.length || 0,
        critical: alertsByseverity.critical || 0,
        high: alertsByseverity.high || 0,
        medium: alertsByseverity.medium || 0,
        low: alertsByseverity.low || 0,
        recent: alerts?.slice(0, 5) || []
      };
    } catch (error) {
      console.error('Error fetching threat alerts:', error);
      return {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        recent: []
      };
    }
  }
}
