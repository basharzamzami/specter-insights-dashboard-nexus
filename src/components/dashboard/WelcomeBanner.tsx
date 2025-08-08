
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Activity,
  Zap,
  Eye,
  Shield
} from 'lucide-react';

interface WelcomeBannerProps {
  user: any;
}

export const WelcomeBanner = ({ user }: WelcomeBannerProps) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const quickMetrics = [
    { label: 'Active Campaigns', value: '12', icon: Target, trend: '+23%' },
    { label: 'Competitor Alerts', value: '7', icon: AlertTriangle, trend: '+12%' },
    { label: 'Market Changes', value: '34', icon: TrendingUp, trend: '+8%' },
    { label: 'Intelligence Score', value: '87%', icon: Shield, trend: '+15%' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {greeting}, {user?.firstName || 'Agent'}
            </h1>
            <p className="text-muted-foreground">
              Your intelligence command center is operational and monitoring {' '}
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {(user?.firstName?.[0] || user?.fullName?.[0] || 'A').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                      {metric.trend}
                    </Badge>
                  </div>
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/50 backdrop-blur-sm border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button className="justify-start h-auto py-3 px-4">
              <Target className="h-4 w-4 mr-2" />
              Launch Campaign
            </Button>
            <Button className="justify-start h-auto py-3 px-4">
              <Eye className="h-4 w-4 mr-2" />
              Analyze Competitor
            </Button>
            <Button className="justify-start h-auto py-3 px-4">
              <Activity className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
