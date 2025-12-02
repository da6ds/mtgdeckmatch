import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OptionCard } from "@/components/OptionCard";
import { powerQuestions } from "@/data/power-questions";
import { ArrowLeft, Library } from "lucide-react";
import { QuizAnswer } from "@/types/quiz";

const PowerQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  // Handle restoration from Results page back navigation
  useEffect(() => {
    if (location.state?.fromResults && location.state?.answers) {
      const restoredAnswers = location.state.answers as QuizAnswer[];
      setAnswers(restoredAnswers);
      setCurrentQuestionIndex(location.state.currentQuestionIndex || restoredAnswers.length);
    }
  }, []);

  const currentQuestion = powerQuestions[currentQuestionIndex];
  const totalQuestions = powerQuestions.length;

  const handleAnswer = (answerId: string | string[]) => {
    // Save answer
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answerId,
    };
    
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // Move to next question or results
    if (currentQuestionIndex < powerQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz complete, navigate to loading screen with answers and path type
      navigate("/loading", { state: { answers: newAnswers, path: "power" } });
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
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Remove last answer
      setAnswers(answers.slice(0, -1));
    } else {
      navigate("/path-selection");
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentQuestionIndex) {
      // Allow going back to previous questions
      setCurrentQuestionIndex(step);
      setAnswers(answers.slice(0, step));
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted p-2 md:p-4 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col py-2 md:py-4 md:pt-12">
        {/* Header */}
        <div className="flex items-center justify-between py-1 md:py-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-1 text-xs md:text-sm h-7 md:h-9"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/browse")}
              className="gap-1 text-xs md:text-sm h-7 md:h-9"
            >
              <Library className="w-3 h-3 md:w-4 md:h-4" />
              Browse
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartOver}
              className="text-xs md:text-sm h-7 md:h-9"
            >
              Start Over
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="py-2 md:py-3 shrink-0">
          <ProgressIndicator 
            currentStep={currentQuestionIndex} 
            totalSteps={totalQuestions}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Question Content */}
        <div className="flex-1 flex flex-col justify-center space-y-2 md:space-y-4 animate-fade-in min-h-0">
          <div className="text-center space-y-0.5 md:space-y-1 shrink-0">
            <h2 className="text-base md:text-3xl font-bold text-foreground">
              {currentQuestion.question}
            </h2>
            {currentQuestion.type === "multiple-choice" && (
              <p className="text-muted-foreground text-xs md:text-base">
                Choose your playstyle
              </p>
            )}
          </div>

          {/* Options Grid */}
          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-5xl mx-auto w-full items-stretch">
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
        </div>
      </div>
    </div>
  );
};

export default PowerQuestions;
