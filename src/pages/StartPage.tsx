import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { interests } from "@/data/interest-mappings";
import { QuizPageLayout } from "@/components/QuizPageLayout";
import { trackInterestSelected } from "@/lib/analytics";
import { usePageTitle } from "@/hooks/usePageTitle";

const StartPage = () => {
  usePageTitle("What Are You Into?");
  const navigate = useNavigate();

  const handleInterestClick = (interestId: string) => {
    // Find the interest label for tracking
    const interest = interests.find(i => i.id === interestId);
    if (interest) {
      trackInterestSelected(interest.label);
    }
    navigate(`/start/${interestId}`);
  };

  // Split interests: first 8 for grid, 9th for banner
  const gridInterests = interests.slice(0, 8);
  const bannerInterest = interests[8]; // "Just Show Me Cool Stuff"

  return (
    <QuizPageLayout>
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Header Row with Back Button */}
        <div className="grid grid-cols-3 items-center mb-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div />
          <div />
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            What are you into?
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Magic probably has it. Seriously.
          </p>
        </div>

        {/* Interest Grid (First 8) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {gridInterests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => handleInterestClick(interest.id)}
              className="relative group overflow-hidden rounded-lg aspect-[3/2] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${interest.artUrl})`,
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold mb-1 text-left">
                  {interest.label}
                </h3>
                <p className="text-white/90 text-sm text-left">
                  {interest.subtext}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 transition-all duration-300 rounded-lg" />
            </button>
          ))}
        </div>

        {/* 9th Option - Full Width Banner */}
        {bannerInterest && (
          <button
            onClick={() => handleInterestClick(bannerInterest.id)}
            className="relative group overflow-hidden rounded-lg w-full aspect-[6/1] md:aspect-[8/1] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundImage: `url(${bannerInterest.artUrl})`,
              }}
            />

            {/* Gradient Overlay - More subtle for banner */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

            {/* Sparkle Accent */}
            <div className="absolute top-4 right-4 opacity-70 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-center">
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 text-left">
                ✨ {bannerInterest.label}
              </h3>
              <p className="text-white/90 text-base md:text-lg text-left">
                {bannerInterest.subtext}
              </p>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-yellow-400/0 group-hover:border-yellow-400/50 transition-all duration-300 rounded-lg" />
          </button>
        )}

        {/* Optional Search Box for Future Phase 2 */}
        {/* <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Or search:</p>
          <input
            type="text"
            placeholder="robots, hot girls, zombies..."
            className="px-6 py-3 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground max-w-md w-full"
          />
        </div> */}
      </div>
    </QuizPageLayout>
  );
};

export default StartPage;
