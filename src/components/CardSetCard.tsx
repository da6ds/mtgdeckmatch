import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardImageModal } from "@/components/CardImageModal";
import type { CardSet } from "@/types/v2Types";

interface CardSetCardProps {
  cardSet: CardSet;
  deckCount?: number;
  onClick?: () => void;
  variant?: "default" | "compact" | "browse";
  icon?: string;
  imageUrl?: string; // For browse variant, passed from parent with fetched Scryfall URL
  linkToDetail?: boolean; // Enable click to navigate to detail page (default: true for browse variant)
}

const availabilityConfig = {
  in_print: {
    label: "In Print",
    color: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  limited: {
    label: "Limited",
    color: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  },
  secondary_only: {
    label: "Secondary Market",
    color: "bg-red-500/20 text-red-700 dark:text-red-300",
  },
};

export const CardSetCard = ({ cardSet, deckCount, onClick, variant = "default", icon, imageUrl, linkToDetail = true }: CardSetCardProps) => {
  const navigate = useNavigate();
  const availabilityStyle = availabilityConfig[cardSet.availability];

  const handleCardClick = () => {
    if (linkToDetail && variant === "browse") {
      navigate(`/card-set/${cardSet.id}`);
    } else if (onClick) {
      onClick();
    }
  };

  // Browse variant - horizontal layout matching DeckCard
  if (variant === "browse") {
    const displayImageUrl = imageUrl || cardSet.imageUrl || "https://cards.scryfall.io/large/back/0/0/0aeebaf5-8c7d-4636-9e82-8c27447861f7.jpg";

    return (
      <Card
        className={`group hover:shadow-card-hover transition-all duration-300 border-2 relative flex flex-col animate-fade-in overflow-hidden ${linkToDetail ? 'cursor-pointer' : ''}`}
        onClick={handleCardClick}
      >
        {/* Two-column layout: Image left, Metadata right */}
        <div className="grid grid-cols-[auto_1fr] gap-2 p-1.5">
          {/* Left Column: Card Set Image */}
          <div className="flex items-center justify-center w-36">
            <CardImageModal
              imageUrl={displayImageUrl}
              cardName={cardSet.name}
              deckName={cardSet.franchise}
              triggerClassName="w-full aspect-[5/7] flex items-center justify-center bg-muted/30 rounded-md"
              imageClassName="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Right Column: Metadata Stack */}
          <div className="flex flex-col justify-center space-y-1 min-w-0 pr-4">
            {/* Card Set Name - PRIMARY */}
            <div className="min-h-[2.5rem]">
              <h3 className="text-lg font-bold text-foreground leading-tight break-words">
                {cardSet.name}
              </h3>
            </div>

            {/* Franchise - SECONDARY */}
            <div className="min-h-[1.5rem]">
              <p className="text-sm text-muted-foreground leading-tight break-words">
                {cardSet.franchise}
              </p>
            </div>

            {/* Tier Badge */}
            <div className="flex items-center gap-2 my-1">
              <Badge variant="outline" className="text-xs">
                {cardSet.tier === 2 ? "Secret Lair" : "Universes Beyond"}
              </Badge>
              <Badge className={`text-xs ${availabilityStyle.color}`}>
                {availabilityStyle.label}
              </Badge>
            </div>

            {/* Release Year & Card Count */}
            <div className="flex items-center justify-between py-2 border-t border-b border-border/50 my-1">
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Released:</span>
                <span className="text-sm font-medium text-foreground">
                  {cardSet.releaseYear}
                </span>
              </div>
              {cardSet.cardCount > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Cards:</span>
                  <span className="text-sm font-medium text-foreground">
                    {cardSet.cardCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <CardContent className="px-4 pb-4 pt-2 space-y-2 flex-1 flex flex-col">
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-1">
            {cardSet.description}
          </p>

          {/* Buy Button */}
          <Button
            variant="hero"
            size="lg"
            className="w-full mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.tcgplayer.com/search/magic/product?q=${encodeURIComponent(cardSet.name)}`, '_blank');
            }}
          >
            View on TCGPlayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Compact variant matches ThemeCard structure
  if (variant === "compact") {
    return (
      <Card
        className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary/50"
        onClick={onClick}
      >
        <CardContent className="p-3 flex flex-col items-center text-center space-y-2">
          {/* Icon */}
          <div className="text-2xl mb-0.5 group-hover:scale-110 transition-transform duration-300">
            {icon || '🎮'}
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-foreground">
            {cardSet.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {cardSet.description}
          </p>

          {/* Deck Count Badge */}
          {deckCount !== undefined && (
            <div className="pt-1 border-t border-border/50 w-full">
              <p className="text-xs font-medium text-primary">
                {deckCount} {deckCount === 1 ? 'deck' : 'decks'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant (original detailed design)
  return (
    <Card
      className={`group transition-all duration-300 border-2 ${
        onClick ? "cursor-pointer hover:shadow-card-hover hover:border-primary/50" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {cardSet.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {cardSet.franchise}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            Tier {cardSet.tier}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground leading-relaxed">
          {cardSet.description}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Released</p>
            <p className="text-sm font-medium">{cardSet.releaseYear}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Availability</p>
            <Badge className={`text-xs ${availabilityStyle.color}`}>
              {availabilityStyle.label}
            </Badge>
          </div>
        </div>

        {/* Deck Count */}
        {deckCount !== undefined && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-sm font-semibold text-primary">
              {deckCount} precon {deckCount === 1 ? "deck" : "decks"} available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
