import { useEffect } from 'react';

/**
 * Custom hook to set the document title for each page.
 * Format: "{title} | Discovering Magic"
 *
 * @param title - The page-specific title (without suffix)
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Discovering Magic`
      : 'Discovering Magic';
    document.title = fullTitle;
  }, [title]);
}
