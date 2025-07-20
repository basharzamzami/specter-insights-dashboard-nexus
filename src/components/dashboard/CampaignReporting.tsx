import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Filter, BarChart3, TrendingUp, Eye, Target, Mail, AlertTriangle, Zap, LineChart, TrendingDown } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Campaign {
  id: string;
  type: string;
  target_company: string;
  objective: string;
  status: string;
  scheduled_date: string;
  created_at: string;
  actions: any;
}

interface ActionLog {
  id: string;
  action_type: string;
  timestamp: string;
  details: any;
}


export const CampaignReporting = () => {
  const { user } = useUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [timeframe, setTimeframe] = useState("7d");
  const [campaignType, setCampaignType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("overview");

  useEffect(() => {
    loadData();
  }, [user, timeframe, campaignType]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Load campaigns with filters
      let campaignsQuery = supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignType !== 'all') {
        campaignsQuery = campaignsQuery.eq('type', campaignType);
      }

      const { data: campaignsData, error: campaignsError } = await campaignsQuery;

      if (campaignsError) throw campaignsError;

      // Load action logs
      const { data: logsData, error: logsError } = await supabase
        .from('action_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      setCampaigns(campaignsData || []);
      setActionLogs(logsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seo': return '🔍';
      case 'social': return '📱';
      case 'whisper': return '👥';
      case 'disruption': return '⚡';
      case 'ad_hijack': return '🎯';
      default: return '📊';
    }
  };

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
    totalReach: 0,
    engagementRate: "0.0",
    sentimentShift: "0.0",
    successRate: "0.0",
    competitorsAnalyzed: 0
  };

  const exportData = (format: string) => {
    // Create demo data if no campaigns exist
    const exportCampaigns = campaigns.length > 0 ? campaigns : [
      {
        target_company: "TechCorp Industries",
        type: "seo",
        status: "active",
        created_at: new Date().toISOString(),
        objective: "Disrupt their search rankings for key terms"
      },
      {
        target_company: "DataSolutions Inc",
        type: "social",
        status: "completed",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        objective: "Social media sentiment manipulation"
      },
      {
        target_company: "CloudInnovate",
        type: "whisper",
        status: "paused",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        objective: "Spread doubt about their new product launch"
      }
    ];

    const csvData = exportCampaigns.map(campaign => ({
      Company: campaign.target_company,
      Type: campaign.type,
      Status: campaign.status,
      Created: new Date(campaign.created_at).toLocaleDateString(),
      Objective: campaign.objective || "Strategic intelligence operation"
    }));

    if (format === 'csv') {
      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `specter-net-campaign-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    
    toast.success(`Report exported as ${format.toUpperCase()}`, { 
      description: "Campaign data has been downloaded successfully." 
    });
  };

  const shareReport = () => {
    const reportSummary = `🕴️ SPECTER NET INTELLIGENCE REPORT\n\n📊 Campaign Overview:\n• Total Operations: ${stats.totalCampaigns}\n• Active: ${stats.activeCampaigns}\n• Completed: ${stats.completedCampaigns}\n• Success Rate: ${stats.successRate}%\n\n🎯 Performance Metrics:\n• Total Reach: ${stats.totalReach.toLocaleString()}\n• Engagement Rate: ${stats.engagementRate}%\n• Sentiment Shift: +${stats.sentimentShift}%\n• Competitors Analyzed: ${stats.competitorsAnalyzed}\n\n🔥 STATUS: OPERATIONAL SUPERIORITY ACHIEVED`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Specter Net Intelligence Report',
        text: reportSummary
      });
    } else {
      navigator.clipboard.writeText(reportSummary);
      toast.success("Report copied to clipboard", {
        description: "Intelligence summary ready for secure transmission."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Intelligence Analytics
          </h2>
          <p className="text-muted-foreground">Comprehensive analysis of strategic operations and market dominance</p>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="trends">Market Trends</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => exportData('csv')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={shareReport}>
            <Mail className="h-4 w-4 mr-2" />
            Share Intel
          </Button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Intelligence Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Operation Type</label>
              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Operations</SelectItem>
                  <SelectItem value="seo">SEO Warfare</SelectItem>
                  <SelectItem value="social">Social Ops</SelectItem>
                  <SelectItem value="whisper">Whisper Network</SelectItem>
                  <SelectItem value="disruption">Market Disruption</SelectItem>
                  <SelectItem value="ad_hijack">Ad Hijacking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Target Search</label>
              <Input placeholder="Search competitors..." className="mt-1" />
            </div>
            <div className="flex items-end">
              <Button onClick={loadData} className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 animate-scale-in">
        {[
          { label: "Total Operations", value: stats.totalCampaigns, icon: "📊", trend: "+12%" },
          { label: "Active", value: stats.activeCampaigns, icon: "🟢", trend: "+3%" },
          { label: "Completed", value: stats.completedCampaigns, icon: "✅", trend: "+8%" },
          { label: "Success Rate", value: `${stats.successRate}%`, icon: "🎯", trend: "+5%" },
          { label: "Total Reach", value: `${Math.floor(parseInt(stats.totalReach.toString()) / 1000)}K`, icon: "📡", trend: "+15%" },
          { label: "Engagement", value: `${stats.engagementRate}%`, icon: "💬", trend: "+2%" },
          { label: "Sentiment Shift", value: `+${stats.sentimentShift}%`, icon: "📈", trend: "+7%" },
          { label: "Targets Analyzed", value: stats.competitorsAnalyzed, icon: "🔍", trend: "+4%" },
        ].map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">{stat.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Analytics Ready */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Intelligence Analytics
          </CardTitle>
          <CardDescription>Real-time campaign data will appear here as operations are launched</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <Target className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <p className="text-xl font-semibold">Analytics Ready</p>
              <p className="text-muted-foreground max-w-md">
                Launch campaigns and operations to see real-time performance metrics, sentiment analysis, and competitive intelligence data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance List */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Active Operations</CardTitle>
          <CardDescription>Real-time status of strategic intelligence operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.length > 0 ? campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-l-4 border-l-primary/50 hover:shadow-md transition-all duration-300">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getTypeIcon(campaign.type)}</span>
                        <h4 className="font-semibold">{campaign.target_company}</h4>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{campaign.objective}</p>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Initiated</p>
                          <p className="font-medium">{new Date(campaign.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reach</p>
                          <p className="font-medium">{Math.floor(Math.random() * 10000 + 1000).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Impact</p>
                          <p className="font-medium">{(Math.random() * 5 + 1).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="font-medium">OPERATIONAL</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              // Mock campaigns for demo
              [
                { id: 1, target: "TechCorp", type: "SEO Attack", status: "active", impact: "12.3%" },
                { id: 2, target: "DataSolutions", type: "Social Disruption", status: "completed", impact: "8.7%" },
                { id: 3, target: "CloudInnovate", type: "Whisper Campaign", status: "pending", impact: "15.2%" },
              ].map((campaign) => (
                <Card key={campaign.id} className="border-l-4 border-l-primary/50 hover:shadow-md transition-all duration-300">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🎯</span>
                          <h4 className="font-semibold">{campaign.target}</h4>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline">{campaign.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Strategic intelligence operation targeting competitive vulnerabilities</p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Initiated</p>
                            <p className="font-medium">{new Date().toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reach</p>
                            <p className="font-medium">{Math.floor(Math.random() * 10000 + 1000).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Impact</p>
                            <p className="font-medium">{campaign.impact}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <p className="font-medium">OPERATIONAL</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Intelligence Activity Feed */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Intelligence Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Competitor vulnerability detected", target: "TechCorp", time: "2 minutes ago", type: "critical" },
              { action: "Social sentiment manipulation complete", target: "DataSolutions", time: "15 minutes ago", type: "success" },
              { action: "SEO ranking disruption initiated", target: "CloudInnovate", time: "1 hour ago", type: "info" },
              { action: "Whisper campaign deployed", target: "StartupX", time: "3 hours ago", type: "warning" },
              { action: "Market share analysis updated", target: "All Targets", time: "6 hours ago", type: "info" },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'critical' ? 'bg-red-500' :
                    log.type === 'success' ? 'bg-green-500' :
                    log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  } animate-pulse`}></div>
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      Target: {log.target}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {log.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};