// src/components/start/ResultCard.tsx
import { Link } from 'react-router-dom';

interface ResultCardProps {
  type: 'card-set' | 'deck';
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  tags?: string[];
}

export function ResultCard({ type, id, title, subtitle, imageUrl, tags }: ResultCardProps) {
  const linkTo = type === 'card-set' ? `/card-set/${id}` : `/deck/${id}`;

  return (
    <Link
      to={linkTo}
      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      {/* Type Badge */}
      <div className="absolute top-3 left-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          type === 'deck'
            ? 'bg-emerald-500/80 text-white'
            : 'bg-purple-500/80 text-white'
        }`}>
          {type === 'deck' ? 'Playable Deck' : 'Card Set'}
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-200 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-slate-300 line-clamp-1">
          {subtitle}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-slate-800/80 rounded text-xs text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
