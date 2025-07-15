import { useState, useEffect } from "react";
import { Rss, TrendingUp, Users, Briefcase, AlertTriangle, ExternalLink, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IntelligenceItem {
  id: string;
  type: "news" | "hiring" | "product" | "review" | "social" | "financial";
  title: string;
  description: string;
  source: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  competitor: string;
  url?: string;
  impact: "positive" | "negative" | "neutral";
}

const mockIntelligence: IntelligenceItem[] = [
  {
    id: "1",
    type: "hiring",
    title: "TechCorp hiring 15 Senior Engineers",
    description: "Mass hiring spree indicates potential new product launch or scaling issues. Focus areas: AI/ML, Cloud Infrastructure.",
    source: "LinkedIn Intelligence",
    timestamp: "2 hours ago",
    priority: "high",
    competitor: "TechCorp",
    impact: "negative",
    url: "https://linkedin.com/company/techcorp"
  },
  {
    id: "2",
    type: "review",
    title: "DataSolutions receives 1-star reviews surge",
    description: "Customer satisfaction dropping due to recent API changes. 23% increase in negative reviews this week.",
    source: "Review Monitor",
    timestamp: "4 hours ago",
    priority: "high",
    competitor: "DataSolutions",
    impact: "positive"
  },
  {
    id: "3",
    type: "product",
    title: "CloudInnovate announces AI integration",
    description: "New AI-powered analytics feature launching Q2. Direct threat to our core value proposition.",
    source: "Product Hunt",
    timestamp: "6 hours ago",
    priority: "high",
    competitor: "CloudInnovate",
    impact: "negative",
    url: "https://producthunt.com/posts/cloudinnovate-ai"
  },
  {
    id: "4",
    type: "financial",
    title: "StartupX raises $50M Series B",
    description: "Significant funding round led by tier-1 VCs. Expected to accelerate market expansion and R&D.",
    source: "TechCrunch",
    timestamp: "8 hours ago",
    priority: "medium",
    competitor: "StartupX",
    impact: "negative",
    url: "https://techcrunch.com/startupx-series-b"
  },
  {
    id: "5",
    type: "social",
    title: "Viral thread about TechCorp downtime",
    description: "Twitter thread by influential tech lead goes viral (50K+ interactions) discussing reliability issues.",
    source: "Social Monitor",
    timestamp: "12 hours ago",
    priority: "medium",
    competitor: "TechCorp",
    impact: "positive"
  },
  {
    id: "6",
    type: "news",
    title: "Industry report: Market consolidation expected",
    description: "Gartner predicts 40% of current players will be acquired or fail within 2 years. Opportunity for market capture.",
    source: "Gartner Research",
    timestamp: "1 day ago",
    priority: "medium",
    competitor: "Industry",
    impact: "neutral",
    url: "https://gartner.com/market-analysis"
  }
];

export const IntelligenceFeed = () => {
  const [intelligence, setIntelligence] = useState<IntelligenceItem[]>(mockIntelligence);
  const [filter, setFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "news": return "📰";
      case "hiring": return "👥";
      case "product": return "🚀";
      case "review": return "⭐";
      case "social": return "💬";
      case "financial": return "💰";
      default: return "🔍";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "success";
      case "negative": return "destructive";
      case "neutral": return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const filteredIntelligence = intelligence.filter(item => {
    if (filter !== "all" && item.type !== filter) return false;
    if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Rss className="h-6 w-6" />
            Intelligence Feed
          </h2>
          <p className="text-muted-foreground">AI-curated competitor movements and market intelligence</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="hiring">Hiring</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList>
          <TabsTrigger value="live">Live Feed</TabsTrigger>
          <TabsTrigger value="alerts">Critical Alerts</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {filteredIntelligence.map((item, index) => (
            <Card key={item.id} className={`card-hover animate-fade-in animate-delay-${(index % 4) * 100}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">{getTypeIcon(item.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant={getImpactColor(item.impact) as any} className="text-xs">
                          {item.impact}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                        <span>•</span>
                        <span className="font-medium">{item.competitor}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(item.priority) as any}>
                      {item.priority}
                    </Badge>
                    {item.priority === "high" && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Analyze Impact
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        Create Counter-Strategy
                      </Button>
                    </div>
                    
                    {item.url && (
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Source
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {filteredIntelligence.filter(item => item.priority === "high").map((item, index) => (
            <Card key={item.id} className="card-hover border-destructive/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                    <div className="flex-1">
                      <CardTitle className="text-lg text-destructive">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="destructive">CRITICAL</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" className="btn-glow">
                    <Briefcase className="h-3 w-3 mr-1" />
                    Execute Response
                  </Button>
                  <Button size="sm" variant="outline">
                    Monitor Situation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid gap-4">
            {["#AIAutomation trending with competitors", "Enterprise market shifts detected", "Customer sentiment analysis shows opportunity"].map((trend, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{trend}</p>
                      <p className="text-sm text-muted-foreground">Analysis available in 2 hours</p>
                    </div>
                    <Button size="sm" variant="outline">Track</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};