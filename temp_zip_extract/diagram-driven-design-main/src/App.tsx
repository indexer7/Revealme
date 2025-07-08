
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FlowDiagramPage from "./pages/FlowDiagramPage";
import AssessmentPage from "./pages/AssessmentPage";
import ReportPage from "./pages/ReportPage";
import ScoringPage from "./pages/ScoringPage";
import MainLayout from "./components/MainLayout";
import ScanStatusPage from "./pages/ScanStatusPage";
import UploadPage from "./pages/UploadPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/scoring" element={<ScoringPage />} />
            <Route path="/scan-status" element={<ScanStatusPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/flow" element={<FlowDiagramPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
