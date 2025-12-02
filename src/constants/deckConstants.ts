/**
 * Shared constants for deck card rendering
 */

/**
 * Magic: The Gathering color symbols
 */
export const COLOR_SYMBOLS: Record<string, string> = {
  W: "⚪", // White
  U: "🔵", // Blue
  B: "⚫", // Black
  R: "🔴", // Red
  G: "🟢", // Green
};

/**
 * Deck price ranges based on release year
 */
export const PRICE_RANGES = {
  NEW: "50-70",      // 2024+ decks
  OLDER: "40-60",    // Pre-2024 decks
  THRESHOLD_YEAR: 2024,
};
