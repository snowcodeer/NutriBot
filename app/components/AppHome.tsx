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

function TabButton({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex min-h-[48px] min-w-[64px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
        active ? "text-foreground" : "text-muted"
      }`}
    >
      <span
        className={`h-1 w-8 rounded-full ${active ? "bg-foreground" : "bg-transparent"}`}
        aria-hidden
      />
      {label}
    </Link>
  );
}

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
    <div className="relative flex min-h-full flex-col bg-background text-foreground pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <h1 className="text-lg font-semibold tracking-tight">Home</h1>
        </div>
        <Link
          href="/onboarding"
          onClick={() => nutribotAnalytics.clickedRerunSetup()}
          className="flex min-h-10 min-w-10 items-center justify-center rounded-full border border-border text-xs font-medium text-muted transition active:scale-95"
        >
          Plan
        </Link>
      </header>

      <main className="flex-1 px-4 pt-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-2xl font-semibold leading-tight">
            Welcome back
          </p>
          <p className="mt-1 text-sm text-muted">
            Hit your target without the noise.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="mt-6 rounded-2xl border border-border bg-surface/80 p-5"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
            Daily budget
          </p>
          <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight">
            {profile.dailyCalorieTarget.toLocaleString()}
            <span className="ml-1 text-lg font-normal text-foreground/45">
              kcal
            </span>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs capitalize">
              {goalLabel}
            </span>
            <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs">
              {dietSummary}
            </span>
          </div>
        </motion.div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { label: "Logged", value: "—" },
            { label: "Left", value: "—" },
            { label: "Streak", value: "1" },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-border bg-background px-2 py-3 text-center"
            >
              <p className="text-[10px] uppercase tracking-wide text-muted">
                {c.label}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{c.value}</p>
            </div>
          ))}
        </div>

        <section id="food-log" className="mt-8 scroll-mt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Food log
              </h2>
              <p className="mt-1 text-lg font-semibold">Today</p>
            </div>
            <button
              type="button"
              disabled
              className="shrink-0 rounded-xl border border-border px-4 py-2.5 text-xs font-medium text-foreground/35"
            >
              Add meal
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-border py-14 text-center">
            <p className="text-sm text-muted">No meals yet</p>
            <p className="mt-1 px-4 text-xs text-foreground/35">
              Toward {profile.dailyCalorieTarget.toLocaleString()} kcal
            </p>
          </div>
        </section>

        <section className="mt-10 pb-4">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted">
            Tips
          </h2>
          <div className="mt-3 space-y-3">
            {[
              "Pre-log your lunch to stay inside budget.",
              "Small snacks add up—one tap logging helps.",
            ].map((t) => (
              <div
                key={t}
                className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-muted"
              >
                {t}
              </div>
            ))}
          </div>
        </section>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-md"
        style={{
          paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
        }}
        aria-label="Main"
      >
        <div className="mx-auto flex w-full max-w-[430px] items-stretch justify-around px-2 pt-1">
          <TabButton href="/" label="Home" active />
          <TabButton href="/#food-log" label="Log" />
          <TabButton
            href="/onboarding"
            label="Me"
            onClick={() => nutribotAnalytics.clickedRerunSetup()}
          />
        </div>
      </nav>
    </div>
  );
}
