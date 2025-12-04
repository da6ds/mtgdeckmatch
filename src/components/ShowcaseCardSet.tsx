import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CardImageModal } from "@/components/CardImageModal";
import type { CardSet } from "@/types/v2Types";

interface ShowcaseCardSetProps {
  cardSet: CardSet;
  onClick: () => void;
}

export const ShowcaseCardSet = ({ cardSet, onClick }: ShowcaseCardSetProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use the imageUrl from the card set data (already populated with Scryfall URLs)
  const imageUrl = cardSet.imageUrl;

  // Determine badge based on tier
  const badge = cardSet.tier === 2 ? "SL" : "UB";
  const badgeLabel = cardSet.tier === 2 ? "Secret Lair" : "Universes Beyond";

  return (
    <div
      className="group relative cursor-pointer rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-card-hover hover:scale-105 h-full"
      onClick={onClick}
    >
      {/* Card Image */}
      <div className="relative aspect-[4/5] bg-muted/30">
        {imageUrl && (
          <>
            <div onClick={(e) => e.stopPropagation()}>
              <CardImageModal
                imageUrl={imageUrl}
                cardName={cardSet.name}
                deckName={cardSet.franchise}
                triggerClassName="w-full h-full"
                imageClassName={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            <img
              src={imageUrl}
              alt={cardSet.name}
              className="hidden"
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </>
        )}

        {/* Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="text-xs bg-primary/90 text-primary-foreground"
            title={badgeLabel}
          >
            {badge}
          </Badge>
        </div>

        {/* Hover Overlay with Set Name */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="text-white">
            <h3 className="font-bold text-xs leading-tight mb-1">
              {cardSet.name}
            </h3>
            <p className="text-[10px] text-white/80 line-clamp-1">
              {cardSet.franchise}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
