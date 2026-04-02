export type Goal = "lose_weight" | "maintain" | "build_muscle";

export type ActivityLevel = "sedentary" | "lightly_active" | "very_active";

export type UnitSystem = "metric" | "imperial";

export type DietRestriction = "vegan" | "vegetarian" | "none" | "other";

export type OnboardingData = {
  goal: Goal | null;
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg: number | null;
  unitSystem: UnitSystem;
  activityLevel: ActivityLevel | null;
  dietRestrictions: DietRestriction[];
  dailyCalorieTarget: number | null;
};

export const initialOnboardingData: OnboardingData = {
  goal: null,
  heightCm: null,
  weightKg: null,
  targetWeightKg: null,
  unitSystem: "metric",
  activityLevel: null,
  dietRestrictions: [],
  dailyCalorieTarget: null,
};

export const NUTRIBOT_STORAGE_KEY = "nutribot_onboarding";
