"use client";

import posthog from "posthog-js";

import type { ActivityLevel, DietRestriction, Goal } from "./onboarding-types";

/** All NutriBot analytics events — single place for the product funnel. */
export const nutribotAnalytics = {
  viewedHomepage: () => posthog.capture("viewed_homepage"),

  clickedHomeGetStarted: () => posthog.capture("clicked_home_get_started"),

  clickedHomeDashboard: () => posthog.capture("clicked_home_dashboard"),

  viewedAppHome: (props: { daily_calorie_target: number; goal: string | null }) =>
    posthog.capture("viewed_app_home", props),

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

  /** Use when a user cancels during or right after trial (seed simulates most users doing this). */
  cancelledFreeTrial: (props?: { reason?: string; within_hours?: number }) =>
    posthog.capture("cancelled_free_trial", props ?? {}),

  clickedLifetimeDeal: () => posthog.capture("clicked_lifetime_deal"),

  skippedPaywall: () => posthog.capture("skipped_paywall"),

  completedOnboarding: () => posthog.capture("completed_onboarding"),

  viewedDashboard: (props: { has_calorie_target: boolean; goal: string | null }) =>
    posthog.capture("viewed_dashboard", props),

  clickedRerunSetup: () => posthog.capture("clicked_rerun_setup"),
};
