/**
 * 📍 GEOGRAPHIC OPPORTUNITY RADAR™
 * 
 * Discovers untapped pockets of opportunity within cities, suburbs, and zip codes
 * Shows where competitors are weak and demand is high for strategic market entry
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  TrendingUp,
  DollarSign,
  Users,
  Focus,
  Radar,
  Target,
  Zap,
  AlertCircle,
  Crown,
  Map
} from 'lucide-react';

interface GeoOpportunity {
  readonly id: string;
  readonly zipCode: string;
  readonly area: string;
  readonly demandScore: number; // 0-100
  readonly competitionScore: number; // 0-100 (lower is better)
  readonly opportunityScore: number; // 0-100
  readonly monthlySearchVolume: number;
  readonly averageServicePrice: number;
  readonly population: number;
  readonly medianIncome: number;
  readonly competitorCount: number;
  readonly estimatedRevenue: number;
  readonly entryDifficulty: 'easy' | 'medium' | 'hard';
  readonly keyInsights: readonly string[];
}

interface CompetitorGap {
  readonly id: string;
  readonly area: string;
  readonly gapType: 'seo' | 'ads' | 'reviews' | 'coverage';
  readonly description: string;
  readonly impact: number; // 0-100
  readonly effort: 'low' | 'medium' | 'high';
  readonly estimatedCost: number;
  readonly timeToCapture: number; // weeks
}

interface LandGrabAlert {
  readonly id: string;
  readonly area: string;
  readonly alert: string;
  readonly urgency: 'low' | 'medium' | 'high' | 'critical';
  readonly opportunity: string;
  readonly timeWindow: number; // days
  readonly estimatedValue: number;
  readonly actionRequired: string;
}

interface GeoRadarProps {
  readonly userId: string;
  readonly businessId: string;
}

export function GeoRadarDashboard({ userId, businessId }: GeoRadarProps) {
  const [radarData, setRadarData] = useState<{
    opportunities: readonly GeoOpportunity[];
    gaps: readonly CompetitorGap[];
    alerts: readonly LandGrabAlert[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'opportunities' | 'gaps' | 'alerts' | 'heatmap'>('opportunities');

  useEffect(() => {
    loadRadarData();
  }, [userId, businessId]);

  const loadRadarData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockData = {
        opportunities: [
          {
            id: 'opp_1',
            zipCode: '90210',
            area: 'Beverly Hills West',
            demandScore: 94,
            competitionScore: 23, // Low competition = good
            opportunityScore: 91,
            monthlySearchVolume: 2400,
            averageServicePrice: 450,
            population: 34567,
            medianIncome: 125000,
            competitorCount: 2,
            estimatedRevenue: 48000,
            entryDifficulty: 'easy' as const,
            keyInsights: [
              'Only 2 competitors serving 34K+ affluent residents',
              'Average service price 40% above city average',
              'Zero Google Ads competition for emergency services',
              'High-income demographic with low price sensitivity'
            ]
          },
          {
            id: 'opp_2',
            zipCode: '90405',
            area: 'Santa Monica East',
            demandScore: 87,
            competitionScore: 45,
            opportunityScore: 78,
            monthlySearchVolume: 1800,
            averageServicePrice: 380,
            population: 28900,
            medianIncome: 95000,
            competitorCount: 4,
            estimatedRevenue: 32000,
            entryDifficulty: 'medium' as const,
            keyInsights: [
              'Growing tech professional population',
              'Competitors focus on residential, commercial underserved',
              'Strong Yelp presence could dominate local search',
              'New construction driving service demand'
            ]
          }
        ] as readonly GeoOpportunity[],
        gaps: [
          {
            id: 'gap_1',
            area: 'Downtown Metro',
            gapType: 'seo' as const,
            description: 'Competitors have zero local SEO presence for "commercial plumbing"',
            impact: 89,
            effort: 'low' as const,
            estimatedCost: 2500,
            timeToCapture: 8
          },
          {
            id: 'gap_2',
            area: 'Westside Suburbs',
            gapType: 'ads' as const,
            description: 'No Google Ads competition for "emergency plumber" after 6 PM',
            impact: 76,
            effort: 'low' as const,
            estimatedCost: 1200,
            timeToCapture: 2
          }
        ] as readonly CompetitorGap[],
        alerts: [
          {
            id: 'alert_1',
            area: 'Beverly Hills West',
            alert: 'Major competitor just closed - market vacuum created',
            urgency: 'critical' as const,
            opportunity: '$48K/month in unclaimed search volume',
            timeWindow: 14,
            estimatedValue: 48000,
            actionRequired: 'Launch immediate SEO + Ads blitz'
          },
          {
            id: 'alert_2',
            area: 'Santa Monica East',
            alert: 'New residential development approved - 500 units',
            urgency: 'high' as const,
            opportunity: 'First-mover advantage for new construction services',
            timeWindow: 90,
            estimatedValue: 25000,
            actionRequired: 'Establish contractor relationships now'
          }
        ] as readonly LandGrabAlert[]
      };

      setRadarData(mockData);
    } catch (error) {
      console.error('Failed to load radar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimTerritory = async (opportunityId: string) => {
    console.log('Claiming territory for opportunity:', opportunityId);
    // Implement territory claiming logic
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Radar className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Scanning geographic opportunities...</p>
        </div>
      </div>
    );
  }

  if (!radarData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load geographic radar data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            Geographic Opportunity Radar™
          </CardTitle>
          <CardDescription>
            Discover untapped markets and competitor weak spots by location
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="opportunities">🎯 Prime Targets</TabsTrigger>
          <TabsTrigger value="gaps">🕳️ Competitor Gaps</TabsTrigger>
          <TabsTrigger value="alerts">🚨 Land Grab Alerts</TabsTrigger>
          <TabsTrigger value="heatmap">🗺️ Opportunity Map</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid gap-4">
            {radarData.opportunities.map((opp) => (
              <Card key={opp.id} className={`border-2 ${getOpportunityColor(opp.opportunityScore)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {opp.area} ({opp.zipCode})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600">
                        {opp.opportunityScore}% Opportunity
                      </Badge>
                      <Badge variant="outline">
                        {opp.entryDifficulty} entry
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${(opp.estimatedRevenue / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground">Est. Monthly Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {opp.monthlySearchVolume.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Monthly Searches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {opp.competitorCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Competitors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          ${opp.averageServicePrice}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg. Service Price</div>
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Demand Score</span>
                        <div className="flex items-center gap-2">
                          <Progress value={opp.demandScore} className="w-24 h-2" />
                          <span className="text-sm w-12">{opp.demandScore}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Competition (lower = better)</span>
                        <div className="flex items-center gap-2">
                          <Progress value={100 - opp.competitionScore} className="w-24 h-2" />
                          <span className="text-sm w-12">{100 - opp.competitionScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Demographics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Population:</span>
                        <span className="font-medium ml-1">{opp.population.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Median Income:</span>
                        <span className="font-medium ml-1">${opp.medianIncome.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Key Insights */}
                    <div>
                      <div className="text-sm font-medium mb-2">🧠 Key Insights</div>
                      <ul className="text-sm space-y-1">
                        {opp.keyInsights.map((insight, idx) => (
                          <li key={idx} className="text-muted-foreground">• {insight}</li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => claimTerritory(opp.id)}
                      className="w-full"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Claim Territory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <div className="grid gap-4">
            {radarData.gaps.map((gap) => (
              <Card key={gap.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Focus className="h-5 w-5 text-orange-500" />
                      {gap.area}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="uppercase">
                        {gap.gapType}
                      </Badge>
                      <Badge 
                        variant={gap.impact >= 80 ? 'destructive' : gap.impact >= 60 ? 'default' : 'secondary'}
                      >
                        {gap.impact}% Impact
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{gap.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Effort Level</div>
                        <div className="font-semibold capitalize">{gap.effort}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Est. Cost</div>
                        <div className="font-semibold">${gap.estimatedCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Time to Capture</div>
                        <div className="font-semibold">{gap.timeToCapture} weeks</div>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      Exploit Gap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {radarData.alerts.map((alert) => (
              <Card key={alert.id} className={`border-2 ${getUrgencyColor(alert.urgency)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Land Grab Alert - {alert.area}
                    </CardTitle>
                    <Badge variant="destructive" className="uppercase">
                      {alert.urgency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-semibold mb-1">{alert.alert}</div>
                      <div className="text-sm text-muted-foreground">{alert.opportunity}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Time Window</div>
                        <div className="font-semibold">{alert.timeWindow} days</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Est. Value</div>
                        <div className="font-semibold text-green-600">
                          ${(alert.estimatedValue / 1000).toFixed(0)}K/month
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-800 mb-1">⚡ Action Required</div>
                      <p className="text-sm text-blue-700">{alert.actionRequired}</p>
                    </div>

                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Zap className="h-4 w-4 mr-2" />
                      Execute Land Grab
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-blue-600" />
                Opportunity Heatmap
              </CardTitle>
              <CardDescription>
                Visual representation of market opportunities by geographic area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <Map className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive opportunity heatmap</p>
                    <p className="text-sm">Integration with mapping service required</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
                    <div className="text-xs">High Opportunity</div>
                    <div className="text-xs text-muted-foreground">80-100%</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-1"></div>
                    <div className="text-xs">Medium Opportunity</div>
                    <div className="text-xs text-muted-foreground">60-79%</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-1"></div>
                    <div className="text-xs">Low Opportunity</div>
                    <div className="text-xs text-muted-foreground">40-59%</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
                    <div className="text-xs">Saturated</div>
                    <div className="text-xs text-muted-foreground">0-39%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
