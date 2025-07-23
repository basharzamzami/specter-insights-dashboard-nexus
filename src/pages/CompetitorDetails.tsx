import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  ExternalLink, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Brain,
  BarChart3,
  Users,
  Calendar,
  Activity,
  Zap
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart3,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const mockTimelineData = [
  { month: "Jan", seoScore: 45, sentiment: 0.6, adSpend: 25000 },
  { month: "Feb", seoScore: 42, sentiment: 0.58, adSpend: 28000 },
  { month: "Mar", seoScore: 38, sentiment: 0.55, adSpend: 32000 },
  { month: "Apr", seoScore: 35, sentiment: 0.52, adSpend: 35000 },
  { month: "May", seoScore: 32, sentiment: 0.48, adSpend: 38000 },
  { month: "Jun", seoScore: 28, sentiment: 0.45, adSpend: 42000 }
];

const mockVulnerabilityData = [
  { category: "Technical SEO", severity: 85, count: 12 },
  { category: "Content Quality", severity: 72, count: 8 },
  { category: "User Experience", severity: 68, count: 15 },
  { category: "Social Proof", severity: 90, count: 6 },
  { category: "Performance", severity: 78, count: 9 }
];

const mockSocialData = [
  { platform: "Twitter", mentions: 1250, sentiment: 0.42 },
  { platform: "Reddit", mentions: 850, sentiment: 0.38 },
  { platform: "LinkedIn", mentions: 620, sentiment: 0.55 },
  { platform: "Facebook", mentions: 2100, sentiment: 0.48 }
];

export default function CompetitorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [competitor, setCompetitor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadCompetitorDetails();
  }, [id]);

  const loadCompetitorDetails = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('competitor_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCompetitor(data);
    } catch (error) {
      console.error('Error loading competitor:', error);
      toast.error("Failed to load competitor details");
    } finally {
      setLoading(false);
    }
  };

  const launchCampaign = (type: string) => {
    navigate(`/campaigns/new?competitor=${competitor?.id}&type=${type}`);
  };

  const viewKeywords = () => {
    navigate(`/keywords/${competitor?.id}`);
  };

  const analyzeSentiment = () => {
    navigate(`/sentiment-analysis/${competitor?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading competitor intelligence...</p>
        </div>
      </div>
    );
  }

  if (!competitor) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Competitor Not Found</h1>
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
              <h1 className="text-3xl font-bold">{competitor.company_name}</h1>
              <p className="text-muted-foreground">Deep Intelligence Analysis</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => launchCampaign("disruption")} className="btn-glow">
              <Zap className="h-4 w-4 mr-2" />
              Launch Attack
            </Button>
            <Button variant="outline" onClick={() => window.open(competitor.website, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Site
            </Button>
          </div>
        </div>

        {/* Lock Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{competitor.seo_score}/100</p>
                <p className="text-sm text-muted-foreground">SEO Vulnerability</p>
                <TrendingUp className="h-4 w-4 text-red-500 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  ${(competitor.estimated_ad_spend || 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Monthly Ad Spend</p>
                <BarChart3 className="h-4 w-4 text-orange-600 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {((1 - competitor.sentiment_score) * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">Negative Sentiment</p>
                <Users className="h-4 w-4 text-red-600 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">{competitor.vulnerabilities?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Attack Vectors</p>
                <Target className="h-4 w-4 text-red-500 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Strategic Intelligence</span>
                </CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="social">Social Intel</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <CardContent>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="border-red-200 dark:border-red-900">
                    <CardHeader>
                      <CardTitle className="text-red-600">Critical Vulnerabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {competitor.vulnerabilities?.slice(0, 5).map((vuln: string, i: number) => (
                          <div key={i} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">{vuln}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => launchCampaign("exploit")}
                              >
                                Exploit This
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={mockTimelineData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="seoScore" 
                            stroke="#ef4444" 
                            strokeWidth={2}
                            name="SEO Score"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sentiment" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            name="Sentiment"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Button onClick={viewKeywords} className="p-6 h-auto flex-col space-y-2">
                    <Target className="h-6 w-6" />
                    <span>Keyword Analysis</span>
                    <span className="text-xs text-muted-foreground">
                      {competitor.top_keywords?.length || 0} keywords tracked
                    </span>
                  </Button>
                  
                  <Button onClick={analyzeSentiment} variant="outline" className="p-6 h-auto flex-col space-y-2">
                    <Activity className="h-6 w-6" />
                    <span>Sentiment Deep Dive</span>
                    <span className="text-xs text-muted-foreground">
                      Social monitoring active
                    </span>
                  </Button>
                  
                  <Button onClick={() => launchCampaign("comprehensive")} variant="outline" className="p-6 h-auto flex-col space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span>Schedule Campaign</span>
                    <span className="text-xs text-muted-foreground">
                      Multi-vector attack
                    </span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="vulnerabilities" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vulnerability Heat Map</CardTitle>
                    <CardDescription>Prioritized attack opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart3 data={mockVulnerabilityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="severity" fill="#ef4444" />
                      </BarChart3>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historical Performance</CardTitle>
                    <CardDescription>6-month degradation analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={mockTimelineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="adSpend" 
                          stackId="1"
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="seoScore" 
                          stackId="2"
                          stroke="#82ca9d" 
                          fill="#82ca9d" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Media Intelligence</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockSocialData.map((platform, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{platform.platform}</p>
                              <p className="text-sm text-muted-foreground">
                                {platform.mentions} mentions
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={platform.sentiment > 0.5 ? "default" : "destructive"}>
                                {(platform.sentiment * 100).toFixed(0)}% positive
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="ml-2"
                                onClick={() => launchCampaign("social")}
                              >
                                Target
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sentiment Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Positive', value: 25, color: '#10b981' },
                              { name: 'Neutral', value: 35, color: '#6b7280' },
                              { name: 'Negative', value: 40, color: '#ef4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Positive', value: 25, color: '#10b981' },
                              { name: 'Neutral', value: 35, color: '#6b7280' },
                              { name: 'Negative', value: 40, color: '#ef4444' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}