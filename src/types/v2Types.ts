// V2 Data Types for Discovering Magic

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  // Tags from precons-data.json that map to this theme
  matchingTags: {
    aesthetic_vibe?: string[];
    creature_types?: string[];
    themes?: string[];
    flavor_setting?: string[];
    tone?: string[];
    ip?: string[];
  };
  sortOrder: number;
}

// Card themes are simpler - just for categorizing card sets by pop culture hooks
export interface CardTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface CardSet {
  id: string;
  name: string;
  slug: string;
  franchise: string;
  tier: 2 | 3;
  cardCount: number;
  releaseYear: number;
  availability: 'in_print' | 'limited' | 'secondary_only';
  description: string;
  imageUrl: string;
  cards: {
    name: string;
    originalCardName?: string;
    scryfallId?: string;
  }[];
  themeIds: string[];
  cardThemeIds?: string[]; // Pop culture themed categories for card sets
}

export interface DeckHighlight {
  name: string;
  scryfallId: string;
  cardType: string;
  whyItsCool?: string;
}

export interface PreconDecklist {
  preconId: string;
  highlightCards: DeckHighlight[];
  fullDecklist: {
    commander: string[];
    creatures: string[];
    instantsSorceries: string[];
    artifactsEnchantments: string[];
    lands: string[];
  };
}
