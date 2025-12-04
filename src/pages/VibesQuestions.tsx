import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OptionCard } from "@/components/OptionCard";
import { MultiSelectCreatureQuestion } from "@/components/MultiSelectCreatureQuestion";
import { forkQuestion, artQuestion, vibeQuestion, creatureTypeQuestions } from "@/data/vibes-questions";
import { Library } from "lucide-react";
import { QuizAnswer } from "@/types/quiz";
import cardArtUrls from "@/data/card-art-urls.json";

const VibesQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get step from URL, with fallback to location.state, then 0
  const urlStep = parseInt(searchParams.get('step') || '0');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(urlStep);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null); // "art" or "gameplay"
  const [selectedArtStyle, setSelectedArtStyle] = useState<string | null>(null); // Art path choice
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null); // Gameplay path choice

  // Sync state with URL params (for browser back/forward button)
  useEffect(() => {
    setCurrentQuestionIndex(urlStep);
  }, [urlStep]);

  // Handle restoration from Results page back navigation or URL params
  useEffect(() => {
    if (location.state?.fromResults && location.state?.answers) {
      const restoredAnswers = location.state.answers as QuizAnswer[];
      setAnswers(restoredAnswers);
      const restoredStep = location.state.currentQuestionIndex || restoredAnswers.length;
      setCurrentQuestionIndex(restoredStep);
      setSearchParams({ step: restoredStep.toString() });

      // Restore path selection if it exists
      const pathAnswer = restoredAnswers.find(a => a.questionId === "fork");
      if (pathAnswer && typeof pathAnswer.answerId === "string") {
        setSelectedPath(pathAnswer.answerId);
      }

      // Restore art style selection if it exists (art path only)
      const artStyleAnswer = restoredAnswers.find(a => a.questionId === "art-style");
      if (artStyleAnswer && typeof artStyleAnswer.answerId === "string") {
        setSelectedArtStyle(artStyleAnswer.answerId);
      }

      // Restore vibe selection if it exists (gameplay path only)
      const vibeAnswer = restoredAnswers.find(a => a.questionId === "vibe");
      if (vibeAnswer && typeof vibeAnswer.answerId === "string") {
        setSelectedVibe(vibeAnswer.answerId);
      }
    }
  }, []);

  // Dynamic total questions based on path
  const totalQuestions = selectedPath === "art" ? 2 : (selectedPath === "gameplay" ? 3 : 2);

  // Get current question based on index and selected path
  const getCurrentQuestion = () => {
    if (currentQuestionIndex === 0) {
      // Step 0: Fork question (Art vs Gameplay)
      return forkQuestion;
    } else if (currentQuestionIndex === 1) {
      // Step 1: Path-specific questions
      if (selectedPath === "gameplay") {
        return vibeQuestion;
      } else if (selectedPath === "art") {
        return artQuestion;
      }
    } else if (currentQuestionIndex === 2 && selectedPath === "gameplay") {
      // Step 2: Creature types (gameplay path only)
      return selectedVibe ? creatureTypeQuestions[selectedVibe] : null;
    }
    return null;
  };

  const currentQuestion = getCurrentQuestion();

  const handleAnswer = (answerId: string | string[]) => {
    // Save answer
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion!.id,
      answerId,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // If this was the fork question (step 0), save the path choice
    if (currentQuestionIndex === 0 && typeof answerId === "string") {
      setSelectedPath(answerId); // "art" or "gameplay"
    }

    // If this was the art style question (step 1 in art path), save the art style choice
    if (currentQuestionIndex === 1 && selectedPath === "art" && typeof answerId === "string") {
      setSelectedArtStyle(answerId);
    }

    // If this was the vibes question (step 1 in gameplay path), save the vibe choice
    if (currentQuestionIndex === 1 && selectedPath === "gameplay" && typeof answerId === "string") {
      setSelectedVibe(answerId);
    }

    // Move to next question or results
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextStep = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextStep);
      setSearchParams({ step: nextStep.toString() });
    } else {
      // Quiz complete, navigate to loading screen with answers and path type
      const pathType = selectedPath === "art" ? "art" : "vibes";
      navigate("/loading", {
        state: {
          answers: newAnswers,
          path: pathType,
          artStyle: selectedArtStyle // Pass art style if art path
        }
      });
    }
  };

  const handleOptionSelect = (answerId: string) => {
    handleAnswer(answerId);
  };

  const handleStartOver = () => {
    navigate("/");
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const prevStep = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevStep);
      setSearchParams({ step: prevStep.toString() });
      // Remove last answer
      setAnswers(answers.slice(0, -1));
    } else {
      navigate("/play");
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentQuestionIndex) {
      // Allow going back to previous questions
      setCurrentQuestionIndex(step);
      setSearchParams({ step: step.toString() });
      setAnswers(answers.slice(0, step));
      // Reset vibe selection if going back to Q1
      if (step === 0) {
        setSelectedVibe(null);
      }
    }
  };

  if (!currentQuestion) {
    return null; // Safety check
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted flex flex-col">
      <MainNav />

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col p-2 md:p-4 py-2 md:py-4">
        {/* Back Button + Progress on Same Line */}
        <div className="grid grid-cols-3 items-center mb-3 shrink-0">
          {/* Back Button - Left Column */}
          <div className="justify-self-start">
            <BackButton fallbackPath="/play" />
          </div>

          {/* Progress Dots - Center Column */}
          <div className="justify-self-center">
            <ProgressIndicator
              currentStep={currentQuestionIndex}
              totalSteps={totalQuestions}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Empty Space - Right Column */}
          <div />
        </div>

        {/* Question Content */}
        <div className="flex-1 flex flex-col justify-center space-y-3 animate-fade-in min-h-0">
          <div className="text-center space-y-1 shrink-0">
            <h2 className="text-base md:text-3xl font-bold text-foreground">
              {currentQuestion.question}
            </h2>
            {currentQuestion.type === "checkbox" && (
              <p className="text-muted-foreground text-xs md:text-base">
                Select up to 3 creature types
              </p>
            )}
          </div>

          {/* Multiple Choice Options */}
          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <div className={`grid gap-3 items-stretch max-w-4xl mx-auto ${
              currentQuestion.id === "fork"
                ? "grid-cols-1 md:grid-cols-2" // Fork question: 2 columns
                : "grid-cols-2 md:grid-cols-3" // Vibes/Art question: 3 columns (2x3 grid)
            }`}>
              {currentQuestion.options.map((option) => {
                // Get image URL based on question type
                let imageUrl;
                if (currentQuestion.id === "fork") {
                  // Fork question: art vs gameplay path
                  if (option.id === "art") {
                    imageUrl = cardArtUrls.forkQuestion.artPath;
                  } else if (option.id === "gameplay") {
                    imageUrl = cardArtUrls.forkQuestion.gameplayPath;
                  }
                } else if (currentQuestion.id === "vibe") {
                  // Gameplay styles (new gameplay options)
                  imageUrl = cardArtUrls.gameplayStyles[option.id as keyof typeof cardArtUrls.gameplayStyles];
                } else if (currentQuestion.id === "art-style") {
                  imageUrl = cardArtUrls.artStyles[option.id as keyof typeof cardArtUrls.artStyles];
                }

                return (
                  <OptionCard
                    key={option.id}
                    title={option.title}
                    description={option.description}
                    icon={option.icon}
                    imageUrl={imageUrl}
                    onClick={() => handleOptionSelect(option.id)}
                  />
                );
              })}
            </div>
          )}

          {/* Multi-Select Creature Question */}
          {currentQuestion.type === "checkbox" && currentQuestion.options && (
            <MultiSelectCreatureQuestion
              options={currentQuestion.options.map(opt => ({
                id: opt.id,
                label: opt.title
              }))}
              onSubmit={handleAnswer}
              maxSelections={3}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VibesQuestions;
