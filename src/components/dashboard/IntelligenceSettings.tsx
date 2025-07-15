import { useState } from "react";
import { Settings, Shield, Users, Key, Zap, Clock, Bell, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export const IntelligenceSettings = () => {
  const { toast } = useToast();
  const [aggressiveMode, setAggressiveMode] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);
  const [realTimeAlerts, setRealTimeAlerts] = useState(true);
  const [autoResponse, setAutoResponse] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Your intelligence configuration has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="h-6 w-6" />
            Intelligence Control Center
          </h2>
          <p className="text-muted-foreground">Configure your strategic operations and monitoring systems</p>
        </div>
        <Badge variant="outline" className="border-primary text-primary">
          Military Grade
        </Badge>
      </div>

      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
          {/* Operational Mode */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-warning" />
                Operational Mode
              </CardTitle>
              <CardDescription>
                Configure the intensity and approach of your intelligence operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Aggressive Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Unlock advanced tactics including negative SEO, competitor disruption, and market manipulation
                  </p>
                </div>
                <Switch 
                  checked={aggressiveMode} 
                  onCheckedChange={setAggressiveMode}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Stealth Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Hide your activities from competitor detection and maintain operational security
                  </p>
                </div>
                <Switch 
                  checked={stealthMode} 
                  onCheckedChange={setStealthMode}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Real-time Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Instant notifications for competitor movements, market changes, and opportunities
                  </p>
                </div>
                <Switch 
                  checked={realTimeAlerts} 
                  onCheckedChange={setRealTimeAlerts}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Auto-Response</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically execute counter-measures when threats are detected
                  </p>
                </div>
                <Switch 
                  checked={autoResponse} 
                  onCheckedChange={setAutoResponse}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Advanced security settings for sensitive operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Export Intelligence Data
                </Button>
                <Button variant="outline" className="justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Input type="number" placeholder="90" className="w-32" />
                <p className="text-xs text-muted-foreground">Days to keep operational data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personas" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                Persona Manager
              </CardTitle>
              <CardDescription>
                Create and manage strategic personas for different platforms and operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Alpha Operative</p>
                      <p className="text-sm text-muted-foreground">LinkedIn, Twitter, Industry Forums</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Market Analyst</p>
                      <p className="text-sm text-muted-foreground">Reddit, Discord, Slack Communities</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>

              <Button className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Create New Persona
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-accent" />
                API Integrations
              </CardTitle>
              <CardDescription>
                Connect external services for enhanced intelligence gathering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {[
                  { name: "OpenAI GPT-4", status: "Connected", color: "success" },
                  { name: "SEMrush API", status: "Disconnected", color: "destructive" },
                  { name: "Ahrefs API", status: "Connected", color: "success" },
                  { name: "Facebook Graph API", status: "Pending", color: "warning" },
                  { name: "Twitter API v2", status: "Connected", color: "success" },
                  { name: "LinkedIn Sales Navigator", status: "Disconnected", color: "destructive" }
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        <Key className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            integration.color === 'success' ? 'border-success text-success' :
                            integration.color === 'warning' ? 'border-warning text-warning' :
                            'border-destructive text-destructive'
                          }`}
                        >
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {integration.status === "Connected" ? "Configure" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Operation History
              </CardTitle>
              <CardDescription>
                View and export past intelligence operations and campaign results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { operation: "Competitor Analysis - TechCorp", date: "2 hours ago", result: "3 vulnerabilities found" },
                  { operation: "Keyword Hijacking Campaign", date: "1 day ago", result: "15% traffic increase" },
                  { operation: "Social Sentiment Disruption", date: "3 days ago", result: "Sentiment down 8%" },
                  { operation: "SEO Counter-Attack", date: "1 week ago", result: "Regained 5 positions" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.operation}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-success">{item.result}</p>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">View</Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Export All History
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="btn-glow">
          Save Configuration
        </Button>
      </div>
    </div>
  );
};