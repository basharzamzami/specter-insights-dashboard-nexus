/**
 * 🔥 COMPETITIVE CRM - SALES COMMAND CENTER
 * 
 * Military-grade CRM that integrates competitive intelligence, AI coaching,
 * and real-time market signals for maximum sales performance
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  Brain, 
  Target, 
  Users,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

import { CompetitiveSalesDashboard } from '@/components/CRM/CompetitiveSalesDashboard';
import { AISalesCoach } from '@/components/CRM/AISalesCoach';

interface CompetitiveCRMProps {
  userId: string;
}

export default function CompetitiveCRM({ userId }: CompetitiveCRMProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'coach' | 'analytics' | 'automation'>('dashboard');

  const features = [
    {
      icon: Target,
      title: 'Lead Threat Scoring',
      description: 'Real-time competitive threat analysis for every lead',
      badge: '🎯 LIVE'
    },
    {
      icon: Brain,
      title: 'AI Sales Coach',
      description: 'Real-time coaching during calls with objection handling',
      badge: '🧠 AI'
    },
    {
      icon: Activity,
      title: 'Live Market Signals',
      description: 'Instant alerts when competitors target your leads',
      badge: '⚡ REAL-TIME'
    },
    {
      icon: Crown,
      title: 'Zone Dominance',
      description: 'Track market share by zip code with gamification',
      badge: '👑 PREMIUM'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Competitive Sales Command Center
          </h1>
          <Crown className="h-8 w-8 text-blue-600" />
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          The first CRM that merges pipeline management, competitive intelligence, and AI behavior models 
          into one military-grade sales weapon. Not just a CRM — a competitive selling system.
        </p>
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
          🔥 COMPETITIVE ADVANTAGE INCLUDED
        </Badge>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          
          return (
            <Card key={idx} className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-purple-600" />
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Main CRM Interface */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">🎯 Sales Pipeline</TabsTrigger>
          <TabsTrigger value="coach">🧠 AI Coach</TabsTrigger>
          <TabsTrigger value="analytics">📊 Performance</TabsTrigger>
          <TabsTrigger value="automation">⚡ Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <CompetitiveSalesDashboard userId={userId} />
        </TabsContent>

        <TabsContent value="coach" className="space-y-6">
          <AISalesCoach userId={userId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                Advanced Sales Analytics
              </CardTitle>
              <CardDescription>
                Deep performance insights with competitive benchmarking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">34.2%</div>
                  <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                  <div className="text-xs text-green-600">+8% vs competitors</div>
                </div>
                
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$4,500</div>
                  <div className="text-sm text-muted-foreground mb-1">Avg Deal Value</div>
                  <div className="text-xs text-blue-600">+12% vs market</div>
                </div>
                
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">1.2h</div>
                  <div className="text-sm text-muted-foreground mb-1">Response Time</div>
                  <div className="text-xs text-purple-600">67% faster than competitors</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-2">🎯 Competitive Advantage</div>
                <p className="text-sm text-blue-700">
                  Your team is outperforming local competitors by 23% in conversion rate and 67% in response time. 
                  The AI coaching system has improved objection handling by 34% this month.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-orange-600" />
                Smart Sales Automation
              </CardTitle>
              <CardDescription>
                AI-powered automation that adapts to competitive threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Dynamic Follow-Up Sequences</div>
                    <Badge className="bg-green-600">ACTIVE</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    AI generates follow-ups based on lead behavior and competitive activity
                  </p>
                  <div className="text-xs text-green-600">
                    ✅ 23 sequences running • 67% open rate • 34% response rate
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Competitive Threat Auto-Response</div>
                    <Badge className="bg-orange-600">MONITORING</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatically triggers outreach when competitors target your leads
                  </p>
                  <div className="text-xs text-orange-600">
                    🎯 12 threats detected this week • 8 counter-campaigns launched
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Priority Lead Scoring</div>
                    <Badge className="bg-purple-600">LEARNING</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    AI ranks leads by urgency, value, and competitive threat level
                  </p>
                  <div className="text-xs text-purple-600">
                    🧠 Model accuracy: 89% • 156 leads scored today
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Value Proposition */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Why This Isn't Just Another CRM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Competitive Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Every lead comes with real-time competitor analysis, threat scoring, and market context
              </p>
            </div>
            
            <div>
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI Sales Coaching</h3>
              <p className="text-sm text-muted-foreground">
                Real-time coaching during calls with objection handling and competitive responses
              </p>
            </div>
            
            <div>
              <Crown className="h-12 w-12 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Market Domination</h3>
              <p className="text-sm text-muted-foreground">
                Track your market share by zip code and get alerts when territories open up
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
