import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { parseCustomInput } from "@/utils/customInputParser";
import preconsData from "@/data/precons-data.json";
const Welcome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    
    // Parse the search query and get matches
    const parsedPreferences = parseCustomInput(query);
    
    // Navigate to results with search state
    navigate("/loading", {
      state: {
        source: 'search',
        path: 'vibes',
        searchQuery: query,
        customText: query,
        isCustomInput: true,
        answers: []
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-start">
          <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate("/path-selection")} 
              className="text-lg px-12 py-6 h-auto rounded-xl w-full sm:w-auto"
            >
              Let's Find Your Deck!
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/results", { 
                state: { 
                  source: 'surprise',
                  path: 'pop_culture'
                } 
              })} 
              className="text-lg px-12 py-6 h-auto rounded-xl border-2 hover:bg-primary/10 hover:scale-105 transition-transform w-full sm:w-auto"
            >
              🎲 Surprise Me!
            </Button>
            <p className="text-sm text-muted-foreground mt-1">
              Random decks from movies, TV & games
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 px-8">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-muted-foreground text-sm">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Search Section */}
        <div className="space-y-3">
          <p className="text-foreground font-medium">Search directly:</p>
          <div className="relative max-w-[500px] mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Type anything: aliens, Walking Dead, cute cats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-24 h-12 text-base border-2 border-border focus:border-primary transition-colors"
            />
            <Button
              onClick={handleSearch}
              variant="default"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
            >
              Search
            </Button>
          </div>
        </div>

        
      </div>
    </div>;
};
export default Welcome;