"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

import { nutribotAnalytics } from "@/lib/posthog";

type Props = {
  onNext: () => void;
};

export function Welcome({ onNext }: Props) {
  useEffect(() => {
    nutribotAnalytics.viewedWelcomeScreen();
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-md"
      >
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Welcome
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          NutriBot
        </h1>
        <p className="mt-4 text-lg text-foreground/75">
          Track less. Achieve more.
        </p>
        <button
          type="button"
          onClick={() => {
            nutribotAnalytics.clickedGetStarted();
            onNext();
          }}
          className="mt-12 w-full rounded-xl bg-foreground px-6 py-4 text-base font-semibold text-background transition hover:opacity-90 sm:w-auto sm:min-w-[200px]"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
}
