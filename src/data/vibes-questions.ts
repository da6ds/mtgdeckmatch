import { Heart, Skull, Sparkles, PartyPopper, Sword, Trees } from "lucide-react";

export const vibesQuestions = [
  {
    id: "vibe",
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
  },
];
