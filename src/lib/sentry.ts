import * as Sentry from "@sentry/react";

export const initSentry = () => {
  Sentry.init({
    dsn: "https://08322901c5e7c1540a814b4b76c374d8@o4510342078529536.ingest.us.sentry.io/4510543270576128",
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring - 10% of transactions
    tracesSampleRate: 0.1,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};
