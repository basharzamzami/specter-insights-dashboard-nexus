
import { Bell, Settings, Bot, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  user: any;
  onAIToggle: () => void;
  isAIOpen: boolean;
  onNotificationsClick?: () => void;
}

export const DashboardHeader = ({ user, onAIToggle, isAIOpen, onNotificationsClick }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // For now, just navigate to auth
      navigate("/auth");
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out of Specter Net™",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Specter Net
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant={isAIOpen ? "default" : "ghost"}
            size="sm"
            onClick={onAIToggle}
            className={isAIOpen ? "btn-glow" : ""}
          >
            <Bot className="h-4 w-4 mr-2" />
            Ask Specter
            {!isAIOpen && <Badge variant="secondary" className="ml-2 text-xs">AI</Badge>}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative" 
            onClick={onNotificationsClick}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse"></span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => {
            // Navigate to settings or open settings dialog
            console.log("Settings clicked");
          }}>
            <Settings className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">
                Welcome, {user?.firstName || 'User'}!
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};