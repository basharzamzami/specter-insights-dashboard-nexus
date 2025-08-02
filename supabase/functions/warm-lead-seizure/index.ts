/**
 * 🔥 WARM LEAD SEIZURE SYSTEM API
 * 
 * Main API endpoint for the Warm Lead Seizure System
 * Handles detection, qualification, seizure planning, and execution
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  WarmLeadSeizureSystem,
  WarmLeadProfile,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  RateLimitError,
  WarmLeadSeizureError,
  VALIDATION_LIMITS
} from '../_shared/warm-lead-seizure.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 60,
  REQUESTS_PER_HOUR: 1000,
  WINDOW_MS: 60 * 1000, // 1 minute
  HOUR_WINDOW_MS: 60 * 60 * 1000 // 1 hour
} as const;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') ||
                    req.headers.get('x-real-ip') ||
                    'unknown';

    // Apply rate limiting
    await applyRateLimit(clientIP);

    // Parse and validate request body
    let requestBody: unknown;
    try {
      const bodyText = await req.text();
      if (!bodyText || bodyText.trim() === '') {
        throw new ValidationError('Request body is required');
      }

      if (bodyText.length > 1024 * 1024) { // 1MB limit
        throw new ValidationError('Request body too large (max 1MB)');
      }

      requestBody = JSON.parse(bodyText);
    } catch (parseError) {
      if (parseError instanceof ValidationError) throw parseError;
      throw new ValidationError('Invalid JSON in request body');
    }

    if (!requestBody || typeof requestBody !== 'object') {
      throw new ValidationError('Request body must be a JSON object');
    }

    const { action, data, leadId, userId: requestUserId } = requestBody as Record<string, unknown>;
    userId = requestUserId as string;

    // Validate action parameter
    if (!action || typeof action !== 'string') {
      throw new ValidationError('Invalid or missing action parameter', 'action', action);
    }

    const allowedActions = ['detect', 'qualify', 'plan_seizure', 'execute_seizure', 'get_dashboard', 'update_settings'] as const;
    if (!allowedActions.includes(action as any)) {
      throw new ValidationError('Invalid action specified', 'action', action);
    }

    // Validate userId for actions that require it
    const actionsRequiringUserId = ['detect', 'qualify', 'plan_seizure', 'execute_seizure', 'get_dashboard', 'update_settings'];
    if (actionsRequiringUserId.includes(action)) {
      if (!userId || typeof userId !== 'string' || userId.length < 10 || userId.length > 100) {
        throw new ValidationError('Invalid or missing userId parameter', 'userId', userId);
      }
    }

    // Validate leadId for lead-specific actions
    const actionsRequiringLeadId = ['qualify', 'plan_seizure', 'execute_seizure'];
    if (actionsRequiringLeadId.includes(action)) {
      if (!leadId || typeof leadId !== 'string' || leadId.length < 5 || leadId.length > 100) {
        throw new ValidationError('Invalid or missing leadId parameter', 'leadId', leadId);
      }
    }

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            authorization: authHeader,
          },
        },
      }
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    // Verify user ID matches authenticated user
    if (userId && userId !== user.id) {
      throw new Error('Unauthorized: User ID mismatch');
    }

    const seizureSystem = new WarmLeadSeizureSystem();

    switch (action) {
      case 'detect':
        return await handleDetection(seizureSystem, supabase, data, userId);
      
      case 'qualify':
        return await handleQualification(seizureSystem, supabase, leadId, userId);
      
      case 'plan_seizure':
        return await handleSeizurePlanning(seizureSystem, supabase, leadId, userId);
      
      case 'execute_seizure':
        return await handleSeizureExecution(seizureSystem, supabase, leadId, userId);
      
      case 'get_dashboard':
        return await handleDashboard(supabase, userId);
      
      case 'update_settings':
        return await handleSettingsUpdate(supabase, data, userId);
      
      default:
        throw new Error('Invalid action specified');
    }

  } catch (error) {
    console.error('Warm Lead Seizure System error:', error);

    // Determine appropriate status code
    let statusCode = 500;
    let errorMessage = 'Internal server error';

    if (error.message.includes('Invalid') || error.message.includes('missing')) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.message.includes('Unauthorized') || error.message.includes('Authentication')) {
      statusCode = 401;
      errorMessage = 'Authentication required';
    } else if (error.message.includes('not found')) {
      statusCode = 404;
      errorMessage = 'Resource not found';
    } else if (error.message.includes('rate limit')) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded';
    }

    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      system: 'warm_lead_seizure',
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleDetection(
  seizureSystem: WarmLeadSeizureSystem, 
  supabase: any, 
  behaviorData: any[], 
  userId: string
) {
  console.log('🧠 THERMAL RADAR: Scanning for warm leads...');
  
  const detectedLeads = await seizureSystem.detectWarmLeads(behaviorData);
  
  // Validate detection limits
  if (detectedLeads.length > 100) {
    throw new Error('Too many leads detected in single request (max 100)');
  }

  // Store detected leads with error handling
  const insertResults = [];
  for (const lead of detectedLeads) {
    try {
      // Calculate warmth score
      lead.warmth_score = seizureSystem.calculateWarmthScore(lead.behavior_data);

      // Validate warmth score
      if (lead.warmth_score < 0 || lead.warmth_score > 100) {
        console.warn(`Invalid warmth score for lead ${lead.id}: ${lead.warmth_score}`);
        continue;
      }

      // Store in database with RLS protection
      const { data, error } = await supabase
        .from('warm_leads')
        .upsert({
          id: lead.id,
          user_id: userId, // RLS will ensure user can only access their own data
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          source: lead.source,
          first_detected: lead.first_detected,
          last_activity: lead.last_activity,
          warmth_score: lead.warmth_score,
          status: lead.status,
          behavior_data: lead.behavior_data,
          seizure_history: lead.seizure_history,
          created_at: new Date().toISOString()
        })
        .select('id');

      if (error) {
        console.error(`Failed to store lead ${lead.id}:`, error);
        continue;
      }

      insertResults.push(lead);
    } catch (leadError) {
      console.error(`Error processing lead ${lead.id}:`, leadError);
      continue;
    }
  }

  // Log detection activity
  await logSeizureActivity(supabase, userId, 'detection', {
    leads_detected: insertResults.length,
    qualified_leads: insertResults.filter(l => l.warmth_score >= 65).length,
    high_value_leads: insertResults.filter(l => l.warmth_score >= 85).length,
    total_processed: detectedLeads.length,
    success_rate: detectedLeads.length > 0 ? (insertResults.length / detectedLeads.length * 100).toFixed(1) : '0'
  });

  return new Response(JSON.stringify({
    success: true,
    action: 'detect',
    results: {
      total_detected: insertResults.length,
      total_processed: detectedLeads.length,
      qualified_for_seizure: insertResults.filter(l => l.warmth_score >= 65).length,
      high_value_leads: insertResults.filter(l => l.warmth_score >= 85).length,
      leads: insertResults.map(lead => ({
        id: lead.id,
        email: lead.email,
        warmth_score: lead.warmth_score,
        status: lead.status,
        source: lead.source
      }))
    },
    message: `Thermal Radar detected ${insertResults.length} warm leads (${detectedLeads.length} processed)`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleQualification(
  seizureSystem: WarmLeadSeizureSystem,
  supabase: any,
  leadId: string,
  userId: string
) {
  console.log('🔍 WARM INDEX ENGINE: Qualifying lead...');
  
  // Get lead from database
  const { data: lead, error } = await supabase
    .from('warm_leads')
    .select('*')
    .eq('id', leadId)
    .eq('user_id', userId)
    .single();

  if (error || !lead) {
    throw new Error('Lead not found');
  }

  // Recalculate warmth score with latest data
  const updatedScore = seizureSystem.calculateWarmthScore(lead.behavior_data);
  
  // Update lead status based on score
  const newStatus = updatedScore >= 65 ? 'qualified' : 'detected';
  
  await supabase
    .from('warm_leads')
    .update({
      warmth_score: updatedScore,
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', leadId);

  return new Response(JSON.stringify({
    success: true,
    action: 'qualify',
    results: {
      lead_id: leadId,
      warmth_score: updatedScore,
      status: newStatus,
      qualified_for_seizure: updatedScore >= 65,
      high_value: updatedScore >= 85,
      score_breakdown: getScoreBreakdown(lead.behavior_data, seizureSystem)
    },
    message: `Lead qualified with Warmth Index: ${updatedScore}/100`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleSeizurePlanning(
  seizureSystem: WarmLeadSeizureSystem,
  supabase: any,
  leadId: string,
  userId: string
) {
  console.log('⚔️ OPERATION SNAPBACK: Planning seizure campaign...');
  
  // Get qualified lead
  const { data: lead, error } = await supabase
    .from('warm_leads')
    .select('*')
    .eq('id', leadId)
    .eq('user_id', userId)
    .single();

  if (error || !lead) {
    throw new Error('Lead not found');
  }

  if (lead.warmth_score < 65) {
    throw new Error('Lead not qualified for seizure (score < 65)');
  }

  // Plan seizure campaign
  const seizureActions = await seizureSystem.planSeizureCampaign(lead);
  
  // Generate conversion infrastructure
  const closerGrid = seizureSystem.generateCloserGrid(lead);
  
  // Update lead with seizure plan
  await supabase
    .from('warm_leads')
    .update({
      seizure_history: seizureActions,
      status: 'seized',
      closer_grid: closerGrid,
      updated_at: new Date().toISOString()
    })
    .eq('id', leadId);

  return new Response(JSON.stringify({
    success: true,
    action: 'plan_seizure',
    results: {
      lead_id: leadId,
      warmth_score: lead.warmth_score,
      seizure_actions: seizureActions.length,
      campaign_duration: Math.max(...seizureActions.map(a => a.trigger_day)),
      closer_grid: closerGrid,
      actions: seizureActions.map(action => ({
        type: action.type,
        trigger_day: action.trigger_day,
        content_preview: action.content.substring(0, 100) + '...'
      }))
    },
    message: `Operation Snapback planned: ${seizureActions.length} actions over ${Math.max(...seizureActions.map(a => a.trigger_day))} days`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleSeizureExecution(
  seizureSystem: WarmLeadSeizureSystem,
  supabase: any,
  leadId: string,
  userId: string
) {
  console.log('🎯 EXECUTING SEIZURE: Launching conversion campaign...');
  
  // Get lead with seizure plan
  const { data: lead, error } = await supabase
    .from('warm_leads')
    .select('*')
    .eq('id', leadId)
    .eq('user_id', userId)
    .single();

  if (error || !lead) {
    throw new Error('Lead not found');
  }

  if (!lead.seizure_history || lead.seizure_history.length === 0) {
    throw new Error('No seizure plan found for this lead');
  }

  // Execute immediate actions (trigger_day: 0)
  const immediateActions = lead.seizure_history.filter((action: any) => action.trigger_day === 0);
  const executedActions = [];

  for (const action of immediateActions) {
    // Simulate execution (in production, integrate with email/SMS/ad platforms)
    const executed = await executeSeizureAction(action, lead);
    executedActions.push(executed);
  }

  // Schedule future actions
  const futureActions = lead.seizure_history.filter((action: any) => action.trigger_day > 0);
  
  // Log execution
  await logSeizureActivity(supabase, userId, 'execution', {
    lead_id: leadId,
    immediate_actions: immediateActions.length,
    scheduled_actions: futureActions.length,
    warmth_score: lead.warmth_score
  });

  return new Response(JSON.stringify({
    success: true,
    action: 'execute_seizure',
    results: {
      lead_id: leadId,
      executed_immediately: executedActions.length,
      scheduled_for_later: futureActions.length,
      executed_actions: executedActions,
      next_action_in: futureActions.length > 0 ? `${Math.min(...futureActions.map((a: any) => a.trigger_day))} days` : 'none'
    },
    message: `Seizure executed: ${executedActions.length} actions launched immediately`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleDashboard(supabase: any, userId: string) {
  // Get warm leads summary
  const { data: leads } = await supabase
    .from('warm_leads')
    .select('*')
    .eq('user_id', userId)
    .order('warmth_score', { ascending: false });

  // Get seizure activity logs
  const { data: activities } = await supabase
    .from('seizure_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  const dashboard = {
    summary: {
      total_leads: leads?.length || 0,
      qualified_leads: leads?.filter(l => l.warmth_score >= 65).length || 0,
      high_value_leads: leads?.filter(l => l.warmth_score >= 85).length || 0,
      converted_leads: leads?.filter(l => l.status === 'converted').length || 0,
      active_seizures: leads?.filter(l => l.status === 'seized').length || 0
    },
    top_leads: leads?.slice(0, 10) || [],
    recent_activity: activities || [],
    conversion_rate: leads?.length > 0 ? 
      ((leads.filter(l => l.status === 'converted').length / leads.length) * 100).toFixed(1) : '0'
  };

  return new Response(JSON.stringify({
    success: true,
    action: 'get_dashboard',
    dashboard,
    message: 'Seizure Logbook retrieved successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleSettingsUpdate(supabase: any, settings: any, userId: string) {
  // Update user's seizure system settings
  await supabase
    .from('seizure_settings')
    .upsert({
      user_id: userId,
      warmth_threshold: settings.warmth_threshold || 65,
      ad_channels: settings.ad_channels || ['facebook', 'google'],
      ab_testing_mode: settings.ab_testing_mode || false,
      auto_dialer_enabled: settings.auto_dialer_enabled || false,
      updated_at: new Date().toISOString()
    });

  return new Response(JSON.stringify({
    success: true,
    action: 'update_settings',
    message: 'Seizure system settings updated successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions
async function logSeizureActivity(supabase: any, userId: string, activity: string, data: any) {
  await supabase
    .from('seizure_logs')
    .insert({
      user_id: userId,
      activity_type: activity,
      activity_data: data,
      created_at: new Date().toISOString()
    });
}

async function executeSeizureAction(action: any, lead: any) {
  // Simulate action execution (integrate with real platforms in production)
  return {
    ...action,
    status: 'sent',
    sent_at: new Date().toISOString(),
    platform_response: 'simulated_success'
  };
}

function getScoreBreakdown(behaviorData: any, seizureSystem: any) {
  return {
    time_on_site: Math.min(15, (behaviorData.total_time_on_site / 300) * 15),
    repeat_visits: Math.min(20, (behaviorData.visits_last_14_days / 5) * 20),
    form_completion: behaviorData.form_completion_rate * 25,
    email_engagement: Math.min(12, (behaviorData.emails_opened / 5) * 12),
    pricing_page_time: Math.min(20, (behaviorData.time_on_pricing_page / 45) * 20),
    quote_intent: Math.min(30, behaviorData.quote_clicks_no_submit * 30)
  };
}

// Rate limiting function
async function applyRateLimit(clientIP: string): Promise<void> {
  const now = Date.now();
  const key = `rate_limit_${clientIP}`;

  // Clean up expired entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.resetTime < now) {
      rateLimitStore.delete(k);
    }
  }

  // Get current rate limit data
  let rateLimitData = rateLimitStore.get(key);

  if (!rateLimitData) {
    // First request from this IP
    rateLimitData = {
      count: 1,
      resetTime: now + RATE_LIMITS.WINDOW_MS
    };
    rateLimitStore.set(key, rateLimitData);
    return;
  }

  // Check if window has expired
  if (rateLimitData.resetTime < now) {
    // Reset the window
    rateLimitData = {
      count: 1,
      resetTime: now + RATE_LIMITS.WINDOW_MS
    };
    rateLimitStore.set(key, rateLimitData);
    return;
  }

  // Increment count
  rateLimitData.count++;

  // Check if limit exceeded
  if (rateLimitData.count > RATE_LIMITS.REQUESTS_PER_MINUTE) {
    const resetInSeconds = Math.ceil((rateLimitData.resetTime - now) / 1000);
    throw new RateLimitError(`Rate limit exceeded. Try again in ${resetInSeconds} seconds.`);
  }

  rateLimitStore.set(key, rateLimitData);
}
