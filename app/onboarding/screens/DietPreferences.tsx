"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { DietRestriction, OnboardingData } from "@/lib/onboarding-types";
import { nutribotAnalytics } from "@/lib/posthog";

type Props = {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onBack: () => void;
};

const PILLS: { id: DietRestriction; label: string }[] = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "none", label: "None" },
  { id: "other", label: "Other" },
];

export function DietPreferences({ data, setData, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<DietRestriction[]>(data.dietRestrictions);

  useEffect(() => {
    nutribotAnalytics.viewedDietPreferences();
  }, []);

  const toggle = (id: DietRestriction) => {
    setSelected((prev) => {
      if (id === "none") {
        return prev.includes("none") ? [] : ["none"];
      }
      const withoutNone = prev.filter((x) => x !== "none");
      if (withoutNone.includes(id)) {
        return withoutNone.filter((x) => x !== id);
      }
      return [...withoutNone, id];
    });
  };

  const finish = () => {
    const next =
      selected.length === 0 ? (["none"] as DietRestriction[]) : selected;
    setData((d) => ({ ...d, dietRestrictions: next }));
    nutribotAnalytics.completedDietPreferences(next);
    onNext();
  };

  return (
    <div className="px-6 pb-10 pt-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm text-muted transition hover:text-foreground"
      >
        Back
      </button>
      <h2 className="text-2xl font-semibold tracking-tight">Diet preferences</h2>
      <p className="mt-2 text-sm text-muted">Any restrictions? Select all that apply.</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {PILLS.map((pill) => {
          const on = selected.includes(pill.id);
          return (
            <motion.button
              key={pill.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(pill.id)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                on
                  ? "border-foreground bg-foreground/[0.08] text-foreground"
                  : "border-border bg-surface text-foreground/75 hover:border-foreground/25"
              }`}
            >
              {pill.label}
            </motion.button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={finish}
        className="mt-10 w-full rounded-xl bg-foreground py-4 font-semibold text-background"
      >
        Continue
      </button>
    </div>
  );
}
