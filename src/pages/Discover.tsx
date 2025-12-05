import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeCard } from "@/components/ThemeCard";
import { DeckCard } from "@/components/DeckCard";
import { CardSetCard } from "@/components/CardSetCard";
import { CardImageModal } from "@/components/CardImageModal";
import { Heart } from "lucide-react";
import { getAllThemes, filterDecksByTheme, countDecksPerTheme } from "@/utils/themeHelpers";
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

const Discover = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get all themes and deck counts
  const themes = useMemo(() => getAllThemes(), []);
  const deckCounts = useMemo(() => countDecksPerTheme(preconsData), []);

  // Derive state from URL params
  const activeTab = searchParams.get('tab') || 'themes';
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
    setSearchParams({ tab: 'themes', theme: theme.id });
    // Scroll to top to show theme title
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToThemes = () => {
    setSearchParams({ tab: 'themes' });
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

    setSearchParams({ tab: 'crossovers', theme: franchiseTheme.id });
    // Scroll to top to show theme title
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs for Theme Browsing and Crossovers */}
        {!selectedTheme && (
          <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ tab: value })} className="w-full">
            <TabsList className="mb-6 w-full flex">
              <TabsTrigger value="themes" className="flex-1">Decks by Theme</TabsTrigger>
              <TabsTrigger value="crossovers" className="flex-1 flex flex-col">
                <span>Decks by Franchise</span>
                <span className="text-xs text-muted-foreground">(Universes Beyond)</span>
              </TabsTrigger>
              <TabsTrigger value="cardsets" className="flex-1 flex flex-col">
                <span>Cards with Special Art</span>
                <span className="text-xs text-muted-foreground">(Secret Lair)</span>
              </TabsTrigger>
            </TabsList>

            {/* Themes Tab */}
            <TabsContent value="themes" className="space-y-6">
              <p className="text-muted-foreground mb-4">
                Find decks that match your playstyle and favorite strategies
              </p>
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
            </TabsContent>

            {/* Crossovers Tab */}
            <TabsContent value="crossovers" className="space-y-6">
              <p className="text-muted-foreground mb-4">
                Explore crossover decks from your favorite franchises
              </p>
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
            </TabsContent>

            {/* Card Sets Tab - Secret Lair */}
            <TabsContent value="cardsets" className="space-y-6">
              <p className="text-muted-foreground mb-4">
                Collector cards and Secret Lairs featuring pop culture favorites
              </p>
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
            </TabsContent>
          </Tabs>
        )}

      {/* Filtered Decks Section */}
      {selectedTheme && (
        <div id="filtered-decks" className="space-y-6">
          {/* Back Button - Top Left */}
          <BackButton className="mb-4" />

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{selectedTheme.icon}</span>
              <h2 className="text-2xl font-bold">{selectedTheme.name}</h2>
            </div>
            <p className="text-muted-foreground">{selectedTheme.description}</p>
          </div>

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
        </div>
      )}
      </div>
    </div>
  );
};

export default Discover;
