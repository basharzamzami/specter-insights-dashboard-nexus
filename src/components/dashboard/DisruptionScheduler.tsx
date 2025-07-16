import { useState } from "react";
import { Calendar, Clock, Target, Zap, Plus, Trash2, Play, Pause } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DisruptionOperation {
  id: string;
  name: string;
  target: string;
  type: "seo" | "ads" | "social" | "content" | "technical";
  priority: "high" | "medium" | "low";
  status: "scheduled" | "active" | "completed" | "paused";
  scheduledDate: string;
  estimatedDuration: string;
  description: string;
}

const mockOperations: DisruptionOperation[] = [
  {
    id: "1",
    name: "Keyword Hijacking - Enterprise Solutions",
    target: "TechCorp",
    type: "seo",
    priority: "high",
    status: "scheduled",
    scheduledDate: "2024-01-20T09:00",
    estimatedDuration: "2 weeks",
    description: "Target their top-performing enterprise keywords with superior content and aggressive bidding strategy."
  },
  {
    id: "2", 
    name: "Negative Social Campaign",
    target: "DataSolutions",
    type: "social",
    priority: "medium",
    status: "active",
    scheduledDate: "2024-01-15T14:00",
    estimatedDuration: "1 month",
    description: "Amplify customer complaints and service issues through strategic social media engagement."
  },
  {
    id: "3",
    name: "Ad Copy Disruption",
    target: "CloudInnovate", 
    type: "ads",
    priority: "high",
    status: "scheduled",
    scheduledDate: "2024-01-25T08:00",
    estimatedDuration: "3 weeks",
    description: "Launch counter-ads highlighting their recent security vulnerabilities and downtime issues."
  }
];

export const DisruptionScheduler = () => {
  const [operations, setOperations] = useState<DisruptionOperation[]>(mockOperations);
  const [newOperation, setNewOperation] = useState<Partial<DisruptionOperation>>({
    type: 'seo',
    priority: 'medium'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "scheduled": return "secondary";
      case "completed": return "muted";
      case "paused": return "warning";
      default: return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "seo": return "🎯";
      case "ads": return "💰";
      case "social": return "📱";
      case "content": return "📝";
      case "technical": return "⚙️";
      default: return "🔍";
    }
  };

  const handleCreateOperation = () => {
    if (!newOperation.name || !newOperation.target) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const operation: DisruptionOperation = {
      id: Date.now().toString(),
      name: newOperation.name!,
      target: newOperation.target!,
      type: newOperation.type as any || "seo",
      priority: newOperation.priority as any || "medium",
      status: "scheduled",
      scheduledDate: newOperation.scheduledDate || new Date().toISOString(),
      estimatedDuration: newOperation.estimatedDuration || "1 week",
      description: newOperation.description || ""
    };

    setOperations(prev => [operation, ...prev]);
    setNewOperation({
      type: 'seo',
      priority: 'medium'
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Operation Scheduled",
      description: `${operation.name} has been added to the disruption timeline.`,
    });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setOperations(prev => prev.map(op => 
      op.id === id ? { ...op, status: newStatus as any } : op
    ));
    
    toast({
      title: "Status Updated",
      description: `Operation status changed to ${newStatus}.`,
    });
  };

  const handleDeleteOperation = (id: string) => {
    setOperations(prev => prev.filter(op => op.id !== id));
    toast({
      title: "Operation Deleted",
      description: "Operation has been removed from the schedule.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="h-6 w-6" />
            Disruption Scheduler
          </h2>
          <p className="text-muted-foreground">Plan and execute strategic market disruption operations</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-glow">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Operation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Schedule New Disruption Operation</DialogTitle>
              <DialogDescription>
                Configure a strategic operation to disrupt competitor activities
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Operation Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Keyword Hijacking Campaign"
                  value={newOperation.name || ""}
                  onChange={(e) => setNewOperation(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target">Target Competitor</Label>
                <Input
                  id="target"
                  placeholder="e.g., TechCorp"
                  value={newOperation.target || ""}
                  onChange={(e) => setNewOperation(prev => ({ ...prev, target: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Operation Type</Label>
                  <Select onValueChange={(value) => setNewOperation(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seo">SEO Disruption</SelectItem>
                      <SelectItem value="ads">Ad Campaign</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="content">Content Strategy</SelectItem>
                      <SelectItem value="technical">Technical Attack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select onValueChange={(value) => setNewOperation(prev => ({ ...prev, priority: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={newOperation.scheduledDate || ""}
                    onChange={(e) => setNewOperation(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 2 weeks"
                    value={newOperation.estimatedDuration || ""}
                    onChange={(e) => setNewOperation(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Operation Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the strategic objectives and tactics..."
                  value={newOperation.description || ""}
                  onChange={(e) => setNewOperation(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button onClick={handleCreateOperation} className="w-full btn-glow">
                <Zap className="h-4 w-4 mr-2" />
                Schedule Operation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Operations Timeline */}
      <div className="space-y-4">
        {operations.map((operation, index) => (
          <Card key={operation.id} className={`card-hover animate-fade-in animate-delay-${(index % 4) * 100}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getTypeIcon(operation.type)}</div>
                  <div>
                    <CardTitle className="text-lg">{operation.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Target: {operation.target}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(operation.status) as any}>
                    {operation.status}
                  </Badge>
                  <Badge variant="outline" className={
                    operation.priority === "high" ? "border-destructive text-destructive" :
                    operation.priority === "medium" ? "border-warning text-warning" :
                    "border-muted-foreground text-muted-foreground"
                  }>
                    {operation.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{operation.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(operation.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{operation.estimatedDuration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {operation.status === "scheduled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(operation.id, "active")}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                    
                    {operation.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(operation.id, "paused")}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteOperation(operation.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {operations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No Operations Scheduled</p>
            <p className="text-muted-foreground mb-4">Create your first disruption operation to begin strategic market manipulation.</p>
            <Button onClick={() => setIsDialogOpen(true)} className="btn-glow">
              <Plus className="h-4 w-4 mr-2" />
              Schedule First Operation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};