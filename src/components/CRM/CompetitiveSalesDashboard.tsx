/**
 * 🔥 COMPETITIVE SALES DASHBOARD
 * 
 * Military-grade CRM that integrates competitive intelligence, AI coaching,
 * and real-time market signals for maximum sales performance
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  TrendingUp, 
  Users,
  Brain,
  Zap,
  Crown,
  Flame,
  Activity,
  MapPin
} from 'lucide-react';

import { EnhancedLeadCard } from './EnhancedLeadCard';

interface SalesMetrics {
  readonly totalLeads: number;
  readonly qualifiedLeads: number;
  readonly hotLeads: number;
  readonly conversionRate: number;
  readonly avgDealValue: number;
  readonly pipelineValue: number;
  readonly competitiveThreatLevel: number;
  readonly aiCoachingAlerts: number;
}

interface ZoneDominance {
  readonly zipCode: string;
  readonly area: string;
  readonly leadsCapture: number; // percentage
  readonly totalLeadsInArea: number;
  readonly yourLeads: number;
  readonly competitorLeads: number;
  readonly dominanceScore: number;
}

interface SalespersonPerformance {
  readonly id: string;
  readonly name: string;
  readonly leadsAssigned: number;
  readonly leadsContacted: number;
  readonly dealsClosedThisMonth: number;
  readonly revenue: number;
  readonly avgResponseTime: number; // hours
  readonly conversionRate: number;
  readonly threatResponseRate: number;
  readonly performanceScore: number;
}

interface LiveSignal {
  readonly id: string;
  readonly type: 'competitor_activity' | 'lead_behavior' | 'market_shift' | 'opportunity';
  readonly message: string;
  readonly urgency: 'low' | 'medium' | 'high' | 'critical';
  readonly timestamp: string;
  readonly actionable: boolean;
  readonly leadId?: string;
}

interface CompetitiveSalesDashboardProps {
  readonly userId: string;
}

export function CompetitiveSalesDashboard({ userId }: CompetitiveSalesDashboardProps) {
  const [salesData, setSalesData] = useState<{
    metrics: SalesMetrics;
    leads: any[];
    zoneDominance: readonly ZoneDominance[];
    teamPerformance: readonly SalespersonPerformance[];
    liveSignals: readonly LiveSignal[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'intelligence' | 'performance' | 'signals'>('pipeline');

  useEffect(() => {
    loadSalesData();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(loadSalesData, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      
      const mockData = {
        metrics: {
          totalLeads: 247,
          qualifiedLeads: 89,
          hotLeads: 23,
          conversionRate: 34.2,
          avgDealValue: 4500,
          pipelineValue: 387000,
          competitiveThreatLevel: 67,
          aiCoachingAlerts: 12
        },
        leads: [
          {
            id: 'lead_1',
            name: 'Sarah Johnson',
            email: 'sarah@techstartup.com',
            phone: '+1-555-0123',
            company: 'TechStartup Inc',
            location: 'Beverly Hills, CA',
            zipCode: '90210',
            stage: 'qualified',
            source: 'Google Ads',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            threatScore: {
              score: 78,
              factors: ['High competitor ad spend in area', 'Recent competitor price drop'],
              competitorActivity: 3,
              localSEOMomentum: 85,
              urgencyLevel: 'high'
            },
            behaviorIntel: {
              lastSeen: '2 hours ago',
              lastActivity: 'Viewed pricing page for 4 minutes',
              source: 'Google Ads - "Emergency Plumbing"',
              pagesVisited: ['/pricing', '/services', '/reviews'],
              timeOnSite: 420,
              emailOpens: 3,
              adClicks: 2,
              sentimentScore: 72,
              intentSignals: ['Pricing page focus', 'Multiple email opens', 'Repeat visitor']
            },
            competitorContext: {
              nearbyCompetitors: 5,
              averageServicePrice: 380,
              marketSaturation: 67,
              recentCompetitorActivity: [
                'Metro Plumbing Pro increased ad spend 200%',
                'Quick Fix Solutions launched new promotion',
                'Local competitor got 3 new 5-star reviews'
              ]
            },
            predictedValue: {
              estimatedValue: 4200,
              confidence: 78,
              basedOnFactors: [
                'High-income zip code (90210)',
                'Similar deals in area avg $4,500',
                'Strong intent signals detected',
                'Premium service area'
              ],
              similarDealsInArea: 12,
              conversionProbability: 68
            },
            nextAction: 'Call within 2 hours - competitor activity high. Mention our 24/7 guarantee and price match policy.',
            priority: 'urgent'
          }
        ],
        zoneDominance: [
          {
            zipCode: '90210',
            area: 'Beverly Hills West',
            leadsCapture: 34,
            totalLeadsInArea: 89,
            yourLeads: 30,
            competitorLeads: 59,
            dominanceScore: 34
          },
          {
            zipCode: '90405',
            area: 'Santa Monica East',
            leadsCapture: 67,
            totalLeadsInArea: 45,
            yourLeads: 30,
            competitorLeads: 15,
            dominanceScore: 67
          }
        ],
        teamPerformance: [
          {
            id: 'rep_1',
            name: 'Mike Rodriguez',
            leadsAssigned: 45,
            leadsContacted: 42,
            dealsClosedThisMonth: 8,
            revenue: 36000,
            avgResponseTime: 1.2,
            conversionRate: 18.9,
            threatResponseRate: 89,
            performanceScore: 92
          },
          {
            id: 'rep_2',
            name: 'Jennifer Chen',
            leadsAssigned: 38,
            leadsContacted: 35,
            dealsClosedThisMonth: 6,
            revenue: 27000,
            avgResponseTime: 2.1,
            conversionRate: 15.8,
            threatResponseRate: 76,
            performanceScore: 84
          }
        ],
        liveSignals: [
          {
            id: 'signal_1',
            type: 'competitor_activity' as const,
            message: 'Metro Plumbing Pro just launched emergency campaign - 3 of your leads in their target area',
            urgency: 'high' as const,
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            actionable: true,
            leadId: 'lead_1'
          },
          {
            id: 'signal_2',
            type: 'lead_behavior' as const,
            message: 'Sarah Johnson viewed competitor pricing page after yours - immediate follow-up recommended',
            urgency: 'critical' as const,
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            actionable: true,
            leadId: 'lead_1'
          }
        ]
      };

      setSalesData(mockData);
    } catch (error) {
      console.error('Failed to load sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStage = (leadId: string, stage: string) => {
    console.log('Updating lead stage:', leadId, stage);
  };

  const handleScheduleFollowUp = (leadId: string) => {
    console.log('Scheduling follow-up for:', leadId);
  };

  const handleViewFullIntel = (leadId: string) => {
    console.log('Viewing full intelligence for:', leadId);
  };

  const getSignalColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading competitive sales intelligence...</p>
        </div>
      </div>
    );
  }

  if (!salesData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load sales data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-purple-600" />
            Competitive Sales Command Center
          </CardTitle>
          <CardDescription>
            Military-grade CRM with real-time competitive intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{salesData.metrics.totalLeads}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${(salesData.metrics.pipelineValue / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Pipeline Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{salesData.metrics.conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{salesData.metrics.competitiveThreatLevel}%</div>
              <div className="text-sm text-muted-foreground">Threat Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Signals Feed */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-red-600" />
            Live Intelligence Signals
            <Badge variant="destructive">{salesData.liveSignals.length} Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {salesData.liveSignals.map((signal) => (
              <div key={signal.id} className={`p-3 rounded-lg border-l-4 ${getSignalColor(signal.urgency)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{signal.message}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(signal.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  {signal.actionable && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">🎯 Smart Pipeline</TabsTrigger>
          <TabsTrigger value="intelligence">🧠 Market Intel</TabsTrigger>
          <TabsTrigger value="performance">📊 Team Performance</TabsTrigger>
          <TabsTrigger value="signals">⚡ Signal Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4">
            {salesData.leads.map((lead) => (
              <EnhancedLeadCard
                key={lead.id}
                lead={lead}
                onUpdateStage={handleUpdateStage}
                onScheduleFollowUp={handleScheduleFollowUp}
                onViewFullIntel={handleViewFullIntel}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Zone Dominance Tracker
                </CardTitle>
                <CardDescription>
                  Your market capture percentage by geographic area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.zoneDominance.map((zone, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{zone.area} ({zone.zipCode})</div>
                        <div className="text-sm text-muted-foreground">
                          {zone.yourLeads} your leads • {zone.competitorLeads} competitor leads
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{zone.leadsCapture}%</div>
                        <div className="text-xs text-muted-foreground">Market Share</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4">
            {salesData.teamPerformance.map((rep) => (
              <Card key={rep.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {rep.name}
                    </CardTitle>
                    <Badge 
                      variant={rep.performanceScore >= 90 ? 'default' : rep.performanceScore >= 80 ? 'secondary' : 'destructive'}
                    >
                      {rep.performanceScore}% Performance
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{rep.dealsClosedThisMonth}</div>
                      <div className="text-xs text-muted-foreground">Deals Closed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">${(rep.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{rep.avgResponseTime}h</div>
                      <div className="text-xs text-muted-foreground">Avg Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{rep.threatResponseRate}%</div>
                      <div className="text-xs text-muted-foreground">Threat Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <div className="grid gap-4">
            {salesData.liveSignals.map((signal) => (
              <Card key={signal.id} className={`border-l-4 ${getSignalColor(signal.urgency)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {signal.type === 'competitor_activity' && <Target className="h-5 w-5 text-red-500" />}
                      {signal.type === 'lead_behavior' && <Brain className="h-5 w-5 text-blue-500" />}
                      {signal.type === 'market_shift' && <TrendingUp className="h-5 w-5 text-green-500" />}
                      {signal.type === 'opportunity' && <Flame className="h-5 w-5 text-orange-500" />}
                      {signal.type.replace('_', ' ').toUpperCase()}
                    </CardTitle>
                    <Badge variant="destructive" className="uppercase">
                      {signal.urgency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{signal.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(signal.timestamp).toLocaleString()}
                    </span>
                    {signal.actionable && (
                      <Button size="sm">
                        <Zap className="h-4 w-4 mr-1" />
                        Take Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
