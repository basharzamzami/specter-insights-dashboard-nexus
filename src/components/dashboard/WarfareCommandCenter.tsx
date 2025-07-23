// Warfare Command Center - Real-time competitive intelligence warfare dashboard
// This is the nerve center for digital market domination

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/clerk-react';
import { 
  Target, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Crosshair,
  Sword,
  Shield,
  Radar,
  Flame,
  Skull,
  Crown,
  Bomb,
  Scope
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ThreatAlert {
  id: string;
  threatType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  competitorName: string;
  threat: {
    title: string;
    description: string;
    impact: string;
    detectedAt: string;
  };
  response: {
    urgency: string;
    actions: string[];
    estimatedCost: number;
    expectedOutcome: string;
  };
  status: string;
}

interface OpportunityAlert {
  id: string;
  opportunityType: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  opportunity: {
    title: string;
    description: string;
    potentialGain: string;
    timeWindow: string;
  };
  exploitation: {
    method: string;
    timeline: string;
    estimatedCost: number;
    expectedROI: number;
  };
  status: string;
}

interface WarfareStrategy {
  id: string;
  targetCompetitor: string;
  strategyType: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  attackVector: {
    method: string;
    targetKeywords?: string[];
    estimatedCost: number;
    timeframe: string;
    successMetrics: string[];
  };
  expectedOutcome: {
    trafficSteal: number;
    marketShareGain: number;
    revenueImpact: number;
    competitorDamage: string;
  };
  status: string;
}

export const WarfareCommandCenter = () => {
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityAlert[]>([]);
  const [strategies, setStrategies] = useState<WarfareStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('threats');
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      loadWarfareIntelligence();
    }
  }, [user?.id]);

  const loadWarfareIntelligence = async () => {
    try {
      setLoading(true);

      // Load threat alerts
      const { data: threatData, error: threatError } = await supabase
        .from('threat_alerts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (threatError) throw threatError;

      // Load opportunity alerts
      const { data: opportunityData, error: opportunityError } = await supabase
        .from('opportunity_alerts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (opportunityError) throw opportunityError;

      // Load warfare strategies
      const { data: strategyData, error: strategyError } = await supabase
        .from('warfare_strategies')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (strategyError) throw strategyError;

      setThreats(threatData || []);
      setOpportunities(opportunityData || []);
      setStrategies(strategyData || []);

    } catch (error) {
      console.error('Error loading warfare intelligence:', error);
      toast({
        title: "Intelligence Loading Failed",
        description: "Unable to load warfare intelligence data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <Skull className="h-4 w-4 text-red-500" />;
      case 'high': return <Flame className="h-4 w-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Eye className="h-4 w-4 text-blue-500" />;
      default: return <Radar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStrategyIcon = (strategyType: string) => {
    switch (strategyType) {
      case 'seo_attack': return <Target className="h-4 w-4" />;
      case 'ad_hijack': return <Crosshair className="h-4 w-4" />;
      case 'review_warfare': return <Crown className="h-4 w-4" />;
      case 'content_domination': return <Sword className="h-4 w-4" />;
      case 'social_disruption': return <Bomb className="h-4 w-4" />;
      default: return <Scope className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Radar className="h-12 w-12 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Loading Warfare Intelligence...</p>
          <p className="text-sm text-muted-foreground">Scanning competitive battlefield</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warfare Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-500">CRITICAL THREATS</p>
                <p className="text-2xl font-bold text-red-500">
                  {threats.filter(t => t.severity === 'critical').length}
                </p>
              </div>
              <Skull className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-500">HIGH PRIORITY</p>
                <p className="text-2xl font-bold text-orange-500">
                  {threats.filter(t => t.severity === 'high').length}
                </p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-500">OPPORTUNITIES</p>
                <p className="text-2xl font-bold text-green-500">
                  {opportunities.filter(o => o.priority === 'high' || o.priority === 'critical').length}
                </p>
              </div>
              <Crown className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-500">ACTIVE STRATEGIES</p>
                <p className="text-2xl font-bold text-purple-500">
                  {strategies.filter(s => s.status === 'active').length}
                </p>
              </div>
              <Sword className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warfare Intelligence Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Threat Monitor
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Sword className="h-4 w-4" />
            Attack Strategies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Competitive Threat Monitor
              </CardTitle>
              <CardDescription>
                Real-time detection of competitive threats requiring immediate response
              </CardDescription>
            </CardHeader>
            <CardContent>
              {threats.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Active Threats Detected</p>
                  <p className="text-sm text-muted-foreground">Your competitive position is secure</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {threats.map((threat) => (
                    <Card key={threat.id} className={`border-l-4 ${getSeverityColor(threat.severity)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getSeverityIcon(threat.severity)}
                              <h4 className="font-semibold">{threat.threat.title}</h4>
                              <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                                {threat.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {threat.threat.description}
                            </p>
                            <p className="text-sm font-medium text-red-500 mb-3">
                              Impact: {threat.threat.impact}
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Competitor</p>
                                <p className="font-medium">{threat.competitorName}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Response Cost</p>
                                <p className="font-medium">${threat.response.estimatedCost.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Analyze
                            </Button>
                            <Button size="sm" className="bg-red-500 hover:bg-red-600">
                              <Zap className="h-3 w-3 mr-1" />
                              Respond
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-green-500" />
                Market Opportunities
              </CardTitle>
              <CardDescription>
                Competitive weaknesses ready for exploitation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {opportunities.length === 0 ? (
                <div className="text-center py-8">
                  <Crown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Scanning for Opportunities</p>
                  <p className="text-sm text-muted-foreground">New opportunities will appear as they're detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {opportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="border-l-4 border-l-green-500 bg-green-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Crown className="h-4 w-4 text-green-500" />
                              <h4 className="font-semibold">{opportunity.opportunity.title}</h4>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                {opportunity.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {opportunity.opportunity.description}
                            </p>
                            <p className="text-sm font-medium text-green-500 mb-3">
                              Potential: {opportunity.opportunity.potentialGain}
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Investment</p>
                                <p className="font-medium">${opportunity.exploitation.estimatedCost.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Timeline</p>
                                <p className="font-medium">{opportunity.exploitation.timeline}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Expected ROI</p>
                                <p className="font-medium">${opportunity.exploitation.expectedROI.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">
                              <Target className="h-3 w-3 mr-1" />
                              Execute
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sword className="h-5 w-5 text-purple-500" />
                Active Warfare Strategies
              </CardTitle>
              <CardDescription>
                Coordinated attacks designed to dominate competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {strategies.length === 0 ? (
                <div className="text-center py-8">
                  <Sword className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Active Strategies</p>
                  <p className="text-sm text-muted-foreground">Strategies will be generated based on competitive intelligence</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {strategies.map((strategy) => (
                    <Card key={strategy.id} className="border-l-4 border-l-purple-500 bg-purple-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStrategyIcon(strategy.strategyType)}
                              <h4 className="font-semibold">{strategy.attackVector.method}</h4>
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                                {strategy.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Target: {strategy.targetCompetitor}
                            </p>
                            <p className="text-sm font-medium text-purple-500 mb-3">
                              Expected Damage: {strategy.expectedOutcome.competitorDamage}
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Traffic Steal</p>
                                <p className="font-medium">{strategy.expectedOutcome.trafficSteal.toLocaleString()}/mo</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Revenue Impact</p>
                                <p className="font-medium">${strategy.expectedOutcome.revenueImpact.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Market Share</p>
                                <p className="font-medium">+{strategy.expectedOutcome.marketShareGain}%</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Progress
                            </Button>
                            <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                              <Zap className="h-3 w-3 mr-1" />
                              Execute
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
