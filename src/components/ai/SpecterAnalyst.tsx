import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Bot,
  Brain,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  Eye,
  Clock,
  Activity,
  MessageSquare,
  Send,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface QuickInsight {
  id: number;
  type: string;
  text: string;
  confidence: number;
  source: string;
  impact: number;
}

export const SpecterAnalyst = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hello! I'm Specter Analyst, your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: '10:30 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const [quickInsights, setQuickInsights] = useState<QuickInsight[]>([
    {
      id: 1,
      type: 'Market Trend',
      text: 'AI adoption is accelerating in the healthcare sector.',
      confidence: 85,
      source: 'Industry Report',
      impact: 8
    },
    {
      id: 2,
      type: 'Competitor Alert',
      text: 'TechCorp launched a new product targeting your key demographic.',
      confidence: 92,
      source: 'Social Media Monitoring',
      impact: 9
    },
    {
      id: 3,
      type: 'Opportunity',
      text: 'Untapped market segment identified in sustainable energy solutions.',
      confidence: 78,
      source: 'Market Analysis',
      impact: 7
    }
  ]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const aiResponse = await supabase.functions.invoke('ai-analyst', {
        body: { 
          userId: user?.id,
          message: input
        }
      });

      if (aiResponse.error) {
        throw new Error(aiResponse.error.message);
      }

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        text: aiResponse.data.response || "I'm sorry, I couldn't process your request.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages([...messages, newMessage, aiMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "AI Analyst Error",
        description: error.message || "Failed to get response from AI Analyst.",
        variant: "destructive",
      });
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    // Simulate initial AI greeting
    if (messages.length === 1 && messages[0].sender === 'ai') {
      const greetingTimeout = setTimeout(() => {
        setMessages([
          ...messages,
          {
            id: Date.now(),
            text: "How can I assist you with competitive analysis or strategic insights today?",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }, 1500);

      return () => clearTimeout(greetingTimeout);
    }
  }, [messages]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            Specter Analyst
          </CardTitle>
          <CardDescription>
            AI-powered competitive intelligence and strategic analysis
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-2 bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Chat
            </CardTitle>
            <CardDescription>
              Get real-time insights and strategic recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-thumb-secondary scrollbar-track-muted">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`rounded-lg p-3 text-sm w-fit max-w-[80%] ${
                      message.sender === 'user' ? 'bg-primary/10 text-primary-foreground' : 'bg-secondary/10'
                    }`}
                  >
                    {message.text}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {message.timestamp} • {message.sender === 'user' ? 'You' : 'Specter AI'}
                  </span>
                </div>
              ))}
              {isThinking && (
                <div className="flex items-start">
                  <div className="rounded-lg p-3 text-sm w-fit max-w-[80%] bg-secondary/10">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={isThinking}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Sidebar */}
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickInsights.map((insight, index) => (
              <div key={index} className="p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-primary/20 text-primary">
                    {insight.type}
                  </Badge>
                  <Badge variant="secondary">
                    {insight.confidence}% Confidence
                  </Badge>
                </div>
                <p className="text-sm">{insight.text}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">{insight.source}</span>
                  <Badge className="text-xs">
                    Impact: {insight.impact}/10
                  </Badge>
                </div>
              </div>
            ))}
            
            <Button className="w-full">
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
