import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CardImageModal } from "@/components/CardImageModal";
import { useSavedDecks } from "@/contexts/SavedDecksContext";
import { deckELI5 } from "@/utils/deckDescriptions";
import { deckDifficulty } from "@/utils/deckDifficulty";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import { getCommanderCard, getColorSymbol, calculateDeckPrice, getCommanderNameSizeClass, getDeckTitleSizeClass, getSetNameSizeClass } from "@/utils/deckHelpers";
import { Heart, X, Sparkles, Info } from "lucide-react";
import { trackDeckSaved, trackDeckUnsaved, trackAffiliateLinkClicked } from "@/lib/analytics";

interface DeckCardProps {
  precon: any;                    // Deck data object
  showDismiss?: boolean;          // Show X dismiss button (Results only)
  showMatchPercentage?: boolean;  // Show match % badge with info dialog
  matchPercentage?: number;       // Match percentage value (0-100)
  showAIIntro?: boolean;          // Show AI personalized intro banner
  aiIntro?: string;              // AI intro text content
  matchReason?: string;          // Match reason for search results
  onDismiss?: () => void;        // Dismiss button handler
  linkToDetail?: boolean;        // Enable click to navigate to detail page (default: true)
}

export const DeckCard = ({
  precon,
  showDismiss = false,
  showMatchPercentage = false,
  matchPercentage,
  showAIIntro = false,
  aiIntro,
  matchReason,
  onDismiss,
  linkToDetail = true,
}: DeckCardProps) => {
  const navigate = useNavigate();
  const { toggleDeck, isSaved } = useSavedDecks();

  const commanderCard = getCommanderCard(precon);
  const difficultyInfo = deckDifficulty[precon.id];

  // Enhanced image URL logic with logging
  // Note: Some Secret Lair cards (Fortnite, Princess Bride, Warhammer) may not be in
  // Scryfall's database and will display the MTG card back placeholder
  const getImageUrl = () => {
    // Try commander card image URL first
    if (commanderCard?.image_url && !isPlaceholderUrl(commanderCard.image_url)) {
      return commanderCard.image_url;
    }

    // Log when falling back to Scryfall API
    if (!commanderCard?.image_url || isPlaceholderUrl(commanderCard?.image_url)) {
      console.warn(`Using Scryfall fallback for: ${precon.commander} (${precon.name})`);
    }

    // Fall back to Scryfall API
    return getScryfallImageUrl(precon.commander);
  };

  const imageUrl = getImageUrl();
  const flavorText = deckELI5[precon.id] || `A powerful precon deck featuring ${precon.commander}. Description coming soon!`;

  const handleCardClick = () => {
    if (linkToDetail) {
      navigate(`/deck/${precon.id}`);
    }
  };

  return (
    <Card
      className={`group hover:shadow-card-hover transition-all duration-300 border-2 relative flex flex-col h-full animate-fade-in overflow-hidden ${linkToDetail ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      {/* Heart Save Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Track before toggling since we need current state
          if (isSaved(precon.id)) {
            trackDeckUnsaved(precon.id);
          } else {
            trackDeckSaved(precon.id, precon.name);
          }
          toggleDeck(precon.id);
        }}
        className={`absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-md transition-all duration-200 ${
          isSaved(precon.id) ? "" : "hover:scale-105"
        }`}
        aria-label={isSaved(precon.id) ? "Remove from saved" : "Save deck"}
      >
        <Heart className={`w-5 h-5 ${isSaved(precon.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
      </button>

      {/* X Dismiss Button - Conditional */}
      {showDismiss && onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute top-12 right-2 z-20 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-red-500 hover:text-white shadow-md transition-all duration-200"
          aria-label="Dismiss deck"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Match Reason Banner (for search mode) */}
      {matchReason && (
        <div className="bg-accent/10 border-b border-accent/20 p-1.5">
          <p className="text-[10px] flex items-start gap-1.5 text-foreground">
            <span className="text-sm flex-shrink-0">💡</span>
            <span><strong>Match:</strong> {matchReason}</span>
          </p>
        </div>
      )}

      {/* Personalized AI Intro Banner */}
      {showAIIntro && aiIntro && (
        <div className="bg-primary/10 border-b border-primary/20 p-1.5">
          <p className="text-[10px] italic flex items-center gap-1.5 text-foreground">
            <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
            <span>{aiIntro}</span>
          </p>
        </div>
      )}

      {/* Two-column layout: Image left, Metadata right */}
      <div className="grid grid-cols-[auto_1fr] gap-2 p-1.5">
        {/* Left Column: Card Image */}
        <div className="flex items-center justify-center w-36">
          <CardImageModal
            imageUrl={imageUrl}
            cardName={precon.commander}
            deckName={precon.name}
            triggerClassName="w-full aspect-[5/7] flex items-center justify-center bg-muted/30 rounded-md"
            imageClassName="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Right Column: Metadata Stack */}
        <div className="flex flex-col justify-center space-y-1 min-w-0 pr-12">
          {/* Match Percentage Line with Info Dialog */}
          {showMatchPercentage && matchPercentage !== null && matchPercentage !== undefined && (
            <div className="text-amber-600 dark:text-amber-500 font-semibold text-[10px] flex items-center gap-1 mb-1">
              <span>{matchPercentage}% Match</span>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="inline-flex items-center justify-center hover:bg-accent rounded-full p-0.5 transition-colors"
                    type="button"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[280px] p-4">
                  <p className="text-xs leading-relaxed">
                    Matches are based on your inputs compared to <a href="https://cardgamebase.com/commander-precons/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">148+ available Magic: The Gathering Commander Decks</a>. Each deck is weighted by how closely it matches what you're looking for.
                  </p>
                  <p className="text-xs leading-relaxed mt-2">
                    The top result is always 100% - meaning it's the closest match available, not necessarily perfect. Dismiss any deck to see the next best option!
                  </p>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Commander Name - PRIMARY */}
          <div className="min-h-[2.5rem]">
            <h3 className={`${getCommanderNameSizeClass(precon.commander)} text-foreground leading-tight break-words`}>
              {precon.commander}
            </h3>
          </div>

          {/* Deck Title - SECONDARY */}
          <div className="min-h-[1.5rem]">
            <p className={`${getDeckTitleSizeClass(precon.name)} text-muted-foreground leading-tight break-words`}>
              {precon.name}
            </p>
          </div>

          {/* Colors - inline emoji circles */}
          <div className="flex gap-1 my-1">
            {precon.colors.map((color: string) => (
              <span key={color} className="text-sm">
                {getColorSymbol(color)}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="text-sm font-semibold text-muted-foreground">
            ${calculateDeckPrice(precon.year)}
          </div>

          {/* Power & Difficulty - Side by Side */}
          <div className="flex items-center justify-between py-2 border-t border-b border-border/50 my-1">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Power:</span>
              <span className="text-sm font-medium text-foreground">
                {precon.tags?.power_level || 'N/A'}/10
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              <span className="text-sm font-medium text-foreground">
                {difficultyInfo ? `${difficultyInfo.difficulty}/10` : 'TBD'}
              </span>
            </div>
          </div>

          {/* Set Name - de-emphasized */}
          <p className={`${getSetNameSizeClass(precon.set)} text-muted-foreground break-words`}>
            {precon.set}
          </p>
        </div>
      </div>

      {/* Full-width bottom section */}
      <CardContent className="px-2 pb-2 pt-2 space-y-2 flex flex-col flex-1">
        {/* Flavor Text */}
        <div className="min-h-[80px] max-h-[100px] overflow-hidden flex-1">
          <p className={`text-sm leading-relaxed text-foreground ${!deckELI5[precon.id] ? 'italic text-muted-foreground' : ''}`}>
            {flavorText}
          </p>
        </div>

        {/* Buy Button - pinned to bottom */}
        <Button
          variant="default"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-auto py-2 text-xs mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            trackAffiliateLinkClicked(precon.id, "deck_card");
            const searchQuery = encodeURIComponent(precon.name + " commander deck");
            window.open(`https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${searchQuery}&view=grid`, "_blank");
          }}
        >
          Buy This Deck
        </Button>
      </CardContent>
    </Card>
  );
};
