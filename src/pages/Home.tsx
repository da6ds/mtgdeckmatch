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

        {/* CTAs - Primary + Secondary */}
        <div className="space-y-2 my-3 sm:my-8 max-w-4xl mx-auto">
          {/* Primary CTA - I Have No Idea */}
          <button
            onClick={() => {
              trackCtaClicked("I Have No Idea Where to Start", "home");
              navigate('/start');
            }}
            className="w-full px-4 py-2.5 sm:px-6 sm:py-4 bg-primary text-primary-foreground rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all text-center"
          >
            <div className="mb-1">I Have No Idea Where to Start</div>
            <div className="text-xs font-normal opacity-80">See if MTG has your thing</div>
          </button>

          {/* Secondary CTAs - Discover & Play side by side */}
          <div className="grid grid-cols-2 gap-2">
            {/* Discover - outline style */}
            <button
              onClick={() => {
                trackCtaClicked("Discover", "home");
                navigate('/discover');
              }}
              className="px-3 py-2.5 sm:px-5 sm:py-4 border-2 border-primary text-primary rounded-xl text-sm sm:text-base font-semibold hover:bg-primary/5 transition-all text-center"
            >
              <div className="mb-1">Discover</div>
              <div className="text-xs font-normal opacity-70">Browse decks & cards</div>
            </button>

            {/* Play - outline style */}
            <button
              onClick={() => {
                trackCtaClicked("Play", "home");
                navigate('/play');
              }}
              className="px-3 py-2.5 sm:px-5 sm:py-4 border-2 border-primary text-primary rounded-xl text-sm sm:text-base font-semibold hover:bg-primary/5 transition-all text-center"
            >
              <div className="mb-1">Play</div>
              <div className="text-xs font-normal opacity-70">Find your deck</div>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="mt-6 sm:mt-8">
          <p className="text-xs text-muted-foreground px-4 mb-2">
            Check these out →
          </p>
          <ShowcaseCarousel items={showcaseItems} onItemClick={handleItemClick} />
        </div>
      </div>

    </div>
  );
};

export default Home;
