import { MainNav } from "@/components/MainNav";
import { ShowcaseCarousel } from "@/components/ShowcaseCarousel";
import type { ShowcaseItem } from "@/components/ShowcaseCarouselCard";
import { useNavigate } from "react-router-dom";
import { getCuratedShowcaseItems } from "@/data/curated-showcase";
import { trackCtaClicked } from "@/lib/analytics";
import { usePageTitle } from "@/hooks/usePageTitle";

const Home = () => {
  usePageTitle("Find Your Perfect Magic Deck");
  const navigate = useNavigate();

  // Get curated showcase items - hand-picked "hook" cards
  const showcaseItems = getCuratedShowcaseItems();

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-12 pb-4">
        {/* Hero - Consolidated */}
        <section className="text-center pt-2 sm:pt-6 pb-2 px-4">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">
            You made it.{' '}
            <span className="block">You're discovering Magic: The Gathering.</span>
          </h1>
        </section>

        {/* Primary CTA - START */}
        <div className="my-3 sm:my-8 max-w-md mx-auto px-4">
          <button
            onClick={() => {
              trackCtaClicked("Start", "home");
              navigate('/start');
            }}
            className="w-full px-6 py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all text-center"
          >
            START
          </button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            See if MTG has your thing
          </p>
        </div>

        {/* Carousel */}
        <div className="mt-6 sm:mt-8">
          <p className="text-xs text-muted-foreground px-4 mb-2">
            Check these out →
          </p>
          <ShowcaseCarousel items={showcaseItems} onItemClick={handleItemClick} />
        </div>

        {/* Secondary CTA - DISCOVER (below carousel) */}
        <div className="mt-6 sm:mt-8 max-w-md mx-auto px-4 pb-8">
          <button
            onClick={() => {
              trackCtaClicked("Discover", "home");
              navigate('/discover');
            }}
            className="w-full px-6 py-3 sm:py-4 border-2 border-primary text-primary rounded-xl text-base sm:text-lg font-semibold hover:bg-primary/5 transition-all text-center"
          >
            DISCOVER
          </button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Browse all decks & cards
          </p>
        </div>
      </div>

    </div>
  );
};

export default Home;
