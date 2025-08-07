import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Zap, 
  Eye,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface WelcomeBannerProps {
  user: any;
}

export const WelcomeBanner = ({ user }: WelcomeBannerProps) => {
  const threatData = [
    { name: 'Mon', threats: 12, opportunities: 8 },
    { name: 'Tue', threats: 19, opportunities: 12 },
    { name: 'Wed', threats: 15, opportunities: 18 },
    { name: 'Thu', threats: 22, opportunities: 14 },
    { name: 'Fri', threats: 18, opportunities: 22 },
    { name: 'Sat', threats: 11, opportunities: 16 },
    { name: 'Sun', threats: 14, opportunities: 19 }
  ];

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });

  const stats = [
    {
      title: "Active Threats",
      value: "7",
      change: "+2 from yesterday",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-400/10"
    },
    {
      title: "Opportunities",
      value: "12",
      change: "+5 from yesterday", 
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    {
      title: "Intelligence Score",
      value: "94%",
      change: "+3% from yesterday",
      icon: Shield,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      title: "Market Position",
      value: "#2",
      change: "↑1 from last week",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                Welcome back, Agent {user?.firstName || user?.fullName || 'Operative'}
              </CardTitle>
              <CardDescription className="text-base">
                Command Center Status: <span className="text-green-400 font-semibold">OPERATIONAL</span> • 
                Local Time: <span className="font-mono">{currentTime}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-green-400/30 text-green-400">
                <Activity className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Intelligence Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Launch Competitor Scan
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Monitor Ad Campaigns
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Intelligence Report
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Data Collection</span>
                <span className="text-green-400">98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analysis Engine</span>
                <span className="text-green-400">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Intelligence Network</span>
                <span className="text-green-400">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">24/7</p>
                <p className="text-xs text-muted-foreground">Monitoring</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">1.2M</p>
                <p className="text-xs text-muted-foreground">Data Points</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">47</p>
                <p className="text-xs text-muted-foreground">Active Targets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
