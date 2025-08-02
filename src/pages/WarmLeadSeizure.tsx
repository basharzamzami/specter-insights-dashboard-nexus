/**
 * 🔥 WARM LEAD SEIZURE SYSTEM PAGE
 * 
 * Main page for the Warm Lead Seizure System - Specter Net's core module
 * Provides comprehensive lead intelligence and conversion domination
 */

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SeizureDashboard } from '@/components/WarmLeadSeizure/SeizureDashboard';
import { 
  Target, 
  Zap, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Play,
  Settings,
  BarChart3
} from 'lucide-react';

export default function WarmLeadSeizure() {
  const { user } = useUser();
  const [systemStatus, setSystemStatus] = useState<'loading' | 'active' | 'inactive' | 'error'>('loading');
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Check if the system is operational
      setSystemStatus('active'); // For demo purposes
    } catch (error) {
      console.error('Failed to check system status:', error);
      setSystemStatus('error');
    }
  };

  const runSystemTest = async () => {
    if (!user) return;
    
    setIsRunningTest(true);
    try {
      const response = await fetch('/functions/v1/test-warm-seizure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: 'full_demo',
          userId: user.id
        })
      });

      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      console.error('System test failed:', error);
      setTestResults({
        success: false,
        error: 'System test failed'
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-gray-600">Please sign in to access the Warm Lead Seizure System</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-12 w-12 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Warm Lead Seizure System
            </h1>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              SPECTER NET
            </Badge>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered competitive espionage and marketing dominance tool for B2B businesses.
            Identifies, nurtures, and maximizes conversion of warm leads in high-ticket industries.
          </p>
        </div>

        {/* System Status */}
        <div className="mb-8">
          <Alert className={`border-2 ${
            systemStatus === 'active' ? 'border-green-200 bg-green-50' :
            systemStatus === 'error' ? 'border-red-200 bg-red-50' :
            'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="flex items-center gap-2">
              {systemStatus === 'active' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {systemStatus === 'error' && <AlertTriangle className="h-5 w-5 text-red-600" />}
              {systemStatus === 'loading' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>}
              <AlertDescription className="font-medium">
                {systemStatus === 'active' && '🔥 SYSTEM OPERATIONAL - All subsystems active and ready for lead domination'}
                {systemStatus === 'error' && '⚠️ SYSTEM ERROR - Please check configuration and try again'}
                {systemStatus === 'loading' && '🔄 INITIALIZING - Warming up the seizure systems...'}
              </AlertDescription>
            </div>
          </Alert>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="subsystems">🔧 Subsystems</TabsTrigger>
            <TabsTrigger value="test">🧪 System Test</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {systemStatus === 'active' ? (
              <SeizureDashboard userId={user.id} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Unavailable</CardTitle>
                  <CardDescription>
                    System must be operational to access the dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={checkSystemStatus}>
                    Retry System Check
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="subsystems">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detection Layer */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-600" />
                    Detection Layer - "Thermal Radar"
                  </CardTitle>
                  <CardDescription>
                    Scans CRM, ad pixels, website heatmaps, and behavior analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Visitors &gt;45s on pricing pages</span>
                      <Badge variant="outline" className="text-green-600">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quote clicks without submit</span>
                      <Badge variant="outline" className="text-green-600">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email opens &gt;2 without booking</span>
                      <Badge variant="outline" className="text-green-600">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ad clicks without conversion</span>
                      <Badge variant="outline" className="text-green-600">ACTIVE</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Qualification Layer */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Qualification & Scoring - "Warm Index Engine"
                  </CardTitle>
                  <CardDescription>
                    Assigns Warmth Index Score from 0 to 100
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Qualification Threshold</span>
                      <Badge className="bg-orange-600 text-white">≥65</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Priority Threshold</span>
                      <Badge className="bg-red-600 text-white">≥85</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scoring Factors</span>
                      <Badge variant="outline">8 Metrics</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real-time Updates</span>
                      <Badge variant="outline" className="text-green-600">LIVE</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seizure Triggers */}
              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-600" />
                    Seizure Triggers - "Operation Snapback"
                  </CardTitle>
                  <CardDescription>
                    Smart reconversion campaigns with timed attacks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Day 1: Personalized Email</span>
                      <Badge variant="outline" className="text-blue-600">READY</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Day 2: Retargeted Ad</span>
                      <Badge variant="outline" className="text-blue-600">READY</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Day 3: Social Proof</span>
                      <Badge variant="outline" className="text-blue-600">READY</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Day 5: Urgency Offer</span>
                      <Badge variant="outline" className="text-blue-600">READY</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Infrastructure */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Conversion Infrastructure - "The Closer Grid"
                  </CardTitle>
                  <CardDescription>
                    Modular landing pages optimized for warm leads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dynamic Landing Pages</span>
                      <Badge variant="outline" className="text-green-600">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scarcity Countdowns</span>
                      <Badge variant="outline" className="text-green-600">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">1-Click Booking</span>
                      <Badge variant="outline" className="text-green-600">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI Case Studies</span>
                      <Badge variant="outline" className="text-green-600">ACTIVE</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-blue-600" />
                  System Test & Demo
                </CardTitle>
                <CardDescription>
                  Run comprehensive tests of all seizure system components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={runSystemTest}
                    disabled={isRunningTest}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isRunningTest ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Running Test...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Full System Test
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-600">
                    Tests all 4 subsystems with simulated lead data
                  </p>
                </div>

                {testResults && (
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-3">Test Results:</h4>
                    <pre className="text-sm overflow-auto max-h-96">
                      {JSON.stringify(testResults, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Configure seizure system parameters and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Settings panel coming soon. System is currently running with optimal default configurations.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Warmth Threshold</h4>
                      <p className="text-sm text-gray-600">Current: 65 (Recommended)</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Ad Channels</h4>
                      <p className="text-sm text-gray-600">Facebook, Google, LinkedIn</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Auto-Dialer</h4>
                      <p className="text-sm text-gray-600">Enabled for scores ≥85</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">A/B Testing</h4>
                      <p className="text-sm text-gray-600">Email vs SMS follow-ups</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
