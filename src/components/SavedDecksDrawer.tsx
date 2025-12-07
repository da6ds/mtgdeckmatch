import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Heart } from "lucide-react";
import { useSavedDecks } from "@/contexts/SavedDecksContext";
import preconsData from "@/data/precons-data.json";
import { CardImageModal } from "@/components/CardImageModal";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import { getCommanderCard, getColorSymbol } from "@/utils/deckHelpers";

interface SavedDecksDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SavedDecksDrawer = ({ isOpen, onOpenChange }: SavedDecksDrawerProps) => {
  const { savedDeckIds, removeDeck, clearAll } = useSavedDecks();

  // Get full deck objects from IDs
  const savedDecks = savedDeckIds
    .map((id) => preconsData.find((deck: any) => deck.id === id))
    .filter(Boolean);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Saved Decks ({savedDeckIds.length})
            </SheetTitle>
            <SheetDescription>
              Decks you've saved for comparison and consideration
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {savedDecks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium mb-2">No decks saved yet</p>
                <p className="text-sm">
                  Click the heart icon on any deck to save it here
                </p>
              </div>
            ) : (
              <>
                {savedDecks.map((precon: any) => {
                  const commanderCard = getCommanderCard(precon);
                  const imageUrl =
                    commanderCard?.image_url && !isPlaceholderUrl(commanderCard.image_url)
                      ? commanderCard.image_url
                      : getScryfallImageUrl(precon.commander);

                  return (
                    <div
                      key={precon.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow relative"
                    >
                      {/* Remove Button */}
                      <button
                        onClick={() => removeDeck(precon.id)}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 flex items-center justify-center"
                        aria-label="Remove from saved"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      <div className="grid grid-cols-[auto_1fr] gap-3">
                        {/* Card Image */}
                        <CardImageModal
                          imageUrl={imageUrl}
                          cardName={precon.commander}
                          deckName={precon.name}
                          triggerClassName="h-24 w-auto flex items-center justify-center"
                          imageClassName="max-h-full w-auto object-contain rounded-md"
                        />

                        {/* Deck Info */}
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm leading-tight">{precon.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {precon.commander}
                          </p>
                          <div className="flex items-center gap-1 text-xs">
                            {precon.colors.map((color: string) => (
                              <span key={color}>{getColorSymbol(color)}</span>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2 h-7 text-xs"
                            onClick={() => {
                              const searchQuery = encodeURIComponent(
                                precon.name + " commander deck"
                              );
                              window.open(
                                `https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${searchQuery}&view=grid`,
                                "_blank"
                              );
                            }}
                          >
                            View on TCGPlayer
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Clear All Button */}
                <div className="pt-4 border-t flex gap-2">
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
  );
};
