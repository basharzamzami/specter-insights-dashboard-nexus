// Edge function to fetch real-time competitor intelligence data
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface CompetitorData {
  userId: string;
  competitorId?: string;
  domain?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, competitorId, domain }: CompetitorData = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (competitorId) {
      // Fetch and update specific competitor data
      const { data: competitor } = await supabase
        .from('competitor_profiles')
        .select('*')
        .eq('id', competitorId)
        .eq('created_by', userId)
        .single();

      if (!competitor) {
        throw new Error('Competitor not found');
      }

      // Simulate real-time data collection (replace with actual APIs)
      const updatedData = {
        seo_score: Math.floor(Math.random() * 100),
        sentiment_score: Math.random(),
        estimated_ad_spend: Math.floor(Math.random() * 10000),
        vulnerabilities: [
          'Low mobile optimization score',
          'Slow page load times',
          'Missing meta descriptions',
          'Broken internal links'
        ],
        top_keywords: [
          `${competitor.company_name} reviews`,
          `${competitor.company_name} pricing`,
          `${competitor.company_name} alternative`,
          `best ${competitor.company_name.toLowerCase()} competitor`
        ],
        ad_activity: {
          platforms: ['Google Ads', 'Facebook', 'LinkedIn'],
          monthly_spend: Math.floor(Math.random() * 50000),
          active_campaigns: Math.floor(Math.random() * 20) + 5,
          top_performing_ads: [`${competitor.company_name} - Best Solution`, 'Limited Time Offer']
        },
        social_sentiment: {
          positive: Math.floor(Math.random() * 40) + 40,
          neutral: Math.floor(Math.random() * 30) + 20,
          negative: Math.floor(Math.random() * 20) + 10
        },
        customer_complaints: {
          volume: Math.floor(Math.random() * 100) + 10,
          top_issues: ['Pricing concerns', 'Customer support delays', 'Feature limitations'],
          severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
        }
      };

      // Update competitor profile with fresh intelligence
      const { error: updateError } = await supabase
        .from('competitor_profiles')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', competitorId)
        .eq('created_by', userId);

      if (updateError) throw updateError;

      // Generate threat alerts based on changes
      const threats = [];
      if (updatedData.ad_activity.monthly_spend > 30000) {
        threats.push({
          user_id: userId,
          competitor_id: competitorId,
          alert_type: 'High Ad Spend',
          message: `${competitor.company_name} increased ad spending to $${updatedData.ad_activity.monthly_spend}/month`,
          severity: 'high'
        });
      }

      if (updatedData.social_sentiment.negative > 30) {
        threats.push({
          user_id: userId,
          competitor_id: competitorId,
          alert_type: 'Negative Sentiment',
          message: `${competitor.company_name} experiencing ${updatedData.social_sentiment.negative}% negative sentiment`,
          severity: 'medium'
        });
      }

      // Insert threat alerts
      if (threats.length > 0) {
        await supabase.from('threat_alerts').insert(threats);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          competitor: { ...competitor, ...updatedData },
          threats: threats.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all competitors for user with fresh intelligence data
    const { data: competitors, error } = await supabase
      .from('competitor_profiles')
      .select('*')
      .eq('created_by', userId)
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, competitors }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});