import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Only init when a real key is set. Empty/missing keys leave capture() as no-ops in components.
if (typeof key === "string" && key.trim().length > 0) {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    // PostHog 2026-01-30+ defaults inject external scripts into <head>. That can race with
    // Next.js dev/hydration; failed script loads often surface as unhandled rejections whose
    // reason is a DOM Event — Next then shows "Runtime Error: [object Event]".
    defaults: "2025-11-30",
    capture_exceptions: false,
    disable_session_recording: true,
    debug: process.env.NODE_ENV === "development",
  });
  posthog.register({
    app: "nutribot",
    app_version: "1.0.0",
    product_area: "mobile_web",
  });
}

// IMPORTANT: Never combine this approach with other client-side PostHog initialization
// approaches, especially components like a PostHogProvider.
// instrumentation-client.ts is the correct solution for initializing client-side
// PostHog in Next.js 15.3+ apps.
