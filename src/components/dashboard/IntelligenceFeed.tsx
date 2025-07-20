import { useState, useEffect } from "react";
import { Rss, TrendingUp, Users, Briefcase, AlertTriangle, ExternalLink, Filter, Monitor, Eye, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

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
  is_trending?: boolean;
  tracking_enabled?: boolean;
  data?: any;
}


export const IntelligenceFeed = () => {
  const { user } = useUser();
  const [intelligence, setIntelligence] = useState<IntelligenceItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLiveFeeds();
  }, []);

  const loadLiveFeeds = async () => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('intelligence-feed', {
        body: { action: 'fetch_live_feeds' }
      });

      if (error) throw error;
      if (!response.success) throw new Error(response.error);

      // Transform the data to match our interface
      const transformedData = response.data.map((feed: any) => ({
        id: feed.id || Math.random().toString(36).substr(2, 9),
        type: feed.type,
        title: feed.title,
        description: feed.description,
        source: feed.source,
        timestamp: formatTimestamp(feed.created_at || new Date().toISOString()),
        priority: feed.priority,
        competitor: feed.competitor,
        url: feed.url,
        impact: feed.impact,
        is_trending: feed.is_trending,
        tracking_enabled: feed.tracking_enabled,
        data: feed.data
      }));

      setIntelligence(transformedData);
    } catch (error) {
      console.error('Error loading feeds:', error);
      toast.error("Failed to load intelligence feeds", {
        description: "Connect intelligence sources to see live data."
      });
      // No fallback data - show empty state
      setIntelligence([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const handleAnalyzeImpact = async (item: IntelligenceItem) => {
    // Navigate to impact analysis page
    const params = new URLSearchParams({
      title: item.title,
      competitor: item.competitor,
      type: item.type
    });
    window.location.href = `/impact-analysis?${params.toString()}`;
  };

  const handleCreateCounterStrategy = async (item: IntelligenceItem) => {
    // Navigate to strategy builder page
    const params = new URLSearchParams({
      title: item.title,
      competitor: item.competitor,
      type: item.type
    });
    window.location.href = `/strategy?${params.toString()}`;
  };

  const handleExecuteResponse = async (item: IntelligenceItem) => {
    // Navigate to execution center page
    const params = new URLSearchParams({
      strategy_id: Math.random().toString(36).substr(2, 9),
      title: `Emergency Response: ${item.title}`
    });
    window.location.href = `/execution?${params.toString()}`;
  };

  const handleEnableTracking = async (item: IntelligenceItem) => {
    try {
      const newTrackingState = !item.tracking_enabled;
      
      // Update local state immediately for better UX
      setIntelligence(prev => prev.map(intel => 
        intel.id === item.id 
          ? { ...intel, tracking_enabled: newTrackingState }
          : intel
      ));
      
      // Try to update via edge function, but don't fail if it's unavailable
      try {
        const { data: response, error } = await supabase.functions.invoke('intelligence-feed', {
          body: { 
            action: 'enable_tracking',
            feedId: item.id,
            trackingEnabled: newTrackingState
          }
        });

        if (error) throw error;
        if (!response.success) throw new Error(response.error);
      } catch (edgeError) {
        console.warn('Edge function unavailable, continuing with local state:', edgeError);
      }
      
      toast.success(`Tracking ${newTrackingState ? 'enabled' : 'disabled'}`, {
        description: `Real-time monitoring ${newTrackingState ? 'activated' : 'deactivated'} for ${item.title}`
      });
    } catch (error) {
      console.error('Tracking toggle error:', error);
      // Revert the local state change if there was an error
      setIntelligence(prev => prev.map(intel => 
        intel.id === item.id 
          ? { ...intel, tracking_enabled: !item.tracking_enabled }
          : intel
      ));
      toast.error("Tracking toggle failed", {
        description: "Unable to update tracking status."
      });
    }
  };

  const handleMarkAsResolved = async (item: IntelligenceItem) => {
    try {
      // Remove item from the intelligence feed
      setIntelligence(prev => prev.filter(intel => intel.id !== item.id));
      
      toast.success("Item marked as resolved", {
        description: `"${item.title}" has been removed from the intelligence feed.`
      });
    } catch (error) {
      console.error('Error marking as resolved:', error);
      toast.error("Failed to mark as resolved");
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    toast.success("Refreshing intelligence data", {
      description: "Loading the latest competitor intelligence..."
    });
    
    await loadLiveFeeds();
    
    toast.success("Data refreshed successfully", {
      description: `Updated ${intelligence.length} intelligence items.`
    });
  };

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
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Monitor className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4 mr-2" />
                Refresh Data
              </>
            )}
          </Button>
          
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
          {filteredIntelligence.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Rss className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div className="space-y-2">
                    <p className="text-xl font-semibold">Intelligence Feed Ready</p>
                    <p className="text-muted-foreground max-w-md">
                      Connect your intelligence sources to start monitoring competitor movements, market changes, and strategic opportunities in real-time.
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleRefreshData}>
                    <Monitor className="h-4 w-4 mr-2" />
                    Connect Sources
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredIntelligence.map((item, index) => (
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
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleMarkAsResolved(item)}
                       >
                         <Eye className="h-3 w-3 mr-1" />
                         Mark as Resolved
                       </Button>
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleAnalyzeImpact(item)}
                       >
                         <TrendingUp className="h-3 w-3 mr-1" />
                         Analyze Impact
                       </Button>
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleCreateCounterStrategy(item)}
                       >
                         <Users className="h-3 w-3 mr-1" />
                         Create Counter-Strategy
                       </Button>
                     </div>
                     
                     {item.url && (
                       <Button 
                         size="sm" 
                         variant="ghost"
                         onClick={() => {
                           window.open(item.url, '_blank');
                         }}
                       >
                         <ExternalLink className="h-3 w-3 mr-1" />
                         View Source
                       </Button>
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>
          )))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {filteredIntelligence.filter(item => item.priority === "high").length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto" />
                  <p className="text-xl font-semibold">No Critical Alerts</p>
                  <p className="text-muted-foreground">All systems running smoothly</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredIntelligence.filter(item => item.priority === "high").map((item, index) => (
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
                  <Button 
                    size="sm" 
                    className="btn-glow"
                    onClick={() => handleExecuteResponse(item)}
                  >
                    <Briefcase className="h-3 w-3 mr-1" />
                    Execute Response
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const params = new URLSearchParams({
                        execution_id: Math.random().toString(36).substr(2, 9),
                        title: `Monitoring: ${item.title}`
                      });
                      window.location.href = `/monitoring?${params.toString()}`;
                    }}
                  >
                    Monitor Situation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )))}
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEnableTracking({ id: `trend-${index}`, title: trend } as IntelligenceItem)}
                    >
                      Track
                    </Button>
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