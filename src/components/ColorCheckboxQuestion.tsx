import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ColorOption {
  id: string;
  name: string;
  symbol: string;
}

interface ColorCheckboxQuestionProps {
  colorOptions?: ColorOption[];
  onSubmit: (selectedColors: string[]) => void;
  maxSelections?: number;
}

export const ColorCheckboxQuestion = ({ 
  colorOptions = [], 
  onSubmit,
  maxSelections = 4 
}: ColorCheckboxQuestionProps) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [noPreference, setNoPreference] = useState(false);

  const handleColorToggle = (colorId: string) => {
    setNoPreference(false);
    setSelectedColors((prev) => {
      if (prev.includes(colorId)) {
        return prev.filter((id) => id !== colorId);
      } else if (prev.length < maxSelections) {
        return [...prev, colorId];
      }
      return prev;
    });
  };

  const handleNoPreference = () => {
    setNoPreference(!noPreference);
    if (!noPreference) {
      setSelectedColors([]);
    }
  };

  const handleSubmit = () => {
    if (noPreference) {
      onSubmit([]);
    } else {
      onSubmit(selectedColors);
    }
  };

  const canSubmit = noPreference || selectedColors.length > 0;

  return (
    <div className="space-y-3 md:space-y-4 max-w-2xl mx-auto">
      {/* Helper Text */}
      <p className="text-center text-muted-foreground text-xs md:text-sm px-2">
        Select up to {maxSelections} colors or skip
      </p>
      
      {/* Color Options - Compact 2-column grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 items-stretch">
        {colorOptions.map((color) => {
          const isDisabled = noPreference || (selectedColors.length >= maxSelections && !selectedColors.includes(color.id));

          return (
            <button
              key={color.id}
              onClick={() => handleColorToggle(color.id)}
              disabled={isDisabled}
              className={cn(
                "relative bg-gradient-to-br from-card to-card/80 rounded-lg p-2 md:p-3 h-full",
                "border-2 transition-all duration-200",
                selectedColors.includes(color.id) && !noPreference
                  ? "border-primary shadow-sm scale-[1.02]"
                  : "border-border hover:border-primary/50",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedColors.includes(color.id)}
                  disabled={isDisabled}
                  className="h-4 w-4 md:h-5 md:w-5"
                />
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl md:text-2xl">{color.symbol}</span>
                  <span className="text-sm md:text-base font-semibold text-foreground">
                    {color.name}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* No Preference Option */}
      <div className="border-t border-border pt-3 md:pt-4">
        <button
          onClick={handleNoPreference}
          className={cn(
            "w-full bg-gradient-to-br from-card to-card/80 rounded-lg p-3 md:p-4",
            "border-2 transition-all duration-200",
            noPreference
              ? "border-primary shadow-sm"
              : "border-border hover:border-primary/50"
          )}
        >
          <div className="flex items-center space-x-2">
            <Checkbox checked={noPreference} className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm md:text-base font-semibold text-foreground">
              Skip - I'm open to any colors
            </span>
          </div>
        </button>
      </div>

      {/* Submit Button */}
      {canSubmit && (
        <Button
          onClick={handleSubmit}
          variant="hero"
          size="sm"
          className="w-full h-9 md:h-10 text-sm md:text-base"
        >
          {selectedColors.length > 0 ? `Continue (${selectedColors.length} color${selectedColors.length > 1 ? 's' : ''})` : 'See All Decks'}
        </Button>
      )}
    </div>
  );
};
