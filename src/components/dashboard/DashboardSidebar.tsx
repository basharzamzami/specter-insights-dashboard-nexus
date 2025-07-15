import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  Calendar, 
  Target, 
  Activity,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Rss,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  key: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Mission Control", icon: Zap, key: "overview" },
  { name: "Target Analysis", icon: Target, key: "competitors" },
  { name: "Operations", icon: Calendar, key: "campaigns" },
  { name: "Disruption Schedule", icon: Clock, key: "scheduler" },
  { name: "Intel Feed", icon: Rss, key: "intelligence" },
  { name: "Performance", icon: BarChart3, key: "analytics" },
  { name: "Campaign Reports", icon: FileText, key: "reporting" },
  { name: "Activity Log", icon: Activity, key: "activity" },
];

const bottomItems: SidebarItem[] = [
  { name: "Agent Profile", icon: User, key: "profile" },
  { name: "Control Center", icon: Settings, key: "settings" },
];

interface DashboardSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const DashboardSidebar = ({ activeView, onViewChange }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onViewChange(item.key)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
              activeView === item.key
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-colors",
              activeView === item.key ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
            )} />
            {!collapsed && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onViewChange(item.key)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
              activeView === item.key
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-colors",
              activeView === item.key ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
            )} />
            {!collapsed && <span>{item.name}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};