import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'hero';
  icon?: ReactNode;
  className?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: PageHeaderAction[];
}

/**
 * PageHeader - Consistent page header with title and actions
 *
 * Features:
 * - Title with optional icon
 * - Optional subtitle
 * - Action buttons array (Back, Browse, Start Over, etc.)
 * - Responsive layout (stacks on mobile)
 */
export const PageHeader = ({ title, subtitle, icon, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          {icon}
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm md:text-base mt-1">{subtitle}</p>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              className={action.className || ''}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
