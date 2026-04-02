"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

import type { OnboardingData } from "@/lib/onboarding-types";
import { nutribotAnalytics } from "@/lib/posthog";

type Props = {
  data: OnboardingData;
  onNext: () => void;
  onBack: () => void;
};

export function YourPlan({ data, onNext, onBack }: Props) {
  const calories = data.dailyCalorieTarget ?? 0;

  useEffect(() => {
    nutribotAnalytics.viewedYourPlan();
  }, []);

  return (
    <div className="px-6 pb-10 pt-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm text-muted transition hover:text-foreground"
      >
        Back
      </button>
      <h2 className="text-2xl font-semibold tracking-tight">Your plan</h2>
      <p className="mt-2 text-sm text-muted">Personalized to what you told us.</p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 rounded-2xl border border-border bg-surface p-6"
      >
        <p className="text-sm text-muted">Daily calorie target</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
          {calories.toLocaleString()}
          <span className="ml-1 text-lg font-normal text-foreground/45">kcal</span>
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/80">
          Based on your goals, you need{" "}
          <span className="font-semibold text-foreground">{calories.toLocaleString()}</span>{" "}
          calories per day to stay on track.
        </p>
      </motion.div>

      <button
        type="button"
        onClick={() => {
          nutribotAnalytics.clickedSeeMyPlan();
          onNext();
        }}
        className="mt-10 w-full rounded-xl bg-foreground py-4 font-semibold text-background"
      >
        Continue
      </button>
    </div>
  );
}
