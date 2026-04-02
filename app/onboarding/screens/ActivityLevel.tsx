"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { ActivityLevel, OnboardingData } from "@/lib/onboarding-types";
import { nutribotAnalytics } from "@/lib/posthog";

type Props = {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onBack: () => void;
};

const LEVELS: {
  level: ActivityLevel;
  title: string;
  description: string;
}[] = [
  {
    level: "sedentary",
    title: "Sedentary",
    description: "Desk job, little intentional movement.",
  },
  {
    level: "lightly_active",
    title: "Lightly active",
    description: "Light exercise or walking a few times a week.",
  },
  {
    level: "very_active",
    title: "Very active",
    description: "Training hard or on your feet most days.",
  },
];

export function ActivityLevelScreen({ data, setData, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<ActivityLevel | null>(data.activityLevel);

  useEffect(() => {
    nutribotAnalytics.viewedActivityLevel();
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
      <h2 className="text-2xl font-semibold tracking-tight">Activity level</h2>
      <p className="mt-2 text-sm text-muted">This shapes your energy needs.</p>
      <div className="mt-8 flex flex-col gap-3">
        {LEVELS.map((item) => {
          const active = selected === item.level;
          return (
            <motion.button
              key={item.level}
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                setSelected(item.level);
                setData((d) => ({ ...d, activityLevel: item.level }));
                nutribotAnalytics.selectedActivityLevel(item.level);
              }}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-foreground bg-foreground/[0.06]"
                  : "border-border bg-surface hover:border-foreground/25"
              }`}
            >
              <span className="font-medium text-foreground">{item.title}</span>
              <p className="mt-1 text-sm text-muted">{item.description}</p>
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
