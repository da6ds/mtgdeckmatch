import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";
import type { CardSet } from "@/types/v2Types";
import preconsData from "@/data/precons-data.json";

interface CardSetDetailModalProps {
  cardSet: CardSet | null;
  open: boolean;
  onClose: () => void;
}

const availabilityConfig = {
  in_print: {
    label: "In Print",
    color: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
  },
  limited: {
    label: "Limited Availability",
    color: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  secondary_only: {
    label: "Secondary Market Only",
    color: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
  },
};

/**
 * Fetch card images from Scryfall for a list of card names
 */
const fetchCardImages = async (cardNames: string[]): Promise<Map<string, string>> => {
  const imageMap = new Map<string, string>();

  for (const cardName of cardNames) {
    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
      );
      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.image_uris?.normal || data.image_uris?.large || "";
        if (imageUrl) {
          imageMap.set(cardName, imageUrl);
        }
      }
      // Rate limiting: wait 100ms between requests (Scryfall allows 10/sec)
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to fetch image for ${cardName}:`, error);
    }
  }

  return imageMap;
};

/**
 * Get matching precon decks based on shared themeIds
 */
const getMatchingDecks = (cardSet: CardSet) => {
  if (!cardSet.themeIds || cardSet.themeIds.length === 0) return [];

  return preconsData
    .filter((deck: any) => {
      // Check if deck has any matching themeIds in its tags
      const deckThemes = [
        ...(deck.tags?.themes?.primary || []),
        ...(deck.tags?.archetype?.primary || []),
        ...(deck.tags?.aesthetic_vibe?.primary || []),
      ];

      return cardSet.themeIds.some((themeId) =>
        deckThemes.some((deckTheme: string) =>
          deckTheme.toLowerCase().includes(themeId.toLowerCase()) ||
          themeId.toLowerCase().includes(deckTheme.toLowerCase())
        )
      );
    })
    .slice(0, 6); // Show up to 6 matching decks
};

export const CardSetDetailModal = ({ cardSet, open, onClose }: CardSetDetailModalProps) => {
  const [cardImages, setCardImages] = useState<Map<string, string>>(new Map());
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    if (cardSet && cardSet.cards.length > 0 && open) {
      setLoadingImages(true);
      const cardNames = cardSet.cards.map(c => c.name).filter(Boolean);
      fetchCardImages(cardNames).then((images) => {
        setCardImages(images);
        setLoadingImages(false);
      });
    }
  }, [cardSet, open]);

  if (!cardSet) return null;

  const availabilityStyle = availabilityConfig[cardSet.availability];
  const matchingDecks = getMatchingDecks(cardSet);
  const tierLabel = cardSet.tier === 2 ? "Secret Lair" : "Commander Precon Line";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            {cardSet.name}
            <Badge variant="outline" className="text-sm">
              {tierLabel}
            </Badge>
          </DialogTitle>
          <p className="text-muted-foreground text-sm">{cardSet.franchise}</p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Card Set Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Released</p>
                  <p className="font-medium">{cardSet.releaseYear}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <Badge className={`text-xs ${availabilityStyle.color} border`}>
                    {availabilityStyle.label}
                  </Badge>
                </div>
                {cardSet.cardCount > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Precon Decks</p>
                    <p className="font-medium">{cardSet.cardCount} {cardSet.cardCount === 1 ? 'deck' : 'decks'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-sm text-foreground leading-relaxed">
                {cardSet.description}
              </p>
            </div>

            {/* Cards in Set */}
            {cardSet.cards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Cards in this set {loadingImages && <span className="text-xs text-muted-foreground">(Loading...)</span>}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {cardSet.cards.map((card) => {
                    const imageUrl = cardImages.get(card.name);
                    return (
                      <div key={card.name} className="text-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={card.name}
                            className="w-full rounded-lg border-2 border-border hover:border-primary/50 transition-all"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full aspect-[5/7] bg-muted/30 rounded-lg border-2 border-border flex items-center justify-center">
                            <p className="text-xs text-muted-foreground px-2 text-center">
                              {card.name}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Matching Decks */}
            {matchingDecks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Goes great in these decks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingDecks.map((deck: any) => (
                    <div
                      key={deck.id}
                      className="border-2 border-border rounded-lg p-3 hover:border-primary/50 transition-all"
                    >
                      <h4 className="font-semibold text-sm mb-1">{deck.commander}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{deck.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{deck.set}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Note */}
            {cardSet.availability === 'secondary_only' && (
              <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                <p className="text-sm">
                  <strong>Note:</strong> This product is no longer in print. You can find it on the secondary market through retailers like TCGPlayer.
                </p>
              </div>
            )}
            {cardSet.availability === 'limited' && (
              <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                <p className="text-sm">
                  <strong>Limited Availability:</strong> This product may have limited stock. Check with retailers for current availability.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => {
              const searchQuery = encodeURIComponent(cardSet.name);
              window.open(`https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${searchQuery}&view=grid`, "_blank");
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Check Availability
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
