import { CompetitorAnalysisService, BusinessInfo } from './competitorAnalysis';
import { RealTimeDataCollector } from './realTimeDataCollector';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingData {
  businessName: string;
  industry: string;
  email: string;
  phone?: string;
  city: string;
  state: string;
  zipcode: string;
  businessGoals: string;
  painPoints?: string;
}

export class OnboardingProcessor {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Process complete onboarding workflow
   */
  async processOnboarding(onboardingData: OnboardingData): Promise<void> {
    try {
      console.log('Starting onboarding process for user:', this.userId);

      // Step 1: Store client data
      await this.storeClientData(onboardingData);

      // Step 2: Start competitor analysis
      await this.initiateCompetitorAnalysis(onboardingData);

      // Step 3: Generate initial insights
      await this.generateInitialInsights(onboardingData);

      // Step 4: Set up monitoring
      await this.setupMonitoring(onboardingData);

      // Step 5: Start real-time data collection
      await this.startRealTimeDataCollection(onboardingData);

      console.log('Onboarding process completed successfully');
    } catch (error) {
      console.error('Error in onboarding process:', error);
      throw error;
    }
  }

  /**
   * Store client business data
   */
  private async storeClientData(data: OnboardingData): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .upsert({
          user_id: this.userId,
          business_name: data.businessName,
          industry: data.industry,
          email: data.email,
          phone: data.phone || null,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          business_goals: data.businessGoals,
          pain_points: data.painPoints || null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('Client data stored successfully');
    } catch (error) {
      console.error('Error storing client data:', error);
      throw error;
    }
  }

  /**
   * Initiate competitor analysis
   */
  private async initiateCompetitorAnalysis(data: OnboardingData): Promise<void> {
    try {
      const competitorService = new CompetitorAnalysisService(this.userId);
      
      const businessInfo: BusinessInfo = {
        businessName: data.businessName,
        industry: data.industry,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        businessGoals: data.businessGoals,
        painPoints: data.painPoints
      };

      await competitorService.analyzeCompetitors(businessInfo);
      console.log('Competitor analysis initiated successfully');
    } catch (error) {
      console.error('Error in competitor analysis:', error);
      // Don't throw - allow onboarding to continue even if competitor analysis fails
    }
  }

  /**
   * Generate initial business insights
   */
  private async generateInitialInsights(data: OnboardingData): Promise<void> {
    try {
      const insights = this.analyzeBusinessGoalsAndPainPoints(data);
      
      // Store insights in intelligence_feeds table
      const { error } = await supabase
        .from('intelligence_feeds')
        .insert(
          insights.map(insight => ({
            type: 'business_insight',
            title: insight.title,
            description: insight.description,
            source: 'Specter AI Analysis',
            priority: insight.priority,
            impact: insight.impact,
            data: { category: insight.category, recommendations: insight.recommendations },
            created_at: new Date().toISOString()
          }))
        );

      if (error) throw error;
      console.log('Initial insights generated successfully');
    } catch (error) {
      console.error('Error generating insights:', error);
      // Don't throw - allow onboarding to continue
    }
  }

  /**
   * Analyze business goals and pain points to generate insights
   */
  private analyzeBusinessGoalsAndPainPoints(data: OnboardingData) {
    const insights = [];

    // Analyze industry-specific opportunities
    const industryInsight = this.getIndustryInsight(data.industry);
    if (industryInsight) {
      insights.push(industryInsight);
    }

    // Analyze pain points for solutions
    if (data.painPoints) {
      const painPointInsights = this.analyzePainPoints(data.painPoints, data.industry);
      insights.push(...painPointInsights);
    }

    // Analyze business goals for strategies
    const goalInsights = this.analyzeBusinessGoals(data.businessGoals, data.industry);
    insights.push(...goalInsights);

    return insights;
  }

  /**
   * Get industry-specific insights
   */
  private getIndustryInsight(industry: string) {
    const industryInsights: Record<string, any> = {
      'Technology': {
        title: 'Tech Industry Competitive Landscape',
        description: 'The technology sector is highly competitive with rapid innovation cycles. Focus on differentiation through unique features and superior user experience.',
        priority: 'high',
        impact: 'positive',
        category: 'market_analysis',
        recommendations: [
          'Monitor competitor product releases',
          'Track technology stack changes',
          'Analyze patent filings',
          'Watch for talent acquisition patterns'
        ]
      },
      'Healthcare': {
        title: 'Healthcare Market Opportunities',
        description: 'Healthcare is experiencing digital transformation. Telemedicine and AI-driven solutions present significant opportunities.',
        priority: 'high',
        impact: 'positive',
        category: 'market_analysis',
        recommendations: [
          'Monitor regulatory changes',
          'Track digital health adoption',
          'Analyze patient satisfaction scores',
          'Watch for partnership announcements'
        ]
      },
      'Finance': {
        title: 'Financial Services Evolution',
        description: 'Fintech disruption continues to reshape traditional banking. Focus on digital-first solutions and customer experience.',
        priority: 'medium',
        impact: 'positive',
        category: 'market_analysis',
        recommendations: [
          'Monitor fintech partnerships',
          'Track digital adoption rates',
          'Analyze customer acquisition costs',
          'Watch for regulatory compliance updates'
        ]
      }
    };

    return industryInsights[industry] || null;
  }

  /**
   * Analyze pain points to generate actionable insights
   */
  private analyzePainPoints(painPoints: string, industry: string) {
    const insights = [];
    const lowerPainPoints = painPoints.toLowerCase();

    // Customer acquisition pain points
    if (lowerPainPoints.includes('customer') || lowerPainPoints.includes('lead') || lowerPainPoints.includes('sales')) {
      insights.push({
        title: 'Customer Acquisition Strategy',
        description: 'Identified customer acquisition challenges. Competitive intelligence can reveal successful competitor strategies.',
        priority: 'high',
        impact: 'positive',
        category: 'customer_acquisition',
        recommendations: [
          'Analyze competitor marketing channels',
          'Study competitor pricing strategies',
          'Monitor competitor customer reviews',
          'Track competitor social media engagement'
        ]
      });
    }

    // Competition pain points
    if (lowerPainPoints.includes('compet') || lowerPainPoints.includes('market share')) {
      insights.push({
        title: 'Competitive Positioning Analysis',
        description: 'Direct competition concerns detected. Focus on identifying competitor weaknesses and market gaps.',
        priority: 'high',
        impact: 'positive',
        category: 'competitive_analysis',
        recommendations: [
          'Conduct SWOT analysis of top competitors',
          'Identify competitor vulnerabilities',
          'Monitor competitor customer complaints',
          'Track competitor product roadmaps'
        ]
      });
    }

    // Pricing pain points
    if (lowerPainPoints.includes('pric') || lowerPainPoints.includes('cost') || lowerPainPoints.includes('budget')) {
      insights.push({
        title: 'Pricing Strategy Optimization',
        description: 'Pricing challenges identified. Competitor pricing analysis can reveal optimization opportunities.',
        priority: 'medium',
        impact: 'positive',
        category: 'pricing_strategy',
        recommendations: [
          'Monitor competitor pricing changes',
          'Analyze competitor value propositions',
          'Track competitor promotional strategies',
          'Study competitor customer retention rates'
        ]
      });
    }

    return insights;
  }

  /**
   * Analyze business goals to generate strategic insights
   */
  private analyzeBusinessGoals(goals: string, industry: string) {
    const insights = [];
    const lowerGoals = goals.toLowerCase();

    // Growth goals
    if (lowerGoals.includes('grow') || lowerGoals.includes('expand') || lowerGoals.includes('scale')) {
      insights.push({
        title: 'Growth Strategy Intelligence',
        description: 'Growth objectives identified. Monitor competitor expansion strategies and market opportunities.',
        priority: 'high',
        impact: 'positive',
        category: 'growth_strategy',
        recommendations: [
          'Track competitor market expansion',
          'Monitor competitor hiring patterns',
          'Analyze competitor funding announcements',
          'Study competitor partnership strategies'
        ]
      });
    }

    // Innovation goals
    if (lowerGoals.includes('innovat') || lowerGoals.includes('product') || lowerGoals.includes('technology')) {
      insights.push({
        title: 'Innovation Monitoring Setup',
        description: 'Innovation focus detected. Set up monitoring for competitor product developments and technology trends.',
        priority: 'medium',
        impact: 'positive',
        category: 'innovation_tracking',
        recommendations: [
          'Monitor competitor product releases',
          'Track competitor patent applications',
          'Analyze competitor R&D investments',
          'Watch for competitor technology partnerships'
        ]
      });
    }

    return insights;
  }

  /**
   * Set up ongoing monitoring for the client
   */
  private async setupMonitoring(data: OnboardingData): Promise<void> {
    try {
      // Set up keyword monitoring
      await this.setupKeywordMonitoring(data);

      // Set up competitor alerts
      await this.setupCompetitorAlerts(data);

      console.log('Monitoring setup completed');
    } catch (error) {
      console.error('Error setting up monitoring:', error);
      // Don't throw - allow onboarding to continue
    }
  }

  /**
   * Set up keyword monitoring based on business info
   */
  private async setupKeywordMonitoring(data: OnboardingData): Promise<void> {
    const keywords = [
      data.businessName,
      `${data.industry} ${data.city}`,
      `${data.industry} services`,
      `best ${data.industry} company`,
      `${data.industry} reviews`
    ];

    // In production, this would set up actual keyword monitoring
    console.log('Keyword monitoring set up for:', keywords);
  }

  /**
   * Set up competitor alerts
   */
  private async setupCompetitorAlerts(data: OnboardingData): Promise<void> {
    // In production, this would set up real-time alerts for:
    // - Competitor news mentions
    // - Competitor product updates
    // - Competitor pricing changes
    // - Competitor hiring announcements
    
    console.log('Competitor alerts set up for industry:', data.industry);
  }

  /**
   * Start real-time data collection
   */
  private async startRealTimeDataCollection(data: OnboardingData): Promise<void> {
    try {
      const dataCollector = new RealTimeDataCollector(this.userId);

      await dataCollector.startDataCollection({
        businessName: data.businessName,
        industry: data.industry,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode
      });

      console.log('Real-time data collection started successfully');
    } catch (error) {
      console.error('Error starting real-time data collection:', error);
      // Don't throw - allow onboarding to continue
    }
  }
}
