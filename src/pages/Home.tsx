import { MainNav } from "@/components/MainNav";
import { ShowcaseWall } from "@/components/ShowcaseWall";
import { PathCards } from "@/components/PathCards";
import { ChevronDown } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Main Navigation */}
      <MainNav />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground animate-fade-in">
            Discover what's possible in Magic
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore 148+ Commander decks & collector sets across every theme, strategy, and universe
          </p>
        </div>

        {/* Showcase Wall */}
        <div className="space-y-6">
          <ShowcaseWall deckCount={4} cardSetCount={2} />

          {/* Click prompt */}
          <div className="flex flex-col items-center gap-3 py-6 animate-fade-in">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ChevronDown className="w-5 h-5 animate-bounce" />
              <p className="text-sm font-medium">Click any item to learn more</p>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 border-t border-border/50" />

        {/* Path Cards Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Choose Your Path
            </h2>
            <p className="text-muted-foreground">
              How would you like to find your next Commander deck?
            </p>
          </div>

          <PathCards />
        </div>

        {/* Bottom Spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
};

export default Home;
