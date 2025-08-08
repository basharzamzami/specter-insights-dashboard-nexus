import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Search,
  RefreshCw,
  Eye,
  Shield,
  Activity
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdSignal {
  id: number;
  keyword: string;
  volume: number;
  cpc: number;
  competition: number;
  trend: number;
  lastUpdated: string;
}

interface CompetitorAd {
  id: number;
  competitor: string;
  adCopy: string;
  url: string;
  keywords: string[];
  lastSeen: string;
}

export const AdHijackDashboard = () => {
  const [keywords, setKeywords] = useState<string>('');
  const [adSignals, setAdSignals] = useState<AdSignal[]>([
    {
      id: 1,
      keyword: 'cloud services',
      volume: 45000,
      cpc: 1.25,
      competition: 0.75,
      trend: 12,
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      keyword: 'data analytics',
      volume: 32000,
      cpc: 1.50,
      competition: 0.80,
      trend: -5,
      lastUpdated: '4 hours ago'
    },
    {
      id: 3,
      keyword: 'cybersecurity',
      volume: 28000,
      cpc: 1.75,
      competition: 0.85,
      trend: 8,
      lastUpdated: '6 hours ago'
    }
  ]);
  const [competitorAds, setCompetitorAds] = useState<CompetitorAd[]>([
    {
      id: 1,
      competitor: 'TechCorp',
      adCopy: 'Revolutionize your business with our cloud solutions. Free trial available!',
      url: 'techcorp.com/cloud',
      keywords: ['cloud services', 'cloud solutions', 'business cloud'],
      lastSeen: '1 hour ago'
    },
    {
      id: 2,
      competitor: 'DataFlow Inc',
      adCopy: 'Unlock insights with our advanced data analytics platform. Request a demo today.',
      url: 'dataflow.com/analytics',
      keywords: ['data analytics', 'analytics platform', 'business intelligence'],
      lastSeen: '3 hours ago'
    },
    {
      id: 3,
      competitor: 'SecureNet',
      adCopy: 'Protect your business with our comprehensive cybersecurity solutions. Contact us for a quote.',
      url: 'securenet.com/security',
      keywords: ['cybersecurity', 'security solutions', 'data protection'],
      lastSeen: '5 hours ago'
    }
  ]);
  const [activeTab, setActiveTab] = useState<string>('signals');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleKeywordAnalysis = async () => {
    if (!keywords.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter keywords to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newSignal = {
        id: Date.now(),
        keyword: keywords,
        volume: Math.floor(Math.random() * 50000),
        cpc: Math.random() * 2,
        competition: Math.random(),
        trend: Math.floor(Math.random() * 20) - 10,
        lastUpdated: "Just now"
      };
      
      setAdSignals([newSignal, ...adSignals]);
      setKeywords("");
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Keyword analysis for ${keywords} has been processed.`,
      });
    }, 3000);
  };

  const fetchAdSignals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ad-signals', {
        body: { 
          userId: user?.id,
          keywords: ['cloud services', 'data analytics', 'cybersecurity']
        }
      });

      if (data && !error) {
        setAdSignals(data.signals || []);
      }
    } catch (error) {
      console.error('Error fetching ad signals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompetitorAds = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('competitor-ads', {
        body: { 
          userId: user?.id,
          competitors: ['TechCorp', 'DataFlow Inc', 'SecureNet']
        }
      });

      if (data && !error) {
        setCompetitorAds(data.ads || []);
      }
    } catch (error) {
      console.error('Error fetching competitor ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdSignals();
    fetchCompetitorAds();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Target className="h-6 w-6 text-primary" />
            </div>
            Ad Signal Hijack
          </CardTitle>
          <CardDescription>
            Real-time competitive intelligence to dominate your market
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary/10 border border-secondary/30">
          <TabsTrigger value="signals" className="data-[state=active]:bg-secondary/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Ad Signals
          </TabsTrigger>
          <TabsTrigger value="competitors" className="data-[state=active]:bg-secondary/20">
            <Shield className="h-4 w-4 mr-2" />
            Competitor Ads
          </TabsTrigger>
          <TabsTrigger value="hijack" className="data-[state=active]:bg-secondary/20">
            <Zap className="h-4 w-4 mr-2" />
            Hijack Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="space-y-6">
          <Card className="bg-card/90 backdrop-blur-sm border">
            <CardHeader>
              <CardTitle className="text-lg">Keyword Analysis</CardTitle>
              <CardDescription>
                Enter keywords to analyze their search volume, CPC, and competition.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keywords..."
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="bg-background/80 border-input text-foreground placeholder:text-muted-foreground"
                  disabled={isAnalyzing}
                />
                <Button 
                  onClick={handleKeywordAnalysis}
                  disabled={isAnalyzing}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Analyze
                    </div>
                  )}
                </Button>
              </div>
              {isAnalyzing && (
                <div className="space-y-2">
                  <Progress value={66} className="h-2" />
                  <p className="text-sm text-muted-foreground">Processing keyword data...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center">
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Loading signals...
              </div>
            ) : (
              adSignals.map((signal) => (
                <Card key={signal.id} className="bg-card/90 backdrop-blur-sm border hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{signal.keyword}</CardTitle>
                      <Badge variant="secondary">
                        {signal.trend > 0 ? (
                          <>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {signal.trend}%
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {signal.trend}%
                          </>
                        )}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      Last updated: {signal.lastUpdated}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Volume</span>
                        <span>{signal.volume.toLocaleString()}</span>
                      </div>
                      <Progress value={signal.volume / 50000 * 100} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CPC</span>
                      <span>${signal.cpc.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Competition</span>
                      <span>{signal.competition.toFixed(2)}</span>
                    </div>
                    <Button className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center">
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Loading competitor ads...
              </div>
            ) : (
              competitorAds.map((ad) => (
                <Card key={ad.id} className="bg-card/90 backdrop-blur-sm border hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{ad.competitor}</CardTitle>
                      <Badge variant="outline">
                        Last seen: {ad.lastSeen}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      Keywords: {ad.keywords.join(', ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{ad.adCopy}</p>
                    <Button className="w-full" asChild>
                      <a href={ad.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <Eye className="h-4 w-4 mr-2" />
                        View Ad
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="hijack" className="space-y-6">
          <Card className="bg-card/90 backdrop-blur-sm border">
            <CardHeader>
              <CardTitle className="text-lg">Hijack Campaigns</CardTitle>
              <CardDescription>
                Automated campaign creation to target competitor keywords and customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                This feature is under development. Stay tuned for updates!
              </p>
              <Button disabled>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Campaigns
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
