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
import { Plus, Search, Phone, Mail, Building, Calendar, MoreHorizontal, Star, TrendingUp, Users, Target, BarChart3, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  lead_source: string;
  lead_status: string;
  lead_score: number;
  tags: string[];
  notes: string;
  last_contacted_at: string;
  created_at: string;
}

export function LeadsManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
    lead_source: 'website',
    lead_status: 'new',
    tags: '',
    notes: ''
  });

  const leadStatuses = [
    { value: 'new', label: 'New', color: 'bg-blue-500' },
    { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
    { value: 'qualified', label: 'Qualified', color: 'bg-green-500' },
    { value: 'nurturing', label: 'Nurturing', color: 'bg-purple-500' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-500' }
  ];

  const leadSources = ['website', 'social_media', 'referral', 'email_campaign', 'cold_outreach', 'event', 'other'];

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter, sourceFilter]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.lead_status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(contact => contact.lead_source === sourceFilter);
    }

    setFilteredContacts(filtered);
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const contactData = {
        ...newContact,
        user_id: user.id,
        tags: newContact.tags ? newContact.tags.split(',').map(tag => tag.trim()) : [],
        lead_score: Math.floor(Math.random() * 100) // Random score for demo
      };

      const { error } = await supabase
        .from('contacts')
        .insert([contactData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact created successfully",
      });

      setIsAddDialogOpen(false);
      setNewContact({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        job_title: '',
        lead_source: 'website',
        lead_status: 'new',
        tags: '',
        notes: ''
      });
      fetchContacts();
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: "Error",
        description: "Failed to create contact",
        variant: "destructive",
      });
    }
  };

  // Dummy analytics data
  const leadSourceData = [
    { source: 'Website', leads: 45, conversion: 23 },
    { source: 'Social Media', leads: 32, conversion: 18 },
    { source: 'Email Campaign', leads: 28, conversion: 35 },
    { source: 'Referral', leads: 22, conversion: 41 },
    { source: 'Cold Outreach', leads: 15, conversion: 12 },
    { source: 'Events', leads: 12, conversion: 28 }
  ];

  const conversionTrendData = [
    { month: 'Jan', leads: 124, qualified: 78, converted: 23 },
    { month: 'Feb', leads: 142, qualified: 89, converted: 31 },
    { month: 'Mar', leads: 118, qualified: 72, converted: 18 },
    { month: 'Apr', leads: 156, qualified: 102, converted: 38 },
    { month: 'May', leads: 178, qualified: 125, converted: 45 },
    { month: 'Jun', leads: 195, qualified: 142, converted: 52 }
  ];

  const statusDistribution = [
    { name: 'New', value: 35, color: '#8b5cf6', count: 68 },
    { name: 'Qualified', value: 28, color: '#06b6d4', count: 54 },
    { name: 'Nurturing', value: 22, color: '#10b981', count: 42 },
    { name: 'Converted', value: 10, color: '#f59e0b', count: 19 },
    { name: 'Lost', value: 5, color: '#ef4444', count: 12 }
  ];

  const leadStats = [
    {
      title: "Total Leads",
      value: filteredContacts.length.toString(),
      icon: Users,
      color: "text-blue-600",
      trend: "+12 this week"
    },
    {
      title: "Qualified Leads",
      value: filteredContacts.filter(c => c.lead_status === 'qualified').length.toString(),
      icon: UserCheck,
      color: "text-green-600",
      trend: "+8 this week"
    },
    {
      title: "Conversion Rate",
      value: "26.7%",
      icon: Target,
      color: "text-purple-600",
      trend: "+3.2% vs last month"
    },
    {
      title: "Avg. Lead Score",
      value: Math.round(filteredContacts.reduce((acc, c) => acc + c.lead_score, 0) / filteredContacts.length || 0).toString(),
      icon: TrendingUp,
      color: "text-orange-600",
      trend: "+5 points"
    }
  ];

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ lead_status: newStatus })
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact status updated",
      });
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = leadStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig : { label: status, color: 'bg-gray-500' };
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const stats = [
    {
      title: "Total Leads",
      value: contacts.length,
      icon: Users,
      change: "+12%",
      color: "text-blue-600"
    },
    {
      title: "Qualified Leads",
      value: contacts.filter(c => c.lead_status === 'qualified').length,
      icon: Target,
      change: "+8%",
      color: "text-green-600"
    },
    {
      title: "Avg Lead Score",
      value: Math.round(contacts.reduce((sum, c) => sum + c.lead_score, 0) / contacts.length || 0),
      icon: Star,
      change: "+5%",
      color: "text-yellow-600"
    },
    {
      title: "Conversion Rate",
      value: `${Math.round((contacts.filter(c => c.lead_status === 'closed').length / contacts.length) * 100 || 0)}%`,
      icon: TrendingUp,
      change: "+3%",
      color: "text-purple-600"
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
          <h1 className="text-3xl font-bold tracking-tight">Leads & Contacts</h1>
          <p className="text-muted-foreground">Manage your leads and track conversions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>Create a new lead or contact in your CRM</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={newContact.first_name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, first_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={newContact.last_name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, last_name: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newContact.company}
                    onChange={(e) => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    value={newContact.job_title}
                    onChange={(e) => setNewContact(prev => ({ ...prev, job_title: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lead_source">Lead Source</Label>
                  <Select value={newContact.lead_source} onValueChange={(value) => setNewContact(prev => ({ ...prev, lead_source: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leadSources.map(source => (
                        <SelectItem key={source} value={source}>
                          {source.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lead_status">Lead Status</Label>
                  <Select value={newContact.lead_status} onValueChange={(value) => setNewContact(prev => ({ ...prev, lead_status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leadStatuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newContact.tags}
                  onChange={(e) => setNewContact(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g. VIP, Enterprise, Hot Lead"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newContact.notes}
                  onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this contact..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Contact</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lead Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {leadStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Dashboard */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Lead Sources</span>
            </CardTitle>
            <CardDescription>Lead generation by source and conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadSourceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="source" className="fill-muted-foreground" fontSize={12} />
                <YAxis className="fill-muted-foreground" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Bar dataKey="leads" fill="hsl(var(--primary))" />
                <Bar dataKey="conversion" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Conversion Funnel</span>
            </CardTitle>
            <CardDescription>Lead progression over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="fill-muted-foreground" fontSize={12} />
                <YAxis className="fill-muted-foreground" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Line type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="qualified" stroke="hsl(var(--secondary))" strokeWidth={2} />
                <Line type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lead Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Lead Status Distribution</span>
          </CardTitle>
          <CardDescription>Current lead pipeline breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {statusDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{item.count} leads</div>
                    <div className="text-sm text-muted-foreground">{item.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {leadStatuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {leadSources.map(source => (
              <SelectItem key={source} value={source}>
                {source.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
          <CardDescription>Manage and track all your leads and contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContacts.map((contact) => {
              const statusConfig = getStatusBadge(contact.lead_status);
              return (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {contact.first_name?.[0]}{contact.last_name?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{contact.first_name} {contact.last_name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{contact.email}</span>
                        {contact.phone && (
                          <>
                            <Phone className="h-3 w-3 ml-2" />
                            <span>{contact.phone}</span>
                          </>
                        )}
                        {contact.company && (
                          <>
                            <Building className="h-3 w-3 ml-2" />
                            <span>{contact.company}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={`${statusConfig.color} text-white`}>
                          {statusConfig.label}
                        </Badge>
                        <div className={`text-sm font-medium ${getLeadScoreColor(contact.lead_score)}`}>
                          Score: {contact.lead_score}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Source: {contact.lead_source?.replace('_', ' ')}
                      </p>
                    </div>
                    
                    <Select value={contact.lead_status} onValueChange={(value) => updateContactStatus(contact.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {leadStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
            
            {filteredContacts.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No contacts found</p>
                <p className="text-sm text-muted-foreground">Add your first contact to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}