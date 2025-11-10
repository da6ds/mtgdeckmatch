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

  return <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-2 md:p-3">
      <div className="max-w-[48.4rem] w-full text-center space-y-2 md:space-y-6 animate-fade-in">
        <div className="space-y-1 md:space-y-3">
          
          
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-normal pb-1">
            Find your perfect<br />
            Commander Deck for<br />
            Magic: The Gathering
          </h1>
        </div>

        <div className="bg-card rounded-lg md:rounded-xl shadow-card p-2.5 md:p-6 border border-border/50 backdrop-blur-sm">
          <p className="text-xs md:text-base text-foreground leading-relaxed">
            Want to play Magic but not sure where to start? Commander is Magic's most popular format - casual, social, and perfect for beginners.
            <br /><br />
            Get matched with the right premade deck in just a few taps. From an army of squirrels to The Princess Bride - far more awaits than just dragons and&nbsp;elves!
          </p>
        </div>

        <div className="flex flex-col gap-2 md:gap-3 w-full max-w-md mx-auto">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => navigate("/path-selection")} 
            className="text-xs md:text-base px-5 md:px-10 py-2 md:py-4 h-auto rounded-lg md:rounded-xl w-full"
          >
            Match Me!
          </Button>
          
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => navigate("/results", { 
              state: { 
                source: 'surprise',
                path: 'pop_culture'
              } 
            })} 
            className="text-xs md:text-base px-5 md:px-10 py-2 md:py-4 h-auto rounded-lg md:rounded-xl border-2 hover:bg-primary/10 hover:scale-105 transition-transform w-full"
          >
            Surprise Me!
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 md:gap-3 px-4 md:px-8 pt-4 md:pt-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-muted-foreground text-xs md:text-sm">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Search Section - Separate Group */}
        <div className="space-y-2 md:space-y-2.5 pt-3 md:pt-4">
          <p className="text-foreground font-medium text-xs md:text-sm">Search directly:</p>
          <div className="relative max-w-[500px] mx-auto">
            <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Type anything: aliens, Walking Dead, cute cats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-8 md:pl-10 pr-16 md:pr-20 h-8 md:h-10 text-xs md:text-sm border-2 border-border focus:border-primary transition-colors"
            />
            <Button
              onClick={handleSearch}
              variant="default"
              size="sm"
              className="absolute right-0.5 md:right-1 top-1/2 -translate-y-1/2 h-6 md:h-8 text-xs md:text-sm px-2 md:px-3"
            >
              Search
            </Button>
          </div>
        </div>

        
      </div>
    </div>;
};
export default Welcome;