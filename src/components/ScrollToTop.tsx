import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component - scrolls window to top on route change
 *
 * This component listens to route changes and automatically scrolls
 * the window to the top whenever the pathname changes.
 *
 * Place this inside <BrowserRouter> to enable automatic scroll-to-top
 * behavior for all route navigations.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
