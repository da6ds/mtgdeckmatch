import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { Glossary } from "@/components/Glossary";
import { BackButton } from "@/components/BackButton";
import { BookOpen, Sparkles } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

const GlossaryPage = () => {
  usePageTitle("MTG Glossary");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {/* Back Button */}
            <BackButton fallbackPath="/learn" className="mb-4" />

            {/* Icon and Title */}
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <BookOpen className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Magic Terms Glossary
            </h1>
            <p className="text-lg text-muted-foreground">
              Quick reference for common Magic: The Gathering and Commander terms
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Glossary Component */}
          <Glossary />

          {/* Footer CTAs */}
          <div className="border-t border-border/50 pt-8">
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-center text-muted-foreground">
                Ready to explore decks?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => navigate("/play")}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Find My Perfect Deck
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/browse")}
                  className="flex items-center gap-2"
                >
                  Browse All Decks
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlossaryPage;
