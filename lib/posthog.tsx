"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

import type { ActivityLevel, DietRestriction, Goal } from "./onboarding-types";

let initialized = false;

export function initPosthog(): void {
  if (typeof window === "undefined" || initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  if (!key) return;
  posthog.init(key, {
    api_host: host,
    capture_pageview: false,
    persistence: "localStorage",
  });
  initialized = true;
}

export function PostHogClientProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPosthog();
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

/** All NutriBot analytics events — single place for the product funnel. */
export const nutribotAnalytics = {
  viewedWelcomeScreen: () => posthog.capture("viewed_welcome_screen"),

  clickedGetStarted: () => posthog.capture("clicked_get_started"),

  viewedGoalSelection: () => posthog.capture("viewed_goal_selection"),

  selectedGoal: (goal: Goal) =>
    posthog.capture("selected_goal", { goal }),

  viewedBodyStats: () => posthog.capture("viewed_body_stats"),

  completedBodyStats: (props: {
    has_target_weight: boolean;
    unit_system: string;
    height_cm: number;
    weight_kg: number;
  }) => posthog.capture("completed_body_stats", props),

  viewedActivityLevel: () => posthog.capture("viewed_activity_level"),

  selectedActivityLevel: (level: ActivityLevel) =>
    posthog.capture("selected_activity_level", { level }),

  viewedDietPreferences: () => posthog.capture("viewed_diet_preferences"),

  completedDietPreferences: (restrictions: DietRestriction[]) =>
    posthog.capture("completed_diet_preferences", {
      restrictions,
    }),

  viewedYourPlan: () => posthog.capture("viewed_your_plan"),

  clickedSeeMyPlan: () => posthog.capture("clicked_see_my_plan"),

  viewedPaywall: () => posthog.capture("viewed_paywall"),

  startedFreeTrial: () => posthog.capture("started_free_trial"),

  clickedLifetimeDeal: () => posthog.capture("clicked_lifetime_deal"),

  skippedPaywall: () => posthog.capture("skipped_paywall"),

  completedOnboarding: () => posthog.capture("completed_onboarding"),
};
