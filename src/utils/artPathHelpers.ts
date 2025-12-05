/**
 * Helper functions for the Art Path flow
 * Maps art styles to deck filters and provides special handling for "Wild & Weird"
 */

/**
 * Map art styles to deck filtering criteria
 * Uses existing tags and IPs from precons-data.json
 */
export const artStyleToFilters: Record<string, {
  ip?: string[];
  tags?: string[];
  special?: boolean;
}> = {
  "anime-stylized": {
    // Decks with stylized/anime aesthetics or alt-art potential
    tags: ["stylized", "anime", "magical", "elegant"]
  },
  "cute-cozy": {
    // Bloomburrow decks
    ip: ["bloomburrow"]
  },
  "scifi-franchises": {
    // Sci-fi crossover IPs
    ip: ["fallout", "doctor_who", "transformers", "warhammer_40k"]
  },
  "horror-dark": {
    // Horror-themed decks and Walking Dead
    ip: ["walking_dead", "innistrad"],
    tags: ["vampire", "zombie", "horror", "dark"]
  },
  "wild-weird": {
    // Special handling - educational content about Secret Lair
    special: true
  },
  "epic-fantasy": {
    // Fantasy crossover IPs
    ip: ["lord_of_the_rings", "warhammer_40k"]
  }
};

/**
 * Filter decks based on art style selection
 */
export function filterDecksByArtStyle(decks: any[], artStyle: string): any[] {
  const filters = artStyleToFilters[artStyle];

  if (!filters) {
    return decks;
  }

  // Special handling for wild-weird (no filtering, handled in UI)
  if (filters.special) {
    return [];
  }

  return decks.filter(deck => {
    // Check IP match
    if (filters.ip && filters.ip.length > 0) {
      if (filters.ip.includes(deck.ip)) {
        return true;
      }
    }

    // Check tags match (if deck has tags)
    if (filters.tags && filters.tags.length > 0 && deck.tags) {
      // Check if any filter tag matches any deck tag category
      for (const filterTag of filters.tags) {
        // Check all tag categories in the deck
        for (const tagCategory in deck.tags) {
          const categoryValues = deck.tags[tagCategory];

          if (Array.isArray(categoryValues)) {
            if (categoryValues.some((val: string) => val.toLowerCase().includes(filterTag.toLowerCase()))) {
              return true;
            }
          } else if (typeof categoryValues === 'object' && categoryValues !== null) {
            // Handle nested objects (like creature_types)
            const allValues = Object.values(categoryValues).flat();
            if (allValues.some((val: any) =>
              typeof val === 'string' && val.toLowerCase().includes(filterTag.toLowerCase())
            )) {
              return true;
            }
          }
        }
      }
    }

    return false;
  });
}

/**
 * Get "chaotic energy" deck recommendations for Wild & Weird selection
 * Returns decks that are unconventional, quirky, or have random/chaotic effects
 */
export function getChaoticEnergyDecks(decks: any[]): any[] {
  // Filter for decks that have chaotic, random, or unconventional themes
  return decks.filter(deck => {
    const chaoticKeywords = [
      "chaos",
      "random",
      "coin",
      "dice",
      "luck",
      "unpredictable",
      "silly",
      "party"
    ];

    // Check IP (Doctor Who has time travel weirdness)
    if (deck.ip === "doctor_who") {
      return true;
    }

    // Check tags for chaotic keywords
    if (deck.tags) {
      const tagString = JSON.stringify(deck.tags).toLowerCase();
      if (chaoticKeywords.some(keyword => tagString.includes(keyword))) {
        return true;
      }
    }

    return false;
  }).slice(0, 6); // Return up to 6 chaotic decks
}

/**
 * Get display name for art style (user-friendly)
 */
export function getArtStyleDisplayName(artStyle: string): string {
  const displayNames: Record<string, string> = {
    "anime-stylized": "Anime & Stylized Art",
    "cute-cozy": "Cute & Cozy",
    "scifi-franchises": "Sci-Fi & Franchises",
    "horror-dark": "Horror & Dark",
    "wild-weird": "Wild & Weird",
    "epic-fantasy": "Epic Fantasy"
  };

  return displayNames[artStyle] || artStyle;
}
