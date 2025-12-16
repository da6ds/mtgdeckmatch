import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { QuizPageLayout } from "@/components/QuizPageLayout";
import preconsData from "@/data/precons-data.json";
import cardArtUrls from "@/data/card-art-urls.json";
import { clearQuizState } from "@/utils/quizStateStorage";
import { usePageTitle } from "@/hooks/usePageTitle";

const PathSelection = () => {
  usePageTitle("Find Your Deck");
  const navigate = useNavigate();

  const handleMatchMe = () => {
    // Clear any previous quiz state before starting fresh
    clearQuizState();
    navigate("/vibes-questions?step=0");
  };

  const handleSurpriseMe = () => {
    // Navigate to random deck detail page with surprise param
    const random = preconsData[Math.floor(Math.random() * preconsData.length)];
    navigate(`/deck/${random.id}?from=surprise`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      <MainNav />

      <QuizPageLayout>
        <div className="space-y-8 w-full">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Find the Right Deck for You
            </h1>
          </div>

          {/* Two Image Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Match Me */}
            <button
              onClick={handleMatchMe}
              className="group relative overflow-hidden rounded-lg md:rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-card-hover hover:scale-105 w-full aspect-[3/2]"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${cardArtUrls.playPage.matchMe})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

              {/* Text Overlay */}
              <div className="relative z-10 h-full flex flex-col items-center justify-end p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                  Match Me
                </h3>
              </div>
            </button>

            {/* Surprise Me */}
            <button
              onClick={handleSurpriseMe}
              className="group relative overflow-hidden rounded-lg md:rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-card-hover hover:scale-105 w-full aspect-[3/2]"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${cardArtUrls.playPage.surpriseMe})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

              {/* Text Overlay */}
              <div className="relative z-10 h-full flex flex-col items-center justify-end p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                  Surprise Me
                </h3>
              </div>
            </button>
          </div>
        </div>
      </QuizPageLayout>
    </div>
  );
};

export default PathSelection;
