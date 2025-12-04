import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostHogPageView } from "@/components/PostHogProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SavedDecksProvider } from "@/contexts/SavedDecksContext";
import { SavedDecksDrawer } from "@/components/SavedDecksDrawer";
import { ArrowLeft } from "lucide-react";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import PathSelection from "./pages/PathSelection";
import IPSelection from "./pages/IPSelection";
import VibesQuestions from "./pages/VibesQuestions";
import PowerQuestions from "./pages/PowerQuestions";
import LoadingScreen from "./pages/LoadingScreen";
import Results from "./pages/Results";
import Browse from "./pages/Browse";
import Discover from "./pages/Discover";
import DeckDetailPage from "./pages/DeckDetailPage";
import CardSetDetailPage from "./pages/CardSetDetailPage";
import Learn from "./pages/Learn";
import LearnArticlePage from "./pages/LearnArticlePage";
import GlossaryPage from "./pages/GlossaryPage";
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
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/path-selection" element={<PathSelection />} />
              <Route path="/ip-selection" element={<IPSelection />} />
              <Route path="/vibes-questions" element={<VibesQuestions />} />
              <Route path="/power-questions" element={<PowerQuestions />} />
              <Route path="/loading" element={<LoadingScreen />} />
              <Route path="/results" element={<Results />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/deck/:id" element={<DeckDetailPage />} />
              <Route path="/card-set/:id" element={<CardSetDetailPage />} />
              <Route path="/play" element={<PathSelection />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/glossary" element={<GlossaryPage />} />
              <Route path="/learn/:slug" element={<LearnArticlePage />} />
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
