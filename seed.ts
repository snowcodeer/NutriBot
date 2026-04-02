import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

/**
 * Populate PostHog with synthetic funnel data for NutriBot demos.
 * Run: npm run seed
 * Loads `.env.local` / `.env` automatically. Or set POSTHOG_API_KEY / NEXT_PUBLIC_POSTHOG_KEY yourself.
 *
 * Emits every event used by `nutribotAnalytics` plus rich properties and $set person fields
 * so funnels, breakdowns, and person profiles look populated in PostHog.
 *
 * Synthetic KPIs (intentionally weak):
 * - Onboarding completion: completed_onboarding / clicked_get_started ≈ low single digits %
 * - Paywall conversion: started_free_trial / viewed_paywall ≈ ~2%
 * - Trial cancellation: cancelled_free_trial / started_free_trial ≈ most users
 */
import { randomBytes, randomInt } from "crypto";
import { PostHog } from "posthog-node";

import { computeDailyCalorieTarget } from "./lib/calories";
import type { ActivityLevel, Goal } from "./lib/onboarding-types";

const GOALS = ["lose_weight", "maintain", "build_muscle"] as const satisfies readonly Goal[];
const LEVELS = [
  "sedentary",
  "lightly_active",
  "very_active",
] as const satisfies readonly ActivityLevel[];
const RESTRICTION_SETS = [
  ["none"],
  ["vegan"],
  ["vegetarian"],
  ["none", "other"],
  ["vegan", "other"],
] as const;

/** Paywall viewers who start a trial (~2% of paywall). */
const PAYWALL_VIEWERS = 630;
const TRIAL_STARTERS = 13;
const TRIAL_CANCELLED = 11;
const SKIP_AND_COMPLETE = 8;
const LIFETIME_CLICKS = 15;

function distinctId(): string {
  return `user_${randomBytes(5).toString("hex")}`;
}

function pick<T>(arr: readonly T[]): T {
  return arr[randomInt(arr.length)]!;
}

function randomMsInLast7Days(): number {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  return now - randomInt(weekMs);
}

function sessionStartMs(): number {
  return randomMsInLast7Days();
}

function nextEventTime(prev: Date): Date {
  const gap = randomInt(15_000, 240_000);
  return new Date(prev.getTime() + gap);
}

type Queued = {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
};

function buildQueueForUser(
  id: string,
  index: number
): { events: Queued[]; counts: Record<string, number> } {
  const localCounts: Record<string, number> = {};
  const bump = (name: string) => {
    localCounts[name] = (localCounts[name] ?? 0) + 1;
  };

  const goal = pick(GOALS);
  const level = pick(LEVELS);
  const restrictions = pick(RESTRICTION_SETS);
  const heightCm = 155 + randomInt(35);
  const weightKg = 52 + randomInt(45);
  const hasTarget = randomInt(10) > 1;
  const unitSystem = pick(["metric", "imperial"] as const);

  let t = new Date(sessionStartMs());
  const events: Queued[] = [];

  const push = (
    event: string,
    properties?: Record<string, unknown>
  ) => {
    events.push({ distinctId: id, event, properties, timestamp: new Date(t) });
    bump(event);
    t = nextEventTime(t);
  };

  const flushAppAfterOnboarding = (path: "trial_retained" | "skip") => {
    const dailyTarget = computeDailyCalorieTarget(
      weightKg,
      heightCm,
      level,
      goal
    );
    push("viewed_app_home", {
      daily_calorie_target: dailyTarget,
      goal,
      $set: {
        goal,
        activity_level: level,
        daily_calorie_target: dailyTarget,
        height_cm: heightCm,
        weight_kg: Math.round(weightKg * 10) / 10,
        diet_restrictions: [...restrictions],
        onboarding_completed_path: path,
        has_target_weight: hasTarget,
        unit_system: unitSystem,
        app_version: "1.0.0",
      },
    });
    push("viewed_dashboard", {
      has_calorie_target: true,
      goal,
    });
    if (randomInt(10) < 4) {
      push("clicked_rerun_setup", { surface: "tab_bar_me" });
    }
  };

  push("viewed_homepage", {
    entry: pick(["direct", "organic", "social", "referral"] as const),
    device_class: "mobile",
    app_version: "1.0.0",
  });

  if (index >= 990) {
    return { events, counts: localCounts };
  }

  if (index >= 980) {
    push("clicked_home_dashboard", { placement: "header", intent: "open_app" });
    return { events, counts: localCounts };
  }

  push("clicked_home_get_started", {
    placement: pick(["header", "hero"] as const),
  });

  push("viewed_welcome_screen", { source: "organic", app_version: "1.0.0" });
  if (index >= 850) return { events, counts: localCounts };

  push("clicked_get_started", { cta: "welcome_primary" });
  if (index >= 840) return { events, counts: localCounts };

  push("viewed_goal_selection", {
    variant: "default",
    step_index: 1,
  });
  if (index >= 820) return { events, counts: localCounts };

  push("selected_goal", { goal });
  if (index >= 800) return { events, counts: localCounts };

  push("viewed_body_stats", {
    unit_default: "metric",
    fields: ["height", "weight", "target_weight"],
  });
  if (index >= 750) return { events, counts: localCounts };

  push("completed_body_stats", {
    has_target_weight: hasTarget,
    unit_system: unitSystem,
    height_cm: heightCm,
    weight_kg: Math.round(weightKg * 10) / 10,
  });
  if (index >= 740) return { events, counts: localCounts };

  push("viewed_activity_level", { layout: "cards" });
  if (index >= 730) return { events, counts: localCounts };

  push("selected_activity_level", { level });
  if (index >= 720) return { events, counts: localCounts };

  push("viewed_diet_preferences", { multi_select: true });
  if (index >= 700) return { events, counts: localCounts };

  push("completed_diet_preferences", { restrictions: [...restrictions] });
  if (index >= 690) return { events, counts: localCounts };

  push("viewed_your_plan", {
    preview_calories_band: pick(["low", "mid", "high"] as const),
  });
  if (index >= 650) return { events, counts: localCounts };

  push("clicked_see_my_plan", { placement: "plan_card" });
  if (index >= PAYWALL_VIEWERS) return { events, counts: localCounts };

  push("viewed_paywall", {
    variant: "pre_value_hard",
    price_shown_usd: 9.99,
  });

  if (index < LIFETIME_CLICKS) {
    push("clicked_lifetime_deal", {
      price_usd: 49,
      visibility: "footer_micro",
    });
  }

  /*
   * Paywall cohort (first PAYWALL_VIEWERS users): terrible conversion + retention story.
   * - Indices 0..TRIAL_STARTERS-1: start trial (≈2% of paywall views).
   * - Indices 0..TRIAL_CANCELLED-1: cancel trial soon after (most trial starters churn).
   * - Indices TRIAL_CANCELLED..TRIAL_STARTERS-1: keep trial + completed_onboarding + app home.
   * - Indices TRIAL_STARTERS..TRIAL_STARTERS+SKIP_AND_COMPLETE-1: skip paywall + complete + app home.
   * Everyone else: hits paywall and bounces (no completion).
   */
  if (index < TRIAL_STARTERS) {
    push("started_free_trial", { plan: "monthly_9_99" });
    if (index < TRIAL_CANCELLED) {
      push("cancelled_free_trial", {
        reason: pick([
          "price_shock",
          "accidental_tap",
          "reminder_email",
          "app_store_flow",
        ] as const),
        within_hours: pick([1, 6, 12, 24, 48] as const),
      });
    } else {
      push("completed_onboarding", { path: "trial_retained" });
      flushAppAfterOnboarding("trial_retained");
    }
  } else if (index < TRIAL_STARTERS + SKIP_AND_COMPLETE) {
    push("skipped_paywall", {
      surface: "maybe_later_microcopy",
      dismiss_method: "text_link",
    });
    push("completed_onboarding", { path: "skip" });
    flushAppAfterOnboarding("skip");
  }

  return { events, counts: localCounts };
}

async function main() {
  const apiKey = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host =
    process.env.POSTHOG_HOST ??
    process.env.NEXT_PUBLIC_POSTHOG_HOST ??
    "https://eu.i.posthog.com";

  if (!apiKey) {
    console.error(
      "Missing POSTHOG_API_KEY (or NEXT_PUBLIC_POSTHOG_KEY). Set your PostHog project API key."
    );
    process.exit(1);
  }

  const ids = new Set<string>();
  while (ids.size < 1000) {
    ids.add(distinctId());
  }
  const userIds = Array.from(ids);

  const allEvents: Queued[] = [];
  const globalCounts: Record<string, number> = {};

  for (let i = 0; i < 1000; i++) {
    const { events, counts } = buildQueueForUser(userIds[i]!, i);
    allEvents.push(...events);
    for (const [k, v] of Object.entries(counts)) {
      globalCounts[k] = (globalCounts[k] ?? 0) + v;
    }
  }

  allEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const client = new PostHog(apiKey, { host, flushAt: 100, flushInterval: 0 });

  for (const e of allEvents) {
    client.capture({
      distinctId: e.distinctId,
      event: e.event,
      properties: e.properties,
      timestamp: e.timestamp,
    });
  }

  await client.shutdown();

  const started = globalCounts["started_free_trial"] ?? 0;
  const paywallViews = globalCounts["viewed_paywall"] ?? 0;
  const cancelled = globalCounts["cancelled_free_trial"] ?? 0;
  const completed = globalCounts["completed_onboarding"] ?? 0;
  const getStarted = globalCounts["clicked_get_started"] ?? 0;

  console.log("\nNutriBot seed complete.\n");
  console.log("Host:", host);
  console.log("Total events sent:", allEvents.length);
  console.log("\nPer-event totals:");
  const order = [
    "viewed_homepage",
    "clicked_home_get_started",
    "clicked_home_dashboard",
    "viewed_welcome_screen",
    "clicked_get_started",
    "viewed_goal_selection",
    "selected_goal",
    "viewed_body_stats",
    "completed_body_stats",
    "viewed_activity_level",
    "selected_activity_level",
    "viewed_diet_preferences",
    "completed_diet_preferences",
    "viewed_your_plan",
    "clicked_see_my_plan",
    "viewed_paywall",
    "started_free_trial",
    "cancelled_free_trial",
    "clicked_lifetime_deal",
    "skipped_paywall",
    "completed_onboarding",
    "viewed_app_home",
    "viewed_dashboard",
    "clicked_rerun_setup",
  ];
  for (const name of order) {
    const n = globalCounts[name] ?? 0;
    if (n > 0) console.log(`  ${name}: ${n}`);
  }

  const paywallConvPct = paywallViews ? (started / paywallViews) * 100 : 0;
  const trialCancelPct = started ? (cancelled / started) * 100 : 0;
  const onboardPct = getStarted ? (completed / getStarted) * 100 : 0;

  console.log("\n--- Synthetic health metrics (should look bad) ---");
  console.log(
    `Paywall conversion (started_free_trial / viewed_paywall): ${started}/${paywallViews} ≈ ${paywallConvPct.toFixed(1)}% (target ~2%)`
  );
  console.log(
    `Trial cancellation (cancelled_free_trial / started_free_trial): ${cancelled}/${started} ≈ ${trialCancelPct.toFixed(0)}% (most cancel)`
  );
  console.log(
    `Onboarding completion (completed_onboarding / clicked_get_started): ${completed}/${getStarted} ≈ ${onboardPct.toFixed(1)}% (most never finish)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
