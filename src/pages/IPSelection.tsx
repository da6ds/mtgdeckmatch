import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowLeft } from "lucide-react";

const IPSelection = () => {
  const navigate = useNavigate();

  const ips = [
    { id: "walking_dead", emoji: "🧟", name: "Walking Dead", tagline: "Zombies & Survival" },
    { id: "stranger_things", emoji: "👾", name: "Stranger Things", tagline: "80s Sci-Fi Horror" },
    { id: "transformers", emoji: "🤖", name: "Transformers", tagline: "Robots in Disguise" },
    { id: "street_fighter", emoji: "🥋", name: "Street Fighter", tagline: "Martial Arts" },
    { id: "fortnite", emoji: "🎮", name: "Fortnite", tagline: "Battle Royale" },
    { id: "jurassic_world", emoji: "🦖", name: "Jurassic World", tagline: "Dinosaurs" },
    { id: "doctor_who", emoji: "🚀", name: "Doctor Who", tagline: "Time Travel" },
    { id: "warhammer_40k", emoji: "⚔️", name: "Warhammer 40K", tagline: "Grimdark Future" },
    { id: "lord_of_the_rings", emoji: "🧙", name: "Lord of the Rings", tagline: "Epic Fantasy" },
    { id: "final_fantasy", emoji: "🎮", name: "Final Fantasy", tagline: "JRPG Adventure" },
    { id: "fallout", emoji: "☢️", name: "Fallout", tagline: "Post-Apocalyptic" },
    { id: "godzilla", emoji: "🦎", name: "Godzilla", tagline: "Monster Movies" },
    { id: "monty_python", emoji: "🎭", name: "Monty Python", tagline: "Comedy Chaos" },
    { id: "princess_bride", emoji: "⚔️", name: "Princess Bride", tagline: "True Love & Revenge" },
    { id: "magic_original", emoji: "✨", name: "Magic Original", tagline: "Classic MTG" },
  ];

  const handleIPSelect = (ipId: string) => {
    navigate("/loading", {
      state: {
        answers: [],
        path: "pop_culture",
        selectedIP: ipId
      }
    });
  };

  const handleSkip = () => {
    navigate("/loading", {
      state: {
        answers: [],
        path: "pop_culture",
        selectedIP: "magic_original"
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="pt-[15vh] md:pt-[10vh]">
        <div className="max-w-[1000px] mx-auto px-6">
          
          {/* Header */}
          <div className="flex items-center justify-between py-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/path-selection")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
            >
              Start Over
            </Button>
          </div>

          {/* Progress */}
          <div className="mb-10">
            <ProgressIndicator 
              currentStep={1} 
              totalSteps={3}
              onStepClick={(step) => console.log("Step clicked:", step)}
            />
          </div>

          {/* Title & Subtitle */}
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-4xl md:text-5xl font-bold">
              Which universe calls to you?
            </h2>
            <p className="text-muted-foreground text-lg">
              Pick a world you love
            </p>
          </div>

          {/* IP Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ips.map((ip) => (
              <button
                key={ip.id}
                onClick={() => handleIPSelect(ip.id)}
                className="group relative bg-gradient-to-br from-card to-card/80 rounded-xl p-6 border-2 border-border hover:border-primary transition-all duration-200 hover:shadow-lg hover:scale-105 text-center"
              >
                <div className="space-y-2">
                  {/* Emoji Icon */}
                  <div className="text-4xl mb-2">{ip.emoji}</div>
                  
                  {/* IP Name */}
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {ip.name}
                  </h3>
                  
                  {/* Tagline */}
                  <p className="text-xs text-muted-foreground">
                    {ip.tagline}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Skip Button */}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip this question →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPSelection;
