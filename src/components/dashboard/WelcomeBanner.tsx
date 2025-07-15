import { useState } from "react";
import { Crown, ChevronDown, Target, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WelcomeBannerProps {
  user: any;
}

export const WelcomeBanner = ({ user }: WelcomeBannerProps) => {
  const [selectedClient, setSelectedClient] = useState("Specter Net");
  
  const clients = [
    { name: "Specter Net", status: "active" },
    { name: "TechCorp Solutions", status: "paused" },
    { name: "Digital Dynamics", status: "active" }
  ];

  const stats = [
    { label: "Competitors Tracked", value: "12", icon: Target, color: "text-electric" },
    { label: "Active Campaigns", value: "8", icon: Zap, color: "text-primary" },
    { label: "Market Share Gain", value: "+15%", icon: TrendingUp, color: "text-success" }
  ];

  return (
    <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-large overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10"></div>
      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-yellow-300" />
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.firstName || "Agent"} — ready to dominate?
              </h1>
            </div>
            <p className="text-lg text-primary-foreground/80">
              Here's your market control console.
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <span className="mr-2">{selectedClient}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {clients.map((client) => (
                <DropdownMenuItem 
                  key={client.name}
                  onClick={() => setSelectedClient(client.name)}
                  className="flex items-center justify-between"
                >
                  <span>{client.name}</span>
                  <Badge 
                    variant={client.status === "active" ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {client.status}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20 slide-in animate-delay-${(index + 1) * 100}`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <stat.icon className={`h-5 w-5 ${stat.color === "text-electric" ? "text-yellow-300" : 
                    stat.color === "text-primary" ? "text-blue-300" : "text-green-300"}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};