import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Settings, Shield, Users, Key, Zap, Clock, Bell, Database, Upload, Trash2, Edit, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const IntelligenceSettings = () => {
  const { user } = useUser();
  const [aggressiveMode, setAggressiveMode] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);
  const [realTimeAlerts, setRealTimeAlerts] = useState(true);
  const [autoResponse, setAutoResponse] = useState(false);
  const [personas, setPersonas] = useState<any[]>([]);
  const [isPersonaDialogOpen, setIsPersonaDialogOpen] = useState(false);
  const [newPersona, setNewPersona] = useState({
    name: "",
    platform: "",
    voice_tone: "",
    scripts: {}
  });

  useEffect(() => {
    loadUserSettings();
    loadPersonas();
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setAggressiveMode(data.aggressive_mode);
      setStealthMode(data.stealth_mode);
      const notifications = data.notifications as any;
      setRealTimeAlerts(notifications?.real_time_alerts ?? true);
      setAutoResponse(notifications?.auto_response ?? false);
    }
  };

  const loadPersonas = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('personas')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPersonas(data);
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    const settings = {
      user_id: user.id,
      aggressive_mode: aggressiveMode,
      stealth_mode: stealthMode,
      notifications: {
        real_time_alerts: realTimeAlerts,
        auto_response: autoResponse
      }
    };

    const { error } = await supabase
      .from('user_settings')
      .upsert(settings);

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings Updated", {
        description: "Your intelligence configuration has been saved."
      });
    }
  };

  const handleCreatePersona = async () => {
    if (!user || !newPersona.name || !newPersona.platform) return;

    const { error } = await supabase
      .from('personas')
      .insert([{
        ...newPersona,
        created_by: user.id
      }]);

    if (error) {
      toast.error("Failed to create persona");
    } else {
      toast.success("Persona created successfully");
      setIsPersonaDialogOpen(false);
      setNewPersona({ name: "", platform: "", voice_tone: "", scripts: {} });
      loadPersonas();
    }
  };

  const handleDeletePersona = async (id: string) => {
    const { error } = await supabase
      .from('personas')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete persona");
    } else {
      toast.success("Persona deleted");
      loadPersonas();
    }
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
                {personas.map((persona) => (
                  <div key={persona.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{persona.name}</p>
                        <p className="text-sm text-muted-foreground">{persona.platform}</p>
                        <p className="text-xs text-muted-foreground">{persona.voice_tone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeletePersona(persona.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {personas.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No personas created yet</p>
                    <p className="text-sm">Create your first operational persona below</p>
                  </div>
                )}
              </div>

              <Dialog open={isPersonaDialogOpen} onOpenChange={setIsPersonaDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Persona
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Strategic Persona</DialogTitle>
                    <DialogDescription>
                      Design a persona for specific platforms and operational tactics
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Persona Name</Label>
                      <Input 
                        value={newPersona.name}
                        onChange={(e) => setNewPersona(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Alpha Operative, Market Analyst"
                      />
                    </div>
                    <div>
                      <Label>Primary Platform</Label>
                      <Select 
                        value={newPersona.platform}
                        onValueChange={(value) => setNewPersona(prev => ({ ...prev, platform: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Twitter/X">Twitter/X</SelectItem>
                          <SelectItem value="Reddit">Reddit</SelectItem>
                          <SelectItem value="Discord">Discord</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Industry Forums">Industry Forums</SelectItem>
                          <SelectItem value="Review Sites">Review Sites</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Voice Tone</Label>
                      <Select 
                        value={newPersona.voice_tone}
                        onValueChange={(value) => setNewPersona(prev => ({ ...prev, voice_tone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Casual">Casual</SelectItem>
                          <SelectItem value="Authoritative">Authoritative</SelectItem>
                          <SelectItem value="Concerned Customer">Concerned Customer</SelectItem>
                          <SelectItem value="Industry Expert">Industry Expert</SelectItem>
                          <SelectItem value="Skeptical">Skeptical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleCreatePersona} className="flex-1">
                        Create Persona
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsPersonaDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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