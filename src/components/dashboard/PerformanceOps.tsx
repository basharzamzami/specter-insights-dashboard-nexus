import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Target, DollarSign, Database, Eye, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DataConnectionPlaceholder, NoDataState } from "@/components/ui/data-connection-placeholder";
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

export const PerformanceOps = () => {
  const [realKeywordData, setRealKeywordData] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasConnectedSources, setHasConnectedSources] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkDataSources();
  }, []);

  useEffect(() => {
    if (hasConnectedSources) {
      fetchPerformanceData();
    }
  }, [hasConnectedSources]);

  const checkDataSources = async () => {
    try {
      // Check if user has any connected data sources
      const { data: settings } = await supabase
        .from('user_settings')
        .select('integrations')
        .single();

      const hasConnections = settings?.integrations && 
        Object.values(settings.integrations).some((integration: any) => integration?.connected);
      
      setHasConnectedSources(hasConnections);
    } catch (error) {
      console.error('Error checking data sources:', error);
      setHasConnectedSources(false);
    }
  };

  const fetchPerformanceData = async () => {
    if (!hasConnectedSources) return;

    try {
      setLoading(true);
      
      // Fetch real SEO keyword data
      const { data: seoResponse, error } = await supabase.functions.invoke('seo-analysis', {
        body: { 
          action: 'analyze_keywords',
          domain: 'yourcompany.com'
        }
      });

      if (error) throw error;

      if (seoResponse?.success && seoResponse.data?.keywords) {
        const formattedKeywords = seoResponse.data.keywords.map((item: any) => ({
          keyword: item.keyword,
          rank: item.rank || 0,
          change: item.rank_change ? 
            (item.rank_change > 0 ? `+${item.rank_change}` : item.rank_change.toString()) : 
            "0",
          traffic: item.traffic_estimate || 0
        }));
        
        setRealKeywordData(formattedKeywords.slice(0, 5));
        setPerformanceMetrics(seoResponse.data.performance_metrics);
      }

    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast({
        title: "Data Loading Error",
        description: "Unable to fetch performance data. Please check your integrations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        reportType: "Performance Operations Report",
        hasRealData: hasConnectedSources,
        metrics: performanceMetrics,
        keywords: realKeywordData,
        summary: hasConnectedSources ? 
          "Real-time performance data from connected sources" : 
          "Connect data sources to generate comprehensive reports"
      };

      const csvContent = generateCSVReport(reportData);
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `performance-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Report Generated",
        description: "Performance report downloaded successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Export Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateCSVReport = (data: any) => {
    let csv = `${data.reportType}\n`;
    csv += `Generated: ${new Date(data.generatedAt).toLocaleDateString()}\n`;
    csv += `Data Source: ${data.hasRealData ? "Live Integrations" : "Sample Data"}\n\n`;
    
    if (data.metrics) {
      csv += "PERFORMANCE METRICS\n";
      csv += `Overall Score,${data.metrics.overall_score || "N/A"}\n`;
      csv += `Traffic Score,${data.metrics.traffic_score || "N/A"}\n`;
      csv += `SEO Score,${data.metrics.seo_score || "N/A"}\n\n`;
    }
    
    if (data.keywords && data.keywords.length > 0) {
      csv += "KEYWORD PERFORMANCE\n";
      csv += "Keyword,Rank,Change,Traffic Estimate\n";
      data.keywords.forEach((item: any) => {
        csv += `${item.keyword},${item.rank},${item.change},${item.traffic}\n`;
      });
    } else {
      csv += "KEYWORD PERFORMANCE\n";
      csv += "No keyword data available - connect SEO tools to track performance\n";
    }
    
    return csv;
  };

  // Show data connection placeholder if no sources connected
  if (!hasConnectedSources) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Performance Operations</h2>
            <p className="text-muted-foreground">Real-time performance analytics and competitive insights</p>
          </div>
          <Button variant="outline" onClick={handleExportReport}>
            <Eye className="h-4 w-4 mr-2" />
            Generate Sample Report
          </Button>
        </div>

        <DataConnectionPlaceholder
          title="Performance Analytics Ready"
          description="Connect your analytics and SEO tools to see live performance data, keyword rankings, traffic insights, and competitive analysis."
          suggestions={["Google Analytics", "SEMrush", "Ahrefs", "Google Search Console"]}
          onConnectClick={() => window.location.href = '/data-integration'}
          icon={<TrendingUp className="h-16 w-16 text-muted-foreground" />}
        />

        {/* Sample metrics to show capability */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Organic Traffic", value: "Connect Analytics", icon: TrendingUp },
            { label: "Keyword Rankings", value: "Connect SEO Tools", icon: Target },
            { label: "Conversion Rate", value: "Connect Analytics", icon: DollarSign },
            { label: "Competitive Gap", value: "Connect Intelligence", icon: AlertTriangle }
          ].map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-colors">
              <CardContent className="p-4 text-center">
                <metric.icon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold text-muted-foreground">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show real data interface when sources are connected
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Operations</h2>
          <p className="text-muted-foreground">Real-time competitive advantage tracking</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Database className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
          <Button variant="outline" onClick={handleExportReport}>
            <Eye className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Real-time metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "SEO Performance", 
            value: performanceMetrics?.seo_score ? `${performanceMetrics.seo_score}/100` : "Loading...",
            icon: TrendingUp,
            color: "text-green-600"
          },
          { 
            label: "Keyword Rankings", 
            value: realKeywordData.length > 0 ? `${realKeywordData.length} tracked` : "0 tracked",
            icon: Target,
            color: "text-blue-600"
          },
          { 
            label: "Traffic Score", 
            value: performanceMetrics?.traffic_score ? `${performanceMetrics.traffic_score}/100` : "Loading...",
            icon: DollarSign,
            color: "text-purple-600"
          },
          { 
            label: "Data Points", 
            value: loading ? "Syncing..." : `${realKeywordData.length * 100}+`,
            icon: Database,
            color: "text-orange-600"
          }
        ].map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-colors">
            <CardContent className="p-4 text-center">
              <metric.icon className={`h-8 w-8 mx-auto mb-2 ${metric.color}`} />
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Keyword performance table */}
      {realKeywordData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Real-time Keyword Performance</CardTitle>
            <CardDescription>Live rankings from connected SEO tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {realKeywordData.map((keyword: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{keyword.keyword}</p>
                    <p className="text-sm text-muted-foreground">Rank #{keyword.rank}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={keyword.change.startsWith('+') ? 'destructive' : 'default'}>
                      {keyword.change}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {keyword.traffic} monthly searches
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8">
            <NoDataState 
              title="Keyword Data Loading"
              description="Syncing with your SEO tools to fetch real-time keyword rankings"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
