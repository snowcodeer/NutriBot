# NutriBot

Calorie tracker demo: **Next.js 15**, **Tailwind**, **TypeScript**, **PostHog**, **Framer Motion**. Tagline: *Track less. Achieve more.*

## Setup

```bash
npm install
cp .env.example .env.local
# Add NEXT_PUBLIC_POSTHOG_KEY from PostHog → Project → Project API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — marketing home at `/`, onboarding at `/onboarding`.

### Dev server errors (`styled-jsx`, missing `.next` chunks, React `MODULE_NOT_FOUND`)

Usually a **corrupt `node_modules` or `.next` cache**. From the project root:

```bash
npm run clean
chmod -R u+w node_modules 2>/dev/null; rm -rf node_modules .next
npm install
npm run dev
```

Use **`styled-jsx@5.1.6`** (matches Next’s version). Avoid `styled-jsx@5.1.7` at the repo root — some publishes omit `index.js` and break `_document` / error pages.

## Seed PostHog funnel data

Use the same **Project API key** (or a personal API key with event write access) as in PostHog docs.

```bash
npm run seed
```

Reads **`POSTHOG_API_KEY`** or **`NEXT_PUBLIC_POSTHOG_KEY`** from **`.env.local`** automatically (via `dotenv`). Override host with **`POSTHOG_HOST`** if needed; EU default is `https://eu.i.posthog.com`.

Optional **`SEED_TOTAL_USERS`** (default **10000**, max 500000) scales the funnel; e.g. `SEED_TOTAL_USERS=1000 npm run seed` for a smaller test.

The seed sends **all** NutriBot funnel events (marketing, onboarding, paywall, app home) plus **`$set` person properties** for users who finish onboarding. At default scale expect **~6300** `viewed_paywall`, **~130** `started_free_trial` (≈**2%** conversion).

Or `npm run seed` after setting env vars.

The script prints per-event totals and **synthetic KPIs** (paywall conversion ~2%, high trial cancellation, low onboarding completion). In PostHog, build funnels such as `viewed_paywall` → `started_free_trial` and `started_free_trial` → `cancelled_free_trial`.

## Deploy (Vercel + GitHub)

1. Create a new repository on GitHub and push this project (`git init`, `git remote add`, `git push`).
2. In [Vercel](https://vercel.com), **Import** the repo and set environment variables: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (if not US cloud).
3. Deploy; leave **Production Branch** on `main` so every push auto-deploys.

## Project layout

- `app/onboarding/` — flow controller + `screens/` (one component per step)
- `lib/posthog.tsx` — PostHog init and **all** `nutribotAnalytics.*` capture helpers
- `lib/calories.ts` — demo TDEE calculation
- `seed.ts` — synthetic history via `posthog-node`
- `competitor-screens/` — reference notes vs MyFitnessPal, Cal AI, Duolingo (`README.md`)
