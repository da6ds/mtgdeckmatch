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
      description: "Puppies, plushies, and warm fuzzy feelings",
      icon: Heart,
      tags: ["cute", "cuddly", "playful", "wholesome"],
    },
    {
      id: "creepy",
      title: "Creepy & Dark",
      description: "Horror movies, Halloween, and things that go bump in the night",
      icon: Skull,
      tags: ["creepy", "dark", "horror", "spooky"],
    },
    {
      id: "whimsical",
      title: "Whimsical & Magical",
      description: "Fairy tales, Play-Doh creativity, and sparkly wonder",
      icon: Sparkles,
      tags: ["whimsical", "magical", "enchanting", "mysterious"],
    },
    {
      id: "chaotic",
      title: "Chaotic & Funny",
      description: "Pranks, mischief, and controlled chaos",
      icon: PartyPopper,
      tags: ["chaotic", "funny", "random", "silly"],
    },
    {
      id: "epic",
      title: "Epic & Heroic",
      description: "Superheroes, epic battles, and saving the day",
      icon: Sword,
      tags: ["epic", "heroic", "legendary", "noble"],
    },
    {
      id: "nature",
      title: "Nature & Primal",
      description: "Jurassic Park, wilderness, and raw power",
      icon: Trees,
      tags: ["nature", "primal", "wild", "forest"],
    },
  ],
};

// Question 2: Dynamic based on vibe choice - Multiple select with 12 options
export const creatureTypeQuestions: Record<string, Question> = {
  cute: {
    id: "creature-types",
    type: "checkbox",
    question: "What kind of cute are you into?",
    options: [
      { id: "squirrels", title: "Squirrels", description: "", icon: Heart, tags: ["squirrels"] },
      { id: "rabbits", title: "Rabbits", description: "", icon: Heart, tags: ["rabbits"] },
      { id: "dogs", title: "Dogs", description: "", icon: Heart, tags: ["dogs"] },
      { id: "cats", title: "Cats", description: "", icon: Heart, tags: ["cats"] },
      { id: "otters", title: "Otters", description: "", icon: Heart, tags: ["otters"] },
      { id: "bears", title: "Bears", description: "", icon: Heart, tags: ["bears"] },
      { id: "mice", title: "Mice", description: "", icon: Heart, tags: ["mice"] },
      { id: "foxes", title: "Foxes", description: "", icon: Heart, tags: ["foxes"] },
      { id: "hedgehogs", title: "Hedgehogs", description: "", icon: Heart, tags: ["hedgehogs"] },
      { id: "beavers", title: "Beavers", description: "", icon: Heart, tags: ["beavers"] },
      { id: "sloths", title: "Sloths", description: "", icon: Heart, tags: ["sloths"] },
      { id: "raccoons", title: "Raccoons", description: "", icon: Heart, tags: ["raccoons"] },
    ],
  },
  creepy: {
    id: "creature-types",
    type: "checkbox",
    question: "What scares you... in a fun way?",
    options: [
      { id: "vampires", title: "Vampires", description: "", icon: Skull, tags: ["vampires"] },
      { id: "zombies", title: "Zombies", description: "", icon: Skull, tags: ["zombies"] },
      { id: "demons", title: "Demons", description: "", icon: Skull, tags: ["demons"] },
      { id: "spirits", title: "Spirits & Ghosts", description: "", icon: Skull, tags: ["spirits"] },
      { id: "rats", title: "Rats", description: "", icon: Skull, tags: ["rats"] },
      { id: "spiders", title: "Spiders", description: "", icon: Skull, tags: ["spiders"] },
      { id: "skeletons", title: "Skeletons", description: "", icon: Skull, tags: ["skeletons"] },
      { id: "horrors", title: "Horrors", description: "", icon: Skull, tags: ["horrors"] },
      { id: "bats", title: "Bats", description: "", icon: Skull, tags: ["bats"] },
      { id: "werewolves", title: "Werewolves", description: "", icon: Skull, tags: ["werewolves"] },
      { id: "nightmares", title: "Nightmares", description: "", icon: Skull, tags: ["nightmares"] },
      { id: "eldrazi", title: "Eldrazi", description: "", icon: Skull, tags: ["eldrazi"] },
    ],
  },
  whimsical: {
    id: "creature-types",
    type: "checkbox",
    question: "What kind of magic speaks to you?",
    options: [
      { id: "faeries", title: "Faeries", description: "", icon: Sparkles, tags: ["faeries"] },
      { id: "wizards", title: "Wizards", description: "", icon: Sparkles, tags: ["wizards"] },
      { id: "merfolk", title: "Merfolk", description: "", icon: Sparkles, tags: ["merfolk"] },
      { id: "shapeshifters", title: "Shapeshifters", description: "", icon: Sparkles, tags: ["shapeshifters"] },
      { id: "sphinxes", title: "Sphinxes", description: "", icon: Sparkles, tags: ["sphinxes"] },
      { id: "angels", title: "Angels", description: "", icon: Sparkles, tags: ["angels"] },
      { id: "unicorns", title: "Unicorns", description: "", icon: Sparkles, tags: ["unicorns"] },
      { id: "moonfolk", title: "Moonfolk", description: "", icon: Sparkles, tags: ["moonfolk"] },
      { id: "elementals", title: "Elementals", description: "", icon: Sparkles, tags: ["elementals"] },
      { id: "spirits", title: "Spirits", description: "", icon: Sparkles, tags: ["spirits"] },
      { id: "phoenixes", title: "Phoenixes", description: "", icon: Sparkles, tags: ["phoenixes"] },
      { id: "dragons", title: "Dragons", description: "", icon: Sparkles, tags: ["dragons"] },
    ],
  },
  chaotic: {
    id: "creature-types",
    type: "checkbox",
    question: "What kind of chaos do you want to cause?",
    options: [
      { id: "goblins", title: "Goblins", description: "", icon: PartyPopper, tags: ["goblins"] },
      { id: "pirates", title: "Pirates", description: "", icon: PartyPopper, tags: ["pirates"] },
      { id: "clowns", title: "Clowns & Performers", description: "", icon: PartyPopper, tags: ["clowns"] },
      { id: "oozes", title: "Oozes", description: "", icon: PartyPopper, tags: ["oozes"] },
      { id: "atogs", title: "Atogs", description: "", icon: PartyPopper, tags: ["atogs"] },
      { id: "kobolds", title: "Kobolds", description: "", icon: PartyPopper, tags: ["kobolds"] },
      { id: "gremlins", title: "Gremlins", description: "", icon: PartyPopper, tags: ["gremlins"] },
      { id: "imps", title: "Imps", description: "", icon: PartyPopper, tags: ["imps"] },
      { id: "monkeys", title: "Monkeys", description: "", icon: PartyPopper, tags: ["monkeys"] },
      { id: "weird", title: "Weird Creatures", description: "", icon: PartyPopper, tags: ["weird"] },
      { id: "mutants", title: "Mutants", description: "", icon: PartyPopper, tags: ["mutants"] },
      { id: "chaos", title: "Chaos & Random", description: "", icon: PartyPopper, tags: ["chaos"] },
    ],
  },
  epic: {
    id: "creature-types",
    type: "checkbox",
    question: "What's your hero style?",
    options: [
      { id: "knights", title: "Knights", description: "", icon: Sword, tags: ["knights"] },
      { id: "angels", title: "Angels", description: "", icon: Sword, tags: ["angels"] },
      { id: "dragons", title: "Dragons", description: "", icon: Sword, tags: ["dragons"] },
      { id: "soldiers", title: "Soldiers", description: "", icon: Sword, tags: ["soldiers"] },
      { id: "warriors", title: "Warriors", description: "", icon: Sword, tags: ["warriors"] },
      { id: "gods", title: "Gods", description: "", icon: Sword, tags: ["gods"] },
      { id: "heroes", title: "Heroes", description: "", icon: Sword, tags: ["heroes"] },
      { id: "samurai", title: "Samurai", description: "", icon: Sword, tags: ["samurai"] },
      { id: "paladins", title: "Paladins", description: "", icon: Sword, tags: ["paladins"] },
      { id: "legends", title: "Legends", description: "", icon: Sword, tags: ["legends"] },
      { id: "giants", title: "Giants", description: "", icon: Sword, tags: ["giants"] },
      { id: "titans", title: "Titans", description: "", icon: Sword, tags: ["titans"] },
    ],
  },
  nature: {
    id: "creature-types",
    type: "checkbox",
    question: "What wild creature calls to you?",
    options: [
      { id: "dinosaurs", title: "Dinosaurs", description: "", icon: Trees, tags: ["dinosaurs"] },
      { id: "werewolves", title: "Werewolves", description: "", icon: Trees, tags: ["werewolves"] },
      { id: "elves", title: "Elves", description: "", icon: Trees, tags: ["elves"] },
      { id: "hydras", title: "Hydras", description: "", icon: Trees, tags: ["hydras"] },
      { id: "spiders", title: "Spiders", description: "", icon: Trees, tags: ["spiders"] },
      { id: "beasts", title: "Beasts", description: "", icon: Trees, tags: ["beasts"] },
      { id: "wurms", title: "Wurms", description: "", icon: Trees, tags: ["wurms"] },
      { id: "plants", title: "Plants & Fungi", description: "", icon: Trees, tags: ["plants"] },
      { id: "insects", title: "Insects", description: "", icon: Trees, tags: ["insects"] },
      { id: "snakes", title: "Snakes", description: "", icon: Trees, tags: ["snakes"] },
      { id: "elementals", title: "Elementals", description: "", icon: Trees, tags: ["elementals"] },
      { id: "treefolk", title: "Treefolk", description: "", icon: Trees, tags: ["treefolk"] },
    ],
  },
};
