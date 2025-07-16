import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Mail, Send, Eye, MousePointer, Users, Calendar, BarChart3, TrendingUp } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_type: string;
  is_active: boolean;
  created_at: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipient_count: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  status: string;
  scheduled_at: string;
  sent_at: string;
  created_at: string;
}

export function EmailMarketing() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    template_type: 'general'
  });

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    template_id: '',
    scheduled_at: ''
  });

  const templateTypes = [
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'general', label: 'General' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templatesResponse, campaignsResponse] = await Promise.all([
        supabase.from('email_templates').select('*').order('created_at', { ascending: false }),
        supabase.from('email_campaigns').select('*').order('created_at', { ascending: false })
      ]);

      setTemplates(templatesResponse.data || []);
      setCampaigns(campaignsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('email_templates')
        .insert([{ ...newTemplate, user_id: user.id }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email template created successfully",
      });

      setIsTemplateDialogOpen(false);
      setNewTemplate({ name: '', subject: '', content: '', template_type: 'general' });
      fetchData();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create email template",
        variant: "destructive",
      });
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get contact count for recipient_count
      const { count } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      const campaignData = {
        ...newCampaign,
        user_id: user.id,
        recipient_count: count || 0,
        scheduled_at: newCampaign.scheduled_at || null
      };

      const { error } = await supabase
        .from('email_campaigns')
        .insert([campaignData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email campaign created successfully",
      });

      setIsCampaignDialogOpen(false);
      setNewCampaign({ name: '', subject: '', content: '', template_id: '', scheduled_at: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create email campaign",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', color: 'bg-gray-500' },
      scheduled: { label: 'Scheduled', color: 'bg-blue-500' },
      sending: { label: 'Sending', color: 'bg-yellow-500' },
      sent: { label: 'Sent', color: 'bg-green-500' },
      failed: { label: 'Failed', color: 'bg-red-500' }
    };
    return statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-500' };
  };

  const getOpenRate = (campaign: EmailCampaign) => {
    return campaign.sent_count > 0 ? Math.round((campaign.opened_count / campaign.sent_count) * 100) : 0;
  };

  const getClickRate = (campaign: EmailCampaign) => {
    return campaign.opened_count > 0 ? Math.round((campaign.clicked_count / campaign.opened_count) * 100) : 0;
  };

  const campaignStats = [
    {
      title: "Total Campaigns",
      value: campaigns.length,
      icon: Mail,
      color: "text-blue-600"
    },
    {
      title: "Avg Open Rate",
      value: `${campaigns.length > 0 ? Math.round(campaigns.reduce((sum, c) => sum + getOpenRate(c), 0) / campaigns.length) : 0}%`,
      icon: Eye,
      color: "text-green-600"
    },
    {
      title: "Avg Click Rate",
      value: `${campaigns.length > 0 ? Math.round(campaigns.reduce((sum, c) => sum + getClickRate(c), 0) / campaigns.length) : 0}%`,
      icon: MousePointer,
      color: "text-purple-600"
    },
    {
      title: "Total Sent",
      value: campaigns.reduce((sum, c) => sum + c.sent_count, 0).toLocaleString(),
      icon: Send,
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
          <h1 className="text-3xl font-bold tracking-tight">Email Marketing</h1>
          <p className="text-muted-foreground">Create and manage email campaigns</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Email Template</DialogTitle>
                <DialogDescription>Create a reusable email template</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template_name">Template Name</Label>
                    <Input
                      id="template_name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Welcome Email Template"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="template_type">Template Type</Label>
                    <Select value={newTemplate.template_type} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, template_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templateTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="template_subject">Subject Line</Label>
                  <Input
                    id="template_subject"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Welcome to our platform!"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="template_content">Email Content</Label>
                  <Textarea
                    id="template_content"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Email content with HTML support..."
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Template</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Email Campaign</DialogTitle>
                <DialogDescription>Launch a new email marketing campaign</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <Label htmlFor="campaign_name">Campaign Name</Label>
                  <Input
                    id="campaign_name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Monthly Newsletter - January 2024"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template_select">Use Template (Optional)</Label>
                    <Select value={newCampaign.template_id} onValueChange={(value) => {
                      setNewCampaign(prev => ({ ...prev, template_id: value }));
                      const template = templates.find(t => t.id === value);
                      if (template) {
                        setNewCampaign(prev => ({
                          ...prev,
                          subject: template.subject,
                          content: template.content
                        }));
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scheduled_at">Schedule (Optional)</Label>
                    <Input
                      id="scheduled_at"
                      type="datetime-local"
                      value={newCampaign.scheduled_at}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduled_at: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="campaign_subject">Subject Line</Label>
                  <Input
                    id="campaign_subject"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Your monthly update is here!"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="campaign_content">Email Content</Label>
                  <Textarea
                    id="campaign_content"
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Email content with HTML support..."
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Campaign</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {campaignStats.map((stat, index) => {
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>Manage your email marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const statusConfig = getStatusBadge(campaign.status);
                  const openRate = getOpenRate(campaign);
                  const clickRate = getClickRate(campaign);

                  return (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{campaign.name}</h3>
                          <Badge className={`${statusConfig.color} text-white`}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {campaign.recipient_count} recipients
                          </span>
                          {campaign.sent_count > 0 && (
                            <>
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {openRate}% opened
                              </span>
                              <span className="flex items-center">
                                <MousePointer className="h-3 w-3 mr-1" />
                                {clickRate}% clicked
                              </span>
                            </>
                          )}
                          {campaign.scheduled_at && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(campaign.scheduled_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {campaign.status === 'draft' && (
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {campaigns.length === 0 && (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No campaigns created yet</p>
                    <p className="text-sm text-muted-foreground">Create your first email campaign to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage your reusable email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {templateTypes.find(t => t.value === template.template_type)?.label}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Subject: {template.subject}</p>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {template.content.substring(0, 100)}...
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(template.created_at).toLocaleDateString()}
                          </span>
                          <Button variant="outline" size="sm">
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {templates.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No templates created yet</p>
                    <p className="text-sm text-muted-foreground">Create your first email template to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}