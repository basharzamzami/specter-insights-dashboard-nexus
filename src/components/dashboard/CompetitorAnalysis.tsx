import { useState } from "react";
import { Search, Loader2, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SentimentData {
  id: string;
  url: string;
  name: string;
  sentimentScore: number;
  keyTopics: string[];
  recommendation: string;
  lastUpdated: string;
}

const mockSentimentData: SentimentData[] = [
  {
    id: "1",
    url: "competitor1.com",
    name: "TechCorp",
    sentimentScore: 0.75,
    keyTopics: ["Innovation", "Customer Service", "Pricing"],
    recommendation: "Focus on highlighting superior customer support and competitive pricing strategies.",
    lastUpdated: "2 hours ago"
  },
  {
    id: "2", 
    url: "competitor2.com",
    name: "DataSolutions",
    sentimentScore: 0.45,
    keyTopics: ["Product Quality", "Support Issues", "Reliability"],
    recommendation: "Opportunity to capitalize on their support challenges. Emphasize reliability and responsiveness.",
    lastUpdated: "4 hours ago"
  },
  {
    id: "3",
    url: "competitor3.com", 
    name: "CloudInnovate",
    sentimentScore: 0.85,
    keyTopics: ["AI Features", "Integration", "User Experience"],
    recommendation: "Strong competitor. Consider enhancing AI capabilities and improving user experience design.",
    lastUpdated: "6 hours ago"
  }
];

export const CompetitorAnalysis = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>(mockSentimentData);

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
        lastUpdated: "Just now"
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};