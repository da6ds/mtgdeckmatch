import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getCommanderCard } from "@/utils/deckHelpers";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";

interface ShowcaseCardProps {
  deck: any;
  onClick: () => void;
}

export const ShowcaseCard = ({ deck, onClick }: ShowcaseCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const commanderCard = getCommanderCard(deck);

  // Get image URL
  const getImageUrl = () => {
    if (commanderCard?.image_url && !isPlaceholderUrl(commanderCard.image_url)) {
      return commanderCard.image_url;
    }
    return getScryfallImageUrl(deck.commander);
  };

  const imageUrl = getImageUrl();
  const isUniversesBeyond = deck.ip && deck.ip !== 'magic_original';

  return (
    <div
      className="group relative cursor-pointer rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-card-hover hover:scale-105 h-full"
      onClick={onClick}
    >
      {/* Commander Image */}
      <div className="relative aspect-[5/7] bg-muted/30">
        <img
          src={imageUrl}
          alt={deck.commander}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Universes Beyond Badge */}
        {isUniversesBeyond && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs bg-primary/90 text-primary-foreground">
              UB
            </Badge>
          </div>
        )}

        {/* Hover Overlay with Deck Name */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white">
            <h3 className="font-bold text-sm leading-tight mb-1">
              {deck.commander}
            </h3>
            <p className="text-xs text-white/80 line-clamp-1">
              {deck.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
