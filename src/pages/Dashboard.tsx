import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { CompetitorAnalysis } from "@/components/dashboard/CompetitorAnalysis";
import { CampaignScheduler } from "@/components/dashboard/CampaignScheduler";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { IntelligenceFeed } from "@/components/dashboard/IntelligenceFeed";
import { AdHijackDashboard } from "@/components/AdSignalHijack/AdHijackDashboard";
import { DominanceMappingDashboard } from "@/components/DominanceMapping/DominanceMapDashboard";
import { Loader2, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const {} = useParams();
  const [activeView, setActiveView] = useState("overview");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/auth");
    }
    
    // Set active view based on current path
    const path = window.location.pathname;
    if (path.includes('competitors')) {
      setActiveView('competitors');
    } else if (path.includes('intelligence')) {
      setActiveView('intelligence');
    } else if (path.includes('campaigns')) {
      setActiveView('campaigns');
    } else if (path.includes('ad-hijack')) {
      setActiveView('ad-hijack');
    } else if (path.includes('dominance-map')) {
      setActiveView('dominance-map');
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
              <IntelligenceFeed />
            </div>
          </div>
        );
      case "ad-hijack":
        return <AdHijackDashboard userId={user?.id} businessId="default" />;
      case "dominance-map":
        return <DominanceMappingDashboard userId={user?.id} businessId="default" />;
      case "competitors":
        return <CompetitorAnalysis />;
      case "campaigns":
        return <CampaignScheduler />;
      case "intelligence":
        return <IntelligenceFeed />;
      default:
        return (
          <div className="space-y-8">
            <WelcomeBanner user={user} />
            <div className="grid lg:grid-cols-2 gap-6">
              <CompetitorAnalysis />
              <IntelligenceFeed />
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
          {/* Clean Header */}
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
                <Bell 
                  className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" 
                  onClick={() => setIsNotificationsOpen(true)}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              
              <button
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              >
                Ask Specter
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{user?.firstName || user?.fullName || 'Agent'}</span>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {(user?.firstName?.[0] || user?.fullName?.[0] || 'A').toUpperCase()}
                  </span>
                </div>
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

      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Intelligence Command Center</DialogTitle>
          </DialogHeader>
          <NotificationCenter />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Dashboard;