import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardImageModal } from "@/components/CardImageModal";
import { DecklistView } from "@/components/DecklistView";
import { DeckCard } from "@/components/DeckCard";
import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { useSavedDecks } from "@/contexts/SavedDecksContext";
import { Heart, ExternalLink, List, Shuffle } from "lucide-react";
import { getCommanderCard, getColorSymbol, calculateDeckPrice } from "@/utils/deckHelpers";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import { deckDifficulty } from "@/utils/deckDifficulty";
import { getDecklistById, hasDeckllist } from "@/data/decklists";
import preconsData from "@/data/precons-data.json";

const DeckDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleDeck, isSaved } = useSavedDecks();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchParams] = useSearchParams();

  // Check if coming from Surprise Me
  const isFromSurprise = searchParams.get('from') === 'surprise';

  // Find deck by ID
  const deck = preconsData.find((d: any) => d.id === id);

  // Shuffle handler - get a different random deck
  const handleShuffle = () => {
    const otherDecks = preconsData.filter((d: any) => d.id !== id);
    const randomDeck = otherDecks[Math.floor(Math.random() * otherDecks.length)];
    navigate(`/deck/${randomDeck.id}?from=surprise`);
  };

  if (!deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <MainNav />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="border-2 border-destructive/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl mb-4">🎴</div>
              <h1 className="text-2xl font-bold text-foreground">Deck Not Found</h1>
              <p className="text-muted-foreground">
                The deck you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate("/browse")}>
                Browse All Decks
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get deck data
  const commanderCard = getCommanderCard(deck);
  const difficultyInfo = deckDifficulty[deck.id];
  const decklist = getDecklistById(deck.id);
  const hasDecklist = hasDeckllist(deck.id);

  // Get commander image
  const getImageUrl = () => {
    if (commanderCard?.image_url && !isPlaceholderUrl(commanderCard.image_url)) {
      return commanderCard.image_url;
    }
    return getScryfallImageUrl(deck.commander);
  };

  const imageUrl = getImageUrl();

  // Get related decks (same primary theme or archetype)
  const getRelatedDecks = (): any[] => {
    const primaryTheme = deck.tags?.themes?.primary?.[0];
    const archetype = deck.tags?.archetype?.primary?.[0];

    return preconsData
      .filter((d: any) => d.id !== deck.id)
      .filter((d: any) =>
        d.tags?.themes?.primary?.includes(primaryTheme) ||
        d.tags?.archetype?.primary?.includes(archetype)
      )
      .slice(0, 6);
  };

  const relatedDecks = getRelatedDecks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button and Shuffle */}
        <div className="flex items-center gap-3 mb-4">
          <BackButton fallbackPath="/play" />

          {/* Shuffle button - only shows when from Surprise Me */}
          {isFromSurprise && (
            <Button
              variant="outline"
              onClick={handleShuffle}
              className="flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Try Another
            </Button>
          )}
        </div>

        {/* Hero Section - Side by Side on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 mb-8">
          {/* Left Column: Commander Image */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[5/7] bg-muted/30 rounded-lg overflow-hidden">
              <CardImageModal
                imageUrl={imageUrl}
                cardName={deck.commander}
                deckName={deck.name}
                triggerClassName="w-full h-full"
                imageClassName="w-full h-full object-cover"
              />
            </div>

            {/* Save Button */}
            <Button
              variant={isSaved(deck.id) ? "default" : "outline"}
              size="lg"
              className="w-full"
              onClick={() => toggleDeck(deck.id)}
            >
              <Heart
                className={`w-5 h-5 mr-2 ${isSaved(deck.id) ? 'fill-current' : ''}`}
              />
              {isSaved(deck.id) ? 'Saved to Favorites' : 'Save to Favorites'}
            </Button>

            {/* TCGPlayer Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={() => {
                const searchQuery = encodeURIComponent(deck.name + " commander deck");
                window.open(`https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${searchQuery}&view=grid`, "_blank");
              }}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Buy on TCGPlayer (${calculateDeckPrice(deck.year)})
            </Button>
          </div>

          {/* Right Column: Deck Info */}
          <div className="space-y-6">
            {/* Deck Name */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{deck.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{deck.commander}</p>

              {/* Colors */}
              <div className="flex gap-2 mb-4">
                {deck.colors.map((color: string) => (
                  <span key={color} className="text-2xl">
                    {getColorSymbol(color)}
                  </span>
                ))}
              </div>

              {/* Theme Tags */}
              <div className="flex flex-wrap gap-2">
                {deck.tags?.themes?.primary?.map((theme: string) => (
                  <Badge key={theme} variant="secondary" className="text-sm">
                    {theme}
                  </Badge>
                ))}
                {deck.tags?.archetype?.primary?.map((archetype: string) => (
                  <Badge key={archetype} variant="outline" className="text-sm">
                    {archetype}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Commander Oracle Text */}
            {commanderCard?.oracle_text && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <span>👑</span>
                    Commander Ability
                  </h3>
                  <p className="text-sm text-muted-foreground italic leading-relaxed whitespace-pre-line">
                    {commanderCard.oracle_text}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Stats Grid */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">Deck Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Set</p>
                    <p className="font-medium">{deck.set}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Release Year</p>
                    <p className="font-medium">{deck.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Power Level</p>
                    <p className="font-medium">{deck.tags?.power_level || 'N/A'}/10</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className="font-medium">
                      {difficultyInfo ? `${difficultyInfo.difficulty}/10` : 'TBD'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Decklist Section with Tabs */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="decklist" disabled={!hasDecklist}>
                  <List className="w-4 h-4 mr-2" />
                  Full Decklist
                  {!hasDecklist && <span className="ml-2 text-xs">(Coming Soon)</span>}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About This Deck</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {deck.name} is a Commander precon deck featuring {deck.commander}.
                    {deck.tags?.complexity && (
                      <> This deck has a complexity rating of {deck.tags.complexity}.</>
                    )}
                  </p>

                  {!hasDecklist && (
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                      <List className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <h4 className="text-lg font-semibold mb-2">Full Decklist Coming Soon</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        We're working on adding complete decklists for all Commander precons.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => window.open(`https://edhrec.com/commanders/${deck.commander.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on EDHREC
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="decklist">
                {decklist && <DecklistView decklist={decklist} />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Decks */}
        {relatedDecks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Related Decks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDecks.map((relatedDeck: any) => (
                <Link key={relatedDeck.id} to={`/deck/${relatedDeck.id}`}>
                  <DeckCard
                    precon={relatedDeck}
                    showDismiss={false}
                    showMatchPercentage={false}
                    showAIIntro={false}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckDetailPage;
