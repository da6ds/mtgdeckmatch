import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeckCard } from "@/components/DeckCard";
import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import preconsData from "@/data/precons-data.json";
import { matchPrecons } from "@/utils/matcher";
import { filterDecksByArtStyle, getChaoticEnergyDecks, getArtStyleDisplayName } from "@/utils/artPathHelpers";
import { Library } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { IP_NAMES } from "@/constants/ipConstants";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const answers = location.state?.answers || [];
  const pathType = location.state?.path || "vibes";
  const artStyle = location.state?.artStyle || null; // Art path selection
  const customText = location.state?.customText || "";
  const isCustomInput = location.state?.isCustomInput || false;
  const selectedIP = location.state?.selectedIP || null;
  const source = location.state?.source || null; // 'vibes' | 'power' | 'surprise' | 'search' | 'art'
  const searchQuery = location.state?.searchQuery || null;
  const precomputedMatches = location.state?.matchResults || null; // For search mode
  const [aiIntros, setAiIntros] = useState<string[]>([]);
  const [isLoadingIntros, setIsLoadingIntros] = useState(true);
  const [surpriseDecks, setSurpriseDecks] = useState<any[]>([]);
  const [matchReasons, setMatchReasons] = useState<string[]>([]);
  const [displayedDecks, setDisplayedDecks] = useState<any[]>([]);
  const [backupDecks, setBackupDecks] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

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
  } else if (pathType === "art") {
    // Art path: filter by art style
    userPreferences = {
      artStyle: artStyle
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
    const difficultyAnswer = answers.find(a => a.questionId === "difficulty")?.answerId;
    const themeAnswer = answers.find(a => a.questionId === "theme")?.answerId;

    userPreferences = {
      archetype: archetypeAnswer || null,
      difficulty: difficultyAnswer || null,
      theme: themeAnswer || null,
    };
  }

  // Get matched precons with path type (or use surprise decks or search results)
  let matchedResults;

  if (source === 'surprise') {
    matchedResults = surpriseDecks.map(precon => ({ precon, score: 0, reasons: [] }));
  } else if (source === 'search' && precomputedMatches) {
    matchedResults = precomputedMatches.map((m: any) => ({
      precon: m.deck,
      score: m.score,
      reasons: [m.matchReason]
    }));
  } else if (pathType === "art" && artStyle) {
    // Art path: use art style filtering
    if (artStyle === "wild-weird") {
      // Special handling: show chaotic energy decks
      const chaoticDecks = getChaoticEnergyDecks(preconsData);
      matchedResults = chaoticDecks.map(precon => ({ precon, score: 100, reasons: ["Chaotic energy match"] }));
    } else {
      // Regular art style filtering
      const filteredDecks = filterDecksByArtStyle(preconsData, artStyle);
      matchedResults = filteredDecks.map(precon => ({ precon, score: 100, reasons: ["Art style match"] }));
    }
  } else {
    matchedResults = matchPrecons(preconsData, userPreferences, pathType);
  }
  
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
      return `IP Universe: ${IP_NAMES[selectedIP] || selectedIP}`;
    }

    if (pathType === "art" && artStyle) {
      return `Art Style: ${getArtStyleDisplayName(artStyle)}`;
    }

    if (pathType === "vibes") {
      const vibeAnswer = answers.find(a => a.questionId === "vibe");
      const creatureAnswer = answers.find(a => a.questionId === "creature-types");
      
      const vibeMap: Record<string, string> = {
        // New gameplay styles
        "lots-of-little-guys": "lots of little guys",
        "few-big-guys": "a few big guys",
        "tricks-and-spells": "tricks & spells",
        "cheat-death": "cheat death",
        "konami-code": "↑↑↓↓←→←→ (combos)",
        "main-character-energy": "main character energy",
        // Legacy vibe options (backward compatibility)
        "dark-mysterious": "dark & mysterious",
        "epic-powerful": "epic & powerful",
        "playful-whimsical": "playful & whimsical",
        "fantasy-adventure": "fantasy & adventure",
        "sci-fi-tech": "sci-fi & tech",
        "nature-primal": "nature & primal",
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
      const difficultyAnswer = answers.find(a => a.questionId === "difficulty");
      const themeAnswer = answers.find(a => a.questionId === "theme");

      const archetypeMap: Record<string, string> = {
        "go-fast": "go fast",
        "take-control": "take control",
        "play-long-game": "play the long game",
        // Legacy mappings for backward compatibility
        aggro: "aggressive",
        control: "controlling",
        combo: "combo",
        midrange: "midrange/value",
        political: "political",
      };

      const difficultyMap: Record<string, string> = {
        easy: "easy to learn",
        medium: "some strategy",
        complex: "complex & rewarding",
      };

      const themeMap: Record<string, string> = {
        swarm: "swarm the board",
        "death-sacrifice": "death & sacrifice",
        artifacts: "artifacts & machines",
        grow: "grow & dominate",
        ramp: "ramp & big stuff",
        spells: "spells & control",
      };

      const parts = [];
      if (archetypeAnswer?.answerId) {
        parts.push(archetypeMap[archetypeAnswer.answerId] || archetypeAnswer.answerId);
      }
      if (difficultyAnswer?.answerId) {
        parts.push(difficultyMap[difficultyAnswer.answerId] || difficultyAnswer.answerId);
      }
      if (themeAnswer?.answerId) {
        parts.push(themeMap[themeAnswer.answerId] || themeAnswer.answerId);
      }

      if (parts.length > 0) {
        return `You wanted ${parts.join(", ")} - this matches your playstyle!`;
      }
    }
    
    return null;
  };
  
  const userInputBullet = getUserInputBullet();

  // Calculate relative match percentage based on RAW scores (before tiebreakers)
  const getMatchPercentage = (rawScore: number, index: number) => {
    if (matchedResults.length === 0 || source === 'surprise') return null;
    
    // Find the MAXIMUM rawScore across all matches (not just first deck)
    // This ensures percentage calculation is based on the actual best match score
    const maxRawScore = Math.max(...matchedResults.map(m => m.rawScore || m.score));
    if (maxRawScore === 0) return null;
    
    // Calculate percentage and CAP at 100%
    // Decks can have high rawScore but low finalScore due to tiebreakers
    const percentage = Math.min(100, Math.round((rawScore / maxRawScore) * 100));
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

    if (prior === 'vibes' || prior === 'art') {
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <MainNav />

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Back Button */}
          <BackButton fallbackPath="/play" className="mb-4" />

          {/* Surprise Me Header */}
          {source === 'surprise' && topMatches.length > 0 && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">🎲 Surprise Me Results</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                Here are 3 random decks from pop culture!
              </p>
              <button
                onClick={handleShuffleAgain}
                className="text-sm text-muted-foreground hover:text-primary mt-2 transition-colors"
              >
                🔄 Shuffle again →
              </button>
            </div>
          )}

          {/* Search Header */}
          {source === 'search' && searchQuery && topMatches.length > 0 && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">🔍 Search Results for "{searchQuery}"</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                Here are your top matches
              </p>
            </div>
          )}

          {/* Wild & Weird Educational Banner */}
          {pathType === "art" && artStyle === "wild-weird" && (
            <Card className="mb-6 border-2 border-purple-500/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎉</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      These are collector cards you can add to ANY deck!
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Furby, SpongeBob, and other wild crossovers are special art versions of existing cards called "Secret Lair."
                      You can buy them separately and add them to any deck you love!
                    </p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-semibold text-foreground">How it works:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>These cards are functionally identical to their regular versions</li>
                        <li>Buy Secret Lair drops separately from TCGPlayer or direct from Wizards</li>
                        <li>Swap them into any deck for extra personality</li>
                      </ul>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.open("https://www.tcgplayer.com/search/magic/product?q=secret+lair", "_blank")}
                      className="mb-4"
                    >
                      Browse Secret Lair Cards →
                    </Button>
                    <p className="text-sm font-semibold text-foreground">
                      Want a deck that matches this chaotic energy? Check these out:
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header with Selection Pills (only show if not surprise or search mode) */}
          {source !== 'surprise' && source !== 'search' && topMatches.length > 0 && (
            <div className="mb-6">
              {/* Selection Pills - show what user chose */}
              {pathType === 'vibes' && userPreferences.vibe && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Vibe pill - highlighted */}
                  <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/30">
                    {userPreferences.vibe.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>

                  {/* Creature type pills */}
                  {Array.isArray(userPreferences.creatureType) && userPreferences.creatureType.map((creature: string) => (
                    creature !== "Skip this question" && (
                      <span
                        key={creature}
                        className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm border border-border"
                      >
                        {creature.charAt(0).toUpperCase() + creature.slice(1)}
                      </span>
                    )
                  ))}
                </div>
              )}

              {/* Dynamic title with match count */}
              <h1 className="text-2xl font-bold text-foreground">
                {topMatches.length} {topMatches.length === 1 ? 'Deck Matches' : 'Decks Match'} Your Style
              </h1>

              {/* Start over - subtle text link */}
              <button
                onClick={() => navigate('/play')}
                className="text-sm text-muted-foreground hover:text-primary mt-2 transition-colors"
              >
                Start over with different preferences →
              </button>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {topMatches.map(({ precon, score, rawScore, reasons }, index) => {
              const matchPercentage = getMatchPercentage(rawScore || score, index);
              const originalIndex = matchedResults.findIndex(m => m.precon.id === precon.id);

              return (
                <DeckCard
                  key={precon.id}
                  precon={precon}
                  showDismiss={true}
                  showMatchPercentage={matchPercentage !== null && source !== 'surprise'}
                  matchPercentage={matchPercentage || undefined}
                  showAIIntro={!!aiIntros[originalIndex] && !isLoadingIntros && source !== 'search'}
                  aiIntro={aiIntros[originalIndex]}
                  matchReason={source === 'search' ? matchReasons[originalIndex] : undefined}
                  onDismiss={() => handleDismissDeck(precon.id)}
                />
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
