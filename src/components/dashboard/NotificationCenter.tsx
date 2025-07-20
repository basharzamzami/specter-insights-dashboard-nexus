import { useState, useEffect } from "react";
import { Bell, X, AlertTriangle, CheckCircle, Info, Zap, Target, TrendingDown, TrendingUp, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useThreatAlerts } from "@/hooks/useThreatAlerts";

interface Notification {
  id: string;
  type: "critical" | "warning" | "info" | "success" | "opportunity";
  title: string;
  message: string;
  timestamp: Date;
  actionable: boolean;
  competitor?: string;
  read: boolean;
  source: "ai" | "auto" | "manual";
  priority: "high" | "medium" | "low";
  data?: any;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Competitor Vulnerability Detected",
    message: "TechCorp's customer satisfaction dropped 15% this week. Perfect timing for targeted campaigns.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    actionable: true,
    competitor: "TechCorp",
    read: false,
    source: "ai",
    priority: "high",
    data: { sentimentDrop: 15, timeframe: "7d" }
  },
  {
    id: "2",
    type: "info",
    title: "Market Share Opportunity",
    message: "Your keywords are outranking DataSolutions by 40%. Consider expanding budget for these terms.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    actionable: true,
    competitor: "DataSolutions",
    read: false,
    source: "auto",
    priority: "medium"
  },
  {
    id: "3",
    type: "success",
    title: "Campaign Success",
    message: "Social disruption campaign against CloudInnovate achieved 12% sentiment decrease.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actionable: false,
    competitor: "CloudInnovate",
    read: true,
    source: "manual",
    priority: "low"
  },
  {
    id: "4",
    type: "critical",
    title: "Competitive Response Detected",
    message: "TechCorp has launched counter-intelligence operations. Recommend switching to stealth mode.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    actionable: true,
    competitor: "TechCorp",
    read: false,
    source: "ai",
    priority: "high"
  },
  {
    id: "5",
    type: "warning",
    title: "New Competitor Identified",
    message: "StartupX has entered your market segment with significant funding. Analysis recommended.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    actionable: true,
    competitor: "StartupX",
    read: false,
    source: "auto",
    priority: "medium"
  }
];

export const NotificationCenter = () => {
  const { unreadCount: threatUnreadCount } = useThreatAlerts();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "actionable">("all");

  useEffect(() => {
    fetchIntelligenceAlerts();
    
    // Check for new intelligence alerts every 30 seconds
    const interval = setInterval(() => {
      fetchIntelligenceAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchIntelligenceAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('intelligence_feeds')
        .select('*')
        .eq('is_trending', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Convert intelligence feeds to notifications format
      const intelligenceNotifications: Notification[] = data.map(feed => ({
        id: feed.id,
        type: feed.impact === 'critical' ? 'critical' : 
              feed.impact === 'high' ? 'opportunity' : 'info',
        title: feed.title,
        message: feed.description || 'Intelligence update detected',
        timestamp: new Date(feed.created_at),
        actionable: feed.tracking_enabled || false,
        competitor: feed.competitor || undefined,
        read: false,
        source: 'ai' as const,
        priority: feed.priority as 'high' | 'medium' | 'low',
        data: feed.data
      }));

      // Merge with existing mock notifications, avoiding duplicates
      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const newNotifications = intelligenceNotifications.filter(n => !existingIds.includes(n.id));
        return [...newNotifications, ...prev].slice(0, 25); // Keep only 25 most recent
      });
    } catch (error) {
      console.error('Error fetching intelligence alerts:', error);
    }
  };

  const addRandomNotification = () => {
    const types: Array<Notification["type"]> = ["critical", "warning", "info", "success", "opportunity"];
    const priorities: Array<Notification["priority"]> = ["high", "medium", "low"];
    const competitors = ["TechCorp", "DataSolutions", "CloudInnovate", "StartupX", "CompetitorY"];
    
    const titles = [
      "Competitor Price Change Detected",
      "Social Sentiment Shift Alert", 
      "SEO Ranking Vulnerability Found",
      "Customer Complaint Spike",
      "New Product Launch Detected",
      "Market Share Opportunity",
      "Competitive Intelligence Update",
      "Security Breach at Competitor",
      "Funding Announcement Alert",
      "Partnership Formation Detected"
    ];

    const messages = [
      "Immediate strategic response recommended for maximum market impact.",
      "Market conditions are exceptionally favorable for counter-operations.",
      "Critical vulnerability detected in competitor's premium offering segment.",
      "High-value customer acquisition opportunity identified through analysis.",
      "Defensive countermeasures may be required to maintain position.",
      "Intelligence gathering operation completed with actionable insights.",
      "Strategic positioning advantage available for limited time window.",
      "Competitor weakness exposed through automated monitoring systems.",
      "Market disruption opportunity detected by AI analysis engine.",
      "Competitive threat assessment update requires immediate review."
    ];

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: types[Math.floor(Math.random() * types.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date(),
      actionable: Math.random() > 0.3,
      competitor: competitors[Math.floor(Math.random() * competitors.length)],
      read: false,
      source: Math.random() > 0.6 ? "ai" : Math.random() > 0.5 ? "auto" : "manual",
      priority: priorities[Math.floor(Math.random() * priorities.length)]
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 24)]); // Keep only 25 most recent
    
    // Show toast for critical and high priority notifications
    if (newNotification.type === "critical" || newNotification.priority === "high") {
      toast.error(newNotification.title, {
        description: newNotification.message,
        duration: 15000,
        action: {
          label: "View Details",
          onClick: () => {
            setSelectedNotification(newNotification);
            setIsDialogOpen(true);
          }
        }
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
    setIsDialogOpen(true);
  };

  const handleTakeAction = (notification: Notification) => {
    console.log("Taking action on:", notification);
    
    if (notification.competitor) {
      toast.success("Strategic Action Initiated", {
        description: `Counter-intelligence operation against ${notification.competitor} has been activated.`,
        duration: 8000
      });
    } else {
      toast.success("Action Executed", {
        description: "Strategic response has been queued for immediate deployment.",
        duration: 5000
      });
    }
    
    setIsDialogOpen(false);
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "critical": return <AlertTriangle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "success": return <CheckCircle className="h-4 w-4" />;
      case "info": return <Info className="h-4 w-4" />;
      case "opportunity": return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Notification["type"], priority: Notification["priority"]) => {
    if (priority === "high") {
      return "bg-red-50 border-red-200 text-red-800";
    }
    
    switch (type) {
      case "critical": return "bg-red-50 border-red-200 text-red-800";
      case "warning": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "success": return "bg-green-50 border-green-200 text-green-800";
      case "info": return "bg-blue-50 border-blue-200 text-blue-800";
      case "opportunity": return "bg-purple-50 border-purple-200 text-purple-800";
    }
  };

  const getSourceBadge = (source: Notification["source"]) => {
    const baseClasses = "text-xs px-1.5 py-0.5 font-semibold rounded";
    switch (source) {
      case "ai": return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>AI</Badge>;
      case "auto": return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>AUTO</Badge>;
      case "manual": return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>MANUAL</Badge>;
    }
  };

  const getPriorityBadge = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high": return <Badge className="bg-red-100 text-red-800 text-xs animate-pulse">HIGH</Badge>;
      case "medium": return <Badge className="bg-yellow-100 text-yellow-800 text-xs">MEDIUM</Badge>;
      case "low": return <Badge className="bg-gray-100 text-gray-800 text-xs">LOW</Badge>;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case "unread": return !notif.read;
      case "actionable": return notif.actionable;
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length + threatUnreadCount;
  const criticalCount = notifications.filter(n => n.type === "critical" && !n.read).length;

  return (
    <>
      <Card className="animate-fade-in shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="h-5 w-5" />
                {criticalCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                )}
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Intelligence Command Center</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time competitive intelligence & threat monitoring
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-xs border rounded px-2 py-1 bg-white"
              >
                <option value="all">All Alerts</option>
                <option value="unread">Unread ({unreadCount})</option>
                <option value="actionable">Actionable</option>
              </select>
              <Button size="sm" variant="outline" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 px-6">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium text-muted-foreground mb-2">All Clear</p>
                <p className="text-sm text-muted-foreground">No threats detected. Systems operational.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "relative p-4 cursor-pointer transition-all duration-300 hover:bg-gray-50 animate-slide-in-right",
                      !notification.read && "bg-blue-50/30 border-l-4 border-l-blue-500",
                      notification.priority === "high" && "bg-red-50/20 border-l-4 border-l-red-500"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => dismissNotification(notification.id, e)}
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-40 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    <div className="flex items-start space-x-3 pr-8">
                      <div className={cn(
                        "p-2 rounded-full flex-shrink-0 mt-0.5",
                        getTypeColor(notification.type, notification.priority)
                      )}>
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm truncate pr-2">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            {getPriorityBadge(notification.priority)}
                            {getSourceBadge(notification.source)}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{notification.timestamp.toLocaleTimeString()}</span>
                            </div>
                            {notification.competitor && (
                              <div className="flex items-center space-x-1">
                                <Target className="h-3 w-3" />
                                <span>Target: {notification.competitor}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {notification.actionable && (
                              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 animate-pulse">
                                ACTION REQUIRED
                              </Badge>
                            )}
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Notification Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && getTypeIcon(selectedNotification.type)}
              Intelligence Alert: {selectedNotification?.type.toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Detailed analysis and recommended strategic response
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-6">
              <div className={cn("p-4 rounded-lg border-2", getTypeColor(selectedNotification.type, selectedNotification.priority))}>
                <h3 className="font-bold text-lg mb-3">{selectedNotification.title}</h3>
                <p className="text-sm mb-4 leading-relaxed">{selectedNotification.message}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 font-medium">Target:</span>
                      <p className="font-semibold">{selectedNotification.competitor || "Multiple Entities"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Priority Level:</span>
                      <p className="font-semibold">{selectedNotification.priority.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 font-medium">Intelligence Source:</span>
                      <p className="font-semibold">{selectedNotification.source.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Detected:</span>
                      <p className="font-semibold">{selectedNotification.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedNotification.actionable && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Strategic Response Options:</h4>
                  <div className="grid gap-3">
                    <Button 
                      onClick={() => handleTakeAction(selectedNotification)}
                      className="justify-start h-auto p-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                    >
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-semibold">Execute Immediate Response</p>
                          <p className="text-xs opacity-90">Deploy counter-intelligence operations</p>
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <Eye className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-semibold">Monitor & Analyze</p>
                          <p className="text-xs text-gray-600">Continue surveillance before action</p>
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="justify-start h-auto p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-semibold">Schedule Strategic Operation</p>
                          <p className="text-xs text-gray-600">Plan coordinated response campaign</p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {selectedNotification.actionable && (
                  <Button 
                    onClick={() => handleTakeAction(selectedNotification)}
                    className="bg-gradient-to-r from-primary to-blue-600"
                  >
                    Execute Primary Action
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};