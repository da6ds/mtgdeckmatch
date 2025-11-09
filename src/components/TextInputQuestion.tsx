import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TextInputQuestionProps {
  placeholder?: string;
  quickSelects?: string[];
  onSubmit: (value: string) => void;
}

export const TextInputQuestion = ({ placeholder, quickSelects, onSubmit }: TextInputQuestionProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleQuickSelect = (value: string) => {
    if (value === "Skip this question") {
      onSubmit("");
    } else {
      // Extract just the creature type (before the parentheses)
      const cleanValue = value.split(" (")[0].toLowerCase();
      onSubmit(cleanValue);
    }
  };

  const handleSubmit = () => {
    onSubmit(inputValue.trim());
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Text Input */}
      <div className="space-y-3">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="text-lg p-6 border-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim()) {
              handleSubmit();
            }
          }}
        />
        {inputValue.trim() && (
          <Button
            onClick={handleSubmit}
            variant="hero"
            size="lg"
            className="w-full"
          >
            Continue
          </Button>
        )}
      </div>

      {/* Quick Select Buttons */}
      {quickSelects && quickSelects.length > 0 && (
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">Or choose from these:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickSelects.map((option) => (
              <Button
                key={option}
                onClick={() => handleQuickSelect(option)}
                variant={option === "Skip this question" ? "outline" : "secondary"}
                className="h-auto py-4"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
