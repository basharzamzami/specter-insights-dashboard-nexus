import { useState } from "react";
import { Bell, AlertTriangle, TrendingUp, Target, Clock, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "opportunity" | "alert" | "insight" | "update";
  title: string;
  message: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Competitor Vulnerability Detected",
    message: "TechCorp's customer satisfaction dropped 15% this week. Perfect timing for targeted campaigns.",
    timestamp: "5 minutes ago",
    priority: "high",
    actionable: true
  },
  {
    id: "2", 
    type: "insight",
    title: "Market Share Opportunity",
    message: "Your keywords are outranking DataSolutions by 40%. Consider expanding budget for these terms.",
    timestamp: "1 hour ago",
    priority: "medium",
    actionable: true
  },
  {
    id: "3",
    type: "alert",
    title: "Competitor Campaign Launch",
    message: "CloudInnovate just launched a new product marketing campaign. Monitor their messaging.",
    timestamp: "3 hours ago",
    priority: "medium",
    actionable: false
  },
  {
    id: "4",
    type: "update",
    title: "Weekly Analysis Complete",
    message: "Your competitive analysis report for this week is ready for review.",
    timestamp: "6 hours ago",
    priority: "low",
    actionable: true
  }
];

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "opportunity": return <TrendingUp className="h-4 w-4" />;
      case "alert": return <AlertTriangle className="h-4 w-4" />;
      case "insight": return <Target className="h-4 w-4" />;
      case "update": return <Clock className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification["type"], priority: Notification["priority"]) => {
    if (priority === "high") return "text-destructive bg-destructive/10 border-destructive/20";
    
    switch (type) {
      case "opportunity": return "text-success bg-success/10 border-success/20";
      case "alert": return "text-warning bg-warning/10 border-warning/20";
      case "insight": return "text-primary bg-primary/10 border-primary/20";
      case "update": return "text-muted-foreground bg-muted/10 border-muted/20";
      default: return "text-muted-foreground bg-muted/10 border-muted/20";
    }
  };

  const getPriorityBadge = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-muted text-muted-foreground";
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAction = (notification: Notification) => {
    // Handle notification action based on type
    console.log("Taking action on:", notification);
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Opportunities Detected</CardTitle>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
        <CardDescription>
          AI-powered insights and strategic opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No new opportunities detected</p>
              <p className="text-sm text-muted-foreground">Check back soon for market insights</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div 
                key={notification.id}
                className={`relative p-4 rounded-lg border transition-all duration-300 slide-in animate-delay-${index * 100} ${
                  getNotificationColor(notification.type, notification.priority)
                }`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotification(notification.id)}
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-60 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </Button>

                <div className="flex items-start space-x-3 pr-6">
                  <div className="p-2 rounded-full bg-background/50">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <Badge className={`text-xs ${getPriorityBadge(notification.priority)}`}>
                        {notification.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm opacity-90 leading-relaxed mb-3">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-70 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{notification.timestamp}</span>
                      </span>
                      
                      {notification.actionable && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAction(notification)}
                          className="text-xs"
                        >
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};