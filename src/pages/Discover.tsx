import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeCard } from "@/components/ThemeCard";
import { DeckCard } from "@/components/DeckCard";
import { CardSetCard } from "@/components/CardSetCard";
import { CardImageModal } from "@/components/CardImageModal";
import { Heart, Search } from "lucide-react";
import { getAllThemes, filterDecksByTheme, countDecksPerTheme } from "@/utils/themeHelpers";
import { getCommanderCard } from "@/utils/deckHelpers";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import preconsData from "@/data/precons-data.json";
import cardSetsData from "@/data/card-sets.json";
import cardArtUrls from "@/data/card-art-urls.json";
import type { Theme, CardSet } from "@/types/v2Types";

// Helper function to get franchise icons
const getFranchiseIcon = (setId: string): string => {
  const icons: Record<string, string> = {
    'doctor-who': '🌀',
    'fallout': '☢️',
    'final-fantasy': '⚡',
    'lord-of-the-rings': '💍',
    'warhammer-40k': '⚔️',
    'transformers': '🤖',
  };
  return icons[setId] || '🎮';
};

// Helper function to get representative card name from card set
const getRepresentativeCardName = (set: CardSet): string => {
  // If set has card names, use the first one
  if (set.cards && set.cards.length > 0) {
    return set.cards[0].name;
  }

  // Otherwise, create a representative name from the set
  const nameMap: Record<string, string> = {
    'secret-lair-furby': 'Phyrexian Arena',
    'street-fighter': 'Ryu, World Warrior',
    'walking-dead': 'Rick, Steadfast Leader',
    'stranger-things': 'Eleven, the Mage',
    'fortnite': 'Battle Bus',
    'sl-marvel-captain-america': 'Captain America, First Avenger',
    'sl-marvel-iron-man': 'Iron Man, Titan of Innovation',
    'sl-marvel-wolverine': 'Wolverine, Best There Is',
    'sl-marvel-storm': 'Storm, Force of Nature',
    'sl-marvel-black-panther': 'Black Panther, Wakandan King',
    'sl-transformers-optimus-megatron': 'Optimus Prime, Hero',
    'sl-transformers-roll-out': 'Transformers Collection',
    'sl-transformers-lands': 'Cybertron Basics',
    'sl-monty-python': 'The Black Knight',
    'sl-hatsune-miku': 'Azusa, Lost but Seeking',
    'sl-post-malone': 'Post Malone Collection',
    'sl-spongebob': 'SpongeBob Collection',
    'sl-chucky': 'Chucky, the Killer Doll',
    'sl-ghostbusters': 'Ghostbusters Collection',
    'sl-tomb-raider': 'Lara Croft, Tomb Raider',
    'sl-arcane': 'Jinx & Vi Collection',
    'sl-fortnite-lands': 'Fortnite Basics',
    'godzilla-ikoria': 'Godzilla, King of the Monsters',
    'dracula-crimson-vow': 'Dracula',
    'jurassic-world-ixalan': 'Jurassic World Collection',
  };

  return nameMap[set.id] || set.name;
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

// Helper function to count card sets per theme
const countCardSetsPerTheme = (cardSets: CardSet[]): Record<string, number> => {
  const counts: Record<string, number> = {};

  cardSets.forEach(cardSet => {
    if (cardSet.themeIds && Array.isArray(cardSet.themeIds)) {
      cardSet.themeIds.forEach(themeId => {
        counts[themeId] = (counts[themeId] || 0) + 1;
      });
    }
  });

  return counts;
};

// Helper function to filter card sets by theme
const filterCardSetsByTheme = (cardSets: CardSet[], theme: Theme): CardSet[] => {
  return cardSets.filter(cardSet => {
    if (!cardSet.themeIds || !Array.isArray(cardSet.themeIds)) {
      return false;
    }
    return cardSet.themeIds.includes(theme.id);
  });
};

const Discover = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get all themes and counts
  const themes = useMemo(() => getAllThemes(), []);
  const deckCounts = useMemo(() => countDecksPerTheme(preconsData), []);
  const cardSetCounts = useMemo(() => countCardSetsPerTheme(cardSetsData as CardSet[]), []);

  // Derive state from URL params
  const activeTab = searchParams.get('tab') || 'decks';
  const view = searchParams.get('view') || 'theme'; // Default to 'theme' for both tabs

  // Browse mode state (for "all" views - decks)
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'release-desc';
  const selectedColors = searchParams.get('colors')?.split(',').filter(Boolean) || [];

  // Browse mode state (for "all" views - cards)
  const cardSortBy = searchParams.get('cardSort') || 'release-desc';
  const selectedCardTypes = searchParams.get('cardTypes')?.split(',').filter(Boolean) || [];
  const selectedFranchises = searchParams.get('franchises')?.split(',').filter(Boolean) || [];

  // Helper to update URL params
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

  const selectedTheme = useMemo(() => {
    const themeId = searchParams.get('theme');
    if (!themeId) return null;

    // First, try to find in regular themes
    const regularTheme = themes.find(t => t.id === themeId);
    if (regularTheme) return regularTheme;

    // If not found, check if it's a card set ID (franchise theme)
    const cardSet = (cardSetsData as CardSet[]).find(set => set.id === themeId);
    if (cardSet) {
      // Recreate synthetic franchise theme
      const ipMap: Record<string, string> = {
        'doctor-who': 'doctor_who',
        'fallout': 'fallout',
        'final-fantasy': 'final_fantasy',
        'lord-of-the-rings': 'lord_of_the_rings',
        'warhammer-40k': 'warhammer_40k',
        'transformers': 'transformers',
      };

      const ip = ipMap[cardSet.id];
      if (ip) {
        return {
          id: cardSet.id,
          name: cardSet.name,
          slug: cardSet.id,
          description: cardSet.description,
          icon: '🎮',
          matchingTags: { ip: [ip] },
          sortOrder: 999,
        };
      }
    }

    return null;
  }, [searchParams, themes]);

  // Get filtered decks if a theme is selected
  const filteredDecks = useMemo(() => {
    if (!selectedTheme) return [];

    // Check if this is a franchise theme (from UB card click)
    if (selectedTheme.matchingTags.ip) {
      const ip = selectedTheme.matchingTags.ip[0];
      return preconsData.filter((deck: any) => deck.ip === ip);
    }

    // Otherwise use normal theme filtering
    return filterDecksByTheme(preconsData, selectedTheme);
  }, [selectedTheme]);

  // Get filtered card sets if a theme is selected (for Cards tab)
  const filteredCardSets = useMemo(() => {
    if (!selectedTheme || activeTab !== 'cards') return [];
    return filterCardSetsByTheme(cardSetsData as CardSet[], selectedTheme);
  }, [selectedTheme, activeTab]);

  // Get Universes Beyond card sets (tier 3)
  const universesBeyondSets = useMemo(() =>
    (cardSetsData as CardSet[]).filter(set => set.tier === 3).slice(0, 6),
    []
  );

  // Get Secret Lair card sets (tier 2)
  const secretLairSets = useMemo(() =>
    (cardSetsData as CardSet[]).filter(set => set.tier === 2),
    []
  );

  // All decks for browse mode
  const allDecks = useMemo(() => {
    return preconsData.map((deck: any) => ({
      ...deck,
      searchableText: getSearchableText(deck),
    }));
  }, []);

  // Sort and filter decks for "All Decks" view
  const sortedAndFilteredDecks = useMemo(() => {
    if (view !== 'all' || activeTab !== 'decks') return [];

    let results = allDecks;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(d => d.searchableText.includes(query));
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      results = results.filter(deck =>
        selectedColors.some(color => deck.colors?.includes(color))
      );
    }

    // Sort
    const sorted = [...results];
    switch (sortBy) {
      case 'release-desc':
        sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'release-asc':
        sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'power-desc':
        sorted.sort((a, b) => (b.power_level || 5) - (a.power_level || 5));
        break;
      case 'power-asc':
        sorted.sort((a, b) => (a.power_level || 5) - (b.power_level || 5));
        break;
    }

    return sorted;
  }, [allDecks, view, activeTab, searchQuery, selectedColors, sortBy]);

  // Color options for filter
  const colorOptions = [
    { code: "W", symbol: "⚪", name: "White" },
    { code: "U", symbol: "🔵", name: "Blue" },
    { code: "B", symbol: "⚫", name: "Black" },
    { code: "R", symbol: "🔴", name: "Red" },
    { code: "G", symbol: "🟢", name: "Green" },
  ];

  const handleColorToggle = (colorCode: string) => {
    const newColors = selectedColors.includes(colorCode)
      ? selectedColors.filter(c => c !== colorCode)
      : [...selectedColors, colorCode];
    updateParams({ colors: newColors.length > 0 ? newColors.join(',') : null });
  };

  // Card filter handlers
  const handleCardTypeToggle = (type: string) => {
    const newTypes = selectedCardTypes.includes(type)
      ? selectedCardTypes.filter(t => t !== type)
      : [...selectedCardTypes, type];
    updateParams({ cardTypes: newTypes.length > 0 ? newTypes.join(',') : null });
  };

  const handleFranchiseToggle = (franchise: string) => {
    const newFranchises = selectedFranchises.includes(franchise)
      ? selectedFranchises.filter(f => f !== franchise)
      : [...selectedFranchises, franchise];
    updateParams({ franchises: newFranchises.length > 0 ? newFranchises.join(',') : null });
  };

  // Sort and filter cards for "All Cards" view
  const sortedAndFilteredCards = useMemo(() => {
    if (view !== 'all' || activeTab !== 'cards') return [];

    let results = cardSetsData as CardSet[];

    // Filter by type (tier)
    if (selectedCardTypes.length > 0) {
      results = results.filter(set => {
        if (selectedCardTypes.includes('Secret Lair') && set.tier === 2) return true;
        if (selectedCardTypes.includes('Universes Beyond') && set.tier === 3) return true;
        return false;
      });
    }

    // Filter by franchise
    if (selectedFranchises.length > 0) {
      results = results.filter(set =>
        selectedFranchises.some(franchise =>
          set.franchise?.toLowerCase().includes(franchise.toLowerCase()) ||
          set.name.toLowerCase().includes(franchise.toLowerCase())
        )
      );
    }

    // Sort
    const sorted = [...results];
    switch (cardSortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'release-desc':
      case 'release-asc':
        // Keep current order for now (would need year data)
        break;
    }

    return sorted;
  }, [view, activeTab, selectedCardTypes, selectedFranchises, cardSortBy]);

  // Get unique franchises from card sets
  const uniqueFranchises = useMemo(() => {
    const franchises = new Set<string>();
    (cardSetsData as CardSet[]).forEach(set => {
      if (set.franchise) {
        franchises.add(set.franchise);
      }
    });
    return Array.from(franchises).sort();
  }, []);

  // Card type options
  const cardTypeOptions = ['Secret Lair', 'Universes Beyond'];

  // Count decks per card set (by IP)
  const getDecksForSet = (setId: string) => {
    const set = cardSetsData.find((s: any) => s.id === setId);
    if (!set) return 0;

    // Map set ID to IP in precons-data
    const ipMap: Record<string, string> = {
      'doctor-who': 'doctor_who',
      'fallout': 'fallout',
      'final-fantasy': 'final_fantasy',
      'lord-of-the-rings': 'lord_of_the_rings',
      'warhammer-40k': 'warhammer_40k',
      'transformers': 'transformers',
    };

    const ip = ipMap[setId];
    if (!ip) return 0;

    return preconsData.filter((deck: any) => deck.ip === ip).length;
  };

  const handleThemeClick = (theme: Theme) => {
    setSearchParams({ tab: 'decks', theme: theme.id });
    // Scroll to top to show theme title
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardThemeClick = (theme: Theme) => {
    setSearchParams({ tab: 'cards', theme: theme.id });
    // Scroll to top to show theme title
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToThemes = () => {
    const currentTab = searchParams.get('tab') || 'decks';
    setSearchParams({ tab: currentTab });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardSetClick = (cardSet: CardSet) => {
    // Filter decks by this IP/franchise
    const ipMap: Record<string, string> = {
      'doctor-who': 'doctor_who',
      'fallout': 'fallout',
      'final-fantasy': 'final_fantasy',
      'lord-of-the-rings': 'lord_of_the_rings',
      'warhammer-40k': 'warhammer_40k',
      'transformers': 'transformers',
    };

    const ip = ipMap[cardSet.id];
    if (!ip) return;

    // Create a synthetic theme for this franchise
    const franchiseTheme: Theme = {
      id: cardSet.id,
      name: cardSet.name,
      slug: cardSet.id,
      description: cardSet.description,
      icon: '🎮',
      matchingTags: { ip: [ip] },
      sortOrder: 999,
    };

    setSearchParams({ tab: 'decks', theme: franchiseTheme.id });
    // Scroll to top to show theme title
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs for Decks and Cards */}
        {!selectedTheme && (
          <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ tab: value })} className="w-full">
            <TabsList className="w-full flex mb-6">
              <TabsTrigger value="decks" className="flex-1">Decks</TabsTrigger>
              <TabsTrigger value="cards" className="flex-1">Cards</TabsTrigger>
            </TabsList>

            {/* Decks Tab - With Sub-Navigation */}
            <TabsContent value="decks">
              {/* Sub-Navigation Pills */}
              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                <Button
                  variant={view === 'theme' ? 'default' : 'outline'}
                  onClick={() => updateParams({ view: 'theme' })}
                  className="whitespace-nowrap"
                >
                  By Theme
                </Button>
                <Button
                  variant={view === 'franchise' ? 'default' : 'outline'}
                  onClick={() => updateParams({ view: 'franchise' })}
                  className="whitespace-nowrap"
                >
                  By Franchise
                </Button>
                <Button
                  variant={view === 'all' ? 'default' : 'outline'}
                  onClick={() => updateParams({ view: 'all' })}
                  className="whitespace-nowrap"
                >
                  All Decks
                </Button>
              </div>

              {/* By Theme View */}
              {view === 'theme' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {themes.map(theme => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      deckCount={deckCounts[theme.id] || 0}
                      imageUrl={cardArtUrls.themes[theme.id as keyof typeof cardArtUrls.themes]}
                      onClick={() => handleThemeClick(theme)}
                    />
                  ))}
                </div>
              )}

              {/* By Franchise View */}
              {view === 'franchise' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {universesBeyondSets.map(set => (
                    <CardSetCard
                      key={set.id}
                      cardSet={set}
                      deckCount={getDecksForSet(set.id)}
                      onClick={() => handleCardSetClick(set)}
                      variant="compact"
                      icon={getFranchiseIcon(set.id)}
                    />
                  ))}
                </div>
              )}

              {/* All Decks View (Browse Mode) */}
              {view === 'all' && (
                <>
                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search all decks... (commanders, sets, themes, creature types)"
                      value={searchQuery}
                      onChange={(e) => updateParams({ q: e.target.value || null })}
                      className="pl-11 text-base py-6"
                    />
                  </div>

                  {/* Sorting & Filtering */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sort:</span>
                      <Select value={sortBy} onValueChange={(value) => updateParams({ sort: value })}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="release-desc">Newest First</SelectItem>
                          <SelectItem value="release-asc">Oldest First</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                          <SelectItem value="name-asc">Name: A-Z</SelectItem>
                          <SelectItem value="name-desc">Name: Z-A</SelectItem>
                          <SelectItem value="power-desc">Power: High to Low</SelectItem>
                          <SelectItem value="power-asc">Power: Low to High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Color Filters */}
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

                    {/* Clear Filters */}
                    {(selectedColors.length > 0 || searchQuery.trim()) && (
                      <>
                        <div className="h-6 w-px bg-border" />
                        <Button variant="ghost" size="sm" onClick={() => setSearchParams({ tab: 'decks', view: 'all' })}>
                          Clear All
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Results Count */}
                  <p className="text-sm text-muted-foreground mb-6">
                    {sortedAndFilteredDecks.length} deck{sortedAndFilteredDecks.length !== 1 ? 's' : ''} found
                  </p>

                  {/* Deck Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedAndFilteredDecks.map((deck: any) => (
                      <DeckCard key={deck.id} precon={deck} />
                    ))}
                  </div>

                  {/* Empty State */}
                  {sortedAndFilteredDecks.length === 0 && (
                    <Card className="max-w-2xl mx-auto border-2 border-primary/50 mt-8">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-foreground">No decks found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery.trim() ? (
                            <>No results for "{searchQuery}". Try a different search term or adjust filters.</>
                          ) : (
                            <>Try adjusting your filters or search for something else.</>
                          )}
                        </p>
                        <Button variant="default" onClick={() => setSearchParams({ tab: 'decks', view: 'all' })}>
                          Clear All Filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            {/* Cards Tab - With Sub-Navigation */}
            <TabsContent value="cards">
              {/* Sub-Navigation Pills */}
              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                <Button
                  variant={view === 'theme' ? 'default' : 'outline'}
                  onClick={() => updateParams({ view: 'theme' })}
                  className="whitespace-nowrap"
                >
                  By Theme
                </Button>
                <Button
                  variant={view === 'sets' ? 'default' : 'outline'}
                  onClick={() => updateParams({ view: 'sets' })}
                  className="whitespace-nowrap"
                >
                  By Set
                </Button>
                <Button
                  variant={view === 'all' ? 'default' : 'outline'}
                  onClick={() => updateParams({ view: 'all' })}
                  className="whitespace-nowrap"
                >
                  All Cards
                </Button>
              </div>

              {/* By Theme View */}
              {view === 'theme' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {themes.map(theme => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      deckCount={cardSetCounts[theme.id] || 0}
                      imageUrl={cardArtUrls.themes[theme.id as keyof typeof cardArtUrls.themes]}
                      onClick={() => handleCardThemeClick(theme)}
                    />
                  ))}
                </div>
              )}

              {/* By Set View */}
              {view === 'sets' && (
                <>
                  <div>
                    <p className="text-muted-foreground mb-4">
                      Collector cards & special editions
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {secretLairSets.map(set => (
                  <Card
                    key={set.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow relative cursor-pointer"
                    onClick={() => navigate(`/card-set/${set.id}`)}
                  >
                    {/* Heart save button */}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-md transition-all duration-200"
                      aria-label="Save card"
                    >
                      <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>

                    {/* Horizontal layout: Image + Info */}
                    <div className="flex gap-4 p-4">
                      {/* Card Image - Left */}
                      <div className="w-24 h-32 flex-shrink-0">
                        <CardImageModal
                          imageUrl={set.imageUrl}
                          cardName={getRepresentativeCardName(set)}
                          deckName={set.name}
                          triggerClassName="w-full h-full"
                          imageClassName="w-full h-full object-cover rounded shadow-md"
                        />
                      </div>

                      {/* Card Info - Right */}
                      <div className="flex-1 min-w-0">
                        {/* Card name */}
                        <h3 className="font-bold text-base leading-tight line-clamp-2">
                          {getRepresentativeCardName(set)}
                        </h3>

                        {/* Set name */}
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {set.name}
                        </p>

                        {/* Badge */}
                        <div className="mt-2">
                          <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                            Secret Lair
                          </span>
                        </div>

                        {/* Price placeholder */}
                        <p className="text-sm font-semibold mt-2 text-foreground">
                          View Pricing
                        </p>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <Button
                      className="w-full rounded-t-none bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://www.tcgplayer.com/search/magic/product?q=${encodeURIComponent(set.name)}`,
                          '_blank'
                        );
                      }}
                    >
                      View on TCGPlayer
                    </Button>
                  </Card>
                ))}
              </div>
                </>
              )}

              {/* All Cards View (Browse Mode) */}
              {view === 'all' && (
                <>
                  {/* Sorting & Filtering */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sort:</span>
                      <Select value={cardSortBy} onValueChange={(value) => updateParams({ cardSort: value })}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="release-desc">Newest First</SelectItem>
                          <SelectItem value="release-asc">Oldest First</SelectItem>
                          <SelectItem value="name-asc">Name: A-Z</SelectItem>
                          <SelectItem value="name-desc">Name: Z-A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filter by Type */}
                    <div className="h-6 w-px bg-border" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      {cardTypeOptions.map(type => (
                        <label
                          key={type}
                          className="flex items-center gap-1.5 cursor-pointer hover:bg-accent/20 px-2 py-1 rounded transition-colors"
                        >
                          <Checkbox
                            checked={selectedCardTypes.includes(type)}
                            onCheckedChange={() => handleCardTypeToggle(type)}
                          />
                          <span className="text-sm whitespace-nowrap">{type}</span>
                        </label>
                      ))}
                    </div>

                    {/* Filter by Franchise */}
                    {uniqueFranchises.length > 0 && (
                      <>
                        <div className="h-6 w-px bg-border" />
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-muted-foreground">Franchise:</span>
                          {uniqueFranchises.slice(0, 5).map(franchise => (
                            <label
                              key={franchise}
                              className="flex items-center gap-1.5 cursor-pointer hover:bg-accent/20 px-2 py-1 rounded transition-colors"
                            >
                              <Checkbox
                                checked={selectedFranchises.includes(franchise)}
                                onCheckedChange={() => handleFranchiseToggle(franchise)}
                              />
                              <span className="text-sm whitespace-nowrap">{franchise}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Clear Filters */}
                    {(selectedCardTypes.length > 0 || selectedFranchises.length > 0) && (
                      <>
                        <div className="h-6 w-px bg-border" />
                        <Button variant="ghost" size="sm" onClick={() => setSearchParams({ tab: 'cards', view: 'all' })}>
                          Clear All
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Results Count */}
                  <p className="text-sm text-muted-foreground mb-6">
                    {sortedAndFilteredCards.length} card set{sortedAndFilteredCards.length !== 1 ? 's' : ''} found
                  </p>

                  {/* Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedAndFilteredCards.map(set => (
                      <CardSetCard
                        key={set.id}
                        cardSet={set}
                        variant="browse"
                        imageUrl={set.imageUrl}
                      />
                    ))}
                  </div>

                  {/* Empty State */}
                  {sortedAndFilteredCards.length === 0 && (
                    <Card className="max-w-2xl mx-auto border-2 border-primary/50 mt-8">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-foreground">No card sets found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your filters to see more results.
                        </p>
                        <Button variant="default" onClick={() => setSearchParams({ tab: 'cards', view: 'all' })}>
                          Clear All Filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        )}

      {/* Filtered Decks/Cards Section */}
      {selectedTheme && (
        <div id="filtered-items" className="space-y-6">
          {/* Back Button - Top Left */}
          <BackButton className="mb-4" />

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{selectedTheme.icon}</span>
              <h2 className="text-2xl font-bold">{selectedTheme.name}</h2>
            </div>
            <p className="text-muted-foreground">{selectedTheme.description}</p>
          </div>

          {/* For Decks Tab */}
          {activeTab === 'decks' && (
            <>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm">
                  <strong>{filteredDecks.length} {filteredDecks.length === 1 ? 'deck' : 'decks'}</strong> match this theme
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDecks.map((deck: any) => (
                  <DeckCard
                    key={deck.id}
                    precon={deck}
                    showDismiss={false}
                    showMatchPercentage={false}
                    showAIIntro={false}
                  />
                ))}
              </div>

              {filteredDecks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No decks found for this theme.</p>
                </div>
              )}
            </>
          )}

          {/* For Cards Tab */}
          {activeTab === 'cards' && (
            <>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm">
                  <strong>{filteredCardSets.length} card {filteredCardSets.length === 1 ? 'set' : 'sets'}</strong> match this theme
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCardSets.map(cardSet => (
                  <CardSetCard
                    key={cardSet.id}
                    cardSet={cardSet}
                    variant="browse"
                    imageUrl={cardSet.imageUrl}
                  />
                ))}
              </div>

              {filteredCardSets.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No card sets found for this theme.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Discover;
