/**
 * 🧠 AI SALES COACH SYSTEM
 * 
 * Real-time AI coaching that analyzes calls, suggests responses,
 * and provides competitive intelligence during sales conversations
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Mic, 
  CheckCircle,
  Phone,
  FileText,
  Zap,
  TrendingUp
} from 'lucide-react';

interface CallAnalysis {
  readonly id: string;
  readonly leadName: string;
  readonly duration: number; // seconds
  readonly sentiment: 'positive' | 'neutral' | 'negative';
  readonly keyTopics: readonly string[];
  readonly objections: readonly string[];
  readonly buyingSignals: readonly string[];
  readonly competitorMentions: readonly string[];
  readonly nextSteps: readonly string[];
  readonly coachingTips: readonly string[];
  readonly dealProbability: number; // 0-100
}

interface RealTimeCoaching {
  readonly id: string;
  readonly trigger: string;
  readonly suggestion: string;
  readonly type: 'objection_handler' | 'closing_technique' | 'competitive_response' | 'value_prop';
  readonly urgency: 'low' | 'medium' | 'high';
  readonly confidence: number;
}

interface SalesPlaybook {
  readonly id: string;
  readonly scenario: string;
  readonly title: string;
  readonly description: string;
  readonly talkingPoints: readonly string[];
  readonly objectionHandlers: readonly { objection: string; response: string }[];
  readonly competitiveAdvantages: readonly string[];
  readonly closingTechniques: readonly string[];
}

interface PerformanceInsight {
  readonly metric: string;
  readonly current: number;
  readonly target: number;
  readonly trend: 'up' | 'down' | 'stable';
  readonly insight: string;
  readonly actionable: string;
}

interface AISalesCoachProps {
  readonly userId: string;
  readonly leadId?: string;
}

export function AISalesCoach({ userId, leadId }: AISalesCoachProps) {
  const [coachData, setCoachData] = useState<{
    recentCalls: readonly CallAnalysis[];
    realTimeCoaching: readonly RealTimeCoaching[];
    playbooks: readonly SalesPlaybook[];
    insights: readonly PerformanceInsight[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'coaching' | 'analysis' | 'playbooks' | 'insights'>('coaching');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    loadCoachData();
  }, [userId, leadId]);

  const loadCoachData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockData = {
        recentCalls: [
          {
            id: 'call_1',
            leadName: 'Sarah Johnson',
            duration: 1247, // ~20 minutes
            sentiment: 'positive' as const,
            keyTopics: ['Pricing', 'Timeline', 'Service guarantees', 'Emergency availability'],
            objections: ['Price seems high', 'Need to check with spouse'],
            buyingSignals: ['Asked about scheduling', 'Mentioned urgency', 'Discussed payment options'],
            competitorMentions: ['Metro Plumbing Pro', 'Quick Fix Solutions'],
            nextSteps: ['Send detailed quote', 'Schedule follow-up in 2 days', 'Provide references'],
            coachingTips: [
              'Great job addressing price objection with value proposition',
              'Consider mentioning 24/7 guarantee earlier in future calls',
              'Follow up on spouse decision timeline'
            ],
            dealProbability: 78
          }
        ] as readonly CallAnalysis[],
        realTimeCoaching: [
          {
            id: 'coach_1',
            trigger: 'Lead mentioned competitor pricing',
            suggestion: 'Emphasize your 24/7 guarantee and licensed technician advantage. Say: "While price is important, what matters most when you have a plumbing emergency at 2 AM is having licensed professionals who answer the phone and arrive within 30 minutes."',
            type: 'competitive_response' as const,
            urgency: 'high' as const,
            confidence: 92
          },
          {
            id: 'coach_2',
            trigger: 'Lead asked about timeline',
            suggestion: 'This is a buying signal! Ask: "How soon would you like to get this resolved?" Then offer immediate scheduling options.',
            type: 'closing_technique' as const,
            urgency: 'medium' as const,
            confidence: 87
          }
        ] as readonly RealTimeCoaching[],
        playbooks: [
          {
            id: 'playbook_1',
            scenario: 'Emergency Plumbing Call',
            title: 'Emergency Response Playbook',
            description: 'Handle urgent plumbing emergencies with confidence and speed',
            talkingPoints: [
              'Acknowledge urgency immediately',
              'Confirm licensed and insured status',
              'Provide realistic arrival time',
              'Explain emergency pricing upfront',
              'Offer temporary solutions while en route'
            ],
            objectionHandlers: [
              {
                objection: 'Your emergency rate is too high',
                response: 'I understand cost is a concern. Our emergency rate reflects the fact that we have licensed technicians available 24/7, fully stocked trucks, and we guarantee to fix it right the first time. What would it cost you if this problem gets worse overnight?'
              }
            ],
            competitiveAdvantages: [
              '24/7 licensed technician availability',
              'Fully stocked emergency vehicles',
              'No overtime charges',
              'Same-day service guarantee'
            ],
            closingTechniques: [
              'Urgency close: "I can have a technician there in 30 minutes"',
              'Risk close: "The longer we wait, the more damage and cost"',
              'Guarantee close: "We guarantee to fix it right or you don\'t pay"'
            ]
          }
        ] as readonly SalesPlaybook[],
        insights: [
          {
            metric: 'Call-to-Close Rate',
            current: 34.2,
            target: 40.0,
            trend: 'up' as const,
            insight: 'Your close rate improved 8% this month, mainly due to better objection handling',
            actionable: 'Focus on asking for the sale earlier in conversations - you\'re building great rapport but waiting too long to close'
          },
          {
            metric: 'Average Deal Value',
            current: 4500,
            target: 5000,
            trend: 'stable' as const,
            insight: 'Deal values are consistent but could be higher with better upselling',
            actionable: 'When quoting basic service, always mention premium options and extended warranties'
          }
        ] as readonly PerformanceInsight[]
      };

      setCoachData(mockData);
    } catch (error) {
      console.error('Failed to load coach data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    setIsListening(true);
    // Implement real-time call listening
    console.log('Starting real-time call coaching...');
  };

  const stopListening = () => {
    setIsListening(false);
    console.log('Stopping real-time call coaching...');
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-orange-500 bg-orange-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading AI sales coach...</p>
        </div>
      </div>
    );
  }

  if (!coachData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load coaching data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Real-Time Controls */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                AI Sales Coach
              </CardTitle>
              <CardDescription>
                Real-time coaching and performance optimization
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isListening ? (
                <Button onClick={stopListening} variant="destructive">
                  <Mic className="h-4 w-4 mr-2" />
                  Stop Coaching
                </Button>
              ) : (
                <Button onClick={startListening} className="bg-green-600 hover:bg-green-700">
                  <Mic className="h-4 w-4 mr-2" />
                  Start Live Coaching
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-Time Coaching Alerts */}
      {isListening && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Zap className="h-5 w-5 animate-pulse" />
              Live Coaching Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coachData.realTimeCoaching.map((coaching) => (
                <div key={coaching.id} className={`p-3 rounded-lg border-l-4 ${getUrgencyColor(coaching.urgency)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-sm">{coaching.trigger}</div>
                    <Badge variant="outline">{coaching.confidence}% confidence</Badge>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">{coaching.suggestion}</div>
                  <Badge variant="secondary" className="text-xs">
                    {coaching.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="coaching">🧠 Live Coaching</TabsTrigger>
          <TabsTrigger value="analysis">📞 Call Analysis</TabsTrigger>
          <TabsTrigger value="playbooks">📚 Playbooks</TabsTrigger>
          <TabsTrigger value="insights">📊 Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="coaching" className="space-y-4">
          <div className="grid gap-4">
            {coachData.realTimeCoaching.map((coaching) => (
              <Card key={coaching.id} className={`border-l-4 ${getUrgencyColor(coaching.urgency)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{coaching.trigger}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{coaching.confidence}% confidence</Badge>
                      <Badge variant="secondary">{coaching.type.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                    <div className="text-sm font-medium text-blue-800 mb-2">💡 AI Suggestion</div>
                    <p className="text-sm text-blue-700">{coaching.suggestion}</p>
                  </div>
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Used
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4">
            {coachData.recentCalls.map((call) => (
              <Card key={call.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      {call.leadName}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getSentimentColor(call.sentiment)}>
                        {call.sentiment}
                      </Badge>
                      <Badge variant="outline">
                        {Math.floor(call.duration / 60)}m {call.duration % 60}s
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{call.dealProbability}%</div>
                        <div className="text-xs text-muted-foreground">Deal Probability</div>
                      </div>
                      <Progress value={call.dealProbability} className="flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-green-600 mb-2">✅ Buying Signals</div>
                        <ul className="text-xs space-y-1">
                          {call.buyingSignals.map((signal, idx) => (
                            <li key={idx} className="text-muted-foreground">• {signal}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-red-600 mb-2">⚠️ Objections</div>
                        <ul className="text-xs space-y-1">
                          {call.objections.map((objection, idx) => (
                            <li key={idx} className="text-muted-foreground">• {objection}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-blue-600 mb-2">🧠 Coaching Tips</div>
                      <ul className="text-sm space-y-1">
                        {call.coachingTips.map((tip, idx) => (
                          <li key={idx} className="text-muted-foreground">• {tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-purple-600 mb-2">📋 Next Steps</div>
                      <ul className="text-sm space-y-1">
                        {call.nextSteps.map((step, idx) => (
                          <li key={idx} className="text-muted-foreground">• {step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playbooks" className="space-y-4">
          <div className="grid gap-4">
            {coachData.playbooks.map((playbook) => (
              <Card key={playbook.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {playbook.title}
                  </CardTitle>
                  <CardDescription>{playbook.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">🎯 Key Talking Points</div>
                      <ul className="text-sm space-y-1">
                        {playbook.talkingPoints.map((point, idx) => (
                          <li key={idx} className="text-muted-foreground">• {point}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">🛡️ Competitive Advantages</div>
                      <ul className="text-sm space-y-1">
                        {playbook.competitiveAdvantages.map((advantage, idx) => (
                          <li key={idx} className="text-muted-foreground">• {advantage}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">💬 Objection Handlers</div>
                      <div className="space-y-2">
                        {playbook.objectionHandlers.map((handler, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-red-600 mb-1">
                              Objection: "{handler.objection}"
                            </div>
                            <div className="text-sm text-gray-700">
                              Response: {handler.response}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {coachData.insights.map((insight, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      {insight.metric}
                    </CardTitle>
                    <Badge variant={insight.trend === 'up' ? 'default' : insight.trend === 'down' ? 'destructive' : 'secondary'}>
                      {insight.trend === 'up' ? '📈' : insight.trend === 'down' ? '📉' : '➡️'} {insight.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{insight.current}</div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                      <div className="flex-1">
                        <Progress value={(insight.current / insight.target) * 100} />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{insight.target}</div>
                        <div className="text-xs text-muted-foreground">Target</div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-800 mb-1">💡 Insight</div>
                      <p className="text-sm text-blue-700">{insight.insight}</p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800 mb-1">🎯 Action Item</div>
                      <p className="text-sm text-green-700">{insight.actionable}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
