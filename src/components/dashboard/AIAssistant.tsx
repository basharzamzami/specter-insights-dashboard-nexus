import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Lightbulb, Target, TrendingUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "Hello! I'm Specter, your strategic intelligence assistant. I can help you analyze competitors, optimize campaigns, and identify market opportunities. What would you like to explore?",
    timestamp: new Date(),
    suggestions: [
      "Analyze TechCorp's recent changes",
      "Find keyword opportunities",
      "Review campaign performance",
      "Competitor sentiment analysis"
    ]
  }
];

export const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant", 
        content: getAIResponse(inputValue),
        timestamp: new Date(),
        suggestions: getSuggestions(inputValue)
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const lower = input.toLowerCase();
    
    if (lower.includes("competitor") || lower.includes("analysis")) {
      return "I've analyzed your competitor landscape. TechCorp shows vulnerability in customer support (sentiment down 15%), while DataSolutions is losing keyword rankings. I recommend targeting their weak points with focused campaigns emphasizing your superior support and reliability.";
    }
    
    if (lower.includes("campaign") || lower.includes("performance")) {
      return "Your Q1 campaigns are performing well with 47% traffic growth. The 'AI automation' keyword is your strongest performer. I suggest expanding budget allocation to similar high-intent terms and creating content around competitor pain points.";
    }
    
    if (lower.includes("keyword") || lower.includes("seo")) {
      return "I've identified 23 new keyword opportunities where competitors are ranking poorly. Focus on 'business intelligence tools' and 'automated reporting' - these have high search volume but low competition difficulty.";
    }
    
    return "Based on current market data, I recommend focusing on competitor sentiment analysis and identifying content gaps. Your market position is strong, but there are opportunities to capture more share in the enterprise segment.";
  };

  const getSuggestions = (input: string): string[] => {
    return [
      "Show me competitor weakness report",
      "Generate campaign strategy", 
      "Find trending keywords",
      "Analyze market opportunities"
    ];
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-border shadow-large z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Ask Specter</h3>
              <p className="text-sm opacity-80">Strategic Intelligence Assistant</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-primary-foreground hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                {message.type === "assistant" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-1 bg-primary/10 rounded-full">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Specter</span>
                  </div>
                )}
                
                <div className={`p-3 rounded-lg ${
                  message.type === "user" 
                    ? "bg-primary text-primary-foreground ml-2" 
                    : "bg-muted/50 mr-2"
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center space-x-1">
                      <Lightbulb className="h-3 w-3" />
                      <span>Suggested actions:</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestion(suggestion)}
                          className="text-xs h-7 px-2"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <span className="text-xs text-muted-foreground mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1 bg-primary/10 rounded-full">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">Specter is typing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex space-x-2 mb-3">
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleSuggestion("Competitor analysis")}>
            <Target className="h-3 w-3 mr-1" />
            Analyze
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleSuggestion("Market trends")}>
            <TrendingUp className="h-3 w-3 mr-1" />
            Trends
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleSuggestion("Campaign ideas")}>
            <MessageSquare className="h-3 w-3 mr-1" />
            Ideas
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about competitors, campaigns, or strategy..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="btn-glow">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};