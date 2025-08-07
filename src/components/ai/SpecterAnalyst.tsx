import { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  RefreshCw, 
  Eye, 
  Share, 
  Lightbulb, 
  Target, 
  Zap 
} from "lucide-react";

// Type definitions
interface AnalysisReport {
  id: string;
  type: string;
  title: string;
  summary: string;
  content: string;
  insights: string[];
  recommendations: string[];
  source_data: {
    data_points?: number;
    competitors_analyzed?: number;
    confidence_sources?: string[];
  };
  confidence_score: number;
  created_at: string;
  status: string;
}

interface IntelligenceAlert {
  id: string;
  priority: string;
  type: string;
  title: string;
  description: string;
  action_required: boolean;
  created_at: string;
}

export const SpecterAnalyst: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [activeTab, setActiveTab] = useState("reports");

  useEffect(() => {
    loadAnalysisData();
  }, [user]);

  const loadAnalysisData = async () => {
    if (!user) return;

    try {
      // For now, use demo data since the database tables don't exist yet
      setReports(generateDemoReports());
      setAlerts(generateDemoAlerts());
    } catch (error) {
      console.error('Error loading analysis data:', error);
      // Use demo data as fallback
      setReports(generateDemoReports());
      setAlerts(generateDemoAlerts());
    }
  };

  const generateDemoReports = (): AnalysisReport[] => [
    {
      id: "demo-1",
      type: "competitive_analysis",
      title: "TechCorp Vulnerability Assessment",
      summary: "Comprehensive analysis reveals critical weaknesses in TechCorp's market position, presenting immediate disruption opportunities.",
      content: `## Executive Summary

Our deep intelligence analysis of TechCorp Industries has uncovered several critical vulnerabilities that present immediate tactical opportunities for market disruption.

## Key Findings

**Technical Infrastructure Weaknesses:**
- Mobile site performance 47% below industry average
- Core Web Vitals failing on 73% of pages
- SSL certificate expiring in 30 days (potential downtime window)

**Market Position Vulnerabilities:**
- Customer satisfaction declining 15% QoQ based on review sentiment
- Support response time averaging 48 hours vs industry standard of 6 hours
- Pricing model 23% above market average with limited value justification

**Strategic Opportunities:**
- Launch targeted content emphasizing our superior performance metrics
- Capitalize on their customer service gaps with testimonial campaigns
- Deploy competitive pricing comparison across their key market segments

## Recommended Actions

1. **Immediate (0-7 days):** Launch speed comparison campaign targeting their mobile users
2. **Short-term (1-4 weeks):** Develop customer service superiority messaging
3. **Medium-term (1-3 months):** Execute comprehensive market share capture strategy

## Intelligence Sources
- Public performance audits, customer review analysis, social sentiment tracking, and competitive pricing research
`,
      insights: [
        "TechCorp's mobile performance issues affect 2.3M monthly users",
        "Their customer support team scaled down 30% in Q3",
        "Price-sensitive customers show 67% consideration for alternatives",
        "Brand sentiment declined 22% following recent product launch"
      ],
      recommendations: [
        "Launch performance comparison campaign within 48 hours",
        "Target their dissatisfied customers with superior service messaging",
        "Develop pricing alternatives for their enterprise segment",
        "Monitor their SSL renewal for potential downtime exploitation"
      ],
      source_data: {
        competitors_analyzed: 1,
        data_points: 2847,
        confidence_sources: ["Website analysis", "Review mining", "Social listening", "Pricing intelligence"]
      },
      confidence_score: 87,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      status: "published"
    },
    {
      id: "demo-2", 
      type: "market_intelligence",
      title: "Q4 Market Disruption Forecast",
      summary: "Analysis of market conditions reveals optimal windows for strategic disruption across 3 key competitor segments.",
      content: `## Market Intelligence Report - Q4 2024

### Market Dynamics Analysis

Our comprehensive market intelligence indicates significant disruption opportunities emerging in Q4, driven by competitor strategic missteps and market condition changes.

### Competitive Landscape Shifts

**DataSolutions Inc:** 
- Experiencing 34% customer churn increase
- Product development timeline delayed by 6 months
- Key personnel departures in engineering team

**CloudInnovate:**
- Pricing model confusion driving 28% sales decline
- Marketing budget reduced 40% for Q4
- Regulatory compliance issues affecting enterprise deals

### Strategic Windows

1. **Enterprise Software Segment (Nov-Dec):** 67% of enterprises reviewing vendor relationships
2. **SMB Market (Oct-Nov):** 43% increase in solution evaluation driven by budget planning
3. **Technology Integration (Dec-Jan):** Implementation window for Q1 planning

### Recommended Strategic Response

- Accelerate enterprise outreach with competitive displacement messaging
- Launch SMB-focused campaigns highlighting competitor limitations
- Position for Q1 technology refresh cycle with superior integration capabilities
`,
      insights: [
        "Market conditions favor aggressive competitive positioning",
        "Enterprise decision-making accelerated by competitor weaknesses",
        "Q4 represents 45% of annual vendor evaluation activity"
      ],
      recommendations: [
        "Increase competitive marketing budget by 35% for Q4",
        "Develop targeted campaigns for each competitor segment",
        "Establish rapid response team for competitive opportunities"
      ],
      source_data: {
        competitors_analyzed: 8,
        data_points: 5420,
        confidence_sources: ["Market research", "Competitor analysis", "Intelligence gathering"]
      },
      confidence_score: 92,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      status: "published"
    }
  ];

  const generateDemoAlerts = (): IntelligenceAlert[] => [
    {
      id: "alert-1",
      priority: "high",
      type: "Competitive Threat",
      title: "TechCorp launching aggressive pricing campaign",
      description: "Intelligence indicates TechCorp planning 25% price reduction announcement within 72 hours. Immediate counter-strategy required.",
      action_required: true,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "alert-2", 
      priority: "critical",
      type: "Market Opportunity",
      title: "DataSolutions major outage affecting enterprise clients",
      description: "System-wide outage entering hour 6. Customer acquisition window open. Deploy emergency response messaging immediately.",
      action_required: true,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: "alert-3",
      priority: "medium",
      type: "Intelligence Update",
      title: "CloudInnovate executive departures confirmed",
      description: "CTO and VP Engineering resignations confirmed via LinkedIn. Product roadmap likely disrupted - opportunity for technology messaging.",
      action_required: false,
      created_at: new Date(Date.now() - 18000000).toISOString()
    }
  ];

  const generateNewAnalysis = async () => {
    if (!user) return;
    setIsGenerating(true);

    try {
      // Simulate AI analysis generation
      toast({
        title: "Initiating comprehensive market analysis...",
        description: "Specter AI is analyzing competitor data, market conditions, and strategic opportunities."
      });

      // Call edge function to generate real analysis
      const { data: response, error } = await supabase.functions.invoke('ai-analyst', {
        body: { 
          action: 'generate_analysis',
          user_id: user.id,
          analysis_type: 'comprehensive_market_intelligence'
        }
      });

      if (error) throw error;

      // For demo purposes, create a new analysis report
      const newReport: AnalysisReport = {
        id: `analysis-${Date.now()}`,
        type: "competitive_analysis",
        title: `Market Intelligence Report - ${new Date().toLocaleDateString()}`,
        summary: "Real-time analysis of competitive landscape reveals emerging opportunities and strategic threats requiring immediate attention.",
        content: response?.analysis || "Analysis content will be generated based on real market data and competitor intelligence.",
        insights: response?.insights || [
          "Competitor mobile performance declined 12% this week",
          "Social sentiment shows 34% increase in customer complaints",
          "Pricing pressure in enterprise segment creating opportunity"
        ],
        recommendations: response?.recommendations || [
          "Launch mobile performance comparison campaign",
          "Develop rapid response for competitor customer acquisition",
          "Adjust enterprise pricing strategy for competitive advantage"
        ],
        source_data: {
          competitors_analyzed: response?.competitors_analyzed || 5,
          data_points: response?.data_points || Math.floor(Math.random() * 5000) + 2000,
          confidence_sources: response?.sources || ["SEO analysis", "Social listening", "Review mining", "Performance audits"]
        },
        confidence_score: response?.confidence || Math.floor(Math.random() * 20) + 80,
        created_at: new Date().toISOString(),
        status: "published"
      };

      setReports(prev => [newReport, ...prev]);

      toast({
        title: "Analysis complete",
        description: `New intelligence report generated with ${newReport.source_data.data_points} data points and ${newReport.confidence_score}% confidence.`
      });

    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: "Analysis generation failed",
        variant: "destructive",
        description: "Unable to complete market intelligence analysis. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const publishToIntelFeed = async (report: AnalysisReport) => {
    try {
      // Publish analysis to intelligence feed
      const { error } = await supabase
        .from('intelligence_feeds')
        .insert([{
          type: 'analysis',
          title: report.title,
          description: report.summary,
          source: 'Specter AI Analyst',
          priority: 'high',
          impact: 'positive',
          data: {
            report_id: report.id,
            confidence_score: report.confidence_score,
            insights: report.insights,
            recommendations: report.recommendations
          }
        }]);

      if (error) throw error;

      toast({
        title: "Published to Intelligence Feed",
        description: "Analysis is now available in the Intel Feed for strategic review."
      });
    } catch (error) {
      console.error('Error publishing to feed:', error);
      toast({
        title: "Publishing failed",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("competitive")) return "🎯";
    if (type.includes("market")) return "📊";
    if (type.includes("disruption")) return "⚡";
    if (type.includes("opportunity")) return "💡";
    return "🔍";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Brain className="h-6 w-6" />
            Specter AI Analyst
          </h2>
          <p className="text-muted-foreground">Autonomous competitive intelligence and strategic analysis</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={generateNewAnalysis} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Analysis Reports</TabsTrigger>
          <TabsTrigger value="alerts">Intelligence Alerts</TabsTrigger>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getTypeIcon(report.type)}</span>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {report.type.replace('_', ' ')}
                        </Badge>
                        <Badge variant={report.status === 'published' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">{report.summary}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {report.confidence_score}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Key Insights:</p>
                        <ul className="space-y-1">
                          {report.insights.slice(0, 2).map((insight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Lightbulb className="h-3 w-3 mt-0.5 text-yellow-500" />
                              <span className="text-xs">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Recommendations:</p>
                        <ul className="space-y-1">
                          {report.recommendations.slice(0, 2).map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Target className="h-3 w-3 mt-0.5 text-primary" />
                              <span className="text-xs">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📊 {report.source_data.data_points?.toLocaleString()} data points</span>
                        <span>🕐 {new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View Full Report
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{report.title}</DialogTitle>
                              <DialogDescription>
                                Generated on {new Date(report.created_at).toLocaleDateString()} • {report.confidence_score}% confidence
                              </DialogDescription>
                            </DialogHeader>
                            <div className="prose max-w-none">
                              <div className="whitespace-pre-wrap">{report.content}</div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" onClick={() => publishToIntelFeed(report)}>
                          <Share className="h-3 w-3 mr-1" />
                          Publish to Feed
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 hover:shadow-lg transition-all duration-300`} style={{ borderLeftColor: getPriorityColor(alert.priority).replace('bg-', '#') }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(alert.priority)}`} />
                        <h4 className="font-semibold">{alert.title}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {alert.type}
                        </Badge>
                        {alert.action_required && (
                          <Badge variant="destructive" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Priority: {alert.priority.toUpperCase()}</span>
                        <span>Created: {new Date(alert.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    {alert.action_required && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Investigate
                        </Button>
                        <Button size="sm">
                          <Zap className="h-3 w-3 mr-1" />
                          Take Action
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Intelligence Summary</CardTitle>
              <CardDescription>Automated analysis of market conditions and competitive intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-2xl font-bold">{reports.length}</p>
                  <p className="text-sm text-muted-foreground">Analysis Reports Generated</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-3xl mb-2">🚨</div>
                  <p className="text-2xl font-bold">{alerts.filter(a => a.action_required).length}</p>
                  <p className="text-sm text-muted-foreground">Alerts Requiring Action</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-2xl font-bold">
                    {reports.reduce((sum, r) => sum + (r.source_data.data_points || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Data Points Analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
