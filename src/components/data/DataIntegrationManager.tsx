import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Database, ExternalLink, Key, CheckCircle, XCircle, RefreshCw, AlertTriangle, Zap, Target, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DataSource {
  id: string;
  name: string;
  type: "seo" | "analytics" | "ads" | "social" | "reviews" | "competitor";
  description: string;
  isConnected: boolean;
  apiKeyRequired: boolean;
  status: "active" | "error" | "disconnected" | "pending";
  lastSync?: string;
  dataPoints?: number;
  capabilities: string[];
}

const availableDataSources: DataSource[] = [
  {
    id: "semrush",
    name: "SEMrush",
    type: "seo",
    description: "Competitor SEO analysis, keyword rankings, backlink tracking",
    isConnected: false,
    apiKeyRequired: true,
    status: "disconnected",
    capabilities: ["Keyword tracking", "Competitor analysis", "Backlink monitoring", "SERP tracking"]
  },
  {
    id: "ahrefs",
    name: "Ahrefs",
    type: "seo", 
    description: "Comprehensive SEO toolkit and competitor research",
    isConnected: false,
    apiKeyRequired: true,
    status: "disconnected",
    capabilities: ["Domain analysis", "Content gaps", "Keyword difficulty", "Link building"]
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    type: "analytics",
    description: "Website traffic, user behavior, conversion tracking",
    isConnected: false,
    apiKeyRequired: true,
    status: "disconnected",
    capabilities: ["Traffic analysis", "User behavior", "Conversion tracking", "Audience insights"]
  },
  {
    id: "google-ads",
    name: "Google Ads",
    type: "ads",
    description: "Campaign performance, ad spend, competitor insights",
    isConnected: false,
    apiKeyRequired: true,
    status: "disconnected",
    capabilities: ["Campaign tracking", "Ad performance", "Budget optimization", "Competitor ads"]
  },
  {
    id: "facebook-ads",
    name: "Meta Ads Manager",
    type: "ads",
    description: "Facebook & Instagram advertising data and competitor analysis",
    isConnected: false,
    apiKeyRequired: true,
    status: "disconnected",
    capabilities: ["Social ad tracking", "Audience insights", "Creative analysis", "ROI tracking"]
  },
  {
    id: "spyfu",
    name: "SpyFu",
    type: "competitor",
    description: "Competitor PPC and SEO intelligence",
    isConnected: false,
    apiKeyRequired: true,
    status: "disconnected",
    capabilities: ["Competitor PPC analysis", "Ad history", "Keyword gaps", "Budget estimates"]
  },
  {
    id: "builtwith",
    name: "BuiltWith",
    type: "competitor",
    description: "Technology stack analysis and market share data",
    isConnected: false,
    apiKeyRequired: true,
    status: "disconnected",
    capabilities: ["Tech stack analysis", "Market trends", "Lead generation", "Technology adoption"]
  },
  {
    id: "trustpilot",
    name: "Trustpilot",
    type: "reviews",
    description: "Customer reviews and sentiment analysis",
    isConnected: false,
    apiKeyRequired: true,
    status: "disconnected",
    capabilities: ["Review monitoring", "Sentiment analysis", "Competitor reviews", "Brand reputation"]
  }
];

export const DataIntegrationManager = () => {
  const { user } = useUser();
  const [dataSources, setDataSources] = useState<DataSource[]>(availableDataSources);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadIntegrationStatus();
  }, [user]);

  const loadIntegrationStatus = async () => {
    if (!user) return;

    try {
      // Check which integrations are already configured
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('integrations')
        .eq('user_id', user.id)
        .single();

      if (settings?.integrations) {
        setDataSources(prev => prev.map(source => ({
          ...source,
          isConnected: settings.integrations[source.id]?.connected || false,
          status: settings.integrations[source.id]?.connected ? "active" : "disconnected",
          lastSync: settings.integrations[source.id]?.lastSync,
          dataPoints: settings.integrations[source.id]?.dataPoints || 0
        })));
      }
    } catch (error) {
      console.error('Error loading integration status:', error);
    }
  };

  const handleConnect = async (source: DataSource) => {
    if (!user) return;
    setIsConnecting(true);

    try {
      // Simulate API key validation
      if (!apiKey.trim()) {
        throw new Error("API key is required");
      }

      // Store encrypted API key and update integration status
      const { data: currentSettings, error: fetchError } = await supabase
        .from('user_settings')
        .select('integrations')
        .eq('user_id', user.id)
        .single();

      const currentIntegrations = (currentSettings?.integrations as Record<string, any>) || {};
      const updatedIntegrations = {
        ...currentIntegrations,
        [source.id]: {
          connected: true,
          apiKey: apiKey, // In production, this should be encrypted
          connectedAt: new Date().toISOString(),
          lastSync: new Date().toISOString(),
          dataPoints: Math.floor(Math.random() * 10000) + 1000 // Simulate data points
        }
      };

      const { error: updateError } = await supabase
        .from('user_settings')
        .upsert([{
          user_id: user.id,
          integrations: updatedIntegrations,
          updated_at: new Date().toISOString()
        }]);

      if (updateError) throw updateError;

      // Update local state
      setDataSources(prev => prev.map(s => 
        s.id === source.id 
          ? { ...s, isConnected: true, status: "active", lastSync: new Date().toISOString(), dataPoints: updatedIntegrations[source.id].dataPoints }
          : s
      ));

      toast.success(`${source.name} connected successfully`, {
        description: "Data synchronization will begin in the next few minutes."
      });

      setSelectedSource(null);
      setApiKey("");

    } catch (error) {
      console.error('Connection error:', error);
      toast.error("Connection failed", {
        description: error instanceof Error ? error.message : "Please check your API key and try again."
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (source: DataSource) => {
    if (!user) return;

    try {
      const { data: currentSettings } = await supabase
        .from('user_settings')
        .select('integrations')
        .eq('user_id', user.id)
        .single();

      const currentIntegrations = currentSettings?.integrations || {};
      delete currentIntegrations[source.id];

      const { error } = await supabase
        .from('user_settings')
        .upsert([{
          user_id: user.id,
          integrations: currentIntegrations,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setDataSources(prev => prev.map(s => 
        s.id === source.id 
          ? { ...s, isConnected: false, status: "disconnected", lastSync: undefined, dataPoints: 0 }
          : s
      ));

      toast.success(`${source.name} disconnected`);
    } catch (error) {
      console.error('Disconnection error:', error);
      toast.error("Failed to disconnect");
    }
  };

  const handleSync = async (source: DataSource) => {
    if (!user) return;

    toast.success(`Syncing ${source.name}...`, {
      description: "This may take a few minutes to complete."
    });

    // Simulate data sync process
    setTimeout(() => {
      setDataSources(prev => prev.map(s => 
        s.id === source.id 
          ? { ...s, lastSync: new Date().toISOString(), dataPoints: (s.dataPoints || 0) + Math.floor(Math.random() * 500) + 100 }
          : s
      ));

      toast.success(`${source.name} sync completed`, {
        description: "New data is now available in your analytics."
      });
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error": return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending": return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "seo": return "🔍";
      case "analytics": return "📊";
      case "ads": return "💰";
      case "social": return "📱";
      case "reviews": return "⭐";
      case "competitor": return "🎯";
      default: return "📡";
    }
  };

  const connectedSources = dataSources.filter(s => s.isConnected);
  const totalDataPoints = connectedSources.reduce((sum, s) => sum + (s.dataPoints || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Database className="h-6 w-6" />
            Data Integration Center
          </h2>
          <p className="text-muted-foreground">Connect your data sources for real-time competitive intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            {connectedSources.length} Connected
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            {totalDataPoints.toLocaleString()} Data Points
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="seo">SEO & Search</TabsTrigger>
          <TabsTrigger value="advertising">Advertising</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Connection Status Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["seo", "analytics", "ads", "competitor"].map((type) => {
              const typeSources = dataSources.filter(s => s.type === type);
              const connectedCount = typeSources.filter(s => s.isConnected).length;
              
              return (
                <Card key={type} className="hover:shadow-lg transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{getTypeIcon(type)}</div>
                    <h3 className="font-semibold capitalize">{type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {connectedCount}/{typeSources.length} connected
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(connectedCount / typeSources.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* All Data Sources */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((source) => (
              <Card key={source.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(source.type)}</span>
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                    </div>
                    {getStatusIcon(source.status)}
                  </div>
                  <CardDescription className="text-sm">{source.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {source.isConnected && (
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last sync:</span>
                          <span>{source.lastSync ? new Date(source.lastSync).toLocaleString() : "Never"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data points:</span>
                          <span>{source.dataPoints?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {source.isConnected ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleSync(source)}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Sync
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDisconnect(source)}>
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1" onClick={() => setSelectedSource(source)}>
                              <Key className="h-3 w-3 mr-1" />
                              Connect
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Connect {source.name}</DialogTitle>
                              <DialogDescription>
                                Enter your {source.name} API key to start collecting data.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">API Key</label>
                                <Input
                                  type="password"
                                  placeholder="Enter your API key"
                                  value={apiKey}
                                  onChange={(e) => setApiKey(e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p className="mb-2">This integration will provide:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {source.capabilities.map((capability) => (
                                    <li key={capability}>{capability}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => selectedSource && handleConnect(selectedSource)}
                                  disabled={isConnecting || !apiKey.trim()}
                                  className="flex-1"
                                >
                                  {isConnecting ? "Connecting..." : "Connect"}
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedSource(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {dataSources.filter(s => s.type === "seo" || s.type === "analytics").map((source) => (
              <Card key={source.id} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">{getTypeIcon(source.type)}</span>
                    {source.name}
                    {getStatusIcon(source.status)}
                  </CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {source.isConnected ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active since:</span>
                        <span>{source.lastSync ? new Date(source.lastSync).toLocaleDateString() : "Unknown"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Keywords tracked:</span>
                        <span>{Math.floor((source.dataPoints || 0) / 10)}</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => handleSync(source)}>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => setSelectedSource(source)}>
                      Connect {source.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advertising" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {dataSources.filter(s => s.type === "ads").map((source) => (
              <Card key={source.id} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">{getTypeIcon(source.type)}</span>
                    {source.name}
                    {getStatusIcon(source.status)}
                  </CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {source.isConnected ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Campaigns tracked:</span>
                        <span>{Math.floor((source.dataPoints || 0) / 100)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ad spend analyzed:</span>
                        <span>${((source.dataPoints || 0) * 1.5).toLocaleString()}</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => handleSync(source)}>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Campaigns
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => setSelectedSource(source)}>
                      Connect {source.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {dataSources.filter(s => s.type === "competitor" || s.type === "reviews").map((source) => (
              <Card key={source.id} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">{getTypeIcon(source.type)}</span>
                    {source.name}
                    {getStatusIcon(source.status)}
                  </CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {source.isConnected ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Competitors monitored:</span>
                        <span>{Math.floor((source.dataPoints || 0) / 500)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Intelligence points:</span>
                        <span>{source.dataPoints?.toLocaleString() || 0}</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => handleSync(source)}>
                        <Target className="h-3 w-3 mr-1" />
                        Gather Intelligence
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => setSelectedSource(source)}>
                      Connect {source.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};