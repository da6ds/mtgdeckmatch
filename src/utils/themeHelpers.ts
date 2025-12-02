import type { Theme } from "@/types/v2Types";
import themesData from "@/data/themes.json";

/**
 * Get all available themes
 */
export function getAllThemes(): Theme[] {
  return themesData as Theme[];
}

/**
 * Check if a deck matches a theme based on its tags
 */
export function deckMatchesTheme(deck: any, theme: Theme): boolean {
  const matchingTags = theme.matchingTags;

  // Check each tag category
  for (const [category, themeTagList] of Object.entries(matchingTags)) {
    if (!themeTagList || themeTagList.length === 0) continue;

    // Special handling for IP
    if (category === 'ip') {
      if (themeTagList.includes(deck.ip)) {
        return true;
      }
      continue;
    }

    // Get deck tags for this category
    const deckCategory = deck.tags?.[category];

    if (!deckCategory) continue;

    // Collect all deck tags (primary + secondary)
    const allDeckTags: string[] = [];

    if (typeof deckCategory === 'object') {
      if (Array.isArray(deckCategory.primary)) {
        allDeckTags.push(...deckCategory.primary);
      }
      if (Array.isArray(deckCategory.secondary)) {
        allDeckTags.push(...deckCategory.secondary);
      }
    } else if (Array.isArray(deckCategory)) {
      allDeckTags.push(...deckCategory);
    } else if (typeof deckCategory === 'string') {
      allDeckTags.push(deckCategory);
    }

    // Check if any theme tag matches any deck tag
    const hasMatch = themeTagList.some(themeTag =>
      allDeckTags.some(deckTag =>
        deckTag.toLowerCase().includes(themeTag.toLowerCase()) ||
        themeTag.toLowerCase().includes(deckTag.toLowerCase())
      )
    );

    if (hasMatch) {
      return true;
    }
  }

  return false;
}

/**
 * Filter decks by a specific theme
 */
export function filterDecksByTheme(decks: any[], theme: Theme): any[] {
  return decks.filter(deck => deckMatchesTheme(deck, theme));
}

/**
 * Get all themes that match a specific deck
 */
export function getThemesForDeck(deck: any): Theme[] {
  const themes = getAllThemes();
  return themes.filter(theme => deckMatchesTheme(deck, theme));
}

/**
 * Count how many decks match each theme
 */
export function countDecksPerTheme(decks: any[]): Record<string, number> {
  const themes = getAllThemes();
  const counts: Record<string, number> = {};

  themes.forEach(theme => {
    counts[theme.id] = filterDecksByTheme(decks, theme).length;
  });

  return counts;
}

/**
 * Get a theme by its ID
 */
export function getThemeById(themeId: string): Theme | undefined {
  const themes = getAllThemes();
  return themes.find(theme => theme.id === themeId);
}

/**
 * Get a theme by its slug
 */
export function getThemeBySlug(slug: string): Theme | undefined {
  const themes = getAllThemes();
  return themes.find(theme => theme.slug === slug);
}
