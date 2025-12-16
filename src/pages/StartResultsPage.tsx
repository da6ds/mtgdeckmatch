import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInterestById, curatedCardSetIds, curatedDeckIds } from "@/data/interest-mappings";
import {
  getCardSetsForInterest,
  getDecksForInterest,
  hasResults,
  getNoResultsMessage,
  type Deck,
} from "@/utils/interestFilters";
import { getCommanderCard } from "@/utils/deckHelpers";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import preconsData from "@/data/precons-data.json";
import cardSetsData from "@/data/card-sets.json";
import type { CardSet } from "@/types/v2Types";
import { usePageTitle } from "@/hooks/usePageTitle";

const StartResultsPage = () => {
  const { interestId } = useParams<{ interestId: string }>();
  const navigate = useNavigate();

  // Find the interest
  const interest = interestId ? getInterestById(interestId) : undefined;

  // Set page title with interest label
  usePageTitle(interest?.label ? `${interest.label} - Results` : "Interest Results");

  if (!interest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Interest not found</h1>
          <Button onClick={() => navigate("/start")}>Back to Interests</Button>
        </div>
      </div>
    );
  }

  // Handle "surprise-me" special case
  const isSurpriseMe = interest.specialBehavior === 'curated-mix';

  // Filter card sets and decks
  let filteredCardSets: CardSet[];
  let filteredDecks: Deck[];

  if (isSurpriseMe) {
    // Show curated mix for "Just Show Me Cool Stuff"
    filteredCardSets = (cardSetsData as CardSet[]).filter(set =>
      curatedCardSetIds.includes(set.id)
    );
    filteredDecks = (preconsData as unknown as Deck[]).filter(deck =>
      curatedDeckIds.includes(deck.id)
    );
  } else {
    // Normal filtering
    filteredCardSets = getCardSetsForInterest(
      interest,
      cardSetsData as CardSet[]
    );
    filteredDecks = getDecksForInterest(
      interest,
      preconsData as unknown as Deck[]
    );
  }

  // Check if we have results
  const showResults = hasResults(filteredCardSets, filteredDecks);

  // Fallback: show popular decks if no results
  const displayDecks = filteredDecks.length > 0
    ? filteredDecks
    : (preconsData as unknown as Deck[]).slice(0, 6); // Show first 6 as fallback

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Row with Back Button */}
        <div className="grid grid-cols-3 items-center mb-8">
          <button
            onClick={() => navigate("/start")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div />
          <div />
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {isSurpriseMe ? "The Best of Magic" : "Magic has your thing."}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            {isSurpriseMe ? "A little bit of everything" : `Here's ${interest.label} stuff:`}
          </p>
        </div>

        {/* Section 1: Cool Cards (Card Sets) */}
        {filteredCardSets.length > 0 && (
          <div className="mb-16">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Cool Cards</h2>
              <p className="text-muted-foreground">(collector's items)</p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {filteredCardSets.slice(0, 12).map((cardSet) => (
                <button
                  key={cardSet.id}
                  onClick={() => navigate(`/card-set/${cardSet.id}`)}
                  className="flex-shrink-0 w-64 group"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[5/7] transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <img
                      src={cardSet.imageUrl}
                      alt={cardSet.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {cardSet.name}
                      </h3>
                      <p className="text-white/80 text-sm line-clamp-2">
                        {cardSet.franchise}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredCardSets.length > 12 && (
              <div className="text-center mt-4">
                <Button variant="outline" onClick={() => navigate("/discover")}>
                  See All Card Sets
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Section 2: Playable Decks */}
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Playable Decks</h2>
            <p className="text-muted-foreground">
              {filteredDecks.length > 0
                ? "(ready to play out of the box)"
                : getNoResultsMessage(interest.label)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDecks.slice(0, 9).map((deck) => {
              const commanderCard = getCommanderCard(deck);
              const imageUrl =
                commanderCard?.image_url &&
                !isPlaceholderUrl(commanderCard.image_url)
                  ? commanderCard.image_url
                  : getScryfallImageUrl(deck.commander);

              return (
                <button
                  key={deck.id}
                  onClick={() => navigate(`/deck/${deck.id}`)}
                  className="group"
                >
                  <div className="bg-card rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl h-[550px] flex flex-col">
                    {/* Commander Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={deck.commander}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Deck Name */}
                      <h3 className="font-bold text-lg mb-2 min-h-[3rem] flex items-start">
                        {deck.name}
                      </h3>

                      {/* Oracle Text */}
                      {commanderCard?.oracle_text && (
                        <p className="text-sm text-muted-foreground italic mb-3 line-clamp-6 min-h-[5rem]">
                          {commanderCard.oracle_text}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="text-sm text-muted-foreground space-y-1 mb-4">
                        <p>Set: {deck.set}</p>
                        <p>Commander: {deck.commander}</p>
                        {deck.tags.power_level && (
                          <p>Power Level: {deck.tags.power_level}/10</p>
                        )}
                      </div>

                      {/* Spacer to push button to bottom */}
                      <div className="flex-1" />

                      {/* Buy Button */}
                      <Button
                        variant="default"
                        className="w-full mt-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${encodeURIComponent(
                              deck.name
                            )}&view=grid`,
                            "_blank"
                          );
                        }}
                      >
                        Buy This Deck
                      </Button>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {displayDecks.length > 9 && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => navigate("/browse")}>
                See All Decks
              </Button>
            </div>
          )}
        </div>

        {/* Section 3: Soft Conversion CTA */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <Lightbulb className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Want to actually play with this stuff?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            These decks are ready out of the box - no assembly required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/play")}
              className="min-w-[200px]"
            >
              Help Me Pick a Deck
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/learn")}
              className="min-w-[200px]"
            >
              Learn How to Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartResultsPage;
