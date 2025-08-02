/**
 * 🔥 ADVANCED MARKET INTELLIGENCE DASHBOARD
 * 
 * Premium competitive intelligence features for market domination
 * Combines all advanced disruption tools in one powerful interface
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Focus,
  AlertTriangle,
  MapPin,
  Flame,
  Target,
  Zap,
  Shield,
  Brain,
  Radar
} from 'lucide-react';

// Import the new advanced components
import { DominanceMappingDashboard } from '@/components/DominanceMapping/DominanceMapDashboard';
import { AdHijackDashboard } from '@/components/AdSignalHijack/AdHijackDashboard';
import { CrisisDetectorDashboard } from '@/components/CrisisDetector/CrisisDetectorDashboard';
import { GeoRadarDashboard } from '@/components/GeographicRadar/GeoRadarDashboard';

interface AdvancedIntelligenceProps {
  userId: string;
}

export default function AdvancedIntelligence({ userId }: AdvancedIntelligenceProps) {
  const [activeFeature, setActiveFeature] = useState<'dominance' | 'hijack' | 'crisis' | 'geo'>('dominance');
  const businessId = 'demo_business'; // In real app, get from context/props

  const features = [
    {
      id: 'dominance' as const,
      name: 'Dominance Mapping™',
      icon: Crown,
      description: 'Visual competitive intelligence and clout zone mapping',
      badge: '🔥 PREMIUM',
      color: 'text-orange-600 bg-orange-100 border-orange-200'
    },
    {
      id: 'hijack' as const,
      name: 'Ad Signal Hijack™',
      icon: Focus,
      description: 'Reverse-engineer competitor ads and generate superior campaigns',
      badge: '💡 AI-POWERED',
      color: 'text-purple-600 bg-purple-100 border-purple-200'
    },
    {
      id: 'crisis' as const,
      name: 'Crisis Detector',
      icon: AlertTriangle,
      description: 'Monitor competitor vulnerabilities and capitalize on weaknesses',
      badge: '🚨 REAL-TIME',
      color: 'text-red-600 bg-red-100 border-red-200'
    },
    {
      id: 'geo' as const,
      name: 'Geographic Radar™',
      icon: MapPin,
      description: 'Discover untapped markets and competitor weak spots by location',
      badge: '📍 EXCLUSIVE',
      color: 'text-blue-600 bg-blue-100 border-blue-200'
    }
  ];

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'dominance':
        return <DominanceMappingDashboard userId={userId} businessId={businessId} />;
      case 'hijack':
        return <AdHijackDashboard userId={userId} businessId={businessId} />;
      case 'crisis':
        return <CrisisDetectorDashboard userId={userId} businessId={businessId} />;
      case 'geo':
        return <GeoRadarDashboard userId={userId} businessId={businessId} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Advanced Market Intelligence
          </h1>
          <Shield className="h-8 w-8 text-orange-600" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Military-grade competitive intelligence tools for market domination. 
          Exclusive features for premium clients only.
        </p>
        <Badge className="bg-gradient-to-r from-purple-600 to-orange-600 text-white px-4 py-1">
          🔒 PREMIUM ACCESS REQUIRED
        </Badge>
      </div>

      {/* Feature Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          
          return (
            <Card 
              key={feature.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isActive 
                  ? `border-2 ${feature.color} shadow-lg` 
                  : 'border hover:border-gray-300'
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${isActive ? feature.color.split(' ')[0] : 'text-gray-500'}`} />
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${isActive ? feature.color : ''}`}
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className={`text-lg ${isActive ? feature.color.split(' ')[0] : ''}`}>
                  {feature.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Active Feature Dashboard */}
      <div className="min-h-[600px]">
        {renderFeatureContent()}
      </div>

      {/* Coming Soon Features */}
      <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-600">
            <Radar className="h-6 w-6" />
            Coming Soon - Additional Premium Features
          </CardTitle>
          <CardDescription>
            More market disruption tools in development for premium clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Psychographic Ad Sync™</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered emotional tone analysis for maximum ad conversion
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-green-500" />
                <span className="font-medium">Underdog Lift™ System</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Help unknown businesses beat established competitors
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Warm Lead Revival Engine™</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered reactivation of dead leads with personalized hooks
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Industry Forecast Engine™</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Predict demand curves and seasonal spikes before they hit
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-red-500" />
                <span className="font-medium">Black Mirror Tracking™</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Track customer sentiment and narrative shifts in real-time
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Market Prophecy AI™</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Predict competitor moves and market shifts with 90% accuracy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
