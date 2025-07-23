import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Eye, TrendingUp, TrendingUp, AlertTriangle, Check, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MonitoringData {
  execution_id: string;
  strategy_title: string;
  last_updated: string;
  status: "on_track" | "at_risk" | "behind_schedule" | "completed";
  kpi_performance: {
    name: string;
    current_value: number;
    target_value: number;
    trend: "up" | "down" | "stable";
    change_percent: number;
  }[];
  timeline_performance: {
    date: string;
    planned_progress: number;
    actual_progress: number;
    milestones_hit: number;
    milestones_planned: number;
  }[];
  competitive_response: {
    competitor: string;
    action: string;
    impact_level: "low" | "medium" | "high";
    detected_date: string;
    our_counter_action: string;
  }[];
  alerts: {
    id: string;
    type: "performance" | "timeline" | "budget" | "competitive";
    severity: "low" | "medium" | "high" | "critical";
    message: string;
    created_at: string;
    resolved: boolean;
  }[];
  budget_tracking: {
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
    burn_rate: number;
  }[];
}

const mockPerformanceData = [
  { week: "Week 1", planned: 10, actual: 12, efficiency: 120 },
  { week: "Week 2", planned: 25, actual: 28, efficiency: 112 },
  { week: "Week 3", planned: 40, actual: 35, efficiency: 87 },
  { week: "Week 4", planned: 55, actual: 52, efficiency: 95 },
  { week: "Week 5", planned: 70, actual: 68, efficiency: 97 },
  { week: "Week 6", planned: 85, actual: 82, efficiency: 96 }
];

export default function MonitoringDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);

  const executionId = searchParams.get('execution_id');
  const strategyTitle = searchParams.get('title') || 'Strategy Monitoring';

  useEffect(() => {
    loadMonitoringData();
    
    // Set up real-time monitoring
    const interval = setInterval(loadMonitoringData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    setLoading(true);
    try {
      // Generate comprehensive monitoring data
      const data = generateMonitoringData();
      setMonitoringData(data);
      
      // Check for new alerts
      const criticalAlerts = data.alerts.filter(alert => 
        alert.severity === "critical" && !alert.resolved
      );
      
      if (criticalAlerts.length > 0) {
        toast({
          title: "Critical Alert",
          description: criticalAlerts[0].message,
          variant: "destructive"
        });
      }

      toast({
        title: "Data Refreshed",
        description: "Monitoring dashboard updated with latest data.",
      });
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      toast({
        title: "Error",
        description: "Failed to load monitoring data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsResolved = async (alertId: string) => {
    if (!monitoringData) return;
    
    try {
      // Update the alert status locally
      const updatedAlerts = monitoringData.alerts.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      );
      
      setMonitoringData({
        ...monitoringData,
        alerts: updatedAlerts
      });

      toast({
        title: "Alert Resolved",
        description: "Alert has been marked as resolved.",
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: "Error",
        description: "Failed to resolve alert.",
        variant: "destructive"
      });
    }
  };

  const generateMonitoringData = (): MonitoringData => {
    return {
      execution_id: executionId || Math.random().toString(36).substr(2, 9),
      strategy_title: strategyTitle,
      last_updated: new Date().toISOString(),
      status: "on_track",
      kpi_performance: [
        {
          name: "Market Share Protection",
          current_value: 36.2,
          target_value: 35.0,
          trend: "up",
          change_percent: 3.4
        },
        {
          name: "Customer Retention Rate",
          current_value: 94.5,
          target_value: 95.0,
          trend: "down",
          change_percent: -0.5
        },
        {
          name: "Competitive Response Time",
          current_value: 18,
          target_value: 24,
          trend: "up",
          change_percent: 25.0
        },
        {
          name: "Revenue Growth Rate",
          current_value: 17.8,
          target_value: 18.0,
          trend: "stable",
          change_percent: -1.1
        }
      ],
      timeline_performance: mockPerformanceData.map(item => ({
        date: item.week,
        planned_progress: item.planned,
        actual_progress: item.actual,
        milestones_hit: Math.floor(item.actual / 20),
        milestones_planned: Math.floor(item.planned / 20)
      })),
      competitive_response: [
        {
          competitor: "TechCorp",
          action: "Launched pricing promotion (20% discount)",
          impact_level: "medium",
          detected_date: "2024-01-17",
          our_counter_action: "Enhanced value messaging campaign deployed"
        },
        {
          competitor: "DataSolutions", 
          action: "Announced new AI features",
          impact_level: "high",
          detected_date: "2024-01-15",
          our_counter_action: "Accelerated our AI roadmap, beta launch moved up"
        },
        {
          competitor: "CloudInnovate",
          action: "Hired 5 senior engineers from our team",
          impact_level: "low",
          detected_date: "2024-01-14",
          our_counter_action: "Retention bonuses and counter-offers initiated"
        }
      ],
      alerts: [
        {
          id: "alert1",
          type: "performance",
          severity: "medium",
          message: "Customer retention rate dropped 0.5% below target",
          created_at: "2024-01-18T10:30:00Z",
          resolved: false
        },
        {
          id: "alert2",
          type: "competitive",
          severity: "high",
          message: "TechCorp launched aggressive pricing strategy",
          created_at: "2024-01-17T14:15:00Z",
          resolved: false
        },
        {
          id: "alert3",
          type: "timeline",
          severity: "low",
          message: "Phase 2 tasks running 2 days behind schedule",
          created_at: "2024-01-16T09:00:00Z",
          resolved: true
        }
      ],
      budget_tracking: [
        {
          category: "Marketing Campaign",
          allocated: 200000,
          spent: 145000,
          remaining: 55000,
          burn_rate: 18500
        },
        {
          category: "Product Development",
          allocated: 300000,
          spent: 180000,
          remaining: 120000,
          burn_rate: 25000
        },
        {
          category: "Customer Success",
          allocated: 150000,
          spent: 65000,
          remaining: 85000,
          burn_rate: 12000
        },
        {
          category: "Sales Enablement",
          allocated: 100000,
          spent: 78000,
          remaining: 22000,
          burn_rate: 15000
        }
      ]
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track": return "success";
      case "at_risk": return "warning";
      case "behind_schedule": return "destructive";
      case "completed": return "success";
      default: return "secondary";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-success" />;
      case "down": return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "stable": return <Activity className="h-4 w-4 text-muted-foreground" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading monitoring dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!monitoringData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mt-32">
            <h2 className="text-2xl font-bold mb-4">Monitoring Data Not Available</h2>
            <p className="text-muted-foreground mb-8">Unable to load monitoring dashboard.</p>
            <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <Button onClick={loadMonitoringData} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Target Data
          </Button>
        </div>

        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Strategy Monitoring</h1>
            <Badge variant={getStatusColor(monitoringData.status) as any} className="text-sm">
              {monitoringData.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">{monitoringData.strategy_title}</p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(monitoringData.last_updated).toLocaleString()}
          </p>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {monitoringData.kpi_performance.map((kpi, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{kpi.name}</p>
                    {getTrendIcon(kpi.trend)}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{kpi.current_value}%</p>
                    <p className="text-sm text-muted-foreground">
                      Target: {kpi.target_value}%
                    </p>
                  </div>
                  <div className={`text-sm ${
                    kpi.change_percent > 0 ? 'text-success' :
                    kpi.change_percent < 0 ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    {kpi.change_percent > 0 ? '+' : ''}{kpi.change_percent}% vs target
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="competitive">Competitive Intel</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="budget">Budget Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Timeline Performance</CardTitle>
                <CardDescription>
                  Planned vs actual progress with efficiency metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="week" className="fill-muted-foreground" />
                    <YAxis className="fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="planned" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Planned Progress"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Actual Progress"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Efficiency Metrics</CardTitle>
                  <CardDescription>
                    Weekly execution efficiency comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="week" className="fill-muted-foreground" />
                      <YAxis className="fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px"
                        }}
                      />
                      <Bar 
                        dataKey="efficiency" 
                        fill="hsl(var(--primary))"
                        name="Efficiency %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Milestone Progress</CardTitle>
                  <CardDescription>
                    Lock milestones achieved vs planned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monitoringData.timeline_performance.slice(-4).map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.date}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.milestones_hit}/{item.milestones_planned} milestones
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(item.milestones_hit / item.milestones_planned) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="competitive" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Competitive Intelligence</CardTitle>
                <CardDescription>
                  Real-time competitor actions and our responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoringData.competitive_response.map((response, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{response.competitor}</h4>
                        <div className="flex gap-2">
                          <Badge variant={getImpactColor(response.impact_level) as any} className="text-xs">
                            {response.impact_level.toUpperCase()} IMPACT
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(response.detected_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Competitor Action:</p>
                          <p className="text-sm">{response.action}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Our Counter-Action:</p>
                          <p className="text-sm">{response.our_counter_action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts
                </CardTitle>
                <CardDescription>
                  Real-time alerts and notifications requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoringData.alerts.map((alert, index) => (
                    <div key={index} className={`border rounded-lg p-4 space-y-2 ${
                      alert.severity === "critical" ? "border-destructive/50 bg-destructive/5" :
                      alert.severity === "high" ? "border-destructive/30 bg-destructive/5" :
                      alert.severity === "medium" ? "border-warning/30 bg-warning/5" :
                      "border-border"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {alert.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {alert.resolved && (
                            <Check className="h-4 w-4 text-success" />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      {!alert.resolved && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsResolved(alert.id)}
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Budget Tracking</CardTitle>
                <CardDescription>
                  Real-time budget allocation and spending across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monitoringData.budget_tracking.map((budget, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{budget.category}</h4>
                        <div className="text-sm text-muted-foreground">
                          ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            (budget.spent / budget.allocated) > 0.9 ? 'bg-destructive' :
                            (budget.spent / budget.allocated) > 0.7 ? 'bg-warning' :
                            'bg-primary'
                          }`}
                          style={{ width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Remaining: ${budget.remaining.toLocaleString()}</span>
                        <span>Burn rate: ${budget.burn_rate.toLocaleString()}/week</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}