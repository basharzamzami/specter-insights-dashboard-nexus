import { UserButton } from "@clerk/clerk-react";
import { Bell, Settings, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  user: any;
  onAIToggle: () => void;
  isAIOpen: boolean;
}

export const DashboardHeader = ({ user, onAIToggle, isAIOpen }: DashboardHeaderProps) => {

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
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
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
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};