/**
 * Synonym Mapper - Handles normalization and matching for deck tags
 * 
 * Solves the plural/singular mismatch problem:
 * - User selects "squirrels" → normalized to "squirrel"
 * - Deck has "squirrel" tag → normalized to "squirrel"
 * - They match! ✅
 */

// Maps canonical forms to all variations (handles plurals, alternate spellings)
const CREATURE_TYPE_SYNONYMS: Record<string, string[]> = {
  // CUTE category
  'squirrel': ['squirrel', 'squirrels'],
  'rabbit': ['rabbit', 'rabbits', 'bunny', 'bunnies'],
  'dog': ['dog', 'dogs', 'puppy', 'puppies', 'hound', 'canine'],
  'cat': ['cat', 'cats', 'kitty', 'kitties', 'feline', 'kitten'],
  'bear': ['bear', 'bears'],
  'otter': ['otter', 'otters'],
  'mouse': ['mouse', 'mice'],
  'badger': ['badger', 'badgers'],
  'raccoon': ['raccoon', 'raccoons'],
  'fox': ['fox', 'foxes'],
  
  // CREEPY category  
  'vampire': ['vampire', 'vampires'],
  'zombie': ['zombie', 'zombies', 'undead'],
  'demon': ['demon', 'demons', 'demonic'],
  'spirit': ['spirit', 'spirits', 'ghost', 'ghosts'],
  'rat': ['rat', 'rats', 'rodent', 'rodents'],
  'spider': ['spider', 'spiders', 'arachnid'],
  'skeleton': ['skeleton', 'skeletons'],
  'horror': ['horror', 'horrors'],
  'bat': ['bat', 'bats'],
  'werewolf': ['werewolf', 'werewolves', 'wolf', 'wolves', 'lycanthrope'],
  'nightmare': ['nightmare', 'nightmares'],
  'eldrazi': ['eldrazi'],
  
  // WHIMSICAL category
  'faerie': ['faerie', 'faeries', 'fairy', 'fairies', 'fae'],
  'wizard': ['wizard', 'wizards', 'mage', 'mages', 'sorcerer'],
  'merfolk': ['merfolk', 'mermaid', 'mermaids', 'triton'],
  'shapeshifter': ['shapeshifter', 'shapeshifters'],
  'sphinx': ['sphinx', 'sphinxes'],
  'angel': ['angel', 'angels', 'angelic'],
  'unicorn': ['unicorn', 'unicorns'],
  'moonfolk': ['moonfolk'],
  'elemental': ['elemental', 'elementals'],
  'phoenix': ['phoenix', 'phoenixes'],
  'dragon': ['dragon', 'dragons', 'drake', 'drakes', 'wyrm', 'wyrms'],
  
  // CHAOTIC category
  'goblin': ['goblin', 'goblins'],
  'pirate': ['pirate', 'pirates', 'buccaneer'],
  'clown': ['clown', 'clowns', 'performer', 'performers'],
  'ooze': ['ooze', 'oozes', 'slime'],
  'atog': ['atog', 'atogs'],
  'kobold': ['kobold', 'kobolds'],
  'gremlin': ['gremlin', 'gremlins'],
  'imp': ['imp', 'imps'],
  'monkey': ['monkey', 'monkeys', 'ape', 'apes'],
  
  // EPIC category
  'knight': ['knight', 'knights'],
  'soldier': ['soldier', 'soldiers'],
  'warrior': ['warrior', 'warriors'],
  'god': ['god', 'gods', 'deity'],
  'hero': ['hero', 'heroes'],
  'samurai': ['samurai'],
  'paladin': ['paladin', 'paladins'],
  'legend': ['legend', 'legends', 'legendary'],
  'giant': ['giant', 'giants'],
  'titan': ['titan', 'titans'],
  
  // NATURE category
  'dinosaur': ['dinosaur', 'dinosaurs', 'dino', 'dinos'],
  'elf': ['elf', 'elves', 'elven', 'elvish'],
  'hydra': ['hydra', 'hydras'],
  'beast': ['beast', 'beasts'],
  'wurm': ['wurm', 'wurms', 'worm', 'worms'],
  'plant': ['plant', 'plants', 'fungus', 'fungi'],
  'insect': ['insect', 'insects', 'bug', 'bugs'],
  'snake': ['snake', 'snakes', 'serpent', 'serpents'],
  'treefolk': ['treefolk', 'tree', 'trees'],
};

const VIBE_SYNONYMS: Record<string, string[]> = {
  // New vibe categories
  'dark-mysterious': ['dark', 'mysterious', 'creepy', 'horror', 'spooky', 'scary', 'eerie', 'haunting', 'macabre', 'gothic', 'shadowy', 'ominous'],
  'epic-powerful': ['epic', 'powerful', 'brutal', 'chaotic', 'legendary', 'strong', 'mighty', 'dominant', 'overwhelming', 'grand', 'majestic', 'aggressive'],
  'playful-whimsical': ['playful', 'whimsical', 'cute', 'funny', 'charming', 'cuddly', 'adorable', 'sweet', 'friendly', 'silly', 'lighthearted', 'magical'],
  'fantasy-adventure': ['fantasy', 'adventure', 'heroic', 'elegant', 'magical', 'mystical', 'medieval', 'refined', 'sophisticated', 'graceful', 'noble', 'enchanting'],
  'sci-fi-tech': ['sci-fi', 'technological', 'tech', 'futuristic', 'mechanical', 'robotic', 'steampunk', 'cyberpunk', 'post-apocalyptic', 'artifacts'],
  'nature-primal': ['nature', 'primal', 'wild', 'forest', 'natural', 'earthy', 'wilderness', 'savage', 'bestial', 'untamed'],

  // Legacy mappings (for backward compatibility with existing deck tags)
  'cute': ['cute', 'cuddly', 'adorable', 'kawaii', 'sweet', 'wholesome', 'friendly', 'charming'],
  'creepy': ['creepy', 'dark', 'horror', 'spooky', 'scary', 'eerie', 'haunting', 'macabre', 'gothic'],
  'whimsical': ['whimsical', 'magical', 'enchanting', 'mysterious', 'mystical', 'fantastical', 'dreamy'],
  'chaotic': ['chaotic', 'funny', 'random', 'silly', 'wacky', 'unpredictable', 'zany', 'absurd', 'madness'],
  'epic': ['epic', 'heroic', 'legendary', 'noble', 'grand', 'majestic', 'glorious', 'triumphant'],
  'nature': ['nature', 'primal', 'wild', 'forest', 'natural', 'earthy', 'wilderness', 'savage'],
  'powerful': ['powerful', 'strong', 'mighty', 'dominant', 'overwhelming'],
  'elegant': ['elegant', 'refined', 'sophisticated', 'graceful', 'stylish'],
  'technological': ['technological', 'tech', 'futuristic', 'sci-fi', 'mechanical', 'robotic'],
  'mysterious': ['mysterious', 'mystical', 'enigmatic', 'secretive'],
  'brutal': ['brutal', 'aggressive', 'violent', 'fierce'],
  'playful': ['playful', 'fun', 'jovial', 'cheerful'],
  'heroic': ['heroic', 'brave', 'valiant', 'courageous'],
};

const ARCHETYPE_SYNONYMS: Record<string, string[]> = {
  // New simplified 3-option archetypes
  'go-fast': ['go-fast', 'fast', 'quick', 'speedy', 'rush'],
  'take-control': ['take-control', 'control', 'controlling', 'defensive'],
  'play-long-game': ['play-long-game', 'long-game', 'value', 'grinding', 'patient'],

  // Legacy archetype mappings (for backward compatibility with deck tags)
  'aggro': ['aggro', 'aggressive', 'attack', 'beatdown', 'rush', 'fast'],
  'control': ['control', 'controlling', 'defensive', 'reactive', 'counter'],
  'combo': ['combo', 'combination', 'engine', 'synergy'],
  'midrange': ['midrange', 'value', 'mid-range', 'tempo'],
  'political': ['political', 'group hug', 'politics', 'diplomatic', 'social'],
  'tribal': ['tribal', 'creature type', 'synergy'],
  'artifacts': ['artifacts', 'artifact', 'colorless', 'construct'],
  'tokens': ['tokens', 'token', 'army', 'swarm', 'go-wide'],
  'ramp': ['ramp', 'ramping', 'acceleration', 'mana'],
  'voltron': ['voltron', 'auras', 'equipment', 'enchantments'],
  'reanimator': ['reanimator', 'reanimation', 'graveyard', 'recursion'],
  'aristocrats': ['aristocrats', 'sacrifice', 'death triggers'],
};

// Reverse lookup maps for fast normalization
const REVERSE_CREATURE_MAP: Map<string, string> = new Map();
const REVERSE_VIBE_MAP: Map<string, string> = new Map();
const REVERSE_ARCHETYPE_MAP: Map<string, string> = new Map();

// Build reverse maps on initialization
Object.entries(CREATURE_TYPE_SYNONYMS).forEach(([canonical, variations]) => {
  variations.forEach(variant => {
    REVERSE_CREATURE_MAP.set(variant.toLowerCase(), canonical);
  });
});

Object.entries(VIBE_SYNONYMS).forEach(([canonical, variations]) => {
  variations.forEach(variant => {
    REVERSE_VIBE_MAP.set(variant.toLowerCase(), canonical);
  });
});

Object.entries(ARCHETYPE_SYNONYMS).forEach(([canonical, variations]) => {
  variations.forEach(variant => {
    REVERSE_ARCHETYPE_MAP.set(variant.toLowerCase(), canonical);
  });
});

/**
 * Normalize creature type to canonical form
 * Example: "squirrels" -> "squirrel", "dragons" -> "dragon"
 */
export function normalizeCreatureType(input: string): string {
  const normalized = REVERSE_CREATURE_MAP.get(input.toLowerCase());
  return normalized || input.toLowerCase();
}

/**
 * Normalize vibe to canonical form
 */
export function normalizeVibe(input: string): string {
  const normalized = REVERSE_VIBE_MAP.get(input.toLowerCase());
  return normalized || input.toLowerCase();
}

/**
 * Normalize archetype to canonical form
 */
export function normalizeArchetype(input: string): string {
  const normalized = REVERSE_ARCHETYPE_MAP.get(input.toLowerCase());
  return normalized || input.toLowerCase();
}

/**
 * Get all variations of a creature type (for fuzzy matching)
 */
export function getCreatureVariations(canonical: string): string[] {
  return CREATURE_TYPE_SYNONYMS[canonical.toLowerCase()] || [canonical.toLowerCase()];
}

/**
 * Check if two creature types match (handles synonyms)
 */
export function doCreatureTypesMatch(userInput: string, deckTag: string): boolean {
  const normalizedUser = normalizeCreatureType(userInput);
  const normalizedDeck = normalizeCreatureType(deckTag);
  return normalizedUser === normalizedDeck;
}

/**
 * Check if two vibes match (handles synonyms)
 */
export function doVibesMatch(userInput: string, deckTag: string): boolean {
  const normalizedUser = normalizeVibe(userInput);
  const normalizedDeck = normalizeVibe(deckTag);
  return normalizedUser === normalizedDeck;
}

/**
 * Check if two archetypes match (handles synonyms)
 */
export function doArchetypesMatch(userInput: string, deckTag: string): boolean {
  const normalizedUser = normalizeArchetype(userInput);
  const normalizedDeck = normalizeArchetype(deckTag);
  return normalizedUser === normalizedDeck;
}
