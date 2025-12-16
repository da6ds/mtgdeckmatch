import { Heart, Skull, Sparkles, PartyPopper, Sword, Trees, Moon, Swords, Castle, Cog, Leaf, Image, Target, type LucideIcon } from "lucide-react";

export interface QuestionOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
}

export interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "text-input" | "checkbox";
  options?: QuestionOption[];
  quickSelects?: string[];
  colorOptions?: { id: string; name: string; symbol: string }[];
  placeholder?: string;
}

// Question 0: Fork - Art vs Gameplay
export const forkQuestion: Question = {
  id: "fork",
  type: "multiple-choice",
  question: "What caught your eye?",
  options: [
    {
      id: "art",
      title: "Cool Art & Crossovers",
      description: "Fallout, Doctor Who, Warhammer - show me the cool crossovers",
      icon: Image,
      tags: ["art", "crossovers", "universes-beyond"],
    },
    {
      id: "gameplay",
      title: "Find My Playstyle",
      description: "Help me discover what kind of deck I'd love",
      icon: Target,
      tags: ["gameplay", "strategy", "playstyle"],
    },
  ],
};

// Question 1a: Art style selection (Art path)
export const artQuestion: Question = {
  id: "art-style",
  type: "multiple-choice",
  question: "What kind of art caught your eye?",
  options: [
    {
      id: "classic-fantasy",
      title: "Classic Fantasy",
      description: "Iconic magic and timeless adventure",
      icon: Sparkles,
      tags: ["dragon", "wizard", "fantasy", "classic"],
    },
    {
      id: "cute-cozy",
      title: "Cute & Cozy",
      description: "Adorable animals and heartwarming vibes",
      icon: Heart,
      tags: ["bloomburrow", "cute", "animals", "cozy"],
    },
    {
      id: "scifi-franchises",
      title: "Sci-Fi & Franchises",
      description: "Fallout, Transformers, Doctor Who and more",
      icon: Cog,
      tags: ["fallout", "doctor-who", "transformers", "warhammer", "sci-fi"],
    },
    {
      id: "horror-dark",
      title: "Horror & Dark",
      description: "Zombies, vampires, and things that creep",
      icon: Skull,
      tags: ["horror", "zombie", "vampire", "walking-dead", "dark"],
    },
    {
      id: "dinosaurs-beasts",
      title: "Dinosaurs & Beasts",
      description: "Prehistoric power and massive creatures",
      icon: PartyPopper,
      tags: ["dinosaur", "beast", "ixalan", "jurassic"],
    },
    {
      id: "epic-fantasy",
      title: "Epic Fantasy",
      description: "Lord of the Rings, Warhammer, legendary battles",
      icon: Swords,
      tags: ["lotr", "warhammer", "fantasy", "epic"],
    },
  ],
};

// Question 1b: Gameplay style selection (Gameplay path)
export const vibeQuestion: Question = {
  id: "vibe",
  type: "multiple-choice",
  question: "How do you want to play?",
  options: [
    {
      id: "lots-of-little-guys",
      title: "Lots of Little Guys",
      description: "Strength in numbers - flood the board and overwhelm",
      icon: Sparkles,
      tags: ["tokens", "go-wide", "swarm", "tribal", "aggressive"],
    },
    {
      id: "few-big-guys",
      title: "A Few Big Guys",
      description: "Quality over quantity - massive creatures that dominate",
      icon: Swords,
      tags: ["stompy", "big-mana", "ramp", "battlecruiser", "creatures"],
    },
    {
      id: "tricks-and-spells",
      title: "Tricks & Spells",
      description: "Outsmart everyone with perfect timing",
      icon: Sparkles,
      tags: ["control", "spellslinger", "instants", "sorceries", "interaction"],
    },
    {
      id: "cheat-death",
      title: "Cheat Death",
      description: "Your graveyard is your greatest weapon",
      icon: Skull,
      tags: ["graveyard", "recursion", "reanimator", "aristocrats", "sacrifice"],
    },
    {
      id: "konami-code",
      title: "↑↑↓↓←→←→ (B, A, Start)",
      description: "Unlock secret combos and chain reactions",
      icon: Cog,
      tags: ["combo", "artifacts", "synergy", "engine", "complex"],
    },
    {
      id: "main-character-energy",
      title: "Main Character Energy",
      description: "One hero. Unstoppable power. All eyes on them.",
      icon: Castle,
      tags: ["voltron", "equipment", "auras", "counters", "commander-focused"],
    },
  ],
};

// Question 2: Dynamic based on gameplay choice - Multiple select
export const creatureTypeQuestions: Record<string, Question> = {
  "lots-of-little-guys": {
    id: "creature-types",
    type: "checkbox",
    question: "What kind of army?",
    options: [
      { id: "goblins", title: "Goblins", description: "", icon: Sparkles, tags: ["goblins"] },
      { id: "elves", title: "Elves", description: "", icon: Leaf, tags: ["elves"] },
      { id: "soldiers", title: "Soldiers", description: "", icon: Swords, tags: ["soldiers"] },
      { id: "zombies", title: "Zombies", description: "", icon: Skull, tags: ["zombies"] },
      { id: "squirrels", title: "Squirrels", description: "", icon: Leaf, tags: ["squirrel"] },
      { id: "vampires", title: "Vampires", description: "", icon: Skull, tags: ["vampires"] },
      { id: "rats", title: "Rats", description: "", icon: Skull, tags: ["rats"] },
      { id: "faeries", title: "Faeries", description: "", icon: Sparkles, tags: ["faeries"] },
      { id: "saprolings", title: "Saprolings", description: "", icon: Leaf, tags: ["saprolings"] },
    ],
  },
  "few-big-guys": {
    id: "creature-types",
    type: "checkbox",
    question: "What kind of big guys?",
    options: [
      { id: "dragons", title: "Dragons", description: "", icon: Swords, tags: ["dragons"] },
      { id: "dinosaurs", title: "Dinosaurs", description: "", icon: Leaf, tags: ["dinosaurs"] },
      { id: "eldrazi", title: "Eldrazi", description: "", icon: Moon, tags: ["eldrazi"] },
      { id: "hydras", title: "Hydras", description: "", icon: Leaf, tags: ["hydras"] },
      { id: "demons", title: "Demons", description: "", icon: Skull, tags: ["demons"] },
      { id: "angels", title: "Angels", description: "", icon: Swords, tags: ["angels"] },
      { id: "giants", title: "Giants", description: "", icon: Swords, tags: ["giants"] },
      { id: "beasts", title: "Beasts", description: "", icon: Leaf, tags: ["beasts"] },
      { id: "wurms", title: "Wurms", description: "", icon: Leaf, tags: ["wurms"] },
    ],
  },
  "tricks-and-spells": {
    id: "creature-types",
    type: "checkbox",
    question: "What kind of magic?",
    options: [
      { id: "wizards", title: "Wizards", description: "", icon: Sparkles, tags: ["wizards"] },
      { id: "shamans", title: "Shamans", description: "", icon: Sparkles, tags: ["shamans"] },
      { id: "druids", title: "Druids", description: "", icon: Sparkles, tags: ["druids"] },
      { id: "spellcasters", title: "Spellcasters", description: "", icon: Sparkles, tags: ["spellcasters"] },
      { id: "storm", title: "Storm", description: "", icon: Sparkles, tags: ["storm"] },
      { id: "control", title: "Control", description: "", icon: Sparkles, tags: ["control"] },
      { id: "burn", title: "Burn", description: "", icon: Sparkles, tags: ["burn"] },
      { id: "copy-spells", title: "Copy Spells", description: "", icon: Sparkles, tags: ["copy"] },
      { id: "big-spells", title: "Big Spells", description: "", icon: Sparkles, tags: ["big-spells"] },
    ],
  },
  "cheat-death": {
    id: "creature-types",
    type: "checkbox",
    question: "What cheats death?",
    options: [
      { id: "zombies", title: "Zombies", description: "", icon: Skull, tags: ["zombies"] },
      { id: "spirits", title: "Spirits", description: "", icon: Moon, tags: ["spirits"] },
      { id: "skeletons", title: "Skeletons", description: "", icon: Skull, tags: ["skeletons"] },
      { id: "vampires", title: "Vampires", description: "", icon: Skull, tags: ["vampires"] },
      { id: "phoenixes", title: "Phoenixes", description: "", icon: Swords, tags: ["phoenixes"] },
      { id: "horrors", title: "Horrors", description: "", icon: Skull, tags: ["horrors"] },
      { id: "demons", title: "Demons", description: "", icon: Skull, tags: ["demons"] },
      { id: "clerics", title: "Clerics", description: "", icon: Sparkles, tags: ["clerics"] },
      { id: "anything-dies", title: "Anything Dies", description: "", icon: Skull, tags: ["aristocrats", "sacrifice"] },
    ],
  },
  "konami-code": {
    id: "creature-types",
    type: "checkbox",
    question: "What's your combo style?",
    options: [
      { id: "artifacts", title: "Artifacts", description: "", icon: Cog, tags: ["artifacts"] },
      { id: "enchantments", title: "Enchantments", description: "", icon: Sparkles, tags: ["enchantments"] },
      { id: "treasures", title: "Treasures", description: "", icon: Cog, tags: ["treasures"] },
      { id: "food", title: "Food", description: "", icon: Cog, tags: ["food"] },
      { id: "clues", title: "Clues", description: "", icon: Cog, tags: ["clues"] },
      { id: "counters", title: "+1/+1 Counters", description: "", icon: Cog, tags: ["counters"] },
      { id: "energy", title: "Energy", description: "", icon: Cog, tags: ["energy"] },
      { id: "vehicles", title: "Vehicles", description: "", icon: Cog, tags: ["vehicles"] },
      { id: "infinite-loops", title: "Infinite Loops", description: "", icon: Cog, tags: ["infinite", "combo"] },
    ],
  },
  "main-character-energy": {
    id: "creature-types",
    type: "checkbox",
    question: "Who's your hero?",
    options: [
      { id: "knights", title: "Knights", description: "", icon: Swords, tags: ["knights"] },
      { id: "warriors", title: "Warriors", description: "", icon: Swords, tags: ["warriors"] },
      { id: "angels", title: "Angels", description: "", icon: Swords, tags: ["angels"] },
      { id: "dragons", title: "Dragons", description: "", icon: Swords, tags: ["dragons"] },
      { id: "rogues", title: "Rogues", description: "", icon: Swords, tags: ["rogues"] },
      { id: "merfolk", title: "Merfolk", description: "", icon: Swords, tags: ["merfolk"] },
      { id: "cats", title: "Cats", description: "", icon: Swords, tags: ["cats"] },
      { id: "samurai", title: "Samurai", description: "", icon: Swords, tags: ["samurai"] },
      { id: "commanders", title: "Commanders", description: "", icon: Swords, tags: ["commanders", "equipment"] },
    ],
  },

  // Legacy vibe options (keep for backward compatibility if users have saved answers)
  "dark-mysterious": {
    id: "creature-types",
    type: "checkbox",
    question: "What scares you... in a fun way?",
    options: [
      { id: "vampires", title: "Vampires", description: "", icon: Moon, tags: ["vampires"] },
      { id: "zombies", title: "Zombies", description: "", icon: Moon, tags: ["zombies"] },
      { id: "demons", title: "Demons", description: "", icon: Moon, tags: ["demons"] },
      { id: "spirits", title: "Spirits & Ghosts", description: "", icon: Moon, tags: ["spirits"] },
      { id: "werewolves", title: "Werewolves", description: "", icon: Moon, tags: ["werewolves"] },
      { id: "skeletons", title: "Skeletons", description: "", icon: Moon, tags: ["skeletons"] },
      { id: "horrors", title: "Horrors", description: "", icon: Moon, tags: ["horrors"] },
      { id: "bats", title: "Bats", description: "", icon: Moon, tags: ["bats"] },
      { id: "eldrazi", title: "Eldrazi", description: "", icon: Moon, tags: ["eldrazi"] },
    ],
  },
  "epic-powerful": {
    id: "creature-types",
    type: "checkbox",
    question: "What's your hero style?",
    options: [
      { id: "dragons", title: "Dragons", description: "", icon: Swords, tags: ["dragons"] },
      { id: "angels", title: "Angels", description: "", icon: Swords, tags: ["angels"] },
      { id: "knights", title: "Knights", description: "", icon: Swords, tags: ["knights"] },
      { id: "warriors", title: "Warriors", description: "", icon: Swords, tags: ["warriors"] },
      { id: "gods", title: "Gods", description: "", icon: Swords, tags: ["gods"] },
      { id: "heroes", title: "Heroes", description: "", icon: Swords, tags: ["heroes"] },
      { id: "giants", title: "Giants", description: "", icon: Swords, tags: ["giants"] },
      { id: "titans", title: "Titans", description: "", icon: Swords, tags: ["titans"] },
      { id: "samurai", title: "Samurai", description: "", icon: Swords, tags: ["samurai"] },
    ],
  },
  "playful-whimsical": {
    id: "creature-types",
    type: "checkbox",
    question: "What kind of fun are you into?",
    options: [
      { id: "squirrel", title: "Squirrels", description: "", icon: Sparkles, tags: ["squirrel"] },
      { id: "cat", title: "Cats", description: "", icon: Sparkles, tags: ["cat"] },
      { id: "dog", title: "Dogs", description: "", icon: Sparkles, tags: ["dog"] },
      { id: "rabbit", title: "Rabbits", description: "", icon: Sparkles, tags: ["rabbit"] },
      { id: "faeries", title: "Faeries", description: "", icon: Sparkles, tags: ["faeries"] },
      { id: "goblins", title: "Goblins", description: "", icon: Sparkles, tags: ["goblins"] },
      { id: "pirates", title: "Pirates", description: "", icon: Sparkles, tags: ["pirates"] },
      { id: "bear", title: "Bears", description: "", icon: Sparkles, tags: ["bear"] },
      { id: "unicorns", title: "Unicorns", description: "", icon: Sparkles, tags: ["unicorns"] },
    ],
  },
  "fantasy-adventure": {
    id: "creature-types",
    type: "checkbox",
    question: "What kind of magic speaks to you?",
    options: [
      { id: "wizards", title: "Wizards", description: "", icon: Castle, tags: ["wizards"] },
      { id: "knights", title: "Knights", description: "", icon: Castle, tags: ["knights"] },
      { id: "elves", title: "Elves", description: "", icon: Castle, tags: ["elves"] },
      { id: "angels", title: "Angels", description: "", icon: Castle, tags: ["angels"] },
      { id: "dragons", title: "Dragons", description: "", icon: Castle, tags: ["dragons"] },
      { id: "merfolk", title: "Merfolk", description: "", icon: Castle, tags: ["merfolk"] },
      { id: "faeries", title: "Faeries", description: "", icon: Castle, tags: ["faeries"] },
      { id: "elementals", title: "Elementals", description: "", icon: Castle, tags: ["elementals"] },
      { id: "sphinxes", title: "Sphinxes", description: "", icon: Castle, tags: ["sphinxes"] },
    ],
  },
  "sci-fi-tech": {
    id: "creature-types",
    type: "checkbox",
    question: "What kind of technology excites you?",
    options: [
      { id: "artificer", title: "Artificers & Inventors", description: "", icon: Cog, tags: ["artificer"] },
      { id: "construct", title: "Constructs & Robots", description: "", icon: Cog, tags: ["construct"] },
      { id: "mutant", title: "Mutants", description: "", icon: Cog, tags: ["mutant"] },
      { id: "spacecraft", title: "Spacecraft", description: "", icon: Cog, tags: ["spacecraft"] },
      { id: "wizard", title: "Wizards", description: "", icon: Cog, tags: ["wizard"] },
      { id: "artifacts", title: "Artifact Creatures", description: "", icon: Cog, tags: ["artifacts"] },
      { id: "thopter", title: "Thopters & Vehicles", description: "", icon: Cog, tags: ["thopter"] },
      { id: "robot", title: "Robots", description: "", icon: Cog, tags: ["robot"] },
      { id: "cyborg", title: "Cyborgs", description: "", icon: Cog, tags: ["cyborg"] },
    ],
  },
  "nature-primal": {
    id: "creature-types",
    type: "checkbox",
    question: "What wild creature calls to you?",
    options: [
      { id: "dinosaurs", title: "Dinosaurs", description: "", icon: Leaf, tags: ["dinosaurs"] },
      { id: "beasts", title: "Beasts", description: "", icon: Leaf, tags: ["beasts"] },
      { id: "elves", title: "Elves", description: "", icon: Leaf, tags: ["elves"] },
      { id: "werewolves", title: "Werewolves", description: "", icon: Leaf, tags: ["werewolves"] },
      { id: "hydras", title: "Hydras", description: "", icon: Leaf, tags: ["hydras"] },
      { id: "elementals", title: "Elementals", description: "", icon: Leaf, tags: ["elementals"] },
      { id: "wurms", title: "Wurms", description: "", icon: Leaf, tags: ["wurms"] },
      { id: "insects", title: "Insects", description: "", icon: Leaf, tags: ["insects"] },
      { id: "treefolk", title: "Treefolk", description: "", icon: Leaf, tags: ["treefolk"] },
    ],
  },
};
