import preconsData from "@/data/precons-data.json";

export interface ParsedCustomInput {
  vibes: string[];
  creatureTypes: string[];
  themes: string[];
  ips: string[];
  rawText: string;
}

export interface MatchResult {
  deck: any;
  score: number;
  matchReason: string;
  matchCategory: 'ip_exact' | 'theme' | 'creature' | 'fuzzy';
}

// IP name mappings - exact and variations
const IP_MAPPINGS: Record<string, { ip: string; variations: string[] }> = {
  walking_dead: { 
    ip: "walking_dead", 
    variations: ["walking dead", "twd", "negan", "rick grimes"] 
  },
  stranger_things: { 
    ip: "stranger_things", 
    variations: ["stranger things", "upside down", "demogorgon", "mind flayer", "eleven"] 
  },
  transformers: { 
    ip: "transformers", 
    variations: ["transformers", "optimus", "megatron", "autobots", "decepticons"] 
  },
  street_fighter: { 
    ip: "street_fighter", 
    variations: ["street fighter", "chun li", "ryu", "hadouken", "ken"] 
  },
  fortnite: { 
    ip: "fortnite", 
    variations: ["fortnite", "battle royale"] 
  },
  jurassic_world: { 
    ip: "jurassic_world", 
    variations: ["jurassic", "jurassic park", "jurassic world"] 
  },
  doctor_who: { 
    ip: "doctor_who", 
    variations: ["doctor who", "tardis", "time lord", "dalek"] 
  },
  warhammer_40k: { 
    ip: "warhammer_40k", 
    variations: ["warhammer", "40k", "warhammer 40000", "space marine"] 
  },
  lord_of_the_rings: { 
    ip: "lord_of_the_rings", 
    variations: ["lord of the rings", "lotr", "middle earth", "hobbit", "gandalf", "frodo"] 
  },
  final_fantasy: { 
    ip: "final_fantasy", 
    variations: ["final fantasy", "ff", "cloud", "sephiroth"] 
  },
  fallout: { 
    ip: "fallout", 
    variations: ["fallout", "vault", "wasteland", "post apocalyptic", "post-apocalyptic", "nuclear"] 
  },
  godzilla: { 
    ip: "godzilla", 
    variations: ["godzilla", "kaiju", "king of monsters"] 
  },
  monty_python: { 
    ip: "monty_python", 
    variations: ["monty python", "black knight", "holy grail"] 
  },
  princess_bride: { 
    ip: "princess_bride", 
    variations: ["princess bride", "inigo", "inconceivable"] 
  },
};

// Theme/concept mappings
const THEME_MAPPINGS: Record<string, { 
  keywords: string[]; 
  matchCreatures?: string[]; 
  matchIPs?: string[]; 
  matchVibes?: string[];
  matchThemes?: string[];
  reason: (query: string) => string;
}> = {
  aliens: {
    keywords: ["aliens", "alien", "extraterrestrial", "outer space", "ufo"],
    matchCreatures: ["eldrazi", "alien", "phyrexian"],
    matchThemes: ["cosmic", "space", "otherworldly"],
    reason: (q) => `You searched "${q}" - this deck features Eldrazi, cosmic alien creatures from the void`
  },
  robots: {
    keywords: ["robots", "robot", "mech", "machine", "mechanical", "android"],
    matchCreatures: ["robot", "construct", "myr"],
    matchIPs: ["transformers"],
    matchThemes: ["artifacts", "mechanical"],
    reason: (q) => `You searched "${q}" - this artifact deck is full of mechanical creatures`
  },
  zombies: {
    keywords: ["zombies", "zombie", "undead", "risen"],
    matchCreatures: ["zombie"],
    matchIPs: ["walking_dead"],
    reason: (q) => `You searched "${q}" - this deck is packed with undead creatures`
  },
  space: {
    keywords: ["space", "sci-fi", "science fiction", "scifi", "cosmos", "galaxy"],
    matchIPs: ["doctor_who", "warhammer_40k", "transformers"],
    matchThemes: ["space", "sci-fi", "futuristic"],
    reason: (q) => `You searched "${q}" - this deck explores the cosmos and sci-fi themes`
  },
  horror: {
    keywords: ["horror", "scary", "creepy", "terrifying", "nightmare"],
    matchIPs: ["stranger_things", "walking_dead"],
    matchVibes: ["creepy", "dark"],
    matchCreatures: ["horror", "nightmare", "demon"],
    reason: (q) => `You searched "${q}" - this deck brings the scares with horror themes`
  },
  cute: {
    keywords: ["cute", "adorable", "kawaii", "cuddly", "sweet"],
    matchVibes: ["cute", "cuddly"],
    matchCreatures: ["squirrel", "cat", "dog", "rabbit", "otter"],
    reason: (q) => `You searched "${q}" - this deck is full of adorable creatures`
  },
  dragons: {
    keywords: ["dragons", "dragon", "wyrm", "dragonlord"],
    matchCreatures: ["dragon"],
    reason: (q) => `You searched "${q}" - this deck focuses on powerful dragon tribal`
  },
};

// Creature type mappings with fuzzy matching
const CREATURE_MAPPINGS: Record<string, string[]> = {
  cat: ["cats", "cat", "kitty", "kitties", "feline", "kitten"],
  dog: ["dogs", "dog", "puppy", "puppies", "hound", "canine"],
  bear: ["bears", "bear"],
  squirrel: ["squirrels", "squirrel"],
  rat: ["rats", "rat", "rodent"],
  otter: ["otters", "otter"],
  rabbit: ["rabbits", "rabbit", "bunny", "bunnies"],
  fox: ["foxes", "fox"],
  ninja: ["ninjas", "ninja", "ninjutsu"],
  pirate: ["pirates", "pirate", "buccaneer"],
  elf: ["elves", "elf", "elven"],
  goblin: ["goblins", "goblin"],
  vampire: ["vampires", "vampire", "bloodsucker"],
  werewolf: ["werewolves", "werewolf", "wolf", "wolves", "lycanthrope"],
  dragon: ["dragons", "dragon", "drake", "wyrm"],
  angel: ["angels", "angel", "angelic"],
  demon: ["demons", "demon", "demonic"],
  zombie: ["zombies", "zombie", "undead"],
  knight: ["knights", "knight"],
  wizard: ["wizards", "wizard", "mage", "sorcerer"],
  dinosaur: ["dinosaurs", "dinosaur", "dino", "prehistoric"],
  insect: ["insects", "insect", "bug", "bugs"],
  spider: ["spiders", "spider", "arachnid"],
  snake: ["snakes", "snake", "serpent", "viper"],
  merfolk: ["merfolk", "mermaid", "triton", "fish people"],
  spirit: ["spirits", "spirit", "ghost", "ghosts"],
  elemental: ["elementals", "elemental"],
  horror: ["horrors", "horror"],
  eldrazi: ["eldrazi", "cosmic horror"],
  phyrexian: ["phyrexian", "phyrexians"],
};

// Helper: Calculate string similarity (Levenshtein distance)
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - editDistance) / longer.length;
}

// Helper: Levenshtein distance calculation
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Check for IP match (exact then fuzzy)
function checkIPMatch(query: string): string | null {
  const normalizedQuery = query.toLowerCase();
  
  // First: Try exact substring matching
  for (const [ip, data] of Object.entries(IP_MAPPINGS)) {
    for (const variation of data.variations) {
      if (normalizedQuery.includes(variation)) {
        return ip;
      }
    }
  }
  
  // Second: Fuzzy matching fallback with 80% similarity threshold
  for (const [ip, data] of Object.entries(IP_MAPPINGS)) {
    for (const variation of data.variations) {
      // Check if query words match variation words with fuzzy logic
      const queryWords = normalizedQuery.split(/\s+/);
      const variationWords = variation.split(/\s+/);
      
      for (const qWord of queryWords) {
        for (const vWord of variationWords) {
          if (qWord.length >= 4 && vWord.length >= 4) { // Only fuzzy match longer words
            if (calculateStringSimilarity(qWord, vWord) >= 0.8) {
              return ip;
            }
          }
        }
      }
    }
  }
  
  return null;
}

// Check for theme match (exact then fuzzy)
function checkThemeMatch(query: string): { theme: string; data: any } | null {
  const normalizedQuery = query.toLowerCase();
  
  // First: Try exact substring matching
  for (const [theme, data] of Object.entries(THEME_MAPPINGS)) {
    for (const keyword of data.keywords) {
      if (normalizedQuery.includes(keyword)) {
        return { theme, data };
      }
    }
  }
  
  // Second: Fuzzy matching fallback with 80% similarity threshold
  for (const [theme, data] of Object.entries(THEME_MAPPINGS)) {
    for (const keyword of data.keywords) {
      // Check if query contains words similar to keyword words
      const queryWords = normalizedQuery.split(/\s+/);
      const keywordWords = keyword.split(/\s+/);
      
      for (const qWord of queryWords) {
        for (const kWord of keywordWords) {
          if (qWord.length >= 4 && kWord.length >= 4) { // Only fuzzy match longer words
            if (calculateStringSimilarity(qWord, kWord) >= 0.8) {
              return { theme, data };
            }
          }
        }
      }
    }
  }
  
  return null;
}

// Check for creature type match (exact then fuzzy)
function checkCreatureTypeMatch(query: string): string | null {
  const normalizedQuery = query.toLowerCase();
  
  // First: Try exact substring matching
  for (const [creature, variations] of Object.entries(CREATURE_MAPPINGS)) {
    for (const variation of variations) {
      if (normalizedQuery.includes(variation)) {
        return creature;
      }
    }
  }
  
  // Second: Fuzzy matching fallback with 80% similarity threshold
  // This handles misspellings like "dragn" -> "dragon", "elfs" -> "elf"
  for (const [creature, variations] of Object.entries(CREATURE_MAPPINGS)) {
    for (const variation of variations) {
      const queryWords = normalizedQuery.split(/\s+/);
      
      for (const qWord of queryWords) {
        if (qWord.length >= 3 && variation.length >= 3) { // Match shorter words for creatures
          if (calculateStringSimilarity(qWord, variation) >= 0.8) {
            return creature;
          }
        }
      }
    }
  }
  
  return null;
}

// Get decks from IP
function getDecksFromIP(ip: string): any[] {
  return preconsData.filter((deck: any) => deck.ip === ip);
}

// Get decks from theme
function getDecksFromTheme(themeData: any): any[] {
  const { matchCreatures, matchIPs, matchVibes, matchThemes } = themeData.data;
  
  return preconsData.filter((deck: any) => {
    const tags = deck.tags || {};
    
    // Check IP match
    if (matchIPs && matchIPs.includes(deck.ip)) {
      return true;
    }
    
    // Check creature types
    if (matchCreatures) {
      const deckCreatures = [
        ...(tags.creature_types?.primary || []),
        ...(tags.creature_types?.secondary || [])
      ].map(c => c.toLowerCase());
      
      if (matchCreatures.some(mc => deckCreatures.includes(mc.toLowerCase()))) {
        return true;
      }
    }
    
    // Check vibes
    if (matchVibes) {
      const deckVibes = [
        ...(tags.aesthetic_vibe?.primary || []),
        ...(tags.aesthetic_vibe?.secondary || [])
      ].map(v => v.toLowerCase());
      
      if (matchVibes.some(mv => deckVibes.includes(mv.toLowerCase()))) {
        return true;
      }
    }
    
    // Check themes
    if (matchThemes) {
      const deckThemes = (tags.themes || []).map(t => t.toLowerCase());
      if (matchThemes.some(mt => deckThemes.some(dt => dt.includes(mt.toLowerCase())))) {
        return true;
      }
    }
    
    return false;
  });
}

// Get decks from creature type
function getDecksFromCreatureType(creatureType: string): any[] {
  return preconsData.filter((deck: any) => {
    const tags = deck.tags || {};
    const deckCreatures = [
      ...(tags.creature_types?.primary || []),
      ...(tags.creature_types?.secondary || [])
    ].map(c => c.toLowerCase());
    
    return deckCreatures.includes(creatureType.toLowerCase());
  });
}

// Fuzzy matching fallback
function getFuzzyMatches(query: string): any[] {
  const normalizedQuery = query.toLowerCase();
  
  // Try to find any deck with related themes
  const fuzzyKeywords = [
    { keywords: ["x files", "x-files", "xfiles"], related: ["stranger_things", "doctor_who"] },
    { keywords: ["star wars", "starwars"], related: ["warhammer_40k", "doctor_who"] },
    { keywords: ["marvel", "mcu", "superheroes", "superhero"], related: [] },
    { keywords: ["pokemon", "pokémon"], related: [] },
  ];
  
  for (const { keywords, related } of fuzzyKeywords) {
    for (const keyword of keywords) {
      if (normalizedQuery.includes(keyword)) {
        if (related.length > 0) {
          return preconsData.filter((deck: any) => related.includes(deck.ip));
        }
      }
    }
  }
  
  // Default: return some popular/diverse decks
  return preconsData.filter((deck: any) => {
    const tags = deck.tags || {};
    return (tags.power_level || 0) >= 6 && (tags.power_level || 0) <= 7;
  }).slice(0, 10);
}

// Generate match reason
function generateMatchReason(
  originalQuery: string,
  deck: any,
  category: 'ip_exact' | 'theme' | 'creature' | 'fuzzy',
  themeData?: any,
  creatureType?: string
): string {
  const tags = deck.tags || {};
  
  // IP exact match
  if (category === 'ip_exact') {
    const ipName = deck.name;
    return `You searched "${originalQuery}" - this is the official ${ipName} deck!`;
  }
  
  // Creature type match
  if (category === 'creature' && creatureType) {
    const creatureName = creatureType.charAt(0).toUpperCase() + creatureType.slice(1);
    return `You searched "${originalQuery}" - this deck focuses on ${creatureName} tribal synergies`;
  }
  
  // Theme match
  if (category === 'theme' && themeData) {
    return themeData.reason(originalQuery);
  }
  
  // Fuzzy match
  if (category === 'fuzzy') {
    const normalizedQuery = originalQuery.toLowerCase();
    
    // Special fuzzy match messages
    if (normalizedQuery.includes("x files") || normalizedQuery.includes("x-files")) {
      return `You searched "${originalQuery}" - while there's no exact match, this deck has sci-fi mystery vibes`;
    }
    if (normalizedQuery.includes("star wars")) {
      return `You searched "${originalQuery}" - no exact match, but this epic space-themed deck might interest you`;
    }
    if (normalizedQuery.includes("marvel") || normalizedQuery.includes("superhero")) {
      return `You searched "${originalQuery}" - no official deck, but this heroic deck features legendary powerful creatures`;
    }
    if (normalizedQuery.includes("pokemon") || normalizedQuery.includes("pokémon")) {
      return `You searched "${originalQuery}" - no exact match, but this deck focuses on collecting diverse creatures`;
    }
    
    const vibe = tags.aesthetic_vibe?.primary?.[0] || "themed";
    return `You searched "${originalQuery}" - no exact match, but this ${vibe} deck might interest you`;
  }
  
  return `Matched based on your search for "${originalQuery}"`;
}

// Main parser function
export function parseCustomInput(query: string): MatchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  let matches: any[] = [];
  let matchCategory: 'ip_exact' | 'theme' | 'creature' | 'fuzzy' = 'fuzzy';
  let themeData: any = null;
  let creatureType: string | null = null;
  
  // 1. Check for exact IP match (highest priority)
  const ipMatch = checkIPMatch(normalizedQuery);
  if (ipMatch) {
    matches = getDecksFromIP(ipMatch);
    matchCategory = 'ip_exact';
  }
  
  // 2. Check for theme match
  if (matches.length === 0) {
    const themeMatch = checkThemeMatch(normalizedQuery);
    if (themeMatch) {
      matches = getDecksFromTheme(themeMatch);
      matchCategory = 'theme';
      themeData = themeMatch.data;
    }
  }
  
  // 3. Check for creature type match
  if (matches.length === 0) {
    const creatureMatch = checkCreatureTypeMatch(normalizedQuery);
    if (creatureMatch) {
      matches = getDecksFromCreatureType(creatureMatch);
      matchCategory = 'creature';
      creatureType = creatureMatch;
    }
  }
  
  // 4. Fuzzy/fallback matching
  if (matches.length === 0) {
    matches = getFuzzyMatches(normalizedQuery);
    matchCategory = 'fuzzy';
  }
  
  // Score and sort matches
  const scoredMatches = matches.map(deck => {
    const tags = deck.tags || {};
    let score = 0;
    
    // Prefer power level 6-7
    if ((tags.power_level || 0) >= 6 && (tags.power_level || 0) <= 7) {
      score += 10;
    }
    
    // Bonus for exact matches
    if (matchCategory === 'ip_exact') {
      score += 50;
    } else if (matchCategory === 'creature') {
      score += 30;
    } else if (matchCategory === 'theme') {
      score += 20;
    }
    
    return {
      deck,
      score,
      matchReason: generateMatchReason(query, deck, matchCategory, themeData, creatureType),
      matchCategory
    };
  });
  
  // Sort by score and return top 3
  scoredMatches.sort((a, b) => b.score - a.score);
  return scoredMatches.slice(0, 3);
}
