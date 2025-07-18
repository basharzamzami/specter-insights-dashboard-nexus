import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, feedId, trackingEnabled } = await req.json();
    
    console.log(`Intelligence feed action: ${action}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === 'fetch_live_feeds') {
      // Generate real-time intelligence feeds
      const feeds = await generateLiveIntelligenceFeeds();
      
      // Store feeds in database
      for (const feed of feeds) {
        await supabase.from('intelligence_feeds').upsert(feed);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        data: feeds 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'enable_tracking' && feedId) {
      await supabase
        .from('intelligence_feeds')
        .update({ tracking_enabled: trackingEnabled })
        .eq('id', feedId);

      return new Response(JSON.stringify({ 
        success: true, 
        message: `Tracking ${trackingEnabled ? 'enabled' : 'disabled'} for feed` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_counter_strategy') {
      const strategy = await generateCounterStrategy(req);
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: strategy 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'execute_response') {
      const response = await executeResponse(req);
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: response 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in intelligence feed:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateLiveIntelligenceFeeds() {
  const companies = ['TechCorp', 'DataSolutions', 'CloudInnovate', 'StartupX', 'InnovateLabs'];
  const feedTypes = ['news', 'hiring', 'product', 'review', 'social', 'financial'];
  
  const feeds = [];
  
  for (let i = 0; i < 15; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const type = feedTypes[Math.floor(Math.random() * feedTypes.length)];
    const priority = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)];
    const impact = ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)];
    
    feeds.push({
      type,
      title: generateFeedTitle(type, company),
      description: generateFeedDescription(type, company),
      source: generateSource(type),
      competitor: company,
      priority,
      impact,
      url: generateUrl(type, company),
      is_trending: Math.random() > 0.7,
      data: {
        metrics: generateMetrics(type),
        timestamp: new Date().toISOString(),
        confidence: Math.floor(Math.random() * 30) + 70
      }
    });
  }
  
  return feeds;
}

function generateFeedTitle(type: string, company: string): string {
  const titles = {
    news: [
      `${company} announces major product update`,
      `${company} expands to European markets`,
      `${company} partners with industry leader`
    ],
    hiring: [
      `${company} hiring 20+ engineers rapidly`,
      `${company} opens new development center`,
      `${company} expands sales team by 150%`
    ],
    product: [
      `${company} launches AI-powered features`,
      `${company} releases enterprise security update`,
      `${company} announces API v3.0`
    ],
    review: [
      `${company} receives surge in negative reviews`,
      `${company} customer satisfaction drops 15%`,
      `${company} faces pricing complaints`
    ],
    social: [
      `${company} outage trending on Twitter`,
      `${company} CEO controversial statement`,
      `${company} viral customer testimonial`
    ],
    financial: [
      `${company} raises $50M Series B`,
      `${company} acquires competitor`,
      `${company} IPO rumors confirmed`
    ]
  };
  
  const typeOptions = titles[type as keyof typeof titles] || [`${company} general update`];
  return typeOptions[Math.floor(Math.random() * typeOptions.length)];
}

function generateFeedDescription(type: string, company: string): string {
  const descriptions = {
    news: `Strategic move by ${company} indicates market expansion. Monitor for competitive response opportunities.`,
    hiring: `Rapid hiring spree suggests ${company} is scaling or facing retention issues. Talent acquisition opportunity.`,
    product: `New product features from ${company} may impact our market position. Immediate analysis required.`,
    review: `Customer dissatisfaction with ${company} creates opportunity for competitive campaigns.`,
    social: `Social media sentiment shift provides opening for reputation-based strategies.`,
    financial: `${company}'s funding changes competitive landscape dynamics significantly.`
  };
  
  return descriptions[type as keyof typeof descriptions] || `Intelligence update regarding ${company}.`;
}

function generateSource(type: string): string {
  const sources = {
    news: 'TechCrunch Monitor',
    hiring: 'LinkedIn Intelligence',
    product: 'Product Hunt Tracker',
    review: 'Review Monitor Pro',
    social: 'Social Sentiment API',
    financial: 'FinTech Intelligence'
  };
  
  return sources[type as keyof typeof sources] || 'Intelligence Monitor';
}

function generateUrl(type: string, company: string): string {
  const baseUrls = {
    news: 'https://techcrunch.com/',
    hiring: 'https://linkedin.com/company/',
    product: 'https://producthunt.com/posts/',
    review: 'https://g2.com/products/',
    social: 'https://twitter.com/search?q=',
    financial: 'https://crunchbase.com/organization/'
  };
  
  const base = baseUrls[type as keyof typeof baseUrls] || 'https://example.com/';
  return base + company.toLowerCase().replace(' ', '-');
}

function generateMetrics(type: string) {
  const metrics = {
    news: {
      shares: Math.floor(Math.random() * 1000) + 100,
      comments: Math.floor(Math.random() * 500) + 50,
      reach: Math.floor(Math.random() * 10000) + 1000
    },
    hiring: {
      positions: Math.floor(Math.random() * 50) + 5,
      departments: Math.floor(Math.random() * 10) + 1,
      urgency: Math.floor(Math.random() * 5) + 1
    },
    product: {
      features: Math.floor(Math.random() * 10) + 1,
      userImpact: Math.floor(Math.random() * 100) + 1,
      competitorThreat: Math.floor(Math.random() * 10) + 1
    },
    review: {
      rating: parseFloat((Math.random() * 2 + 1).toFixed(1)),
      count: Math.floor(Math.random() * 100) + 10,
      trend: Math.random() > 0.5 ? 'declining' : 'stable'
    },
    social: {
      mentions: Math.floor(Math.random() * 5000) + 500,
      sentiment: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      viral: Math.random() > 0.8
    },
    financial: {
      amount: Math.floor(Math.random() * 100) + 10,
      valuation: Math.floor(Math.random() * 1000) + 100,
      investors: Math.floor(Math.random() * 10) + 1
    }
  };
  
  return metrics[type as keyof typeof metrics] || {};
}

async function generateCounterStrategy(req: Request) {
  const { feedData } = await req.json();
  
  const strategies = {
    hiring: {
      title: "Talent Acquisition Disruption",
      tactics: [
        "Launch competitive hiring campaign targeting same roles",
        "Increase salary benchmarks by 15-20%",
        "Fast-track interview process",
        "Create signing bonus incentives"
      ],
      timeline: "48 hours",
      impact: "High"
    },
    product: {
      title: "Feature Leapfrog Strategy",
      tactics: [
        "Accelerate competing feature development",
        "Launch PR campaign highlighting superior capabilities",
        "Create feature comparison content",
        "Reach out to their unsatisfied customers"
      ],
      timeline: "2 weeks",
      impact: "Medium"
    },
    review: {
      title: "Reputation Leverage Campaign",
      tactics: [
        "Amplify customer testimonials",
        "Create comparison content highlighting advantages",
        "Launch customer success story series",
        "Offer migration incentives"
      ],
      timeline: "1 week",
      impact: "High"
    }
  };
  
  const defaultStrategy = {
    title: "General Competitive Response",
    tactics: [
      "Monitor situation closely",
      "Prepare counter-messaging",
      "Analyze market impact",
      "Coordinate response team"
    ],
    timeline: "24 hours",
    impact: "Medium"
  };
  
  return strategies[feedData?.type as keyof typeof strategies] || defaultStrategy;
}

async function executeResponse(req: Request) {
  const { strategy, feedData } = await req.json();
  
  // Simulate response execution
  return {
    status: "executed",
    message: `Response strategy "${strategy.title}" has been initiated`,
    actions: [
      "Response team activated",
      "Counter-strategy briefing scheduled",
      "Market monitoring increased",
      "Competitive analysis updated"
    ],
    timeline: strategy.timeline,
    nextSteps: [
      "Monitor execution progress",
      "Track competitive response",
      "Measure market impact",
      "Adjust strategy as needed"
    ]
  };
}