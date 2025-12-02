import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CardSet } from "@/types/v2Types";

interface CardSetCardProps {
  cardSet: CardSet;
  deckCount?: number;
  onClick?: () => void;
}

const availabilityConfig = {
  in_print: {
    label: "In Print",
    color: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  limited: {
    label: "Limited",
    color: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  },
  secondary_only: {
    label: "Secondary Market",
    color: "bg-red-500/20 text-red-700 dark:text-red-300",
  },
};

export const CardSetCard = ({ cardSet, deckCount, onClick }: CardSetCardProps) => {
  const availabilityStyle = availabilityConfig[cardSet.availability];

  return (
    <Card
      className={`group transition-all duration-300 border-2 ${
        onClick ? "cursor-pointer hover:shadow-card-hover hover:border-primary/50" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {cardSet.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {cardSet.franchise}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            Tier {cardSet.tier}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground leading-relaxed">
          {cardSet.description}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Released</p>
            <p className="text-sm font-medium">{cardSet.releaseYear}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Availability</p>
            <Badge className={`text-xs ${availabilityStyle.color}`}>
              {availabilityStyle.label}
            </Badge>
          </div>
        </div>

        {/* Deck Count */}
        {deckCount !== undefined && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-sm font-semibold text-primary">
              {deckCount} precon {deckCount === 1 ? "deck" : "decks"} available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
