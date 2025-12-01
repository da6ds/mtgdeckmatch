import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostHogPageView } from "@/components/PostHogProvider";
import { SavedDecksProvider } from "@/contexts/SavedDecksContext";
import { SavedDecksDrawer } from "@/components/SavedDecksDrawer";
import Welcome from "./pages/Welcome";
import PathSelection from "./pages/PathSelection";
import IPSelection from "./pages/IPSelection";
import VibesQuestions from "./pages/VibesQuestions";
import PowerQuestions from "./pages/PowerQuestions";
import LoadingScreen from "./pages/LoadingScreen";
import Results from "./pages/Results";
import Browse from "./pages/Browse";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SavedDecksProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PostHogPageView />
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/path-selection" element={<PathSelection />} />
              <Route path="/ip-selection" element={<IPSelection />} />
              <Route path="/vibes-questions" element={<VibesQuestions />} />
              <Route path="/power-questions" element={<PowerQuestions />} />
              <Route path="/loading" element={<LoadingScreen />} />
              <Route path="/results" element={<Results />} />
              <Route path="/browse" element={<Browse />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SavedDecksDrawer />
          </BrowserRouter>
        </TooltipProvider>
      </SavedDecksProvider>
    </QueryClientProvider>
  );
};

export default App;
