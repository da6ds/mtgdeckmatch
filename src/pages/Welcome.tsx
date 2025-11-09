import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
const Welcome = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-[48.4rem] w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-snug">
            Find your perfect deck for Magic: The Gathering
          </h1>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 border border-border/50 backdrop-blur-sm">
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            Want to play MTG but not sure where to start? We'll help you find a pre-built deck (a "precon") that matches your style, whatever that may be.
          </p>
          <p className="text-base md:text-lg text-muted-foreground mt-4">
            Then we'll show you where to buy your perfect deck at the best price.
          </p>
        </div>

        <Button variant="hero" size="lg" onClick={() => navigate("/path-selection")} className="text-lg px-12 py-6 h-auto rounded-xl">
          Let's Find Your Deck!
        </Button>

        
      </div>
    </div>;
};
export default Welcome;