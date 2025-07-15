import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Filter, BarChart3, TrendingUp, Eye, Target, Mail } from "lucide-react";
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const generateMockStats = () => ({
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
    totalReach: Math.floor(Math.random() * 100000) + 50000,
    engagementRate: (Math.random() * 5 + 2).toFixed(1),
    sentimentShift: (Math.random() * 10 + 5).toFixed(1)
  });

  const stats = generateMockStats();

  const exportData = () => {
    const csvData = campaigns.map(campaign => ({
      Company: campaign.target_company,
      Type: campaign.type,
      Status: campaign.status,
      Created: new Date(campaign.created_at).toLocaleDateString(),
      Objective: campaign.objective
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign-report.csv';
    a.click();
    
    toast.success("Report exported", { description: "Campaign data has been downloaded as CSV." });
  };

  const shareReport = () => {
    const reportSummary = `Specter Net Campaign Report\n\nTotal Campaigns: ${stats.totalCampaigns}\nActive: ${stats.activeCampaigns}\nCompleted: ${stats.completedCampaigns}\nTotal Reach: ${stats.totalReach.toLocaleString()}\nEngagement Rate: ${stats.engagementRate}%`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Specter Net Campaign Report',
        text: reportSummary
      });
    } else {
      navigator.clipboard.writeText(reportSummary);
      toast.success("Report copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campaign Intelligence Reports</h2>
          <p className="text-muted-foreground">Comprehensive analysis of strategic operations and outcomes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={shareReport}>
            <Mail className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Campaign Type</label>
              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="seo">SEO Attacks</SelectItem>
                  <SelectItem value="social">Social Operations</SelectItem>
                  <SelectItem value="whisper">Whisper Campaigns</SelectItem>
                  <SelectItem value="disruption">Disruption</SelectItem>
                  <SelectItem value="ad_hijack">Ad Hijacking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.totalCampaigns}</p>
              <p className="text-xs text-muted-foreground">Total Campaigns</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.completedCampaigns}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.totalReach.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Reach</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.engagementRate}%</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">+{stats.sentimentShift}%</p>
              <p className="text-xs text-muted-foreground">Sentiment Shift</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Campaign Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-l-4 border-l-primary/50">
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
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">{new Date(campaign.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reach</p>
                          <p className="font-medium">{Math.floor(Math.random() * 10000 + 1000).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Engagement</p>
                          <p className="font-medium">{(Math.random() * 5 + 1).toFixed(1)}%</p>
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Intelligence Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actionLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">{log.action_type.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.details?.competitor && `Target: ${log.details.competitor}`}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};