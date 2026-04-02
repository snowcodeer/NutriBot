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
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Loading…
      </div>
    );
  }

  if (phase === "app" && profile) {
    return <AppHome profile={profile} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <span className="text-lg font-semibold tracking-tight">NutriBot</span>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              onClick={() => nutribotAnalytics.clickedHomeDashboard()}
              className="text-muted transition hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/onboarding"
              onClick={() => nutribotAnalytics.clickedHomeGetStarted()}
              className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-5 pb-20 pt-16 sm:pt-24">
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              Calorie tracking, simplified
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Track less.
              <br />
              Achieve more.
            </h1>
            <p className="mt-6 text-lg text-muted sm:text-xl">
              Set your goal, get a clear daily target, and log meals without the
              spreadsheet energy. Built for people who want results, not busywork.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/onboarding"
                onClick={() => nutribotAnalytics.clickedHomeGetStarted()}
                className="inline-flex rounded-xl bg-foreground px-8 py-4 text-base font-semibold text-background transition hover:opacity-90"
              >
                Start free setup
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-xl border border-border px-8 py-4 text-base font-medium transition hover:border-foreground/30"
              >
                How it works
              </a>
            </div>
          </motion.div>
        </section>

        <section className="border-t border-border bg-surface/50 py-20">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="text-center text-sm font-medium uppercase tracking-wider text-muted">
              Why NutriBot
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-2xl font-semibold tracking-tight">
              Everything you need to stay consistent—nothing you don&apos;t.
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
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
                  className="rounded-2xl border border-border bg-background p-6"
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

        <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
            How it works
          </h2>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            Three minutes to your plan.
          </p>
          <ol className="mt-12 space-y-10">
            {[
              "Tell us your goal, body stats, and how active you are.",
              "Add diet preferences so the experience fits how you eat.",
              "Land on your personal home screen with your target and food log.",
            ].map((step, i) => (
              <li key={i} className="flex gap-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold">
                  {i + 1}
                </span>
                <p className="pt-1 text-lg text-foreground/90">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border py-20">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to see your number?
            </h2>
            <p className="mt-3 text-muted">
              No clutter—just onboarding, your target, and a clean home for meals.
            </p>
            <Link
              href="/onboarding"
              onClick={() => nutribotAnalytics.clickedHomeGetStarted()}
              className="mt-8 inline-flex rounded-xl bg-foreground px-10 py-4 text-base font-semibold text-background transition hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} NutriBot</span>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/onboarding" className="hover:text-foreground">
              Onboarding
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
