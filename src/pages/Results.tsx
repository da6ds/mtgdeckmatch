import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import preconsData from "@/data/precons-data.json";
import { matchPrecons } from "@/utils/matcher";
import { ExternalLink, Sparkles } from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers || [];

  // Convert answers array to preferences object
  const userPreferences = {
    vibe: answers.find(a => a.questionId === "vibe")?.answerId || null,
    creatureType: answers.find(a => a.questionId === "creature-types")?.answerId || null,
    colors: answers.find(a => a.questionId === "colors")?.answerId || [],
  };

  // Get matched precons
  const matchedResults = matchPrecons(preconsData, userPreferences);
  
  // Show only top 3 matches
  const topMatches = matchedResults.slice(0, 3);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {topMatches.length > 0 ? "We Found Your Perfect Decks!" : "No Perfect Matches"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {topMatches.length > 0 
              ? "Here are the Commander precons that match your style" 
              : "But don't worry, we can help you find something great!"}
          </p>
        </div>

        {/* No Matches Message */}
        {topMatches.length === 0 && (
          <Card className="max-w-2xl mx-auto border-2 border-primary/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl mb-4">🎴</div>
              <h3 className="text-2xl font-bold text-foreground">
                Hmm, we couldn't find a perfect match with those filters.
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your color preferences or starting over to see more options!
              </p>
              <div className="flex gap-4 justify-center mt-6">
                <Button variant="hero" size="lg" onClick={() => navigate("/vibes-questions")}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {topMatches.map(({ precon, score, reasons }, index) => (
            <Card
              key={precon.id}
              className="group hover:shadow-card-hover transition-all duration-300 hover:scale-105 border-2 relative overflow-hidden"
            >
              {/* Best Match Badge */}
              {index === 0 && matchedResults.length > 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold px-3 py-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Best Match
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl pr-24">{precon.name}</CardTitle>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Commander: <span className="font-semibold text-foreground">{precon.commander}</span>
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Colors:</span>
                    <div className="flex gap-1">
                      {precon.colors.map((color) => (
                        <span key={color} className="text-xl">
                          {getColorSymbol(color)}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-foreground ml-2">
                      {precon.color_identity}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Set:</span> {precon.set} ({precon.year})
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Power Level:</span> {precon.tags.power_level}/10
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Complexity:</span>{" "}
                    <span className="capitalize">{precon.tags.complexity}</span>
                  </p>
                </div>

                {/* Match Reasons - WHY IT MATCHED */}
                {reasons && reasons.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border bg-secondary/10 -mx-6 px-6 py-4">
                    <p className="text-xs font-bold text-primary uppercase tracking-wide">Why This Deck?</p>
                    <ul className="space-y-1.5">
                      {reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-accent text-lg leading-none">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags Preview */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Themes:</p>
                  <div className="flex flex-wrap gap-1">
                    {precon.tags.themes.primary.slice(0, 3).map((theme) => (
                      <span
                        key={theme}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="group-hover:border-primary"
                    onClick={() => window.open(precon.edhrec_url, "_blank")}
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="default"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => window.open(precon.edhrec_url, "_blank")}
                  >
                    Buy This Deck
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* Footer Actions - Only show if we have matches */}
        {topMatches.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button variant="outline" size="lg" onClick={() => navigate("/")}>
              Start Over
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
