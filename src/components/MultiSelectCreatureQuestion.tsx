import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatureOption {
  id: string;
  label: string;
}

interface MultiSelectCreatureQuestionProps {
  options: CreatureOption[];
  onSubmit: (selectedCreatures: string[]) => void;
  maxSelections?: number;
}

export const MultiSelectCreatureQuestion = ({ 
  options, 
  onSubmit,
  maxSelections = 3 
}: MultiSelectCreatureQuestionProps) => {
  const [selectedCreatures, setSelectedCreatures] = useState<string[]>([]);
  const [skipped, setSkipped] = useState(false);

  const canSelectMore = selectedCreatures.length < maxSelections;
  const isDisabled = (creatureId: string) => 
    !selectedCreatures.includes(creatureId) && !canSelectMore;

  const toggleCreature = (creatureId: string) => {
    if (selectedCreatures.includes(creatureId)) {
      // Deselect
      setSelectedCreatures(prev => prev.filter(c => c !== creatureId));
      setSkipped(false);
    } else if (canSelectMore) {
      // Select
      setSelectedCreatures(prev => [...prev, creatureId]);
      setSkipped(false);
    }
  };

  const handleSkip = () => {
    setSelectedCreatures([]);
    setSkipped(true);
    onSubmit(["Skip this question"]);
  };

  const handleContinue = () => {
    onSubmit(selectedCreatures);
  };

  const canContinue = selectedCreatures.length > 0 || skipped;

  const getCounterText = () => {
    if (selectedCreatures.length === 0) {
      return "Select up to 3";
    } else if (selectedCreatures.length === maxSelections) {
      return `${selectedCreatures.length} of ${maxSelections} selected (max reached)`;
    } else {
      return `${selectedCreatures.length} of ${maxSelections} selected`;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Selection Counter */}
      <div className="text-center">
        <p className={cn(
          "text-base font-medium transition-colors",
          selectedCreatures.length === maxSelections 
            ? "text-accent" 
            : "text-muted-foreground"
        )}>
          {getCounterText()}
        </p>
      </div>

      {/* Creature Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {options.map((option) => {
          const isSelected = selectedCreatures.includes(option.id);
          const disabled = isDisabled(option.id);

          return (
            <button
              key={option.id}
              onClick={() => toggleCreature(option.id)}
              disabled={disabled}
              className={cn(
                "relative bg-gradient-to-br from-card to-card/80 rounded-xl p-4",
                "border-2 transition-all duration-200",
                "text-left min-h-[80px] flex items-center justify-center",
                isSelected
                  ? "border-accent shadow-card-hover bg-accent/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:scale-[1.01]",
                disabled && "opacity-40 cursor-not-allowed hover:scale-100",
                !disabled && !isSelected && "hover:shadow-md"
              )}
            >
              {/* Checkmark for selected */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center animate-scale-in">
                  <Check className="w-4 h-4 text-accent-foreground" />
                </div>
              )}

              {/* Creature Label */}
              <span className={cn(
                "text-sm md:text-base font-semibold text-center px-6",
                isSelected ? "text-accent" : "text-foreground"
              )}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleSkip}
          className="w-full sm:w-auto"
        >
          Skip this question
        </Button>

        <Button
          variant="hero"
          size="lg"
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full sm:w-auto gap-2"
        >
          Continue
          <span className="text-lg">→</span>
        </Button>
      </div>
    </div>
  );
};
