import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { vibeQuestion, creatureTypeQuestions } from "@/data/vibes-questions";
import { IP_NAMES } from "@/constants/ipConstants";
import { usePageTitle } from "@/hooks/usePageTitle";

const LoadingScreen = () => {
  usePageTitle("Finding Your Matches...");
  const navigate = useNavigate();
  const location = useLocation();
  const { answers = [], path = "vibes", selectedIP } = location.state || {};
  const pathType = path;
  const [interpretation, setInterpretation] = useState("");
  const [customText, setCustomText] = useState("");
  const [isCustomInput, setIsCustomInput] = useState(false);

  useEffect(() => {
    // Detect if user entered custom text
    let detectedCustomText = "";
    let hasCustomInput = false;

    if (pathType === "pop_culture" && selectedIP) {
      // Pop culture path - use IP name
      hasCustomInput = false;
      detectedCustomText = "";
    } else if (pathType === "vibes") {
      const creatureAnswer = answers.find((a: { questionId: string }) => a.questionId === "creature-types");
      if (creatureAnswer) {
        const vibeAnswer = answers.find((a: { questionId: string }) => a.questionId === "vibe");
        const selectedVibe = vibeAnswer?.answerId;
        const creatureQuestion = selectedVibe ? creatureTypeQuestions[selectedVibe] : null;
        
        if (creatureQuestion?.quickSelects) {
          const isQuickSelect = creatureQuestion.quickSelects.some(
            (qs: string) => qs === creatureAnswer.answerId
          );
          
          if (!isQuickSelect && creatureAnswer.answerId !== "Skip this question") {
            hasCustomInput = true;
            detectedCustomText = creatureAnswer.answerId as string;
          }
        }
      }
    }

    setCustomText(detectedCustomText);
    setIsCustomInput(hasCustomInput);

    // Generate interpretation for custom text or IP
    const generateInterpretation = async () => {
      if (pathType === "pop_culture" && selectedIP) {
        const ipName = IP_NAMES[selectedIP] || selectedIP;
        setInterpretation(`Finding the best ${ipName} decks...`);
      } else if (hasCustomInput && detectedCustomText) {
        try {
          const { data } = await supabase.functions.invoke('generate-loading-interpretation', {
            body: { customText: detectedCustomText }
          });

          if (data?.interpretation) {
            setInterpretation(data.interpretation);
          }
        } catch (err) {
          console.error('Failed to generate interpretation:', err);
        }
      }
    };

    generateInterpretation();

    // Navigate to results after 2 seconds
    const timer = setTimeout(() => {
      navigate("/results", {
        state: {
          answers,
          path: pathType,
          customText: detectedCustomText,
          isCustomInput: hasCustomInput,
          selectedIP
        },
        replace: true  // Replace loading screen in history to prevent back button loop
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="text-6xl mb-4">🔍</div>
        
        {pathType === "pop_culture" && selectedIP ? (
          <>
            <h2 className="text-2xl font-bold text-foreground">
              Searching for...
            </h2>
            {interpretation && (
              <p className="text-lg text-muted-foreground">
                {interpretation}
              </p>
            )}
          </>
        ) : isCustomInput && customText ? (
          <>
            <h2 className="text-2xl font-bold text-foreground">
              Searching for...
            </h2>
            <p className="text-xl text-primary font-semibold italic">
              "{customText}"
            </p>
            {interpretation && (
              <p className="text-lg text-muted-foreground">
                {interpretation}
              </p>
            )}
          </>
        ) : (
          <h2 className="text-2xl font-bold text-foreground">
            Finding your perfect deck...
          </h2>
        )}

        <div className="flex justify-center pt-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
