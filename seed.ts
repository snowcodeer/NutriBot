/**
 * Populate PostHog with synthetic funnel data for NutriBot demos.
 * Run: npx tsx seed.ts
 * Requires POSTHOG_API_KEY (project API key) and optional POSTHOG_HOST.
 */
import { randomBytes, randomInt } from "crypto";
import { PostHog } from "posthog-node";

const GOALS = ["lose_weight", "maintain", "build_muscle"] as const;
const LEVELS = ["sedentary", "lightly_active", "very_active"] as const;
const RESTRICTION_SETS = [
  ["none"],
  ["vegan"],
  ["vegetarian"],
  ["none", "other"],
  ["vegan", "other"],
] as const;

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

/** Per-user session start; events stack forward from here. */
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

  if (index >= 1000) return { events, counts: localCounts };

  push("viewed_welcome_screen", { source: "organic", app_version: "1.0.0" });
  if (index >= 850) return { events, counts: localCounts };

  push("clicked_get_started", { cta: "hero_primary" });
  if (index >= 840) return { events, counts: localCounts };

  push("viewed_goal_selection", { variant: "default" });
  if (index >= 820) return { events, counts: localCounts };

  push("selected_goal", { goal });
  if (index >= 800) return { events, counts: localCounts };

  push("viewed_body_stats", { unit_default: "metric" });
  if (index >= 750) return { events, counts: localCounts };

  push("completed_body_stats", {
    has_target_weight: hasTarget,
    unit_system: pick(["metric", "imperial"] as const),
    height_cm: heightCm,
    weight_kg: weightKg,
  });
  if (index >= 740) return { events, counts: localCounts };

  push("viewed_activity_level");
  if (index >= 730) return { events, counts: localCounts };

  push("selected_activity_level", { level });
  if (index >= 720) return { events, counts: localCounts };

  push("viewed_diet_preferences");
  if (index >= 700) return { events, counts: localCounts };

  push("completed_diet_preferences", { restrictions: [...restrictions] });
  if (index >= 690) return { events, counts: localCounts };

  push("viewed_your_plan", {
    preview_calories_band: pick(["low", "mid", "high"] as const),
  });
  if (index >= 650) return { events, counts: localCounts };

  push("clicked_see_my_plan", { placement: "plan_card" });
  if (index >= 630) return { events, counts: localCounts };

  push("viewed_paywall", { variant: "pre_value_hard" });

  if (index < 15) {
    push("clicked_lifetime_deal", { price_usd: 49, visibility: "footer_micro" });
  }

  /* 90 trial starts (0–89); 80 complete via trial (0–79); 10 trial-only drop (80–89);
     8 complete via skip without trial (90–97). */
  if (index < 90) {
    push("started_free_trial", { plan: "monthly_9_99" });
    if (index < 80) {
      push("completed_onboarding", { path: "trial" });
    }
  } else if (index < 98) {
    push("skipped_paywall", { surface: "maybe_later_microcopy" });
    push("completed_onboarding", { path: "skip" });
  }

  return { events, counts: localCounts };
}

async function main() {
  const apiKey = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host =
    process.env.POSTHOG_HOST ??
    process.env.NEXT_PUBLIC_POSTHOG_HOST ??
    "https://us.i.posthog.com";

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

  console.log("\nNutriBot seed complete.\n");
  console.log("Total events sent:", allEvents.length);
  console.log("\nPer-event totals (should match funnel story):");
  const order = [
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
    "clicked_lifetime_deal",
    "skipped_paywall",
    "completed_onboarding",
  ];
  for (const name of order) {
    console.log(`  ${name}: ${globalCounts[name] ?? 0}`);
  }
  console.log(
    "\nUnique users with viewed_paywall:",
    userIds.slice(0, 630).length,
    "| started_free_trial cohort size: 90 | completed_onboarding: 88"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
