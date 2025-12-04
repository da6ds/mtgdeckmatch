/**
 * Fetch MTG Card Art from Scryfall API
 *
 * This script fetches art_crop URLs for cards that represent each vibe, theme, and article.
 * Run with: node scripts/fetch-card-art.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Card art mapping - iconic cards for each category
const cardArtMapping = {
  // VIBE CARDS (Quiz Step 1 - 6 vibes)
  vibes: {
    'dark-mysterious': 'Sheoldred, the Apocalypse',
    'epic-powerful': 'Aurelia, the Warleader',
    'playful-whimsical': 'Chatterfang, Squirrel General',
    'fantasy-adventure': 'Elspeth, Sun\'s Champion',
    'sci-fi-tech': 'Urza, Lord High Artificer',
    'nature-primal': 'Vorinclex, Monstrous Raider'
  },

  // THEME CARDS (Discover page - 15 themes)
  themes: {
    'spooky-dark': 'Sheoldred, the Apocalypse',
    'space-scifi': 'Breach the Multiverse',
    'tribal': 'Krenko, Mob Boss',
    'artifacts': 'Urza, Lord High Artificer',
    'tokens': 'Chatterfang, Squirrel General',
    'spellslinger': 'Niv-Mizzet, Parun',
    'graveyard': 'Meren of Clan Nel Toth',
    'combo': 'Thassa\'s Oracle',
    'lands-ramp': 'Omnath, Locus of Creation',
    'big-creatures': 'Ghalta, Primal Hunger',
    'aristocrats': 'Teysa Karlov',
    'voltron': 'Rafiq of the Many',
    'enchantments': 'Estrid, the Masked',
    'group-hug': 'Kynaios and Tiro of Meletis',
    'politics': 'Queen Marchesa'
  },

  // LEARN ARTICLES (8 articles)
  articles: {
    'what-is-magic': 'Black Lotus',
    'what-is-commander': 'Sol Ring',
    'what-you-need': 'Command Tower',
    'what-is-precon': 'Prosper, Tome-Bound', // Popular precon commander
    'whats-inside-deck': 'Arcane Signet', // Staple card
    'can-i-change-deck': 'Rings of Brighthearth', // Deck building
    'crossover-cards': 'Optimus Prime, Hero', // Universes Beyond
    'glossary': 'Omniscience' // Knowledge card
  }
};

async function fetchCardArt(cardName) {
  const url = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`HTTP error for ${cardName}: ${response.status}`);
      return null;
    }

    const card = await response.json();

    // Return art_crop URL (just the art, no border)
    if (card.image_uris?.art_crop) {
      return card.image_uris.art_crop;
    } else if (card.card_faces?.[0]?.image_uris?.art_crop) {
      // Handle double-faced cards
      return card.card_faces[0].image_uris.art_crop;
    }

    console.warn(`No art_crop found for ${cardName}`);
    return null;
  } catch (error) {
    console.error(`Failed to fetch ${cardName}:`, error.message);
    return null;
  }
}

async function fetchAllCardArt() {
  console.log('🎴 Fetching MTG card art from Scryfall API...\n');

  const results = {};
  let successCount = 0;
  let failCount = 0;

  for (const [category, cards] of Object.entries(cardArtMapping)) {
    console.log(`📦 Fetching ${category}...`);
    results[category] = {};

    for (const [id, cardName] of Object.entries(cards)) {
      process.stdout.write(`  → ${cardName}... `);

      const artUrl = await fetchCardArt(cardName);

      if (artUrl) {
        results[category][id] = artUrl;
        console.log('✓');
        successCount++;
      } else {
        console.log('✗');
        failCount++;
      }

      // Rate limiting - Scryfall allows 10 req/sec
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    console.log('');
  }

  // Save to JSON file
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'card-art-urls.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(results, null, 2)
  );

  console.log(`✅ Success: ${successCount} cards`);
  console.log(`❌ Failed: ${failCount} cards`);
  console.log(`\n📁 Card art URLs saved to: ${outputPath}`);
}

// Run the script
fetchAllCardArt().catch(console.error);
