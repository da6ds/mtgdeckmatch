import { Card, CardContent } from "@/components/ui/card";
import type { Theme } from "@/types/v2Types";

interface ThemeCardProps {
  theme: Theme;
  deckCount: number;
  onClick: () => void;
}

export const ThemeCard = ({ theme, deckCount, onClick }: ThemeCardProps) => {
  return (
    <Card
      className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary/50"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        {/* Icon */}
        <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
          {theme.icon}
        </div>

        {/* Theme Name */}
        <h3 className="text-xl font-bold text-foreground">
          {theme.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
          {theme.description}
        </p>

        {/* Deck Count Badge */}
        <div className="pt-2 border-t border-border/50 w-full">
          <p className="text-sm font-semibold text-primary">
            {deckCount} {deckCount === 1 ? 'deck' : 'decks'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
