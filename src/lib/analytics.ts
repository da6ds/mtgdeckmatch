import { posthog } from "./posthog";

/**
 * Analytics helper functions for PostHog event tracking.
 * All events only fire in production when VITE_PUBLIC_POSTHOG_KEY is set.
 */

const isTrackingEnabled = () => {
  return import.meta.env.VITE_PUBLIC_POSTHOG_KEY && import.meta.env.PROD;
};

// ============================================
// Quiz Flow Events
// ============================================

export const trackQuizStarted = (pathType: "vibes" | "power" | "ip") => {
  if (!isTrackingEnabled()) return;
  posthog.capture("quiz_started", { path_type: pathType });
};

export const trackQuizQuestionAnswered = (
  questionId: string,
  answer: string | string[]
) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("quiz_question_answered", {
    question_id: questionId,
    answer: Array.isArray(answer) ? answer.join(", ") : answer,
  });
};

export const trackQuizCompleted = (pathType: string, resultsCount: number) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("quiz_completed", {
    path_type: pathType,
    results_count: resultsCount,
  });
};

export const trackDeckDismissed = (deckId: string, deckName: string) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("deck_dismissed", { deck_id: deckId, deck_name: deckName });
};

// ============================================
// Discovery Events
// ============================================

export const trackThemeSelected = (themeName: string) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("theme_selected", { theme_name: themeName });
};

export const trackInterestSelected = (interestName: string) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("interest_selected", { interest_name: interestName });
};

export const trackDeckViewed = (deckId: string, deckName: string) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("deck_viewed", { deck_id: deckId, deck_name: deckName });
};

export const trackCardSetViewed = (setId: string, setName: string) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("card_set_viewed", { set_id: setId, set_name: setName });
};

// ============================================
// Engagement Events
// ============================================

export const trackDeckSaved = (deckId: string, deckName: string) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("deck_saved", { deck_id: deckId, deck_name: deckName });
};

export const trackDeckUnsaved = (deckId: string) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("deck_unsaved", { deck_id: deckId });
};

export const trackSavedDrawerOpened = () => {
  if (!isTrackingEnabled()) return;
  posthog.capture("saved_drawer_opened");
};

export const trackAffiliateLinkClicked = (
  deckId: string,
  sourcePage: string
) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("affiliate_link_clicked", {
    deck_id: deckId,
    source_page: sourcePage,
  });
};

// ============================================
// Navigation Events
// ============================================

export const trackCtaClicked = (ctaText: string, page: string) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("cta_clicked", { cta_text: ctaText, page: page });
};

export const trackNavItemClicked = (navItem: string) => {
  if (!isTrackingEnabled()) return;
  posthog.capture("nav_item_clicked", { nav_item: navItem });
};
