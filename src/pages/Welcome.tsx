import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Library, Sparkles } from "lucide-react";
import { useState } from "react";
import { parseCustomInput } from "@/utils/customInputParser";
import { usePageTitle } from "@/hooks/usePageTitle";

const Welcome = () => {
  usePageTitle("Welcome");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    
    // Use the enhanced custom input parser
    const matchResults = parseCustomInput(query);
    
    // Navigate directly to results with match data
    // Note: matchResults contains complex deck objects, so we use location.state
    // URL params are used for basic state that needs to survive back navigation
    const params = new URLSearchParams({
      source: 'search',
      path: 'vibes',
      searchQuery: query
    });
    navigate(`/results?${params.toString()}`, {
      state: {
        matchResults: matchResults // Complex object stays in location.state
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 md:p-6">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        {/* Simplified Headline */}
        <h1 className="text-3xl md:text-5xl font-bold text-primary">
          Find Your Commander Deck
        </h1>

        {/* Search Section - Prominent */}
        <div className="w-full max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search decks, commanders, themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 pr-24 h-14 text-base border-2"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6 w-full max-w-md mx-auto">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Three Main Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate("/play")}
            className="min-w-[160px]"
          >
            Match Me
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/discover")}
            className="min-w-[160px] flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            Discover
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/browse")}
            className="min-w-[160px] flex items-center gap-2"
          >
            <Library className="h-5 w-5" />
            Browse All
          </Button>
        </div>

        {/* Subtle Surprise Me Link */}
        <p className="text-sm text-muted-foreground">
          or{" "}
          <button
            className="underline hover:text-primary transition-colors"
            onClick={() => navigate("/results?source=surprise&path=pop_culture")}
          >
            surprise me
          </button>
          {" "}with random decks
        </p>
      </div>
    </div>
  );
};
export default Welcome;