import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Heart, Trophy, Film, ArrowLeft } from "lucide-react";

const PathSelection = () => {
  const navigate = useNavigate();

  const handlePathSelect = (path: "vibes" | "power" | "pop_culture") => {
    if (path === "vibes") {
      navigate("/vibes-questions");
    } else if (path === "power") {
      navigate("/power-questions");
    } else if (path === "pop_culture") {
      navigate("/ip-selection");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-3 md:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-3 md:py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
          >
            Start Over
          </Button>
        </div>

        {/* Progress */}
        <ProgressIndicator 
          currentStep={0} 
          totalSteps={5}
          onStepClick={(step) => console.log("Step clicked:", step)}
        />

        {/* Main Content */}
        <div className="mt-4 md:mt-8 space-y-4 md:space-y-6 animate-fade-in">
          <div className="text-center space-y-1 md:space-y-2">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              How do you want to choose?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Pick the approach that feels right for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-12 max-w-4xl mx-auto">
            {/* Vibes Option */}
            <button
              onClick={() => handlePathSelect("vibes")}
              className="group relative bg-gradient-to-br from-card to-card/80 rounded-2xl p-5 md:p-8 border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-card-hover text-left"
            >
              <div className="space-y-3 md:space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:from-secondary/30 group-hover:to-secondary/20 transition-all duration-300">
                  <Heart className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                </div>
                
                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    VIBES
                  </h3>
                  <p className="text-base md:text-lg text-foreground font-medium">
                    Match my personal style
                  </p>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Example: "Cute, creepy, or chaotic"
                  </p>
                </div>
              </div>

              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-accent font-semibold text-xs md:text-sm">Choose this path →</span>
              </div>
            </button>

            {/* Pop Culture Option - Hidden but preserved for future use */}
            {/* <button
              onClick={() => handlePathSelect("pop_culture")}
              className="group relative bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-card-hover text-left"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <Film className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    POP CULTURE
                  </h3>
                  <p className="text-lg text-foreground font-medium">
                    Decks from shows, movies & games
                  </p>
                  <p className="text-muted-foreground">
                    Example: "Walking Dead or Transformers"
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-accent font-semibold text-sm">Choose this path →</span>
              </div>
            </button> */}

            {/* Power Option */}
            <button
              onClick={() => handlePathSelect("power")}
              className="group relative bg-gradient-to-br from-card to-card/80 rounded-2xl p-5 md:p-8 border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-card-hover text-left"
            >
              <div className="space-y-3 md:space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                </div>
                
                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    POWER
                  </h3>
                  <p className="text-base md:text-lg text-foreground font-medium">
                    Build to win
                  </p>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Example: "I'm here to compete"
                  </p>
                </div>
              </div>

              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-accent font-semibold text-xs md:text-sm">Choose this path →</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathSelection;
