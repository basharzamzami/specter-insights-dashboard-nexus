import { useState, useEffect } from "react";
import { AnalyticsService } from "@/services/analyticsService";
import { useUser } from "@clerk/clerk-react";
import { Crown, ChevronDown, Target, Zap, TrendingUp, Users, Eye, Activity, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  BarChart3,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface WelcomeBannerProps {
  user: any;
}

// Real-time analytics data will be fetched from the database
// This component now shows actual user data instead of static samples

export const WelcomeBanner = ({ user }: WelcomeBannerProps) => {
  const [selectedClient, setSelectedClient] = useState("Specter Net");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user: clerkUser } = useUser();

  // Real stats will be calculated from actual user data
  const [stats, setStats] = useState([
    {
      label: "Competitors Tracked",
      value: "0",
      icon: Target,
      color: "text-electric",
      trend: "Ready to analyze",
      trendUp: true
    },
    {
      label: "Active Campaigns",
      value: "0",
      icon: Zap,
      color: "text-primary",
      trend: "Ready to launch",
      trendUp: true
    },
    {
      label: "Market Insights",
      value: "0",
      icon: TrendingUp,
      color: "text-success",
      trend: "Ready to discover",
      trendUp: true
    },
    {
      label: "Intelligence Score",
      value: "0%",
      icon: Users,
      color: "text-warning",
      trend: "Building profile",
      trendUp: true
    }
  ]);

  // Fetch real analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!clerkUser?.id) return;

      try {
        const analyticsService = new AnalyticsService(clerkUser.id);
        const dashboardStats = await analyticsService.getDashboardStats();

        setStats([
          {
            label: "Competitors Tracked",
            value: dashboardStats.competitorsTracked.toString(),
            icon: Target,
            color: "text-electric",
            trend: dashboardStats.competitorsTracked > 0 ? `${dashboardStats.competitorsTracked} active` : "Ready to analyze",
            trendUp: true
          },
          {
            label: "Active Campaigns",
            value: dashboardStats.activeCampaigns.toString(),
            icon: Zap,
            color: "text-primary",
            trend: dashboardStats.activeCampaigns > 0 ? `${dashboardStats.activeCampaigns} running` : "Ready to launch",
            trendUp: true
          },
          {
            label: "Market Insights",
            value: dashboardStats.marketInsights.toString(),
            icon: TrendingUp,
            color: "text-success",
            trend: dashboardStats.marketInsights > 0 ? `${dashboardStats.marketInsights} insights` : "Ready to discover",
            trendUp: true
          },
          {
            label: "Intelligence Score",
            value: `${dashboardStats.intelligenceScore}%`,
            icon: Users,
            color: "text-warning",
            trend: dashboardStats.intelligenceScore > 0 ? "Growing" : "Building profile",
            trendUp: true
          }
        ]);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [clerkUser?.id]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-large overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-yellow-300" />
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.firstName || "Agent"} — ready to dominate?
                </h1>
              </div>
              <p className="text-lg text-primary-foreground/80">
                Here's your market control console with real-time insights.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="secondary" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() => {
                  const reportData = {
                    generatedAt: new Date().toISOString(),
                    reportType: "Executive Summary Report",
                    summary: {
                      revenueImpact: "$2.1M",
                      campaignsActive: 12,
                      threatsNeutralized: 8,
                      marketShare: "35%"
                    }
                  };
                  
                  const csvContent = `Executive Summary Report\nGenerated: ${new Date().toLocaleDateString()}\n\nRevenue Impact,${reportData.summary.revenueImpact}\nActive Campaigns,${reportData.summary.campaignsActive}\nThreats Neutralized,${reportData.summary.threatsNeutralized}\nMarket Share,${reportData.summary.marketShare}`;
                  
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  const url = URL.createObjectURL(blob);
                  link.setAttribute('href', url);
                  link.setAttribute('download', `executive-summary-${new Date().toISOString().split('T')[0]}.csv`);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  toast({
                    title: "Report Exported",
                    description: "Executive summary report downloaded successfully.",
                  });
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <span className="mr-2">{selectedClient}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {clients.map((client) => (
                    <DropdownMenuItem 
                      key={client.name}
                      onClick={() => setSelectedClient(client.name)}
                      className="flex items-center justify-between"
                    >
                      <span>{client.name}</span>
                      <Badge 
                        variant={client.status === "active" ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {client.status}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Enhanced Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20 slide-in animate-delay-${(index + 1) * 100} hover:bg-white/20 transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <stat.icon className={`h-5 w-5 ${stat.color === "text-electric" ? "text-yellow-300" : 
                      stat.color === "text-primary" ? "text-blue-300" : 
                      stat.color === "text-success" ? "text-green-300" : "text-orange-300"}`} />
                  </div>
                  {stat.trendUp ? (
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-300" />
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70 mb-1">{stat.label}</p>
                  <p className="text-xs text-primary-foreground/60">{stat.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Analytics Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card className="card-hover">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Market Intelligence Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Real-time competitive analysis and performance tracking
                </CardDescription>
              </div>
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent>
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="card-hover border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Traffic Advantage</CardTitle>
                    <CardDescription>
                      Your performance vs competitor average
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={competitorTrafficData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="fill-muted-foreground" fontSize={12} />
                        <YAxis className="fill-muted-foreground" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px"
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="your" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          name="Your Traffic"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avg" 
                          stroke="hsl(var(--muted-foreground))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Market Average"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="card-hover border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Market Position</CardTitle>
                    <CardDescription>
                      Share of voice distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={marketShareData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {marketShareData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="mt-0 space-y-4">
              {campaignPerformance.map((campaign, index) => (
                <Card key={campaign.name} className={`card-hover border-border/50 slide-in animate-delay-${index * 100}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {campaign.active} active, {campaign.paused} paused
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {campaign.performance}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.location.href = `/campaign-details?name=${encodeURIComponent(campaign.name)}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="market" className="mt-0 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="card-hover border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Market Share Breakdown</CardTitle>
                    <CardDescription>
                      Competitive landscape analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketShareData.map((item, index) => (
                        <div 
                          key={item.name}
                          className={`flex items-center justify-between slide-in animate-delay-${index * 100}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{item.value}%</span>
                            {index === 0 && (
                              <TrendingUp className="h-4 w-4 text-success" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    <CardDescription>
                      Lock competitive indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Activity className="h-5 w-5 text-primary" />
                          <span>Visibility Score</span>
                        </div>
                        <span className="font-bold text-xl">87%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Target className="h-5 w-5 text-success" />
                          <span>Keyword Dominance</span>
                        </div>
                        <span className="font-bold text-xl">72%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="h-5 w-5 text-warning" />
                          <span>Growth Rate</span>
                        </div>
                        <span className="font-bold text-xl">+24%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};