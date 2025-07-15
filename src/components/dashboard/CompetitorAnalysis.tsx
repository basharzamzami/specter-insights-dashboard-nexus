import { useState } from "react";
import { Search, Loader2, TrendingUp, TrendingDown, Minus, ExternalLink, Target, Zap, Shield, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SentimentData {
  id: string;
  url: string;
  name: string;
  sentimentScore: number;
  keyTopics: string[];
  recommendation: string;
  lastUpdated: string;
  vulnerabilities: string[];
  estimatedAdSpend: string;
  topKeywords: string[];
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: "seo" | "ads" | "social" | "content";
  difficulty: "easy" | "medium" | "hard";
  impact: "low" | "medium" | "high";
}

const mockSentimentData: SentimentData[] = [
  {
    id: "1",
    url: "competitor1.com",
    name: "TechCorp",
    sentimentScore: 0.75,
    keyTopics: ["Innovation", "Customer Service", "Pricing"],
    recommendation: "Focus on highlighting superior customer support and competitive pricing strategies.",
    lastUpdated: "2 hours ago",
    vulnerabilities: ["Slow customer support response", "High pricing tier", "Limited integration options"],
    estimatedAdSpend: "$45K/month",
    topKeywords: ["enterprise software", "business automation", "cloud solutions"]
  },
  {
    id: "2", 
    url: "competitor2.com",
    name: "DataSolutions",
    sentimentScore: 0.45,
    keyTopics: ["Product Quality", "Support Issues", "Reliability"],
    recommendation: "Opportunity to capitalize on their support challenges. Emphasize reliability and responsiveness.",
    lastUpdated: "4 hours ago",
    vulnerabilities: ["Frequent downtime", "Poor documentation", "Outdated UI design"],
    estimatedAdSpend: "$28K/month",
    topKeywords: ["data analytics", "reporting tools", "business intelligence"]
  },
  {
    id: "3",
    url: "competitor3.com", 
    name: "CloudInnovate",
    sentimentScore: 0.85,
    keyTopics: ["AI Features", "Integration", "User Experience"],
    recommendation: "Strong competitor. Consider enhancing AI capabilities and improving user experience design.",
    lastUpdated: "6 hours ago",
    vulnerabilities: ["High learning curve", "Expensive enterprise tier", "Limited mobile access"],
    estimatedAdSpend: "$67K/month",
    topKeywords: ["AI automation", "machine learning", "predictive analytics"]
  }
];

const getActionItems = (competitor: SentimentData): ActionItem[] => [
  {
    id: "1",
    title: "Exploit SEO Weakness",
    description: `Target their underperforming keywords: ${competitor.topKeywords.join(", ")}`,
    type: "seo",
    difficulty: "medium",
    impact: "high"
  },
  {
    id: "2", 
    title: "Launch Counter-Campaign",
    description: "Create ads highlighting their vulnerabilities while showcasing our strengths",
    type: "ads",
    difficulty: "easy",
    impact: "medium"
  },
  {
    id: "3",
    title: "Social Sentiment Attack",
    description: "Amplify customer complaints and position ourselves as the reliable alternative",
    type: "social",
    difficulty: "hard",
    impact: "high"
  },
  {
    id: "4",
    title: "Content Hijacking",
    description: "Create superior content targeting their main topics and keywords",
    type: "content",
    difficulty: "medium",
    impact: "medium"
  }
];

export const CompetitorAnalysis = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>(mockSentimentData);
  const [selectedCompetitor, setSelectedCompetitor] = useState<SentimentData | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newData: SentimentData = {
        id: Date.now().toString(),
        url: inputValue,
        name: inputValue.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
        sentimentScore: Math.random(),
        keyTopics: ["Brand Perception", "Market Position", "Customer Feedback"],
        recommendation: "New competitor analysis complete. Monitor their marketing strategies and customer engagement.",
        lastUpdated: "Just now",
        vulnerabilities: ["Market research pending", "Analysis in progress", "Data collection active"],
        estimatedAdSpend: "Calculating...",
        topKeywords: ["analysis pending", "data gathering", "initial scan"]
      };
      
      setSentimentData(prev => [newData, ...prev]);
      setInputValue("");
      setIsLoading(false);
    }, 3000);
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return "success";
    if (score >= 0.4) return "warning";
    return "destructive";
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 0.7) return <TrendingUp className="h-4 w-4" />;
    if (score >= 0.4) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 0.7) return "Positive";
    if (score >= 0.4) return "Neutral";
    return "Negative";
  };

  const handleTakeAction = (competitor: SentimentData) => {
    setSelectedCompetitor(competitor);
    setIsActionDialogOpen(true);
  };

  const executeAction = (action: ActionItem) => {
    toast({
      title: "Action Initiated",
      description: `${action.title} has been launched against ${selectedCompetitor?.name}`,
    });
    setIsActionDialogOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "success";
      case "medium": return "warning"; 
      case "hard": return "destructive";
      default: return "secondary";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low": return "secondary";
      case "medium": return "warning";
      case "high": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Competitor Analysis</h2>
          <p className="text-muted-foreground">Monitor competitor sentiment and market positioning</p>
        </div>
      </div>

      {/* Input Form */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Add Competitor</span>
          </CardTitle>
          <CardDescription>
            Enter a competitor URL or keywords to analyze their market sentiment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Input
              placeholder="Enter competitor URL or keywords..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={isLoading || !inputValue.trim()}
              className="btn-glow px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Run Analysis"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Analysis Cards */}
      <div className="grid gap-4">
        {sentimentData.map((data, index) => (
          <Card 
            key={data.id} 
            className={`card-hover slide-in animate-delay-${(index % 4) * 100}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-lg">{data.name}</CardTitle>
                  <Badge 
                    variant="outline"
                    className={`flex items-center space-x-1 ${
                      getSentimentColor(data.sentimentScore) === 'success' ? 'border-success text-success' :
                      getSentimentColor(data.sentimentScore) === 'warning' ? 'border-warning text-warning' :
                      'border-destructive text-destructive'
                    }`}
                  >
                    {getSentimentIcon(data.sentimentScore)}
                    <span>{getSentimentLabel(data.sentimentScore)}</span>
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <ExternalLink className="h-4 w-4" />
                  <span>{data.url}</span>
                </div>
              </div>
              <CardDescription>
                Last updated: {data.lastUpdated}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sentiment Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sentiment Score</span>
                    <span className="text-sm font-bold">{(data.sentimentScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        getSentimentColor(data.sentimentScore) === 'success' ? 'bg-success' :
                        getSentimentColor(data.sentimentScore) === 'warning' ? 'bg-warning' :
                        'bg-destructive'
                      }`}
                      style={{ width: `${data.sentimentScore * 100}%` }}
                    />
                  </div>
                </div>

                {/* Key Topics */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.keyTopics.map((topic, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Strategic Recommendation */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Strategic Recommendation</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.recommendation}
                  </p>
                </div>

                {/* Intelligence Profile */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-2">TOP VULNERABILITIES</h5>
                    <div className="space-y-1">
                      {data.vulnerabilities.slice(0, 2).map((vuln, i) => (
                        <p key={i} className="text-xs text-destructive">• {vuln}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-2">AD SPEND</h5>
                    <p className="text-sm font-bold text-primary">{data.estimatedAdSpend}</p>
                    <h5 className="text-xs font-medium text-muted-foreground mb-1 mt-2">TOP KEYWORDS</h5>
                    <p className="text-xs">{data.topKeywords.slice(0, 2).join(", ")}</p>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => handleTakeAction(data)}
                  className="w-full btn-glow"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Launch Strategic Action
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Strategic Actions - {selectedCompetitor?.name}
            </DialogTitle>
            <DialogDescription>
              Select and execute targeted operations to disrupt competitor advantages
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompetitor && (
            <div className="space-y-4">
              {/* Intelligence Summary */}
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-destructive">{selectedCompetitor.vulnerabilities.length}</p>
                      <p className="text-xs text-muted-foreground">Vulnerabilities</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{selectedCompetitor.estimatedAdSpend}</p>
                      <p className="text-xs text-muted-foreground">Monthly Ad Spend</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning">{(selectedCompetitor.sentimentScore * 100).toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground">Sentiment Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Cards */}
              <div className="grid gap-3">
                {getActionItems(selectedCompetitor).map((action) => (
                  <Card key={action.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{action.title}</h4>
                            <Badge variant={getDifficultyColor(action.difficulty) as any} className="text-xs">
                              {action.difficulty}
                            </Badge>
                            <Badge variant={getImpactColor(action.impact) as any} className="text-xs">
                              {action.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => executeAction(action)}
                          className="ml-4"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Execute
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
    </div>
  );
};