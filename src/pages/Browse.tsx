import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { MainNav } from "@/components/MainNav";
import { DeckCard } from "@/components/DeckCard";
import { CardSetCard } from "@/components/CardSetCard";
import { Search } from "lucide-react";
import { getCommanderCard } from "@/utils/deckHelpers";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import preconsData from "@/data/precons-data.json";
import cardSetsData from "@/data/card-sets.json";
import type { CardSet } from "@/types/v2Types";

type ProductType = "deck" | "card-set";
type ProductFilter = "all" | "decks" | "cards";

interface UnifiedProduct {
  type: ProductType;
  id: string;
  name: string;
  searchableText: string;
  imageUrl: string;
  data: any;
}

const Browse = () => {
  usePageTitle("Browse All Products");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive state from URL params
  const searchQuery = searchParams.get('q') || '';
  const productFilter = (searchParams.get('type') || 'all') as ProductFilter;
  const selectedColors = searchParams.get('colors')?.split(',').filter(Boolean) || [];

  const colorOptions = [
    { code: "W", symbol: "⚪", name: "White" },
    { code: "U", symbol: "🔵", name: "Blue" },
    { code: "B", symbol: "⚫", name: "Black" },
    { code: "R", symbol: "🔴", name: "Red" },
    { code: "G", symbol: "🟢", name: "Green" },
  ];

  // Helper to update URL params while preserving others
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handleColorToggle = (colorCode: string) => {
    const newColors = selectedColors.includes(colorCode)
      ? selectedColors.filter(c => c !== colorCode)
      : [...selectedColors, colorCode];
    updateParams({ colors: newColors.length > 0 ? newColors.join(',') : null });
  };

  const clearFilters = () => {
    setSearchParams({});
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

    const allText = [
      ...searchableFields,
      ...tagArrays.flat(),
    ].join(" ").toLowerCase();

    return allText;
  };

  // Create unified product list combining decks and card sets
  const allProducts = useMemo((): UnifiedProduct[] => {
    const decks = preconsData.map((deck: any) => {
      const commanderCard = getCommanderCard(deck);
      return {
        type: "deck" as const,
        id: deck.id,
        name: deck.name,
        searchableText: getSearchableText(deck),
        imageUrl: commanderCard?.image_url || "https://cards.scryfall.io/large/back/0/0/0aeebaf5-8c7d-4636-9e82-8c27447861f7.jpg",
        data: deck,
      };
    });

    const cardSets = cardSetsData.map((set: CardSet) => ({
      type: "card-set" as const,
      id: set.id,
      name: set.name,
      searchableText: [
        set.name,
        set.franchise,
        set.description,
      ].join(" ").toLowerCase(),
      // Use imageUrl from card-sets.json
      imageUrl: set.imageUrl,
      data: set,
    }));

    return [...decks, ...cardSets];
  }, []);

  // Filter products based on search, product type, and colors
  const filteredProducts = useMemo(() => {
    let results = allProducts;

    // Filter by product type
    if (productFilter === "decks") {
      results = results.filter(p => p.type === "deck");
    } else if (productFilter === "cards") {
      results = results.filter(p => p.type === "card-set");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(p => p.searchableText.includes(query));
    }

    // Filter by colors (only applies to decks)
    if (selectedColors.length > 0 && productFilter !== "cards") {
      results = results.filter(p => {
        if (p.type === "card-set") return true;
        const deck = p.data;
        return selectedColors.some(color => deck.colors?.includes(color));
      });
    }

    return results;
  }, [allProducts, searchQuery, productFilter, selectedColors]);

  // Count by type
  const deckCount = filteredProducts.filter(p => p.type === "deck").length;
  const cardSetCount = filteredProducts.filter(p => p.type === "card-set").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <MainNav />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Single Unified Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search all products... (decks, commanders, card sets, franchises)"
            value={searchQuery}
            onChange={(e) => updateParams({ q: e.target.value || null })}
            className="pl-11 text-base py-6"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Product Type Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <ToggleGroup
              type="single"
              value={productFilter}
              onValueChange={(value) => value && updateParams({ type: value === 'all' ? null : value })}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="decks">Decks Only</ToggleGroupItem>
              <ToggleGroupItem value="cards">Card Sets Only</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Color Filters (show only when decks are included) */}
          {productFilter !== "cards" && (
            <>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Colors:</span>
                {colorOptions.map(color => (
                  <label
                    key={color.code}
                    className="flex items-center gap-1.5 cursor-pointer hover:bg-accent/20 px-2 py-1 rounded transition-colors"
                  >
                    <Checkbox
                      checked={selectedColors.includes(color.code)}
                      onCheckedChange={() => handleColorToggle(color.code)}
                    />
                    <span className="text-base">{color.symbol}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {/* Clear Filters */}
          {(selectedColors.length > 0 || searchQuery.trim() !== "" || productFilter !== "all") && (
            <>
              <div className="h-6 w-px bg-border" />
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </>
          )}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          {productFilter === "all" && filteredProducts.length > 0 && (
            <span> ({deckCount} deck{deckCount !== 1 ? 's' : ''}, {cardSetCount} card set{cardSetCount !== 1 ? 's' : ''})</span>
          )}
        </p>

        {/* Mixed Results Grid - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(product =>
            product.type === "deck" ? (
              <DeckCard
                key={`deck-${product.id}`}
                precon={product.data}
              />
            ) : (
              <CardSetCard
                key={`card-${product.id}`}
                cardSet={product.data}
                variant="browse"
                imageUrl={product.imageUrl}
              />
            )
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card className="max-w-2xl mx-auto border-2 border-primary/50 mt-8">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-foreground">
                No products found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery.trim() ? (
                  <>No results for "{searchQuery}". Try a different search term or adjust filters.</>
                ) : (
                  <>Try adjusting your filters or search for something else.</>
                )}
              </p>
              <Button variant="hero" size="lg" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Browse;
