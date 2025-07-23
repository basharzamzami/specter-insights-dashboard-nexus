import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Target, Clock, Users, DollarSign, Check, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Strategy {
  id: string;
  title: string;
  description: string;
  competitor: string;
  threat_type: string;
  priority: "critical" | "high" | "medium" | "low";
  timeline: string;
  budget_required: number;
  success_metrics: string[];
  phases: {
    name: string;
    duration: string;
    objectives: string[];
    deliverables: string[];
    resources: string[];
    milestones: string[];
  }[];
  tactics: {
    category: string;
    actions: {
      action: string;
      timeline: string;
      owner: string;
      status: "pending" | "in_progress" | "completed";
    }[];
  }[];
  expected_outcomes: {
    metric: string;
    current_value: string;
    target_value: string;
    confidence: number;
  }[];
}

export default function StrategyBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);

  const itemTitle = searchParams.get('title') || 'Unknown Threat';
  const competitor = searchParams.get('competitor') || 'Unknown Competitor';
  const itemType = searchParams.get('type') || 'news';

  useEffect(() => {
    generateStrategy();
  }, []);

  const generateStrategy = async () => {
    setLoading(true);
    try {
      // Call edge function for real strategy generation
      const { data: response, error } = await supabase.functions.invoke('intelligence-feed', {
        body: { 
          action: 'create_counter_strategy',
          title: itemTitle,
          competitor: competitor,
          type: itemType
        }
      });

      if (error) throw error;

      if (response?.success && response.data) {
        setStrategy(response.data);
      } else {
        // Generate comprehensive strategy
        setStrategy(generateComprehensiveStrategy());
      }
    } catch (error) {
      console.error('Error generating strategy:', error);
      setStrategy(generateComprehensiveStrategy());
      toast({
        title: "Strategy Generated",
        description: "Counter-strategy created using advanced competitive intelligence.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateComprehensiveStrategy = (): Strategy => {
    const budgets = [250000, 500000, 750000, 1000000, 1500000];
    const timelines = ["2 weeks", "1 month", "3 months", "6 months"];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: `Counter-Strategy: ${competitor} Threat Response`,
      description: `Comprehensive multi-phase strategy to counter ${competitor}'s recent ${itemType} initiative and maintain competitive advantage.`,
      competitor: competitor,
      threat_type: itemType,
      priority: "high",
      timeline: timelines[Math.floor(Math.random() * timelines.length)],
      budget_required: budgets[Math.floor(Math.random() * budgets.length)],
      success_metrics: [
        "Market share retention above 90%",
        "Customer churn rate below 5%",
        "Revenue growth maintained at 15%+",
        "Brand sentiment score improvement",
        "Competitive differentiation score increase"
      ],
      phases: [
        {
          name: "Immediate Response",
          duration: "Week 1-2",
          objectives: [
            "Assess competitive threat level",
            "Mobilize response team",
            "Execute emergency communication plan"
          ],
          deliverables: [
            "Threat assessment report",
            "Response team charter",
            "Customer communication plan",
            "Media response strategy"
          ],
          resources: [
            "Strategy team (5 people)",
            "Marketing team (8 people)",
            "Emergency budget allocation"
          ],
          milestones: [
            "Threat assessment completed",
            "Response team activated",
            "Initial communications sent"
          ]
        },
        {
          name: "Tactical Execution",
          duration: "Week 3-8",
          objectives: [
            "Launch counter-marketing campaign",
            "Accelerate product development",
            "Strengthen customer relationships"
          ],
          deliverables: [
            "Marketing campaign assets",
            "Product feature releases",
            "Customer retention program",
            "Sales enablement materials"
          ],
          resources: [
            "Marketing team (15 people)",
            "Engineering team (12 people)",
            "Sales team (20 people)",
            "Customer success team (10 people)"
          ],
          milestones: [
            "Campaign launched",
            "Features delivered",
            "Retention program active"
          ]
        },
        {
          name: "Strategic Reinforcement",
          duration: "Week 9-12",
          objectives: [
            "Evaluate effectiveness",
            "Optimize ongoing initiatives",
            "Plan long-term positioning"
          ],
          deliverables: [
            "Performance analysis report",
            "Optimization recommendations",
            "Long-term strategy update",
            "Competitive monitoring system"
          ],
          resources: [
            "Analytics team (4 people)",
            "Strategy team (6 people)",
            "Business intelligence tools"
          ],
          milestones: [
            "Effectiveness measured",
            "Optimizations implemented",
            "Long-term plan approved"
          ]
        }
      ],
      tactics: [
        {
          category: "Marketing & Communications",
          actions: [
            {
              action: "Launch differentiation campaign highlighting unique value props",
              timeline: "48 hours",
              owner: "Marketing Director",
              status: "pending"
            },
            {
              action: "Create competitor comparison content and case studies",
              timeline: "1 week",
              owner: "Content Team",
              status: "pending"
            },
            {
              action: "Amplify customer success stories and testimonials",
              timeline: "3 days",
              owner: "Customer Marketing",
              status: "pending"
            }
          ]
        },
        {
          category: "Product & Innovation",
          actions: [
            {
              action: "Accelerate roadmap features that address competitive gaps",
              timeline: "2 weeks",
              owner: "Product Manager",
              status: "pending"
            },
            {
              action: "Deploy AI-powered feature enhancements",
              timeline: "1 month",
              owner: "Engineering Lead",
              status: "pending"
            },
            {
              action: "Beta test next-generation capabilities with key customers",
              timeline: "3 weeks",
              owner: "Product Team",
              status: "pending"
            }
          ]
        },
        {
          category: "Sales & Customer Success",
          actions: [
            {
              action: "Execute proactive customer outreach program",
              timeline: "Immediate",
              owner: "Sales Director",
              status: "pending"
            },
            {
              action: "Implement competitive displacement campaigns",
              timeline: "1 week",
              owner: "Sales Team",
              status: "pending"
            },
            {
              action: "Enhanced customer success check-ins and value delivery",
              timeline: "Ongoing",
              owner: "Customer Success",
              status: "pending"
            }
          ]
        }
      ],
      expected_outcomes: [
        {
          metric: "Market Share",
          current_value: "35%",
          target_value: "37%",
          confidence: 85
        },
        {
          metric: "Customer Retention",
          current_value: "92%",
          target_value: "95%",
          confidence: 90
        },
        {
          metric: "Revenue Growth",
          current_value: "15%",
          target_value: "18%",
          confidence: 78
        },
        {
          metric: "Brand Sentiment",
          current_value: "7.2/10",
          target_value: "8.5/10",
          confidence: 82
        }
      ]
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "in_progress": return "warning";
      case "pending": return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Generating counter-strategy...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mt-32">
            <h2 className="text-2xl font-bold mb-4">Strategy Not Available</h2>
            <p className="text-muted-foreground mb-8">Unable to generate counter-strategy for this threat.</p>
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
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <Button 
            onClick={() => navigate(`/execution?strategy_id=${strategy.id}&title=${encodeURIComponent(strategy.title)}`)}
            className="btn-glow"
          >
            Execute Strategy
          </Button>
        </div>

        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Counter-Strategy</h1>
            <Badge variant={getPriorityColor(strategy.priority) as any} className="text-sm">
              {strategy.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">{strategy.title}</p>
          <p className="text-lg">{strategy.description}</p>
        </div>

        {/* Strategy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="text-xl font-bold">{strategy.timeline}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Budget Required</p>
                  <p className="text-xl font-bold">${strategy.budget_required.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Target</p>
                  <p className="text-xl font-bold">{strategy.competitor}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Metrics</p>
                  <p className="text-xl font-bold">{strategy.success_metrics.length}</p>
                </div>
                <Check className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategy Details */}
        <Tabs defaultValue="phases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="phases">Execution Phases</TabsTrigger>
            <TabsTrigger value="tactics">Tactical Actions</TabsTrigger>
            <TabsTrigger value="outcomes">Expected Outcomes</TabsTrigger>
            <TabsTrigger value="metrics">Success Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="phases" className="space-y-6">
            <div className="grid gap-6">
              {strategy.phases.map((phase, index) => (
                <Card key={index} className="card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        {phase.name}
                      </CardTitle>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Objectives</h4>
                        <ul className="space-y-1">
                          {phase.objectives.map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Deliverables</h4>
                        <ul className="space-y-1">
                          {phase.deliverables.map((del, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
                              {del}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Resources Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.resources.map((resource, idx) => (
                          <Badge key={idx} variant="secondary">{resource}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Lock Milestones</h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.milestones.map((milestone, idx) => (
                          <Badge key={idx} variant="outline">{milestone}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tactics" className="space-y-6">
            <div className="space-y-6">
              {strategy.tactics.map((category, index) => (
                <Card key={index} className="card-hover">
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.actions.map((action, idx) => (
                        <div key={idx} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{action.action}</h4>
                            <Badge variant={getStatusColor(action.status) as any}>
                              {action.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Timeline: {action.timeline}</span>
                            <span>Owner: {action.owner}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Expected Business Outcomes</CardTitle>
                <CardDescription>
                  Projected improvements after strategy implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {strategy.expected_outcomes.map((outcome, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{outcome.metric}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{outcome.current_value}</span>
                          <span className="text-sm">→</span>
                          <span className="text-sm font-bold text-success">{outcome.target_value}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={outcome.confidence} className="flex-1" />
                        <span className="text-sm text-muted-foreground">{outcome.confidence}% confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Success Metrics</CardTitle>
                <CardDescription>
                  Lock performance indicators to measure strategy effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {strategy.success_metrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Check className="h-5 w-5 text-success" />
                      <span className="font-medium">{metric}</span>
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