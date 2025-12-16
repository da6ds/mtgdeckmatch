import { Sword, Shield, Zap, TrendingUp, Target, Brain, Users, Skull, Cog, Mountain, BookOpen, type LucideIcon } from "lucide-react";

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
  type: "multiple-choice";
  options?: QuestionOption[];
}

export const powerQuestions: Question[] = [
  {
    id: "archetype",
    type: "multiple-choice",
    question: "How do you want to win?",
    options: [
      {
        id: "go-fast",
        title: "Go Fast",
        description: "Attack hard and win quickly",
        icon: Zap,
        tags: ["aggro", "aggressive", "fast"],
      },
      {
        id: "take-control",
        title: "Take Control",
        description: "Stop their plans, execute yours",
        icon: Shield,
        tags: ["control", "combo", "controlling"],
      },
      {
        id: "play-long-game",
        title: "Play the Long Game",
        description: "Build value, grind them out",
        icon: TrendingUp,
        tags: ["midrange", "value", "tribal", "political", "ramp"],
      },
    ],
  },
  {
    id: "difficulty",
    type: "multiple-choice",
    question: "How complex do you want it?",
    options: [
      {
        id: "easy",
        title: "Easy to Learn",
        description: "Straightforward and beginner-friendly",
        icon: Shield,
        tags: ["beginner", "simple", "easy"],
      },
      {
        id: "medium",
        title: "Some Strategy",
        description: "Rewarding decisions without overwhelming",
        icon: Target,
        tags: ["moderate", "medium"],
      },
      {
        id: "complex",
        title: "Complex & Rewarding",
        description: "Deep strategy for experienced players",
        icon: Brain,
        tags: ["complex", "high", "very high"],
      },
    ],
  },
  {
    id: "theme",
    type: "multiple-choice",
    question: "What do you want to build around?",
    options: [
      {
        id: "swarm",
        title: "Swarm the Board",
        description: "Overwhelm with tokens and creatures",
        icon: Users,
        tags: ["tokens", "tribal"],
      },
      {
        id: "death-sacrifice",
        title: "Death & Sacrifice",
        description: "Turn death into advantage",
        icon: Skull,
        tags: ["sacrifice", "graveyard", "aristocrats"],
      },
      {
        id: "artifacts",
        title: "Artifacts & Machines",
        description: "Build a value engine",
        icon: Cog,
        tags: ["artifacts", "equipment"],
      },
      {
        id: "grow",
        title: "Grow & Dominate",
        description: "Make your creatures huge",
        icon: TrendingUp,
        tags: ["+1/+1 counters", "voltron"],
      },
      {
        id: "ramp",
        title: "Ramp & Big Stuff",
        description: "Play the biggest threats first",
        icon: Mountain,
        tags: ["ramp", "midrange"],
      },
      {
        id: "spells",
        title: "Spells & Control",
        description: "Outthink and outvalue",
        icon: BookOpen,
        tags: ["card draw", "control", "combo"],
      },
    ],
  },
];
