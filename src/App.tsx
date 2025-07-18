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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/competitor/:id" element={<CompetitorDetails />} />
          <Route path="/campaigns/new" element={<CampaignBuilder />} />
          <Route path="/campaign-details" element={<CampaignDetails />} />
          <Route path="/impact-analysis" element={<ImpactAnalysis />} />
          <Route path="/strategy" element={<StrategyBuilder />} />
          <Route path="/execution" element={<ExecutionCenter />} />
          <Route path="/monitoring" element={<MonitoringDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
