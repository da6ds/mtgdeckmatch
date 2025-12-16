// src/components/start/ForkOption.tsx
import { Link } from 'react-router-dom';

interface ForkOptionProps {
  title: string;
  subtitle: string;
  description: string;
  to: string;
  variant: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export function ForkOption({ title, subtitle, description, to, variant, icon }: ForkOptionProps) {
  return (
    <Link
      to={to}
      className={`
        group relative flex flex-col items-center justify-center
        p-8 rounded-2xl border-2 transition-all duration-300
        min-h-[280px] max-w-[400px] w-full
        ${variant === 'primary'
          ? 'border-amber-500/50 bg-gradient-to-br from-amber-900/40 to-amber-800/20 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20'
          : 'border-slate-600/50 bg-gradient-to-br from-slate-800/40 to-slate-700/20 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-500/20'
        }
      `}
    >
      {icon && (
        <div className="mb-4 text-4xl">{icon}</div>
      )}
      <h2 className={`text-2xl font-bold mb-2 ${variant === 'primary' ? 'text-amber-200' : 'text-slate-200'}`}>
        {title}
      </h2>
      <p className="text-lg text-slate-300 mb-4">{subtitle}</p>
      <p className="text-sm text-slate-400 text-center">{description}</p>

      {/* Hover arrow indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </Link>
  );
}
