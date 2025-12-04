import { useState, useMemo } from "react";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { ShowcaseCardSet } from "@/components/ShowcaseCardSet";
import { DeckDetailModal } from "@/components/DeckDetailModal";
import { CardSetDetailModal } from "@/components/CardSetDetailModal";
import preconsData from "@/data/precons-data.json";
import cardSetsData from "@/data/card-sets.json";
import type { CardSet } from "@/types/v2Types";

interface ShowcaseWallProps {
  deckCount?: number;
  cardSetCount?: number;
}

type ShowcaseItem =
  | { type: 'deck'; data: any }
  | { type: 'cardset'; data: CardSet };

/**
 * Shuffle array helper using Fisher-Yates algorithm
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get a diverse selection of decks and card sets for the showcase wall
 * Shuffles items and combines them for visual variety
 */
const getShowcaseItems = (
  allDecks: any[],
  allCardSets: CardSet[],
  deckCount: number = 4,
  cardSetCount: number = 2
): ShowcaseItem[] => {
  // Get random decks and card sets
  const randomDecks = shuffleArray(allDecks).slice(0, deckCount);
  const randomCardSets = shuffleArray(allCardSets).slice(0, cardSetCount);

  // Combine into discriminated union
  const combined: ShowcaseItem[] = [
    ...randomDecks.map(d => ({ type: 'deck' as const, data: d })),
    ...randomCardSets.map(c => ({ type: 'cardset' as const, data: c }))
  ];

  // Final shuffle for visual variety
  return shuffleArray(combined);
};

export const ShowcaseWall = ({ deckCount = 4, cardSetCount = 2 }: ShowcaseWallProps) => {
  const [selectedDeck, setSelectedDeck] = useState<any | null>(null);
  const [selectedCardSet, setSelectedCardSet] = useState<CardSet | null>(null);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showCardSetModal, setShowCardSetModal] = useState(false);

  // Memoize the shuffled items so they don't change on re-render
  // The empty dependency array means this will only run once on mount
  const showcaseItems = useMemo(
    () => getShowcaseItems(preconsData, cardSetsData as CardSet[], deckCount, cardSetCount),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Intentionally empty - we want randomization only on mount
  );

  const handleDeckClick = (deck: any) => {
    setSelectedDeck(deck);
    setShowDeckModal(true);
  };

  const handleCardSetClick = (cardSet: CardSet) => {
    setSelectedCardSet(cardSet);
    setShowCardSetModal(true);
  };

  return (
    <>
      {/* Showcase Grid - Compact with Size Differentiation */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {showcaseItems.map((item, index) => {
          if (item.type === 'deck') {
            return (
              <div key={`deck-${item.data.id}`} className="col-span-2">
                <ShowcaseCard
                  deck={item.data}
                  onClick={() => handleDeckClick(item.data)}
                />
              </div>
            );
          } else {
            return (
              <div key={`cardset-${item.data.id}`}>
                <ShowcaseCardSet
                  cardSet={item.data}
                  onClick={() => handleCardSetClick(item.data)}
                />
              </div>
            );
          }
        })}
      </div>

      {/* Deck Detail Modal */}
      <DeckDetailModal
        deck={selectedDeck}
        open={showDeckModal}
        onClose={() => setShowDeckModal(false)}
      />

      {/* Card Set Detail Modal */}
      <CardSetDetailModal
        cardSet={selectedCardSet}
        open={showCardSetModal}
        onClose={() => setShowCardSetModal(false)}
      />
    </>
  );
};
