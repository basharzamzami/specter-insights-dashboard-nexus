import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target,
  Flame
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

interface WarmLead {
  id: number;
  company: string;
  contact: string;
  currentProvider: string;
  temperature: number;
  confidence: number;
  lastActivity: string;
  signals: number;
}

interface SeizureCampaign {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'completed';
  targetLeads: number;
  seizedLeads: number;
  conversionRate: number;
}

export const SeizureDashboard = () => {
  const [warmLeads] = useState<WarmLead[]>([
    {
      id: 1,
      company: 'TechCorp',
      contact: 'John Doe',
      currentProvider: 'Provider A',
      temperature: 75,
      confidence: 80,
      lastActivity: '2 hours ago',
      signals: 5
    },
    {
      id: 2,
      company: 'DataFlow Inc',
      contact: 'Jane Smith',
      currentProvider: 'Provider B',
      temperature: 60,
      confidence: 65,
      lastActivity: '5 hours ago',
      signals: 3
    },
    {
      id: 3,
      company: 'CloudMaster',
      contact: 'Alice Johnson',
      currentProvider: 'Provider C',
      temperature: 85,
      confidence: 90,
      lastActivity: '1 hour ago',
      signals: 7
    }
  ]);

  const [activeSeizures] = useState<SeizureCampaign[]>([
    {
      id: 1,
      name: 'Q3 Seizure Campaign',
      status: 'active',
      targetLeads: 150,
      seizedLeads: 85,
      conversionRate: 56
    }
  ]);

  const { user } = useUser();
  const { toast } = useToast();

  const fetchWarmLeads = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
      }, 1000);
    } catch (error) {
      console.error('Error fetching warm leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch warm leads.",
        variant: "destructive",
      });
    }
  };

  const executeSeizure = (leadId: number) => {
    console.log(`Executing seizure for lead ${leadId}`);
    toast({
      title: "Seizure Executed",
      description: `Seizure campaign initiated for lead ${leadId}.`,
    });
  };

  useEffect(() => {
    fetchWarmLeads();
  }, [user?.id]);

  const getLeadTemperature = (value: number) => {
    if (value >= 80) return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', label: '🔥 Hot' };
    if (value >= 60) return { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', label: '🌡️ Warm' };
    if (value >= 40) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', label: '🟡 Mild' };
    return { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', label: '❄️ Cold' };
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            Warm Lead Seizure
          </CardTitle>
          <CardDescription>
            Identify and capture high-potential leads from your competitors
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="data-[state=active]:bg-secondary/20">Active Seizures</TabsTrigger>
          <TabsTrigger value="leads" className="data-[state=active]:bg-secondary/20">Warm Leads</TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-secondary/20">Campaign History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Active Seizure Campaign
                  </CardTitle>
                  <CardDescription>
                    Currently targeting {activeSeizures.length} warm leads from competitors
                  </CardDescription>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-2xl font-bold text-primary">{activeSeizures[0]?.targetLeads}</div>
                  <div className="text-sm text-muted-foreground">Target Leads</div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-2xl font-bold text-green-400">{activeSeizures[0]?.seizedLeads}</div>
                  <div className="text-sm text-muted-foreground">Seized Leads</div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-2xl font-bold text-blue-400">{activeSeizures[0]?.conversionRate}%</div>
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {warmLeads.map((lead) => {
              const temp = getLeadTemperature(lead.temperature);
              return (
                <Card key={lead.id} className="bg-card/90 backdrop-blur-sm border hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{lead.company}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={`${temp.bg} ${temp.color} ${temp.border} text-xs`}>
                          {temp.label}
                        </Badge>
                        <Badge>
                          {lead.temperature}°
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {lead.contact} • {lead.currentProvider}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Lead Temperature</div>
                      <Progress value={lead.temperature} className="h-2" />
                      <div className="text-xs text-right">{lead.temperature}°</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Seizure Confidence</div>
                      <Progress value={lead.confidence} className="h-2" />
                      <div className="text-xs text-right">{lead.confidence}%</div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        Last Activity: {lead.lastActivity}
                      </span>
                      <Badge>
                        {lead.signals}
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => executeSeizure(lead.id)}
                      className="w-full"
                    >
                      <Flame className="h-4 w-4 mr-2" />
                      Execute Seizure
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leads Content</CardTitle>
              <CardDescription>Leads Content</CardDescription>
            </CardHeader>
            <CardContent>Leads Content</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaigns Content</CardTitle>
              <CardDescription>Campaigns Content</CardDescription>
            </CardHeader>
            <CardContent>Campaigns Content</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
