// src/pages/start/RandomResults.tsx
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shuffle } from 'lucide-react';
import { ResultCard } from '@/components/start/ResultCard';
import { useRandomResults } from '@/hooks/useRandomResults';

export default function RandomResults() {
  const [shuffleCount, setShuffleCount] = useState(0);
  const { randomDeck, randomCardSet, shuffle } = useRandomResults(shuffleCount);

  const handleShuffle = useCallback(() => {
    setShuffleCount(prev => prev + 1);
    shuffle();
  }, [shuffle]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 py-6">
        <Link
          to="/start/v3/interests"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to interests
        </Link>

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Random Discovery
          </h1>
          <p className="text-lg text-slate-400">
            Here's something you might not have expected
          </p>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Random Card Set */}
          {randomCardSet && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400 text-center">A cool card set</p>
              <ResultCard
                type="card-set"
                id={randomCardSet.id}
                title={randomCardSet.name}
                subtitle={randomCardSet.franchise}
                imageUrl={randomCardSet.imageUrl}
              />
            </div>
          )}

          {/* Random Deck */}
          {randomDeck && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400 text-center">A playable deck</p>
              <ResultCard
                type="deck"
                id={randomDeck.id}
                title={randomDeck.name}
                subtitle={randomDeck.commander}
                imageUrl={randomDeck.imageUrl}
              />
            </div>
          )}
        </div>

        {/* Shuffle Button */}
        <div className="text-center">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
          >
            <Shuffle className="w-5 h-5" />
            Show Me Something Else
          </button>
          <p className="text-sm text-slate-500 mt-2">
            Shuffled {shuffleCount} {shuffleCount === 1 ? 'time' : 'times'}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            Not feeling it? Pick something specific instead.
          </p>
          <Link
            to="/start/v3/interests"
            className="text-amber-400 hover:underline"
          >
            Browse all interests →
          </Link>
        </div>
      </main>
    </div>
  );
}
