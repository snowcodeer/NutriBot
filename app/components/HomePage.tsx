"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { NUTRIBOT_STORAGE_KEY } from "@/lib/onboarding-types";
import { nutribotAnalytics } from "@/lib/posthog";

import { AppHome, type StoredProfile } from "./AppHome";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function HomePage() {
  const [phase, setPhase] = useState<"load" | "marketing" | "app">("load");
  const [profile, setProfile] = useState<StoredProfile | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NUTRIBOT_STORAGE_KEY);
      if (!raw) {
        setPhase("marketing");
        nutribotAnalytics.viewedHomepage();
        return;
      }
      const data = JSON.parse(raw) as {
        dailyCalorieTarget?: number | null;
        goal?: string | null;
        dietRestrictions?: string[];
        savedAt?: number;
      };
      if (
        data?.dailyCalorieTarget != null &&
        typeof data.dailyCalorieTarget === "number"
      ) {
        setProfile({
          dailyCalorieTarget: data.dailyCalorieTarget,
          goal: data.goal ?? null,
          dietRestrictions: Array.isArray(data.dietRestrictions)
            ? data.dietRestrictions
            : [],
          savedAt: typeof data.savedAt === "number" ? data.savedAt : Date.now(),
        });
        setPhase("app");
        return;
      }
    } catch {
      /* ignore */
    }
    setPhase("marketing");
    nutribotAnalytics.viewedHomepage();
  }, []);

  if (phase === "load") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Loading…
      </div>
    );
  }

  if (phase === "app" && profile) {
    return <AppHome profile={profile} />;
  }

  return (
    <div className="min-h-full bg-background pb-safe text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-base font-semibold tracking-tight">NutriBot</span>
          <nav className="flex items-center gap-2">
            <Link
              href="/dashboard"
              onClick={() => nutribotAnalytics.clickedHomeDashboard()}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-sm text-muted transition active:opacity-70"
            >
              App
            </Link>
            <Link
              href="/onboarding"
              onClick={() => nutribotAnalytics.clickedHomeGetStarted()}
              className="flex min-h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition active:opacity-90"
            >
              Start
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="px-4 pb-16 pt-8">
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.45 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Calorie tracking, simplified
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.15] tracking-tight">
              Track less.
              <br />
              Achieve more.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Set your goal, get a clear daily target, and log meals without the
              spreadsheet energy.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/onboarding"
                onClick={() => nutribotAnalytics.clickedHomeGetStarted()}
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-foreground text-base font-semibold text-background transition active:opacity-90"
              >
                Start free setup
              </Link>
              <a
                href="#how-it-works"
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-border text-base font-medium transition active:bg-surface"
              >
                How it works
              </a>
            </div>
          </motion.div>
        </section>

        <section className="border-t border-border bg-surface/50 py-12">
          <div className="px-4">
            <h2 className="text-center text-xs font-medium uppercase tracking-wider text-muted">
              Why NutriBot
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-center text-xl font-semibold tracking-tight">
              Everything you need to stay consistent—nothing you don&apos;t.
            </p>
            <div className="mt-10 flex flex-col gap-4">
              {[
                {
                  title: "Personal target",
                  body: "Your calorie goal from your stats, activity, and diet—not a generic number.",
                },
                {
                  title: "Fast logging",
                  body: "A home screen built around your daily goal and food log, ready when you are.",
                },
                {
                  title: "Clear progress",
                  body: "See where you stand against your plan without drowning in charts.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  className="rounded-2xl border border-border bg-background p-5"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-4 px-4 py-14">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
            How it works
          </h2>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            Three minutes to your plan.
          </p>
          <ol className="mt-8 space-y-6">
            {[
              "Tell us your goal, body stats, and how active you are.",
              "Add diet preferences so the experience fits how you eat.",
              "Land on your personal home screen with your target and food log.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold">
                  {i + 1}
                </span>
                <p className="pt-2 text-base leading-snug text-foreground/90">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border px-4 py-14">
          <div className="text-center">
            <h2 className="text-xl font-semibold tracking-tight">
              Ready to see your number?
            </h2>
            <p className="mt-2 text-sm text-muted">
              Onboarding, your target, and a clean home for meals.
            </p>
            <Link
              href="/onboarding"
              onClick={() => nutribotAnalytics.clickedHomeGetStarted()}
              className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-foreground text-base font-semibold text-background transition active:opacity-90"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        <span>© {new Date().getFullYear()} NutriBot</span>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/dashboard" className="active:opacity-70">
            Open app
          </Link>
          <Link href="/onboarding" className="active:opacity-70">
            Setup
          </Link>
        </div>
      </footer>
    </div>
  );
}
