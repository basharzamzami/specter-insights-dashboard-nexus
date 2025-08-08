/**
 * Lead Threat Score System
 * Advanced lead scoring with competitive threat assessment and dynamic follow-up
 */

interface LeadThreatScore {
  lead_id: string;
  overall_score: number;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  scoring_factors: {
    intent_strength: number;
    competitive_pressure: number;
    urgency_indicators: number;
    budget_authority: number;
    fit_score: number;
    engagement_level: number;
    competitor_influence: number;
  };
  threat_indicators: {
    competitor_mentions: string[];
    price_sensitivity: number;
    decision_timeline: string;
    evaluation_stage: string;
    stakeholder_count: number;
  };
  recommended_actions: {
    priority_level: 1 | 2 | 3 | 4 | 5;
    response_time_hours: number;
    follow_up_sequence: string;
    messaging_strategy: string;
    escalation_required: boolean;
  };
  dynamic_follow_up: {
    next_touchpoint: Date;
    channel: 'email' | 'phone' | 'linkedin' | 'sms';
    message_type: 'educational' | 'competitive' | 'urgency' | 'value';
    personalization_data: any;
  };
  competitive_intelligence: {
    likely_competitors: string[];
    competitive_advantages: string[];
    differentiation_points: string[];
    objection_handling: string[];
  };
  calculated_at: Date;
  expires_at: Date;
}

interface ConversationIntelligence {
  lead_id: string;
  conversation_id: string;
  channel: string;
  sentiment_score: number;
  intent_signals: string[];
  competitor_mentions: string[];
  urgency_indicators: string[];
  objections_raised: string[];
  buying_signals: string[];
  decision_makers_identified: string[];
  budget_indicators: any;
  timeline_indicators: any;
  next_steps_mentioned: string[];
  conversation_summary: string;
  key_insights: string[];
  recommended_follow_up: string;
  analyzed_at: Date;
}

interface ZoneDominanceMetrics {
  zone_id: string;
  zone_name: string;
  market_share: number;
  lead_conversion_rate: number;
  average_deal_size: number;
  competitor_activity: number;
  market_penetration: number;
  growth_rate: number;
  threat_level: number;
  opportunities: string[];
  threats: string[];
  recommended_actions: string[];
  last_updated: Date;
}

export class LeadThreatScoreSystem {
  private openaiApiKey: string;
  private conversationAnalysisModel: string = 'gpt-4-turbo-preview';

  constructor() {
    this.openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';
    
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not configured - conversation intelligence will be limited');
    }
  }

  /**
   * Calculate comprehensive lead threat score
   */
  async calculateLeadThreatScore(
    leadData: any,
    conversationHistory: any[],
    competitorData: any[]
  ): Promise<LeadThreatScore> {
    try {
      // Analyze conversation intelligence
      const conversationIntel = await this.analyzeConversations(leadData.id, conversationHistory);
      
      // Calculate individual scoring factors
      const scoringFactors = {
        intent_strength: this.calculateIntentStrength(leadData, conversationIntel),
        competitive_pressure: this.calculateCompetitivePressure(leadData, conversationIntel, competitorData),
        urgency_indicators: this.calculateUrgencyScore(leadData, conversationIntel),
        budget_authority: this.calculateBudgetAuthorityScore(leadData, conversationIntel),
        fit_score: this.calculateFitScore(leadData),
        engagement_level: this.calculateEngagementScore(leadData, conversationHistory),
        competitor_influence: this.calculateCompetitorInfluence(conversationIntel, competitorData)
      };

      // Calculate overall threat score
      const overallScore = this.calculateOverallThreatScore(scoringFactors);
      const threatLevel = this.determineThreatLevel(overallScore);

      // Extract threat indicators
      const threatIndicators = this.extractThreatIndicators(leadData, conversationIntel);

      // Generate recommendations
      const recommendedActions = this.generateRecommendedActions(overallScore, threatLevel, threatIndicators);

      // Plan dynamic follow-up
      const dynamicFollowUp = this.planDynamicFollowUp(leadData, conversationIntel, threatLevel);

      // Generate competitive intelligence
      const competitiveIntelligence = this.generateCompetitiveIntelligence(conversationIntel, competitorData);

      return {
        lead_id: leadData.id,
        overall_score: overallScore,
        threat_level: threatLevel,
        scoring_factors: scoringFactors,
        threat_indicators: threatIndicators,
        recommended_actions: recommendedActions,
        dynamic_follow_up: dynamicFollowUp,
        competitive_intelligence: competitiveIntelligence,
        calculated_at: new Date(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

    } catch (error) {
      console.error('Lead threat score calculation failed:', error);
      throw error;
    }
  }

  /**
   * Analyze conversations using AI for intelligence extraction
   */
  async analyzeConversations(leadId: string, conversations: any[]): Promise<ConversationIntelligence[]> {
    const intelligence: ConversationIntelligence[] = [];

    for (const conversation of conversations) {
      try {
        const analysis = await this.analyzeConversationWithAI(conversation);
        intelligence.push({
          lead_id: leadId,
          conversation_id: conversation.id,
          channel: conversation.channel || 'unknown',
          ...analysis,
          analyzed_at: new Date()
        });
      } catch (error) {
        console.error(`Error analyzing conversation ${conversation.id}:`, error);
        continue;
      }
    }

    return intelligence;
  }

  /**
   * Use AI to analyze conversation content
   */
  private async analyzeConversationWithAI(conversation: any): Promise<Partial<ConversationIntelligence>> {
    if (!this.openaiApiKey) {
      return this.fallbackConversationAnalysis(conversation);
    }

    const systemPrompt = `You are an expert sales conversation analyst. Analyze the conversation and extract key intelligence in JSON format.

Extract:
1. Sentiment score (0-100)
2. Intent signals (buying indicators)
3. Competitor mentions
4. Urgency indicators
5. Objections raised
6. Buying signals
7. Decision makers identified
8. Budget indicators
9. Timeline indicators
10. Next steps mentioned
11. Conversation summary
12. Key insights
13. Recommended follow-up

Return as JSON object with these exact keys.`;

    const userPrompt = `Analyze this sales conversation:

CONVERSATION:
${JSON.stringify(conversation, null, 2)}

Provide comprehensive analysis focusing on sales intelligence and competitive insights.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.conversationAnalysisModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);

    } catch (error) {
      console.error('AI conversation analysis failed:', error);
      return this.fallbackConversationAnalysis(conversation);
    }
  }

  /**
   * Fallback conversation analysis without AI
   */
  private fallbackConversationAnalysis(conversation: any): Partial<ConversationIntelligence> {
    const content = (conversation.content || '').toLowerCase();
    
    return {
      sentiment_score: content.includes('interested') ? 70 : content.includes('not interested') ? 30 : 50,
      intent_signals: this.extractKeywords(content, ['buy', 'purchase', 'implement', 'start', 'need']),
      competitor_mentions: this.extractKeywords(content, ['competitor', 'alternative', 'other', 'compare']),
      urgency_indicators: this.extractKeywords(content, ['urgent', 'asap', 'quickly', 'soon', 'deadline']),
      objections_raised: this.extractKeywords(content, ['expensive', 'cost', 'budget', 'concern', 'worry']),
      buying_signals: this.extractKeywords(content, ['when', 'how', 'price', 'contract', 'agreement']),
      decision_makers_identified: [],
      budget_indicators: {},
      timeline_indicators: {},
      next_steps_mentioned: [],
      conversation_summary: content.substring(0, 200),
      key_insights: ['Fallback analysis - limited insights available'],
      recommended_follow_up: 'Follow up within 24 hours'
    };
  }

  /**
   * Calculate intent strength score
   */
  private calculateIntentStrength(leadData: any, conversationIntel: ConversationIntelligence[]): number {
    let score = 50; // Base score

    // Analyze conversation signals
    for (const intel of conversationIntel) {
      score += intel.intent_signals.length * 10;
      score += intel.buying_signals.length * 15;
      score += Math.max(0, intel.sentiment_score - 50) * 0.5;
    }

    // Lead behavior indicators
    if (leadData.website_visits > 5) score += 10;
    if (leadData.email_opens > 3) score += 5;
    if (leadData.content_downloads > 1) score += 10;
    if (leadData.demo_requested) score += 20;
    if (leadData.pricing_page_visits > 0) score += 15;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate competitive pressure score
   */
  private calculateCompetitivePressure(
    leadData: any, 
    conversationIntel: ConversationIntelligence[], 
    competitorData: any[]
  ): number {
    let pressure = 0;

    // Competitor mentions in conversations
    const competitorMentions = conversationIntel.reduce((acc, intel) => 
      acc + intel.competitor_mentions.length, 0
    );
    pressure += competitorMentions * 20;

    // Active competitor campaigns
    const activeCompetitors = competitorData.filter(c => c.active_campaigns > 0).length;
    pressure += activeCompetitors * 10;

    // Market saturation
    if (competitorData.length > 5) pressure += 20;

    // Price comparison behavior
    if (leadData.pricing_page_visits > 2) pressure += 15;

    return Math.min(100, pressure);
  }

  /**
   * Calculate urgency score
   */
  private calculateUrgencyScore(leadData: any, conversationIntel: ConversationIntelligence[]): number {
    let urgency = 30; // Base urgency

    // Conversation urgency indicators
    for (const intel of conversationIntel) {
      urgency += intel.urgency_indicators.length * 15;
    }

    // Behavioral urgency indicators
    if (leadData.recent_activity_spike) urgency += 20;
    if (leadData.multiple_stakeholders_engaged) urgency += 15;
    if (leadData.demo_scheduled) urgency += 25;

    // Timeline indicators
    if (leadData.stated_timeline === 'immediate') urgency += 30;
    else if (leadData.stated_timeline === 'this_quarter') urgency += 20;
    else if (leadData.stated_timeline === 'this_year') urgency += 10;

    return Math.min(100, Math.max(0, urgency));
  }

  /**
   * Calculate budget authority score
   */
  private calculateBudgetAuthorityScore(leadData: any, conversationIntel: ConversationIntelligence[]): number {
    let score = 40; // Base score

    // Role-based scoring
    const role = (leadData.title || '').toLowerCase();
    if (role.includes('ceo') || role.includes('founder')) score += 30;
    else if (role.includes('cto') || role.includes('cfo')) score += 25;
    else if (role.includes('director') || role.includes('vp')) score += 20;
    else if (role.includes('manager')) score += 15;

    // Company size indicators
    if (leadData.company_size > 100) score += 15;
    else if (leadData.company_size > 50) score += 10;

    // Budget discussions in conversations
    for (const intel of conversationIntel) {
      if (intel.budget_indicators && Object.keys(intel.budget_indicators).length > 0) {
        score += 20;
      }
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate fit score
   */
  private calculateFitScore(leadData: any): number {
    let fit = 50; // Base fit

    // Industry fit
    const targetIndustries = ['technology', 'healthcare', 'finance', 'retail'];
    if (targetIndustries.includes(leadData.industry?.toLowerCase())) {
      fit += 20;
    }

    // Company size fit
    if (leadData.company_size >= 10 && leadData.company_size <= 500) {
      fit += 15;
    }

    // Geographic fit
    const targetRegions = ['north_america', 'europe'];
    if (targetRegions.includes(leadData.region?.toLowerCase())) {
      fit += 10;
    }

    // Use case fit
    if (leadData.use_case && leadData.use_case.includes('marketing')) {
      fit += 15;
    }

    return Math.min(100, Math.max(0, fit));
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(leadData: any, conversationHistory: any[]): number {
    let engagement = 20; // Base engagement

    // Conversation frequency
    engagement += Math.min(30, conversationHistory.length * 5);

    // Digital engagement
    engagement += Math.min(20, (leadData.email_opens || 0) * 2);
    engagement += Math.min(15, (leadData.website_visits || 0) * 1.5);
    engagement += Math.min(10, (leadData.content_downloads || 0) * 5);

    // Response rate
    if (leadData.response_rate > 0.8) engagement += 15;
    else if (leadData.response_rate > 0.5) engagement += 10;

    return Math.min(100, Math.max(0, engagement));
  }

  /**
   * Calculate competitor influence score
   */
  private calculateCompetitorInfluence(
    conversationIntel: ConversationIntelligence[], 
    competitorData: any[]
  ): number {
    let influence = 0;

    // Direct competitor mentions
    const totalMentions = conversationIntel.reduce((acc, intel) => 
      acc + intel.competitor_mentions.length, 0
    );
    influence += Math.min(40, totalMentions * 10);

    // Competitor market strength
    const strongCompetitors = competitorData.filter(c => c.market_share > 10).length;
    influence += strongCompetitors * 15;

    return Math.min(100, influence);
  }

  /**
   * Calculate overall threat score
   */
  private calculateOverallThreatScore(factors: any): number {
    const weights = {
      intent_strength: 0.25,
      competitive_pressure: 0.20,
      urgency_indicators: 0.20,
      budget_authority: 0.15,
      fit_score: 0.10,
      engagement_level: 0.05,
      competitor_influence: 0.05
    };

    let score = 0;
    for (const [factor, value] of Object.entries(factors)) {
      const weight = weights[factor as keyof typeof weights] || 0;
      score += (value as number) * weight;
    }

    return Math.round(score);
  }

  /**
   * Determine threat level based on score
   */
  private determineThreatLevel(score: number): LeadThreatScore['threat_level'] {
    if (score >= 80) return 'critical';
    if (score >= 65) return 'high';
    if (score >= 45) return 'medium';
    return 'low';
  }

  /**
   * Extract threat indicators
   */
  private extractThreatIndicators(leadData: any, conversationIntel: ConversationIntelligence[]): any {
    const allCompetitorMentions = conversationIntel.reduce((acc, intel) => 
      [...acc, ...intel.competitor_mentions], [] as string[]
    );

    return {
      competitor_mentions: [...new Set(allCompetitorMentions)],
      price_sensitivity: this.calculatePriceSensitivity(conversationIntel),
      decision_timeline: leadData.stated_timeline || 'unknown',
      evaluation_stage: this.determineEvaluationStage(conversationIntel),
      stakeholder_count: leadData.stakeholder_count || 1
    };
  }

  /**
   * Generate recommended actions
   */
  private generateRecommendedActions(score: number, threatLevel: string, indicators: any): any {
    const baseActions = {
      priority_level: 3 as 1 | 2 | 3 | 4 | 5,
      response_time_hours: 24,
      follow_up_sequence: 'standard',
      messaging_strategy: 'value_focused',
      escalation_required: false
    };

    switch (threatLevel) {
      case 'critical':
        return {
          ...baseActions,
          priority_level: 1 as 1 | 2 | 3 | 4 | 5,
          response_time_hours: 2,
          follow_up_sequence: 'aggressive',
          messaging_strategy: 'competitive_differentiation',
          escalation_required: true
        };
      case 'high':
        return {
          ...baseActions,
          priority_level: 2 as 1 | 2 | 3 | 4 | 5,
          response_time_hours: 4,
          follow_up_sequence: 'accelerated',
          messaging_strategy: 'urgency_and_value',
          escalation_required: true
        };
      case 'medium':
        return {
          ...baseActions,
          priority_level: 3 as 1 | 2 | 3 | 4 | 5,
          response_time_hours: 12,
          follow_up_sequence: 'enhanced',
          messaging_strategy: 'educational_value'
        };
      default:
        return baseActions;
    }
  }

  /**
   * Plan dynamic follow-up
   */
  private planDynamicFollowUp(leadData: any, conversationIntel: ConversationIntelligence[], threatLevel: string): any {
    const now = new Date();
    const hoursToNext = threatLevel === 'critical' ? 2 : threatLevel === 'high' ? 6 : 24;
    
    return {
      next_touchpoint: new Date(now.getTime() + hoursToNext * 60 * 60 * 1000),
      channel: this.selectOptimalChannel(leadData, conversationIntel),
      message_type: this.selectMessageType(threatLevel, conversationIntel),
      personalization_data: this.extractPersonalizationData(leadData, conversationIntel)
    };
  }

  /**
   * Generate competitive intelligence
   */
  private generateCompetitiveIntelligence(conversationIntel: ConversationIntelligence[], competitorData: any[]): any {
    const mentionedCompetitors = [...new Set(
      conversationIntel.reduce((acc, intel) => [...acc, ...intel.competitor_mentions], [] as string[])
    )];

    return {
      likely_competitors: mentionedCompetitors,
      competitive_advantages: ['Better pricing', 'Superior features', 'Better support'],
      differentiation_points: ['Unique technology', 'Industry expertise', 'Customer success'],
      objection_handling: this.generateObjectionHandling(conversationIntel)
    };
  }

  // Helper methods
  private extractKeywords(text: string, keywords: string[]): string[] {
    return keywords.filter(keyword => text.includes(keyword));
  }

  private calculatePriceSensitivity(conversationIntel: ConversationIntelligence[]): number {
    const priceRelatedMentions = conversationIntel.reduce((acc, intel) => 
      acc + intel.objections_raised.filter(obj => 
        obj.toLowerCase().includes('price') || obj.toLowerCase().includes('cost')
      ).length, 0
    );
    
    return Math.min(100, priceRelatedMentions * 25);
  }

  private determineEvaluationStage(conversationIntel: ConversationIntelligence[]): string {
    const hasDemo = conversationIntel.some(intel => 
      intel.conversation_summary.toLowerCase().includes('demo')
    );
    const hasPricing = conversationIntel.some(intel => 
      intel.conversation_summary.toLowerCase().includes('pricing')
    );
    
    if (hasPricing) return 'negotiation';
    if (hasDemo) return 'evaluation';
    return 'discovery';
  }

  private selectOptimalChannel(leadData: any, conversationIntel: ConversationIntelligence[]): 'email' | 'phone' | 'linkedin' | 'sms' {
    const channelPreference = conversationIntel.reduce((acc, intel) => {
      acc[intel.channel] = (acc[intel.channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const preferredChannel = Object.entries(channelPreference)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    return (preferredChannel as any) || 'email';
  }

  private selectMessageType(threatLevel: string, conversationIntel: ConversationIntelligence[]): 'educational' | 'competitive' | 'urgency' | 'value' {
    if (threatLevel === 'critical') return 'competitive';
    if (threatLevel === 'high') return 'urgency';
    
    const hasCompetitorMentions = conversationIntel.some(intel => intel.competitor_mentions.length > 0);
    if (hasCompetitorMentions) return 'competitive';
    
    return 'value';
  }

  private extractPersonalizationData(leadData: any, conversationIntel: ConversationIntelligence[]): any {
    return {
      name: leadData.first_name,
      company: leadData.company_name,
      industry: leadData.industry,
      recent_interests: conversationIntel.reduce((acc, intel) => [...acc, ...intel.intent_signals], [] as string[]),
      pain_points: conversationIntel.reduce((acc, intel) => [...acc, ...intel.objections_raised], [] as string[])
    };
  }

  private generateObjectionHandling(conversationIntel: ConversationIntelligence[]): string[] {
    const objections = conversationIntel.reduce((acc, intel) => [...acc, ...intel.objections_raised], [] as string[]);
    
    return objections.map(objection => {
      if (objection.toLowerCase().includes('price')) {
        return 'Emphasize ROI and long-term value';
      }
      if (objection.toLowerCase().includes('feature')) {
        return 'Provide detailed feature comparison';
      }
      return 'Address concern with case studies and testimonials';
    });
  }
}

export const leadThreatScoreSystem = new LeadThreatScoreSystem();
