import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin,
  Target,
  Search,
  Eye
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

interface DominanceData {
  id: number;
  region: string;
  dominanceScore: number;
  marketPosition: number;
  metrics: {
    customerSatisfaction: number;
    brandAwareness: number;
    marketShare: number;
  };
  opportunities: string[];
  threats: string[];
}

export const DominanceMapDashboard = () => {
  const [dominanceData] = useState<DominanceData[]>([
    {
      id: 1,
      region: 'North America',
      dominanceScore: 75,
      marketPosition: 1,
      metrics: {
        customerSatisfaction: 88,
        brandAwareness: 92,
        marketShare: 35,
      },
      opportunities: [
        'Expand into new market segments',
        'Increase brand loyalty through customer engagement',
      ],
      threats: ['Increased competition', 'Changing consumer preferences'],
    },
    {
      id: 2,
      region: 'Europe',
      dominanceScore: 60,
      marketPosition: 2,
      metrics: {
        customerSatisfaction: 82,
        brandAwareness: 85,
        marketShare: 28,
      },
      opportunities: [
        'Form strategic partnerships',
        'Invest in localized marketing campaigns',
      ],
      threats: ['Economic downturn', 'Regulatory changes'],
    },
    {
      id: 3,
      region: 'Asia Pacific',
      dominanceScore: 45,
      marketPosition: 3,
      metrics: {
        customerSatisfaction: 78,
        brandAwareness: 80,
        marketShare: 20,
      },
      opportunities: [
        'Enter emerging markets',
        'Adapt products to local needs',
      ],
      threats: ['Intense price competition', 'Supply chain disruptions'],
    },
  ]);
  const { user } = useUser();
  const { toast } = useToast();

  const fetchDominanceData = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Dominance Data Updated",
        description: "Successfully fetched the latest dominance data.",
      });
    } catch (error) {
      toast({
        title: "Error Fetching Data",
        description: "Failed to fetch dominance data. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDominanceData();
  }, [user?.id, toast]);

  const getDominanceColor = (value: number) => {
    if (value >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (value >= 60) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (value >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            Dominance Map
          </CardTitle>
          <CardDescription>
            Visualize market dominance across key regions and identify strategic opportunities
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Regional Analysis</TabsTrigger>
          <TabsTrigger value="strategy">Strategic Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dominanceData.map((region) => (
              <Card key={region.id} className="bg-card/90 backdrop-blur-sm border hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {region.region}
                    </CardTitle>
                    <Badge className={getDominanceColor(region.dominanceScore)}>
                      {region.dominanceScore}% Dominance
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Market Position: #{region.marketPosition}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Customer Satisfaction</p>
                      <Progress value={region.metrics.customerSatisfaction} className="h-2" />
                      <div className="text-xs text-right">{region.metrics.customerSatisfaction}%</div>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Brand Awareness</p>
                      <Progress value={region.metrics.brandAwareness} className="h-2" />
                      <div className="text-xs text-right">{region.metrics.brandAwareness}%</div>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Market Share</p>
                      <Progress value={region.metrics.marketShare} className="h-2" />
                      <div className="text-xs text-right">{region.metrics.marketShare}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-xs uppercase text-muted-foreground">Opportunities</p>
                    <ul className="list-disc pl-4 text-sm">
                      {region.opportunities.map((opportunity, index) => (
                        <li key={index}>{opportunity}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Target className="h-4 w-4 mr-2" />
                      Focus Campaign
                    </Button>
                    <Button variant="outline">
                      Status
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze
                    </Button>
                    <Badge>
                      {region.threats.length} Threats
                    </Badge>
                  </div>

                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Analysis</CardTitle>
              <CardDescription>Deep dive into each region's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Detailed analysis and insights for each region will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
              <CardDescription>AI-driven strategic recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>AI-driven strategic recommendations for improving market dominance will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
