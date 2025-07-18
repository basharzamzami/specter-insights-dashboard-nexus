import { useState, useEffect } from "react";
import { Activity, Clock, User, Target, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'competitor' | 'campaign' | 'analysis' | 'system';
  user: string;
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    action: "Competitor Analysis Completed",
    details: "Sentiment analysis for TechCorp finished with 75% positive score",
    timestamp: "2024-01-15T10:30:00Z",
    type: "competitor",
    user: "System"
  },
  {
    id: "2",
    action: "Campaign Created",
    details: "Q1 Product Launch campaign created and scheduled",
    timestamp: "2024-01-15T09:15:00Z",
    type: "campaign",
    user: "John Doe"
  },
  {
    id: "3",
    action: "New Competitor Added",
    details: "CloudInnovate added to monitoring list",
    timestamp: "2024-01-15T08:45:00Z",
    type: "competitor",
    user: "Jane Smith"
  },
  {
    id: "4",
    action: "Data Analysis Refresh",
    details: "Market sentiment data updated for all tracked competitors",
    timestamp: "2024-01-15T07:00:00Z",
    type: "analysis",
    user: "System"
  },
  {
    id: "5",
    action: "Campaign Status Updated",
    details: "Customer Success Stories campaign activated",
    timestamp: "2024-01-14T16:20:00Z",
    type: "campaign",
    user: "Marketing Team"
  }
];

export const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs();
    
    // Refresh activity logs every 15 seconds for real-time updates
    const interval = setInterval(fetchActivityLogs, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivityLogs = async () => {
    try {
      setIsLoading(true);
      
      // Fetch from multiple sources
      const [actionLogs, operationHistory] = await Promise.all([
        supabase
          .from('action_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10),
        supabase
          .from('operation_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // Combine and format the logs
      const combinedLogs: ActivityLog[] = [
        // Convert action logs
        ...(actionLogs.data || []).map(log => ({
          id: log.id,
          action: log.action_type,
          details: log.details ? JSON.stringify(log.details) : 'System action performed',
          timestamp: log.timestamp || new Date().toISOString(),
          type: log.target_type as ActivityLog['type'] || 'system',
          user: log.triggered_by || 'System'
        })),
        // Convert operation history
        ...(operationHistory.data || []).map(op => ({
          id: op.id,
          action: op.operation_type,
          details: op.description || 'Operation completed',
          timestamp: op.created_at,
          type: 'analysis' as const,
          user: op.user_id || 'System'
        }))
      ];

      // Sort by timestamp and merge with mock data for demo
      const allLogs = [...combinedLogs, ...mockActivityLogs]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15);

      setLogs(allLogs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      // Fallback to mock data
      setLogs(mockActivityLogs);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'competitor': return <Target className="h-4 w-4" />;
      case 'campaign': return <Calendar className="h-4 w-4" />;
      case 'analysis': return <Activity className="h-4 w-4" />;
      case 'system': return <Clock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'competitor': return 'bg-electric/10 text-electric border-electric/20';
      case 'campaign': return 'bg-primary/10 text-primary border-primary/20';
      case 'analysis': return 'bg-success/10 text-success border-success/20';
      case 'system': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Activity Logs</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse-soft">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Logs</h2>
          <p className="text-muted-foreground">Real-time system and user activity tracking</p>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <Activity className="h-3 w-3 mr-1" />
          Live
        </Badge>
      </div>

      <div className="space-y-3">
        {logs.map((log, index) => (
          <Card 
            key={log.id}
            className={`card-hover slide-in animate-delay-${(index % 4) * 100}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full border ${getActivityColor(log.type)}`}>
                  {getActivityIcon(log.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">{log.action}</h4>
                    <span className="text-xs text-muted-foreground flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(log.timestamp)}</span>
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                    {log.details}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{log.user}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getActivityColor(log.type)}`}
                    >
                      {log.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Activity logs update in real-time as events occur in your dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  );
};