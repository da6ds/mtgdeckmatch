import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  imageUrl?: string;
  onClick: () => void;
  className?: string;
}

export const OptionCard = ({ title, description, icon: Icon, imageUrl, onClick, className }: OptionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-lg md:rounded-xl",
        "border-2 border-border hover:border-primary",
        "transition-all duration-300 hover:shadow-card-hover hover:scale-105",
        "w-full aspect-[2/1]",
        className
      )}
    >
      {/* Background Image Mode */}
      {imageUrl ? (
        <>
          {/* MTG Card Art Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Dark Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-end p-3 md:p-4">
            <div className="text-center space-y-0.5 md:space-y-1">
              <h3 className="text-sm md:text-lg font-bold text-white drop-shadow-lg">
                {title}
              </h3>
              <p className="text-[10px] md:text-sm text-white/90 leading-tight drop-shadow-md">
                {description}
              </p>
            </div>
          </div>
        </>
      ) : (
        /* Icon Mode (Fallback) */
        <div className="bg-gradient-to-br from-card to-card/80 h-full flex flex-col items-center justify-center p-2 md:p-4">
          <div className="space-y-1 md:space-y-3">
            {Icon && (
              <div className="inline-flex items-center justify-center w-7 h-7 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 mx-auto">
                <Icon className="w-4 h-4 md:w-7 md:h-7 text-primary" />
              </div>
            )}

            <div className="space-y-0 md:space-y-1 text-center">
              <h3 className="text-sm md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-[10px] md:text-sm text-muted-foreground leading-tight md:leading-normal">
                {description}
              </p>
            </div>
          </div>
        </div>
      )}
    </button>
  );
};
