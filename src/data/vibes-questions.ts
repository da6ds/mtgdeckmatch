import { Heart, Skull, Sparkles, PartyPopper, Sword, Trees } from "lucide-react";

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
      id: "cute",
      title: "Cute & Cuddly",
      description: "Puppies, bunnies, and friendship",
      icon: Heart,
      tags: ["cute", "cuddly", "playful", "wholesome"],
    },
    {
      id: "creepy",
      title: "Creepy & Dark",
      description: "Zombies, vampires, and nightmares",
      icon: Skull,
      tags: ["creepy", "dark", "horror", "spooky"],
    },
    {
      id: "whimsical",
      title: "Whimsical & Magical",
      description: "Faeries, wizards, and wonder",
      icon: Sparkles,
      tags: ["whimsical", "magical", "enchanting", "mysterious"],
    },
    {
      id: "chaotic",
      title: "Chaotic & Funny",
      description: "Goblins doing goblin things",
      icon: PartyPopper,
      tags: ["chaotic", "funny", "random", "silly"],
    },
    {
      id: "epic",
      title: "Epic & Heroic",
      description: "Knights, angels, and legends",
      icon: Sword,
      tags: ["epic", "heroic", "legendary", "noble"],
    },
    {
      id: "nature",
      title: "Nature & Primal",
      description: "Dinosaurs, beasts, and the wild",
      icon: Trees,
      tags: ["nature", "primal", "wild", "forest"],
    },
  ],
};

// Question 2: Dynamic based on vibe choice
export const creatureTypeQuestions: Record<string, Question> = {
  cute: {
    id: "creature-types",
    type: "text-input",
    question: "What kind of cute are you into?",
    placeholder: "e.g., squirrels, rabbits, dogs...",
    quickSelects: [
      "Squirrels (hoarding nuts and causing chaos)",
      "Rabbits (fuzzy friends who buff each other)",
      "Dogs (loyal companions with equipment)",
      "Cats (sneaky and independent)",
      "Otters (playful water friends)",
      "Skip this question",
    ],
  },
  creepy: {
    id: "creature-types",
    type: "text-input",
    question: "What scares you... in a fun way?",
    placeholder: "e.g., vampires, zombies, demons...",
    quickSelects: [
      "Vampires (elegant bloodsuckers)",
      "Zombies (undead hordes)",
      "Demons (powerful evil beings)",
      "Ghosts & Spirits (haunting the battlefield)",
      "Eldrazi (alien cosmic horrors)",
      "Skip this question",
    ],
  },
  whimsical: {
    id: "creature-types",
    type: "text-input",
    question: "What kind of magic speaks to you?",
    placeholder: "e.g., faeries, wizards, dragons...",
    quickSelects: [
      "Faeries (tricky flying creatures)",
      "Wizards (spell-slinging masters)",
      "Dragons (majestic flying beasts)",
      "Merfolk (underwater mystics)",
      "Shapeshifters (creatures that transform)",
      "Skip this question",
    ],
  },
  chaotic: {
    id: "creature-types",
    type: "text-input",
    question: "What kind of chaos do you want to cause?",
    placeholder: "e.g., goblins, pirates...",
    quickSelects: [
      "Goblins (unpredictable mayhem)",
      "Pirates (stealing and treasure)",
      "Random effects (coin flips and surprises)",
      "Pranks (mess with opponents' plans)",
      "Silly win conditions (weird ways to win)",
      "Skip this question",
    ],
  },
  epic: {
    id: "creature-types",
    type: "text-input",
    question: "What's your hero style?",
    placeholder: "e.g., knights, angels, soldiers...",
    quickSelects: [
      "Knights (armored warriors)",
      "Angels (divine protectors)",
      "Soldiers (organized armies)",
      "Legendary Heroes (named champions)",
      "Gods (powerful beings)",
      "Skip this question",
    ],
  },
  nature: {
    id: "creature-types",
    type: "text-input",
    question: "What wild creature calls to you?",
    placeholder: "e.g., dinosaurs, elves, beasts...",
    quickSelects: [
      "Dinosaurs (prehistoric powerhouses)",
      "Elves (forest dwellers)",
      "Beasts (wild animals)",
      "Plants (living vegetation)",
      "Insects (creepy crawlies with power)",
      "Skip this question",
    ],
  },
};
