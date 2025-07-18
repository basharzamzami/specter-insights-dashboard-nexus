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
    const { action, mode, settings, userId } = await req.json();
    
    console.log(`Operational mode action: ${action}, mode: ${mode}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === 'toggle_mode') {
      const result = await toggleOperationalMode(mode, settings, userId, supabase);
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: result 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'export_intelligence_data') {
      const exportResult = await exportIntelligenceData(userId, supabase);
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: exportResult 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'configure_alerts') {
      const alertConfig = await configureAlerts(settings, userId, supabase);
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: alertConfig 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_operation_history') {
      const { data, error } = await supabase
        .from('operation_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return new Response(JSON.stringify({ 
        success: true, 
        data: data || [] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'export_operation_history') {
      const exportResult = await exportOperationHistory(userId, supabase);
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: exportResult 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in operational mode:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function toggleOperationalMode(mode: string, settings: any, userId: string, supabase: any) {
  const modeActions = {
    aggressive_mode: {
      enabled: {
        message: "Aggressive Mode ACTIVATED",
        description: "Advanced tactics unlocked including negative SEO monitoring, competitor disruption analysis, and market manipulation detection",
        actions: [
          "Negative SEO monitoring enabled",
          "Competitor vulnerability scanning active",
          "Market manipulation detection initiated",
          "Advanced competitor disruption tactics unlocked"
        ],
        alertLevel: "high"
      },
      disabled: {
        message: "Aggressive Mode DEACTIVATED",
        description: "Advanced tactics disabled, returning to standard competitive analysis",
        actions: [
          "Negative SEO monitoring disabled",
          "Standard competitor analysis active",
          "Basic market monitoring resumed"
        ],
        alertLevel: "normal"
      }
    },
    stealth_mode: {
      enabled: {
        message: "Stealth Mode ACTIVATED",
        description: "Activities hidden from competitor detection, operational security enhanced",
        actions: [
          "IP rotation enabled",
          "Activity fingerprinting disabled",
          "Competitor detection countermeasures active",
          "Secure communication protocols engaged"
        ],
        alertLevel: "secure"
      },
      disabled: {
        message: "Stealth Mode DEACTIVATED",
        description: "Standard operational security, activities may be detectable",
        actions: [
          "Standard IP usage",
          "Normal activity patterns",
          "Basic security protocols"
        ],
        alertLevel: "normal"
      }
    },
    real_time_alerts: {
      enabled: {
        message: "Real-time Alerts ACTIVATED",
        description: "Instant notifications for competitor movements, market changes, and opportunities",
        actions: [
          "Real-time monitoring systems active",
          "Instant alert pipeline operational",
          "Market change detection live",
          "Competitive movement tracking enabled"
        ],
        alertLevel: "high"
      },
      disabled: {
        message: "Real-time Alerts DEACTIVATED",
        description: "Alerts disabled, monitoring reduced to batch processing",
        actions: [
          "Batch processing mode active",
          "Reduced monitoring frequency",
          "Manual review required"
        ],
        alertLevel: "low"
      }
    },
    auto_response: {
      enabled: {
        message: "Auto-Response ACTIVATED",
        description: "Automatically execute counter-measures when threats are detected",
        actions: [
          "Automated threat response active",
          "Counter-strategy deployment enabled",
          "Real-time competitive reactions",
          "Automated defensive measures engaged"
        ],
        alertLevel: "critical"
      },
      disabled: {
        message: "Auto-Response DEACTIVATED",
        description: "Manual approval required for all counter-measures",
        actions: [
          "Manual review process active",
          "Human approval required",
          "Response automation disabled"
        ],
        alertLevel: "normal"
      }
    }
  };

  const modeAction = modeActions[mode as keyof typeof modeActions];
  if (!modeAction) {
    throw new Error('Invalid operational mode');
  }

  const isEnabled = settings[mode];
  const result = isEnabled ? modeAction.enabled : modeAction.disabled;

  // Log the operation
  await supabase.from('operation_history').insert({
    operation_type: `operational_mode_${isEnabled ? 'enabled' : 'disabled'}`,
    description: `${mode.replace('_', ' ').toUpperCase()} ${isEnabled ? 'activated' : 'deactivated'}`,
    target: mode,
    result: 'success',
    metrics: {
      mode,
      enabled: isEnabled,
      alertLevel: result.alertLevel,
      actionsCount: result.actions.length
    },
    user_id: userId
  });

  return {
    mode,
    enabled: isEnabled,
    ...result,
    timestamp: new Date().toISOString()
  };
}

async function exportIntelligenceData(userId: string, supabase: any) {
  console.log('Exporting intelligence data for user:', userId);
  
  // Fetch all intelligence data
  const { data: feeds } = await supabase
    .from('intelligence_feeds')
    .select('*')
    .order('created_at', { ascending: false });
  
  const { data: competitors } = await supabase
    .from('competitor_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  const { data: keywords } = await supabase
    .from('seo_keywords')
    .select('*')
    .order('created_at', { ascending: false });

  const exportData = {
    exportedAt: new Date().toISOString(),
    exportedBy: userId,
    data: {
      intelligenceFeeds: feeds || [],
      competitorProfiles: competitors || [],
      seoKeywords: keywords || [],
      summary: {
        totalFeeds: feeds?.length || 0,
        totalCompetitors: competitors?.length || 0,
        totalKeywords: keywords?.length || 0
      }
    }
  };

  // Log the export operation
  await supabase.from('operation_history').insert({
    operation_type: 'intelligence_data_export',
    description: 'Intelligence data exported',
    target: 'intelligence_database',
    result: 'success',
    metrics: {
      feedsExported: feeds?.length || 0,
      competitorsExported: competitors?.length || 0,
      keywordsExported: keywords?.length || 0
    },
    user_id: userId
  });

  return {
    downloadUrl: generateDownloadUrl(exportData),
    fileSize: JSON.stringify(exportData).length,
    recordCount: (feeds?.length || 0) + (competitors?.length || 0) + (keywords?.length || 0),
    format: 'JSON'
  };
}

async function configureAlerts(settings: any, userId: string, supabase: any) {
  const alertConfig = {
    realTimeAlerts: settings.realTimeAlerts || false,
    emailNotifications: settings.emailNotifications || false,
    slackIntegration: settings.slackIntegration || false,
    alertThresholds: {
      competitorMentions: settings.competitorMentionThreshold || 10,
      sentimentChange: settings.sentimentChangeThreshold || 0.2,
      marketShare: settings.marketShareThreshold || 5
    },
    alertTypes: settings.alertTypes || [
      'competitor_activity',
      'market_changes',
      'sentiment_shifts',
      'keyword_movements'
    ]
  };

  // Update user settings
  await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      notifications: alertConfig
    });

  // Log the configuration
  await supabase.from('operation_history').insert({
    operation_type: 'alert_configuration',
    description: 'Alert configuration updated',
    target: 'notification_system',
    result: 'success',
    metrics: alertConfig,
    user_id: userId
  });

  return {
    message: 'Alert configuration updated successfully',
    config: alertConfig,
    activeAlerts: alertConfig.alertTypes.length,
    timestamp: new Date().toISOString()
  };
}

async function exportOperationHistory(userId: string, supabase: any) {
  const { data: history } = await supabase
    .from('operation_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const exportData = {
    exportedAt: new Date().toISOString(),
    exportedBy: userId,
    operationHistory: history || [],
    summary: {
      totalOperations: history?.length || 0,
      operationTypes: [...new Set(history?.map(h => h.operation_type) || [])],
      dateRange: {
        earliest: history?.[history.length - 1]?.created_at,
        latest: history?.[0]?.created_at
      }
    }
  };

  // Log the export
  await supabase.from('operation_history').insert({
    operation_type: 'operation_history_export',
    description: 'Operation history exported',
    target: 'operation_logs',
    result: 'success',
    metrics: {
      recordsExported: history?.length || 0
    },
    user_id: userId
  });

  return {
    downloadUrl: generateDownloadUrl(exportData),
    fileSize: JSON.stringify(exportData).length,
    recordCount: history?.length || 0,
    format: 'JSON'
  };
}

function generateDownloadUrl(data: any): string {
  // In a real implementation, this would generate a secure temporary URL
  // For now, we'll return a data URL
  const jsonString = JSON.stringify(data, null, 2);
  const base64 = btoa(jsonString);
  return `data:application/json;base64,${base64}`;
}