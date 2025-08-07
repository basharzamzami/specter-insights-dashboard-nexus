import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Clock, 
  Target, 
  Zap,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export const IntelligenceFeed = () => {
  const [feedData, setFeedData] = useState([
    {
      id: 1,
      type: 'threat',
      title: 'Competitor Ad Spend Surge',
      description: 'TechCorp has increased their ad spend by 340% in the last 7 days. Targeting your key demographics.',
      priority: 'high',
      timestamp: '2 minutes ago',
      source: 'Facebook Ads Intelligence',
      actionable: true,
      metric: '+340%'
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'Vulnerability in DataFlow Inc\'s Pricing',
      description: 'DataFlow Inc has a pricing vulnerability. Capitalize on this by offering more competitive rates.',
      priority: 'medium',
      timestamp: '15 minutes ago',
      source: 'Market Analysis',
      actionable: true,
      metric: 'Competitive Pricing'
    },
    {
      id: 3,
      type: 'update',
      title: 'CloudMaster Launches New Security Feature',
      description: 'CloudMaster has launched a new security feature. Evaluate and consider similar enhancements.',
      priority: 'low',
      timestamp: '30 minutes ago',
      source: 'Industry News',
      actionable: false,
      metric: 'Security Enhancement'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Social Sentiment Drop for Competitor',
      description: 'Social sentiment for a competitor has dropped. Investigate and leverage for marketing.',
      priority: 'high',
      timestamp: '45 minutes ago',
      source: 'Social Media Monitoring',
      actionable: true,
      metric: 'Sentiment Drop'
    },
    {
      id: 5,
      type: 'opportunity',
      title: 'Untapped Market Segment Identified',
      description: 'An untapped market segment has been identified. Explore and target with tailored campaigns.',
      priority: 'medium',
      timestamp: '1 hour ago',
      source: 'Market Research',
      actionable: true,
      metric: 'New Market Segment'
    },
    {
      id: 6,
      type: 'update',
      title: 'Regulatory Change Impacting Competitors',
      description: 'A regulatory change is impacting competitors. Adapt strategies to maintain compliance.',
      priority: 'low',
      timestamp: '2 hours ago',
      source: 'Regulatory News',
      actionable: false,
      metric: 'Regulatory Compliance'
    },
    {
      id: 7,
      type: 'threat',
      title: 'Competitor Product Update',
      description: 'A competitor has released a significant product update. Analyze and plan response.',
      priority: 'high',
      timestamp: '3 hours ago',
      source: 'Product Monitoring',
      actionable: true,
      metric: 'Product Update'
    },
    {
      id: 8,
      type: 'opportunity',
      title: 'Partnership Opportunity',
      description: 'A partnership opportunity has emerged. Evaluate and consider collaboration.',
      priority: 'medium',
      timestamp: '4 hours ago',
      source: 'Business Development',
      actionable: true,
      metric: 'Partnership'
    },
    {
      id: 9,
      type: 'update',
      title: 'Industry Conference',
      description: 'An industry conference is approaching. Plan attendance and networking.',
      priority: 'low',
      timestamp: '5 hours ago',
      source: 'Industry Events',
      actionable: false,
      metric: 'Industry Conference'
    },
    {
      id: 10,
      type: 'alert',
      title: 'Competitor Pricing Strategy Change',
      description: 'A competitor has changed their pricing strategy. Analyze and adjust pricing.',
      priority: 'high',
      timestamp: '6 hours ago',
      source: 'Pricing Intelligence',
      actionable: true,
      metric: 'Pricing Change'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useUser();

  const fetchIntelligenceFeed = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('intelligence-feed', {
        body: { 
          userId: user?.id,
          timeframe: '7d',
          sources: ['facebook', 'semrush', 'reviews']
        }
      });

      if (data && !error) {
        setFeedData(data.feed || []);
      }
    } catch (error) {
      console.error('Error fetching intelligence feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteResponse = async (feedId: number, action: string) => {
    console.log(`Executing ${action} for feed item ${feedId}`);
    // Implementation would handle different response actions
  };

  useEffect(() => {
    fetchIntelligenceFeed();
  }, [user?.id]);

  const filteredFeed = activeTab === 'all' ? feedData : feedData.filter(item => item.type === activeTab);

  return (
    <Card className="col-span-2 bg-background/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Intelligence Feed</CardTitle>
        <CardDescription>
          Stay ahead with real-time insights on threats, opportunities, and market updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="threat">Threats</TabsTrigger>
            <TabsTrigger value="opportunity">Opportunities</TabsTrigger>
            <TabsTrigger value="update">Updates</TabsTrigger>
          </TabsList>
          <div className="overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Loading intelligence...
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredFeed.map((item) => (
                  <div key={item.id} className="py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {item.type === 'threat' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {item.type === 'opportunity' && <Target className="h-4 w-4 text-green-500" />}
                        {item.type === 'update' && <Bell className="h-4 w-4 text-blue-500" />}
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{item.timestamp}</span>
                      </div>
                    </div>
                    <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
                    <div className="mt-2 flex flex-wrap space-x-2">
                      <Badge variant="secondary">{item.source}</Badge>
                      {item.metric && <Badge variant="outline">Metric: {item.metric}</Badge>}
                      {item.actionable && (
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {filteredFeed.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No intelligence items found for the selected filters.
                  </div>
                )}
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
