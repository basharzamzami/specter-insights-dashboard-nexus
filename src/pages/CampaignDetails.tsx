import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  Play,
  Pause,
  BarChart3,
  Target,
  Calendar,
  Users,
  TrendingUp,
  TrendingUp,
  Activity,
  AlertTriangle,
  Check,
  Clock
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart3,
  Bar
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const mockProgressData = [
  { day: 'Day 1', reach: 1200, engagement: 450, sentiment: -2 },
  { day: 'Day 2', reach: 2800, engagement: 890, sentiment: -5 },
  { day: 'Day 3', reach: 4200, engagement: 1340, sentiment: -8 },
  { day: 'Day 4', reach: 6100, engagement: 1820, sentiment: -12 },
  { day: 'Day 5', reach: 8500, engagement: 2450, sentiment: -18 },
  { day: 'Day 6', reach: 11200, engagement: 3100, sentiment: -25 },
  { day: 'Day 7', reach: 14800, engagement: 4200, sentiment: -32 }
];

const mockTacticPerformance = [
  { tactic: 'SEO Disruption', progress: 85, impact: 'High', status: 'active' },
  { tactic: 'Social Manipulation', progress: 72, impact: 'Medium', status: 'active' },
  { tactic: 'Content Superiority', progress: 91, impact: 'High', status: 'completed' },
  { tactic: 'Review Campaign', progress: 45, impact: 'Medium', status: 'paused' }
];

export default function CampaignDetails() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Get campaign name from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const campaignName = urlParams.get('name');

  useEffect(() => {
    loadCampaignDetails();
  }, [campaignName]);

  const loadCampaignDetails = async () => {
    if (!campaignName) {
      // Create mock campaign data based on name for demo purposes
      const mockCampaign = {
        id: 'demo-' + campaignName?.toLowerCase().replace(/\s+/g, '-'),
        target_company: campaignName,
        type: 'brand_awareness',
        status: 'active',
        objective: `Strategic campaign to enhance ${campaignName} market position and competitive advantage.`,
        created_at: new Date().toISOString(),
        created_by: user?.id || 'demo-user'
      };
      setCampaign(mockCampaign);
      setLoading(false);
      return;
    }
    
    try {
      // For demo, create a mock campaign since we don't have real data
      const mockCampaign = {
        id: 'demo-' + campaignName.toLowerCase().replace(/\s+/g, '-'),
        target_company: campaignName,
        type: 'brand_awareness',
        status: 'active',
        objective: `Strategic campaign to enhance ${campaignName} market position and competitive advantage.`,
        created_at: new Date().toISOString(),
        created_by: user?.id || 'demo-user'
      };
      setCampaign(mockCampaign);
    } catch (error) {
      console.error('Error loading campaign:', error);
      toast.error("Failed to load campaign details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!campaign) return;
    
    try {
      // For demo campaigns, just update locally
      if (campaign.id.startsWith('demo-')) {
        setCampaign(prev => ({ ...prev, status: newStatus }));
        toast.success(`Campaign ${newStatus}`, {
          description: `Operation status updated successfully.`
        });
        return;
      }

      // For real campaigns, update in database
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaign.id);

      if (error) throw error;
      
      setCampaign(prev => ({ ...prev, status: newStatus }));
      toast.success(`Campaign ${newStatus}`, {
        description: `Operation status updated successfully.`
      });
    } catch (error) {
      toast.error("Failed to update campaign status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <Check className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seo': return '🔍';
      case 'social': return '📱';
      case 'whisper': return '👥';
      case 'disruption': return '⚡';
      case 'ad_hijack': return '🎯';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading campaign intelligence...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Campaign Not Found</h1>
          <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(campaign.type)}</span>
                <h1 className="text-3xl font-bold">{campaign.target_company}</h1>
                <Badge className={getStatusColor(campaign.status)}>
                  {getStatusIcon(campaign.status)}
                  <span className="ml-1">{campaign.status}</span>
                </Badge>
              </div>
              <p className="text-muted-foreground">Strategic Operation Details</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {campaign.status === 'active' && (
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange('paused')}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            {campaign.status === 'paused' && (
              <Button 
                onClick={() => handleStatusChange('active')}
                className="btn-glow"
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
            <Button 
              variant="destructive" 
              onClick={() => handleStatusChange('cancelled')}
            >
              <X className="h-4 w-4 mr-2" />
              Terminate
            </Button>
          </div>
        </div>

        {/* Lock Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">78%</p>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <TrendingUp className="h-4 w-4 text-green-500 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">14.8K</p>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <Target className="h-4 w-4 text-orange-600 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">-32%</p>
                <p className="text-sm text-muted-foreground">Sentiment Impact</p>
                <TrendingUp className="h-4 w-4 text-red-600 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">4.2K</p>
                <p className="text-sm text-muted-foreground">Engagements</p>
                <Users className="h-4 w-4 text-blue-600 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Campaign Intelligence</span>
                </CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tactics">Tactics</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <CardContent>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Progress</CardTitle>
                      <CardDescription>Real-time impact tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mockProgressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="reach" 
                            stackId="1"
                            stroke="#8884d8" 
                            fill="#8884d8" 
                            fillOpacity={0.6}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="engagement" 
                            stackId="2"
                            stroke="#82ca9d" 
                            fill="#82ca9d" 
                            fillOpacity={0.6}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sentiment Impact</CardTitle>
                      <CardDescription>Competitor perception decline</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockProgressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="sentiment" 
                            stroke="#ef4444" 
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Objective</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{campaign.objective}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <p className="font-medium">{new Date(campaign.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <p className="font-medium capitalize">{campaign.type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <p className="font-medium capitalize">{campaign.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tactics" className="space-y-6">
                <div className="space-y-4">
                  {mockTacticPerformance.map((tactic, index) => (
                    <Card key={index} className="border-l-4 border-l-primary/50">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{tactic.tactic}</h4>
                            <Badge 
                              variant={tactic.status === 'active' ? 'default' : 
                                      tactic.status === 'completed' ? 'secondary' : 'outline'}
                            >
                              {tactic.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-2xl">{tactic.progress}%</p>
                            <p className="text-sm text-muted-foreground">{tactic.impact} Impact</p>
                          </div>
                        </div>
                        <Progress value={tactic.progress} className="h-2" />
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>Started</span>
                          <span>{tactic.progress}% Complete</span>
                          <span>{tactic.status === 'completed' ? 'Completed' : 'In Progress'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>Detailed impact metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart3 data={mockProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="reach" fill="#8884d8" name="Reach" />
                        <Bar dataKey="engagement" fill="#82ca9d" name="Engagement" />
                      </BarChart3>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Timeline</CardTitle>
                    <CardDescription>Major milestones and activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { date: 'Day 1', event: 'Campaign Launch', status: 'completed', impact: 'Initial reach: 1.2K' },
                        { date: 'Day 3', event: 'Social Media Phase', status: 'completed', impact: 'Engagement spike: +180%' },
                        { date: 'Day 5', event: 'SEO Disruption', status: 'active', impact: 'Ranking decline detected' },
                        { date: 'Day 7', event: 'Sentiment Analysis', status: 'active', impact: '-32% sentiment shift' },
                        { date: 'Day 10', event: 'Phase 2 Launch', status: 'pending', impact: 'Projected reach: 25K' }
                      ].map((milestone, index) => (
                        <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              milestone.status === 'completed' ? 'bg-green-500' :
                              milestone.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{milestone.event}</h4>
                              <span className="text-sm text-muted-foreground">{milestone.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{milestone.impact}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}