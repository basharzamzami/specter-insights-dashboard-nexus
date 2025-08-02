import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Play, Pause, CheckCircle, Clock, Users, AlertTriangle, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExecutionTask {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  priority: "high" | "medium" | "low";
  owner: string;
  deadline: string;
  progress: number;
  dependencies: string[];
  resources_needed: string[];
}

interface ExecutionPlan {
  id: string;
  strategy_title: string;
  start_date: string;
  estimated_completion: string;
  overall_progress: number;
  active_tasks: number;
  completed_tasks: number;
  total_tasks: number;
  budget_allocated: number;
  budget_spent: number;
  team_members: {
    name: string;
    role: string;
    availability: number;
  }[];
  phases: {
    name: string;
    status: "pending" | "active" | "completed";
    progress: number;
    tasks: ExecutionTask[];
  }[];
  risks: {
    description: string;
    probability: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    mitigation: string;
  }[];
}

export default function ExecutionCenter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [executionPlan, setExecutionPlan] = useState<ExecutionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const strategyId = searchParams.get('strategy_id');
  const strategyTitle = searchParams.get('title') || 'Strategy Execution';

  useEffect(() => {
    loadExecutionPlan();
  }, []);

  const loadExecutionPlan = async () => {
    setLoading(true);
    try {
      // Generate or fetch execution plan
      const plan = generateExecutionPlan();
      setExecutionPlan(plan);
      
      toast({
        title: "Execution Center Loaded",
        description: "Strategy execution plan initialized and ready.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error loading execution plan:', error);
      toast({
        title: "Error",
        description: "Failed to load execution plan.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateExecutionPlan = (): ExecutionPlan => {
    return {
      id: strategyId || Math.random().toString(36).substr(2, 9),
      strategy_title: strategyTitle,
      start_date: new Date().toISOString().split('T')[0],
      estimated_completion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      overall_progress: 15,
      active_tasks: 8,
      completed_tasks: 2,
      total_tasks: 24,
      budget_allocated: 750000,
      budget_spent: 125000,
      team_members: [
        { name: "Sarah Chen", role: "Strategy Lead", availability: 90 },
        { name: "Mike Rodriguez", role: "Marketing Director", availability: 75 },
        { name: "Emma Thompson", role: "Product Manager", availability: 85 },
        { name: "David Kim", role: "Engineering Lead", availability: 80 },
        { name: "Lisa Johnson", role: "Customer Success", availability: 95 }
      ],
      phases: [
        {
          name: "Immediate Response",
          status: "active",
          progress: 70,
          tasks: [
            {
              id: "task1",
              name: "Threat Assessment Complete",
              description: "Comprehensive analysis of competitor threat level and impact",
              status: "completed",
              priority: "high",
              owner: "Sarah Chen",
              deadline: "2024-01-15",
              progress: 100,
              dependencies: [],
              resources_needed: ["Strategy team", "Analytics tools"]
            },
            {
              id: "task2", 
              name: "Response Team Mobilization",
              description: "Assemble cross-functional response team and establish communication protocols",
              status: "completed",
              priority: "high",
              owner: "Sarah Chen",
              deadline: "2024-01-16",
              progress: 100,
              dependencies: ["task1"],
              resources_needed: ["Team leads", "Communication tools"]
            },
            {
              id: "task3",
              name: "Emergency Communication Plan",
              description: "Deploy customer and stakeholder communication strategy",
              status: "in_progress",
              priority: "high",
              owner: "Mike Rodriguez",
              deadline: "2024-01-18",
              progress: 85,
              dependencies: ["task2"],
              resources_needed: ["Marketing team", "PR agency"]
            }
          ]
        },
        {
          name: "Tactical Execution",
          status: "active",
          progress: 25,
          tasks: [
            {
              id: "task4",
              name: "Counter-Marketing Campaign Launch",
              description: "Deploy differentiation campaign highlighting unique value propositions",
              status: "in_progress",
              priority: "high",
              owner: "Mike Rodriguez",
              deadline: "2024-01-22",
              progress: 60,
              dependencies: ["task3"],
              resources_needed: ["Marketing team", "Creative agency", "$50K budget"]
            },
            {
              id: "task5",
              name: "Product Feature Acceleration",
              description: "Fast-track development of competitive features",
              status: "in_progress",
              priority: "high",
              owner: "Emma Thompson",
              deadline: "2024-02-05",
              progress: 30,
              dependencies: ["task1"],
              resources_needed: ["Engineering team", "Product team"]
            },
            {
              id: "task6",
              name: "Customer Retention Program",
              description: "Enhanced customer success and loyalty initiatives",
              status: "pending",
              priority: "medium",
              owner: "Lisa Johnson",
              deadline: "2024-01-25",
              progress: 0,
              dependencies: ["task2"],
              resources_needed: ["Customer success team", "CRM system"]
            }
          ]
        },
        {
          name: "Strategic Reinforcement",
          status: "pending",
          progress: 0,
          tasks: [
            {
              id: "task7",
              name: "Performance Analysis",
              description: "Evaluate effectiveness of executed tactics",
              status: "pending",
              priority: "medium",
              owner: "Sarah Chen",
              deadline: "2024-02-15",
              progress: 0,
              dependencies: ["task4", "task5"],
              resources_needed: ["Analytics team", "BI tools"]
            }
          ]
        }
      ],
      risks: [
        {
          description: "Competitor accelerates their timeline unexpectedly",
          probability: "medium",
          impact: "high",
          mitigation: "Maintain flexible execution plan with rapid response capabilities"
        },
        {
          description: "Budget constraints limit tactical options",
          probability: "low",
          impact: "medium", 
          mitigation: "Prioritize high-impact activities and secure additional funding if needed"
        },
        {
          description: "Key team members become unavailable",
          probability: "low",
          impact: "high",
          mitigation: "Cross-train team members and maintain backup resource pool"
        }
      ]
    };
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    if (!executionPlan) return;

    const updatedPlan = { ...executionPlan };
    for (const phase of updatedPlan.phases) {
      const task = phase.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = newStatus as any;
        if (newStatus === "completed") {
          task.progress = 100;
          updatedPlan.completed_tasks++;
          updatedPlan.active_tasks--;
        } else if (newStatus === "in_progress" && task.status === "pending") {
          updatedPlan.active_tasks++;
        }
        break;
      }
    }
    
    // Recalculate overall progress
    const totalProgress = updatedPlan.phases.reduce((acc, phase) => 
      acc + phase.tasks.reduce((sum, task) => sum + task.progress, 0), 0
    );
    updatedPlan.overall_progress = Math.round(totalProgress / updatedPlan.total_tasks);

    setExecutionPlan(updatedPlan);
    
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus.replace('_', ' ')}`,
      variant: "default"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in_progress": return "secondary";
      case "blocked": return "destructive";
      case "pending": return "outline";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
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
              <p className="text-muted-foreground">Loading execution center...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!executionPlan) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mt-32">
            <h2 className="text-2xl font-bold mb-4">Execution Plan Not Found</h2>
            <p className="text-muted-foreground mb-8">Unable to load execution plan.</p>
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
            onClick={() => navigate(`/monitoring?execution_id=${executionPlan.id}&title=${encodeURIComponent(executionPlan.strategy_title)}`)}
            className="btn-glow"
          >
            Monitor Progress
          </Button>
        </div>

        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Play className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Execution Center</h1>
            <Badge variant={executionPlan.overall_progress > 50 ? "success" : "warning"} className="text-sm">
              {executionPlan.overall_progress}% COMPLETE
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">{executionPlan.strategy_title}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Started: {new Date(executionPlan.start_date).toLocaleDateString()}</span>
            <span>•</span>
            <span>Est. Completion: {new Date(executionPlan.estimated_completion).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">{executionPlan.overall_progress}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <Progress value={executionPlan.overall_progress} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                  <p className="text-2xl font-bold">{executionPlan.active_tasks}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{executionPlan.completed_tasks}/{executionPlan.total_tasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Budget Used</p>
                  <p className="text-2xl font-bold">{Math.round((executionPlan.budget_spent / executionPlan.budget_allocated) * 100)}%</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  ${executionPlan.budget_spent.toLocaleString()} / ${executionPlan.budget_allocated.toLocaleString()}
                </div>
              </div>
              <Progress value={(executionPlan.budget_spent / executionPlan.budget_allocated) * 100} className="mt-3" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
            <TabsTrigger value="team">Team Status</TabsTrigger>
            <TabsTrigger value="phases">Phase Progress</TabsTrigger>
            <TabsTrigger value="risks">Risk Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="space-y-6">
              {executionPlan.phases.map((phase, phaseIndex) => (
                <Card key={phaseIndex} className="card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {phase.name}
                        <Badge variant={phase.status === "completed" ? "success" : phase.status === "active" ? "warning" : "secondary"}>
                          {phase.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {phase.progress}% Complete
                      </div>
                    </div>
                    <Progress value={phase.progress} className="mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{task.name}</h4>
                              <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                                {task.priority.toUpperCase()}
                              </Badge>
                              <Badge variant={getStatusColor(task.status) as any} className="text-xs">
                                {task.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              {task.status === "pending" && (
                                <Button size="sm" onClick={() => updateTaskStatus(task.id, "in_progress")}>
                                  <Play className="h-3 w-3 mr-1" />
                                  Start
                                </Button>
                              )}
                              {task.status === "in_progress" && (
                                <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, "completed")}>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <span>Owner: {task.owner}</span>
                              <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={task.progress} className="w-20" />
                              <span>{task.progress}%</span>
                            </div>
                          </div>
                          {task.resources_needed.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Resources:</p>
                              <div className="flex flex-wrap gap-1">
                                {task.resources_needed.map((resource, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {resource}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Availability
                </CardTitle>
                <CardDescription>
                  Current team member capacity and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executionPlan.team_members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={member.availability} className="w-24" />
                        <span className="text-sm font-medium">{member.availability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phases" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Phase Progress Overview</CardTitle>
                <CardDescription>
                  Status and progress of each execution phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {executionPlan.phases.map((phase, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            phase.status === "completed" ? "bg-success text-success-foreground" :
                            phase.status === "active" ? "bg-warning text-warning-foreground" :
                            "bg-secondary text-secondary-foreground"
                          }`}>
                            {index + 1}
                          </div>
                          <h4 className="font-medium">{phase.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={phase.status === "completed" ? "success" : phase.status === "active" ? "warning" : "secondary"}>
                            {phase.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{phase.progress}%</span>
                        </div>
                      </div>
                      <Progress value={phase.progress} className="ml-11" />
                      <div className="ml-11 text-sm text-muted-foreground">
                        {phase.tasks.length} tasks • {phase.tasks.filter(t => t.status === "completed").length} completed
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>
                  Identified risks and mitigation strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executionPlan.risks.map((risk, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{risk.description}</h4>
                        <div className="flex gap-2">
                          <Badge variant={getRiskColor(risk.probability) as any} className="text-xs">
                            {risk.probability.toUpperCase()} PROB
                          </Badge>
                          <Badge variant={getRiskColor(risk.impact) as any} className="text-xs">
                            {risk.impact.toUpperCase()} IMPACT
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Mitigation:</p>
                        <p className="text-sm">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
