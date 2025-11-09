import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OptionCard } from "@/components/OptionCard";
import { vibesQuestions } from "@/data/vibes-questions";
import { ArrowLeft } from "lucide-react";
import { QuizAnswer } from "@/types/quiz";

const VibesQuestions = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const currentQuestion = vibesQuestions[currentQuestionIndex];
  const totalQuestions = 5; // Total questions in the flow

  const handleOptionSelect = (answerId: string) => {
    // Save answer
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answerId,
    };
    
    setAnswers([...answers, newAnswer]);

    // TODO: Move to next question or results
    console.log("Answer saved:", newAnswer);
    console.log("All answers:", [...answers, newAnswer]);
    
    // For now, just log - will implement navigation to next question later
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartOver}
          >
            Start Over
          </Button>
        </div>

        {/* Progress */}
        <ProgressIndicator 
          currentStep={currentQuestionIndex} 
          totalSteps={totalQuestions}
          onStepClick={handleStepClick}
        />

        {/* Question Content */}
        <div className="mt-8 space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {currentQuestion.question}
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the one that speaks to you most
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
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
        </div>
      </div>
    </div>
  );
};

export default VibesQuestions;
