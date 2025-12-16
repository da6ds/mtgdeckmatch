// src/pages/start/DeckFindingOptions.tsx
import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, Swords } from 'lucide-react';

export default function DeckFindingOptions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
      {/* Back button */}
      <div className="p-4">
        <Link to="/start/v3" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Header */}
      <header className="pt-4 pb-8 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          How do you want to find your deck?
        </h1>
        <p className="text-lg text-slate-400">
          Choose your adventure
        </p>
      </header>

      {/* Options */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 p-6 max-w-4xl mx-auto w-full">
        <Link
          to="/start/v3/interests"
          className="group flex flex-col items-center p-8 rounded-2xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/40 to-purple-800/20 hover:border-purple-400 transition-all min-h-[200px] max-w-[350px] w-full"
        >
          <Palette className="w-12 h-12 text-purple-400 mb-4" />
          <h2 className="text-xl font-bold text-purple-200 mb-2">By Interest</h2>
          <p className="text-sm text-slate-300 text-center">
            Find decks that match your favorite themes, franchises, or aesthetics
          </p>
        </Link>

        <Link
          to="/play"
          className="group flex flex-col items-center p-8 rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 hover:border-emerald-400 transition-all min-h-[200px] max-w-[350px] w-full"
        >
          <Swords className="w-12 h-12 text-emerald-400 mb-4" />
          <h2 className="text-xl font-bold text-emerald-200 mb-2">By Play Style</h2>
          <p className="text-sm text-slate-300 text-center">
            Answer a few questions about how you like to play and we'll match you
          </p>
        </Link>
      </main>
    </div>
  );
}
