import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  Search, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Globe, 
  Star,
  Phone,
  Mail,
  MapPin,
  DollarSign
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

const WarmLeadSeizure = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [leadInput, setLeadInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "Potential Lead",
    contactInfo: {
      phone: "123-456-7890",
      email: "lead@example.com",
      location: "New York, NY"
    },
    engagementScore: 0.75,
    seizureProbability: 0.88,
    keyIndicators: ["Visited pricing page", "Downloaded whitepaper", "Requested demo"],
    recentActivity: [
      { type: "page_view", description: "Viewed pricing page", timestamp: "2 hours ago" },
      { type: "download", description: "Downloaded AI ebook", timestamp: "5 hours ago" }
    ],
    marketTrends: {
      demand: 0.85,
      competition: 0.60
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/auth");
    }
  }, [isSignedIn, isLoaded, navigate]);

  const handleLeadAnalysis = async () => {
    if (!leadInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter lead details to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setLeadData({
        name: leadInput,
        contactInfo: {
          phone: "987-654-3210",
          email: "newlead@example.com",
          location: "San Francisco, CA"
        },
        engagementScore: Math.random() * 0.9 + 0.1,
        seizureProbability: Math.random() * 0.9 + 0.1,
        keyIndicators: ["Visited contact page", "Requested a call", "Signed up for newsletter"],
        recentActivity: [
          { type: "form_submit", description: "Submitted contact form", timestamp: "1 hour ago" },
          { type: "email_open", description: "Opened welcome email", timestamp: "3 hours ago" }
        ],
        marketTrends: {
          demand: Math.random() * 0.5 + 0.5,
          competition: Math.random() * 0.5 + 0.5
        }
      });
      
      setLeadInput("");
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Lead analysis for ${leadInput} has been processed.`,
      });
    }, 3000);
  };

  const getIndicatorColor = (indicator: string) => {
    if (indicator.includes("pricing")) return "text-green-400";
    if (indicator.includes("demo")) return "text-blue-400";
    return "text-yellow-400";
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-red-500">Analyzing Lead Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-red-500">
      {/* Header */}
      <header className="border-b border-red-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-red-500 font-mono">LEAD SEIZURE</h1>
            </div>
            <Badge variant="outline" className="text-xs border-red-500/30 text-red-500">
              WARM LEAD INTELLIGENCE
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-red-500/80 font-mono">
              WELCOME, <span className="text-red-500 font-bold">{user?.firstName?.toUpperCase() || "AGENT"}</span>
            </div>
            {/* UserButton */}
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-red-500/10 border border-red-500/30">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500 text-red-500/70"
            >
              <Search className="h-4 w-4 mr-2" />
              LEAD OVERVIEW
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500 text-red-500/70"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              MARKET TRENDS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Lead Analysis Input */}
            <Card className="bg-black/50 border-red-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500 font-mono">
                  <Star className="h-5 w-5" />
                  LEAD INTELLIGENCE INPUT
                </CardTitle>
                <CardDescription className="text-red-500/70">
                  Enter lead details for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter lead name or identifier..."
                    value={leadInput}
                    onChange={(e) => setLeadInput(e.target.value)}
                    className="bg-black/50 border-red-500/30 text-red-500 placeholder:text-red-500/50"
                    disabled={isAnalyzing}
                  />
                  <Button 
                    onClick={handleLeadAnalysis}
                    disabled={isAnalyzing}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ANALYZING...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        ANALYZE
                      </div>
                    )}
                  </Button>
                </div>
                {isAnalyzing && (
                  <div className="space-y-2">
                    <Progress value={66} className="h-2" />
                    <p className="text-sm text-red-500/70 font-mono">Processing intelligence data...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lead Data Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-black/50 border-red-500/30 backdrop-blur-sm hover:bg-red-500/5 transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-red-500 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {leadData.name.toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-red-400">
                        {leadData.seizureProbability * 100}%
                      </span>
                      <TrendingUp className="h-4 w-4 text-red-400" />
                    </div>
                  </CardTitle>
                  <CardDescription className="text-red-500/70 text-xs">
                    Seizure Probability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-red-500/70 mb-1 font-mono">ENGAGEMENT SCORE</p>
                    <Progress 
                      value={leadData.engagementScore * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <p className="text-xs text-red-500/70 mb-2 font-mono">KEY INDICATORS</p>
                    <div className="flex flex-wrap gap-1">
                      {leadData.keyIndicators.map((indicator, index) => (
                        <Badge key={index} variant="outline" className={`text-xs border-red-500/30 text-red-500/80 ${getIndicatorColor(indicator)}`}>
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-red-500/70 mb-1 font-mono">RECENT ACTIVITY</p>
                    {leadData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-red-500/80">
                        <Clock className="h-3 w-3" />
                        {activity.description} - <span className="text-red-500/50">{activity.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-red-500/30 backdrop-blur-sm hover:bg-red-500/5 transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-red-500 font-mono text-sm">
                    <Globe className="h-4 w-4 mr-2" />
                    CONTACT INFORMATION
                  </CardTitle>
                  <CardDescription className="text-red-500/70 text-xs">
                    Lead contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-red-500/80">
                    <Phone className="h-3 w-3" />
                    {leadData.contactInfo.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-500/80">
                    <Mail className="h-3 w-3" />
                    {leadData.contactInfo.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-500/80">
                    <MapPin className="h-3 w-3" />
                    {leadData.contactInfo.location}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-red-500/30 backdrop-blur-sm hover:bg-red-500/5 transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-red-500 font-mono text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    POTENTIAL REVENUE
                  </CardTitle>
                  <CardDescription className="text-red-500/70 text-xs">
                    Estimated revenue from lead
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">$5,000</p>
                    <p className="text-xs text-red-500/70">Based on similar lead conversions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6 mt-6">
            <Card className="bg-black/50 border-red-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500 font-mono">
                  <TrendingUp className="h-5 w-5" />
                  MARKET TRENDS
                </CardTitle>
                <CardDescription className="text-red-500/70">
                  Analyze market demand and competition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-mono text-red-500/70">DEMAND</p>
                    <Progress value={leadData.marketTrends.demand * 100} className="h-2" />
                    <p className="text-xs text-red-500/50 mt-1">Market demand for product/service</p>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-red-500/70">COMPETITION</p>
                    <Progress value={leadData.marketTrends.competition * 100} className="h-2" />
                    <p className="text-xs text-red-500/50 mt-1">Competitive intensity in the market</p>
                  </div>
                </div>
                
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Jan', demand: 60, competition: 40 },
                      { name: 'Feb', demand: 70, competition: 30 },
                      { name: 'Mar', demand: 80, competition: 20 },
                      { name: 'Apr', demand: 75, competition: 25 },
                      { name: 'May', demand: 85, competition: 15 },
                      { name: 'Jun', demand: 90, competition: 10 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                      <XAxis dataKey="name" stroke="#9CA3AF"/>
                      <YAxis stroke="#9CA3AF"/>
                      <Tooltip />
                      <Line type="monotone" dataKey="demand" stroke="#F43F5E" strokeWidth={2} />
                      <Line type="monotone" dataKey="competition" stroke="#EAB308" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Demand', value: leadData.marketTrends.demand * 100 },
                          { name: 'Competition', value: leadData.marketTrends.competition * 100 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {
                          [...Array(2)].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))
                        }
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WarmLeadSeizure;
