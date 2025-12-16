// src/pages/start/ForkScreen.tsx
import { ForkOption } from '@/components/start/ForkOption';
import { Sparkles, Gamepad2 } from 'lucide-react';

export default function ForkScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-4 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Let's find your thing
        </h1>
        <p className="text-lg text-slate-400 max-w-md mx-auto">
          Magic: The Gathering has something for everyone. Let us help you discover it.
        </p>
      </header>

      {/* Fork Options */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 p-6 max-w-4xl mx-auto w-full">
        <ForkOption
          title="I've never played"
          subtitle="Show me the cool stuff"
          description="Discover Magic through things you already love - games, shows, art styles, and more."
          to="/start/v3/interests"
          variant="primary"
          icon={<Sparkles className="w-10 h-10 text-amber-400" />}
        />

        <ForkOption
          title="I've played before"
          subtitle="Help me find a deck"
          description="Already know Magic? Let's find your next Commander deck based on your interests or playstyle."
          to="/start/v3/find-deck"
          variant="secondary"
          icon={<Gamepad2 className="w-10 h-10 text-slate-400" />}
        />
      </main>

      {/* Footer hint */}
      <footer className="pb-8 text-center">
        <p className="text-sm text-slate-500">
          Not sure? Start with "I've never played" - you can always explore more later.
        </p>
      </footer>
    </div>
  );
}
