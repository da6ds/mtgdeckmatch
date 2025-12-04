import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OptionCard } from "@/components/OptionCard";
import { MultiSelectCreatureQuestion } from "@/components/MultiSelectCreatureQuestion";
import { vibeQuestion, creatureTypeQuestions } from "@/data/vibes-questions";
import { Library } from "lucide-react";
import { QuizAnswer } from "@/types/quiz";

const VibesQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get step from URL, with fallback to location.state, then 0
  const urlStep = parseInt(searchParams.get('step') || '0');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(urlStep);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

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

      // Restore vibe selection if it exists
      const vibeAnswer = restoredAnswers.find(a => a.questionId === "vibe");
      if (vibeAnswer && typeof vibeAnswer.answerId === "string") {
        setSelectedVibe(vibeAnswer.answerId);
      }
    }
  }, []);

  const totalQuestions = 2;

  // Get current question based on index and selected vibe
  const getCurrentQuestion = () => {
    if (currentQuestionIndex === 0) {
      return vibeQuestion;
    } else {
      // Question 2 is dynamic based on vibe
      return selectedVibe ? creatureTypeQuestions[selectedVibe] : null;
    }
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

    // If this was Question 1, save the vibe choice
    if (currentQuestionIndex === 0 && typeof answerId === "string") {
      setSelectedVibe(answerId);
    }

    // Move to next question or results
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextStep = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextStep);
      setSearchParams({ step: nextStep.toString() });
    } else {
      // Quiz complete, navigate to loading screen with answers and path type
      navigate("/loading", { state: { answers: newAnswers, path: "vibes" } });
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
        {/* Back Button */}
        <BackButton fallbackPath="/play" className="mb-4" />

        {/* Progress */}
        <div className="py-1 md:py-2 shrink-0">
          <ProgressIndicator
            currentStep={currentQuestionIndex}
            totalSteps={totalQuestions}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Question Content */}
        <div className="flex-1 flex flex-col justify-center space-y-3 animate-fade-in min-h-0">
          <div className="text-center space-y-1 shrink-0">
            <h2 className="text-base md:text-3xl font-bold text-foreground">
              {currentQuestion.question}
            </h2>
            {currentQuestion.type === "multiple-choice" && (
              <p className="text-muted-foreground text-xs md:text-base">
                Choose the one that speaks to you most
              </p>
            )}
            {currentQuestion.type === "checkbox" && (
              <p className="text-muted-foreground text-xs md:text-base">
                Select up to 3 creature types
              </p>
            )}
          </div>

          {/* Multiple Choice Options */}
          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-stretch max-w-4xl mx-auto">
              {currentQuestion.options.map((option) => (
                <OptionCard
                  key={option.id}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  onClick={() => handleOptionSelect(option.id)}
                />
              ))}
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
