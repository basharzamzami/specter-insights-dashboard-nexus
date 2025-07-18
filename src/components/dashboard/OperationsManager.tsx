import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Edit3, 
  Calendar, 
  Send, 
  Eye, 
  TrendingUp, 
  Target, 
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
  Users,
  BarChart3
} from "lucide-react";

interface Operation {
  id: string;
  type: 'edit' | 'schedule';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  platform?: string;
  content?: string;
}

export const OperationsManager = () => {
  const [operations, setOperations] = useState<Operation[]>([
    {
      id: '1',
      type: 'edit',
      title: 'Update LinkedIn Company Page',
      description: 'Refresh company description with new AI capabilities and competitive positioning',
      status: 'in_progress',
      priority: 'high',
      assignee: 'Sarah Chen',
      dueDate: '2024-07-20',
      platform: 'linkedin'
    },
    {
      id: '2',
      type: 'schedule',
      title: 'Q3 Product Launch Campaign',
      description: 'Schedule social media posts for new AI features launch across all platforms',
      status: 'pending',
      priority: 'high',
      assignee: 'Mike Rodriguez',
      dueDate: '2024-07-25',
      content: 'Announcing our revolutionary AI-powered competitive intelligence features!'
    },
    {
      id: '3',
      type: 'edit',
      title: 'Competitor Analysis Blog Post',
      description: 'Edit and optimize blog post about latest market trends and competitor insights',
      status: 'review',
      priority: 'medium',
      assignee: 'Emily Foster',
      dueDate: '2024-07-22'
    },
    {
      id: '4',
      type: 'schedule',
      title: 'Weekly Newsletter',
      description: 'Schedule weekly competitive intelligence newsletter for Tuesday morning',
      status: 'completed',
      priority: 'medium',
      assignee: 'David Kim',
      dueDate: '2024-07-16'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    content: string;
    platform: string;
    priority: 'low' | 'medium' | 'high';
    assignee: string;
    dueDate: string;
  }>({
    title: '',
    description: '',
    content: '',
    platform: 'linkedin', // Set a default value instead of empty string
    priority: 'medium',
    assignee: '',
    dueDate: ''
  });

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'review': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'edit' ? Edit3 : Calendar;
  };

  const handleEditOperation = (operation: Operation) => {
    setSelectedOperation(operation);
    setEditForm({
      title: operation.title,
      description: operation.description,
      content: operation.content || '',
      platform: operation.platform || 'linkedin', // Use default instead of empty string
      priority: operation.priority,
      assignee: operation.assignee || '',
      dueDate: operation.dueDate || ''
    });
    setIsDialogOpen(true);
  };

  const handleSaveOperation = async () => {
    if (!selectedOperation) return;

    try {
      // Use the operational-mode edge function to save operation updates
      const { data, error } = await supabase.functions.invoke('operational-mode', {
        body: {
          action: 'update_operation',
          operation_id: selectedOperation.id,
          operation_data: {
            title: editForm.title,
            description: editForm.description,
            content: editForm.content,
            platform: editForm.platform,
            priority: editForm.priority,
            assignee: editForm.assignee,
            due_date: editForm.dueDate
          }
        }
      });

      if (error) throw error;

      const updatedOperations = operations.map(op => 
        op.id === selectedOperation.id 
          ? {
              ...op,
              title: editForm.title,
              description: editForm.description,
              content: editForm.content,
              platform: editForm.platform,
              priority: editForm.priority,
              assignee: editForm.assignee,
              dueDate: editForm.dueDate
            }
          : op
      );

      setOperations(updatedOperations);
      setIsDialogOpen(false);
      setSelectedOperation(null);
      
      toast({
        title: "Operation Updated",
        description: "The operation has been successfully updated and logged.",
      });
    } catch (error) {
      console.error('Error updating operation:', error);
      toast({
        title: "Error",
        description: "Failed to update operation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (operationId: string, newStatus: Operation['status']) => {
    try {
      // Update status locally first for immediate UI feedback
      const updatedOperations = operations.map(op => 
        op.id === operationId ? { ...op, status: newStatus } : op
      );
      setOperations(updatedOperations);
      
      // Try to log to edge function, but don't fail if it's down
      try {
        await supabase.functions.invoke('operational-mode', {
          body: {
            action: 'status_change',
            operation_id: operationId,
            new_status: newStatus,
            operation_type: operations.find(op => op.id === operationId)?.type || 'edit'
          }
        });
      } catch (edgeError) {
        console.warn('Edge function unavailable, continuing locally:', edgeError);
      }
      
      toast({
        title: "Status Updated",
        description: `Operation status changed to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error", 
        description: "Failed to update operation status.",
        variant: "destructive",
      });
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const statusFlow = {
      'pending': ['in_progress'],
      'in_progress': ['review', 'completed'],
      'review': ['in_progress', 'completed'],
      'completed': ['review']
    };
    return statusFlow[currentStatus as keyof typeof statusFlow] || [];
  };

  const stats = [
    { title: "Active Operations", value: operations.filter(op => op.status !== 'completed').length, icon: Zap, color: "text-blue-600" },
    { title: "High Priority", value: operations.filter(op => op.priority === 'high').length, icon: Target, color: "text-red-600" },
    { title: "In Review", value: operations.filter(op => op.status === 'review').length, icon: Eye, color: "text-purple-600" },
    { title: "Completed Today", value: operations.filter(op => op.status === 'completed').length, icon: CheckCircle, color: "text-green-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Operations Manager</h2>
          <p className="text-muted-foreground">Manage content editing and scheduling operations</p>
        </div>
        <Button className="btn-glow" onClick={() => setIsAnalyticsOpen(true)}>
          <TrendingUp className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-hover">
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

      {/* Operations Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {operations.map((operation) => {
          const TypeIcon = getTypeIcon(operation.type);
          return (
            <Card key={operation.id} className="card-hover group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${operation.type === 'edit' ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
                      <TypeIcon className={`h-4 w-4 ${operation.type === 'edit' ? 'text-blue-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{operation.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{operation.description}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(operation.priority)}>
                    {operation.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(operation.status)}>
                    {operation.status.replace('_', ' ')}
                  </Badge>
                  {operation.platform && (
                    <Badge variant="outline">{operation.platform}</Badge>
                  )}
                </div>
                
                {operation.assignee && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{operation.assignee}</span>
                  </div>
                )}
                
                {operation.dueDate && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Due: {new Date(operation.dueDate).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    {getStatusOptions(operation.status).map((status) => (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(operation.id, status as Operation['status'])}
                        className="hover:scale-105 transition-transform"
                      >
                        {status === 'in_progress' && <Zap className="h-3 w-3 mr-1" />}
                        {status === 'review' && <Eye className="h-3 w-3 mr-1" />}
                        {status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {status.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditOperation(operation)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Operation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Operation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            {selectedOperation?.type === 'schedule' && (
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter the content to be scheduled..."
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={editForm.priority} onValueChange={(value) => setEditForm(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={editForm.platform} onValueChange={(value) => setEditForm(prev => ({ ...prev, platform: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  value={editForm.assignee}
                  onChange={(e) => setEditForm(prev => ({ ...prev, assignee: e.target.value }))}
                  placeholder="Assign to team member"
                />
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveOperation}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Operations Analytics Dashboard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Analytics Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">94%</div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">2.4h</div>
                    <p className="text-sm text-muted-foreground">Avg. Completion</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">127</div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">$47K</div>
                    <p className="text-sm text-muted-foreground">Revenue Impact</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mock Analytics Charts */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Operation Types Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content Editing</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Post Scheduling</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Campaign Management</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sarah Chen</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">23 ops</span>
                        <span className="text-xs text-green-600">↑15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mike Rodriguez</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">19 ops</span>
                        <span className="text-xs text-green-600">↑8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emily Foster</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">17 ops</span>
                        <span className="text-xs text-blue-600">→3%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">David Kim</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">21 ops</span>
                        <span className="text-xs text-green-600">↑12%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};