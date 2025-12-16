import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OptionCard } from "@/components/OptionCard";
import { powerQuestions } from "@/data/power-questions";
import { Library, ArrowLeft } from "lucide-react";
import { QuizAnswer } from "@/types/quiz";
import { trackQuizStarted, trackQuizQuestionAnswered, trackQuizCompleted } from "@/lib/analytics";
import { usePageTitle } from "@/hooks/usePageTitle";

const PowerQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get step from URL, with fallback to location.state, then 0
  const urlStep = parseInt(searchParams.get('step') || '0');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(urlStep);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  // Track quiz_started only once when entering fresh (not from results)
  const hasTrackedStart = useRef(false);
  useEffect(() => {
    if (!hasTrackedStart.current && !location.state?.fromResults && currentQuestionIndex === 0) {
      trackQuizStarted("power");
      hasTrackedStart.current = true;
    }
  }, []);

  // Handle restoration from Results page back navigation or URL params
  useEffect(() => {
    if (location.state?.fromResults && location.state?.answers) {
      const restoredAnswers = location.state.answers as QuizAnswer[];
      setAnswers(restoredAnswers);
      const restoredStep = location.state.currentQuestionIndex || restoredAnswers.length;
      setCurrentQuestionIndex(restoredStep);
      setSearchParams({ step: restoredStep.toString() });
    }
  }, []);

  const currentQuestion = powerQuestions[currentQuestionIndex];
  const totalQuestions = powerQuestions.length;

  // Set page title with current step
  usePageTitle(`Quiz Step ${currentQuestionIndex + 1} of ${totalQuestions}`);

  const handleAnswer = (answerId: string | string[]) => {
    // Track the answer
    trackQuizQuestionAnswered(currentQuestion.id, answerId);

    // Save answer
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answerId,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // Move to next question or results
    if (currentQuestionIndex < powerQuestions.length - 1) {
      const nextStep = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextStep);
      setSearchParams({ step: nextStep.toString() });
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
    }
  };

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
          </div>

          {/* Options Grid */}
          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto w-full items-stretch">
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
