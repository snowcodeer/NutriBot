"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { NUTRIBOT_STORAGE_KEY } from "@/lib/onboarding-types";

type Stored = {
  dailyCalorieTarget: number | null;
  goal: string | null;
  dietRestrictions: string[];
  savedAt: number;
};

export default function DashboardPage() {
  const [stored, setStored] = useState<Stored | null | "pending">("pending");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NUTRIBOT_STORAGE_KEY);
      if (!raw) {
        setStored(null);
        return;
      }
      setStored(JSON.parse(raw) as Stored);
    } catch {
      setStored(null);
    }
  }, []);

  if (stored === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Loading…
      </div>
    );
  }

  if (!stored?.dailyCalorieTarget) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">NutriBot</h1>
        <p className="mt-3 text-muted">Complete onboarding to see your daily goal.</p>
        <Link
          href="/onboarding"
          className="mt-8 inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-background"
        >
          Start onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <Link href="/onboarding" className="text-sm text-muted hover:text-white">
          Re-run setup
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm text-muted">Daily calorie goal</p>
        <p className="mt-2 text-3xl font-semibold text-accent">
          {stored.dailyCalorieTarget.toLocaleString()}{" "}
          <span className="text-lg font-normal text-white/50">kcal</span>
        </p>
        {stored.goal && (
          <p className="mt-3 text-sm text-muted capitalize">
            Goal: {stored.goal.replace(/_/g, " ")}
          </p>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
          Food log
        </h2>
        <div className="mt-4 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted">No meals logged yet.</p>
          <p className="mt-2 text-xs text-white/30">
            Logging will live here in a future build.
          </p>
        </div>
      </div>
    </div>
  );
}
