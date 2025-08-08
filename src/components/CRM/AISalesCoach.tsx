
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  Star,
  BarChart3,
  Bot,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SalesInsight {
  id: number;
  type: string;
  text: string;
  confidence: number;
  source: string;
  impact: number;
}

interface SalesTip {
  id: number;
  tip: string;
  category: string;
  rating: number;
}

export const AISalesCoach = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('insights');
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState('');
  const [salesInsights] = useState<SalesInsight[]>([
    {
      id: 1,
      type: 'Market Trend',
      text: 'Growing demand for AI-driven solutions in the healthcare sector.',
      confidence: 85,
      source: 'Industry Report',
      impact: 8
    },
    {
      id: 2,
      type: 'Competitor Weakness',
      text: 'Competitor X facing customer service issues, opportunity to capitalize.',
      confidence: 78,
      source: 'Social Media Analysis',
      impact: 7
    },
    {
      id: 3,
      type: 'Lead Opportunity',
      text: 'Potential lead identified in the fintech space, high growth potential.',
      confidence: 92,
      source: 'Lead Generation Tool',
      impact: 9
    }
  ]);
  const [salesTips] = useState<SalesTip[]>([
    {
      id: 1,
      tip: 'Focus on building rapport with potential clients.',
      category: 'Communication',
      rating: 4
    },
    {
      id: 2,
      tip: 'Highlight the unique value proposition of your product.',
      category: 'Sales Strategy',
      rating: 5
    },
    {
      id: 3,
      tip: 'Address customer concerns proactively.',
      category: 'Customer Service',
      rating: 4
    }
  ]);

  const handleAnalysis = async () => {
    if (!query.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter a query to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisResults(`AI analysis complete for query: ${query}. Key insights: Increased engagement by 30%, positive sentiment by 15%.`);
      setIsAnalyzing(false);
      
      toast({
        title: 'Analysis Complete',
        description: `AI analysis for "${query}" has been processed.`,
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            AI Sales Coach
          </CardTitle>
          <CardDescription>
            Get AI-powered insights and tips to boost your sales performance
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary/50 border border-secondary/50">
          <TabsTrigger value="insights" className="data-[state=active]:bg-secondary/70">
            <BarChart3 className="h-4 w-4 mr-2" />
            Sales Insights
          </TabsTrigger>
          <TabsTrigger value="tips" className="data-[state=active]:bg-secondary/70">
            <Lightbulb className="h-4 w-4 mr-2" />
            Sales Tips
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-secondary/70">
            <Bot className="h-4 w-4 mr-2" />
            AI Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {salesInsights.map((insight) => (
              <Card key={insight.id} className="bg-card/90 backdrop-blur-sm border hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {insight.type}
                    </CardTitle>
                    <Badge>
                      {insight.confidence}% Confidence
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Source: {insight.source}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{insight.text}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Impact Level</div>
                    <Progress value={insight.impact * 10} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {salesTips.map((tip) => (
              <Card key={tip.id} className="bg-card/90 backdrop-blur-sm border hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {tip.category}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {[...Array(tip.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{tip.tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-card/90 backdrop-blur-sm border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI-Powered Analysis
              </CardTitle>
              <CardDescription>
                Enter a query to get AI-powered analysis and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isAnalyzing}
                />
                <Button 
                  onClick={handleAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze'
                  )}
                </Button>
              </div>
              {isAnalyzing && (
                <div className="space-y-2">
                  <Progress value={66} className="h-2" />
                  <p className="text-sm text-muted-foreground">Processing intelligence data...</p>
                </div>
              )}
              {analysisResults && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Analysis Results:</p>
                  <Textarea
                    value={analysisResults}
                    readOnly
                    className="bg-secondary/50 border-none focus-visible:ring-0"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
