export type PathType = "vibes" | "power";

export interface VibeOption {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface QuizAnswer {
  questionId: string;
  answerId: string;
}

export interface QuizState {
  path: PathType | null;
  answers: QuizAnswer[];
  currentQuestion: number;
}
