import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardImageModal } from "@/components/CardImageModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import preconsData from "@/data/precons-data.json";
import { matchPrecons } from "@/utils/matcher";
import { deckELI5 } from "@/utils/deckDescriptions";
import { deckDifficulty } from "@/utils/deckDifficulty";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import { Sparkles, X, ChevronDown, ChevronUp, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const answers = location.state?.answers || [];
  const pathType = location.state?.path || "vibes";
  const customText = location.state?.customText || "";
  const isCustomInput = location.state?.isCustomInput || false;
  const selectedIP = location.state?.selectedIP || null;
  const source = location.state?.source || null; // 'vibes' | 'power' | 'surprise' | 'search'
  const searchQuery = location.state?.searchQuery || null;
  const precomputedMatches = location.state?.matchResults || null; // For search mode
  const [aiIntros, setAiIntros] = useState<string[]>([]);
  const [isLoadingIntros, setIsLoadingIntros] = useState(true);
  const [surpriseDecks, setSurpriseDecks] = useState<any[]>([]);
  const [matchReasons, setMatchReasons] = useState<string[]>([]);
  const [displayedDecks, setDisplayedDecks] = useState<any[]>([]);
  const [backupDecks, setBackupDecks] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  // Helper function to get random IP decks
  const getRandomIPDecks = () => {
    // Filter to only IP crossover decks (not magic_original)
    const ipDecks = preconsData.filter((deck: any) => deck.ip !== "magic_original");
    
    // Shuffle and select 3 random decks
    const shuffled = [...ipDecks].sort(() => Math.random() - 0.5);
    
    // Try to get 3 decks from different IPs if possible
    const selected: any[] = [];
    const usedIPs = new Set();
    
    for (const deck of shuffled) {
      if (selected.length >= 3) break;
      
      if (!usedIPs.has(deck.ip) || selected.length >= shuffled.length - 1) {
        selected.push(deck);
        usedIPs.add(deck.ip);
      }
    }
    
    // If we still don't have 3, fill with any remaining
    while (selected.length < 3 && selected.length < shuffled.length) {
      const deck = shuffled.find(d => !selected.includes(d));
      if (deck) selected.push(deck);
      else break;
    }
    
    return selected;
  };

  // Handle surprise mode
  useEffect(() => {
    if (source === 'surprise') {
      setSurpriseDecks(getRandomIPDecks());
    }
  }, []); // Only run once on mount

  // Convert answers array to preferences object based on path
  let userPreferences: any = {};
  
  if (pathType === "pop_culture") {
    // Pop Culture path: only need selectedIP
    userPreferences = {
      selectedIP: selectedIP || "magic_original"
    };
  } else if (pathType === "vibes") {
    const vibeAnswer = answers.find(a => a.questionId === "vibe")?.answerId || null;
    const creatureAnswer = answers.find(a => a.questionId === "creature-types")?.answerId || null;
    
    userPreferences = {
      vibe: vibeAnswer,
      creatureType: creatureAnswer,
      customText: isCustomInput ? customText : null,
    };
  } else if (pathType === "power") {
    const archetypeAnswer = answers.find(a => a.questionId === "archetype")?.answerId;
    const powerLevelAnswer = answers.find(a => a.questionId === "power-level")?.answerId;
    const colorPreferenceAnswer = answers.find(a => a.questionId === "color-preference")?.answerId;
    
    // Map power level answer to range
    const powerLevelRanges: Record<string, [number, number]> = {
      "beginner": [4, 6],
      "focused": [7, 8],
      "high-power": [9, 10],
    };
    
    userPreferences = {
      archetype: archetypeAnswer || null,
      powerLevelRange: powerLevelAnswer ? powerLevelRanges[powerLevelAnswer as string] : null,
      colorPreference: Array.isArray(colorPreferenceAnswer) && colorPreferenceAnswer.length > 0 ? colorPreferenceAnswer : null,
    };
  }

  // Get matched precons with path type (or use surprise decks or search results)
  const matchedResults = source === 'surprise' 
    ? surpriseDecks.map(precon => ({ precon, score: 0, reasons: [] }))
    : source === 'search' && precomputedMatches
    ? precomputedMatches.map((m: any) => ({ 
        precon: m.deck, 
        score: m.score, 
        reasons: [m.matchReason] 
      }))
     : matchPrecons(preconsData, userPreferences, pathType);
  
  // Initialize displayed and backup decks
  useEffect(() => {
    if (matchedResults.length > 0) {
      setDisplayedDecks(matchedResults.slice(0, 6));
      setBackupDecks(matchedResults.slice(6));
    }
  }, [matchedResults.length, surpriseDecks]);

  const topMatches = displayedDecks;

  // Generate AI deck intros on mount
  useEffect(() => {
    const generateIntros = async () => {
      if (topMatches.length === 0) {
        setIsLoadingIntros(false);
        return;
      }

      // For search mode, use precomputed match reasons from parser
      if (source === 'search' && precomputedMatches) {
        const reasons = precomputedMatches.map((m: any) => m.matchReason);
        setMatchReasons(reasons);
        setIsLoadingIntros(false);
        return;
      }

      // Regular intro generation for other modes
      try {
        const { data, error } = await supabase.functions.invoke('generate-deck-intros', {
          body: {
            matches: topMatches,
            userPreferences,
            pathType,
            customText,
            isCustomInput
          }
        });

        if (error) {
          console.error('Error generating deck intros:', error);
          toast({
            title: "Could not generate personalized intros",
            description: "Showing decks without personalized messages.",
            variant: "destructive",
          });
          setAiIntros([]);
        } else if (data?.intros) {
          setAiIntros(data.intros);
        }
      } catch (err) {
        console.error('Failed to call edge function:', err);
        setAiIntros([]);
      } finally {
        setIsLoadingIntros(false);
      }
    };

    generateIntros();
  }, []); // Run once on mount

  // Get user's input for personalization
  const getUserInputBullet = () => {
    if (pathType === "pop_culture" && selectedIP) {
      const ipNames: Record<string, string> = {
        walking_dead: "Walking Dead",
        stranger_things: "Stranger Things",
        transformers: "Transformers",
        street_fighter: "Street Fighter",
        fortnite: "Fortnite",
        jurassic_world: "Jurassic World",
        doctor_who: "Doctor Who",
        warhammer_40k: "Warhammer 40K",
        lord_of_the_rings: "Lord of the Rings",
        final_fantasy: "Final Fantasy",
        fallout: "Fallout",
        godzilla: "Godzilla",
        monty_python: "Monty Python",
        princess_bride: "Princess Bride",
        magic_original: "Classic Magic",
      };
      return `IP Universe: ${ipNames[selectedIP] || selectedIP}`;
    }
    
    if (pathType === "vibes") {
      const vibeAnswer = answers.find(a => a.questionId === "vibe");
      const creatureAnswer = answers.find(a => a.questionId === "creature-types");
      
      const vibeMap: Record<string, string> = {
        cute: "cute & cuddly",
        creepy: "creepy & dark",
        whimsical: "whimsical & magical",
        chaotic: "chaotic & funny",
        epic: "epic & heroic",
        nature: "nature & primal",
      };
      
      if (creatureAnswer?.answerId && creatureAnswer.answerId !== "Skip this question") {
        const creatures = Array.isArray(creatureAnswer.answerId) 
          ? creatureAnswer.answerId 
          : [creatureAnswer.answerId];
        
        if (creatures.length > 0) {
          return `You wanted ${creatures.join(", ")} - this deck delivers!`;
        }
      } else if (vibeAnswer?.answerId) {
        return `You wanted ${vibeMap[vibeAnswer.answerId] || vibeAnswer.answerId} vibes - perfect match!`;
      }
    } else if (pathType === "power") {
      const archetypeAnswer = answers.find(a => a.questionId === "archetype");
      const powerAnswer = answers.find(a => a.questionId === "power-level");
      
      const archetypeMap: Record<string, string> = {
        aggro: "aggressive",
        control: "controlling",
        combo: "combo",
        midrange: "midrange/value",
        political: "political",
      };
      
      const powerMap: Record<string, string> = {
        beginner: "beginner-friendly",
        focused: "focused",
        "high-power": "high-power",
      };
      
      const parts = [];
      if (archetypeAnswer?.answerId) {
        parts.push(archetypeMap[archetypeAnswer.answerId] || archetypeAnswer.answerId);
      }
      if (powerAnswer?.answerId) {
        parts.push(powerMap[powerAnswer.answerId] || powerAnswer.answerId);
      }
      
      if (parts.length > 0) {
        return `You wanted ${parts.join(", ")} - this matches your playstyle!`;
      }
    }
    
    return null;
  };
  
  const userInputBullet = getUserInputBullet();

  // Get commander card
  const getCommanderCard = (precon: any) => {
    return precon.cards?.find((card: any) => card.is_commander);
  };

  const getColorSymbol = (colorCode: string) => {
    const symbols: Record<string, string> = {
      W: "⚪",
      U: "🔵",
      B: "⚫",
      R: "🔴",
      G: "🟢",
    };
    return symbols[colorCode] || colorCode;
  };

  // Calculate relative match percentage based on RAW scores (before tiebreakers)
  const getMatchPercentage = (rawScore: number, index: number) => {
    if (matchedResults.length === 0 || source === 'surprise') return null;
    
    // Use rawScore from the best match (before tiebreakers)
    const bestRawScore = matchedResults[0]?.rawScore || 1;
    if (bestRawScore === 0) return null;
    
    // Calculate percentage - will never exceed 100%
    const percentage = Math.round((rawScore / bestRawScore) * 100);
    return percentage;
  };

  // Handle dismissing a deck
  const handleDismissDeck = (deckId: string) => {
    // Mark as dismissed
    setDismissedIds(prev => new Set([...prev, deckId]));
    
    // Remove from displayed
    const updatedDisplayed = displayedDecks.filter(d => d.precon.id !== deckId);
    
    // If we have backups, add the next one
    if (backupDecks.length > 0) {
      const nextDeck = backupDecks[0];
      setDisplayedDecks([...updatedDisplayed, nextDeck]);
      setBackupDecks(backupDecks.slice(1));
    } else {
      setDisplayedDecks(updatedDisplayed);
    }
  };

  // Toggle description expansion
  const toggleDescription = (deckId: string) => {
    setExpandedDescriptions(prev => {
      const next = new Set(prev);
      if (next.has(deckId)) {
        next.delete(deckId);
      } else {
        next.add(deckId);
      }
      return next;
    });
  };

  const handleShuffleAgain = () => {
    const newDecks = getRandomIPDecks();
    setSurpriseDecks(newDecks);
  };

  const handleGoBack = () => {
    // Determine prior flow: prefer explicit source, else infer from pathType
    const prior = source || pathType;

    if (prior === 'pop_culture') {
      navigate('/ip-selection');
      return;
    }

    if (prior === 'vibes') {
      navigate('/vibes-questions', {
        state: {
          fromResults: true,
          answers: answers.slice(0, -1), // Remove last answer so user can redo it
          currentQuestionIndex: Math.max(answers.length - 1, 0),
        },
      });
      return;
    }

    if (prior === 'power') {
      navigate('/power-questions', {
        state: {
          fromResults: true,
          answers: answers.slice(0, -1), // Remove last answer so user can redo it
          currentQuestionIndex: Math.max(answers.length - 1, 0),
        },
      });
      return;
    }

    // Fallback for surprise/search/unknown
    navigate('/');
  };

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-1 py-1">
      <div className="max-w-7xl mx-auto space-y-1">
        {/* Surprise Me Header */}
        {source === 'surprise' && topMatches.length > 0 && (
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2">
                    🎲 Surprise Me Results
                  </h2>
                  <p className="text-muted-foreground">
                    Here are 3 random decks from pop culture!
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleShuffleAgain}
                    className="gap-2"
                  >
                    🔄 Shuffle Again
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/")}
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Header */}
        {source === 'search' && searchQuery && topMatches.length > 0 && (
          <Card className="border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-primary/10 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2">
                    🔍 Search Results for "{searchQuery}"
                  </h2>
                  <p className="text-muted-foreground">
                    Here are your top matches:
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/")}
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header with Buttons (only show if not surprise or search mode) */}
        {source !== 'surprise' && source !== 'search' && (
          <div className="flex justify-between items-center animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {topMatches.length > 0 ? "Your Matches" : "No Perfect Matches"}
            </h2>
            {topMatches.length > 0 && (
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                  Start Over
                </Button>
                <Button variant="secondary" size="sm" onClick={handleGoBack}>
                  Go Back
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Matches Message */}
        {topMatches.length === 0 && (
          <Card className="max-w-2xl mx-auto border-2 border-primary/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl mb-4">🎴</div>
              <h3 className="text-2xl font-bold text-foreground">
                Hmm, we couldn't find a perfect match with those preferences.
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your choices or starting over to see more options!
              </p>
              <div className="flex gap-4 justify-center mt-6">
                <Button variant="hero" size="lg" onClick={() => navigate(pathType === "vibes" ? "/vibes-questions" : "/power-questions")}>
                  Adjust Preferences
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/")}>
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deck Cards - Only show if we have matches */}
        {topMatches.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {topMatches.map(({ precon, score, rawScore, reasons }, index) => {
              const commanderCard = getCommanderCard(precon);
              const difficultyInfo = deckDifficulty[precon.id];
              const imageUrl = commanderCard?.image_url && !isPlaceholderUrl(commanderCard.image_url)
                ? commanderCard.image_url
                : getScryfallImageUrl(precon.commander);
              const matchPercentage = getMatchPercentage(rawScore || score, index);
              const originalIndex = matchedResults.findIndex(m => m.precon.id === precon.id);
              
              const flavorText = deckELI5[precon.id] || `A powerful precon deck featuring ${precon.commander}. Description coming soon!`;
              const isExpanded = expandedDescriptions.has(precon.id);
              const needsExpansion = flavorText.length > 250; // Approximate 4 lines worth
              
              return (
            <Card
              key={precon.id}
              className="group hover:shadow-card-hover transition-all duration-300 border-2 relative flex flex-col h-full animate-fade-in overflow-hidden"
            >
              {/* X Dismiss Button - Always visible with 70% opacity */}
              <button
                onClick={() => handleDismissDeck(precon.id)}
                className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-muted/80 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 flex items-center justify-center opacity-70 hover:opacity-100"
                aria-label="Dismiss deck"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Match Reason (for search mode) */}
              {source === 'search' && matchReasons[originalIndex] && (
                <div className="bg-accent/10 border-b border-accent/20 p-1.5">
                  <p className="text-[10px] flex items-start gap-1.5 text-foreground">
                    <span className="text-sm flex-shrink-0">💡</span>
                    <span><strong>Match:</strong> {matchReasons[originalIndex]}</span>
                  </p>
                </div>
              )}

              {/* Personalized Intro Banner */}
              {aiIntros[originalIndex] && !isLoadingIntros && source !== 'search' && (
                <div className="bg-primary/10 border-b border-primary/20 p-1.5">
                  <p className="text-[10px] italic flex items-center gap-1.5 text-foreground">
                    <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                    <span>{aiIntros[originalIndex]}</span>
                  </p>
                </div>
              )}
              
              {/* Two-column layout: Image left, Metadata right */}
              <div className="grid grid-cols-[auto_1fr] gap-2 p-1.5">
                {/* Left Column: Card Image */}
                <div className="flex items-center justify-center">
                  <CardImageModal
                    imageUrl={imageUrl}
                    cardName={precon.commander}
                    deckName={precon.name}
                    triggerClassName="h-28 md:h-32 w-auto flex items-center justify-center bg-muted/30 rounded-md"
                    imageClassName="max-h-full w-auto object-contain rounded-md"
                  />
                </div>
                
                {/* Right Column: Metadata Stack */}
                <div className="flex flex-col justify-center space-y-0.5 text-xs">
                  {/* Match Percentage Line with Info Dialog */}
                  {matchPercentage !== null && source !== 'surprise' && (
                    <div className="text-amber-600 dark:text-amber-500 font-semibold text-[10px] flex items-center gap-1">
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
                            Matches are based on your inputs compared to 143 available MTG Commander decks. Each deck is weighted by how closely it matches what you're looking for.
                          </p>
                          <p className="text-xs leading-relaxed mt-2">
                            The top result is always 100% - meaning it's the closest match available, not necessarily perfect. Dismiss any deck to see the next best option!
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                  
                  {/* Price */}
                  <div className="text-muted-foreground font-semibold">
                    ${precon.year && precon.year >= 2024 ? "50-70" : "40-60"}
                  </div>
                  
                  {/* Commander with label */}
                  <div className="text-foreground">
                    <span className="font-semibold">Commander:</span> {precon.commander}
                  </div>
                  
                  {/* Colors */}
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Colors:</span>
                    <div className="flex gap-0.5">
                      {precon.colors.map((color) => (
                        <span key={color} className="text-sm">
                          {getColorSymbol(color)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Difficulty */}
                  {difficultyInfo ? (
                    <div className="text-muted-foreground text-[10px] leading-tight">
                      <span className="font-semibold">Difficulty:</span> {difficultyInfo.difficulty}/10 - {difficultyInfo.reason}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-[10px]">
                      <span className="font-semibold">Difficulty:</span> TBD
                    </div>
                  )}
                </div>
              </div>
              
              {/* Full-width bottom section */}
              <CardContent className="px-2 pb-2 pt-0 space-y-1.5 flex flex-col">
                {/* Deck Name - Second Largest */}
                <h3 className="text-lg font-bold leading-tight text-foreground">{precon.name}</h3>
                
                {/* Flavor Text - LARGEST and most prominent with expand/collapse */}
                <div>
                  <p className={`text-sm leading-snug text-foreground ${!isExpanded && needsExpansion ? 'line-clamp-4' : ''} ${!deckELI5[precon.id] ? 'italic text-muted-foreground' : ''}`}>
                    {flavorText}
                  </p>
                  {needsExpansion && (
                    <button
                      onClick={() => toggleDescription(precon.id)}
                      className="text-xs text-accent hover:text-accent/80 font-medium mt-1 flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>Less <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>More <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Buy Button */}
                <Button
                  variant="default"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-auto py-2 text-xs mt-auto"
                  onClick={() => {
                    const searchQuery = encodeURIComponent(precon.name + " commander deck");
                    window.open(`https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${searchQuery}&view=grid`, "_blank");
                  }}
                >
                  Buy This Deck
                </Button>
              </CardContent>
            </Card>
          );
        })}
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
};

export default Results;
