/**
 * Shared utility functions for deck card rendering
 */

import { COLOR_SYMBOLS, PRICE_RANGES } from "@/constants/deckConstants";
import type { Deck } from "@/utils/interestFilters";

/**
 * Get the commander card from a precon deck
 */
export const getCommanderCard = (precon: Deck) => {
  const commander = precon.cards?.find((card) => card.is_commander);

  if (!commander) {
    console.warn(`No commander card found in deck: ${precon.name}`);
  }

  return commander;
};

/**
 * Get the colored circle emoji for a Magic color code
 */
export const getColorSymbol = (colorCode: string) => {
  return COLOR_SYMBOLS[colorCode] || colorCode;
};

/**
 * Calculate deck price range based on year
 */
export const calculateDeckPrice = (year?: number) => {
  return year && year >= PRICE_RANGES.THRESHOLD_YEAR
    ? PRICE_RANGES.NEW
    : PRICE_RANGES.OLDER;
};

/**
 * Returns appropriate Tailwind font size class based on commander name length
 * Ensures long names fit without truncation
 */
export const getCommanderNameSizeClass = (name: string): string => {
  const length = name?.length || 0;
  if (length > 35) return 'text-sm font-bold';      // Very long
  if (length > 28) return 'text-base font-bold';    // Long
  return 'text-lg font-bold';                        // Normal
};

/**
 * Returns appropriate Tailwind font size class based on deck title length
 */
export const getDeckTitleSizeClass = (title: string): string => {
  const length = title?.length || 0;
  if (length > 40) return 'text-xs font-medium';    // Very long
  if (length > 30) return 'text-sm font-medium';    // Long
  return 'text-base font-medium';                    // Normal
};

/**
 * Returns appropriate Tailwind font size class based on set name length
 */
export const getSetNameSizeClass = (setName: string): string => {
  const length = setName?.length || 0;
  if (length > 35) return 'text-xs';                // Very long
  return 'text-sm';                                  // Normal
};
