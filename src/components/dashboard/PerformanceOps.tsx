import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Target, Users, DollarSign, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart, 
  Line, 
  BarChart, 
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

const trafficData = [
  { month: "Jan", organic: 12000, competitor: 8500, shift: "+41%" },
  { month: "Feb", organic: 15000, competitor: 8200, shift: "+83%" },
  { month: "Mar", organic: 18000, competitor: 7800, shift: "+131%" },
  { month: "Apr", organic: 22000, competitor: 7500, shift: "+193%" },
  { month: "May", organic: 28000, competitor: 7200, shift: "+289%" },
  { month: "Jun", organic: 35000, competitor: 6900, shift: "+407%" }
];

const keywordData = [
  { keyword: "AI automation", rank: 3, change: "+5", traffic: 8500 },
  { keyword: "business intelligence", rank: 1, change: "+2", traffic: 12000 },
  { keyword: "competitor analysis", rank: 2, change: "0", traffic: 6800 },
  { keyword: "market research", rank: 4, change: "+1", traffic: 4200 },
  { keyword: "data analytics", rank: 6, change: "+3", traffic: 3100 }
];

const competitorShare = [
  { name: "Your Brand", value: 35, color: "#6366f1" },
  { name: "TechCorp", value: 25, color: "#8b5cf6" },
  { name: "DataSolutions", value: 20, color: "#06b6d4" },
  { name: "CloudInnovate", value: 15, color: "#10b981" },
  { name: "Others", value: 5, color: "#6b7280" }
];

export const PerformanceOps = () => {
  const [activeTab, setActiveTab] = useState("traffic");
  const [realKeywordData, setRealKeywordData] = useState(keywordData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch real SEO keyword data
      const { data: seoData, error } = await supabase
        .from('seo_keywords')
        .select('*')
        .order('rank')
        .limit(10);

      if (error) throw error;

      if (seoData && seoData.length > 0) {
        const formattedKeywords = seoData.map(item => ({
          keyword: item.keyword,
          rank: item.rank || 0,
          change: item.rank_change ? 
            (item.rank_change > 0 ? `+${item.rank_change}` : item.rank_change.toString()) : 
            "0",
          traffic: item.traffic_estimate || 0
        }));
        
        setRealKeywordData([...formattedKeywords, ...keywordData].slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    // Create comprehensive report data
    const reportData = {
      generatedAt: new Date().toISOString(),
      reportType: "Performance Operations Report",
      summary: {
        trafficGrowth: "+47%",
        keywordsWon: 156,
        marketShare: "35%",
        revenueImpact: "$2.1M"
      },
      trafficAnalysis: trafficData,
      keywordPerformance: keywordData,
      competitorAnalysis: competitorShare,
      recommendations: [
        "Focus on AI automation keywords showing 25% higher conversion",
        "Expand content strategy around business intelligence topics",
        "Monitor TechCorp's recent product launches for positioning opportunities",
        "Investigate CloudInnovate's pricing strategy changes",
        "Optimize for emerging data analytics search terms"
      ]
    };

    // Convert to CSV format for easy analysis
    const csvContent = generateCSVReport(reportData);
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `performance-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVReport = (data: any) => {
    let csv = "Performance Operations Report\n";
    csv += `Generated: ${new Date(data.generatedAt).toLocaleDateString()}\n\n`;
    
    csv += "EXECUTIVE SUMMARY\n";
    csv += `Traffic Growth,${data.summary.trafficGrowth}\n`;
    csv += `Keywords Won,${data.summary.keywordsWon}\n`;
    csv += `Market Share,${data.summary.marketShare}\n`;
    csv += `Revenue Impact,${data.summary.revenueImpact}\n\n`;
    
    csv += "TRAFFIC ANALYSIS\n";
    csv += "Month,Organic Traffic,Competitor Avg,Growth Shift\n";
    data.trafficAnalysis.forEach((item: any) => {
      csv += `${item.month},${item.organic},${item.competitor},${item.shift}\n`;
    });
    
    csv += "\nKEYWORD PERFORMANCE\n";
    csv += "Keyword,Rank,Change,Monthly Searches\n";
    data.keywordPerformance.forEach((item: any) => {
      csv += `${item.keyword},${item.rank},${item.change},${item.traffic}\n`;
    });
    
    csv += "\nCOMPETITOR MARKET SHARE\n";
    csv += "Company,Market Share %\n";
    data.competitorAnalysis.forEach((item: any) => {
      csv += `${item.name},${item.value}%\n`;
    });
    
    csv += "\nSTRATEGIC RECOMMENDATIONS\n";
    data.recommendations.forEach((rec: string, index: number) => {
      csv += `${index + 1}. ${rec}\n`;
    });
    
    return csv;
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) return "bg-success/10 text-success border-success/20";
    if (rank <= 6) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const getChangeIcon = (change: string) => {
    if (change.startsWith("+")) return <TrendingUp className="h-3 w-3 text-success" />;
    if (change.startsWith("-")) return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Target className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Operations</h2>
          <p className="text-muted-foreground">Track your competitive advantage and market position</p>
        </div>
        <Button variant="outline" className="btn-glow" onClick={handleExportReport}>
          <Eye className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">+47%</p>
                <p className="text-sm text-muted-foreground">Traffic Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Keywords Won</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-electric/10 rounded-lg">
                <Users className="h-6 w-6 text-electric" />
              </div>
              <div>
                <p className="text-2xl font-bold">35%</p>
                <p className="text-sm text-muted-foreground">Market Share</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-warning/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">$2.1M</p>
                <p className="text-sm text-muted-foreground">Rev. Impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Performance</TabsTrigger>
          <TabsTrigger value="share">Market Share</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Traffic Shifts vs Competitors</CardTitle>
              <CardDescription>
                Monitor organic traffic growth compared to key competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="fill-muted-foreground" />
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
                    dataKey="organic" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Your Traffic"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="competitor" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Competitor Avg"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Keyword Wins & Rankings</CardTitle>
              <CardDescription>
                Track ranking improvements and traffic impact for key terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realKeywordData.map((item, index) => (
                  <div 
                    key={item.keyword}
                    className={`flex items-center justify-between p-4 bg-muted/30 rounded-lg slide-in animate-delay-${index * 100}`}
                  >
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getRankBadge(item.rank)} font-bold`}>
                        #{item.rank}
                      </Badge>
                      <div>
                        <p className="font-medium">{item.keyword}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.traffic.toLocaleString()} monthly searches
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getChangeIcon(item.change)}
                      <span className={`text-sm font-medium ${
                        item.change.startsWith("+") ? "text-success" :
                        item.change.startsWith("-") ? "text-destructive" :
                        "text-muted-foreground"
                      }`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Share of Voice</CardTitle>
                <CardDescription>
                  Your position in the competitive landscape
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={competitorShare}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {competitorShare.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Competitive Breakdown</CardTitle>
                <CardDescription>
                  Market share distribution and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitorShare.map((item, index) => (
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};