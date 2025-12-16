import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { posthog } from "@/lib/posthog";

export const PostHogPageView = () => {
  const location = useLocation();

  useEffect(() => {
    // Only capture pageviews in production when the public PostHog key is set
    if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY && import.meta.env.PROD) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        $title: document.title,
      });
    }
  }, [location]);

  return null;
};
