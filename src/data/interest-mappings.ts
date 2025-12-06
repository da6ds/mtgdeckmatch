// Interest mappings for "I Have No Idea Where to Start" flow
// Updated with 9 categories targeting non-Magic people aged 20-50

export interface Interest {
  id: string;
  label: string;
  subtext: string;
  artUrl: string; // Scryfall art_crop URL
  // Filters for card sets
  cardSetFilters: {
    franchises?: string[];
    ids?: string[]; // specific card set IDs
  };
  // Filters for decks
  deckFilters: {
    ip?: ('magic_original' | 'universes_beyond')[];
    aestheticVibes?: string[];
    creatureTypes?: string[];
    themes?: string[];
    sets?: string[]; // specific set names
  };
  // Special behavior flag
  specialBehavior?: 'curated-mix';
}

export const interests: Interest[] = [
  {
    id: 'whimsy-weird',
    label: 'Whimsy & Weird',
    subtext: 'Yes, there\'s a Furby card',
    artUrl: 'https://cards.scryfall.io/art_crop/front/f/7/f78bfbdf-719d-48f2-b26d-970aad3dbe06.jpg',
    cardSetFilters: {
      ids: ['secret-lair-furby', 'sl-spongebob', 'sl-monty-python']
    },
    deckFilters: {
      aestheticVibes: ['whimsical', 'playful'],
      creatureTypes: ['squirrel', 'raccoon']
    }
  },
  {
    id: 'cute-animals',
    label: 'Cute Animals',
    subtext: 'Raccoons, mice, and squirrels',
    artUrl: 'https://cards.scryfall.io/art_crop/front/3/9/39ebb84a-1c52-4b07-9bd0-b360523b3a5b.jpg',
    cardSetFilters: {
      ids: [] // Bloomburrow is a main set, not in card-sets.json
    },
    deckFilters: {
      creatureTypes: ['mouse', 'squirrel', 'raccoon', 'fox', 'cat', 'dog', 'bird', 'rabbit', 'otter', 'badger'],
      sets: ['Bloomburrow'],
      aestheticVibes: ['cute', 'cozy', 'whimsical']
    }
  },
  {
    id: 'nature-wild',
    label: 'Nature & Wild',
    subtext: 'Wolves, eagles, and untamed beasts',
    artUrl: 'https://cards.scryfall.io/art_crop/front/f/7/f7fce047-49f1-40ae-8410-6501cb0f8201.jpg',
    cardSetFilters: {
      ids: [] // Nature theme doesn't have specific crossover sets
    },
    deckFilters: {
      creatureTypes: ['wolf', 'beast', 'elemental', 'bear', 'boar', 'elk', 'wurm'],
      themes: ['lands matter', 'ramp', 'landfall'],
      aestheticVibes: ['primal', 'powerful']
    }
  },
  {
    id: 'horror',
    label: 'Horror',
    subtext: 'Zombies, vampires, things that go bump',
    artUrl: 'https://cards.scryfall.io/art_crop/front/6/3/63ba8eef-b834-4031-b0a1-0f8505d53813.jpg',
    cardSetFilters: {
      franchises: ['The Walking Dead (AMC)', 'Dracula (Universal)', 'Child\'s Play (Horror)', 'Stranger Things (Netflix)']
    },
    deckFilters: {
      creatureTypes: ['zombie', 'vampire', 'skeleton', 'spirit', 'horror', 'demon'],
      themes: ['graveyard', 'sacrifice', 'aristocrats', 'reanimator'],
      aestheticVibes: ['dark', 'mysterious', 'spooky']
    }
  },
  {
    id: 'sci-fi-robots',
    label: 'Sci-Fi & Robots',
    subtext: 'Fallout, Transformers, and machines',
    artUrl: 'https://cards.scryfall.io/art_crop/front/8/6/86b45e3e-8460-4678-87d1-d74479936c83.jpg',
    cardSetFilters: {
      franchises: ['Fallout (Bethesda)', 'Transformers (Hasbro)', 'Warhammer 40K (Games Workshop)', 'Doctor Who (BBC)']
    },
    deckFilters: {
      ip: ['universes_beyond'],
      creatureTypes: ['robot', 'construct', 'artificer', 'myr', 'golem'],
      themes: ['artifacts', 'vehicles', 'equipment'],
      sets: ['Fallout', 'Warhammer 40,000', 'Transformers']
    }
  },
  {
    id: 'anime-cartoons',
    label: 'Anime & Cartoons',
    subtext: 'SpongeBob to Peach Momoko',
    artUrl: 'https://cards.scryfall.io/art_crop/front/7/9/7993b049-09d8-4c1a-9455-bb092249e0b6.jpg',
    cardSetFilters: {
      ids: ['sl-hatsune-miku', 'sl-anime-legends', 'sl-spongebob', 'final-fantasy', 'street-fighter']
    },
    deckFilters: {
      // Hard to filter by art style - show popular/visually striking UB decks
      ip: ['universes_beyond'],
      sets: ['Bloomburrow'] // Has beautiful illustrated art style
    }
  },
  {
    id: 'giant-monsters',
    label: 'Giant Monsters',
    subtext: 'Godzilla-sized problems',
    artUrl: 'https://cards.scryfall.io/art_crop/front/9/a/9a0639a0-c898-4a07-975c-a02bdd53175b.jpg',
    cardSetFilters: {
      franchises: ['Godzilla (Toho)', 'Jurassic World (Universal)']
    },
    deckFilters: {
      creatureTypes: ['dinosaur', 'eldrazi', 'hydra', 'dragon', 'giant', 'kraken', 'leviathan', 'wurm'],
      aestheticVibes: ['powerful', 'epic'],
      themes: ['big creatures', '7+ power matters', 'go-tall']
    }
  },
  {
    id: 'video-games',
    label: 'Video Games',
    subtext: 'Street Fighter, Final Fantasy, Assassin\'s Creed',
    artUrl: 'https://cards.scryfall.io/art_crop/front/d/a/dae9ee75-30b8-4e24-af8b-031c816d3221.jpg',
    cardSetFilters: {
      franchises: ['Street Fighter (Capcom)', 'Final Fantasy (Square Enix)', 'Tomb Raider (Square Enix)']
    },
    deckFilters: {
      ip: ['universes_beyond'],
      sets: ['Assassin\'s Creed']
    }
  },
  {
    id: 'surprise-me',
    label: 'Just Show Me Cool Stuff',
    subtext: 'Surprise me with the best of everything',
    artUrl: 'https://cards.scryfall.io/art_crop/front/d/7/d7d4c97a-9319-4534-9a49-da000f41a02d.jpg',
    cardSetFilters: {
      ids: [] // Special handling - will show curated mix
    },
    deckFilters: {
      // Special handling - will show curated mix
    },
    specialBehavior: 'curated-mix'
  }
];

// Helper to find interest by ID
export function getInterestById(id: string): Interest | undefined {
  return interests.find(interest => interest.id === id);
}

// Curated content for "Just Show Me Cool Stuff" option
export const curatedCardSetIds = [
  'secret-lair-furby',
  'godzilla-ikoria',
  'doctor-who',
  'fallout',
  'lord-of-the-rings',
  'transformers',
  'walking-dead',
  'sl-hatsune-miku',
  'final-fantasy',
  'warhammer-40k',
  'sl-marvel-iron-man',
  'dracula-crimson-vow',
  'jurassic-world-ixalan',
  'sl-spongebob',
  'stranger-things',
  'street-fighter',
  'sl-monty-python',
  'sl-deadpool',
  'sl-ghostbusters',
  'sl-marvel-wolverine'
];

export const curatedDeckIds = [
  'counter-intelligence', // Space sci-fi
  'bloomburrow-peace-offering', // Cute animals
  'fallout-hail-caesar', // Post-apocalyptic
  'lotr-riders-of-rohan', // Epic fantasy
  'doctor-who-timey-wimey', // Time travel
  'warhammer-necron-dynasties', // Dark sci-fi
  'duskmourn-endless-punishment', // Horror
  'assassins-creed-freerunning', // Action adventure
  'jurassic-world-raptor-stampede', // Dinosaurs
  'bloomburrow-squirrel-squadron' // Cute critters
];
