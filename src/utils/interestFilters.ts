// Filtering utilities for "I Have No Idea Where to Start" flow
import type { Interest } from '@/data/interest-mappings';
import type { CardSet } from '@/types/v2Types';

// Deck type from precons-data.json
export interface Deck {
  id: string;
  name: string;
  commander: string;
  year: number;
  set: string;
  colors: string[];
  ip: 'magic_original' | 'universes_beyond';
  tags: {
    aesthetic_vibe?: {
      primary?: string[];
      secondary?: string[];
    };
    creature_types?: {
      primary?: string[];
      secondary?: string[];
    };
    themes?: {
      primary?: string[];
      secondary?: string[];
    };
    archetype?: {
      primary?: string[];
      secondary?: string[];
    };
    play_pattern?: {
      primary?: string[];
      secondary?: string[];
    };
    flavor_setting?: {
      primary?: string[];
      secondary?: string[];
    };
    tone?: {
      primary?: string[];
      secondary?: string[];
    };
    power_level?: number;
    complexity?: string;
    ip_meta_tags?: string[];
  };
  cards: Array<{
    name: string;
    is_commander?: boolean;
    image_url?: string;
    type_line?: string;
    oracle_text?: string;
  }>;
  color_identity: string;
}

/**
 * Filter card sets by interest
 */
export function getCardSetsForInterest(interest: Interest, allCardSets: CardSet[]): CardSet[] {
  return allCardSets.filter(set => {
    // Check if ID is in the list
    if (interest.cardSetFilters.ids?.includes(set.id)) return true;

    // Check if franchise matches
    if (interest.cardSetFilters.franchises?.includes(set.franchise)) return true;

    return false;
  });
}

/**
 * Filter decks by interest
 */
export function getDecksForInterest(interest: Interest, allDecks: Deck[]): Deck[] {
  return allDecks.filter(deck => {
    const filters = interest.deckFilters;

    // Check IP (if specified)
    if (filters.ip && filters.ip.length > 0) {
      if (!filters.ip.includes(deck.ip)) return false;
    }

    // Check sets (if specified)
    if (filters.sets && filters.sets.length > 0) {
      const matchesSet = filters.sets.some(s =>
        deck.set.toLowerCase().includes(s.toLowerCase())
      );
      if (!matchesSet) return false;
    }

    // Check creature types (any match)
    if (filters.creatureTypes && filters.creatureTypes.length > 0) {
      const deckCreatures = [
        ...(deck.tags.creature_types?.primary || []),
        ...(deck.tags.creature_types?.secondary || [])
      ];
      const hasMatchingCreature = filters.creatureTypes.some(c =>
        deckCreatures.some(dc => dc.toLowerCase().includes(c.toLowerCase()))
      );
      if (!hasMatchingCreature) return false;
    }

    // Check aesthetic vibes (any match)
    if (filters.aestheticVibes && filters.aestheticVibes.length > 0) {
      const deckVibes = [
        ...(deck.tags.aesthetic_vibe?.primary || []),
        ...(deck.tags.aesthetic_vibe?.secondary || [])
      ];
      const hasMatchingVibe = filters.aestheticVibes.some(v =>
        deckVibes.some(dv => dv.toLowerCase().includes(v.toLowerCase()))
      );
      if (!hasMatchingVibe) return false;
    }

    // Check themes (any match)
    if (filters.themes && filters.themes.length > 0) {
      const deckThemes = [
        ...(deck.tags.themes?.primary || []),
        ...(deck.tags.themes?.secondary || [])
      ];
      const hasMatchingTheme = filters.themes.some(t =>
        deckThemes.some(dt => dt.toLowerCase().includes(t.toLowerCase()))
      );
      if (!hasMatchingTheme) return false;
    }

    return true;
  });
}

/**
 * Helper to check if results are empty and provide fallback
 */
export function hasResults(cardSets: CardSet[], decks: Deck[]): boolean {
  return cardSets.length > 0 || decks.length > 0;
}

/**
 * Get a fallback message when no results are found
 */
export function getNoResultsMessage(interestLabel: string): string {
  return `We're still adding more ${interestLabel.toLowerCase()} content! Check out these popular decks instead:`;
}
