
import { useLocation, useNavigate } from "react-router-dom";
import {
  Target,
  Shield,
  MapPin,
  TrendingUp,
  Bell,
  Calendar
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  key: string;
  badge?: string;
}

// Only the 6 requested features
const mainItems: SidebarItem[] = [
  { name: "Ad Signal Hijack", icon: Target, key: "ad-hijack", badge: "🎯" },
  { name: "Warm Lead Locator", icon: Target, key: "warm-lead-seizure", badge: "🔥" },
  { name: "Dominance Map", icon: MapPin, key: "dominance-map", badge: "📍" },
  { name: "Target Analysis Generator", icon: TrendingUp, key: "competitors", badge: "AI" },
  { name: "Change Alerts", icon: Bell, key: "intelligence", badge: "LIVE" },
  { name: "Campaign Manager", icon: Calendar, key: "campaigns", badge: "📊" },
];

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const AppSidebar = ({ activeView, onViewChange }: AppSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (key: string) => {
    // Check if this key should navigate to a dedicated page
    const dedicatedPageRoutes = {
      "warm-lead-seizure": "/warm-lead-seizure",
    };
    
    if (dedicatedPageRoutes[key as keyof typeof dedicatedPageRoutes]) {
      return location.pathname === dedicatedPageRoutes[key as keyof typeof dedicatedPageRoutes];
    }
    
    return activeView === key;
  };
  
  const renderMenuItems = (items: SidebarItem[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.key}>
          <SidebarMenuButton
            onClick={() => {
              // Handle dedicated page navigation
              const dedicatedPageRoutes = {
                "warm-lead-seizure": "/warm-lead-seizure",
              };
              
              if (dedicatedPageRoutes[item.key as keyof typeof dedicatedPageRoutes]) {
                navigate(dedicatedPageRoutes[item.key as keyof typeof dedicatedPageRoutes]);
              } else {
                onViewChange(item.key);
              }
            }}
            className={cn(
              "group transition-all duration-300 cursor-pointer",
              isActive(item.key) 
                ? "bg-primary text-primary-foreground font-semibold shadow-lg" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-all duration-300",
              isActive(item.key) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
            )} />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="animate-fade-in">{item.name}</span>
                {item.badge && (
                  <Badge 
                    className="text-xs px-1.5 py-0.5 animate-scale-in"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className={cn(
      "border-r border-border/50 transition-all duration-300",
      collapsed ? "w-14" : "w-64"
    )}>
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SPECTER NET
              </h2>
              <p className="text-xs text-muted-foreground">Intelligence Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "px-3 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase",
            collapsed && "hidden"
          )}>
            Core Features
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
