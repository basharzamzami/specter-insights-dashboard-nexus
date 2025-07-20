import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Users,
  DollarSign,
  Brain,
  Rocket,
  Activity,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useCampaignRecommendations } from "@/hooks/useCampaignRecommendations";
import { useStrikePlanner } from "@/hooks/useStrikePlanner";
import { useCompetitorProfiles } from "@/hooks/useCompetitorProfiles";
import { useThreatAlerts } from "@/hooks/useThreatAlerts";
import { useToast } from "@/hooks/use-toast";

interface StrikePlan {
  id: string;
  title: string;
  type: 'seo_warfare' | 'social_ops' | 'ad_hijack' | 'market_disruption' | 'whisper_network';
  target: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  estimated_budget: number;
  timeline: string;
  expected_impact: string;
  vulnerabilities_exploited: string[];
  tactics: string[];
  success_probability: number;
  risk_level: string;
}

const STRIKE_TYPES = {
  seo_warfare: {
    name: "SEO Warfare",
    icon: "🎯",
    description: "Target competitor search rankings",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  social_ops: {
    name: "Social Operations",
    icon: "📱",
    description: "Social media influence campaigns",
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  ad_hijack: {
    name: "Ad Hijacking",
    icon: "🚀",
    description: "Intercept competitor traffic",
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  market_disruption: {
    name: "Market Disruption",
    icon: "⚡",
    description: "Direct competitive attacks",
    color: "text-red-500",
    bgColor: "bg-red-50"
  },
  whisper_network: {
    name: "Whisper Network",
    icon: "👥",
    description: "Subtle influence operations",
    color: "text-gray-500",
    bgColor: "bg-gray-50"
  }
};

export const StrikePlanner = () => {
  const { campaigns, loading: campaignsLoading, addCampaign } = useCampaignRecommendations();
  const { 
    recommendations: aiRecommendations, 
    loading: isGenerating, 
    generateRecommendations,
    deployRecommendation 
  } = useStrikePlanner();
  const { competitors } = useCompetitorProfiles();
  const { alerts } = useThreatAlerts();
  const { toast } = useToast();
  
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [activeTab, setActiveTab] = useState("recommendations");

  useEffect(() => {
    if (competitors.length > 0) {
      generateRecommendations();
    }
  }, [competitors, alerts]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 80) return 'text-green-500';
    if (probability >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Strike Planner
          </h2>
          <p className="text-muted-foreground">
            AI-powered competitive strike recommendations and deployment
          </p>
        </div>
        <Button 
          onClick={generateRecommendations}
          disabled={isGenerating}
          className="btn-glow"
        >
          <Brain className="h-4 w-4 mr-2" />
          {isGenerating ? "Analyzing..." : "Refresh AI Analysis"}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p>
              </div>
              <Rocket className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Recommendations</p>
                <p className="text-2xl font-bold">{aiRecommendations.length}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Targets Identified</p>
                <p className="text-2xl font-bold">{competitors.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threat Alerts</p>
                <p className="text-2xl font-bold">{alerts.filter(a => !a.read_status).length}</p>
              </div>
              <Activity className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="manual">Manual Planning</TabsTrigger>
          <TabsTrigger value="active">Active Strikes</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {isGenerating ? (
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <Brain className="h-12 w-12 text-primary mx-auto animate-pulse" />
                  <h3 className="text-lg font-semibold">AI Analysis in Progress</h3>
                  <p className="text-muted-foreground">
                    Analyzing competitor vulnerabilities and threat patterns...
                  </p>
                  <Progress value={67} className="w-full max-w-md mx-auto" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {aiRecommendations.map((recommendation) => {
                const strikeType = STRIKE_TYPES[recommendation.type as keyof typeof STRIKE_TYPES] || STRIKE_TYPES.seo_warfare;
                
                return (
                  <Card key={recommendation.id} className="card-hover">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${strikeType.bgColor} flex items-center justify-center`}>
                              <span className="text-lg">{strikeType.icon}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                              <CardDescription className={strikeType.color}>
                                {strikeType.name} • {recommendation.details.timeline}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(recommendation.details.priority)}>
                              {recommendation.details.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {recommendation.details.confidence_score}% Confidence
                            </Badge>
                            <Badge variant="outline" className={getSuccessColor(recommendation.details.success_probability)}>
                              {recommendation.details.success_probability}% Success Rate
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          onClick={() => deployRecommendation(recommendation)}
                          className="btn-glow"
                          size="sm"
                        >
                          <Rocket className="h-4 w-4 mr-2" />
                          Deploy Strike
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Expected Impact</h4>
                            <p className="text-sm">{recommendation.details.expected_impact}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Estimated Budget</h4>
                            <p className="text-sm font-semibold">${recommendation.estimated_budget.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Vulnerabilities Exploited</h4>
                            <div className="flex flex-wrap gap-1">
                              {recommendation.details.vulnerabilities_exploited.map((vuln, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {vuln}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Tactics</h4>
                            <div className="flex flex-wrap gap-1">
                              {recommendation.details.tactics.map((tactic, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tactic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Manual Strike Planning</CardTitle>
              <CardDescription>
                Create custom strike plans based on your analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Competitor</label>
                  <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select competitor" />
                    </SelectTrigger>
                    <SelectContent>
                      {competitors.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id}>
                          {comp.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Strike Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strike type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STRIKE_TYPES).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          {type.icon} {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                disabled={!selectedCompetitor || !selectedType}
                className="w-full btn-glow"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Build Custom Strike Plan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-4">
            {campaigns.filter(campaign => campaign.status === 'active' || campaign.status === 'pending').map((campaign) => (
              <Card key={campaign.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <h3 className="font-semibold">{campaign.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {campaign.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                        <Badge variant="outline">
                          ${campaign.estimated_budget?.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {campaigns.filter(campaign => campaign.status === 'active' || campaign.status === 'pending').length === 0 && (
              <Card className="card-hover">
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Strikes</h3>
                  <p className="text-muted-foreground">
                    Deploy AI recommendations or create manual strike plans to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};