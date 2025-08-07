/**
 * 🔥 WARM LEAD SEIZURE DASHBOARD
 * 
 * Main control panel for the Warm Lead Seizure System
 * Displays thermal radar, warm index scores, and seizure operations
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Extend Window interface for Clerk
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string>;
      };
    };
  }
}
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Zap, 
  TrendingUp, 
  Users, 
  Mail, 
  MessageSquare, 
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface WarmLead {
  readonly id: string;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly company?: string | null;
  readonly source: string;
  readonly warmth_score: number; // 0-100
  readonly status: 'detected' | 'qualified' | 'seized' | 'converted' | 'cold' | 'unsubscribed';
  readonly last_activity: string; // ISO 8601 timestamp
  readonly seizure_history: readonly unknown[];
}

interface DashboardData {
  readonly summary: {
    readonly total_leads: number;
    readonly qualified_leads: number;
    readonly high_value_leads: number;
    readonly converted_leads: number;
    readonly active_seizures: number;
  };
  readonly top_leads: readonly WarmLead[];
  readonly recent_activity: readonly unknown[];
  readonly conversion_rate: string;
}

interface SeizureDashboardProps {
  readonly userId: string;
}

interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly code?: string;
}

export function SeizureDashboard({ userId }: SeizureDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'thermal-radar' | 'warm-index' | 'seizure-ops' | 'closer-grid'>('thermal-radar');
  const [activeTab, setActiveTab] = useState<'thermal-radar' | 'warm-index' | 'seizure-ops' | 'closer-grid'>('thermal-radar');

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate userId
      if (!userId || typeof userId !== 'string' || userId.length < 10) {
        throw new Error('Invalid user ID');
      }

      // Get auth token from Clerk
      const token = await window.Clerk?.session?.getToken();
      if (!token) {
        throw new Error('Authentication required - please sign in');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch('/functions/v1/warm-lead-seizure', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: 'get_dashboard',
            userId: userId
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            // Use default error message if JSON parsing fails
          }

          throw new Error(errorMessage);
        }

        const result: ApiResponse<{ dashboard: DashboardData }> = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to load dashboard data');
        }

        if (!result.data?.dashboard) {
          throw new Error('Invalid dashboard data received');
        }

        // Validate dashboard data structure
        const dashboard = result.data.dashboard;
        if (!dashboard.summary || typeof dashboard.summary !== 'object') {
          throw new Error('Invalid dashboard summary data');
        }

        setDashboardData(dashboard);

      } finally {
        clearTimeout(timeoutId);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to load seizure dashboard:', error);
      setError(errorMessage);

      // Don't set dashboardData to null if we already have data (allows for graceful degradation)
      if (!dashboardData) {
        setDashboardData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const executeSeizure = async (leadId: string): Promise<void> => {
    try {
      // Validate leadId
      if (!leadId || typeof leadId !== 'string' || leadId.length < 5 || leadId.length > 100) {
        throw new Error('Invalid lead ID format');
      }

      // Validate userId
      if (!userId || typeof userId !== 'string') {
        throw new Error('User not authenticated');
      }

      const token = await window.Clerk?.session?.getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        const response = await fetch('/functions/v1/warm-lead-seizure', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: 'execute_seizure',
            leadId: leadId,
            userId: userId
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `Failed to execute seizure (${response.status})`;

          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            // Use default error message
          }

          throw new Error(errorMessage);
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Seizure execution failed');
        }

        // Show success message (you might want to add a toast notification here)
        console.log('Seizure executed successfully for lead:', leadId);

        // Refresh dashboard data
        await loadDashboardData();

      } finally {
        clearTimeout(timeoutId);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute seizure';
      console.error('Seizure execution error:', error);

      // You might want to show this error to the user via a toast or alert
      setError(`Seizure execution failed: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Seizure System...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load seizure dashboard</p>
        <Button onClick={loadDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-8 w-8 text-red-600" />
            Warm Lead Seizure System
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered lead intelligence and conversion domination
          </p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          🔥 SPECTER NET ACTIVE
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.total_leads}</div>
            <p className="text-xs text-gray-600">
              Detected by Thermal Radar
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.qualified_leads}</div>
            <p className="text-xs text-gray-600">
              Warmth Score ≥ 65
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Seizures</CardTitle>
            <Target className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.active_seizures}</div>
            <p className="text-xs text-gray-600">
              Operation Snapback Running
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.converted_leads}</div>
            <p className="text-xs text-gray-600">
              {dashboardData.conversion_rate}% Success Rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="thermal-radar">🧠 Thermal Radar</TabsTrigger>
          <TabsTrigger value="warm-index">🔍 Warm Index</TabsTrigger>
          <TabsTrigger value="seizure-ops">⚔️ Seizure Ops</TabsTrigger>
          <TabsTrigger value="closer-grid">🧬 Closer Grid</TabsTrigger>
        </TabsList>

        <TabsContent value="thermal-radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                Detection Layer - "Thermal Radar"
              </CardTitle>
              <CardDescription>
                Real-time warm lead detection across all touchpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.top_leads.slice(0, 5).map((lead: WarmLead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{lead.email || 'Anonymous Lead'}</span>
                        <Badge variant={getStatusVariant(lead.status)}>
                          {lead.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Source: {lead.source} • Last Activity: {new Date(lead.last_activity).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{lead.warmth_score}</div>
                        <div className="text-xs text-gray-500">Warmth</div>
                      </div>
                      <Progress value={lead.warmth_score} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warm-index" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Qualification & Scoring Layer - "Warm Index Engine"
              </CardTitle>
              <CardDescription>
                Advanced lead scoring and qualification system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">High-Value Leads (Score ≥ 85)</h4>
                  {dashboardData.top_leads
                    .filter((lead: WarmLead) => lead.warmth_score >= 85)
                    .slice(0, 3)
                    .map((lead: WarmLead) => (
                      <div key={lead.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{lead.email || 'Anonymous'}</span>
                          <Badge className="bg-red-600 text-white">{lead.warmth_score}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Ready for immediate seizure
                        </p>
                      </div>
                    ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Qualified Leads (Score 65-84)</h4>
                  {dashboardData.top_leads
                    .filter((lead: WarmLead) => lead.warmth_score >= 65 && lead.warmth_score < 85)
                    .slice(0, 3)
                    .map((lead: WarmLead) => (
                      <div key={lead.id} className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{lead.email || 'Anonymous'}</span>
                          <Badge variant="secondary">{lead.warmth_score}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Qualified for seizure campaign
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seizure-ops" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-600" />
                Seizure Triggers - "Operation Snapback"
              </CardTitle>
              <CardDescription>
                Automated reconversion campaigns and seizure execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.top_leads
                  .filter((lead: WarmLead) => lead.warmth_score >= 65)
                  .slice(0, 5)
                  .map((lead: WarmLead) => (
                    <div key={lead.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium">{lead.email || 'Anonymous Lead'}</span>
                          <Badge className="ml-2 bg-red-600 text-white">
                            {lead.warmth_score} Warmth
                          </Badge>
                        </div>
                        <Button 
                          onClick={() => executeSeizure(lead.id)}
                          className="bg-red-600 hover:bg-red-700"
                          size="sm"
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Execute Seizure
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          Email Ready
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          Retargeting Ad
                        </span>
                        {lead.warmth_score >= 85 && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            Auto-Dialer
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closer-grid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Conversion Infrastructure - "The Closer Grid"
              </CardTitle>
              <CardDescription>
                Modular landing pages and conversion optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Dynamic Landing Pages</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Personalized based on lead behavior
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Scarcity Countdowns</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    "Only 2 slots left this month"
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold">1-Click Booking</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Embedded calendar in one scroll
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'converted':
      return 'default';
    case 'seized':
      return 'destructive';
    case 'qualified':
      return 'secondary';
    default:
      return 'outline';
  }
}
