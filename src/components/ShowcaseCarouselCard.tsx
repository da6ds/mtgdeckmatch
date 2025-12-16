import { useState } from "react";
import { CardImageModal } from "@/components/CardImageModal";
import type { Deck } from "@/utils/interestFilters";
import type { CardSet } from "@/types/v2Types";

export interface ShowcaseItem {
  id: string;
  imageUrl: string;
  name: string;
  productType: 'precon' | 'collector-set';
  cardType: 'commander' | 'alternate-art';
  data: Deck | CardSet;
}

interface ShowcaseCarouselCardProps {
  item: ShowcaseItem;
  onClick: () => void;
}

export const ShowcaseCarouselCard = ({
  item,
  onClick
}: ShowcaseCarouselCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-44 cursor-pointer group"
      onClick={onClick}
    >
      {/* Card Image - NO OVERLAY, clean art display */}
      <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-border group-hover:border-primary group-hover:shadow-lg transition-all duration-300">
        <div onClick={(e) => e.stopPropagation()}>
          <CardImageModal
            imageUrl={item.imageUrl}
            cardName={item.name}
            deckName={item.productType === 'precon' ? 'Precon Deck' : 'Collector Set'}
            triggerClassName="w-full h-full"
            imageClassName={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="hidden"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
    </div>
  );
};
