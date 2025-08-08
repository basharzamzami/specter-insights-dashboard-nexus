
/**
 * 🔥 AD SIGNAL HIJACK DASHBOARD
 * 
 * Real-time competitive advertising intelligence system that monitors competitor ad activities,
 * identifies warm leads, and provides instant counter-strike recommendations for maximum market dominance.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Eye,
  AlertTriangle,
  Activity,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Flame
} from 'lucide-react';

interface AdIntelligenceData {
  readonly competitorAds: readonly CompetitorAd[];
  readonly warmLeads: readonly WarmLead[];
  readonly marketSignals: readonly MarketSignal[];
  readonly counterStrikes: readonly CounterStrike[];
}

interface CompetitorAd {
  readonly id: string;
  readonly competitor: string;
  readonly adTitle: string;
  readonly adDescription: string;
  readonly targetKeywords: readonly string[];
  readonly estimatedBudget: number;
  readonly impressions: number;
  readonly ctr: number;
  readonly adStrength: number;
  readonly platform: 'google' | 'facebook' | 'instagram' | 'linkedin';
  readonly isActive: boolean;
  readonly firstSeen: string;
  readonly lastSeen: string;
  readonly threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface WarmLead {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company?: string;
  readonly location: string;
  readonly source: string;
  readonly competitorEngagement: readonly string[];
  readonly intentScore: number;
  readonly estimatedValue: number;
  readonly urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  readonly lastActivity: string;
  readonly recommendedAction: string;
}

interface MarketSignal {
  readonly id: string;
  readonly type: 'budget_increase' | 'new_campaign' | 'keyword_shift' | 'audience_expansion';
  readonly competitor: string;
  readonly description: string;
  readonly impact: 'low' | 'medium' | 'high' | 'critical';
  readonly detectedAt: string;
  readonly affectedKeywords?: readonly string[];
  readonly estimatedBudgetChange?: number;
}

interface CounterStrike {
  readonly id: string;
  readonly triggeredBy: string;
  readonly strategy: string;
  readonly description: string;
  readonly estimatedCost: number;
  readonly expectedROI: number;
  readonly urgency: 'low' | 'medium' | 'high' | 'critical';
  readonly implementation: readonly string[];
  readonly success_probability: number;
}

interface AdHijackDashboardProps {
  readonly userId: string;
  readonly businessId: string;
}

export function AdHijackDashboard({ userId, businessId }: AdHijackDashboardProps) {
  const [adData, setAdData] = useState<AdIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'ads' | 'leads' | 'strikes'>('overview');
  const [monitoringKeyword, setMonitoringKeyword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadAdIntelligence();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(loadAdIntelligence, 30000);
    return () => clearInterval(interval);
  }, [userId, businessId]);

  const loadAdIntelligence = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockData: AdIntelligenceData = {
        competitorAds: [
          {
            id: 'ad_1',
            competitor: 'QuickFix Plumbing',
            adTitle: '24/7 Emergency Plumbing - Call Now!',
            adDescription: 'Licensed plumbers available 24/7. Same-day service guaranteed. Free estimates on all repairs.',
            targetKeywords: ['emergency plumbing', 'plumber near me', '24/7 plumbing'],
            estimatedBudget: 2500,
            impressions: 45000,
            ctr: 3.2,
            adStrength: 78,
            platform: 'google',
            isActive: true,
            firstSeen: '2024-01-15T10:00:00Z',
            lastSeen: '2024-01-20T15:30:00Z',
            threatLevel: 'high'
          },
          {
            id: 'ad_2',
            competitor: 'Metro Plumbing Pro',
            adTitle: 'Professional Plumbing Services',
            adDescription: 'Expert plumbing repairs and installations. 20+ years experience. Satisfaction guaranteed.',
            targetKeywords: ['plumbing services', 'pipe repair', 'water heater'],
            estimatedBudget: 1800,
            impressions: 32000,
            ctr: 2.8,
            adStrength: 65,
            platform: 'google',
            isActive: true,
            firstSeen: '2024-01-10T08:00:00Z',
            lastSeen: '2024-01-20T14:00:00Z',
            threatLevel: 'medium'
          }
        ],
        warmLeads: [
          {
            id: 'lead_1',
            name: 'Sarah Johnson',
            email: 'sarah@techstartup.com',
            company: 'TechStartup Inc',
            location: 'Beverly Hills, CA',
            source: 'Competitor Ad Click',
            competitorEngagement: ['QuickFix Plumbing', 'Metro Plumbing Pro'],
            intentScore: 87,
            estimatedValue: 4500,
            urgencyLevel: 'high',
            lastActivity: '2 hours ago',
            recommendedAction: 'Immediate outreach with competitive pricing offer'
          }
        ],
        marketSignals: [
          {
            id: 'signal_1',
            type: 'budget_increase',
            competitor: 'QuickFix Plumbing',
            description: 'Increased Google Ads spend by 200% in the last 7 days',
            impact: 'high',
            detectedAt: '2024-01-20T12:00:00Z',
            affectedKeywords: ['emergency plumbing', '24/7 plumber'],
            estimatedBudgetChange: 5000
          }
        ],
        counterStrikes: [
          {
            id: 'strike_1',
            triggeredBy: 'QuickFix budget increase',
            strategy: 'Keyword Interception',
            description: 'Launch targeted ads on their high-performing keywords with better offers',
            estimatedCost: 3000,
            expectedROI: 450,
            urgency: 'high',
            implementation: [
              'Create ads targeting "emergency plumbing" with 15% discount',
              'Increase bid on "24/7 plumber" by 30%',
              'Add negative keywords to avoid wasteful spend'
            ],
            success_probability: 78
          }
        ]
      };

      setAdData(mockData);
    } catch (error) {
      console.error('Failed to load ad intelligence:', error);
      toast({
        title: "Error",
        description: "Failed to load advertising intelligence data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addKeywordMonitoring = async () => {
    if (!monitoringKeyword.trim()) {
      toast({
        title: "Keyword Required",
        description: "Please enter a keyword to monitor",
        variant: "destructive"
      });
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Monitoring Added",
        description: `Now monitoring "${monitoringKeyword}" for competitive activity`,
      });
      
      setMonitoringKeyword('');
    } catch (error) {
      console.error('Failed to add keyword monitoring:', error);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getThreatBadgeClass = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading competitive intelligence...</p>
        </div>
      </div>
    );
  }

  if (!adData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load advertising intelligence</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-red-600" />
            Ad Signal Hijack Command Center
            <Badge className="bg-red-100 text-red-800">ACTIVE</Badge>
          </CardTitle>
          <CardDescription>
            Real-time competitive advertising intelligence and counter-strike operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{adData.competitorAds.length}</div>
              <div className="text-sm text-muted-foreground">Competitor Ads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{adData.warmLeads.length}</div>
              <div className="text-sm text-muted-foreground">Warm Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{adData.marketSignals.length}</div>
              <div className="text-sm text-muted-foreground">Market Signals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{adData.counterStrikes.length}</div>
              <div className="text-sm text-muted-foreground">Counter Strikes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Monitoring Setup</CardTitle>
          <CardDescription>Add keywords to monitor for competitive activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter keyword to monitor..."
              value={monitoringKeyword}
              onChange={(e) => setMonitoringKeyword(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addKeywordMonitoring} className="bg-red-600 hover:bg-red-700 text-white">
              <Eye className="h-4 w-4 mr-2" />
              Start Monitoring
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="ads">🎯 Competitor Ads</TabsTrigger>
          <TabsTrigger value="leads">🔥 Warm Leads</TabsTrigger>
          <TabsTrigger value="strikes">⚡ Counter Strikes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Market Signals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Market Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adData.marketSignals.map((signal) => (
                    <div key={signal.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{signal.competitor}</div>
                          <div className="text-sm text-muted-foreground">{signal.description}</div>
                          {signal.estimatedBudgetChange && (
                            <div className="text-xs text-green-600 mt-1">
                              Budget change: +${signal.estimatedBudgetChange.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <Badge className={getThreatBadgeClass(signal.impact)}>
                          {signal.impact.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Threats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Top Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adData.competitorAds
                    .filter(ad => ad.threatLevel === 'high' || ad.threatLevel === 'critical')
                    .map((ad) => (
                      <div key={ad.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{ad.competitor}</div>
                          <Badge className={getThreatBadgeClass(ad.threatLevel)}>
                            {ad.threatLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">{ad.adTitle}</div>
                        <div className="flex items-center gap-4 text-xs">
                          <span>Budget: ${ad.estimatedBudget.toLocaleString()}</span>
                          <span>CTR: {ad.ctr}%</span>
                          <span>Strength: {ad.adStrength}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <div className="grid gap-4">
            {adData.competitorAds.map((ad) => (
              <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {ad.competitor}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getThreatBadgeClass(ad.threatLevel)}>
                        {ad.threatLevel.toUpperCase()}
                      </Badge>
                      <Badge className={ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {ad.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium text-lg">{ad.adTitle}</div>
                      <div className="text-muted-foreground">{ad.adDescription}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-lg font-bold text-green-600">${ad.estimatedBudget.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Est. Budget</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{ad.impressions.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Impressions</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{ad.ctr}%</div>
                        <div className="text-xs text-muted-foreground">CTR</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{ad.adStrength}%</div>
                        <div className="text-xs text-muted-foreground">Ad Strength</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Target Keywords:</div>
                      <div className="flex flex-wrap gap-1">
                        {ad.targetKeywords.map((keyword, idx) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Zap className="h-4 w-4 mr-2" />
                        Launch Counter Strike
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <div className="grid gap-4">
            {adData.warmLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-600" />
                      {lead.name}
                      {lead.company && <span className="text-sm font-normal">({lead.company})</span>}
                    </CardTitle>
                    <Badge className={getThreatBadgeClass(lead.urgencyLevel)}>
                      {lead.urgencyLevel.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {lead.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Intent Score</div>
                        <div className="text-lg font-bold text-green-600">{lead.intentScore}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Est. Value</div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-bold">{lead.estimatedValue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Competitor Engagement:</div>
                      <div className="flex flex-wrap gap-1">
                        {lead.competitorEngagement.map((competitor, idx) => (
                          <Badge key={idx} className="bg-red-100 text-red-800 text-xs">
                            {competitor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-orange-800">Recommended Action:</div>
                      <div className="text-sm text-orange-700">{lead.recommendedAction}</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Last activity: {lead.lastActivity}
                      </div>
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Users className="h-4 w-4 mr-2" />
                        Initiate Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strikes" className="space-y-4">
          <div className="grid gap-4">
            {adData.counterStrikes.map((strike) => (
              <Card key={strike.id} className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                      {strike.strategy}
                    </CardTitle>
                    <Badge className={getThreatBadgeClass(strike.urgency)}>
                      {strike.urgency.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>Triggered by: {strike.triggeredBy}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm">{strike.description}</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Estimated Cost</div>
                        <div className="text-lg font-bold text-red-600">${strike.estimatedCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Expected ROI</div>
                        <div className="text-lg font-bold text-green-600">{strike.expectedROI}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Success Probability</div>
                        <div className="text-lg font-bold text-blue-600">{strike.success_probability}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Implementation Steps:</div>
                      <ul className="text-sm space-y-1">
                        {strike.implementation.map((step, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Zap className="h-4 w-4 mr-2" />
                        Execute Strike
                      </Button>
                      <Progress value={strike.success_probability} className="flex-1" />
                    </div>
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

export default AdHijackDashboard;
