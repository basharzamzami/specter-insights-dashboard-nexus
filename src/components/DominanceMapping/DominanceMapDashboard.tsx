/**
 * 🔥 DOMINANCE MAPPING™ SYSTEM
 * 
 * Visual competitive intelligence that maps business dominance and clout zones
 * Shows where clients hold attention vs competitors across all digital channels
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  MapPin,
  Zap,
  Crown,
  Focus,
  Activity,
  Flame
} from 'lucide-react';

interface DominanceZone {
  readonly id: string;
  readonly region: string;
  readonly dominanceScore: number; // 0-100
  readonly visibility: number; // 0-100
  readonly competitorCount: number;
  readonly opportunities: readonly string[];
  readonly threats: readonly string[];
  readonly cloutSpikes: readonly CloutSpike[];
}

interface CloutSpike {
  readonly id: string;
  readonly competitor: string;
  readonly platform: string;
  readonly spike: number; // percentage increase
  readonly reason: string;
  readonly timestamp: string;
  readonly actionable: boolean;
}

interface CompetitorVisibility {
  readonly competitor: string;
  readonly visibility: number;
  readonly trend: 'up' | 'down' | 'stable';
  readonly platforms: readonly PlatformVisibility[];
}

interface PlatformVisibility {
  readonly platform: string;
  readonly score: number;
  readonly change: number;
}

interface DominanceMappingProps {
  readonly userId: string;
  readonly businessId: string;
}

export function DominanceMappingDashboard({ userId, businessId }: DominanceMappingProps) {
  const [dominanceData, setDominanceData] = useState<{
    zones: readonly DominanceZone[];
    competitors: readonly CompetitorVisibility[];
    overallScore: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'competitors' | 'opportunities' | 'alerts'>('heatmap');

  useEffect(() => {
    loadDominanceData();
  }, [userId, businessId]);

  const loadDominanceData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual Supabase function
      const mockData = {
        zones: [
          {
            id: 'zone_1',
            region: 'Downtown Metro',
            dominanceScore: 78,
            visibility: 85,
            competitorCount: 12,
            opportunities: ['Google Ads gap in "emergency plumbing"', 'Yelp reviews 40% below average'],
            threats: ['Competitor increased ad spend 300%', 'New franchise opened 2 blocks away'],
            cloutSpikes: [
              {
                id: 'spike_1',
                competitor: 'Metro Plumbing Pro',
                platform: 'Google Ads',
                spike: 340,
                reason: 'New "24/7 Emergency" campaign launched',
                timestamp: new Date().toISOString(),
                actionable: true
              }
            ]
          },
          {
            id: 'zone_2',
            region: 'Suburban North',
            dominanceScore: 45,
            visibility: 52,
            competitorCount: 8,
            opportunities: ['Zero local SEO competition', 'Facebook ads completely untapped'],
            threats: ['HomeAdvisor dominates search results'],
            cloutSpikes: []
          }
        ] as readonly DominanceZone[],
        competitors: [
          {
            competitor: 'Metro Plumbing Pro',
            visibility: 92,
            trend: 'up' as const,
            platforms: [
              { platform: 'Google', score: 95, change: 12 },
              { platform: 'Facebook', score: 88, change: 8 },
              { platform: 'Yelp', score: 94, change: -2 }
            ]
          },
          {
            competitor: 'Quick Fix Solutions',
            visibility: 67,
            trend: 'down' as const,
            platforms: [
              { platform: 'Google', score: 72, change: -15 },
              { platform: 'Facebook', score: 45, change: -8 },
              { platform: 'Yelp', score: 84, change: 3 }
            ]
          }
        ] as readonly CompetitorVisibility[],
        overallScore: 63
      };

      setDominanceData(mockData);
    } catch (error) {
      console.error('Failed to load dominance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Mapping market dominance...</p>
        </div>
      </div>
    );
  }

  if (!dominanceData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load dominance data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Overall Score */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-orange-600" />
                Dominance Mapping™
              </CardTitle>
              <CardDescription>
                Your market position vs competitors across all channels
              </CardDescription>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {dominanceData.overallScore}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Dominance</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="heatmap">🗺️ Clout Zones</TabsTrigger>
          <TabsTrigger value="competitors">👥 Competitor Intel</TabsTrigger>
          <TabsTrigger value="opportunities">🎯 Takeover Ops</TabsTrigger>
          <TabsTrigger value="alerts">🚨 Clout Spikes</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="space-y-4">
          <div className="grid gap-4">
            {dominanceData.zones.map((zone) => (
              <Card key={zone.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {zone.region}
                    </CardTitle>
                    <Badge 
                      variant={zone.dominanceScore >= 70 ? "default" : zone.dominanceScore >= 50 ? "secondary" : "destructive"}
                      className="text-sm"
                    >
                      {zone.dominanceScore}% Dominance
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Visibility Score</div>
                        <Progress value={zone.visibility} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">{zone.visibility}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Competitors</div>
                        <div className="text-2xl font-bold">{zone.competitorCount}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-green-600 mb-2">🎯 Opportunities</div>
                        <ul className="text-xs space-y-1">
                          {zone.opportunities.map((opp, idx) => (
                            <li key={idx} className="text-muted-foreground">• {opp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-red-600 mb-2">⚠️ Threats</div>
                        <ul className="text-xs space-y-1">
                          {zone.threats.map((threat, idx) => (
                            <li key={idx} className="text-muted-foreground">• {threat}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <div className="grid gap-4">
            {dominanceData.competitors.map((comp, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {comp.competitor}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={comp.trend === 'up' ? 'destructive' : comp.trend === 'down' ? 'default' : 'secondary'}>
                        {comp.trend === 'up' ? '📈' : comp.trend === 'down' ? '📉' : '➡️'} {comp.visibility}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comp.platforms.map((platform, pidx) => (
                      <div key={pidx} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{platform.platform}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={platform.score} className="w-24 h-2" />
                          <span className="text-sm w-12">{platform.score}%</span>
                          <span className={`text-xs ${platform.change > 0 ? 'text-red-500' : platform.change < 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {platform.change > 0 ? '+' : ''}{platform.change}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Focus className="h-5 w-5 text-green-600" />
                Predictive Takeover Opportunities
              </CardTitle>
              <CardDescription>
                Low-cost, high-impact moves to steal market share
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">🎯 Google Ads Gap - "Emergency Plumbing"</h4>
                    <Badge className="bg-green-600">High Impact</Badge>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Competitors are missing 67% of emergency plumbing searches. Estimated cost: $2,400/mo for dominance.
                  </p>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Launch Campaign
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">📱 Social Media Vacuum - Suburban North</h4>
                    <Badge variant="secondary">Medium Impact</Badge>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Zero local competition on Facebook/Instagram. 12,000 homeowners in target demo.
                  </p>
                  <Button size="sm" variant="outline">
                    Build Strategy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {dominanceData.zones.flatMap(zone => zone.cloutSpikes).map((spike) => (
              <Card key={spike.id} className="border-red-200 bg-red-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <Flame className="h-5 w-5" />
                      Clout Spike Alert
                    </CardTitle>
                    <Badge variant="destructive">+{spike.spike}%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>{spike.competitor}</strong> spiked {spike.spike}% on {spike.platform}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Reason: {spike.reason}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(spike.timestamp).toLocaleString()}
                    </p>
                    {spike.actionable && (
                      <Button size="sm" className="mt-2">
                        <Zap className="h-4 w-4 mr-1" />
                        Counter-Attack
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
