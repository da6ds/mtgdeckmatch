/**
 * Helper functions for the Art Path flow
 * Maps art styles to deck filters and provides special handling for "Wild & Weird"
 */

import type { Deck } from "@/utils/interestFilters";

/**
 * Map art styles to deck filtering criteria
 * Uses existing tags and IPs from precons-data.json
 */
export const artStyleToFilters: Record<string, {
  ip?: string[];
  set?: string[];
  tags?: string[];
  special?: boolean;
}> = {
  "classic-fantasy": {
    // Classic MTG fantasy - dragons, wizards, elves, angels, knights
    tags: ["dragon", "wizard", "elf", "angel", "knight"]
  },
  "cute-cozy": {
    // Bloomburrow decks
    set: ["Bloomburrow"],
    tags: ["cute", "whimsical", "playful", "mouse", "badger", "otter", "squirrel"]
  },
  "scifi-franchises": {
    // Sci-fi crossover IPs
    ip: ["fallout", "doctor_who", "transformers", "warhammer_40k"]
  },
  "horror-dark": {
    // Horror-themed decks and Walking Dead
    ip: ["walking_dead"],
    tags: ["vampire", "zombie", "horror", "dark", "werewolf"]
  },
  "dinosaurs-beasts": {
    // Dinosaurs and beasts - Ixalan and Jurassic World
    ip: ["jurassic_world"],
    tags: ["dinosaur", "beast", "tyranid", "primal"]
  },
  "epic-fantasy": {
    // Fantasy crossover IPs
    ip: ["lord_of_the_rings", "warhammer_40k"]
  }
};

/**
 * Filter decks based on art style selection
 */
export function filterDecksByArtStyle(decks: Deck[], artStyle: string): Deck[] {
  const filters = artStyleToFilters[artStyle];

  if (!filters) {
    return decks;
  }

  // Special handling for wild-weird (no filtering, handled in UI)
  if (filters.special) {
    return [];
  }

  return decks.filter(deck => {
    // Check set match
    if (filters.set && filters.set.length > 0) {
      if (filters.set.some(s => deck.set && deck.set.includes(s))) {
        return true;
      }
    }

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
            if (allValues.some((val: unknown) =>
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
 * Get "chaotic energy" deck recommendations (legacy function, no longer used)
 * Kept for backward compatibility
 */
export function getChaoticEnergyDecks(decks: Deck[]): Deck[] {
  // No longer needed since "Wild & Weird" was replaced with "Dinosaurs & Beasts"
  // Return empty array
  return [];
}

/**
 * Get display name for art style (user-friendly)
 */
export function getArtStyleDisplayName(artStyle: string): string {
  const displayNames: Record<string, string> = {
    "classic-fantasy": "Classic Fantasy",
    "cute-cozy": "Cute & Cozy",
    "scifi-franchises": "Sci-Fi & Franchises",
    "horror-dark": "Horror & Dark",
    "dinosaurs-beasts": "Dinosaurs & Beasts",
    "epic-fantasy": "Epic Fantasy"
  };

  return displayNames[artStyle] || artStyle;
}
