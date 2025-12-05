import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Theme } from "@/types/v2Types";

interface ThemeCardProps {
  theme: Theme;
  deckCount: number;
  onClick: () => void;
  imageUrl?: string;
}

export const ThemeCard = ({ theme, deckCount, onClick, imageUrl }: ThemeCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-lg md:rounded-xl",
        "border-2 border-border hover:border-primary",
        "transition-all duration-300 hover:shadow-card-hover hover:scale-105",
        "w-full aspect-[2/1]"
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
                {theme.name}
              </h3>
              <p className="hidden md:block text-xs text-white/90 leading-tight drop-shadow-md">
                {theme.description}
              </p>
              <p className="text-[10px] md:text-xs font-medium text-white/80 drop-shadow-md pt-1">
                {deckCount} {deckCount === 1 ? 'deck' : 'decks'}
              </p>
            </div>
          </div>
        </>
      ) : (
        /* Icon Mode (Fallback) */
        <Card className="border-0 h-full hover:shadow-none">
          <CardContent className="p-3 flex flex-col items-center text-center space-y-2 h-full justify-center">
            {/* Icon */}
            <div className="text-2xl mb-0.5 group-hover:scale-110 transition-transform duration-300">
              {theme.icon}
            </div>

            {/* Theme Name */}
            <h3 className="text-sm font-semibold text-foreground">
              {theme.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2">
              {theme.description}
            </p>

            {/* Deck Count Badge */}
            <div className="pt-1 border-t border-border/50 w-full">
              <p className="text-xs font-medium text-primary">
                {deckCount} {deckCount === 1 ? 'deck' : 'decks'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </button>
  );
};
