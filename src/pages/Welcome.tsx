import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { parseCustomInput } from "@/utils/customInputParser";
const Welcome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    
    // Use the enhanced custom input parser
    const matchResults = parseCustomInput(query);
    
    // Navigate directly to results with match data
    navigate("/results", {
      state: {
        source: 'search',
        path: 'vibes',
        searchQuery: query,
        matchResults: matchResults, // Pass the full match results with reasons
        answers: []
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-2 md:p-3">
      <div className="max-w-[48.4rem] w-full text-center space-y-2.5 md:space-y-8 animate-fade-in">
        <div className="space-y-1 md:space-y-4">
          
          
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-normal pb-1">
            Find your perfect<br />
            Commander Deck for<br />
            Magic: The Gathering
          </h1>
        </div>

        <div className="bg-card rounded-xl md:rounded-2xl shadow-card p-2.5 md:p-8 border border-border/50 backdrop-blur-sm">
          <p className="text-sm md:text-lg text-foreground leading-relaxed">
            Want to play Magic but not sure where to start? Commander is Magic's most popular format - casual, social, and perfect for beginners.
            <br /><br />
            Get matched with the right premade deck in just a few taps. From cute squirrels to Walking Dead to The Princess Bride - far more awaits than just dragons and elves!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-6 justify-center items-start">
          <div className="flex flex-col items-center gap-1.5 md:gap-2 w-full sm:w-auto">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate("/path-selection")} 
              className="text-sm md:text-lg px-6 md:px-12 py-2.5 md:py-6 h-auto rounded-lg md:rounded-xl w-full sm:w-auto"
            >
              I'm Ready To Slay!
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-1.5 md:gap-2 w-full sm:w-auto">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate("/results", { 
                state: { 
                  source: 'surprise',
                  path: 'pop_culture'
                } 
              })} 
              className="text-sm md:text-lg px-6 md:px-12 py-2.5 md:py-6 h-auto rounded-lg md:rounded-xl border-2 hover:bg-primary/10 hover:scale-105 transition-transform w-full sm:w-auto"
            >
              🎲 Surprise Me!
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 md:gap-3 px-2 md:px-8">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-muted-foreground text-xs md:text-sm">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Search Section */}
        <div className="space-y-1.5 md:space-y-3">
          <p className="text-foreground font-medium text-xs md:text-base">Search directly:</p>
          <div className="relative max-w-[500px] mx-auto">
            <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-5 md:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Type anything: aliens, Walking Dead, cute cats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-8 md:pl-10 pr-18 md:pr-24 h-9 md:h-12 text-xs md:text-base border-2 border-border focus:border-primary transition-colors"
            />
            <Button
              onClick={handleSearch}
              variant="default"
              size="sm"
              className="absolute right-0.5 md:right-1 top-1/2 -translate-y-1/2 h-7 md:h-10 text-xs md:text-sm"
            >
              Search
            </Button>
          </div>
        </div>

        
      </div>
    </div>;
};
export default Welcome;