import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatureOption {
  id: string;
  label: string;
  imageUrl?: string;
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

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Creature Options Grid - 2 columns on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
        {options.map((option) => {
          const isSelected = selectedCreatures.includes(option.id);
          const disabled = isDisabled(option.id);

          return (
            <button
              key={option.id}
              onClick={() => toggleCreature(option.id)}
              disabled={disabled}
              className={cn(
                "relative rounded-lg md:rounded-xl overflow-hidden",
                "border-2 transition-all duration-200",
                "text-center",
                // Use aspect ratio for images, fixed height for text
                option.imageUrl ? "aspect-[3/2] min-h-[100px] md:min-h-[140px]" : "h-[100px] md:h-[140px] flex items-center justify-center bg-gradient-to-br from-card to-card/80 px-5 py-4 md:px-6 md:py-5",
                isSelected
                  ? "border-accent shadow-card-hover scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:scale-[1.01]",
                disabled && "opacity-40 cursor-not-allowed hover:scale-100",
                !disabled && !isSelected && "hover:shadow-md"
              )}
            >
              {/* Image background if available */}
              {option.imageUrl && (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundImage: `url(${option.imageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                </>
              )}

              {/* Checkmark for selected */}
              {isSelected && (
                <div className={cn(
                  "absolute top-1 right-1 md:top-2 md:right-2",
                  "w-5 h-5 md:w-7 md:h-7 rounded-full bg-accent flex items-center justify-center",
                  "animate-scale-in z-10"
                )}>
                  <Check className="w-3 h-3 md:w-5 md:h-5 text-accent-foreground" />
                </div>
              )}

              {/* Label */}
              <div className={cn(
                "relative z-10",
                option.imageUrl ? "absolute bottom-0 left-0 right-0 p-3 md:p-4" : "flex items-center justify-center h-full"
              )}>
                <span className={cn(
                  "font-semibold leading-tight text-center",
                  option.label.length > 15 ? "text-xs md:text-sm" : "text-sm md:text-lg",
                  option.imageUrl ? "text-white drop-shadow-lg" : (isSelected ? "text-accent" : "text-foreground")
                )}>
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Buttons - Fixed on mobile */}
      <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto bg-background/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-2 md:p-0 border-t md:border-t-0 border-border/50 flex flex-col sm:flex-row gap-1.5 md:gap-4 justify-between items-center pt-1 md:pt-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSkip}
          className="w-full sm:w-auto text-xs md:text-base h-8 md:h-9"
        >
          Skip this question
        </Button>

        <Button
          variant="hero"
          size="sm"
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full sm:w-auto gap-1 md:gap-2 text-xs md:text-base h-8 md:h-9"
        >
          Continue
          <span className="text-sm md:text-lg">→</span>
        </Button>
      </div>
    </div>
  );
};
