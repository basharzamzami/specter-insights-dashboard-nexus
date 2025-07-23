import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import CompetitorDetails from "./pages/CompetitorDetails";
import CampaignBuilder from "./pages/CampaignBuilder";
import CampaignDetails from "./pages/CampaignDetails";
import ImpactAnalysis from "./pages/ImpactAnalysis";
import StrategyBuilder from "./pages/StrategyBuilder";
import ExecutionCenter from "./pages/ExecutionCenter";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import { ClientOnboarding } from "@/components/auth/ClientOnboarding";
import { AuthGuard } from "@/components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/dashboard/:userId?" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<AuthGuard><ClientOnboarding /></AuthGuard>} />
          
          {/* Direct Access Routes for All Modules */}
          <Route path="/target-analysis" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/ai-reports" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/operations" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/campaign-insights" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/task-flow" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/disruption-schedule" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/calendar" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/email-marketing" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/trash-bin" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/intel-feed" element={<AuthGuard><Dashboard /></AuthGuard>} />
          
          {/* Existing Routes */}
          <Route path="/competitor/:id" element={<AuthGuard><CompetitorDetails /></AuthGuard>} />
          <Route path="/campaigns/new" element={<AuthGuard><CampaignBuilder /></AuthGuard>} />
          <Route path="/campaign-details" element={<AuthGuard><CampaignDetails /></AuthGuard>} />
          <Route path="/impact-analysis" element={<AuthGuard><ImpactAnalysis /></AuthGuard>} />
          <Route path="/strategy" element={<AuthGuard><StrategyBuilder /></AuthGuard>} />
          <Route path="/execution" element={<AuthGuard><ExecutionCenter /></AuthGuard>} />
          <Route path="/monitoring" element={<AuthGuard><MonitoringDashboard /></AuthGuard>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
