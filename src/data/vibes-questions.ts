import { Heart, Skull, Sparkles, PartyPopper, Sword, Trees, Moon, Swords, Castle, Cog, Leaf } from "lucide-react";

export interface QuestionOption {
  id: string;
  title: string;
  description: string;
  icon: any;
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

// Question 1: Main vibe selection
export const vibeQuestion: Question = {
  id: "vibe",
  type: "multiple-choice",
  question: "What's your vibe?",
  options: [
    {
      id: "dark-mysterious",
      title: "Dark & Mysterious",
      description: "Shadows, secrets, and things that go bump in the night",
      icon: Moon,
      tags: ["dark", "mysterious", "creepy", "horror", "gothic"],
    },
    {
      id: "epic-powerful",
      title: "Epic & Powerful",
      description: "Legendary battles, dominance, and overwhelming force",
      icon: Swords,
      tags: ["epic", "powerful", "brutal", "chaotic", "legendary"],
    },
    {
      id: "playful-whimsical",
      title: "Playful & Whimsical",
      description: "Fun, quirky, and lighthearted chaos",
      icon: Sparkles,
      tags: ["playful", "whimsical", "cute", "funny", "magical"],
    },
    {
      id: "fantasy-adventure",
      title: "Fantasy & Adventure",
      description: "Fairy tales, heroes, and classic quests",
      icon: Castle,
      tags: ["fantasy", "adventure", "heroic", "elegant", "magical"],
    },
    {
      id: "sci-fi-tech",
      title: "Sci-Fi & Tech",
      description: "Machines, gadgets, and futuristic warfare",
      icon: Cog,
      tags: ["sci-fi", "technological", "futuristic", "mechanical", "artifacts"],
    },
    {
      id: "nature-primal",
      title: "Nature & Primal",
      description: "Beasts, wilderness, and raw natural power",
      icon: Leaf,
      tags: ["nature", "primal", "wild", "forest", "beasts"],
    },
  ],
};

// Question 2: Dynamic based on vibe choice - Multiple select with 12 options
export const creatureTypeQuestions: Record<string, Question> = {
  "dark-mysterious": {
    id: "creature-types",
    type: "checkbox",
    question: "What scares you... in a fun way?",
    options: [
      { id: "vampires", title: "Vampires", description: "", icon: Moon, tags: ["vampires"] },
      { id: "zombies", title: "Zombies", description: "", icon: Moon, tags: ["zombies"] },
      { id: "demons", title: "Demons", description: "", icon: Moon, tags: ["demons"] },
      { id: "spirits", title: "Spirits & Ghosts", description: "", icon: Moon, tags: ["spirits"] },
      { id: "rats", title: "Rats", description: "", icon: Moon, tags: ["rats"] },
      { id: "spiders", title: "Spiders", description: "", icon: Moon, tags: ["spiders"] },
      { id: "skeletons", title: "Skeletons", description: "", icon: Moon, tags: ["skeletons"] },
      { id: "horrors", title: "Horrors", description: "", icon: Moon, tags: ["horrors"] },
      { id: "bats", title: "Bats", description: "", icon: Moon, tags: ["bats"] },
      { id: "werewolves", title: "Werewolves", description: "", icon: Moon, tags: ["werewolves"] },
      { id: "nightmares", title: "Nightmares", description: "", icon: Moon, tags: ["nightmares"] },
      { id: "eldrazi", title: "Eldrazi", description: "", icon: Moon, tags: ["eldrazi"] },
    ],
  },
  "epic-powerful": {
    id: "creature-types",
    type: "checkbox",
    question: "What's your hero style?",
    options: [
      { id: "knights", title: "Knights", description: "", icon: Swords, tags: ["knights"] },
      { id: "angels", title: "Angels", description: "", icon: Swords, tags: ["angels"] },
      { id: "dragons", title: "Dragons", description: "", icon: Swords, tags: ["dragons"] },
      { id: "soldiers", title: "Soldiers", description: "", icon: Swords, tags: ["soldiers"] },
      { id: "warriors", title: "Warriors", description: "", icon: Swords, tags: ["warriors"] },
      { id: "gods", title: "Gods", description: "", icon: Swords, tags: ["gods"] },
      { id: "heroes", title: "Heroes", description: "", icon: Swords, tags: ["heroes"] },
      { id: "samurai", title: "Samurai", description: "", icon: Swords, tags: ["samurai"] },
      { id: "paladins", title: "Paladins", description: "", icon: Swords, tags: ["paladins"] },
      { id: "legends", title: "Legends", description: "", icon: Swords, tags: ["legends"] },
      { id: "giants", title: "Giants", description: "", icon: Swords, tags: ["giants"] },
      { id: "titans", title: "Titans", description: "", icon: Swords, tags: ["titans"] },
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
      { id: "clowns", title: "Clowns & Performers", description: "", icon: Sparkles, tags: ["clowns"] },
      { id: "monkeys", title: "Monkeys", description: "", icon: Sparkles, tags: ["monkeys"] },
      { id: "unicorns", title: "Unicorns", description: "", icon: Sparkles, tags: ["unicorns"] },
      { id: "bear", title: "Bears", description: "", icon: Sparkles, tags: ["bear"] },
      { id: "oozes", title: "Oozes", description: "", icon: Sparkles, tags: ["oozes"] },
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
      { id: "shapeshifters", title: "Shapeshifters", description: "", icon: Castle, tags: ["shapeshifters"] },
      { id: "sphinxes", title: "Sphinxes", description: "", icon: Castle, tags: ["sphinxes"] },
      { id: "elementals", title: "Elementals", description: "", icon: Castle, tags: ["elementals"] },
      { id: "phoenixes", title: "Phoenixes", description: "", icon: Castle, tags: ["phoenixes"] },
      { id: "moonfolk", title: "Moonfolk", description: "", icon: Castle, tags: ["moonfolk"] },
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
      { id: "soldiers", title: "Soldiers", description: "", icon: Cog, tags: ["soldiers"] },
      { id: "warriors", title: "Warriors", description: "", icon: Cog, tags: ["warriors"] },
      { id: "spacecraft", title: "Spacecraft", description: "", icon: Cog, tags: ["spacecraft"] },
      { id: "human", title: "Humans", description: "", icon: Cog, tags: ["human"] },
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
      { id: "spiders", title: "Spiders", description: "", icon: Leaf, tags: ["spiders"] },
      { id: "wurms", title: "Wurms", description: "", icon: Leaf, tags: ["wurms"] },
      { id: "plants", title: "Plants & Fungi", description: "", icon: Leaf, tags: ["plants"] },
      { id: "insects", title: "Insects", description: "", icon: Leaf, tags: ["insects"] },
      { id: "snakes", title: "Snakes", description: "", icon: Leaf, tags: ["snakes"] },
      { id: "treefolk", title: "Treefolk", description: "", icon: Leaf, tags: ["treefolk"] },
    ],
  },
};
