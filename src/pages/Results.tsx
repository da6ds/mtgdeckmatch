import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardImageModal } from "@/components/CardImageModal";
import preconsData from "@/data/precons-data.json";
import { matchPrecons } from "@/utils/matcher";
import { deckELI5 } from "@/utils/deckDescriptions";
import { deckDifficulty } from "@/utils/deckDifficulty";
import { getScryfallImageUrl, isPlaceholderUrl } from "@/utils/cardImageUtils";
import { Sparkles } from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers || [];
  const pathType = location.state?.path || "vibes";

  // Convert answers array to preferences object based on path
  let userPreferences = {};
  
  if (pathType === "vibes") {
    userPreferences = {
      vibe: answers.find(a => a.questionId === "vibe")?.answerId || null,
      creatureType: answers.find(a => a.questionId === "creature-types")?.answerId || null,
    };
  } else if (pathType === "power") {
    const archetypeAnswer = answers.find(a => a.questionId === "archetype")?.answerId;
    const powerLevelAnswer = answers.find(a => a.questionId === "power-level")?.answerId;
    
    // Map power level answer to range
    const powerLevelRanges: Record<string, [number, number]> = {
      "beginner": [4, 6],
      "focused": [7, 8],
      "high-power": [9, 10],
    };
    
    userPreferences = {
      archetype: archetypeAnswer || null,
      powerLevelRange: powerLevelAnswer ? powerLevelRanges[powerLevelAnswer as string] : null,
    };
  }

  // Get matched precons with path type
  const matchedResults = matchPrecons(preconsData, userPreferences, pathType);
  
  // Show only top 3 matches
  const topMatches = matchedResults.slice(0, 3);

  // Get user's input for personalization
  const getUserInputBullet = () => {
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
        return `You wanted ${creatureAnswer.answerId} - this deck delivers!`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-3 py-3">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header - Ultra Compact */}
        <div className="text-center animate-fade-in">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {topMatches.length > 0 ? "Your Perfect Decks" : "No Perfect Matches"}
          </h2>
        </div>

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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {topMatches.map(({ precon, score, reasons }, index) => {
              const commanderCard = getCommanderCard(precon);
              const difficultyInfo = deckDifficulty[precon.id];
              const imageUrl = commanderCard?.image_url && !isPlaceholderUrl(commanderCard.image_url)
                ? commanderCard.image_url
                : getScryfallImageUrl(precon.commander);
              
              return (
            <Card
              key={precon.id}
              className="group hover:shadow-card-hover transition-all duration-300 border-2 relative overflow-hidden flex flex-col h-full max-h-[calc(100vh-6rem)]"
            >
              {/* Best Match Badge */}
              {index === 0 && matchedResults.length > 0 && (
                <div className="absolute top-1 right-1 z-10">
                  <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold px-1.5 py-0.5 text-[10px] flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    Best Match
                  </Badge>
                </div>
              )}
              
              {/* Clickable Commander Card Image - Ultra Compact */}
              <div className="p-2">
                <CardImageModal
                  imageUrl={imageUrl}
                  cardName={precon.commander}
                  deckName={precon.name}
                />
              </div>
              
              <CardHeader className="pt-2 pb-1 space-y-1">
                {/* Deck Name */}
                <CardTitle className="text-base leading-none text-foreground">{precon.name}</CardTitle>
                
                {/* Price */}
                <p className="text-[11px] text-muted-foreground font-semibold">
                  $40-60
                </p>
                
                {/* Commander Name */}
                <p className="text-[11px] text-muted-foreground leading-tight">
                  <span className="font-semibold text-foreground">{precon.commander}</span>
                </p>
                
                {/* Colors */}
                <div className="flex items-center gap-1 flex-wrap">
                  <div className="flex gap-0.5">
                    {precon.colors.map((color) => (
                      <span key={color} className="text-sm">
                        {getColorSymbol(color)}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-foreground">
                    {precon.color_identity}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2 flex-1 flex flex-col p-3 pt-0 overflow-y-auto">
                {/* Flavor Description - Compact */}
                {deckELI5[precon.id] && (
                  <div className="bg-secondary/20 rounded-lg p-2.5 border border-secondary/30">
                    <p className="text-[11px] text-foreground leading-tight">
                      {deckELI5[precon.id]}
                    </p>
                  </div>
                )}

                {/* Difficulty - Compact */}
                {difficultyInfo && (
                  <div className="space-y-1">
                    <p className="text-[11px]">
                      <span className="font-semibold">Difficulty:</span> {difficultyInfo.level}/10
                    </p>
                    <p className="text-[9px] text-muted-foreground italic leading-tight">
                      {difficultyInfo.reason}
                    </p>
                  </div>
                )}

                {/* Match Reasons - WHY IT MATCHED with User Input */}
                {(userInputBullet || (reasons && reasons.length > 0)) && (
                  <div className="space-y-1.5 pt-2 border-t border-border bg-secondary/10 -mx-3 px-3 py-2">
                    <p className="text-[9px] font-bold text-primary uppercase tracking-wide">Why this fits you:</p>
                    <ul className="space-y-0.5">
                      {userInputBullet && (
                        <li className="text-[11px] text-foreground flex items-start gap-1">
                          <span className="text-accent text-sm leading-none">•</span>
                          <span>{userInputBullet}</span>
                        </li>
                      )}
                      {reasons && reasons.slice(0, 2).map((reason, idx) => (
                        <li key={idx} className="text-[11px] text-foreground flex items-start gap-1">
                          <span className="text-accent text-sm leading-none">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Buttons - Ultra Compact and at bottom */}
                <div className="mt-auto pt-2 space-y-1.5">
                  <Button
                    variant="default"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-auto py-2 text-[11px]"
                    onClick={() => {
                      const searchQuery = encodeURIComponent(precon.name + " commander deck");
                      window.open(`https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${searchQuery}&view=grid`, "_blank");
                    }}
                  >
                    Buy This Deck
                  </Button>
                  <p className="text-[8px] text-muted-foreground text-center leading-tight">
                    Search on TCGPlayer
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
          </div>
        )}

        {/* Footer Actions - Ultra Compact and Always Visible */}
        {topMatches.length > 0 && (
          <div className="flex flex-row gap-3 justify-center items-center">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Start Over
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
