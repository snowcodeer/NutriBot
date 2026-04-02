import OpenAI from "openai";

/**
 * Server-side OpenAI client for future NutriBot features (not used in onboarding v1).
 */
export function createOpenAIClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}
