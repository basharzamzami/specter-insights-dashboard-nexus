import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  AlertTriangle, 
  Target, 
  Clock, 
  CheckCircle,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Notification {
  id: number;
  title: string;
  description: string;
  type: 'alert' | 'opportunity' | 'update' | 'success';
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'High Priority Threat Detected',
      description: 'Competitor has launched aggressive ad campaign targeting your keywords with 50% higher bid strategy.',
      type: 'alert',
      timestamp: '5 minutes ago',
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      title: 'New Opportunity Identified',
      description: 'Untapped market segment discovered with high potential for your product.',
      type: 'opportunity',
      timestamp: '12 minutes ago',
      read: false,
      actionRequired: true
    },
    {
      id: 3,
      title: 'System Update',
      description: 'Specter Net Core v1.2.4 is now available. Includes enhanced AI algorithms and improved UI.',
      type: 'update',
      timestamp: '30 minutes ago',
      read: true
    },
    {
      id: 4,
      title: 'Campaign Performance Boost',
      description: 'Your Q3 campaign has exceeded targets by 25%.',
      type: 'success',
      timestamp: '1 hour ago',
      read: true
    },
    {
      id: 5,
      title: 'Critical Vulnerability Alert',
      description: 'Potential security breach detected. Immediate action required to patch vulnerability.',
      type: 'alert',
      timestamp: '2 hours ago',
      read: true,
      actionRequired: true
    },
    {
      id: 6,
      title: 'New Competitor Detected',
      description: 'A new player in the market, "NovaTech," is showing significant growth in the AI sector.',
      type: 'update',
      timestamp: '5 hours ago',
      read: true
    },
    {
      id: 7,
      title: 'Customer Sentiment Shift',
      description: 'Positive sentiment towards your brand has increased by 15% in the last week.',
      type: 'success',
      timestamp: '1 day ago',
      read: true
    },
    {
      id: 8,
      title: 'Resource Optimization Opportunity',
      description: 'Identified potential cost savings of 10% by optimizing cloud resource allocation.',
      type: 'opportunity',
      timestamp: '3 days ago',
      read: true,
      actionRequired: true
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <Card className="bg-background/90 backdrop-blur-md border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Intelligence Command Center
        </CardTitle>
        <CardDescription>
          Stay informed with real-time threat alerts, opportunities, and system updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {notifications.map((notification) => (
            <li key={notification.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {notification.type === 'alert' && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  {notification.type === 'opportunity' && (
                    <Target className="h-4 w-4 text-green-500" />
                  )}
                  {notification.type === 'update' && (
                    <Clock className="h-4 w-4 text-blue-500" />
                  )}
                  {notification.type === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <Badge>NEW</Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </p>
                {notification.actionRequired && (
                  <Button variant="link" size="sm" onClick={() => markAsRead(notification.id)}>
                    Take Action
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
