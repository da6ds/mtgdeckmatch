import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import type { CardSet } from "@/types/v2Types";

interface ShowcaseCardSetProps {
  cardSet: CardSet;
  onClick: () => void;
}

/**
 * Get a representative card image for a card set from Scryfall
 */
const getCardSetImage = async (cardSet: CardSet): Promise<string> => {
  // If we have cards with names, fetch the first one
  if (cardSet.cards && cardSet.cards.length > 0 && cardSet.cards[0].name) {
    const cardName = cardSet.cards[0].name;
    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.image_uris?.normal || data.image_uris?.large || "";
      }
    } catch (error) {
      console.error(`Failed to fetch card image for ${cardName}:`, error);
    }
  }

  // Fallback: search for any card from the franchise
  try {
    const searchQuery = `${cardSet.franchise} game:paper`;
    const response = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchQuery)}&unique=prints&order=released&dir=desc`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return data.data[0].image_uris?.normal || data.data[0].image_uris?.large || "";
      }
    }
  } catch (error) {
    console.error(`Failed to fetch franchise card for ${cardSet.franchise}:`, error);
  }

  // Final fallback: MTG card back
  return "https://cards.scryfall.io/large/back/0/0/0aeebaf5-8c7d-4636-9e82-8c27447861f7.jpg";
};

export const ShowcaseCardSet = ({ cardSet, onClick }: ShowcaseCardSetProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    getCardSetImage(cardSet).then(setImageUrl);
  }, [cardSet]);

  // Determine badge based on tier
  const badge = cardSet.tier === 2 ? "SL" : "UB";
  const badgeLabel = cardSet.tier === 2 ? "Secret Lair" : "Universes Beyond";

  return (
    <div
      className="group relative cursor-pointer rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-card-hover hover:scale-105 h-full"
      onClick={onClick}
    >
      {/* Card Image */}
      <div className="relative aspect-[5/7] bg-muted/30">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={cardSet.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
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
