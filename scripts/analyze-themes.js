/**
 * Analyze precons-data.json to extract unique tags and suggest theme groupings
 * Run with: node scripts/analyze-themes.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load precons data
const preconsPath = join(__dirname, '../src/data/precons-data.json');
const precons = JSON.parse(readFileSync(preconsPath, 'utf8'));

console.log(`\n📊 Analyzing ${precons.length} precon decks...\n`);

// Collect all unique tags
const tagCollections = {
  aesthetic_vibe: new Set(),
  creature_types: new Set(),
  themes: new Set(),
  archetype: new Set(),
  play_pattern: new Set(),
  flavor_setting: new Set(),
  tone: new Set(),
  ip: new Set(),
  complexity: new Set(),
};

// Track power levels
const powerLevels = {};

precons.forEach(deck => {
  const tags = deck.tags || {};

  // Collect aesthetic vibes
  if (tags.aesthetic_vibe) {
    [...(tags.aesthetic_vibe.primary || []), ...(tags.aesthetic_vibe.secondary || [])].forEach(tag =>
      tagCollections.aesthetic_vibe.add(tag)
    );
  }

  // Collect creature types
  if (tags.creature_types) {
    [...(tags.creature_types.primary || []), ...(tags.creature_types.secondary || [])].forEach(tag =>
      tagCollections.creature_types.add(tag)
    );
  }

  // Collect themes
  if (tags.themes) {
    [...(tags.themes.primary || []), ...(tags.themes.secondary || [])].forEach(tag =>
      tagCollections.themes.add(tag)
    );
  }

  // Collect archetypes
  if (tags.archetype) {
    [...(tags.archetype.primary || []), ...(tags.archetype.secondary || [])].forEach(tag =>
      tagCollections.archetype.add(tag)
    );
  }

  // Collect play patterns
  if (tags.play_pattern) {
    [...(tags.play_pattern.primary || []), ...(tags.play_pattern.secondary || [])].forEach(tag =>
      tagCollections.play_pattern.add(tag)
    );
  }

  // Collect flavor settings
  if (tags.flavor_setting) {
    [...(tags.flavor_setting.primary || []), ...(tags.flavor_setting.secondary || [])].forEach(tag =>
      tagCollections.flavor_setting.add(tag)
    );
  }

  // Collect tones
  if (tags.tone) {
    [...(tags.tone.primary || []), ...(tags.tone.secondary || [])].forEach(tag =>
      tagCollections.tone.add(tag)
    );
  }

  // Collect IPs
  if (deck.ip) {
    tagCollections.ip.add(deck.ip);
  }

  // Collect complexity
  if (tags.complexity) {
    tagCollections.complexity.add(tags.complexity);
  }

  // Track power levels
  const powerLevel = tags.power_level || 'unknown';
  powerLevels[powerLevel] = (powerLevels[powerLevel] || 0) + 1;
});

// Print results
console.log('🎨 AESTHETIC VIBES:');
console.log(Array.from(tagCollections.aesthetic_vibe).sort().join(', '));
console.log(`\n🦖 CREATURE TYPES (${tagCollections.creature_types.size}):`);
console.log(Array.from(tagCollections.creature_types).sort().join(', '));
console.log(`\n🎯 THEMES (${tagCollections.themes.size}):`);
console.log(Array.from(tagCollections.themes).sort().join(', '));
console.log(`\n⚔️  ARCHETYPES:`);
console.log(Array.from(tagCollections.archetype).sort().join(', '));
console.log(`\n🎮 PLAY PATTERNS:`);
console.log(Array.from(tagCollections.play_pattern).sort().join(', '));
console.log(`\n🌍 FLAVOR SETTINGS:`);
console.log(Array.from(tagCollections.flavor_setting).sort().join(', '));
console.log(`\n😊 TONES:`);
console.log(Array.from(tagCollections.tone).sort().join(', '));
console.log(`\n🎬 IPs / UNIVERSES:`);
console.log(Array.from(tagCollections.ip).sort().join(', '));
console.log(`\n📈 COMPLEXITY LEVELS:`);
console.log(Array.from(tagCollections.complexity).sort().join(', '));
console.log(`\n⚡ POWER LEVEL DISTRIBUTION:`);
Object.keys(powerLevels).sort().forEach(level => {
  console.log(`  ${level}: ${powerLevels[level]} decks`);
});

// Suggest theme groupings
console.log('\n\n💡 SUGGESTED THEME GROUPINGS:\n');

const suggestedThemes = [
  {
    name: 'Spooky & Dark',
    tags: { aesthetic_vibe: ['dark', 'spooky'], tone: ['dark', 'eerie'] }
  },
  {
    name: 'Space & Sci-Fi',
    tags: { flavor_setting: ['space', 'sci-fi'], aesthetic_vibe: ['technological', 'futuristic'] }
  },
  {
    name: 'Tribal Decks',
    tags: { themes: ['tribal'] }
  },
  {
    name: 'Artifacts Matter',
    tags: { themes: ['artifacts'], archetype: ['artifacts'] }
  },
  {
    name: 'Spellslinging',
    tags: { themes: ['spellslinger', 'instants and sorceries'], archetype: ['spellslinger'] }
  },
  {
    name: 'Go Wide (Tokens)',
    tags: { themes: ['tokens', 'go wide'], play_pattern: ['go wide'] }
  },
  {
    name: 'Big Creatures',
    tags: { play_pattern: ['stompy'], themes: ['big creatures'] }
  },
  {
    name: 'Graveyard Matters',
    tags: { themes: ['graveyard'], archetype: ['graveyard'] }
  },
  {
    name: 'Lands Matter',
    tags: { themes: ['lands matter', 'landfall'] }
  },
  {
    name: 'Combo & Synergy',
    tags: { archetype: ['combo'], play_pattern: ['combo'] }
  },
];

suggestedThemes.forEach((theme, index) => {
  // Count matching decks
  let matchCount = 0;
  precons.forEach(deck => {
    const tags = deck.tags || {};
    let matches = false;

    Object.keys(theme.tags).forEach(category => {
      const categoryTags = theme.tags[category];
      const deckTags = tags[category] || {};
      const allDeckTags = [...(deckTags.primary || []), ...(deckTags.secondary || [])];

      if (categoryTags.some(tag => allDeckTags.includes(tag))) {
        matches = true;
      }
    });

    if (matches) matchCount++;
  });

  console.log(`${index + 1}. ${theme.name} (${matchCount} decks)`);
});

console.log('\n✅ Analysis complete!\n');
