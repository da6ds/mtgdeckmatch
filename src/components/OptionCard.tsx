import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

export const OptionCard = ({ title, description, icon: Icon, onClick, className }: OptionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative bg-gradient-to-br from-card to-card/80 rounded-lg md:rounded-xl p-2 md:p-4",
        "border-2 border-border hover:border-primary",
        "transition-all duration-300 hover:shadow-card-hover hover:scale-105",
        "text-center w-full aspect-[3/2] flex flex-col items-center justify-center",
        className
      )}
    >
      <div className="space-y-1 md:space-y-3">
        {/* Icon - centered */}
        <div className="inline-flex items-center justify-center w-7 h-7 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 mx-auto">
          <Icon className="w-4 h-4 md:w-7 md:h-7 text-primary" />
        </div>

        {/* Text - centered */}
        <div className="space-y-0 md:space-y-1 text-center">
          <h3 className="text-sm md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-[10px] md:text-sm text-muted-foreground leading-tight md:leading-normal">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};
