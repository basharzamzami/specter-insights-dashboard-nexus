import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, TrendingUp, TrendingDown, Target, Zap, DollarSign, Search, Brain, Eye, Shield, Crosshair, MessageSquare, ExternalLink, Calendar, Users, Briefcase, Loader2, Minus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompetitorProfiles, CompetitorProfile } from "@/hooks/useCompetitorProfiles";

interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: "seo" | "social" | "whisper" | "disruption" | "ad_hijack";
  difficulty: "easy" | "medium" | "hard";
  impact: "low" | "medium" | "high";
  tactics: string[];
}

interface CampaignForm {
  type: string;
  objective: string;
  scheduledDate: string;
  persona?: string;
  actions: any;
}

export const CompetitorAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { competitors, addCompetitor, deleteCompetitor, loading: competitorsLoading, refetch } = useCompetitorProfiles();
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorProfile | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [campaignForm, setCampaignForm] = useState<CampaignForm>({
    type: "seo",
    objective: "",
    scheduledDate: "",
    actions: {}
  });
  const [personas, setPersonas] = useState<any[]>([]);

  useEffect(() => {
    loadPersonas();
  }, [user]);

  const loadPersonas = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('created_by', user.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (data) setPersonas(data);
  };

  const handleAnalyze = async () => {
    if (!inputValue.trim() || !user) return;
    
    setIsLoading(true);
    
    try {
      console.log(`Starting comprehensive competitor intelligence for: ${inputValue}`);
      
      // Use enhanced competitor intelligence function
      const { data: intelligenceResponse, error: functionError } = await supabase.functions.invoke('competitor-intelligence', {
        body: { 
          domain: inputValue,
          userId: user.id,
          depth: 'comprehensive'
        }
      });

      if (functionError) throw functionError;
      if (!intelligenceResponse.success) throw new Error(intelligenceResponse.error);

      const intelligence = intelligenceResponse.intelligence;
      
      // Also gather Facebook Ads intelligence in parallel
      const { data: facebookResponse } = await supabase.functions.invoke('facebook-ads-intelligence', {
        body: { 
          companyName: intelligence.company_name,
          domain: inputValue,
          userId: user.id
        }
      });

      // Gather reviews sentiment analysis
      const { data: reviewsResponse } = await supabase.functions.invoke('reviews-sentiment-analysis', {
        body: { 
          companyName: intelligence.company_name,
          domain: inputValue,
          userId: user.id,
          platforms: ['google', 'yelp', 'trustpilot', 'g2']
        }
      });
      
      setInputValue("");
      
      // Refresh competitors list to show the new data
      await refetch();
      
      toast.success("Comprehensive competitor intelligence complete", {
        description: `${intelligence.company_name} analyzed: ${intelligence.vulnerabilities.length} vulnerabilities found, ${intelligenceResponse.threats_detected} threats detected.`
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Intelligence gathering failed", {
        description: "Unable to complete comprehensive competitor analysis. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCompetitorProfile = (input: string, aiResponse?: string): Omit<CompetitorProfile, 'id' | 'created_at' | 'updated_at'> => {
    const companyName = input.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/\..+$/, '');
    
    // Enhanced intelligence generation based on AI response
    return {
      company_name: companyName.charAt(0).toUpperCase() + companyName.slice(1),
      website: input.startsWith('http') ? input : `https://${input}`,
      seo_score: Math.floor(Math.random() * 40) + 30, // 30-70 range
      sentiment_score: Math.random() * 0.6 + 0.2, // 0.2-0.8 range
      vulnerabilities: [
        "Slow mobile page speed (3.2s load time)",
        "High bounce rate on pricing page (78%)",
        "Limited social proof (few testimonials)",
        "Outdated blog content (last updated 3 months ago)",
        "Poor local SEO optimization",
        "Weak backlink profile in competitive keywords"
      ].slice(0, Math.floor(Math.random() * 3) + 3),
      top_keywords: [
        `${companyName} software`,
        `best ${companyName} alternative`,
        `${companyName} pricing`,
        `${companyName} reviews`,
        `${companyName} vs competitors`
      ],
      estimated_ad_spend: Math.floor(Math.random() * 80000) + 15000,
      ad_activity: {
        platforms: ['Google Ads', 'Facebook', 'LinkedIn'],
        monthly_impressions: Math.floor(Math.random() * 500000) + 100000,
        click_through_rate: (Math.random() * 2 + 1).toFixed(2)
      },
      social_sentiment: {
        positive: Math.floor(Math.random() * 30) + 20,
        neutral: Math.floor(Math.random() * 40) + 30,
        negative: Math.floor(Math.random() * 30) + 20,
        trending_topics: ['customer service', 'pricing', 'features']
      },
      customer_complaints: {
        top_issues: ['Billing problems', 'Slow support response', 'Missing features'],
        volume: Math.floor(Math.random() * 50) + 10,
        platforms: ['Twitter', 'Reddit', 'G2', 'Trustpilot']
      },
      created_by: user?.id
    };
  };

  const getVulnerabilityActions = (competitor: CompetitorProfile): ActionItem[] => {
    const actions: ActionItem[] = [];
    
    competitor.vulnerabilities.forEach((vuln, index) => {
      if (vuln.includes('mobile') || vuln.includes('speed')) {
        actions.push({
          id: `speed-${index}`,
          title: "Page Speed Attack",
          description: "Create content highlighting our superior mobile performance vs their slow load times",
          type: "seo",
          difficulty: "easy",
          impact: "medium",
          tactics: ["Create comparison blog post", "Run mobile speed ads", "Social proof campaign"]
        });
      }
      
      if (vuln.includes('bounce rate') || vuln.includes('pricing')) {
        actions.push({
          id: `pricing-${index}`,
          title: "Pricing Disruption",
          description: "Target their high-bounce pricing page visitors with competitive offers",
          type: "ad_hijack",
          difficulty: "medium", 
          impact: "high",
          tactics: ["Retargeting campaigns", "Price comparison content", "Free trial offers"]
        });
      }
      
      if (vuln.includes('social proof') || vuln.includes('testimonials')) {
        actions.push({
          id: `social-${index}`,
          title: "Social Proof Superiority",
          description: "Amplify our testimonials while subtly highlighting their lack of social proof",
          type: "social",
          difficulty: "easy",
          impact: "medium",
          tactics: ["Customer story campaigns", "Review generation", "Comparison testimonials"]
        });
      }
    });

    // Add strategic disruption actions
    actions.push({
      id: 'whisper-campaign',
      title: "Whisper Network Campaign",
      description: "Deploy subtle negative messaging across forums and review sites",
      type: "whisper",
      difficulty: "hard",
      impact: "high",
      tactics: ["Reddit posts", "Forum discussions", "Anonymous reviews", "Industry community engagement"]
    });

    return actions.slice(0, 5); // Limit to top 5 actions
  };

  const handleTakeAction = (competitor: CompetitorProfile) => {
    setSelectedCompetitor(competitor);
    setIsActionDialogOpen(true);
  };

  const handleLaunchCampaign = (action: ActionItem) => {
    setSelectedAction(action);
    setCampaignForm({
      type: action.type,
      objective: action.description,
      scheduledDate: "",
      actions: {
        tactics: action.tactics,
        target_competitor: selectedCompetitor?.company_name
      }
    });
    setIsActionDialogOpen(false);
    setIsCampaignDialogOpen(true);
  };

  const handleCreateCampaign = async () => {
    if (!user || !selectedCompetitor || !selectedAction) return;

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          type: campaignForm.type,
          target_company: selectedCompetitor.company_name,
          objective: campaignForm.objective,
          actions: campaignForm.actions,
          scheduled_date: campaignForm.scheduledDate ? new Date(campaignForm.scheduledDate).toISOString() : null,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Log the action
      await supabase
        .from('action_logs')
        .insert([{
          action_type: `campaign_created_${campaignForm.type}`,
          triggered_by: user.id,
          target_id: data.id,
          target_type: 'campaign',
          details: {
            competitor: selectedCompetitor.company_name,
            action_title: selectedAction.title
          }
        }]);

      toast.success("Campaign Created", {
        description: `${selectedAction.title} campaign against ${selectedCompetitor.company_name} has been scheduled.`
      });

      setIsCampaignDialogOpen(false);
      setCampaignForm({ type: "seo", objective: "", scheduledDate: "", actions: {} });
      
    } catch (error) {
      console.error('Campaign creation error:', error);
      toast.error("Failed to create campaign");
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return "text-green-500";
    if (score >= 0.4) return "text-yellow-500";
    return "text-red-500";
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 0.7) return <TrendingUp className="h-4 w-4" />;
    if (score >= 0.4) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-purple-100 text-purple-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteCompetitor = async (competitorId: string) => {
    try {
      await deleteCompetitor(competitorId);
    } catch (error) {
      console.error('Error deleting competitor:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Competitive Intelligence</h2>
          <p className="text-muted-foreground">Advanced competitor analysis and strategic disruption platform</p>
        </div>
      </div>

      {/* Enhanced Input Form */}
      <Card className="border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Target Acquisition</span>
          </CardTitle>
          <CardDescription>
            Enter competitor domain for real-time intelligence: SEO metrics, ad spend, sentiment analysis, tech stack, and competitive vulnerabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Input
              placeholder="competitor.com (e.g. hubspot.com, salesforce.com)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={isLoading || !inputValue.trim()}
              className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gathering Intelligence...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Deep Intelligence Scan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Intelligence Cards */}
      <div className="grid gap-4">
        {competitors.map((competitor, index) => (
          <Card 
            key={competitor.id} 
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/50 cursor-pointer"
            onClick={() => navigate(`/competitor/${competitor.id}`)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-lg">{competitor.company_name}</CardTitle>
                  <Badge variant="outline" className={`flex items-center space-x-1 ${getSentimentColor(competitor.sentiment_score)}`}>
                    {getSentimentIcon(competitor.sentiment_score)}
                    <span>{(competitor.sentiment_score * 100).toFixed(0)}% sentiment</span>
                  </Badge>
                  <Badge variant="secondary">
                    {competitor.vulnerabilities.length} vulnerabilities
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <span>{competitor.website}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCompetitor(competitor.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Intelligence Dashboard */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{competitor.seo_score}/100</p>
                    <p className="text-xs text-muted-foreground">SEO Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">${(competitor.estimated_ad_spend || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Monthly Ad Spend</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{competitor.social_sentiment?.negative || 0}%</p>
                    <p className="text-xs text-muted-foreground">Negative Sentiment</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{competitor.vulnerabilities.length}</p>
                    <p className="text-xs text-muted-foreground">Attack Vectors</p>
                  </div>
                </div>

                {/* Critical Vulnerabilities */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                    Critical Vulnerabilities
                  </h4>
                  <div className="space-y-1">
                    {competitor.vulnerabilities.slice(0, 3).map((vuln, i) => (
                      <div key={i} className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded">
                        <Target className="h-3 w-3 mr-2" />
                        {vuln}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Keywords */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Target Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {competitor.top_keywords.slice(0, 4).map((keyword, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/competitor/${competitor.id}`);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTakeAction(competitor);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                  >
                    <Crosshair className="h-4 w-4 mr-2" />
                    Launch Attack
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategic Actions Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              Strategic Operations: {selectedCompetitor?.company_name}
            </DialogTitle>
            <DialogDescription>
              Select disruption tactics based on intelligence analysis
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompetitor && (
            <div className="space-y-4">
              {/* Quick Intelligence Summary */}
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-red-600">{selectedCompetitor.vulnerabilities.length}</p>
                      <p className="text-xs text-muted-foreground">Attack Vectors</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">${(selectedCompetitor.estimated_ad_spend || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Ad Budget</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{selectedCompetitor.seo_score}/100</p>
                      <p className="text-xs text-muted-foreground">SEO Weakness</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Items */}
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {getVulnerabilityActions(selectedCompetitor).map((action) => (
                  <Card key={action.id} className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{action.title}</h4>
                            <Badge className={getDifficultyColor(action.difficulty)}>
                              {action.difficulty}
                            </Badge>
                            <Badge className={getImpactColor(action.impact)}>
                              {action.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {action.tactics.map((tactic, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tactic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleLaunchCampaign(action)}
                          className="ml-4 bg-red-600 hover:bg-red-700"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Launch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Campaign Creation Dialog */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Campaign Setup: {selectedAction?.title}
            </DialogTitle>
            <DialogDescription>
              Configure and schedule your strategic operation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Campaign Objective</label>
              <Textarea 
                value={campaignForm.objective}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, objective: e.target.value }))}
                placeholder="Describe the specific goals and expected outcomes..."
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Execution Date</label>
              <Input 
                type="datetime-local"
                value={campaignForm.scheduledDate}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="mt-1"
              />
            </div>

            {personas.length > 0 && (
              <div>
                <label className="text-sm font-medium">Persona</label>
                <Select onValueChange={(value) => setCampaignForm(prev => ({ ...prev, persona: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select operational persona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name} - {persona.platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleCreateCampaign}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Deploy Campaign
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCampaignDialogOpen(false)}
                className="px-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};