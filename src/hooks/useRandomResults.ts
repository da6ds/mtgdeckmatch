// src/hooks/useRandomResults.ts
import { useState, useCallback, useEffect } from 'react';
import preconsData from '@/data/precons-data.json';
import cardSetsData from '@/data/card-sets.json';

interface RandomDeck {
  id: string;
  name: string;
  commander: string;
  imageUrl: string;
}

interface RandomCardSet {
  id: string;
  name: string;
  franchise: string;
  imageUrl: string;
}

interface RandomResults {
  randomDeck: RandomDeck | null;
  randomCardSet: RandomCardSet | null;
  shuffle: () => void;
}

export function useRandomResults(seed: number = 0): RandomResults {
  const [randomDeck, setRandomDeck] = useState<RandomDeck | null>(null);
  const [randomCardSet, setRandomCardSet] = useState<RandomCardSet | null>(null);

  const shuffle = useCallback(() => {
    // Pick random deck
    const deckIndex = Math.floor(Math.random() * (preconsData as any[]).length);
    const deck = (preconsData as any[])[deckIndex];
    if (deck) {
      setRandomDeck({
        id: deck.id,
        name: deck.name,
        commander: deck.commander,
        imageUrl: deck.cards?.[0]?.image_url || '/placeholder-deck.jpg',
      });
    }

    // Pick random card set
    const setIndex = Math.floor(Math.random() * (cardSetsData as any[]).length);
    const cardSet = (cardSetsData as any[])[setIndex];
    if (cardSet) {
      setRandomCardSet({
        id: cardSet.id,
        name: cardSet.name,
        franchise: cardSet.franchise,
        imageUrl: cardSet.imageUrl || '/placeholder-set.jpg',
      });
    }
  }, []);

  // Initial shuffle on mount
  useEffect(() => {
    shuffle();
  }, [shuffle]);

  return { randomDeck, randomCardSet, shuffle };
}
