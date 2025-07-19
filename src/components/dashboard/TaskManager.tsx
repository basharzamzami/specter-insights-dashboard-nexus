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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useClerkSupabaseAuth } from '@/hooks/useClerkSupabaseAuth';
import { Plus, Calendar, Clock, User, AlertCircle, CheckCircle, Circle, Filter, BarChart3, Target, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { populateWithDemoData, demoTasks } from '@/utils/demoData';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string;
  completed_at: string;
  created_at: string;
  contact?: {
    first_name: string;
    last_name: string;
    company: string;
  };
  deal?: {
    title: string;
    value: number;
  };
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { getUser, isSignedIn } = useClerkSupabaseAuth();

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    contact_id: 'none',
    deal_id: 'none'
  });

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', icon: Circle },
    { value: 'in_progress', label: 'In Progress', icon: Clock },
    { value: 'completed', label: 'Completed', icon: CheckCircle }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter, priorityFilter]);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const [contactsResponse, dealsResponse] = await Promise.all([
        supabase.from('contacts').select('id, first_name, last_name, company')
          .eq('user_id', user.id)
          .order('first_name'),
        supabase.from('deals').select('id, title, value')
          .eq('user_id', user.id)
          .order('title')
      ]);

      // Fetch tasks with demo data fallback - FILTERED BY USER
      const fetchTasks = async () => {
        const { data } = await supabase.from('tasks').select(`
          *,
          contact:contacts(first_name, last_name, company),
          deal:deals(title, value)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        return data || [];
      };

      const tasksData = await populateWithDemoData(fetchTasks, demoTasks, 8);
      
      setTasks(tasksData);
      setContacts(contactsResponse.data || []);
      setDeals(dealsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await getUser();
      if (!user) throw new Error('Not authenticated');

      const taskData = {
        ...newTask,
        user_id: user.id,
        due_date: newTask.due_date || null,
        contact_id: newTask.contact_id === 'none' ? null : newTask.contact_id,
        deal_id: newTask.deal_id === 'none' ? null : newTask.deal_id
      };

      const { error } = await supabase
        .from('tasks')
        .insert([taskData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      setIsAddDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        contact_id: 'none',
        deal_id: 'none'
      });
      fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  // Dummy analytics data
  const taskCompletionTrend = [
    { week: 'Week 1', completed: 24, pending: 18, overdue: 3 },
    { week: 'Week 2', completed: 31, pending: 15, overdue: 2 },
    { week: 'Week 3', completed: 28, pending: 22, overdue: 5 },
    { week: 'Week 4', completed: 35, pending: 12, overdue: 1 },
    { week: 'Week 5', completed: 42, pending: 16, overdue: 4 },
    { week: 'Week 6', completed: 38, pending: 14, overdue: 2 }
  ];

  const priorityDistribution = [
    { name: 'High', value: 25, color: '#ef4444', count: 12 },
    { name: 'Medium', value: 45, color: '#f59e0b', count: 22 },
    { name: 'Low', value: 30, color: '#10b981', count: 15 }
  ];

  const productivityStats = [
    {
      title: "Total Tasks",
      value: filteredTasks.length.toString(),
      icon: Activity,
      color: "text-blue-600",
      trend: "+8 this week"
    },
    {
      title: "Completed",
      value: filteredTasks.filter(t => t.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      trend: "+15 this week"
    },
    {
      title: "Completion Rate",
      value: `${Math.round((filteredTasks.filter(t => t.status === 'completed').length / filteredTasks.length) * 100 || 0)}%`,
      icon: Target,
      color: "text-purple-600",
      trend: "+5% vs last week"
    },
    {
      title: "Avg. Daily Tasks",
      value: "6.2",
      icon: TrendingUp,
      color: "text-orange-600",
      trend: "+1.2 vs last month"
    }
  ];

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updates: any = { status: newStatus };
      if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task status updated",
      });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = priorities.find(p => p.value === priority);
    return priorityConfig ? priorityConfig : { label: priority, color: 'bg-gray-500' };
  };

  const getStatusIcon = (status: string) => {
    const statusConfig = statuses.find(s => s.value === status);
    return statusConfig ? statusConfig.icon : Circle;
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !tasks.find(t => t.due_date === dueDate)?.completed_at;
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      change: "+5 new",
      color: "text-blue-600"
    },
    {
      title: "Pending",
      value: getTasksByStatus('pending').length,
      change: "2 overdue",
      color: "text-orange-600"
    },
    {
      title: "In Progress",
      value: getTasksByStatus('in_progress').length,
      change: "3 due today",
      color: "text-yellow-600"
    },
    {
      title: "Completed",
      value: getTasksByStatus('completed').length,
      change: "+8 this week",
      color: "text-green-600"
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
          <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground">Organize and track your tasks and activities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your workflow</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Follow up with client"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Task details and notes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="datetime-local"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_id">Related Contact</Label>
                  <Select value={newTask.contact_id} onValueChange={(value) => setNewTask(prev => ({ ...prev, contact_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No contact</SelectItem>
                      {contacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.first_name} {contact.last_name} ({contact.company})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deal_id">Related Deal</Label>
                  <Select value={newTask.deal_id} onValueChange={(value) => setNewTask(prev => ({ ...prev, deal_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No deal</SelectItem>
                      {deals.map(deal => (
                        <SelectItem key={deal.id} value={deal.id}>
                          {deal.title} (${deal.value?.toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {productivityStats.map((stat, index) => {
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

      {/* Productivity Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Task Completion Trend</span>
            </CardTitle>
            <CardDescription>Weekly task completion patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskCompletionTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" className="fill-muted-foreground" fontSize={12} />
                <YAxis className="fill-muted-foreground" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" stackId="a" />
                <Bar dataKey="pending" fill="#f59e0b" stackId="a" />
                <Bar dataKey="overdue" fill="#ef4444" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Priority Distribution</span>
            </CardTitle>
            <CardDescription>Tasks breakdown by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={priorityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {priorityDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.count}</div>
                      <div className="text-xs text-muted-foreground">{item.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {priorities.map(priority => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
          <CardDescription>Manage your tasks and track progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const priorityConfig = getPriorityBadge(task.priority);
              const StatusIcon = getStatusIcon(task.status);
              const overdue = task.due_date && isOverdue(task.due_date);

              return (
                <div key={task.id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${overdue ? 'border-red-200 bg-red-50' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={(checked) => 
                        updateTaskStatus(task.id, checked ? 'completed' : 'pending')
                      }
                    />
                    
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`h-4 w-4 ${
                        task.status === 'completed' ? 'text-green-600' :
                        task.status === 'in_progress' ? 'text-yellow-600' :
                        'text-gray-400'
                      }`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <Badge className={`${priorityConfig.color} text-white`}>
                          {priorityConfig.label}
                        </Badge>
                        {overdue && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {task.due_date && (
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                        
                        {task.contact && (
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {task.contact.first_name} {task.contact.last_name}
                          </span>
                        )}
                        
                        {task.deal && (
                          <span className="flex items-center">
                            Deal: {task.deal.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select value={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(status => (
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
            
            {filteredTasks.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks found</p>
                <p className="text-sm text-muted-foreground">Create your first task to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}