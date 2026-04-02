"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

import { nutribotAnalytics } from "@/lib/posthog";

export type StoredProfile = {
  dailyCalorieTarget: number;
  goal: string | null;
  dietRestrictions: string[];
  savedAt: number;
};

type Props = {
  profile: StoredProfile;
};

export function AppHome({ profile }: Props) {
  useEffect(() => {
    nutribotAnalytics.viewedAppHome({
      daily_calorie_target: profile.dailyCalorieTarget,
      goal: profile.goal,
    });
    nutribotAnalytics.viewedDashboard({
      has_calorie_target: true,
      goal: profile.goal,
    });
  }, [profile.dailyCalorieTarget, profile.goal]);

  const goalLabel = profile.goal
    ? profile.goal.replace(/_/g, " ")
    : "Your plan";

  const dietSummary =
    profile.dietRestrictions?.length > 0
      ? profile.dietRestrictions.join(", ")
      : "No restrictions";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            NutriBot
          </Link>
          <nav className="flex items-center gap-4 text-sm sm:gap-6">
            <a
              href="#food-log"
              className="text-muted transition hover:text-foreground"
            >
              Food log
            </a>
            <a
              href="#today"
              className="hidden text-muted transition hover:text-foreground sm:inline"
            >
              Today
            </a>
            <Link
              href="/onboarding"
              onClick={() => nutribotAnalytics.clickedRerunSetup()}
              className="text-muted transition hover:text-foreground"
            >
              Adjust plan
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-5 pb-12 pt-10 sm:pt-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm text-muted">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome home
            </h1>
            <p className="mt-2 max-w-xl text-muted">
              Your daily target is set. Log meals below when you&apos;re ready—no
              pressure, just clarity.
            </p>
          </motion.div>

          <div
            id="today"
            className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-2 rounded-2xl border border-border bg-surface/80 p-8 sm:p-10"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Daily calorie target
              </p>
              <p className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
                {profile.dailyCalorieTarget.toLocaleString()}
                <span className="ml-2 text-2xl font-normal text-foreground/45">
                  kcal
                </span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-border bg-background px-4 py-1.5 text-sm capitalize">
                  Goal: {goalLabel}
                </span>
                <span className="rounded-full border border-border bg-background px-4 py-1.5 text-sm">
                  Diet: {dietSummary}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              {[
                { label: "Logged today", value: "—", hint: "Meals you add appear here" },
                { label: "Remaining", value: "—", hint: "Updates when logging ships" },
                { label: "Streak", value: "Day 1", hint: "Build consistency over time" },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-border bg-background p-5"
                >
                  <p className="text-xs uppercase tracking-wider text-muted">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{card.value}</p>
                  <p className="mt-1 text-xs text-foreground/40">{card.hint}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section
          id="food-log"
          className="border-t border-border bg-surface/30 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-5xl px-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
                  Food log
                </h2>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  Today&apos;s meals
                </p>
                <p className="mt-1 max-w-md text-sm text-muted">
                  Search, scan, or quick-add foods—this area is ready for your next
                  build.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="shrink-0 rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground/35"
              >
                Add meal (soon)
              </button>
            </div>
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-background py-20 text-center">
              <p className="text-muted">No meals logged yet.</p>
              <p className="mt-2 text-sm text-foreground/35">
                Your log will show calories toward your{" "}
                {profile.dailyCalorieTarget.toLocaleString()} kcal goal.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
            Stay on track
          </h2>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            Built around your goal
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "One number",
                body: "Your target stays visible so every choice stays intentional.",
              },
              {
                title: "Lightweight logging",
                body: "Designed for quick taps—not typing novels after every snack.",
              },
              {
                title: "Adjust anytime",
                body: "Re-run setup if your weight, activity, or diet changes.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border p-6"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} NutriBot</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <Link
              href="/onboarding"
              onClick={() => nutribotAnalytics.clickedRerunSetup()}
              className="hover:text-foreground"
            >
              Adjust plan
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
