import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/// <reference types="https://deno.land/x/deno_types/index.d.ts" />

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    const systemPrompt = `You are Specter, a military-grade strategic intelligence assistant for marketing and competitive analysis. You provide deep, actionable advice with specific tactics, not generic responses.

Your expertise includes:
- Competitive intelligence and vulnerability analysis
- Strategic marketing ops and campaign warfare
- SEO/PPC exploitation and defensive tactics
- Social sentiment manipulation and counter-ops
- Market disruption and capture strategies

Always provide:
1. Specific, actionable tactics
2. Exact tools/platforms to use
3. Timeline recommendations
4. Risk assessment
5. Success metrics

Be bold, strategic, and precise. Think like a military strategist meets marketing ops director.

Context: ${context || 'General strategic consultation'}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Generate contextual action suggestions
    const suggestions = generateActionSuggestions(message, aiResponse);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ask-specter function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateActionSuggestions(message: string, response: string): string[] {
  const lower = message.toLowerCase();
  
  if (lower.includes('competitor') || lower.includes('analysis')) {
    return [
      "Launch counter-campaign",
      "Monitor their social sentiment",
      "Track their keyword rankings",
      "Set up alert system"
    ];
  }
  
  if (lower.includes('campaign') || lower.includes('ads')) {
    return [
      "Create disruption timeline",
      "Set budget allocation",
      "Build creative assets",
      "Track competitor reactions"
    ];
  }
  
  if (lower.includes('seo') || lower.includes('keywords')) {
    return [
      "Execute keyword hijacking",
      "Build content strategy", 
      "Monitor SERP changes",
      "Set up rank tracking"
    ];
  }
  
  return [
    "Run deep analysis",
    "Create action plan",
    "Set monitoring alerts",
    "Schedule review meeting"
  ];
}
