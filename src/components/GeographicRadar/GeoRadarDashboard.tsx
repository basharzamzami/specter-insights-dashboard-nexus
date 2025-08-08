import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Radar,
  MapPin,
  Target,
  TrendingUp,
  Activity,
  Search,
  Eye,
  RefreshCw,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeoLocation {
  id: number;
  location: string;
  marketShare: number;
  population: number;
  competitionLevel: string;
  opportunities: Opportunity[];
  threats: Threat[];
}

interface Opportunity {
  type: string;
  priority: string;
  description: string;
  potentialROI: number;
}

interface Threat {
  type: string;
  severity: string;
  description: string;
}

export const GeoRadarDashboard = () => {
  const [geoData, setGeoData] = useState<GeoLocation[]>([
    {
      id: 1,
      location: 'New York City',
      marketShare: 22,
      population: 8419000,
      competitionLevel: 'High',
      opportunities: [
        {
          type: 'Partnership',
          priority: 'High',
          description: 'Strategic partnership with local tech incubator',
          potentialROI: 35
        }
      ],
      threats: [
        {
          type: 'Market Saturation',
          severity: 'Medium',
          description: 'High market saturation limits growth potential'
        }
      ]
    },
    {
      id: 2,
      location: 'Los Angeles',
      marketShare: 18,
      population: 3972000,
      competitionLevel: 'Medium',
      opportunities: [
        {
          type: 'Expansion',
          priority: 'High',
          description: 'Untapped market segment in sustainable tech',
          potentialROI: 40
        }
      ],
      threats: [
        {
          type: 'Regulatory Changes',
          severity: 'Low',
          description: 'Potential regulatory changes impacting operations'
        }
      ]
    },
    {
      id: 3,
      location: 'Chicago',
      marketShare: 12,
      population: 2706000,
      competitionLevel: 'Medium',
      opportunities: [
        {
          type: 'Acquisition',
          priority: 'Medium',
          description: 'Acquisition of struggling competitor',
          potentialROI: 25
        }
      ],
      threats: [
        {
          type: 'Economic Downturn',
          severity: 'High',
          description: 'Potential economic downturn affecting consumer spending'
        }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('radar');
  const { user } = useUser();
  const { toast } = useToast();

  const fetchGeoData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Geo data updated",
        description: "Successfully updated geographic radar data.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGeoData();
  }, [user?.id, toast]);

  const getOpportunityColor = (value: number) => {
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
              <Radar className="h-6 w-6 text-primary" />
            </div>
            Geographic Radar
          </CardTitle>
          <CardDescription>
            Real-time market analysis and opportunity detection across key regions
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="radar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="radar">Radar View</TabsTrigger>
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="radar" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {geoData.map((location) => (
              <Card key={location.id} className="bg-card/90 backdrop-blur-sm border hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {location.location}
                    </CardTitle>
                    <Badge>
                      {location.marketShare}% Share
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Population: {location.population.toLocaleString()} | 
                    Competition Level: {location.competitionLevel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {location.opportunities.map((opp, index) => (
                    <div key={index} className="bg-secondary/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge>
                            {opp.type}
                          </Badge>
                          <Badge className="text-xs">
                            {opp.priority} Priority
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{opp.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          ROI Potential: {opp.potentialROI}%
                        </span>
                        <Button className="text-xs">
                          Execute
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {location.threats.map((threat, index) => (
                    <div key={index} className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium">{threat.type}</span>
                        </div>
                        <Badge className={`text-xs ${
                          threat.severity === 'critical' 
                            ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                            : threat.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {threat.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{threat.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Market Analysis Tools</CardTitle>
              <CardDescription>Analyze market trends and identify key opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure geographic radar preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
