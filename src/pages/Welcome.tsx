import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary mb-4 animate-pulse">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
            Find your perfect deck for Magic: The Gathering
          </h1>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 border border-border/50 backdrop-blur-sm">
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            Want to play MTG but not sure where to start? We'll help you find a pre-built deck (a "precon") that matches your style, whatever that may be.
          </p>
          <p className="text-base md:text-lg text-muted-foreground mt-4">
            <span className="text-accent font-semibold">No need to buy hundreds of cards</span> - these ready-to-play decks have everything you need!
          </p>
        </div>

        <Button 
          variant="hero"
          size="lg"
          onClick={() => navigate("/path-selection")}
          className="text-lg px-12 py-6 h-auto rounded-xl"
        >
          Let's Find Your Deck!
        </Button>

        <p className="text-sm text-muted-foreground">
          Takes less than 2 minutes • No account needed
        </p>
      </div>
    </div>
  );
};

export default Welcome;
