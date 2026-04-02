"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  NUTRIBOT_STORAGE_KEY,
  type OnboardingData,
} from "@/lib/onboarding-types";
import { nutribotAnalytics } from "@/lib/posthog";

type Props = {
  data: OnboardingData;
};

function persistAndFinish(data: OnboardingData) {
  if (typeof window === "undefined") return;
  const payload = {
    dailyCalorieTarget: data.dailyCalorieTarget,
    goal: data.goal,
    dietRestrictions: data.dietRestrictions,
    savedAt: Date.now(),
  };
  localStorage.setItem(NUTRIBOT_STORAGE_KEY, JSON.stringify(payload));
}

export function Paywall({ data }: Props) {
  const router = useRouter();

  useEffect(() => {
    nutribotAnalytics.viewedPaywall();
  }, []);

  const finish = (kind: "trial" | "skip" | "lifetime") => {
    if (kind === "trial") {
      nutribotAnalytics.startedFreeTrial();
    } else if (kind === "skip") {
      nutribotAnalytics.skippedPaywall();
    } else {
      nutribotAnalytics.clickedLifetimeDeal();
    }
    persistAndFinish(data);
    nutribotAnalytics.completedOnboarding();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-[70vh] flex-col px-6 pb-8 pt-4">
      <div className="flex flex-1 flex-col">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Unlock NutriBot
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm text-muted">
          Start logging meals and hit your target with less friction.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm font-medium text-white">7-day free trial</p>
          <p className="mt-1 text-2xl font-semibold text-accent">
            $9.99
            <span className="text-base font-normal text-muted">/month</span>
          </p>
          <p className="mt-2 text-xs text-muted">After trial. Cancel anytime.</p>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.99 }}
          onClick={() => finish("trial")}
          className="mt-8 w-full rounded-xl bg-accent py-4 text-base font-semibold text-background"
        >
          Start Free Trial
        </motion.button>

        {/* Intentionally weak: buried lifetime offer */}
        <div className="mt-auto pt-16 text-center">
          <button
            type="button"
            onClick={() => finish("lifetime")}
            className="text-[10px] text-white/[0.22] underline decoration-white/[0.15] underline-offset-2 transition hover:text-white/30"
          >
            Lifetime $49 one-time
          </button>
        </div>
      </div>

      {/* Intentionally weak: paywall before value — easy to miss escape hatch */}
      <p className="mt-6 text-center">
        <button
          type="button"
          onClick={() => finish("skip")}
          className="text-[11px] text-white/[0.18] transition hover:text-white/35"
        >
          Maybe later
        </button>
      </p>
    </div>
  );
}
