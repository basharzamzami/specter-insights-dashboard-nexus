import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle,
  Shield,
  TrendingDown,
  Activity,
  Eye
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

interface CrisisAlert {
  id: number;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  detectedAt: string;
  impact: number;
  confidence: number;
  category: string;
}

export const CrisisDetectorDashboard = () => {
  const [crisisAlerts] = useState<CrisisAlert[]>([
    {
      id: 1,
      title: 'Supply Chain Disruption',
      description: 'Key supplier experiencing significant delays due to unforeseen circumstances.',
      severity: 'high',
      source: 'Supply Chain Monitoring',
      detectedAt: '5 minutes ago',
      impact: 75,
      confidence: 88,
      category: 'Operational'
    },
    {
      id: 2,
      title: 'Cybersecurity Threat Detected',
      description: 'Unusual network activity indicates potential security breach.',
      severity: 'critical',
      source: 'Network Security System',
      detectedAt: '10 minutes ago',
      impact: 92,
      confidence: 95,
      category: 'Security'
    },
    {
      id: 3,
      title: 'Reputation Damage Alert',
      description: 'Negative sentiment surge on social media platforms regarding product quality.',
      severity: 'medium',
      source: 'Social Media Monitoring',
      detectedAt: '15 minutes ago',
      impact: 60,
      confidence: 79,
      category: 'Reputation'
    },
    {
      id: 4,
      title: 'Sudden Market Shift',
      description: 'Unexpected change in consumer preferences impacting demand for key products.',
      severity: 'medium',
      source: 'Market Analysis',
      detectedAt: '20 minutes ago',
      impact: 55,
      confidence: 72,
      category: 'Market'
    },
    {
      id: 5,
      title: 'Regulatory Change Imminent',
      description: 'New regulations set to be enforced, potentially affecting business operations.',
      severity: 'low',
      source: 'Regulatory Updates',
      detectedAt: '30 minutes ago',
      impact: 40,
      confidence: 65,
      category: 'Compliance'
    },
    {
      id: 6,
      title: 'Competitor Aggressive Move',
      description: 'Competitor launching a disruptive product at a significantly lower price point.',
      severity: 'high',
      source: 'Competitor Intelligence',
      detectedAt: '45 minutes ago',
      impact: 80,
      confidence: 90,
      category: 'Competitive'
    },
    {
      id: 7,
      title: 'Operational Failure',
      description: 'Critical system failure causing disruption in service delivery.',
      severity: 'critical',
      source: 'System Monitoring',
      detectedAt: '1 hour ago',
      impact: 95,
      confidence: 98,
      category: 'Operational'
    },
    {
      id: 8,
      title: 'Financial Risk Detected',
      description: 'Unusual financial transactions indicating potential fraud or mismanagement.',
      severity: 'medium',
      source: 'Financial Analysis',
      detectedAt: '2 hours ago',
      impact: 65,
      confidence: 82,
      category: 'Financial'
    },
    {
      id: 9,
      title: 'Public Health Crisis',
      description: 'Outbreak of a contagious disease affecting workforce availability.',
      severity: 'high',
      source: 'Public Health Alerts',
      detectedAt: '3 hours ago',
      impact: 85,
      confidence: 93,
      category: 'External'
    },
    {
      id: 10,
      title: 'Environmental Disaster',
      description: 'Natural disaster causing damage to infrastructure and supply routes.',
      severity: 'low',
      source: 'Environmental Monitoring',
      detectedAt: '4 hours ago',
      impact: 50,
      confidence: 70,
      category: 'External'
    }
  ]);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching crisis alerts from an API
    const fetchCrisisAlerts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
    };

    fetchCrisisAlerts();
  }, [user?.id, toast]);

  const getSeverityColor = (value: string) => {
    switch (value) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            Crisis Detector
          </CardTitle>
          <CardDescription>
            Real-time monitoring and alerts for potential crises
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="monitor" className="space-y-4">
        <TabsList className="bg-secondary/10 border border-secondary/30">
          <TabsTrigger value="monitor" className="data-[state=active]:bg-secondary/20">
            <Activity className="h-4 w-4 mr-2" />
            Real-time Monitor
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-secondary/20">
            <TrendingDown className="h-4 w-4 mr-2" />
            Trend Analysis
          </TabsTrigger>
          <TabsTrigger value="response" className="data-[state=active]:bg-secondary/20">
            <Shield className="h-4 w-4 mr-2" />
            Response Plans
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitor" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {crisisAlerts.map((alert) => (
              <Card key={alert.id} className={`bg-card/90 backdrop-blur-sm border-l-4 ${
                alert.severity === 'critical' ? 'border-l-red-500' :
                alert.severity === 'high' ? 'border-l-orange-500' :
                alert.severity === 'medium' ? 'border-l-yellow-500' :
                'border-l-green-500'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      {alert.title}
                    </CardTitle>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <Badge className="w-fit">
                    {alert.source} • {alert.detectedAt}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Impact Level</div>
                    <Progress value={alert.impact} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Confidence: {alert.confidence}%
                    </span>
                    <Badge className="text-xs">
                      {alert.category}
                    </Badge>
                  </div>
                  
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Investigate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-primary" />
                Trend Analysis
              </CardTitle>
              <CardDescription>
                Analyze historical data to identify emerging crisis trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No trend data available at this time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-6">
          <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Response Plans
              </CardTitle>
              <CardDescription>
                Create and manage response plans for different crisis scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No response plans available at this time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
