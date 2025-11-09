import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Heart, Trophy, ArrowLeft } from "lucide-react";

const PathSelection = () => {
  const navigate = useNavigate();

  const handlePathSelect = (path: "vibes" | "power") => {
    // TODO: Store path selection and navigate to questions
    console.log("Selected path:", path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
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
        <div className="mt-8 space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How do you want to choose?
            </h2>
            <p className="text-muted-foreground text-lg">
              Pick the approach that feels right for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* Vibes Option */}
            <button
              onClick={() => handlePathSelect("vibes")}
              className="group relative bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-card-hover text-left"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:from-secondary/30 group-hover:to-secondary/20 transition-all duration-300">
                  <Heart className="w-8 h-8 text-secondary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    VIBES
                  </h3>
                  <p className="text-lg text-foreground font-medium">
                    I want a deck that matches my style
                  </p>
                  <p className="text-muted-foreground">
                    Example: "I want a deck that's all kitties"
                  </p>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-accent font-semibold">Choose this path →</span>
              </div>
            </button>

            {/* Power Option */}
            <button
              onClick={() => handlePathSelect("power")}
              className="group relative bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-card-hover text-left"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                  <Trophy className="w-8 h-8 text-accent" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    POWER
                  </h3>
                  <p className="text-lg text-foreground font-medium">
                    I want to build a competitive deck
                  </p>
                  <p className="text-muted-foreground">
                    Example: "I'm here to win"
                  </p>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-accent font-semibold">Choose this path →</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathSelection;
