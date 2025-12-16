import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OptionCard } from "@/components/OptionCard";
import { MultiSelectCreatureQuestion } from "@/components/MultiSelectCreatureQuestion";
import { forkQuestion, artQuestion, vibeQuestion, creatureTypeQuestions } from "@/data/vibes-questions";
import { Library, ArrowLeft } from "lucide-react";
import { QuizAnswer } from "@/types/quiz";
import cardArtUrls from "@/data/card-art-urls.json";
import { saveQuizState, loadQuizState, clearQuizState } from "@/utils/quizStateStorage";
import { cn } from "@/lib/utils";
import { trackQuizStarted, trackQuizQuestionAnswered, trackQuizCompleted } from "@/lib/analytics";
import { usePageTitle } from "@/hooks/usePageTitle";

const VibesQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get step from URL, with fallback to location.state, then 0
  const urlStep = parseInt(searchParams.get('step') || '0');

  // Initialize state from sessionStorage OR location.state OR URL params
  // Priority: location.state > sessionStorage > URL params/defaults
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    if (location.state?.fromResults) {
      return location.state.currentQuestionIndex || 0;
    }
    const saved = loadQuizState();
    return saved?.currentQuestionIndex ?? urlStep;
  });

  const [answers, setAnswers] = useState<QuizAnswer[]>(() => {
    if (location.state?.fromResults && location.state.answers) {
      return location.state.answers;
    }
    const saved = loadQuizState();
    return saved?.answers ?? [];
  });

  const [selectedPath, setSelectedPath] = useState<string | null>(() => {
    if (location.state?.fromResults && location.state.answers) {
      const pathAnswer = location.state.answers.find((a: { questionId: string }) => a.questionId === "fork");
      if (pathAnswer?.answerId) return pathAnswer.answerId as string;
    }
    const saved = loadQuizState();
    return saved?.selectedPath ?? null;
  });

  const [selectedArtStyle, setSelectedArtStyle] = useState<string | null>(() => {
    if (location.state?.fromResults && location.state.answers) {
      const artStyleAnswer = location.state.answers.find((a: { questionId: string }) => a.questionId === "art-style");
      if (artStyleAnswer?.answerId) return artStyleAnswer.answerId as string;
    }
    const saved = loadQuizState();
    return saved?.selectedArtStyle ?? null;
  });

  const [selectedVibe, setSelectedVibe] = useState<string | null>(() => {
    if (location.state?.fromResults && location.state.answers) {
      const vibeAnswer = location.state.answers.find((a: { questionId: string }) => a.questionId === "vibe");
      if (vibeAnswer?.answerId) return vibeAnswer.answerId as string;
    }
    const saved = loadQuizState();
    return saved?.selectedVibe ?? null;
  });

  // Track quiz_started only once when entering fresh (not from results)
  const hasTrackedStart = useRef(false);
  useEffect(() => {
    if (!hasTrackedStart.current && !location.state?.fromResults && currentQuestionIndex === 0) {
      trackQuizStarted("vibes");
      hasTrackedStart.current = true;
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    saveQuizState({
      currentQuestionIndex,
      answers,
      selectedPath,
      selectedArtStyle,
      selectedVibe
    });
  }, [currentQuestionIndex, answers, selectedPath, selectedArtStyle, selectedVibe]);

  // Sync state with URL params when browser back/forward is used
  useEffect(() => {
    // Only sync if not coming from results page (which has its own state restoration)
    if (!location.state?.fromResults) {
      const urlStep = parseInt(searchParams.get('step') || '0');
      if (urlStep !== currentQuestionIndex) {
        setCurrentQuestionIndex(urlStep);
        // Trim answers to match the step we're going back to
        setAnswers(prev => prev.slice(0, urlStep));

        // Reset state when going back past certain checkpoints
        if (urlStep === 0) {
          setSelectedPath(null);
          setSelectedVibe(null);
          setSelectedArtStyle(null);
        } else if (urlStep === 1) {
          setSelectedVibe(null);
          setSelectedArtStyle(null);
        }
      }
    }
  }, [searchParams]);

  // Dynamic total questions based on path
  const totalQuestions = selectedPath === "art" ? 2 : (selectedPath === "gameplay" ? 3 : 2);

  // Set page title with current step
  usePageTitle(`Quiz Step ${currentQuestionIndex + 1} of ${totalQuestions}`);

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
    // Track the answer
    trackQuizQuestionAnswered(currentQuestion!.id, answerId);

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
      // Quiz complete, clear saved state and navigate to loading screen
      clearQuizState();
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

  // Safety check: if state is invalid, reset to fork question
  if (!currentQuestion) {
    if (currentQuestionIndex !== 0) {
      console.warn('Invalid quiz state detected, resetting to step 0', {
        currentQuestionIndex,
        selectedPath,
        selectedVibe,
        urlStep
      });
      setCurrentQuestionIndex(0);
      setSearchParams({ step: '0' });
    }
    return null; // Will re-render with step 0
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted flex flex-col">
      <MainNav />

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col p-2 md:p-4 py-2 md:py-4">
        {/* Back Button + Progress on Same Line */}
        <div className="grid grid-cols-3 items-center mb-3 shrink-0">
          {/* Back Button - Left Column */}
          <div className="justify-self-start">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
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
            <div className={cn(
              "grid items-stretch mx-auto",
              currentQuestion.id === "fork"
                ? "grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl" // 2 cards: larger gap, smaller container
                : "grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl" // 6 cards: medium gap, larger container
            )}>
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
          {currentQuestion.type === "checkbox" && currentQuestion.options && selectedVibe && (
            <MultiSelectCreatureQuestion
              options={currentQuestion.options.map(opt => {
                // Get image URL from card-art-urls.json
                const imageUrl = (cardArtUrls.creatureTypeImages as any)?.[selectedVibe]?.[opt.id];
                return {
                  id: opt.id,
                  label: opt.title,
                  imageUrl: imageUrl
                };
              })}
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
