import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DeckCard } from "@/components/DeckCard";
import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/PageHeader";
import { Library, Search } from "lucide-react";
import preconsData from "@/data/precons-data.json";

const Browse = () => {
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for dynamic shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const colorOptions = [
    { code: "W", symbol: "⚪", name: "White" },
    { code: "U", symbol: "🔵", name: "Blue" },
    { code: "B", symbol: "⚫", name: "Black" },
    { code: "R", symbol: "🔴", name: "Red" },
    { code: "G", symbol: "🟢", name: "Green" },
  ];

  const handleColorToggle = (colorCode: string) => {
    setSelectedColors(prev =>
      prev.includes(colorCode)
        ? prev.filter(c => c !== colorCode)
        : [...prev, colorCode]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSearchTerm("");
  };

  // Helper function to extract all searchable text from a deck
  const getSearchableText = (deck: any): string => {
    const searchableFields: string[] = [
      deck.name,
      deck.commander,
      deck.set,
      deck.ip,
      deck.tags?.complexity || "",
    ];

    // Add all tag arrays (primary and secondary)
    const tagArrays = [
      deck.tags?.aesthetic_vibe?.primary || [],
      deck.tags?.aesthetic_vibe?.secondary || [],
      deck.tags?.creature_types?.primary || [],
      deck.tags?.creature_types?.secondary || [],
      deck.tags?.themes?.primary || [],
      deck.tags?.themes?.secondary || [],
      deck.tags?.archetype?.primary || [],
      deck.tags?.archetype?.secondary || [],
      deck.tags?.play_pattern?.primary || [],
      deck.tags?.play_pattern?.secondary || [],
      deck.tags?.flavor_setting?.primary || [],
      deck.tags?.flavor_setting?.secondary || [],
      deck.tags?.tone?.primary || [],
      deck.tags?.tone?.secondary || [],
      deck.tags?.ip_meta_tags || [],
    ];

    // Flatten all arrays and combine with other fields
    const allText = [
      ...searchableFields,
      ...tagArrays.flat(),
    ].join(" ").toLowerCase();

    return allText;
  };

  // Filter decks by search term and selected colors
  const filteredDecks = preconsData.filter((deck: any) => {
    // Search filter: match ANY field in the deck (case-insensitive)
    const matchesSearch = searchTerm.trim() === "" ||
      getSearchableText(deck).includes(searchTerm.toLowerCase());

    // Color filter: match ANY selected color
    const matchesColor = selectedColors.length === 0 ||
      selectedColors.some(selectedColor => deck.colors.includes(selectedColor));

    // Both filters must pass (independent filters)
    return matchesSearch && matchesColor;
  });

  return (
    <PageLayout className="p-1 py-1">
      <PageHeader
        title="Browse All Decks"
        icon={<Library className="w-5 h-5 md:w-6 md:h-6" />}
        actions={[
          {
            label: "Home",
            onClick: () => navigate("/"),
            variant: "outline",
          }
        ]}
      />

      {/* Sticky Search & Filter Toolbar */}
      <div className={`sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 mb-6 border-b border-border/50 transition-shadow duration-200 ${isScrolled ? 'shadow-md' : ''}`}>
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search decks or commanders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Color Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-semibold text-sm">Filter by Color:</span>
          {colorOptions.map(color => (
            <label
              key={color.code}
              className="flex items-center gap-2 cursor-pointer hover:bg-accent/20 px-3 py-1.5 rounded-md transition-colors"
            >
              <Checkbox
                checked={selectedColors.includes(color.code)}
                onCheckedChange={() => handleColorToggle(color.code)}
              />
              <span className="text-lg">{color.symbol}</span>
              <span className="text-sm font-medium">{color.name}</span>
            </label>
          ))}
        </div>

        {/* Deck Count & Clear Filters */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            {filteredDecks.length} deck{filteredDecks.length !== 1 ? 's' : ''} found
            {selectedColors.length > 0 && (
              <span> matching {selectedColors.map(c => colorOptions.find(co => co.code === c)?.symbol).join("")}</span>
            )}
          </p>
          {(selectedColors.length > 0 || searchTerm.trim() !== "") && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDecks.map((precon: any) => (
            <DeckCard
              key={precon.id}
              precon={precon}
              showDismiss={false}
              showMatchPercentage={false}
              showAIIntro={false}
            />
        ))}
      </div>

      {/* No Results Message */}
      {filteredDecks.length === 0 && (
        <Card className="max-w-2xl mx-auto border-2 border-primary/50 mt-8">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl mb-4">🎴</div>
              <h3 className="text-2xl font-bold text-foreground">
                No decks match those colors
              </h3>
              <p className="text-muted-foreground">
                Try selecting different color combinations or clearing your filters.
              </p>
              <Button variant="hero" size="lg" onClick={clearFilters}>
                Clear Filters
              </Button>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default Browse;
