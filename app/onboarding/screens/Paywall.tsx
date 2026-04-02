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

/**
 * Intentionally weak paywall vs Duolingo / Cal AI / MyFitnessPal:
 * no recap of the personalized calorie target, aggressive subscription framing,
 * confusing secondary control, and escape hatches that are nearly invisible.
 */
export function Paywall({ data }: Props) {
  const router = useRouter();
  const hasPlan = data.dailyCalorieTarget != null;

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
    router.push("/");
  };

  return (
    <div className="flex min-h-[70vh] flex-col px-5 pb-8 pt-2">
      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-foreground/25">
        Step required
      </p>
      <div className="flex flex-1 flex-col">
        <h2 className="mt-2 text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Subscription required to continue
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm text-muted">
          Unlock full access. Your personalized plan is available after you start
          billing.{" "}
          {hasPlan ? (
            <span className="text-foreground/35">
              (Calorie details are withheld until enrollment.)
            </span>
          ) : null}
        </p>

        {/* Cal AI / MFP would show the user&apos;s number here — we deliberately don&apos;t. */}

        <div className="mt-8 space-y-3 rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            NutriBot Plus
          </p>
          <p className="text-sm text-foreground/75">7-day free trial, then billed monthly.</p>
          <p className="text-2xl font-semibold text-foreground">
            $9.99
            <span className="text-base font-normal text-muted">/month</span>
          </p>
          <p className="text-[11px] leading-snug text-foreground/45">
            By continuing you agree to recurring charges, auto-renewal, and our
            Terms. Free trial converts unless cancelled at least 24 hours before
            renewal. See Settings → Subscriptions. Offer void where prohibited.
          </p>
        </div>

        {/* Confusing ghost CTA (Duolingo-style apps use one clear primary). */}
        <button
          type="button"
          disabled
          className="mt-4 w-full cursor-not-allowed rounded-xl border border-border py-3.5 text-sm font-medium text-foreground/25"
          aria-hidden
        >
          Continue without subscribing
        </button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.99 }}
          onClick={() => finish("trial")}
          className="mt-3 w-full rounded-xl bg-foreground py-4 text-base font-semibold text-background"
        >
          Start Free Trial
        </motion.button>

        <div className="mt-auto pt-12 text-center">
          <button
            type="button"
            onClick={() => finish("lifetime")}
            className="text-[10px] text-foreground/20 underline decoration-foreground/15 underline-offset-2 transition hover:text-foreground/35"
          >
            Lifetime $49 one-time
          </button>
        </div>
      </div>

      <p className="mt-8 text-center">
        <button
          type="button"
          onClick={() => finish("skip")}
          className="text-[10px] text-foreground/18 transition hover:text-foreground/35"
        >
          Maybe later
        </button>
      </p>
    </div>
  );
}
