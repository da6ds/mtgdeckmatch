import { MainNav } from "@/components/MainNav";
import { ShowcaseCarousel } from "@/components/ShowcaseCarousel";
import type { ShowcaseItem } from "@/components/ShowcaseCarouselCard";
import { useNavigate } from "react-router-dom";
import { getCuratedShowcaseItems } from "@/data/curated-showcase";

const Home = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4">
        {/* Hero - Consolidated */}
        <section className="text-center pt-4 sm:pt-6 pb-6 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            You made it. You're discovering Magic.
          </h1>
        </section>

        {/* CTAs - Primary + Secondary */}
        <div className="space-y-3 my-6 sm:my-8 max-w-4xl mx-auto">
          {/* Primary CTA - I Have No Idea */}
          <button
            onClick={() => navigate('/start')}
            className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-primary text-primary-foreground rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all text-center"
          >
            <div className="mb-1">I Have No Idea Where to Start</div>
            <div className="text-sm font-normal opacity-80">See if MTG has your thing</div>
          </button>

          {/* Secondary CTAs - Discover & Play side by side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Discover - outline style */}
            <button
              onClick={() => navigate('/discover')}
              className="px-4 py-3 sm:px-5 sm:py-4 border-2 border-primary text-primary rounded-xl text-base font-semibold hover:bg-primary/5 transition-all text-center"
            >
              <div className="mb-1">Discover</div>
              <div className="text-sm font-normal opacity-70">Browse decks & cards</div>
            </button>

            {/* Play - outline style */}
            <button
              onClick={() => navigate('/play')}
              className="px-4 py-3 sm:px-5 sm:py-4 border-2 border-primary text-primary rounded-xl text-base font-semibold hover:bg-primary/5 transition-all text-center"
            >
              <div className="mb-1">Play</div>
              <div className="text-sm font-normal opacity-70">Find your deck</div>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="my-6">
          <p className="text-sm text-muted-foreground px-4 mb-2">
            Check these out →
          </p>
          <ShowcaseCarousel items={showcaseItems} onItemClick={handleItemClick} />
        </div>
      </div>

    </div>
  );
};

export default Home;
