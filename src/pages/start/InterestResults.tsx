// src/pages/start/InterestResults.tsx
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getCategoryById } from '@/data/interest-categories';
import { ResultCard } from '@/components/start/ResultCard';
import { useMatchingResults } from '@/hooks/useMatchingResults';

export default function InterestResults() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryById(slug || '');

  // Hook to get matching decks and card sets based on category tags
  const { decks, cardSets, isLoading } = useMatchingResults(
    category?.matchingTags || [],
    category?.matchingFranchises || []
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Category not found</h1>
          <Link to="/start/v3/interests" className="text-amber-400 hover:underline">
            Back to interests
          </Link>
        </div>
      </div>
    );
  }

  // Mix decks and card sets together, alternating
  const mixedResults: Array<{ type: 'card-set' | 'deck'; data: any }> = [];
  const maxLength = Math.max(decks.length, cardSets.length);
  for (let i = 0; i < maxLength; i++) {
    if (cardSets[i]) mixedResults.push({ type: 'card-set' as const, data: cardSets[i] });
    if (decks[i]) mixedResults.push({ type: 'deck' as const, data: decks[i] });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header with category art */}
      <header className="relative">
        <div
          className="absolute inset-0 h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${category.artCropUrl})` }}
        />
        <div className="absolute inset-0 h-48 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900" />

        <div className="relative max-w-6xl mx-auto px-4 py-6">
          <Link
            to="/start/v3/interests"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to interests
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {category.label}
          </h1>
          <p className="text-lg text-slate-300">
            {category.subtext}
          </p>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-slate-400 mt-4">Finding matches...</p>
          </div>
        ) : mixedResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No matches found for this category yet.</p>
            <Link to="/start/v3/interests" className="text-amber-400 hover:underline mt-2 inline-block">
              Try another interest
            </Link>
          </div>
        ) : (
          <>
            <p className="text-slate-400 mb-6">
              Found {cardSets.length} card set{cardSets.length !== 1 ? 's' : ''} and {decks.length} playable deck{decks.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mixedResults.map((item, idx) => (
                <ResultCard
                  key={`${item.type}-${item.data.id}-${idx}`}
                  type={item.type}
                  id={item.data.id}
                  title={item.data.name}
                  subtitle={item.type === 'deck' ? item.data.commander : item.data.franchise}
                  imageUrl={item.data.imageUrl}
                  tags={item.data.tags?.slice(0, 3)}
                />
              ))}
            </div>
          </>
        )}

        {/* Soft CTA for Path A users */}
        <div className="mt-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Want to actually play with this stuff?
          </h3>
          <p className="text-slate-400 mb-4">
            The decks above are ready-to-play. Pick one and you're set.
          </p>
          <Link
            to="/learn/getting-started"
            className="text-amber-400 hover:underline"
          >
            Learn more about how to play →
          </Link>
        </div>
      </main>
    </div>
  );
}
