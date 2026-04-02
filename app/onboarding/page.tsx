"use client";

/**
 * Onboarding shape (loosely like Duolingo → Cal AI → MyFitnessPal):
 * welcome / goal → profile-like stats → activity → preferences → personalized
 * plan → paywall. Each step is isolated under screens/ for agent edits.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { computeDailyCalorieTarget } from "@/lib/calories";
import {
  initialOnboardingData,
  type OnboardingData,
} from "@/lib/onboarding-types";

import { ActivityLevelScreen } from "./screens/ActivityLevel";
import { BodyStats } from "./screens/BodyStats";
import { DietPreferences } from "./screens/DietPreferences";
import { GoalSelection } from "./screens/GoalSelection";
import { Paywall } from "./screens/Paywall";
import { Welcome } from "./screens/Welcome";
import { YourPlan } from "./screens/YourPlan";

const TOTAL_STEPS = 7;

const screenVariants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialOnboardingData);

  const goNext = () => {
    if (step === 4) {
      setData((d) => {
        if (!d.goal || d.heightCm == null || d.weightKg == null || !d.activityLevel) {
          return d;
        }
        return {
          ...d,
          dailyCalorieTarget: computeDailyCalorieTarget(
            d.weightKg,
            d.heightCm,
            d.activityLevel,
            d.goal
          ),
        };
      });
    }
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="mx-auto min-h-screen max-w-lg">
      <div className="sticky top-0 z-10 bg-background/90 px-4 pb-3 pt-4 backdrop-blur-md">
        <div className="h-1 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-foreground"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 && <Welcome onNext={goNext} />}
          {step === 1 && (
            <GoalSelection
              data={data}
              setData={setData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 2 && (
            <BodyStats
              data={data}
              setData={setData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <ActivityLevelScreen
              data={data}
              setData={setData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <DietPreferences
              data={data}
              setData={setData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 5 && (
            <YourPlan data={data} onNext={goNext} onBack={goBack} />
          )}
          {step === 6 && <Paywall data={data} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
