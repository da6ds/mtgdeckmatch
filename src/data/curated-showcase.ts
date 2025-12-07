/**
 * Curated showcase cards for homepage carousel
 *
 * Selection criteria - "hook" cards that make people say "Wait, Magic has THAT?!":
 * - Weird/unexpected (Furby, SpongeBob)
 * - Beloved franchises (Fallout, Doctor Who, LOTR, Transformers)
 * - Anime art styles
 * - Cute critters (Bloomburrow)
 * - Gaming crossovers (Street Fighter, Final Fantasy)
 * - Giant monsters (Godzilla)
 */

import type { ShowcaseItem } from "@/components/ShowcaseCarouselCard";
import preconsData from "@/data/precons-data.json";
import cardSetsData from "@/data/card-sets.json";
import type { CardSet } from "@/types/v2Types";
import { getCommanderCard } from "@/utils/deckHelpers";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";

// IDs of curated precon decks
const curatedDeckIds = [
  "squirreled-away",          // Bloomburrow - Cute squirrels (Hazel)
  "animated-army",            // Bloomburrow - Cute critters (Bello)
  "family-matters",           // Bloomburrow - More cute animals (Zinnia)
  "hail-caesar",              // Fallout - Post-apocalyptic wasteland
  "blame-game",               // Doctor Who - Time travel sci-fi
  "riders-of-rohan",          // LOTR - Epic fantasy
  "tyranid-swarm",            // Warhammer 40K - Alien monsters
  "hosts-of-mordor",          // LOTR - Dark fantasy
];

// IDs of curated card sets (Secret Lairs & Universes Beyond)
const curatedCardSetIds = [
  "secret-lair-furby",           // Weird - Furby Phyrexian Arena
  "sl-spongebob",                // Unexpected - SpongeBob
  "street-fighter",              // Gaming - Street Fighter
  "walking-dead",                // Horror - Walking Dead
  "stranger-things",             // Sci-fi - Stranger Things
  "sl-transformers-optimus-megatron", // Nostalgia - Transformers
  "godzilla-ikoria",             // Giant monsters - Godzilla
  "sl-arcane",                   // Anime - Arcane/League of Legends
  "final-fantasy",               // Gaming - Final Fantasy
  "sl-tomb-raider",              // Gaming - Lara Croft
];

/**
 * Get curated showcase items for homepage carousel
 * Returns a mix of precon decks and card sets that showcase the breadth of Magic
 */
export function getCuratedShowcaseItems(): ShowcaseItem[] {
  const items: ShowcaseItem[] = [];

  // Add curated decks
  curatedDeckIds.forEach(deckId => {
    const deck = preconsData.find((d: any) => d.id === deckId);
    if (deck) {
      const commanderCard = getCommanderCard(deck);
      const imageUrl =
        commanderCard?.image_url && !isPlaceholderUrl(commanderCard.image_url)
          ? commanderCard.image_url
          : getScryfallImageUrl(deck.commander);

      items.push({
        id: deck.id,
        imageUrl,
        name: deck.name,
        productType: 'precon' as const,
        cardType: 'commander' as const,
        data: deck,
      });
    }
  });

  // Add curated card sets
  curatedCardSetIds.forEach(setId => {
    const cardSet = (cardSetsData as CardSet[]).find(s => s.id === setId);
    if (cardSet) {
      items.push({
        id: cardSet.id,
        imageUrl: cardSet.imageUrl,
        name: cardSet.name,
        productType: 'collector-set' as const,
        cardType: 'alternate-art' as const,
        data: cardSet,
      });
    }
  });

  return items;
}
