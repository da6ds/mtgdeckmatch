import { useMemo } from "react";
import { MainNav } from "@/components/MainNav";
import { ShowcaseCarousel } from "@/components/ShowcaseCarousel";
import type { ShowcaseItem } from "@/components/ShowcaseCarouselCard";
import { useNavigate } from "react-router-dom";
import { Sparkles, Wand2, BookOpen, Library, HelpCircle } from "lucide-react";
import { getCommanderCard } from "@/utils/deckHelpers";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import preconsData from "@/data/precons-data.json";
import cardSetsData from "@/data/card-sets.json";
import type { CardSet } from "@/types/v2Types";

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Home = () => {
  const navigate = useNavigate();

  // Load ALL decks and card sets, shuffle once on mount
  const showcaseItems = useMemo(() => {
    // Get ALL decks
    const allDecks = preconsData.map((deck) => {
      const commanderCard = getCommanderCard(deck);
      const imageUrl =
        commanderCard?.image_url && !isPlaceholderUrl(commanderCard.image_url)
          ? commanderCard.image_url
          : getScryfallImageUrl(deck.commander);

      return {
        id: deck.id,
        imageUrl,
        name: deck.name,
        productType: 'precon' as const,
        cardType: 'commander' as const,
        data: deck,
      };
    });

    // Get ALL card sets
    const allCardSets = (cardSetsData as CardSet[]).map((cardSet) => ({
      id: cardSet.id,
      imageUrl: cardSet.imageUrl,
      name: cardSet.name,
      productType: 'collector-set' as const,
      cardType: 'alternate-art' as const,
      data: cardSet,
    }));

    // Combine and shuffle
    const combined: ShowcaseItem[] = [...allDecks, ...allCardSets];
    return shuffleArray(combined);
  }, []); // Empty deps = shuffle once on mount

  const handleItemClick = (item: ShowcaseItem) => {
    if (item.productType === 'precon') {
      navigate(`/deck/${item.data.id}`);
    } else {
      navigate(`/card-set/${item.data.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Main Navigation */}
      <MainNav />

      {/* Main Content - Compact Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        {/* Hero - Welcoming Headline */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            You made it.
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            You're discovering Magic: The Gathering.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground/80 max-w-3xl mx-auto">
            Explore precon Commander decks and special edition cards — from Fallout to Furby, raccoons to Ryu, and Galadriel to Godzilla.
          </p>
        </div>

        {/* Carousel */}
        <ShowcaseCarousel items={showcaseItems} onItemClick={handleItemClick} />

        {/* Compact CTA Buttons */}
        <div className="mt-8 mb-6">
          <h2 className="text-base font-semibold text-center mb-3">Choose Your Path</h2>

          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
            {/* Discover Button */}
            <button
              onClick={() => navigate('/discover')}
              className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <div className="text-left">
                <div className="font-semibold text-sm">Discover</div>
                <div className="text-xs text-muted-foreground">Curated lists of decks and cards</div>
              </div>
            </button>

            {/* Play Button */}
            <button
              onClick={() => navigate('/play')}
              className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Wand2 className="w-4 h-4 text-blue-500" />
              <div className="text-left">
                <div className="font-semibold text-sm">Play</div>
                <div className="text-xs text-muted-foreground">Find your next deck</div>
              </div>
            </button>

            {/* Browse Button */}
            <button
              onClick={() => navigate('/browse')}
              className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Library className="w-4 h-4 text-orange-500" />
              <div className="text-left">
                <div className="font-semibold text-sm">Browse</div>
                <div className="text-xs text-muted-foreground">All decks and cards with filters</div>
              </div>
            </button>

            {/* Learn Button */}
            <button
              onClick={() => navigate('/learn')}
              className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <BookOpen className="w-4 h-4 text-green-500" />
              <div className="text-left">
                <div className="font-semibold text-sm">Learn</div>
                <div className="text-xs text-muted-foreground">Quick guide to playing MTG Commander</div>
              </div>
            </button>

            {/* New: I Have No Idea Where to Start Button */}
            <button
              onClick={() => navigate('/start')}
              className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary bg-primary/10 hover:bg-primary/20 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">I Have No Idea Where to Start</div>
                <div className="text-xs text-muted-foreground">See if Magic has your thing</div>
              </div>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
