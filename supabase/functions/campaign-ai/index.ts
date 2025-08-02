import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Campaign AI function invoked');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, user_id, competitor_id, threat_alerts } = await req.json();
    
    console.log('Action:', action, 'User ID:', user_id);

    if (action === 'generate_recommendations') {
      // Fetch competitor data for analysis
      const { data: competitors, error: compError } = await supabase
        .from('competitor_profiles')
        .select('*')
        .eq('created_by', user_id)
        .eq('is_deleted', false);

      if (compError) {
        console.error('Error fetching competitors:', compError);
        throw compError;
      }

      // Fetch recent threat alerts
      const { data: alerts, error: alertError } = await supabase
        .from('threat_alerts')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (alertError) {
        console.error('Error fetching alerts:', alertError);
      }

      // Generate AI-powered recommendations
      const recommendations = generateStrikeRecommendations(competitors || [], alerts || []);
      
      // Store recommendations in database
      const recommendationsToInsert = recommendations.map(rec => ({
        user_id,
        type: rec.type,
        title: rec.title,
        description: rec.description,
        details: rec.details,
        estimated_budget: rec.estimated_budget,
        status: 'pending'
      }));

      const { data: insertedRecs, error: insertError } = await supabase
        .from('campaign_recommendations')
        .insert(recommendationsToInsert)
        .select();

      if (insertError) {
        console.error('Error inserting recommendations:', insertError);
        throw insertError;
      }

      console.log(`Generated ${recommendations.length} recommendations for user ${user_id}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          recommendations: insertedRecs,
          count: recommendations.length 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (action === 'analyze_vulnerability') {
      const { data: competitor, error } = await supabase
        .from('competitor_profiles')
        .select('*')
        .eq('id', competitor_id)
        .single();

      if (error) throw error;

      const analysis = analyzeCompetitorVulnerabilities(competitor);
      
      return new Response(
        JSON.stringify({ success: true, analysis }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );

  } catch (error) {
    console.error('Campaign AI error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function generateStrikeRecommendations(competitors: any[], alerts: any[]) {
  const strikeTypes = [
    {
      type: 'seo_warfare',
      name: 'SEO Warfare',
      description: 'Target competitor search rankings and organic traffic',
      baseScore: 0.7
    },
    {
      type: 'social_ops',
      name: 'Social Operations',
      description: 'Influence social media perception and engagement',
      baseScore: 0.6
    },
    {
      type: 'ad_hijack',
      name: 'Ad Hijacking',
      description: 'Intercept competitor advertising traffic',
      baseScore: 0.8
    },
    {
      type: 'market_disruption',
      name: 'Market Disruption',
      description: 'Direct competitive attacks on market position',
      baseScore: 0.5
    },
    {
      type: 'whisper_network',
      name: 'Whisper Network',
      description: 'Deploy subtle negative messaging across platforms',
      baseScore: 0.4
    }
  ];

  const recommendations = [];

  for (const competitor of competitors.slice(0, 3)) {
    // Analyze competitor vulnerabilities
    const vulnerabilities = competitor.vulnerabilities || [];
    const seoScore = competitor.seo_score || 50;
    const sentimentScore = competitor.sentiment_score || 0;
    
    // Calculate priority based on competitor strength and vulnerabilities
    let priorityScore = 0;
    if (seoScore < 40) priorityScore += 0.3;
    if (sentimentScore < -0.1) priorityScore += 0.2;
    if (vulnerabilities.length > 2) priorityScore += 0.3;
    
    // Recent threat alerts increase priority
    const competitorAlerts = alerts.filter(alert => 
      alert.message?.toLowerCase().includes(competitor.company_name.toLowerCase())
    );
    if (competitorAlerts.length > 0) priorityScore += 0.2;

    // Generate recommendations for each strike type
    for (const strikeType of strikeTypes) {
      let confidence = strikeType.baseScore + priorityScore;
      confidence = Math.min(0.95, Math.max(0.3, confidence));
      
      const estimatedBudget = calculateBudget(strikeType.type, competitor, confidence);
      const timeline = calculateTimeline(strikeType.type, confidence);
      const successProbability = Math.floor(confidence * 100);
      
      const recommendation = {
        type: strikeType.type,
        title: `${strikeType.name}: ${competitor.company_name}`,
        description: `${strikeType.description} targeting ${competitor.company_name}`,
        estimated_budget: estimatedBudget,
        details: {
          target_competitor: competitor.company_name,
          confidence_score: Math.floor(confidence * 100),
          success_probability: successProbability,
          vulnerabilities_exploited: vulnerabilities.slice(0, 3),
          timeline: timeline,
          priority: getPriority(priorityScore),
          tactics: generateTactics(strikeType.type, vulnerabilities),
          expected_impact: generateExpectedImpact(strikeType.type, confidence),
          risk_level: getRiskLevel(strikeType.type, competitor),
          analysis: {
            seo_weakness: seoScore < 50,
            sentiment_vulnerability: sentimentScore < 0,
            recent_threats: competitorAlerts.length,
            total_vulnerabilities: vulnerabilities.length
          }
        }
      };
      
      // Only include high-confidence recommendations
      if (confidence > 0.5) {
        recommendations.push(recommendation);
      }
    }
  }

  // Sort by confidence and return top recommendations
  return recommendations
    .sort((a, b) => b.details.confidence_score - a.details.confidence_score)
    .slice(0, 8);
}

function calculateBudget(strikeType: string, competitor: any, confidence: number): number {
  const baseBudgets = {
    seo_warfare: 15000,
    social_ops: 8000,
    ad_hijack: 25000,
    market_disruption: 50000,
    whisper_network: 12000
  };
  
  const baseBudget = baseBudgets[strikeType] || 15000;
  const confidenceMultiplier = 0.5 + (confidence * 1.5);
  
  return Math.floor(baseBudget * confidenceMultiplier);
}

function calculateTimeline(strikeType: string, confidence: number): string {
  const baseTimelines = {
    seo_warfare: ['4-6 weeks', '6-8 weeks', '8-12 weeks'],
    social_ops: ['1-2 weeks', '2-4 weeks', '4-6 weeks'],
    ad_hijack: ['1-3 weeks', '3-5 weeks', '5-8 weeks'],
    market_disruption: ['8-12 weeks', '12-16 weeks', '16-24 weeks'],
    whisper_network: ['6-8 weeks', '8-12 weeks', '12-16 weeks']
  };
  
  const timelines = baseTimelines[strikeType] || ['4-6 weeks', '6-8 weeks', '8-12 weeks'];
  const timelineIndex = confidence > 0.8 ? 0 : confidence > 0.6 ? 1 : 2;
  
  return timelines[timelineIndex];
}

function getPriority(priorityScore: number): string {
  if (priorityScore > 0.7) return 'critical';
  if (priorityScore > 0.5) return 'high';
  if (priorityScore > 0.3) return 'medium';
  return 'low';
}

function generateTactics(strikeType: string, vulnerabilities: string[]): string[] {
  const tacticMap = {
    seo_warfare: ['Keyword targeting', 'Content superiority', 'Backlink disruption', 'Technical SEO attacks'],
    social_ops: ['Sentiment manipulation', 'Community engagement', 'Viral content', 'Influencer campaigns'],
    ad_hijack: ['Keyword bidding', 'Audience targeting', 'Creative superiority', 'Landing page optimization'],
    market_disruption: ['Price undercutting', 'Feature superiority', 'Client poaching', 'Distribution channel attacks'],
    whisper_network: ['Forum infiltration', 'Review manipulation', 'Industry influence', 'Subtle messaging']
  };
  
  const baseTactics = tacticMap[strikeType] || [];
  return baseTactics.slice(0, 2 + Math.floor(Math.random() * 2));
}

function generateExpectedImpact(strikeType: string, confidence: number): string {
  const impacts = {
    seo_warfare: ['10-15% traffic decrease', '15-25% ranking drops', '20-30% visibility reduction'],
    social_ops: ['15-25% engagement drop', '20-30% sentiment decline', '10-20% follower loss'],
    ad_hijack: ['25-35% traffic capture', '15-25% conversion steal', '30-40% keyword dominance'],
    market_disruption: ['10-20% market share gain', '15-25% customer acquisition', '20-30% revenue impact'],
    whisper_network: ['15-25% reputation damage', '10-20% trust erosion', '20-30% perception shift']
  };
  
  const impactOptions = impacts[strikeType] || ['10-20% impact'];
  const impactIndex = confidence > 0.8 ? 2 : confidence > 0.6 ? 1 : 0;
  
  return impactOptions[impactIndex];
}

function getRiskLevel(strikeType: string, competitor: any): string {
  const riskLevels = {
    seo_warfare: 'Medium',
    social_ops: 'Low',
    ad_hijack: 'Medium',
    market_disruption: 'High',
    whisper_network: 'High'
  };
  
  return riskLevels[strikeType] || 'Medium';
}

function analyzeCompetitorVulnerabilities(competitor: any) {
  const analysis = {
    seo_vulnerabilities: [],
    social_vulnerabilities: [],
    technical_vulnerabilities: [],
    market_vulnerabilities: [],
    overall_score: 0
  };
  
  // SEO Analysis
  if (competitor.seo_score < 50) {
    analysis.seo_vulnerabilities.push('Low SEO score indicates ranking opportunities');
  }
  if (competitor.top_keywords && competitor.top_keywords.length < 10) {
    analysis.seo_vulnerabilities.push('Limited keyword portfolio');
  }
  
  // Social Analysis
  if (competitor.social_sentiment && competitor.social_sentiment.sentiment_score < 0) {
    analysis.social_vulnerabilities.push('Negative social sentiment detected');
  }
  
  // Market Analysis
  if (competitor.estimated_ad_spend < 10000) {
    analysis.market_vulnerabilities.push('Low advertising investment');
  }
  
  // Calculate overall vulnerability score
  const totalVulns = analysis.seo_vulnerabilities.length + 
                    analysis.social_vulnerabilities.length + 
                    analysis.technical_vulnerabilities.length + 
                    analysis.market_vulnerabilities.length;
  
  analysis.overall_score = Math.min(100, totalVulns * 20);
  
  return analysis;
}