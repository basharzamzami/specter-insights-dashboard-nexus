import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { FacebookAdsAPI, getFacebookAccessToken } from '../_shared/facebook-ads-api.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName = 'Nike', domain = 'nike.com' } = await req.json();
    
    // Check if API key is configured
    const accessToken = Deno.env.get('FACEBOOK_ACCESS_TOKEN');
    
    if (!accessToken) {
      return new Response(JSON.stringify({
        success: false,
        error: 'FACEBOOK_ACCESS_TOKEN not configured',
        message: 'Add your Facebook access token to environment variables to enable real ad data',
        setup_instructions: {
          step1: 'Go to https://developers.facebook.com/',
          step2: 'Create a new app or use existing app',
          step3: 'Add "Marketing API" product to your app',
          step4: 'Generate an access token with ads_read permission',
          step5: 'Add token to FACEBOOK_ACCESS_TOKEN environment variable'
        },
        fallback: 'Using simulated data instead'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Testing Facebook Ads API with company: ${companyName}`);
    
    const facebookAds = new FacebookAdsAPI(accessToken);
    
    // Test connection
    const isConnected = await facebookAds.testConnection();
    
    if (!isConnected) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Facebook Ads API connection failed',
        message: 'Check your access token and permissions',
        troubleshooting: {
          token: accessToken ? `${accessToken.substring(0, 10)}...` : 'Not set',
          permissions_needed: ['ads_read', 'pages_read_engagement'],
          common_issues: [
            'Token expired - generate a new long-lived token',
            'App not approved for Marketing API access',
            'Missing ads_read permission',
            'Rate limiting - try again in a few minutes'
          ]
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get comprehensive ad intelligence
    const adIntelligence = await facebookAds.getCompetitorAdIntelligence(companyName, domain);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Facebook Ads API integration working!',
      company: companyName,
      domain: domain,
      data: {
        total_ads_found: adIntelligence.total_ads_found,
        active_ads: adIntelligence.active_ads,
        estimated_monthly_spend: adIntelligence.estimated_monthly_spend,
        active_platforms: adIntelligence.active_platforms,
        spend_range: adIntelligence.spend_range,
        impressions_range: adIntelligence.impressions_range,
        campaign_duration_avg: adIntelligence.campaign_duration_avg,
        sample_ads: adIntelligence.facebook_ads.slice(0, 3).map(ad => ({
          ad_id: ad.ad_id,
          creative_text: ad.creative_text?.substring(0, 100) + '...',
          creative_title: ad.creative_title,
          status: ad.status,
          platforms: ad.platform,
          impressions: ad.impressions_estimate,
          spend: ad.spend_estimate,
          duration: ad.duration_days,
          page_name: ad.page_name
        })),
        top_keywords: adIntelligence.top_keywords.slice(0, 5)
      },
      api_info: {
        endpoint: 'Facebook Ads Library API',
        cost: 'FREE - No API costs',
        rate_limits: '200 requests per hour per app',
        data_freshness: 'Real-time active ads'
      },
      insights: generateQuickInsights(adIntelligence)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Facebook Ads test error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: 'Check access token, company name, and Facebook API status',
      troubleshooting: {
        access_token: Deno.env.get('FACEBOOK_ACCESS_TOKEN') ? 'Set' : 'Missing',
        company_name: 'Ensure company name matches their Facebook page name',
        api_status: 'Check https://developers.facebook.com/status/ for API issues',
        common_solutions: [
          'Verify your app has Marketing API access',
          'Check if the company actually runs Facebook ads',
          'Try a different company name (e.g., "Nike" instead of "Nike Inc")',
          'Ensure your access token has ads_read permission'
        ]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateQuickInsights(adData: any) {
  const insights = [];

  if (adData.total_ads_found === 0) {
    insights.push({
      type: 'no_ads',
      message: 'No active Facebook ads found - either not advertising or using different company name',
      recommendation: 'Try variations of the company name or check if they advertise on Facebook'
    });
  } else if (adData.total_ads_found > 20) {
    insights.push({
      type: 'high_activity',
      message: `High ad activity: ${adData.total_ads_found} ads found`,
      recommendation: 'This competitor is heavily investing in Facebook advertising'
    });
  }

  if (adData.estimated_monthly_spend > 50000) {
    insights.push({
      type: 'high_spend',
      message: `High estimated spend: $${adData.estimated_monthly_spend.toLocaleString()}/month`,
      recommendation: 'Major competitor with significant ad budget'
    });
  }

  if (adData.active_platforms.includes('Instagram') && adData.active_platforms.includes('Facebook')) {
    insights.push({
      type: 'multi_platform',
      message: 'Active on both Facebook and Instagram',
      recommendation: 'Comprehensive social media advertising strategy'
    });
  }

  if (adData.campaign_duration_avg > 30) {
    insights.push({
      type: 'long_campaigns',
      message: `Long-running campaigns (avg ${adData.campaign_duration_avg} days)`,
      recommendation: 'Indicates successful ad creatives worth analyzing'
    });
  }

  return insights;
}

/* 
Usage Examples:

1. Test with default company (Nike):
POST /functions/v1/test-facebook-ads
{}

2. Test with specific company:
POST /functions/v1/test-facebook-ads
{
  "companyName": "Shopify",
  "domain": "shopify.com"
}

Expected Response (Success):
{
  "success": true,
  "message": "Facebook Ads API integration working!",
  "company": "Nike",
  "data": {
    "total_ads_found": 127,
    "active_ads": 45,
    "estimated_monthly_spend": 2500000,
    "active_platforms": ["Facebook", "Instagram"],
    "sample_ads": [...],
    "top_keywords": [...]
  },
  "insights": [...]
}

Expected Response (No Access Token):
{
  "success": false,
  "error": "FACEBOOK_ACCESS_TOKEN not configured",
  "setup_instructions": {...}
}

Setup Instructions:
1. Go to https://developers.facebook.com/
2. Create app and add Marketing API
3. Generate access token with ads_read permission
4. Add to FACEBOOK_ACCESS_TOKEN environment variable
*/
