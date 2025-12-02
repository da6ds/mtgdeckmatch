import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OptionCard } from "@/components/OptionCard";
import { Heart, Trophy, ArrowLeft, Library } from "lucide-react";

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
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted p-2 md:p-4 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col py-2 md:py-4 md:pt-12">
        {/* Header */}
        <div className="flex items-center justify-between py-1 md:py-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1 text-xs md:text-sm h-7 md:h-9"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/browse")}
              className="gap-1 text-xs md:text-sm h-7 md:h-9"
            >
              <Library className="w-3 h-3 md:w-4 md:h-4" />
              Browse
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="text-xs md:text-sm h-7 md:h-9"
            >
              Start Over
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="py-2 md:py-3 shrink-0">
          <ProgressIndicator 
            currentStep={0} 
            totalSteps={5}
            onStepClick={(step) => console.log("Step clicked:", step)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center space-y-2 md:space-y-4 animate-fade-in min-h-0">
          <div className="text-center space-y-0.5 md:space-y-1 shrink-0">
            <h2 className="text-lg md:text-3xl font-bold text-foreground">
              How do you want to choose?
            </h2>
            <p className="text-muted-foreground text-xs md:text-base">
              Pick the approach that feels right for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-2.5 md:gap-4 max-w-3xl mx-auto w-full items-stretch">
            {/* Vibes Option */}
            <OptionCard
              title="VIBES"
              description="Match my personal style — cute, creepy, or chaotic"
              icon={Heart}
              onClick={() => handlePathSelect("vibes")}
            />

            {/* Power Option */}
            <OptionCard
              title="POWER"
              description="Build to win — I'm here to compete"
              icon={Trophy}
              onClick={() => handlePathSelect("power")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathSelection;
