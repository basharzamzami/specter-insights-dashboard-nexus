import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Star,
  Shield,
  Eye,
  Clock,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CompetitiveLead {
  id: number;
  company: string;
  contact: string;
  title: string;
  value: number;
  stage: string;
  progress: number;
}

interface CompetitiveThreat {
  id: number;
  competitor: string;
  severity: string;
  description: string;
  impact: number;
  detectedAt: string;
}

interface Insight {
  id: number;
  title: string;
  description: string;
  category: string;
  relevance: number;
}

export const CompetitiveSalesDashboard = () => {
  const [competitiveLeads, setCompetitiveLeads] = useState<CompetitiveLead[]>([
    {
      id: 1,
      company: "TechCorp",
      contact: "Alice Johnson",
      title: "CEO",
      value: 150000,
      stage: "Negotiation",
      progress: 75,
    },
    {
      id: 2,
      company: "DataFlow Inc",
      contact: "Bob Williams",
      title: "CTO",
      value: 120000,
      stage: "Proposal",
      progress: 50,
    },
    {
      id: 3,
      company: "CloudMaster",
      contact: "Charlie Brown",
      title: "VP Sales",
      value: 90000,
      stage: "Qualified",
      progress: 25,
    },
  ]);

  const [competitiveThreats, setCompetitiveThreats] = useState<CompetitiveThreat[]>([
    {
      id: 1,
      competitor: "TechCorp",
      severity: "critical",
      description: "Aggressive pricing strategy targeting key accounts",
      impact: 80,
      detectedAt: "2 hours ago",
    },
    {
      id: 2,
      competitor: "DataFlow Inc",
      severity: "high",
      description: "New product launch with overlapping features",
      impact: 60,
      detectedAt: "4 hours ago",
    },
  ]);

  const [insights, setInsights] = useState<Insight[]>([
    {
      id: 1,
      title: "Market Shift",
      description: "Growing demand for AI-driven solutions",
      category: "Market Trend",
      relevance: 90,
    },
    {
      id: 2,
      title: "Customer Feedback",
      description: "Positive sentiment towards cloud-based services",
      category: "Customer Insight",
      relevance: 75,
    },
  ]);

  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching data from an API
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Competitive Sales Dashboard
              </CardTitle>
              <CardDescription>
                Track competitive leads, threats, and market insights
              </CardDescription>
            </div>
            <Badge variant="outline">
              Updated 5m ago
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-row items-center justify-between space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="space-y-0.5 text-right">
                <p className="text-lg font-semibold">{competitiveLeads.length}</p>
                <p className="text-muted-foreground text-sm">Leads Tracked</p>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="space-y-0.5 text-right">
                <p className="text-lg font-semibold">{competitiveThreats.length}</p>
                <p className="text-muted-foreground text-sm">Threats Detected</p>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <div className="space-y-0.5 text-right">
                <p className="text-lg font-semibold">
                  ${competitiveLeads.reduce((acc, lead) => acc + lead.value, 0).toLocaleString()}
                </p>
                <p className="text-muted-foreground text-sm">Total Pipeline Value</p>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div className="space-y-0.5 text-right">
                <p className="text-lg font-semibold">{(insights.reduce((acc, insight) => acc + insight.relevance, 0) / insights.length).toFixed(0)}%</p>
                <p className="text-muted-foreground text-sm">Market Relevance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pipeline" className="col-span-1">
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="insights" className="col-span-1">
            Insights
          </TabsTrigger>
          <TabsTrigger value="threats" className="col-span-1">
            Threats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {competitiveLeads.map((lead) => (
              <Card key={lead.id} className="bg-card/90 backdrop-blur-sm border hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{lead.company}</CardTitle>
                    <Badge className="text-xs">
                      ${lead.value.toLocaleString()}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {lead.contact} • {lead.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Deal Progress</span>
                      <span>{lead.stage}</span>
                    </div>
                    <Progress value={lead.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button className="flex-1 mr-2">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      Competitive Intelligence
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span className="text-sm">Market Position</span>
                      </div>
                      <Badge variant="secondary">#2</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>
                Key trends and opportunities in your market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4">
                {insights.map((insight) => (
                  <li key={insight.id} className="py-2">
                    <div className="font-medium">{insight.title}</div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Category: {insight.category}</span>
                      <Badge variant="secondary">Relevance: {insight.relevance}%</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {competitiveThreats.map((threat) => (
              <Card key={threat.id} className="bg-card/90 backdrop-blur-sm border-l-4 border-l-destructive/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      {threat.competitor}
                    </CardTitle>
                    <Badge className={`text-xs ${
                      threat.severity === 'critical' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                        : threat.severity === 'high'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {threat.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{threat.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Impact Assessment</div>
                    <Progress value={threat.impact} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Detected: {threat.detectedAt}
                    </span>
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      Analyze
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
