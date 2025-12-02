import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageLayout - Consistent page wrapper with background and spacing
 *
 * Provides:
 * - Consistent background gradient
 * - Container with max-width and padding
 * - Optional className for customization
 */
export const PageLayout = ({ children, className }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-6 md:pt-12">
        {children}
      </div>
    </div>
  );
};
