import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export const ProgressIndicator = ({ currentStep, totalSteps, onStepClick }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <button
          key={index}
          onClick={() => onStepClick(index)}
          disabled={index > currentStep}
          className={cn(
            "h-2.5 w-2.5 rounded-full transition-all duration-300",
            index === currentStep && "bg-primary scale-125",
            index < currentStep && "bg-primary/60 hover:bg-primary/80 cursor-pointer",
            index > currentStep && "bg-muted cursor-not-allowed"
          )}
          aria-label={`Step ${index + 1}`}
        />
      ))}
    </div>
  );
};
