import { useRef, useState, useEffect } from "react";
import { ShowcaseCarouselCard, type ShowcaseItem } from "@/components/ShowcaseCarouselCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShowcaseCarouselProps {
  items: ShowcaseItem[];
  onItemClick: (item: ShowcaseItem) => void;
}

export const ShowcaseCarousel = ({ items, onItemClick }: ShowcaseCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Card dimensions - w-44 = 176px, gap-4 = 16px
  const CARDS_PER_VIEW = 6;
  const CARD_WIDTH = 176; // w-44
  const GAP = 16; // gap-4
  const SCROLL_AMOUNT = CARDS_PER_VIEW * (CARD_WIDTH + GAP);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const newPosition = direction === 'left'
        ? scrollRef.current.scrollLeft - SCROLL_AMOUNT
        : scrollRef.current.scrollLeft + SCROLL_AMOUNT;

      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Left Arrow - OUTSIDE cards */}
      <Button
        variant="outline"
        size="icon"
        className={`flex-shrink-0 ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : ''}`}
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* Scrollable Container - Fixed width for exactly 6 cards */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-scroll scroll-smooth scrollbar-hide py-2"
        style={{
          maxWidth: `${CARDS_PER_VIEW * (CARD_WIDTH + GAP) - GAP}px`,
        }}
      >
        {items.map((item) => (
          <ShowcaseCarouselCard
            key={item.id}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>

      {/* Right Arrow - OUTSIDE cards */}
      <Button
        variant="outline"
        size="icon"
        className={`flex-shrink-0 ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : ''}`}
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};
