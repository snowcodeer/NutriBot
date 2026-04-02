# NutriBot

Calorie tracker demo: **Next.js 14**, **Tailwind**, **TypeScript**, **PostHog**, **Framer Motion**. Tagline: *Track less. Achieve more.*

## Setup

```bash
npm install
cp .env.example .env.local
# Add NEXT_PUBLIC_POSTHOG_KEY from PostHog → Project → Project API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you are redirected to `/onboarding`.

## Seed PostHog funnel data

Use the same **Project API key** (or a personal API key with event write access) as in PostHog docs.

```bash
export POSTHOG_API_KEY=phc_...
# optional: export POSTHOG_HOST=https://us.i.posthog.com
npx tsx seed.ts
```

Or `npm run seed` after setting env vars.

The script prints per-event totals. In PostHog, create a **Funnel** with steps `viewed_paywall` → `started_free_trial` to show the intentional cliff (about 630 → 90 unique users in seeded data).

## Deploy (Vercel + GitHub)

1. Create a new repository on GitHub and push this project (`git init`, `git remote add`, `git push`).
2. In [Vercel](https://vercel.com), **Import** the repo and set environment variables: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (if not US cloud), and optionally `OPENAI_API_KEY`.
3. Deploy; leave **Production Branch** on `main` so every push auto-deploys.

## Project layout

- `app/onboarding/` — flow controller + `screens/` (one component per step)
- `lib/posthog.tsx` — PostHog init and **all** `nutribotAnalytics.*` capture helpers
- `lib/calories.ts` — demo TDEE calculation
- `seed.ts` — synthetic history via `posthog-node`
- `competitor-screens/` — placeholder for agent/hackathon assets
