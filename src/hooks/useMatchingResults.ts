// src/hooks/useMatchingResults.ts
import { useMemo } from 'react';
import preconsData from '@/data/precons-data.json';
import cardSetsData from '@/data/card-sets.json';

interface MatchedDeck {
  id: string;
  name: string;
  commander: string;
  imageUrl: string;
  tags: string[];
}

interface MatchedCardSet {
  id: string;
  name: string;
  franchise: string;
  imageUrl: string;
  tags: string[];
}

interface MatchingResults {
  decks: MatchedDeck[];
  cardSets: MatchedCardSet[];
  isLoading: boolean;
}

export function useMatchingResults(matchingTags: string[], matchingFranchises: string[]): MatchingResults {
  const results = useMemo(() => {
    const tagsLower = matchingTags.map(t => t.toLowerCase());
    const franchisesLower = matchingFranchises.map(f => f.toLowerCase());

    // Filter decks by matching tags
    const matchedDecks: MatchedDeck[] = (preconsData as any[])
      .filter(deck => {
        // Collect all searchable tags from the deck
        const deckTags: string[] = [];

        // Add tags from nested structure
        if (deck.tags) {
          if (deck.tags.themes?.primary) deckTags.push(...deck.tags.themes.primary);
          if (deck.tags.themes?.secondary) deckTags.push(...deck.tags.themes.secondary);
          if (deck.tags.creature_types?.primary) deckTags.push(...deck.tags.creature_types.primary);
          if (deck.tags.creature_types?.secondary) deckTags.push(...deck.tags.creature_types.secondary);
          if (deck.tags.aesthetic_vibe?.primary) deckTags.push(...deck.tags.aesthetic_vibe.primary);
          if (deck.tags.aesthetic_vibe?.secondary) deckTags.push(...deck.tags.aesthetic_vibe.secondary);
          if (deck.tags.flavor_setting?.primary) deckTags.push(...deck.tags.flavor_setting.primary);
          if (deck.tags.flavor_setting?.secondary) deckTags.push(...deck.tags.flavor_setting.secondary);
          if (deck.tags.archetype?.primary) deckTags.push(...deck.tags.archetype.primary);
          if (deck.tags.ip_meta_tags) deckTags.push(...deck.tags.ip_meta_tags);
        }

        // Add IP and set info
        if (deck.ip) deckTags.push(deck.ip);
        if (deck.set) deckTags.push(deck.set);

        const deckTagsLower = deckTags.map(t => t?.toLowerCase()).filter(Boolean);

        // Check if any matching tag is found in deck tags
        return tagsLower.some(tag =>
          deckTagsLower.some(deckTag => deckTag.includes(tag) || tag.includes(deckTag))
        );
      })
      .slice(0, 12) // Limit results
      .map(deck => ({
        id: deck.id,
        name: deck.name,
        commander: deck.commander,
        imageUrl: deck.cards?.[0]?.image_url || '/placeholder-deck.jpg',
        tags: deck.tags?.themes?.primary || [],
      }));

    // Filter card sets by matching franchises
    const matchedCardSets: MatchedCardSet[] = (cardSetsData as any[])
      .filter(set => {
        const setFranchise = set.franchise?.toLowerCase() || '';
        const setName = set.name?.toLowerCase() || '';
        const setId = set.id?.toLowerCase() || '';

        return franchisesLower.some(franchise =>
          setFranchise.includes(franchise) ||
          setName.includes(franchise) ||
          setId.includes(franchise)
        );
      })
      .slice(0, 8) // Limit results
      .map(set => ({
        id: set.id,
        name: set.name,
        franchise: set.franchise,
        imageUrl: set.imageUrl || '/placeholder-set.jpg',
        tags: set.themeIds || [],
      }));

    return {
      decks: matchedDecks,
      cardSets: matchedCardSets,
      isLoading: false,
    };
  }, [matchingTags, matchingFranchises]);

  return results;
}
