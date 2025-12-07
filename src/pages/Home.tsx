import { useMemo } from "react";
import { MainNav } from "@/components/MainNav";
import { ShowcaseCarousel } from "@/components/ShowcaseCarousel";
import type { ShowcaseItem } from "@/components/ShowcaseCarouselCard";
import { useNavigate } from "react-router-dom";
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

      {/* Main Content - Simplified Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4">
        {/* Hero - Consolidated */}
        <section className="text-center pt-4 sm:pt-6 pb-6 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            You made it. You're discovering Magic.
          </h1>
        </section>

        {/* Three CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-2 sm:gap-3 my-6 sm:my-8 max-w-4xl mx-auto">
          {/* Discover - outline style */}
          <button
            onClick={() => navigate('/discover')}
            className="flex-1 px-5 py-3 sm:px-6 sm:py-4 border-2 border-primary text-primary rounded-xl text-base font-semibold hover:bg-primary/5 transition-all text-center"
          >
            <div className="mb-1">Discover</div>
            <div className="text-sm font-normal opacity-70">Curated lists of decks and cool cards</div>
          </button>

          {/* I Have No Idea - filled/primary style */}
          <button
            onClick={() => navigate('/start')}
            className="flex-1 px-5 py-3 sm:px-6 sm:py-4 bg-primary text-primary-foreground rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all text-center"
          >
            <div className="mb-1">I Have No Idea Where to Start</div>
            <div className="text-sm font-normal opacity-80">See if MTG has your thing</div>
          </button>

          {/* Play - outline style */}
          <button
            onClick={() => navigate('/play')}
            className="flex-1 px-5 py-3 sm:px-6 sm:py-4 border-2 border-primary text-primary rounded-xl text-base font-semibold hover:bg-primary/5 transition-all text-center"
          >
            <div className="mb-1">Play</div>
            <div className="text-sm font-normal opacity-70">Find your next commander deck</div>
          </button>
        </div>

        {/* Carousel */}
        <ShowcaseCarousel items={showcaseItems} onItemClick={handleItemClick} />
      </div>

    </div>
  );
};

export default Home;
