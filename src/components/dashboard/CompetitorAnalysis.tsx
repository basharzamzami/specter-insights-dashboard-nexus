import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Clock, 
  RefreshCw,
  ExternalLink,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCompetitorProfiles } from '@/hooks/useCompetitorProfiles';
import { supabase } from '@/integrations/supabase/client';

export const CompetitorAnalysis = () => {
  const { user } = useUser();
  const {
    competitors,
    loading: competitorsLoading,
    refreshCompetitorData,
  } = useCompetitorProfiles();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState({
    threats: 0,
    opportunities: 0,
    adSpend: 0,
    sentiment: 0
  });

  useEffect(() => {
    if (competitors.length > 0) {
      const threats = competitors.filter(c => c.sentiment_score && c.sentiment_score < 0.4).length;
      const opportunities = competitors.filter(c => c.vulnerabilities && c.vulnerabilities.length > 0).length;
      const totalAdSpend = competitors.reduce((sum, c) => sum + (c.estimated_ad_spend || 0), 0);
      const avgSentiment = competitors.reduce((sum, c) => sum + (c.sentiment_score || 0), 0) / competitors.length;

      setIntelligenceData({
        threats,
        opportunities,
        adSpend: totalAdSpend,
        sentiment: avgSentiment
      });
    }
  }, [competitors]);

  const fetchCompetitorIntelligence = async () => {
    if (!user?.id) return;

    setIsRefreshing(true);
    try {
      // Fetch Facebook Ads Intelligence
      const facebookResponse = await supabase.functions.invoke('facebook-ads-intelligence', {
        body: { 
          userId: user.id,
          competitors: competitors.map(c => c.company_name)
        }
      });

      // Fetch Reviews Sentiment Analysis  
      const reviewsResponse = await supabase.functions.invoke('reviews-sentiment-analysis', {
        body: { 
          userId: user.id,
          competitors: competitors.map(c => ({ 
            name: c.company_name, 
            website: c.website 
          }))
        }
      });

      await refreshCompetitorData();
    } catch (error) {
      console.error('Error fetching competitor intelligence:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // AI-powered competitor profile generation
  const generateCompetitorProfile = async (competitorName: string) => {
    try {
      const aiResponse = await supabase.functions.invoke('competitor-intelligence', {
        body: { 
          userId: user?.id,
          competitorName,
          analysisType: 'comprehensive'
        }
      });

      console.log('AI Analysis:', aiResponse);
    } catch (error) {
      console.error('Error generating competitor profile:', error);
    }
  };

  return (
    <Card className="bg-background/90 backdrop-blur-md border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Competitor Analysis</CardTitle>
        <Zap className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-row items-center justify-between space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <div className="space-y-0.5 text-right">
              <p className="text-lg font-semibold">{intelligenceData.threats}</p>
              <p className="text-muted-foreground text-sm">Threats Detected</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between space-x-2">
            <Target className="h-4 w-4 text-yellow-500" />
            <div className="space-y-0.5 text-right">
              <p className="text-lg font-semibold">{intelligenceData.opportunities}</p>
              <p className="text-muted-foreground text-sm">Opportunities Found</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div className="space-y-0.5 text-right">
              <p className="text-lg font-semibold">${intelligenceData.adSpend.toFixed(2)}</p>
              <p className="text-muted-foreground text-sm">Est. Ad Spend</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between space-x-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <div className="space-y-0.5 text-right">
              <p className="text-lg font-semibold">{(intelligenceData.sentiment * 100).toFixed(0)}%</p>
              <p className="text-muted-foreground text-sm">Avg. Sentiment</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CardDescription>
            Track competitor performance and identify key areas for improvement.
          </CardDescription>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Your Competitors</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchCompetitorIntelligence}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Intelligence
                </>
              )}
            </Button>
          </div>
          <div className="mt-2 space-y-3">
            {competitors.map((competitor) => (
              <Card key={competitor.id} className="bg-secondary/90 border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{competitor.company_name}</CardTitle>
                  <div className="flex space-x-2">
                    {competitor.website && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                          <ExternalLink className="h-4 w-4" />
                          <span>Visit</span>
                        </a>
                      </Button>
                    )}
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      Updated 2m ago
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Sentiment Score</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-lg font-semibold">{(competitor.sentiment_score || 0).toFixed(2)}</p>
                        {competitor.sentiment_score && (
                          <>
                            {competitor.sentiment_score > 0.7 ? <TrendingUp className="h-4 w-4 text-green-500" /> : null}
                            {competitor.sentiment_score < 0.4 ? <AlertTriangle className="h-4 w-4 text-red-500" /> : null}
                          </>
                        )}
                      </div>
                      <Progress value={(competitor.sentiment_score || 0) * 100} className="h-2" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Vulnerabilities</p>
                      {competitor.vulnerabilities && competitor.vulnerabilities.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {competitor.vulnerabilities.map((vuln, index) => (
                            <li key={index} className="text-sm">{vuln}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm">No vulnerabilities found.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
