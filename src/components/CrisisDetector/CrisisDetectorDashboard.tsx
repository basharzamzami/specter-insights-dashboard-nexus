/**
 * 🚨 COMPETITOR CRISIS DETECTOR
 * 
 * Monitors competitors for reputation drops, negative press, and legal issues
 * Provides instant "Attack Window" alerts with ready-to-deploy campaigns
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingDown, 
  Newspaper, 
  Scale,
  MessageSquare,
  Star,
  Zap,
  Target,
  Clock,
  Flame,
  Shield
} from 'lucide-react';

interface CrisisEvent {
  readonly id: string;
  readonly competitor: string;
  readonly type: 'reputation' | 'legal' | 'press' | 'reviews' | 'social';
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly title: string;
  readonly description: string;
  readonly source: string;
  readonly timestamp: string;
  readonly impactScore: number; // 0-100
  readonly opportunityWindow: number; // hours
  readonly suggestedActions: readonly string[];
  readonly readyToDeploy: boolean;
}

interface ReputationMetric {
  readonly competitor: string;
  readonly currentScore: number;
  readonly previousScore: number;
  readonly trend: 'up' | 'down' | 'stable';
  readonly reviewCount: number;
  readonly averageRating: number;
  readonly sentimentScore: number;
  readonly riskLevel: 'low' | 'medium' | 'high';
}

interface AttackWindow {
  readonly id: string;
  readonly competitor: string;
  readonly opportunity: string;
  readonly timeRemaining: number; // hours
  readonly estimatedImpact: number;
  readonly campaignReady: boolean;
  readonly adCopy: string;
  readonly landingPageUrl?: string;
}

interface CrisisDetectorProps {
  readonly userId: string;
  readonly businessId: string;
}

export function CrisisDetectorDashboard({ userId, businessId }: CrisisDetectorProps) {
  const [crisisData, setCrisisData] = useState<{
    events: readonly CrisisEvent[];
    metrics: readonly ReputationMetric[];
    attackWindows: readonly AttackWindow[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'reputation' | 'opportunities' | 'monitoring'>('alerts');

  useEffect(() => {
    loadCrisisData();
    
    // Set up real-time monitoring
    const interval = setInterval(loadCrisisData, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [userId, businessId]);

  const loadCrisisData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockData = {
        events: [
          {
            id: 'crisis_1',
            competitor: 'Metro Plumbing Pro',
            type: 'reviews' as const,
            severity: 'high' as const,
            title: 'Major Review Bombing - 47 Negative Reviews in 24 Hours',
            description: 'Competitor received 47 one-star reviews citing "overcharging" and "poor service" after viral TikTok complaint.',
            source: 'Google Reviews + TikTok',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            impactScore: 89,
            opportunityWindow: 72,
            suggestedActions: [
              'Launch "Honest Pricing Guarantee" campaign',
              'Target their customers with "Better Service" ads',
              'Create comparison landing page highlighting reliability'
            ],
            readyToDeploy: true
          },
          {
            id: 'crisis_2',
            competitor: 'Quick Fix Solutions',
            type: 'legal' as const,
            severity: 'critical' as const,
            title: 'Lawsuit Filed - Unlicensed Work Allegations',
            description: 'Local news reports lawsuit alleging unlicensed plumbing work causing $50K in water damage.',
            source: 'Channel 7 News',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            impactScore: 95,
            opportunityWindow: 168, // 7 days
            suggestedActions: [
              'Emphasize licensing and insurance in all ads',
              'Create "Licensed & Bonded" trust campaign',
              'Target their service area with credibility messaging'
            ],
            readyToDeploy: true
          }
        ] as readonly CrisisEvent[],
        metrics: [
          {
            competitor: 'Metro Plumbing Pro',
            currentScore: 2.1,
            previousScore: 4.3,
            trend: 'down' as const,
            reviewCount: 234,
            averageRating: 2.1,
            sentimentScore: 23,
            riskLevel: 'high' as const
          },
          {
            competitor: 'Quick Fix Solutions',
            currentScore: 1.8,
            previousScore: 4.1,
            trend: 'down' as const,
            reviewCount: 156,
            averageRating: 1.8,
            sentimentScore: 18,
            riskLevel: 'high' as const
          }
        ] as readonly ReputationMetric[],
        attackWindows: [
          {
            id: 'window_1',
            competitor: 'Metro Plumbing Pro',
            opportunity: 'Review crisis - customers seeking alternatives',
            timeRemaining: 70,
            estimatedImpact: 340,
            campaignReady: true,
            adCopy: 'Tired of overpriced plumbing? Get honest, upfront pricing from licensed professionals. No surprises, just quality work.',
            landingPageUrl: '/landing/honest-pricing'
          },
          {
            id: 'window_2',
            competitor: 'Quick Fix Solutions',
            opportunity: 'Legal issues - trust and credibility gap',
            timeRemaining: 166,
            estimatedImpact: 280,
            campaignReady: true,
            adCopy: 'Choose licensed, bonded, and insured plumbers. Your home deserves professionals you can trust.',
            landingPageUrl: '/landing/licensed-bonded'
          }
        ] as readonly AttackWindow[]
      };

      setCrisisData(mockData);
    } catch (error) {
      console.error('Failed to load crisis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deployCampaign = async (windowId: string) => {
    console.log('Deploying attack campaign for window:', windowId);
    // Implement campaign deployment logic
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
          <Shield className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Monitoring competitor vulnerabilities...</p>
        </div>
      </div>
    );
  }

  if (!crisisData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load crisis monitoring data</p>
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
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Competitor Crisis Detector
          </CardTitle>
          <CardDescription>
            Real-time monitoring of competitor vulnerabilities and attack opportunities
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">🚨 Crisis Alerts</TabsTrigger>
          <TabsTrigger value="reputation">📊 Reputation Intel</TabsTrigger>
          <TabsTrigger value="opportunities">⚡ Attack Windows</TabsTrigger>
          <TabsTrigger value="monitoring">👁️ Live Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {crisisData.events.map((event) => (
              <Card key={event.id} className={`border-2 ${getSeverityColor(event.severity)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {event.type === 'legal' && <Scale className="h-5 w-5" />}
                      {event.type === 'press' && <Newspaper className="h-5 w-5" />}
                      {event.type === 'reviews' && <Star className="h-5 w-5" />}
                      {event.type === 'social' && <MessageSquare className="h-5 w-5" />}
                      {event.competitor}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="uppercase">
                        {event.severity}
                      </Badge>
                      <Badge variant="outline">
                        Impact: {event.impactScore}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Source: {event.source}</span>
                        <span>•</span>
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">
                        Opportunity window: <strong>{event.opportunityWindow} hours</strong>
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">🎯 Suggested Actions</div>
                      <ul className="text-sm space-y-1">
                        {event.suggestedActions.map((action, idx) => (
                          <li key={idx} className="text-muted-foreground">• {action}</li>
                        ))}
                      </ul>
                    </div>

                    {event.readyToDeploy && (
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        <Zap className="h-4 w-4 mr-2" />
                        Deploy Attack Campaign
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reputation" className="space-y-4">
          <div className="grid gap-4">
            {crisisData.metrics.map((metric, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      {metric.competitor}
                    </CardTitle>
                    <Badge 
                      variant={metric.riskLevel === 'high' ? 'destructive' : metric.riskLevel === 'medium' ? 'default' : 'secondary'}
                    >
                      {metric.riskLevel} risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Current Rating</div>
                        <div className="text-2xl font-bold text-red-600">
                          {metric.currentScore}/5.0
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Down from {metric.previousScore}/5.0
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sentiment Score</div>
                        <div className="text-2xl font-bold text-red-600">
                          {metric.sentimentScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {metric.reviewCount} reviews analyzed
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Reputation Trend</div>
                      <Progress 
                        value={metric.sentimentScore} 
                        className="h-3"
                      />
                    </div>

                    <Button variant="outline" className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      Target Their Customers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid gap-4">
            {crisisData.attackWindows.map((window) => (
              <Card key={window.id} className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Flame className="h-5 w-5" />
                      Attack Window Open
                    </CardTitle>
                    <Badge className="bg-green-600">
                      {window.timeRemaining}h remaining
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium text-green-800">{window.competitor}</div>
                      <div className="text-sm text-green-700">{window.opportunity}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Est. Impact:</span>
                        <span className="font-semibold text-green-600 ml-1">+{window.estimatedImpact}%</span>
                      </div>
                    </div>

                    {window.campaignReady && (
                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <div className="text-sm font-medium text-green-800 mb-2">📝 Ready-to-Deploy Ad</div>
                        <p className="text-sm text-gray-700 italic">"{window.adCopy}"</p>
                        {window.landingPageUrl && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Landing: {window.landingPageUrl}
                          </div>
                        )}
                      </div>
                    )}

                    <Button 
                      onClick={() => deployCampaign(window.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Launch Attack Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Live Monitoring Status
              </CardTitle>
              <CardDescription>
                Real-time tracking of competitor vulnerabilities across all channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Review Monitoring</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Scanning Google, Yelp, Facebook reviews every 5 minutes
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">News & Press</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Monitoring local news, press releases, legal filings
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Social Sentiment</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tracking mentions across Twitter, Facebook, Reddit
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Legal Filings</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Monitoring court records, BBB complaints, licensing issues
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Last scan: {new Date().toLocaleTimeString()} • Next scan in 4:32
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
