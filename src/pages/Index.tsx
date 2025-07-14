import { useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Settings, 
  User, 
  Shield, 
  Target,
  Bot,
  Globe,
  Zap,
  BarChart3,
  Eye,
  Clock,
  Activity
} from "lucide-react";

const Index = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("analysis");
  const [competitorInput, setCompetitorInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentData, setSentimentData] = useState([
    {
      id: 1,
      competitor: "TechCorp",
      sentimentScore: 0.65,
      keyTopics: ["AI Innovation", "Market Expansion", "User Experience"],
      recommendation: "Monitor their AI initiatives closely. Consider accelerating your own AI roadmap.",
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      competitor: "DataFlow Inc",
      sentimentScore: 0.35,
      keyTopics: ["Product Issues", "Customer Support", "Pricing Strategy"],
      recommendation: "Opportunity to capture market share with better customer service positioning.",
      lastUpdated: "4 hours ago"
    },
    {
      id: 3,
      competitor: "CloudMaster",
      sentimentScore: 0.78,
      keyTopics: ["Security Features", "Enterprise Solutions", "Scalability"],
      recommendation: "Strong competitor. Focus on unique value propositions and competitive pricing.",
      lastUpdated: "6 hours ago"
    }
  ]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/auth");
    }
  }, [isSignedIn, isLoaded, navigate]);

  const handleCompetitorAnalysis = async () => {
    if (!competitorInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a competitor URL or keyword to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAnalysis = {
        id: Date.now(),
        competitor: competitorInput,
        sentimentScore: Math.random() * 0.8 + 0.2,
        keyTopics: ["Market Position", "Innovation", "Customer Sentiment"],
        recommendation: "Analysis complete. Review competitive positioning and adjust strategy accordingly.",
        lastUpdated: "Just now"
      };
      
      setSentimentData([newAnalysis, ...sentimentData]);
      setCompetitorInput("");
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Competitor analysis for ${competitorInput} has been processed.`,
      });
    }, 3000);
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return "text-green-400";
    if (score >= 0.5) return "text-yellow-400";
    return "text-red-400";
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 0.7) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (score >= 0.5) return <BarChart3 className="h-4 w-4 text-yellow-400" />;
    return <TrendingDown className="h-4 w-4 text-red-400" />;
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
          <p className="mt-4 text-green-400">Initializing Specter Net...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Header */}
      <header className="border-b border-green-400/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <h1 className="text-2xl font-bold text-green-400 font-mono">SPECTER NET</h1>
            </div>
            <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">
              BUSINESS INTELLIGENCE
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-green-400/80 font-mono">
              WELCOME, <span className="text-green-400 font-bold">{user?.firstName?.toUpperCase() || "AGENT"}</span>
            </div>
            <UserButton 
              afterSignOutUrl="/auth"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 border border-green-400/30",
                  userButtonPopoverCard: "bg-black border-green-400/30",
                  userButtonPopoverText: "text-green-400",
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-green-400/10 border border-green-400/30">
            <TabsTrigger 
              value="analysis" 
              className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400 text-green-400/70"
            >
              <Target className="h-4 w-4 mr-2" />
              COMPETITOR ANALYSIS
            </TabsTrigger>
            <TabsTrigger 
              value="campaigns" 
              className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400 text-green-400/70"
            >
              <Calendar className="h-4 w-4 mr-2" />
              CAMPAIGN SCHEDULER
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400 text-green-400/70"
            >
              <Settings className="h-4 w-4 mr-2" />
              PROFILE & SETTINGS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6 mt-6">
            {/* Competitor Analysis Input */}
            <Card className="bg-black/50 border-green-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400 font-mono">
                  <Bot className="h-5 w-5" />
                  COMPETITOR INTELLIGENCE INPUT
                </CardTitle>
                <CardDescription className="text-green-400/70">
                  Enter competitor URLs or keywords for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter competitor URL or keyword..."
                    value={competitorInput}
                    onChange={(e) => setCompetitorInput(e.target.value)}
                    className="bg-black/50 border-green-400/30 text-green-400 placeholder:text-green-400/50"
                    disabled={isAnalyzing}
                  />
                  <Button 
                    onClick={handleCompetitorAnalysis}
                    disabled={isAnalyzing}
                    className="bg-green-400/20 hover:bg-green-400/30 text-green-400 border border-green-400/30"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
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
                    <p className="text-sm text-green-400/70 font-mono">Processing intelligence data...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sentiment Analysis Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sentimentData.map((item) => (
                <Card key={item.id} className="bg-black/50 border-green-400/30 backdrop-blur-sm hover:bg-green-400/5 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-green-400 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {item.competitor.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-1">
                        {getSentimentIcon(item.sentimentScore)}
                        <span className={`text-xs ${getSentimentColor(item.sentimentScore)}`}>
                          {(item.sentimentScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-green-400/70 text-xs">
                      Last updated: {item.lastUpdated}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-green-400/70 mb-1 font-mono">SENTIMENT SCORE</p>
                      <Progress 
                        value={item.sentimentScore * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <p className="text-xs text-green-400/70 mb-2 font-mono">KEY TOPICS</p>
                      <div className="flex flex-wrap gap-1">
                        {item.keyTopics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-green-400/30 text-green-400/80">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-green-400/70 mb-1 font-mono">STRATEGIC RECOMMENDATION</p>
                      <p className="text-xs text-green-400/80 leading-relaxed">
                        {item.recommendation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6 mt-6">
            <Card className="bg-black/50 border-green-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400 font-mono">
                  <Zap className="h-5 w-5" />
                  CAMPAIGN SCHEDULER
                </CardTitle>
                <CardDescription className="text-green-400/70">
                  Schedule and manage your marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-green-400/70">CAMPAIGN NAME</label>
                    <Input 
                      placeholder="Enter campaign name..."
                      className="bg-black/50 border-green-400/30 text-green-400 placeholder:text-green-400/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-green-400/70">PLATFORM</label>
                    <Input 
                      placeholder="Select platform..."
                      className="bg-black/50 border-green-400/30 text-green-400 placeholder:text-green-400/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-mono text-green-400/70">CAMPAIGN CONTENT</label>
                  <Textarea 
                    placeholder="Enter your campaign content..."
                    className="bg-black/50 border-green-400/30 text-green-400 placeholder:text-green-400/50 min-h-[100px]"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button className="bg-green-400/20 hover:bg-green-400/30 text-green-400 border border-green-400/30">
                    <Clock className="h-4 w-4 mr-2" />
                    SCHEDULE
                  </Button>
                  <Button variant="outline" className="border-green-400/30 text-green-400 hover:bg-green-400/10">
                    <Eye className="h-4 w-4 mr-2" />
                    PREVIEW
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Status */}
            <Card className="bg-black/50 border-green-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400 font-mono">
                  <Activity className="h-5 w-5" />
                  CAMPAIGN STATUS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-green-400/70 text-sm font-mono">
                    NO ACTIVE CAMPAIGNS
                  </p>
                  <p className="text-green-400/50 text-xs mt-1">
                    Schedule your first campaign to see status updates here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card className="bg-black/50 border-green-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400 font-mono">
                  <User className="h-5 w-5" />
                  AGENT PROFILE
                </CardTitle>
                <CardDescription className="text-green-400/70">
                  Manage your profile and system preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-green-400/70">FIRST NAME</label>
                    <Input 
                      value={user?.firstName || ""}
                      readOnly
                      className="bg-black/50 border-green-400/30 text-green-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-green-400/70">EMAIL</label>
                    <Input 
                      value={user?.emailAddresses[0]?.emailAddress || ""}
                      readOnly
                      className="bg-black/50 border-green-400/30 text-green-400"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-mono text-green-400/70">SECURITY CLEARANCE</label>
                  <Badge variant="outline" className="border-green-400/30 text-green-400">
                    LEVEL 1 - AUTHORIZED
                  </Badge>
                </div>
                
                <div className="pt-4 border-t border-green-400/20">
                  <p className="text-xs text-green-400/70 font-mono">
                    SYSTEM STATUS: OPERATIONAL
                  </p>
                  <p className="text-xs text-green-400/50 mt-1">
                    All systems functioning within normal parameters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
