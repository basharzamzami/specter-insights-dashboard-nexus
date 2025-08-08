/**
 * Lead Threat Scoring API - Production Ready
 * Advanced lead scoring with competitive threat assessment
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { leadThreatScoreSystem } from '../_shared/lead-threat-score-system.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface LeadScoringRequest {
  lead_data: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    company_name: string;
    title?: string;
    industry?: string;
    company_size?: number;
    website_visits?: number;
    email_opens?: number;
    content_downloads?: number;
    demo_requested?: boolean;
    pricing_page_visits?: number;
    stated_timeline?: string;
    multiple_stakeholders_engaged?: boolean;
    demo_scheduled?: boolean;
    recent_activity_spike?: boolean;
    response_rate?: number;
    region?: string;
    use_case?: string;
    stakeholder_count?: number;
  };
  conversation_history?: Array<{
    id: string;
    content: string;
    channel: string;
    timestamp: Date;
    sentiment?: number;
    participants?: string[];
  }>;
  competitor_data?: Array<{
    id: string;
    name: string;
    market_share?: number;
    active_campaigns?: number;
    mentioned_in_conversations?: boolean;
  }>;
  options?: {
    include_recommendations?: boolean;
    include_follow_up_plan?: boolean;
    include_competitive_intelligence?: boolean;
    cache_duration_hours?: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    // Authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's organization
    const { data: orgMember } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .single()

    if (!orgMember) {
      return new Response(
        JSON.stringify({ error: 'No organization access found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Health endpoints (no org context required beyond auth)
    if (path === '/lead-threat-scoring/health' && method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'ok', service: 'lead-threat-scoring', time: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Route handling
    if (path === '/lead-threat-scoring/calculate' && method === 'POST') {
      return await calculateThreatScore(req, orgMember.organization_id, supabase)
    }

    if (path === '/lead-threat-scoring/batch' && method === 'POST') {
      return await batchCalculateThreatScores(req, orgMember.organization_id, supabase)
    }

    if (path === '/lead-threat-scoring/history' && method === 'GET') {
      return await getThreatScoreHistory(req, orgMember.organization_id, supabase)
    }

    if (path === '/lead-threat-scoring/analytics' && method === 'GET') {
      return await getThreatScoreAnalytics(orgMember.organization_id, supabase)
    }

    if (path === '/lead-threat-scoring/config' && method === 'GET') {
      return await getScoringConfiguration(orgMember.organization_id, supabase)
    }

    if (path === '/lead-threat-scoring/config' && method === 'PUT') {
      return await updateScoringConfiguration(req, orgMember.organization_id, supabase)
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Lead threat scoring API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

/**
 * Calculate threat score for a single lead
 */
async function calculateThreatScore(
  req: Request,
  organizationId: string,
  supabase: any
): Promise<Response> {
  try {
    const requestData: LeadScoringRequest = await req.json()

    // Validate required fields
    if (!requestData.lead_data || !requestData.lead_data.id) {
      return new Response(
        JSON.stringify({
          error: 'Missing required field: lead_data.id',
          code: 'VALIDATION_ERROR'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add organization context
    requestData.lead_data.organization_id = organizationId

    // Check for cached score
    const cacheKey = `threat_score_${requestData.lead_data.id}`
    const cacheDuration = requestData.options?.cache_duration_hours || 24

    const { data: cachedScore } = await supabase
      .from('lead_threat_scores')
      .select('*')
      .eq('lead_id', requestData.lead_data.id)
      .eq('organization_id', organizationId)
      .gte('calculated_at', new Date(Date.now() - cacheDuration * 60 * 60 * 1000).toISOString())
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single()

    if (cachedScore && !requestData.options?.force_recalculate) {
      console.log(`Returning cached threat score for lead ${requestData.lead_data.id}`)
      return new Response(
        JSON.stringify({
          data: cachedScore,
          cached: true,
          calculated_at: cachedScore.calculated_at
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate new threat score
    console.log(`Calculating new threat score for lead ${requestData.lead_data.id}`)

    const threatScore = await leadThreatScoreSystem.calculateLeadThreatScore(
      requestData.lead_data,
      requestData.conversation_history || [],
      requestData.competitor_data || []
    )

    // Store in database
    const { error: insertError } = await supabase
      .from('lead_threat_scores')
      .insert({
        lead_id: requestData.lead_data.id,
        organization_id: organizationId,
        overall_score: threatScore.overall_score,
        threat_level: threatScore.threat_level,
        scoring_factors: threatScore.scoring_factors,
        threat_indicators: threatScore.threat_indicators,
        recommended_actions: threatScore.recommended_actions,
        dynamic_follow_up: threatScore.dynamic_follow_up,
        competitive_intelligence: threatScore.competitive_intelligence,
        calculated_at: threatScore.calculated_at,
        expires_at: threatScore.expires_at,
        metadata: {
          conversation_count: requestData.conversation_history?.length || 0,
          competitor_count: requestData.competitor_data?.length || 0,
          calculation_version: '2.0'
        }
      })

    if (insertError) {
      console.error('Error storing threat score:', insertError)
      // Continue anyway - we can still return the calculated score
    }

    // Log scoring event
    await supabase
      .from('lead_scoring_events')
      .insert({
        lead_id: requestData.lead_data.id,
        organization_id: organizationId,
        event_type: 'threat_score_calculated',
        score: threatScore.overall_score,
        threat_level: threatScore.threat_level,
        triggered_by: 'api_request',
        created_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({
        data: threatScore,
        cached: false,
        calculated_at: threatScore.calculated_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error calculating threat score:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to calculate threat score',
        details: error.message,
        code: 'CALCULATION_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Calculate threat scores for multiple leads in batch
 */
async function batchCalculateThreatScores(
  req: Request,
  organizationId: string,
  supabase: any
): Promise<Response> {
  try {
    const { leads, options } = await req.json()

    if (!Array.isArray(leads) || leads.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'leads must be a non-empty array',
          code: 'VALIDATION_ERROR'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (leads.length > 100) {
      return new Response(
        JSON.stringify({
          error: 'Maximum 100 leads per batch request',
          code: 'BATCH_SIZE_EXCEEDED'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = []
    const errors = []

    console.log(`Processing batch threat scoring for ${leads.length} leads`)

    for (let i = 0; i < leads.length; i++) {
      const leadRequest = leads[i]

      try {
        // Add organization context
        leadRequest.lead_data.organization_id = organizationId

        const threatScore = await leadThreatScoreSystem.calculateLeadThreatScore(
          leadRequest.lead_data,
          leadRequest.conversation_history || [],
          leadRequest.competitor_data || []
        )

        results.push({
          lead_id: leadRequest.lead_data.id,
          threat_score: threatScore,
          success: true
        })

        // Store in database (fire and forget)
        supabase
          .from('lead_threat_scores')
          .insert({
            lead_id: leadRequest.lead_data.id,
            organization_id: organizationId,
            overall_score: threatScore.overall_score,
            threat_level: threatScore.threat_level,
            scoring_factors: threatScore.scoring_factors,
            threat_indicators: threatScore.threat_indicators,
            recommended_actions: threatScore.recommended_actions,
            dynamic_follow_up: threatScore.dynamic_follow_up,
            competitive_intelligence: threatScore.competitive_intelligence,
            calculated_at: threatScore.calculated_at,
            expires_at: threatScore.expires_at,
            metadata: {
              batch_id: `batch_${Date.now()}`,
              batch_position: i,
              calculation_version: '2.0'
            }
          })
          .then(() => {})
          .catch((error) => console.error(`Error storing batch score for lead ${leadRequest.lead_data.id}:`, error))

      } catch (error) {
        console.error(`Error processing lead ${leadRequest.lead_data.id}:`, error)
        errors.push({
          lead_id: leadRequest.lead_data.id,
          error: error.message,
          success: false
        })
      }
    }

    return new Response(
      JSON.stringify({
        data: {
          results,
          errors,
          summary: {
            total_processed: leads.length,
            successful: results.length,
            failed: errors.length,
            success_rate: (results.length / leads.length) * 100
          }
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in batch threat scoring:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process batch threat scoring',
        details: error.message,
        code: 'BATCH_PROCESSING_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Get threat score history for leads
 */
async function getThreatScoreHistory(
  req: Request,
  organizationId: string,
  supabase: any
): Promise<Response> {
  try {
    const url = new URL(req.url)
    const leadId = url.searchParams.get('lead_id')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    let query = supabase
      .from('lead_threat_scores')
      .select('*')
      .eq('organization_id', organizationId)
      .order('calculated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (leadId) {
      query = query.eq('lead_id', leadId)
    }

    const { data: scores, error } = await query

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({
        data: scores,
        pagination: {
          limit,
          offset,
          total: scores.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error getting threat score history:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to get threat score history',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Get threat score analytics
 */
async function getThreatScoreAnalytics(organizationId: string, supabase: any): Promise<Response> {
  try {
    // Get analytics data from the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: scores, error } = await supabase
      .from('lead_threat_scores')
      .select('overall_score, threat_level, calculated_at')
      .eq('organization_id', organizationId)
      .gte('calculated_at', thirtyDaysAgo)

    if (error) {
      throw error
    }

    // Calculate analytics
    const analytics = {
      total_scores_calculated: scores.length,
      average_threat_score: scores.reduce((sum, s) => sum + s.overall_score, 0) / scores.length || 0,
      threat_level_distribution: {
        low: scores.filter(s => s.threat_level === 'low').length,
        medium: scores.filter(s => s.threat_level === 'medium').length,
        high: scores.filter(s => s.threat_level === 'high').length,
        critical: scores.filter(s => s.threat_level === 'critical').length
      },
      daily_calculations: groupByDay(scores),
      trends: {
        score_trend: calculateTrend(scores, 'overall_score'),
        high_threat_trend: calculateHighThreatTrend(scores)
      }
    }

    return new Response(
      JSON.stringify({ data: analytics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error getting threat score analytics:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to get threat score analytics',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Get scoring configuration
 */
async function getScoringConfiguration(organizationId: string, supabase: any): Promise<Response> {
  try {
    const { data: config, error } = await supabase
      .from('lead_scoring_config')
      .select('*')
      .eq('organization_id', organizationId)
      .single()

    if (error && error.code !== 'PGRST116') { // Not found error
      throw error
    }

    const defaultConfig = {
      organization_id: organizationId,
      scoring_weights: {
        intent_strength: 0.25,
        competitive_pressure: 0.20,
        urgency_indicators: 0.20,
        budget_authority: 0.15,
        fit_score: 0.10,
        engagement_level: 0.05,
        competitor_influence: 0.05
      },
      threat_thresholds: {
        low: 30,
        medium: 50,
        high: 75,
        critical: 90
      },
      auto_follow_up_enabled: true,
      escalation_enabled: true,
      cache_duration_hours: 24
    }

    return new Response(
      JSON.stringify({ data: config || defaultConfig }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error getting scoring configuration:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to get scoring configuration',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Update scoring configuration
 */
async function updateScoringConfiguration(
  req: Request,
  organizationId: string,
  supabase: any
): Promise<Response> {
  try {
    const config = await req.json()
    config.organization_id = organizationId
    config.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('lead_scoring_config')
      .upsert(config)
      .select()
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error updating scoring configuration:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to update scoring configuration',
        details: (error as any)?.message || 'unknown'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

/** Helper analytics functions (module-local) */
function groupByDay(scores: Array<{ calculated_at: string; overall_score: number; threat_level: string }>) {
  const map: Record<string, number> = {}
  for (const s of scores) {
    const day = new Date(s.calculated_at).toISOString().slice(0, 10)
    map[day] = (map[day] || 0) + 1
  }
  return map
}

function calculateTrend<T extends Record<string, any>>(rows: T[], field: keyof T) {
  if (!rows.length) return { direction: 'flat', delta: 0 }
  const sorted = [...rows].sort((a, b) => new Date(a.calculated_at).getTime() - new Date(b.calculated_at).getTime())
  const first = Number(sorted[0][field] || 0)
  const last = Number(sorted[sorted.length - 1][field] || 0)
  const delta = last - first
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
  return { direction, delta }
}

function calculateHighThreatTrend(scores: Array<{ calculated_at: string; threat_level: string }>) {
  if (!scores.length) return { direction: 'flat', delta: 0 }
  const countsByDay: Record<string, { highOrCritical: number; total: number }> = {}
  for (const s of scores) {
    const day = new Date(s.calculated_at).toISOString().slice(0, 10)
    countsByDay[day] = countsByDay[day] || { highOrCritical: 0, total: 0 }
    countsByDay[day].total += 1
    if (s.threat_level === 'high' || s.threat_level === 'critical') {
      countsByDay[day].highOrCritical += 1
    }
  }
  const days = Object.keys(countsByDay).sort()
  const firstDay = countsByDay[days[0]]
  const lastDay = countsByDay[days[days.length - 1]]
  const firstPct = firstDay ? (firstDay.highOrCritical / Math.max(1, firstDay.total)) * 100 : 0
  const lastPct = lastDay ? (lastDay.highOrCritical / Math.max(1, lastDay.total)) * 100 : 0
  const delta = Number((lastPct - firstPct).toFixed(2))
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
  return { direction, delta }
}
