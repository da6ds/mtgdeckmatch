import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardImageModal } from "@/components/CardImageModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { X, ChevronDown, ChevronUp, Library, Search, Heart } from "lucide-react";
import preconsData from "@/data/precons-data.json";
import { deckELI5 } from "@/utils/deckDescriptions";
import { deckDifficulty } from "@/utils/deckDifficulty";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import { useSavedDecks } from "@/contexts/SavedDecksContext";

const Browse = () => {
  const navigate = useNavigate();
  const { toggleDeck, isSaved } = useSavedDecks();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

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

  // Filter decks by search term and selected colors
  const filteredDecks = preconsData.filter((deck: any) => {
    // Search filter: match deck name OR commander name (case-insensitive)
    const matchesSearch = searchTerm.trim() === "" ||
      deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.commander.toLowerCase().includes(searchTerm.toLowerCase());

    // Color filter: match ANY selected color
    const matchesColor = selectedColors.length === 0 ||
      selectedColors.some(selectedColor => deck.colors.includes(selectedColor));

    // Both filters must pass (independent filters)
    return matchesSearch && matchesColor;
  });

  const getCommanderCard = (precon: any) => {
    return precon.cards?.find((card: any) => card.is_commander);
  };

  const getColorSymbol = (colorCode: string) => {
    const symbols: Record<string, string> = {
      W: "⚪",
      U: "🔵",
      B: "⚫",
      R: "🔴",
      G: "🟢",
    };
    return symbols[colorCode] || colorCode;
  };

  const toggleDescription = (deckId: string) => {
    setExpandedDescriptions(prev => {
      const next = new Set(prev);
      if (next.has(deckId)) {
        next.delete(deckId);
      } else {
        next.add(deckId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-1 py-1">
      <div className="max-w-7xl mx-auto space-y-1 md:pt-12">
        {/* Header */}
        <div className="flex justify-between items-center animate-fade-in mb-4">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Library className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            Browse All Decks
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            Home
          </Button>
        </div>

        {/* Search and Color Filters */}
        <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 animate-fade-in">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Search Input */}
              <div className="relative">
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
              <div className="flex flex-wrap items-center gap-3">
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
          </CardContent>
        </Card>

        {/* Deck Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {filteredDecks.map((precon: any) => {
            const commanderCard = getCommanderCard(precon);
            const difficultyInfo = deckDifficulty[precon.id];
            const imageUrl = commanderCard?.image_url && !isPlaceholderUrl(commanderCard.image_url)
              ? commanderCard.image_url
              : getScryfallImageUrl(precon.commander);

            const flavorText = deckELI5[precon.id] || `A powerful precon deck featuring ${precon.commander}. Description coming soon!`;
            const isExpanded = expandedDescriptions.has(precon.id);
            const needsExpansion = flavorText.length > 250;

            return (
              <Card
                key={precon.id}
                className="group hover:shadow-card-hover transition-all duration-300 border-2 relative flex flex-col h-full animate-fade-in overflow-hidden"
              >
                {/* Heart Save Button */}
                <button
                  onClick={() => toggleDeck(precon.id)}
                  className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center opacity-70 hover:opacity-100 ${
                    isSaved(precon.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/80 hover:bg-primary/80"
                  }`}
                  aria-label={isSaved(precon.id) ? "Remove from saved" : "Save deck"}
                >
                  <Heart className={`w-4 h-4 ${isSaved(precon.id) ? "fill-current" : ""}`} />
                </button>

                <div className="grid grid-cols-[auto_1fr] gap-2 p-1.5">
                  {/* Left Column: Card Image */}
                  <div className="flex items-center justify-center">
                    <CardImageModal
                      imageUrl={imageUrl}
                      cardName={precon.commander}
                      deckName={precon.name}
                      triggerClassName="h-28 md:h-32 w-auto flex items-center justify-center bg-muted/30 rounded-md"
                      imageClassName="max-h-full w-auto object-contain rounded-md"
                    />
                  </div>

                  {/* Right Column: Metadata Stack */}
                  <div className="flex flex-col justify-center space-y-0.5 text-xs">
                    {/* Price */}
                    <div className="text-muted-foreground font-semibold">
                      ${precon.year && precon.year >= 2024 ? "50-70" : "40-60"}
                    </div>

                    {/* Commander with label */}
                    <div className="text-foreground">
                      <span className="font-semibold">Commander:</span> {precon.commander}
                    </div>

                    {/* Colors */}
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Colors:</span>
                      <div className="flex gap-0.5">
                        {precon.colors.map((color: string) => (
                          <span key={color} className="text-sm">
                            {getColorSymbol(color)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty */}
                    {difficultyInfo ? (
                      <div className="text-muted-foreground text-[10px] leading-tight">
                        <span className="font-semibold">Difficulty:</span> {difficultyInfo.difficulty}/10 - {difficultyInfo.reason}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-[10px]">
                        <span className="font-semibold">Difficulty:</span> TBD
                      </div>
                    )}

                    {/* Power Level */}
                    {precon.tags?.power_level && (
                      <div className="text-muted-foreground text-[10px]">
                        <span className="font-semibold">Power Level:</span> {precon.tags.power_level}/10
                      </div>
                    )}
                  </div>
                </div>

                {/* Full-width bottom section */}
                <CardContent className="px-2 pb-2 pt-0 space-y-1.5 flex flex-col">
                  {/* Deck Name */}
                  <h3 className="text-lg font-bold leading-tight text-foreground">{precon.name}</h3>

                  {/* Commander Ability Text */}
                  {commanderCard?.oracle_text && (
                    <div className="text-xs text-muted-foreground italic leading-snug line-clamp-3">
                      {commanderCard.oracle_text}
                    </div>
                  )}

                  {/* Flavor Text with expand/collapse */}
                  <div>
                    <p className={`text-sm leading-snug text-foreground ${!isExpanded && needsExpansion ? 'line-clamp-4' : ''} ${!deckELI5[precon.id] ? 'italic text-muted-foreground' : ''}`}>
                      {flavorText}
                    </p>
                    {needsExpansion && (
                      <button
                        onClick={() => toggleDescription(precon.id)}
                        className="text-xs text-accent hover:text-accent/80 font-medium mt-1 flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>Less <ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <>More <ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Buy Button */}
                  <Button
                    variant="default"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-auto py-2 text-xs mt-auto"
                    onClick={() => {
                      const searchQuery = encodeURIComponent(precon.name + " commander deck");
                      window.open(`https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${searchQuery}&view=grid`, "_blank");
                    }}
                  >
                    Buy This Deck
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
      </div>
    </div>
  );
};

export default Browse;
