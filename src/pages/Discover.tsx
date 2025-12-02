import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/PageHeader";
import { ThemeCard } from "@/components/ThemeCard";
import { DeckCard } from "@/components/DeckCard";
import { CardSetCard } from "@/components/CardSetCard";
import { DeckDetailModal } from "@/components/DeckDetailModal";
import { Sparkles, Home, ArrowLeft } from "lucide-react";
import { getAllThemes, filterDecksByTheme, countDecksPerTheme } from "@/utils/themeHelpers";
import preconsData from "@/data/precons-data.json";
import cardSetsData from "@/data/card-sets.json";
import type { Theme, CardSet } from "@/types/v2Types";

const Discover = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<any | null>(null);
  const [showDeckModal, setShowDeckModal] = useState(false);

  // Get all themes and deck counts
  const themes = useMemo(() => getAllThemes(), []);
  const deckCounts = useMemo(() => countDecksPerTheme(preconsData), []);

  // Get filtered decks if a theme is selected
  const filteredDecks = useMemo(() => {
    if (!selectedTheme) return [];
    return filterDecksByTheme(preconsData, selectedTheme);
  }, [selectedTheme]);

  // Get Universes Beyond card sets (tier 3)
  const universesBeyondSets = useMemo(() =>
    (cardSetsData as CardSet[]).filter(set => set.tier === 3).slice(0, 6),
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
    setSelectedTheme(theme);
    // Scroll to filtered decks section
    setTimeout(() => {
      document.getElementById('filtered-decks')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBackToThemes = () => {
    setSelectedTheme(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeckClick = (deck: any) => {
    setSelectedDeck(deck);
    setShowDeckModal(true);
  };

  return (
    <PageLayout className="p-1 py-1">
      <PageHeader
        title="Discover Magic"
        subtitle="Explore decks by theme, strategy, and universe"
        icon={<Sparkles className="w-5 h-5 md:w-6 md:h-6" />}
        actions={[
          {
            label: "Home",
            onClick: () => navigate("/"),
            variant: "outline",
            icon: <Home className="w-4 h-4" />,
          },
        ]}
      />

      {/* Theme Browsing Section */}
      {!selectedTheme && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Browse by Theme</h2>
            <p className="text-muted-foreground">
              Find decks that match your playstyle and favorite strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                deckCount={deckCounts[theme.id] || 0}
                onClick={() => handleThemeClick(theme)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filtered Decks Section */}
      {selectedTheme && (
        <div id="filtered-decks" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{selectedTheme.icon}</span>
                <h2 className="text-2xl font-bold">{selectedTheme.name}</h2>
              </div>
              <p className="text-muted-foreground">{selectedTheme.description}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleBackToThemes}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Themes
            </Button>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <p className="text-sm">
              <strong>{filteredDecks.length} {filteredDecks.length === 1 ? 'deck' : 'decks'}</strong> match this theme
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDecks.map((deck: any) => (
              <div key={deck.id} onClick={() => handleDeckClick(deck)}>
                <DeckCard
                  precon={deck}
                  showDismiss={false}
                  showMatchPercentage={false}
                  showAIIntro={false}
                />
              </div>
            ))}
          </div>

          {filteredDecks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No decks found for this theme.</p>
            </div>
          )}
        </div>
      )}

      {/* Universes Beyond Section */}
      {!selectedTheme && universesBeyondSets.length > 0 && (
        <div className="mt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Universes Beyond</h2>
            <p className="text-muted-foreground">
              Magic meets your favorite franchises - explore crossover precons
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universesBeyondSets.map(set => (
              <CardSetCard
                key={set.id}
                cardSet={set}
                deckCount={getDecksForSet(set.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Deck Detail Modal */}
      <DeckDetailModal
        deck={selectedDeck}
        open={showDeckModal}
        onClose={() => setShowDeckModal(false)}
      />
    </PageLayout>
  );
};

export default Discover;
