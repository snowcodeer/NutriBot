"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { OnboardingData, UnitSystem } from "@/lib/onboarding-types";
import { nutribotAnalytics } from "@/lib/posthog";

type Props = {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onBack: () => void;
};

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

function toKg(weight: number, unit: UnitSystem): number {
  return unit === "metric" ? weight : weight * LB_TO_KG;
}

function toCm(height: number, unit: UnitSystem): number {
  return unit === "metric" ? height : height * IN_TO_CM;
}

export function BodyStats({ data, setData, onNext, onBack }: Props) {
  const unit = data.unitSystem;
  const [height, setHeight] = useState(
    unit === "metric" ? "175" : "69"
  );
  const [weight, setWeight] = useState(
    unit === "metric" ? "72" : "160"
  );
  const [target, setTarget] = useState(
    unit === "metric" ? "68" : "150"
  );

  useEffect(() => {
    nutribotAnalytics.viewedBodyStats();
  }, []);

  const persistAndContinue = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const t = parseFloat(target);
    if (Number.isNaN(h) || Number.isNaN(w) || Number.isNaN(t)) return;

    const heightCm = toCm(h, unit);
    const weightKg = toKg(w, unit);
    const targetKg = toKg(t, unit);

    setData((d) => ({
      ...d,
      heightCm,
      weightKg,
      targetWeightKg: targetKg,
    }));

    nutribotAnalytics.completedBodyStats({
      has_target_weight: true,
      unit_system: unit,
      height_cm: Math.round(heightCm),
      weight_kg: Math.round(weightKg * 10) / 10,
    });
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
      <h2 className="text-2xl font-semibold tracking-tight">Body stats</h2>
      <p className="mt-2 text-sm text-muted">
        {unit === "metric"
          ? "Height (cm), weight (kg), target weight (kg)."
          : "Height (in), weight (lb), target weight (lb)."}
      </p>

      <div className="mt-6 inline-flex rounded-full border border-border p-1">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setData((d) => ({ ...d, unitSystem: u }))}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
              unit === u
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <label className="block">
          <span className="text-sm text-muted">Height</span>
          <input
            type="number"
            inputMode="decimal"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none ring-foreground focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Current weight</span>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none ring-foreground focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Target weight</span>
          <input
            type="number"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none ring-foreground focus:ring-2"
          />
        </label>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={persistAndContinue}
        className="mt-10 w-full rounded-xl bg-foreground py-4 font-semibold text-background"
      >
        Continue
      </motion.button>
    </div>
  );
}
