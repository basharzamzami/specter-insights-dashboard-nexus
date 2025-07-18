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
    const { domain } = await req.json();
    
    if (!domain) {
      throw new Error('Domain is required');
    }

    console.log(`Analyzing SEO for domain: ${domain}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate comprehensive SEO analysis
    const seoData = await generateSEOAnalysis(domain);
    
    // Store competitor tracking data
    await supabase.from('competitor_tracking').upsert({
      domain: domain,
      company_name: extractCompanyName(domain),
      seo_score: seoData.seoScore,
      organic_traffic: seoData.organicTraffic,
      paid_traffic: seoData.paidTraffic,
      backlinks: seoData.backlinks,
      keywords: seoData.keywordCount,
      market_share: seoData.marketShare
    });

    // Store keyword data
    for (const keyword of seoData.keywords) {
      await supabase.from('seo_keywords').upsert({
        keyword: keyword.keyword,
        domain: domain,
        rank: keyword.rank,
        previous_rank: keyword.previousRank,
        search_volume: keyword.searchVolume,
        difficulty: keyword.difficulty,
        traffic_estimate: keyword.trafficEstimate,
        rank_change: keyword.rankChange
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: seoData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in SEO analysis:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractCompanyName(domain: string): string {
  return domain.replace(/^https?:\/\//, '')
              .replace(/^www\./, '')
              .split('.')[0]
              .charAt(0).toUpperCase() + 
         domain.replace(/^https?:\/\//, '')
              .replace(/^www\./, '')
              .split('.')[0]
              .slice(1);
}

async function generateSEOAnalysis(domain: string) {
  // Simulate real SEO analysis data with realistic metrics
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  
  const keywords = [
    {
      keyword: `${cleanDomain} software`,
      rank: Math.floor(Math.random() * 50) + 1,
      previousRank: Math.floor(Math.random() * 50) + 1,
      searchVolume: Math.floor(Math.random() * 10000) + 1000,
      difficulty: Math.floor(Math.random() * 100) + 1,
      trafficEstimate: Math.floor(Math.random() * 5000) + 500,
      rankChange: Math.floor(Math.random() * 20) - 10
    },
    {
      keyword: `${cleanDomain} reviews`,
      rank: Math.floor(Math.random() * 30) + 1,
      previousRank: Math.floor(Math.random() * 30) + 1,
      searchVolume: Math.floor(Math.random() * 8000) + 800,
      difficulty: Math.floor(Math.random() * 80) + 20,
      trafficEstimate: Math.floor(Math.random() * 3000) + 300,
      rankChange: Math.floor(Math.random() * 15) - 7
    },
    {
      keyword: `${cleanDomain} pricing`,
      rank: Math.floor(Math.random() * 25) + 1,
      previousRank: Math.floor(Math.random() * 25) + 1,
      searchVolume: Math.floor(Math.random() * 6000) + 600,
      difficulty: Math.floor(Math.random() * 70) + 15,
      trafficEstimate: Math.floor(Math.random() * 2500) + 250,
      rankChange: Math.floor(Math.random() * 12) - 6
    },
    {
      keyword: `best ${cleanDomain} alternative`,
      rank: Math.floor(Math.random() * 40) + 1,
      previousRank: Math.floor(Math.random() * 40) + 1,
      searchVolume: Math.floor(Math.random() * 4000) + 400,
      difficulty: Math.floor(Math.random() * 90) + 10,
      trafficEstimate: Math.floor(Math.random() * 2000) + 200,
      rankChange: Math.floor(Math.random() * 18) - 9
    },
    {
      keyword: `${cleanDomain} vs competitors`,
      rank: Math.floor(Math.random() * 35) + 1,
      previousRank: Math.floor(Math.random() * 35) + 1,
      searchVolume: Math.floor(Math.random() * 3500) + 350,
      difficulty: Math.floor(Math.random() * 85) + 15,
      trafficEstimate: Math.floor(Math.random() * 1800) + 180,
      rankChange: Math.floor(Math.random() * 16) - 8
    }
  ];

  // Calculate rank changes
  keywords.forEach(kw => {
    kw.rankChange = kw.previousRank - kw.rank;
  });

  return {
    domain: cleanDomain,
    seoScore: Math.floor(Math.random() * 40) + 30, // 30-70 range
    organicTraffic: Math.floor(Math.random() * 100000) + 10000,
    paidTraffic: Math.floor(Math.random() * 50000) + 5000,
    backlinks: Math.floor(Math.random() * 5000) + 500,
    keywordCount: keywords.length,
    marketShare: parseFloat((Math.random() * 15 + 5).toFixed(2)),
    keywords: keywords,
    vulnerabilities: [
      "Slow mobile page speed (3.2s load time)",
      "High bounce rate on pricing page (78%)",
      "Limited social proof (few testimonials)",
      "Outdated blog content (last updated 3 months ago)",
      "Poor local SEO optimization",
      "Weak backlink profile in competitive keywords"
    ].slice(0, Math.floor(Math.random() * 3) + 3),
    competitorAnalysis: {
      monthlyVisitors: Math.floor(Math.random() * 500000) + 50000,
      avgSessionDuration: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      bounceRate: `${Math.floor(Math.random() * 30) + 40}%`,
      topPages: [
        '/pricing',
        '/features',
        '/about',
        '/contact',
        '/blog'
      ],
      trafficSources: {
        organic: Math.floor(Math.random() * 40) + 30,
        direct: Math.floor(Math.random() * 30) + 20,
        referral: Math.floor(Math.random() * 20) + 10,
        social: Math.floor(Math.random() * 15) + 5,
        paid: Math.floor(Math.random() * 10) + 5
      }
    }
  };
}