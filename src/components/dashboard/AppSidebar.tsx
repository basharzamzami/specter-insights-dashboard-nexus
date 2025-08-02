import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Target,
  Activity,
  User,
  Settings,
  Zap,
  Clock,
  Rss,
  FileText,
  Home,
  Shield,
  DollarSign,
  Users,
  CheckSquare,
  Mail,
  Share2,
  Cog,
  Trash2,
  Brain
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
  SidebarFooter,
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

const mainItems: SidebarItem[] = [
  { name: "Mission Control", icon: Home, key: "overview" },
  { name: "Target Analysis", icon: Target, key: "competitors", badge: "AI" },
  { name: "Warm Lead Seizure", icon: Target, key: "warm-lead-seizure", badge: "🔥" },
  { name: "Advanced Intelligence", icon: Brain, key: "advanced-intelligence", badge: "🔒" },
  { name: "Competitive CRM", icon: Shield, key: "competitive-crm", badge: "⚔️" },
  { name: "Operations", icon: Calendar, key: "campaigns" },
  { name: "Sales Pipeline", icon: DollarSign, key: "sales" },
  { name: "Leads Manager", icon: Users, key: "leads" },
  { name: "Task Manager", icon: CheckSquare, key: "tasks" },
  { name: "Disruption Schedule", icon: Clock, key: "scheduler" },
  { name: "Intel Feed", icon: Rss, key: "intelligence", badge: "LIVE" },
];

const analyticsItems: SidebarItem[] = [
  { name: "Performance", icon: BarChart3, key: "analytics" },
  { name: "Operations Manager", icon: Cog, key: "operations", badge: "NEW" },
  { name: "Campaign Reports", icon: FileText, key: "reporting" },
  { name: "Activity Log", icon: Activity, key: "activity" },
  { name: "Email Marketing", icon: Mail, key: "email" },
  { name: "Social Media", icon: Share2, key: "social" },
  { name: "Calendar", icon: Calendar, key: "calendar" },
  { name: "Trash Bin", icon: Trash2, key: "trash" },
];

const systemItems: SidebarItem[] = [
  { name: "Agent Profile", icon: User, key: "profile" },
  { name: "Control Center", icon: Settings, key: "settings" },
];

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const AppSidebar = ({ activeView, onViewChange }: AppSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  const isActive = (key: string) => activeView === key;
  
  const renderMenuItems = (items: SidebarItem[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.key}>
          <SidebarMenuButton
            onClick={() => onViewChange(item.key)}
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
                    variant={isActive(item.key) ? "secondary" : "outline"} 
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
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "px-3 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase",
            collapsed && "hidden"
          )}>
            Intelligence
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(analyticsItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            {renderMenuItems(systemItems)}
          </SidebarGroupContent>
        </SidebarGroup>
        
        {!collapsed && (
          <div className="px-3 py-2 animate-fade-in">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Status: OPERATIONAL</span>
              </div>
              <div className="text-[10px] opacity-60">
                Last sync: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};