import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, DollarSign, Calendar, User, Percent, Target, TrendingUp, BarChart } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  value: number;
  stage: string;
  probability: number;
  expected_close_date: string;
  status: string;
  contact_id: string;
  created_at: string;
  contact?: {
    first_name: string;
    last_name: string;
    email: string;
    company: string;
  };
}

interface Pipeline {
  id: string;
  name: string;
  stages: Array<{
    id: string;
    name: string;
    order: number;
  }>;
}

export function SalesPipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [selectedStage, setSelectedStage] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newDeal, setNewDeal] = useState({
    title: '',
    description: '',
    value: '',
    stage: '',
    probability: '50',
    expected_close_date: '',
    contact_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch pipeline stages
      const { data: pipelineData } = await supabase
        .from('pipelines')
        .select('*')
        .limit(1)
        .single();

      if (pipelineData) {
        const pipeline: Pipeline = {
          ...pipelineData,
          stages: pipelineData.stages as Array<{
            id: string;
            name: string;
            order: number;
          }>
        };
        setPipeline(pipeline);
        setNewDeal(prev => ({ ...prev, stage: pipeline.stages[0]?.name || '' }));
      }

      // Fetch deals with contact info
      const { data: dealsData } = await supabase
        .from('deals')
        .select(`
          *,
          contact:contacts(first_name, last_name, email, company)
        `)
        .order('created_at', { ascending: false });

      // Fetch contacts for dropdown
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('id, first_name, last_name, email, company')
        .order('first_name');

      setDeals(dealsData || []);
      setContacts(contactsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sales data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const dealData = {
        ...newDeal,
        user_id: user.id,
        pipeline_id: pipeline?.id,
        value: parseFloat(newDeal.value) || 0,
        probability: parseInt(newDeal.probability) || 50,
        expected_close_date: newDeal.expected_close_date || null,
        contact_id: newDeal.contact_id || null
      };

      const { error } = await supabase
        .from('deals')
        .insert([dealData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deal created successfully",
      });

      setIsAddDialogOpen(false);
      setNewDeal({
        title: '',
        description: '',
        value: '',
        stage: pipeline?.stages[0]?.name || '',
        probability: '50',
        expected_close_date: '',
        contact_id: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating deal:', error);
      toast({
        title: "Error",
        description: "Failed to create deal",
        variant: "destructive",
      });
    }
  };

  const updateDealStage = async (dealId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ stage: newStage })
        .eq('id', dealId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deal stage updated",
      });
      fetchData();
    } catch (error) {
      console.error('Error updating deal:', error);
      toast({
        title: "Error",
        description: "Failed to update deal stage",
        variant: "destructive",
      });
    }
  };

  const getStageDeals = (stageName: string) => {
    return deals.filter(deal => deal.stage === stageName);
  };

  const getStageValue = (stageName: string) => {
    return getStageDeals(stageName).reduce((sum, deal) => sum + deal.value, 0);
  };

  const getTotalPipelineValue = () => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const getWeightedPipelineValue = () => {
    return deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  };

  const getConversionRate = () => {
    const closedWon = deals.filter(d => d.stage === 'Closed Won').length;
    return deals.length > 0 ? Math.round((closedWon / deals.length) * 100) : 0;
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const stats = [
    {
      title: "Total Pipeline Value",
      value: `$${getTotalPipelineValue().toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Weighted Value",
      value: `$${getWeightedPipelineValue().toLocaleString()}`,
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Total Deals",
      value: deals.length,
      icon: BarChart,
      color: "text-purple-600"
    },
    {
      title: "Conversion Rate",
      value: `${getConversionRate()}%`,
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">Track your deals and sales progress</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
              <DialogDescription>Create a new deal in your sales pipeline</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <Label htmlFor="title">Deal Title</Label>
                <Input
                  id="title"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Acme Corp - Enterprise License"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDeal.description}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deal details and notes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">Deal Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={newDeal.probability}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, probability: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={newDeal.stage} onValueChange={(value) => setNewDeal(prev => ({ ...prev, stage: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipeline?.stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.name}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact_id">Contact</Label>
                  <Select value={newDeal.contact_id} onValueChange={(value) => setNewDeal(prev => ({ ...prev, contact_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.first_name} {contact.last_name} ({contact.company})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="expected_close_date">Expected Close Date</Label>
                <Input
                  id="expected_close_date"
                  type="date"
                  value={newDeal.expected_close_date}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, expected_close_date: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Deal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pipeline Stages */}
      {pipeline && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {pipeline.stages.map((stage) => {
            const stageDeals = getStageDeals(stage.name);
            const stageValue = getStageValue(stage.name);
            
            return (
              <Card key={stage.id} className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                    <Badge variant="secondary">{stageDeals.length}</Badge>
                  </div>
                  <CardDescription>
                    ${stageValue.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm leading-tight">{deal.title}</h4>
                          <Badge className={getProbabilityColor(deal.probability)}>
                            {deal.probability}%
                          </Badge>
                        </div>
                        
                        <div className="text-lg font-bold text-primary">
                          ${deal.value.toLocaleString()}
                        </div>
                        
                        {deal.contact && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            {deal.contact.first_name} {deal.contact.last_name}
                            {deal.contact.company && ` • ${deal.contact.company}`}
                          </div>
                        )}
                        
                        {deal.expected_close_date && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(deal.expected_close_date).toLocaleDateString()}
                          </div>
                        )}

                        <Select value={deal.stage} onValueChange={(value) => updateDealStage(deal.id, value)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {pipeline.stages.map(s => (
                              <SelectItem key={s.id} value={s.name}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                  
                  {stageDeals.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No deals in this stage
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}