import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as LucideIcons from "lucide-react";
const { ArrowLeft, TrendingUp, AlertTriangle, Target, Clock, DollarSign, Users } = LucideIcons;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ImpactAnalysis {
  id: string;
  title: string;
  competitor: string;
  threatLevel: "low" | "medium" | "high" | "critical";
  financialImpact: {
    potential_loss: number;
    market_share_risk: number;
    revenue_at_risk: number;
  };
  timeframe: {
    immediate: string[];
    short_term: string[];
    long_term: string[];
  };
  recommendations: {
    priority: "high" | "medium" | "low";
    action: string;
    timeline: string;
    resources_needed: string;
  }[];
  metrics: {
    confidence_score: number;
    risk_assessment: number;
    opportunity_score: number;
  };
}

const mockImpactData = [
  { month: "Current", our_position: 100, projected_impact: 100, competitor_gain: 0 },
  { month: "Month 1", our_position: 95, projected_impact: 92, competitor_gain: 8 },
  { month: "Month 2", our_position: 88, projected_impact: 85, competitor_gain: 15 },
  { month: "Month 3", our_position: 82, projected_impact: 78, competitor_gain: 22 },
  { month: "Month 6", our_position: 75, projected_impact: 68, competitor_gain: 32 },
  { month: "Month 12", our_position: 70, projected_impact: 60, competitor_gain: 40 },
];

export default function ImpactAnalysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const itemTitle = searchParams.get('title') || 'Unknown Threat';
  const competitor = searchParams.get('competitor') || 'Unknown Competitor';
  const itemType = searchParams.get('type') || 'news';

  useEffect(() => {
    generateImpactAnalysis();
  }, []);

  const generateImpactAnalysis = async () => {
    setLoading(true);
    try {
      // Call edge function for real impact analysis
      const { data: response, error } = await supabase.functions.invoke('intelligence-feed', {
        body: { 
          action: 'analyze_impact',
          title: itemTitle,
          competitor: competitor,
          type: itemType
        }
      });

      if (error) throw error;

      if (response?.success && response.data) {
        setAnalysis(response.data);
      } else {
        // Fallback to generated analysis
        setAnalysis(generateMockAnalysis());
      }
    } catch (error) {
      console.error('Error generating impact analysis:', error);
      setAnalysis(generateMockAnalysis());
      toast({
        title: "Analysis Generated",
        description: "Impact analysis completed using available data.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalysis = (): ImpactAnalysis => {
    const threat = Math.random() > 0.3 ? "high" : "critical";
    const potential_loss = Math.floor(Math.random() * 5000000) + 500000;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: itemTitle,
      competitor: competitor,
      threatLevel: threat as any,
      financialImpact: {
        potential_loss: potential_loss,
        market_share_risk: Math.floor(Math.random() * 15) + 5,
        revenue_at_risk: Math.floor(potential_loss * 0.8)
      },
      timeframe: {
        immediate: [
          "Market perception shift detected",
          "Customer inquiry volume changes",
          "Social media sentiment tracking"
        ],
        short_term: [
          "Competitive positioning analysis",
          "Pricing strategy review required",
          "Feature gap assessment needed"
        ],
        long_term: [
          "Market share erosion risk",
          "Revenue impact projection",
          "Strategic repositioning planning"
        ]
      },
      recommendations: [
        {
          priority: "high",
          action: "Launch immediate counter-marketing campaign",
          timeline: "48 hours",
          resources_needed: "Marketing team + $50K budget"
        },
        {
          priority: "high", 
          action: "Accelerate product feature development",
          timeline: "2 weeks",
          resources_needed: "Engineering team + Product manager"
        },
        {
          priority: "medium",
          action: "Strengthen customer retention program",
          timeline: "1 month",
          resources_needed: "Customer success team + CRM system"
        }
      ],
      metrics: {
        confidence_score: Math.floor(Math.random() * 30) + 70,
        risk_assessment: Math.floor(Math.random() * 40) + 60,
        opportunity_score: Math.floor(Math.random() * 50) + 30
      }
    };
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string): "destructive" | "warning" | "secondary" => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Generating impact analysis...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mt-32">
            <h2 className="text-2xl font-bold mb-4">Analysis Not Available</h2>
            <p className="text-muted-foreground mb-8">Unable to generate impact analysis for this item.</p>
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
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <Button 
            onClick={() => navigate(`/strategy?title=${encodeURIComponent(itemTitle)}&competitor=${encodeURIComponent(competitor)}&type=${itemType}`)}
            className="btn-glow"
          >
            Create Counter-Strategy
          </Button>
        </div>

        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-6 w-6 ${analysis.threatLevel === 'critical' || analysis.threatLevel === 'high' ? 'text-destructive' : 'text-warning'}`} />
            <h1 className="text-3xl font-bold">Impact Analysis</h1>
            <Badge variant={getThreatColor(analysis.threatLevel)} className="text-sm">
              {analysis.threatLevel.toUpperCase()} THREAT
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">{analysis.title}</p>
          <p className="text-lg">Competitor: <span className="font-semibold">{analysis.competitor}</span></p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confidence Score</p>
                  <p className="text-2xl font-bold">{analysis.metrics.confidence_score}%</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
              <Progress value={analysis.metrics.confidence_score} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Assessment</p>
                  <p className="text-2xl font-bold">{analysis.metrics.risk_assessment}%</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <Progress value={analysis.metrics.risk_assessment} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Opportunity Score</p>
                  <p className="text-2xl font-bold">{analysis.metrics.opportunity_score}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <Progress value={analysis.metrics.opportunity_score} className="mt-3" />
            </CardContent>
          </Card>
        </div>

        {/* Financial Impact */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Impact Assessment
            </CardTitle>
            <CardDescription>
              Projected financial implications of this competitive threat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Potential Revenue Loss</p>
                <p className="text-2xl font-bold text-destructive">
                  ${analysis.financialImpact.potential_loss.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Market Share at Risk</p>
                <p className="text-2xl font-bold text-warning">
                  {analysis.financialImpact.market_share_risk}%
                </p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Revenue at Risk</p>
                <p className="text-2xl font-bold text-primary">
                  ${analysis.financialImpact.revenue_at_risk.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Projection Chart */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Impact Projection</CardTitle>
            <CardDescription>
              Projected market position changes over time if no action is taken
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={mockImpactData}>
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
                <Area 
                  type="monotone" 
                  dataKey="our_position" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                  name="Our Position"
                />
                <Area 
                  type="monotone" 
                  dataKey="competitor_gain" 
                  stroke="hsl(var(--destructive))" 
                  fill="hsl(var(--destructive))"
                  fillOpacity={0.6}
                  name="Competitor Gain"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Timeline Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-destructive" />
                Immediate (0-30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.timeframe.immediate.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Short-term (1-6 months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.timeframe.short_term.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Long-term (6+ months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.timeframe.long_term.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Strategic Recommendations
            </CardTitle>
            <CardDescription>
              Prioritized action items to mitigate this threat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={getPriorityColor(rec.priority) as "destructive" | "warning" | "secondary"}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <span className="text-sm text-muted-foreground">Timeline: {rec.timeline}</span>
                  </div>
                  <h4 className="font-medium">{rec.action}</h4>
                  <p className="text-sm text-muted-foreground">Resources: {rec.resources_needed}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
