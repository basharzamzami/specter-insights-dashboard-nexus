import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SEMrushAPI, getSEMrushAPIKey } from '../_shared/semrush-api.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain = 'example.com' } = await req.json();
    
    // Check if API key is configured
    const apiKey = Deno.env.get('SEMRUSH_API_KEY');
    
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'SEMRUSH_API_KEY not configured',
        message: 'Add your SEMrush API key to environment variables to enable real data',
        fallback: 'Using simulated data instead'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Testing SEMrush API with domain: ${domain}`);
    
    const semrush = new SEMrushAPI(apiKey);
    
    // Test connection
    const isConnected = await semrush.testConnection();
    
    if (!isConnected) {
      return new Response(JSON.stringify({
        success: false,
        error: 'SEMrush API connection failed',
        message: 'Check your API key and network connection',
        apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get comprehensive analysis
    const analysis = await semrush.getComprehensiveAnalysis(domain);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'SEMrush API integration working!',
      domain: domain,
      data: {
        seoScore: analysis.seoScore,
        organicTraffic: analysis.organicTraffic,
        keywordCount: analysis.keywordCount,
        backlinks: analysis.backlinks,
        authorityScore: analysis.authorityScore,
        topKeywords: analysis.keywords.slice(0, 5).map(k => ({
          keyword: k.keyword,
          rank: k.rank,
          searchVolume: k.searchVolume
        }))
      },
      apiUsage: {
        endpoint: 'Multiple SEMrush endpoints',
        cost: 'Approximately 3-5 API units per analysis'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('SEMrush test error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: 'Check API key, domain format, and SEMrush service status',
      troubleshooting: {
        apiKey: Deno.env.get('SEMRUSH_API_KEY') ? 'Set' : 'Missing',
        domain: 'Ensure domain is in format: example.com (no http/https)',
        quota: 'Check if you have remaining API units for today'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/* 
Usage Examples:

1. Test with default domain:
POST /functions/v1/test-semrush
{}

2. Test with specific domain:
POST /functions/v1/test-semrush
{
  "domain": "shopify.com"
}

Expected Response (Success):
{
  "success": true,
  "message": "SEMrush API integration working!",
  "domain": "shopify.com",
  "data": {
    "seoScore": 85,
    "organicTraffic": 2500000,
    "keywordCount": 45000,
    "backlinks": 125000,
    "authorityScore": 92,
    "topKeywords": [...]
  }
}

Expected Response (No API Key):
{
  "success": false,
  "error": "SEMRUSH_API_KEY not configured",
  "message": "Add your SEMrush API key to environment variables to enable real data",
  "fallback": "Using simulated data instead"
}
*/
