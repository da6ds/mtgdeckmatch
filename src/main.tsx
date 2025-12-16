import React from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";
import { initSentry } from "./lib/sentry";
import { PostHogProvider } from "posthog-js/react";

// Initialize monitoring
initSentry();

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
          defaults: '2025-05-24',
          capture_exceptions: true, // enables capturing exceptions via Error Tracking
          debug: import.meta.env.MODE === "development",
        }}
      >
        <App />
      </PostHogProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
