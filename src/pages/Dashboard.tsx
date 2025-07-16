import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { CompetitorAnalysis } from "@/components/dashboard/CompetitorAnalysis";
import { CampaignScheduler } from "@/components/dashboard/CampaignScheduler";
import { ActivityLogs } from "@/components/dashboard/ActivityLogs";
import { PerformanceOps } from "@/components/dashboard/PerformanceOps";
import { AgentProfile } from "@/components/dashboard/AgentProfile";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { IntelligenceSettings } from "@/components/dashboard/IntelligenceSettings";
import { DisruptionScheduler } from "@/components/dashboard/DisruptionScheduler";
import { IntelligenceFeed } from "@/components/dashboard/IntelligenceFeed";
import { CampaignReporting } from "@/components/dashboard/CampaignReporting";
import { SalesPipeline } from "@/components/dashboard/SalesPipeline";
import { LeadsManager } from "@/components/dashboard/LeadsManager";
import { TaskManager } from "@/components/dashboard/TaskManager";
import { EmailMarketing } from "@/components/dashboard/EmailMarketing";
import { SocialMediaManager } from "@/components/dashboard/SocialMediaManager";
import { CalendarScheduler } from "@/components/dashboard/CalendarScheduler";
import { Loader2, Bell } from "lucide-react";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("overview");
  const [isAIOpen, setIsAIOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/auth");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your command center...</p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "overview":
        return (
          <div className="space-y-8">
            <WelcomeBanner user={user} />
            <div className="grid lg:grid-cols-2 gap-6">
              <CompetitorAnalysis />
              <div className="space-y-6">
                <DisruptionScheduler />
                <NotificationCenter />
              </div>
            </div>
          </div>
        );
      case "competitors":
        return <CompetitorAnalysis />;
      case "campaigns":
        return <CampaignScheduler />;
      case "scheduler":
        return <DisruptionScheduler />;
      case "intelligence":
        return <IntelligenceFeed />;
      case "analytics":
        return <PerformanceOps />;
      case "activity":
        return <ActivityLogs />;
      case "profile":
        return <AgentProfile user={user} />;
      case "settings":
        return <IntelligenceSettings />;
      case "reporting":
        return <CampaignReporting />;
      case "sales":
        return <SalesPipeline />;
      case "leads":
        return <LeadsManager />;
      case "tasks":
        return <TaskManager />;
      case "email":
        return <EmailMarketing />;
      case "social":
        return <SocialMediaManager />;
      case "calendar":
        return <CalendarScheduler />;
      default:
        return (
          <div className="space-y-8">
            <WelcomeBanner user={user} />
            <div className="grid lg:grid-cols-2 gap-6">
              <CompetitorAnalysis />
              <div className="space-y-6">
                <DisruptionScheduler />
                <IntelligenceFeed />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header with Sidebar Trigger */}
          <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors" />
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">All systems operational</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              
              <button
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              >
                Ask Specter
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || "Agent"}
                </span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto animate-fade-in">
            <div className="max-w-7xl mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>

        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;