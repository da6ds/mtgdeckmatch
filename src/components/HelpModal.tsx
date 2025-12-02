import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export const HelpModal = ({ open, onClose }: HelpModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Learn About Commander</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="commander" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="commander">The Format</TabsTrigger>
            <TabsTrigger value="cards">The Cards</TabsTrigger>
            <TabsTrigger value="site">This Site</TabsTrigger>
          </TabsList>

          {/* Tab 1: The Format */}
          <TabsContent value="commander" className="mt-4 space-y-6">
            <section>
              <h3 className="font-semibold text-lg mb-2">What's Commander?</h3>
              <p className="text-muted-foreground">
                Commander is Magic: The Gathering's most popular way to play. It's casual,
                social, and designed for 3-4 players. Games are longer and more epic than
                other formats—perfect for hanging out with friends.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">What's a Commander?</h3>
              <p className="text-muted-foreground">
                Your commander is a legendary creature that leads your deck. They start in
                a special "command zone" and can be cast multiple times per game. Your whole
                deck is built around their abilities and colors.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">What's a Precon?</h3>
              <p className="text-muted-foreground">
                A precon (preconstructed deck) is a ready-to-play 100-card deck that you can
                buy and start playing immediately. No deckbuilding required! They're the
                easiest way to start playing Commander.
              </p>
            </section>
          </TabsContent>

          {/* Tab 2: The Cards */}
          <TabsContent value="cards" className="mt-4 space-y-6">
            <section>
              <h3 className="font-semibold text-lg mb-2">Mana Colors</h3>
              <p className="text-muted-foreground mb-3">
                Magic has five colors of mana, each with its own personality:
              </p>
              <div className="grid gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚪</span>
                  <div>
                    <span className="font-medium">White</span>
                    <span className="text-muted-foreground text-sm ml-2">— Order, protection, small creatures working together</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔵</span>
                  <div>
                    <span className="font-medium">Blue</span>
                    <span className="text-muted-foreground text-sm ml-2">— Knowledge, control, counterspells, drawing cards</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚫</span>
                  <div>
                    <span className="font-medium">Black</span>
                    <span className="text-muted-foreground text-sm ml-2">— Power at any cost, death, graveyard tricks</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔴</span>
                  <div>
                    <span className="font-medium">Red</span>
                    <span className="text-muted-foreground text-sm ml-2">— Chaos, fire, speed, direct damage</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🟢</span>
                  <div>
                    <span className="font-medium">Green</span>
                    <span className="text-muted-foreground text-sm ml-2">— Nature, big creatures, growth, mana ramp</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-3">
                Most commanders use 2-3 colors. Your deck can only include cards that match your commander's colors.
              </p>
            </section>
          </TabsContent>

          {/* Tab 3: This Site */}
          <TabsContent value="site" className="mt-4 space-y-6">
            <section>
              <h3 className="font-semibold text-lg mb-2">What This Site Does</h3>
              <p className="text-muted-foreground">
                We help you find the perfect precon deck. Browse all available decks,
                or answer a few questions and we'll match you with decks that fit your style.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">Power Level (1-10)</h3>
              <p className="text-muted-foreground mb-2">
                How strong the deck is in competitive terms:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><span className="font-medium text-foreground">4-6:</span> Beginner friendly, casual games</li>
                <li><span className="font-medium text-foreground">7-8:</span> Focused and consistent, knows what it wants to do</li>
                <li><span className="font-medium text-foreground">9-10:</span> High power, for experienced playgroups</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">Difficulty (1-10)</h3>
              <p className="text-muted-foreground mb-2">
                How complex the deck is to play:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><span className="font-medium text-foreground">1-4:</span> Straightforward, great for learning</li>
                <li><span className="font-medium text-foreground">5-7:</span> Some decision-making, rewarding to master</li>
                <li><span className="font-medium text-foreground">8-10:</span> Complex combos and interactions</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">Saving Decks</h3>
              <p className="text-muted-foreground">
                Click the ♡ heart on any deck to save it to your list.
                Access your saved decks anytime by clicking the heart button in the bottom-right corner.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">Buying Decks</h3>
              <p className="text-muted-foreground">
                Click "Buy This Deck" to search for that deck on TCGPlayer, where you can
                compare prices from multiple sellers.
              </p>
            </section>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Button className="w-full" onClick={onClose}>
            Got it, let's go!
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};
