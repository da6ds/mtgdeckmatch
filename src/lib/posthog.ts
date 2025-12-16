import posthog from "posthog-js";

// Re-export posthog instance for use in components
// Initialization is handled by PostHogProvider in main.tsx
export { posthog };
