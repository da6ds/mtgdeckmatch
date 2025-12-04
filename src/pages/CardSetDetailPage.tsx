import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardImageModal } from "@/components/CardImageModal";
import { DeckCard } from "@/components/DeckCard";
import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { Heart, ExternalLink } from "lucide-react";
import cardSetsData from "@/data/card-sets.json";
import preconsData from "@/data/precons-data.json";
import type { CardSet } from "@/types/v2Types";

const availabilityConfig = {
  in_print: {
    label: "In Print",
    color: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  limited: {
    label: "Limited Availability",
    color: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  },
  secondary_only: {
    label: "Secondary Market Only",
    color: "bg-red-500/20 text-red-700 dark:text-red-300",
  },
};

const CardSetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [savedSets, setSavedSets] = useState<string[]>([]);

  // Find card set by ID
  const cardSet = (cardSetsData as CardSet[]).find((cs: CardSet) => cs.id === id);

  if (!cardSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <MainNav />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="border-2 border-destructive/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl mb-4">🎴</div>
              <h1 className="text-2xl font-bold text-foreground">Card Set Not Found</h1>
              <p className="text-muted-foreground">
                The card set you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate("/browse")}>
                Browse All Card Sets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const availabilityStyle = availabilityConfig[cardSet.availability as keyof typeof availabilityConfig];
  const isSaved = savedSets.includes(cardSet.id);

  // Get related decks (decks that match the card set's themes)
  const getRelatedDecks = (): any[] => {
    if (!cardSet.themeIds || cardSet.themeIds.length === 0) return [];

    return preconsData
      .filter((deck: any) =>
        deck.tags?.themes?.primary?.some((theme: string) =>
          cardSet.themeIds.includes(theme)
        ) ||
        deck.tags?.archetype?.primary?.some((archetype: string) =>
          cardSet.themeIds.includes(archetype)
        )
      )
      .slice(0, 6);
  };

  // Get related card sets (same franchise or tier)
  const getRelatedSets = (): CardSet[] => {
    return (cardSetsData as CardSet[])
      .filter((set: CardSet) => set.id !== cardSet.id)
      .filter((set: CardSet) =>
        set.franchise === cardSet.franchise || set.tier === cardSet.tier
      )
      .slice(0, 6);
  };

  const relatedDecks = getRelatedDecks();
  const relatedSets = getRelatedSets();

  const toggleSave = () => {
    setSavedSets(prev =>
      prev.includes(cardSet.id)
        ? prev.filter(id => id !== cardSet.id)
        : [...prev, cardSet.id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <BackButton className="mb-4" />

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 mb-8">
          {/* Left Column: Representative Card Image */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[5/7] bg-muted/30 rounded-lg overflow-hidden">
              <CardImageModal
                imageUrl={cardSet.imageUrl}
                cardName={cardSet.name}
                deckName={cardSet.franchise}
                triggerClassName="w-full h-full"
                imageClassName="w-full h-full object-cover"
              />
            </div>

            {/* Save Button */}
            <Button
              variant={isSaved ? "default" : "outline"}
              size="lg"
              className="w-full"
              onClick={toggleSave}
            >
              <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
            </Button>

            {/* TCGPlayer Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={() => {
                const searchQuery = encodeURIComponent(cardSet.name);
                window.open(`https://www.tcgplayer.com/search/magic/product?q=${searchQuery}`, "_blank");
              }}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Buy on TCGPlayer
            </Button>
          </div>

          {/* Right Column: Card Set Info */}
          <div className="space-y-6">
            {/* Card Set Name */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{cardSet.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{cardSet.franchise}</p>

              {/* Tier Badge */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {cardSet.tier === 2 ? 'Secret Lair' : 'Universes Beyond'}
                </Badge>
                <Badge className={`text-sm ${availabilityStyle.color}`}>
                  {availabilityStyle.label}
                </Badge>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Released {cardSet.releaseYear}</span>
                {cardSet.cardCount > 0 && (
                  <>
                    <span>·</span>
                    <span>{cardSet.cardCount} {cardSet.cardCount === 1 ? 'card' : 'cards'}</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">About This Set</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cardSet.description}
                </p>
              </CardContent>
            </Card>

            {/* Themes */}
            {cardSet.themeIds && cardSet.themeIds.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Card Themes</h3>
                  <div className="flex flex-wrap gap-2">
                    {cardSet.themeIds.map((theme: string) => (
                      <Badge key={theme} variant="outline" className="text-sm">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Cards in This Set Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Cards in This Set</h2>

            {cardSet.cards && cardSet.cards.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cardSet.cards.map((card: { name: string }) => (
                  <Card key={card.name} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <p className="font-medium text-sm">{card.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="max-w-sm mx-auto">
                  <img
                    src={cardSet.imageUrl}
                    alt={cardSet.name}
                    className="w-full rounded-lg shadow-lg mb-4"
                  />
                </div>
                <p className="text-muted-foreground mb-4">
                  Full card list coming soon. View this set on Scryfall for complete card information.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Create Scryfall search query
                    const query = cardSet.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    window.open(`https://scryfall.com/search?q=${encodeURIComponent(cardSet.name)}`, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Scryfall
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Great For These Decks */}
        {relatedDecks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Great For These Decks</h2>
            <p className="text-muted-foreground mb-4">
              Commander decks that would benefit from cards in this set
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDecks.map((deck: any) => (
                <Link key={deck.id} to={`/deck/${deck.id}`}>
                  <DeckCard
                    precon={deck}
                    showDismiss={false}
                    showMatchPercentage={false}
                    showAIIntro={false}
                    linkToDetail={false}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Card Sets */}
        {relatedSets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Related Card Sets</h2>
            <p className="text-muted-foreground mb-4">
              Other Secret Lairs and Universes Beyond sets you might like
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedSets.map((set: CardSet) => (
                <Link key={set.id} to={`/card-set/${set.id}`}>
                  <Card className="group hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary/50 h-full">
                    <CardContent className="p-3 flex flex-col h-full">
                      {/* Card Image */}
                      <div className="relative aspect-[5/7] bg-muted/30 rounded-md overflow-hidden mb-2">
                        <img
                          src={set.imageUrl}
                          alt={set.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Set Name */}
                      <h3 className="text-sm font-semibold line-clamp-2 mb-1">{set.name}</h3>

                      {/* Franchise */}
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {set.franchise}
                      </p>

                      {/* Badge */}
                      <Badge variant="outline" className="text-xs w-fit">
                        {set.tier === 2 ? 'SL' : 'UB'}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSetDetailPage;
