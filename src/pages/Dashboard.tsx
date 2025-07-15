import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
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
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          user={user} 
          onAIToggle={() => setIsAIOpen(!isAIOpen)}
          isAIOpen={isAIOpen}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default Dashboard;