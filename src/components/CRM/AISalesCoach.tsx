
/**
 * 🧠 AI SALES COACH
 * 
 * Intelligent sales coaching system that provides real-time guidance,
 * competitive insights, and performance optimization recommendations
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  MessageSquare,
  Trophy,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface CoachingInsight {
  readonly id: string;
  readonly type: 'performance' | 'competitive' | 'opportunity' | 'warning';
  readonly title: string;
  readonly description: string;
  readonly actionItems: readonly string[];
  readonly impact: 'low' | 'medium' | 'high';
  readonly urgency: 'low' | 'medium' | 'high';
  readonly confidence: number;
}

interface PerformanceMetrics {
  readonly callsToday: number;
  readonly conversationQuality: number;
  readonly objectionHandling: number;
  readonly closingEffectiveness: number;
  readonly competitivePositioning: number;
  readonly overallScore: number;
}

interface SalesContext {
  readonly leadName: string;
  readonly company: string;
  readonly stage: string;
  readonly value: number;
  readonly competitorThreats: readonly string[];
  readonly lastInteraction: string;
}

interface AISalesCoachProps {
  readonly userId: string;
  readonly currentLead?: SalesContext;
}

export function AISalesCoach({ userId, currentLead }: AISalesCoachProps) {
  const [insights, setInsights] = useState<readonly CoachingInsight[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'coach', message: string}>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCoachingData();
  }, [userId, currentLead]);

  const loadCoachingData = async () => {
    try {
      setLoading(true);
      
      // Mock coaching data
      const mockInsights: readonly CoachingInsight[] = [
        {
          id: 'insight_1',
          type: 'competitive',
          title: 'Competitor Threat Detected',
          description: 'Your lead Sarah Johnson has been engaging with QuickFix Plumbing. Their 24/7 guarantee is a strong differentiator.',
          actionItems: [
            'Emphasize your same-day response guarantee',
            'Mention your superior review ratings (4.8 vs their 4.2)',
            'Offer price matching with additional value-adds'
          ],
          impact: 'high',
          urgency: 'high',
          confidence: 87
        },
        {
          id: 'insight_2',
          type: 'opportunity',
          title: 'Perfect Timing Window',
          description: 'Based on weather patterns and seasonal trends, emergency plumbing requests spike 40% in the next 3 days.',
          actionItems: [
            'Increase follow-up frequency on warm leads',
            'Prepare emergency service messaging',
            'Ensure technician availability for rush calls'
          ],
          impact: 'high',
          urgency: 'medium',
          confidence: 92
        },
        {
          id: 'insight_3',
          type: 'performance',
          title: 'Objection Handling Improvement',
          description: 'Your price objection responses could be stronger. Success rate drops 23% when price is mentioned first.',
          actionItems: [
            'Lead with value proposition before pricing',
            'Use social proof to justify pricing',
            'Offer flexible payment options upfront'
          ],
          impact: 'medium',
          urgency: 'low',
          confidence: 78
        }
      ];

      const mockMetrics: PerformanceMetrics = {
        callsToday: 12,
        conversationQuality: 84,
        objectionHandling: 72,
        closingEffectiveness: 89,
        competitivePositioning: 76,
        overallScore: 80
      };

      setInsights(mockInsights);
      setMetrics(mockMetrics);
      
    } catch (error) {
      console.error('Failed to load coaching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const askCoach = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question for your AI coach",
      });
      return;
    }

    const userMessage = question;
    setQuestion('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    
    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = generateCoachResponse(userMessage);
      setChatHistory(prev => [...prev, { type: 'coach', message: mockResponse }]);
      
    } catch (error) {
      console.error('Failed to get coach response:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI coach",
        variant: "destructive"
      });
    }
  };

  const generateCoachResponse = (userQuestion: string): string => {
    const question = userQuestion.toLowerCase();
    
    if (question.includes('price') || question.includes('cost')) {
      return "Great question about pricing! Here's my recommendation: Start by establishing value first. Say something like 'Before we discuss investment, let me understand your situation better.' Then highlight your unique value props - faster response time, better reviews, or additional guarantees. When you do mention price, always frame it as an investment in their peace of mind.";
    }
    
    if (question.includes('competitor') || question.includes('competition')) {
      return "When handling competitor objections, never badmouth them directly. Instead, focus on your differentiators. For example: 'I respect that company - they do good work. Here's what makes us unique...' Then emphasize your strengths like response time, guarantees, or customer service. Always redirect to value you provide.";
    }
    
    if (question.includes('objection')) {
      return "Objection handling is about listening first, then reframing. Use the 'Feel, Felt, Found' technique: 'I understand how you feel. Other customers have felt the same way. Here's what they found...' This validates their concern while introducing new information to overcome it.";
    }
    
    return "That's a thoughtful question. Based on your recent performance data and the specific context of your current leads, I recommend focusing on building stronger rapport early in the conversation. This increases trust and makes later objection handling much easier. Would you like specific techniques for your current lead situation?";
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'competitive': return <Target className="h-5 w-5 text-red-600" />;
      case 'opportunity': return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case 'performance': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default: return <Brain className="h-5 w-5 text-purple-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading AI coaching insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI Sales Coach
            <Badge className="bg-purple-100 text-purple-800">ACTIVE</Badge>
          </CardTitle>
          <CardDescription>
            Real-time coaching insights powered by competitive intelligence and performance analytics
          </CardDescription>
        </CardHeader>
        {metrics && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{metrics.overallScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.callsToday}</div>
                <div className="text-sm text-muted-foreground">Calls Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.closingEffectiveness}%</div>
                <div className="text-sm text-muted-foreground">Closing Rate</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Current Lead Context */}
      {currentLead && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Current Lead Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium">{currentLead.leadName}</div>
                <div className="text-sm text-muted-foreground">{currentLead.company}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">{currentLead.stage}</Badge>
                  <Badge className="bg-green-100 text-green-800">${currentLead.value.toLocaleString()}</Badge>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Competitor Threats:</div>
                <div className="flex flex-wrap gap-1">
                  {currentLead.competitorThreats.map((threat, idx) => (
                    <Badge key={idx} className="bg-red-100 text-red-800 text-xs">{threat}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coaching Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Real-time Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {insights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-medium">{insight.title}</div>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact.toUpperCase()}
                        </Badge>
                        <Badge className={getUrgencyColor(insight.urgency)}>
                          {insight.urgency.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {insight.description}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-medium">Action Items:</div>
                        {insight.actionItems.map((action, idx) => (
                          <div key={idx} className="text-xs flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {action}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-xs text-muted-foreground">Confidence:</div>
                        <Progress value={insight.confidence} className="flex-1 h-2" />
                        <div className="text-xs">{insight.confidence}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Coach Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Ask Your Coach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chat History */}
              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    Ask me anything about sales strategy, objection handling, or competitive positioning!
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`p-2 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-100 text-blue-900 ml-8' 
                        : 'bg-green-100 text-green-900 mr-8'
                    }`}>
                      <div className="text-xs font-medium mb-1">
                        {msg.type === 'user' ? 'You' : 'AI Coach'}
                      </div>
                      <div className="text-sm">{msg.message}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Question Input */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Ask about objection handling, competitive positioning, closing techniques..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={askCoach} className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Get Coaching
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Breakdown */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold-600" />
              Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Conversation Quality</span>
                    <span className="text-sm font-medium">{metrics.conversationQuality}%</span>
                  </div>
                  <Progress value={metrics.conversationQuality} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Objection Handling</span>
                    <span className="text-sm font-medium">{metrics.objectionHandling}%</span>
                  </div>
                  <Progress value={metrics.objectionHandling} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Competitive Positioning</span>
                    <span className="text-sm font-medium">{metrics.competitivePositioning}%</span>
                  </div>
                  <Progress value={metrics.competitivePositioning} />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Quick Win Opportunity</span>
                </div>
                <div className="text-sm text-blue-800">
                  Focus on improving objection handling this week. A 10-point improvement could increase your closing rate by 15%.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AISalesCoach;
