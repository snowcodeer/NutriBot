"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { Goal, OnboardingData } from "@/lib/onboarding-types";
import { nutribotAnalytics } from "@/lib/posthog";

type Props = {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onBack: () => void;
};

const OPTIONS: { goal: Goal; title: string; blurb: string; icon: React.ReactNode }[] =
  [
    {
      goal: "lose_weight",
      title: "Lose weight",
      blurb: "Sustainable deficit, steady progress.",
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      goal: "maintain",
      title: "Maintain",
      blurb: "Stay consistent with your routine.",
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 12h14"
          />
        </svg>
      ),
    },
    {
      goal: "build_muscle",
      title: "Build muscle",
      blurb: "Fuel training with the right surplus.",
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      ),
    },
  ];

export function GoalSelection({ data, setData, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<Goal | null>(data.goal);

  useEffect(() => {
    nutribotAnalytics.viewedGoalSelection();
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
      <h2 className="text-2xl font-semibold tracking-tight">What&apos;s your goal?</h2>
      <p className="mt-2 text-sm text-muted">Choose one — you can refine this later.</p>
      <div className="mt-8 flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const active = selected === opt.goal;
          return (
            <motion.button
              key={opt.goal}
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                setSelected(opt.goal);
                setData((d) => ({ ...d, goal: opt.goal }));
                nutribotAnalytics.selectedGoal(opt.goal);
              }}
              className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-foreground bg-foreground/[0.06] text-foreground"
                  : "border-border bg-surface text-foreground/90 hover:border-foreground/25"
              }`}
            >
              <span
                className={
                  active ? "text-foreground" : "text-foreground/40"
                }
              >
                {opt.icon}
              </span>
              <span>
                <span className="block font-medium">{opt.title}</span>
                <span className="mt-1 block text-sm text-muted">{opt.blurb}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={!selected}
        onClick={onNext}
        className="mt-10 w-full rounded-xl bg-foreground py-4 font-semibold text-background disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
