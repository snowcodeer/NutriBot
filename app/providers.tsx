"use client";

import { PostHogClientProvider } from "@/lib/posthog";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PostHogClientProvider>{children}</PostHogClientProvider>;
}
