/**
 * Demo calorie target: Mifflin–St Jeor BMR averaged for sex (no gender field in onboarding),
 * multiplied by activity, then adjusted for goal. Clamp to a sane floor.
 */
import type { ActivityLevel, Goal } from "./onboarding-types";

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  very_active: 1.55,
};

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose_weight: -500,
  maintain: 0,
  build_muscle: 200,
};

/** Average of MSJ male (+5) and female (-161) offsets at a fixed reference age. */
const MSJ_SEX_AVERAGE_OFFSET = -78;
const DEFAULT_AGE = 30;

export function computeDailyCalorieTarget(
  weightKg: number,
  heightCm: number,
  activityLevel: ActivityLevel,
  goal: Goal
): number {
  const bmr =
    10 * weightKg + 6.25 * heightCm - 5 * DEFAULT_AGE + MSJ_SEX_AVERAGE_OFFSET;
  const tdee = bmr * ACTIVITY_FACTORS[activityLevel];
  const raw = tdee + GOAL_ADJUSTMENTS[goal];
  return Math.max(1200, Math.round(raw));
}
