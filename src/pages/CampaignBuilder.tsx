import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronLeft, 
  ChevronRight,
  Target, 
  Zap,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Check,
  AlertTriangle,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const campaignTypes = [
  {
    id: "seo",
    name: "SEO Warfare",
    description: "Target competitor's search rankings and organic traffic",
    icon: "🔍",
    difficulty: "Medium",
    timeline: "2-4 weeks",
    tactics: ["Keyword hijacking", "Content superiority", "Backlink disruption"]
  },
  {
    id: "social",
    name: "Social Operations", 
    description: "Influence social media perception and engagement",
    icon: "📱",
    difficulty: "Easy",
    timeline: "1-2 weeks",
    tactics: ["Sentiment manipulation", "Community engagement", "Viral content"]
  },
  {
    id: "whisper",
    name: "Whisper Network",
    description: "Deploy subtle negative messaging across platforms",
    icon: "👥",
    difficulty: "Hard",
    timeline: "4-8 weeks",
    tactics: ["Forum infiltration", "Review manipulation", "Industry influence"]
  },
  {
    id: "disruption",
    name: "Market Disruption",
    description: "Direct competitive attacks on market position",
    icon: "⚡",
    difficulty: "Hard",
    timeline: "6-12 weeks",
    tactics: ["Price undercutting", "Feature superiority", "Client poaching"]
  },
  {
    id: "ad_hijack",
    name: "Ad Hijacking",
    description: "Intercept competitor's advertising traffic",
    icon: "🎯",
    difficulty: "Medium",
    timeline: "1-3 weeks",
    tactics: ["Keyword bidding", "Audience targeting", "Creative superiority"]
  }
];

const personas = [
  { id: "1", name: "The Challenger", tone: "Aggressive, Direct", specialty: "Direct confrontation" },
  { id: "2", name: "The Analyst", tone: "Data-driven, Logical", specialty: "Market analysis" },
  { id: "3", name: "The Influencer", tone: "Charismatic, Persuasive", specialty: "Social manipulation" },
  { id: "4", name: "The Strategist", tone: "Calculated, Patient", specialty: "Long-term planning" }
];

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaign, setCampaign] = useState({
    type: searchParams.get('type') || '',
    targetCompetitor: searchParams.get('competitor') || '',
    objective: '',
    budget: '',
    timeline: '',
    persona: '',
    tactics: [] as string[],
    platforms: [] as string[],
    metrics: [] as string[],
    scheduledDate: ''
  });
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    const { data } = await supabase
      .from('competitor_profiles')
      .select('id, company_name')
      .order('created_at', { ascending: false });
    
    if (data) setCompetitors(data);
  };

  const selectedType = campaignTypes.find(t => t.id === campaign.type);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleTacticToggle = (tactic: string) => {
    setCampaign(prev => ({
      ...prev,
      tactics: prev.tactics.includes(tactic)
        ? prev.tactics.filter(t => t !== tactic)
        : [...prev.tactics, tactic]
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setCampaign(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleMetricToggle = (metric: string) => {
    setCampaign(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  const handleLaunch = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          type: campaign.type,
          target_company: competitors.find(c => c.id === campaign.targetCompetitor)?.company_name || 'Unknown',
          objective: campaign.objective,
          actions: {
            tactics: campaign.tactics,
            platforms: campaign.platforms,
            metrics: campaign.metrics,
            persona: campaign.persona,
            budget: campaign.budget,
            timeline: campaign.timeline
          },
          scheduled_date: campaign.scheduledDate ? new Date(campaign.scheduledDate).toISOString() : null,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Log the campaign creation
      await supabase
        .from('action_logs')
        .insert([{
          action_type: `campaign_created_${campaign.type}`,
          triggered_by: user.id,
          target_id: data.id,
          target_type: 'campaign',
          details: {
            competitor: competitors.find(c => c.id === campaign.targetCompetitor)?.company_name,
            tactics: campaign.tactics
          }
        }]);

      toast.success("Campaign Launched!", {
        description: `${selectedType?.name} campaign has been deployed successfully.`
      });

      navigate(`/campaigns/${data.id}`);
    } catch (error) {
      console.error('Campaign creation error:', error);
      toast.error("Failed to launch campaign");
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return campaign.type && campaign.targetCompetitor && campaign.objective;
      case 2:
        return campaign.tactics.length > 0;
      case 3:
        return campaign.budget && campaign.timeline;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="hover-scale"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Campaign Builder</h1>
              <p className="text-muted-foreground">Design your strategic operation</p>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Step {currentStep} of 4
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <Card className="card-hover">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Select Your Target</h2>
                  <p className="text-muted-foreground">Choose campaign type, target, and primary objective</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Campaign Type</Label>
                    <div className="grid gap-3">
                      {campaignTypes.map((type) => (
                        <Card 
                          key={type.id}
                          className={`cursor-pointer transition-all ${campaign.type === type.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setCampaign(prev => ({ ...prev, type: type.id }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{type.icon}</span>
                              <div className="flex-1">
                                <h3 className="font-semibold">{type.name}</h3>
                                <p className="text-sm text-muted-foreground">{type.description}</p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">{type.difficulty}</Badge>
                                  <Badge variant="outline" className="text-xs">{type.timeline}</Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Target Competitor</Label>
                      <Select value={campaign.targetCompetitor} onValueChange={(value) => setCampaign(prev => ({ ...prev, targetCompetitor: value }))}>
                        <SelectTrigger className="mt-1">
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
                      <Label>Primary Objective</Label>
                      <Textarea
                        placeholder="Describe the main goal of this campaign..."
                        value={campaign.objective}
                        onChange={(e) => setCampaign(prev => ({ ...prev, objective: e.target.value }))}
                        className="mt-1 min-h-32"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Choose Your Tactics</h2>
                  <p className="text-muted-foreground">Select the specific methods for your campaign</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-lg">Core Tactics</Label>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      {selectedType?.tactics.map((tactic) => (
                        <Card 
                          key={tactic}
                          className={`cursor-pointer transition-all ${campaign.tactics.includes(tactic) ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handleTacticToggle(tactic)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{tactic}</span>
                              <Checkbox checked={campaign.tactics.includes(tactic)} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg">Target Platforms</Label>
                    <div className="grid md:grid-cols-3 gap-3 mt-3">
                      {['Google', 'Facebook', 'LinkedIn', 'Twitter', 'Reddit', 'YouTube'].map((platform) => (
                        <Card 
                          key={platform}
                          className={`cursor-pointer transition-all ${campaign.platforms.includes(platform) ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handlePlatformToggle(platform)}
                        >
                          <CardContent className="p-3 text-center">
                            <span className="font-medium">{platform}</span>
                            <Checkbox checked={campaign.platforms.includes(platform)} className="ml-2" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Campaign Parameters</h2>
                  <p className="text-muted-foreground">Set budget, timeline, and success metrics</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Campaign Budget</Label>
                      <Select value={campaign.budget} onValueChange={(value) => setCampaign(prev => ({ ...prev, budget: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50000+">$50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Timeline</Label>
                      <Select value={campaign.timeline} onValueChange={(value) => setCampaign(prev => ({ ...prev, timeline: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="3-4 weeks">3-4 weeks</SelectItem>
                          <SelectItem value="2-3 months">2-3 months</SelectItem>
                          <SelectItem value="3-6 months">3-6 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Operational Persona</Label>
                      <Select value={campaign.persona} onValueChange={(value) => setCampaign(prev => ({ ...prev, persona: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select persona" />
                        </SelectTrigger>
                        <SelectContent>
                          {personas.map((persona) => (
                            <SelectItem key={persona.id} value={persona.id}>
                              {persona.name} - {persona.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg">Success Metrics</Label>
                    <div className="space-y-3">
                      {['Traffic decrease', 'Ranking drop', 'Sentiment decline', 'Brand mention reduction', 'Conversion impact'].map((metric) => (
                        <Card 
                          key={metric}
                          className={`cursor-pointer transition-all ${campaign.metrics.includes(metric) ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handleMetricToggle(metric)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{metric}</span>
                              <Checkbox checked={campaign.metrics.includes(metric)} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div>
                      <Label>Launch Date (Optional)</Label>
                      <Input
                        type="datetime-local"
                        value={campaign.scheduledDate}
                        onChange={(e) => setCampaign(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Launch Campaign</h2>
                  <p className="text-muted-foreground">Review and deploy your strategic operation</p>
                </div>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{selectedType?.icon}</span>
                      <span>{selectedType?.name}</span>
                    </CardTitle>
                    <CardDescription>
                      Target: {competitors.find(c => c.id === campaign.targetCompetitor)?.company_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Objective:</h4>
                      <p className="text-sm text-muted-foreground">{campaign.objective}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Selected Tactics:</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {campaign.tactics.map(tactic => (
                          <Badge key={tactic} variant="outline">{tactic}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">Platforms:</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {campaign.platforms.map(platform => (
                          <Badge key={platform} variant="secondary">{platform}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <span className="text-sm text-muted-foreground">Budget:</span>
                        <p className="font-medium">${campaign.budget}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Timeline:</span>
                        <p className="font-medium">{campaign.timeline}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-center space-x-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-700 dark:text-red-400">
                    This campaign will begin operations immediately upon launch. Ensure all parameters are correct.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleLaunch}
              disabled={loading || !isStepValid()}
              className="btn-glow"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Launching...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Launch Campaign
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}