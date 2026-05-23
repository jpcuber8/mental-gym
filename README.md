# Mental Gym

A private, local-first NCAA cross country mental performance app for a UCLA distance runner.

Mental Gym is built as a daily 5-10 minute sport psychology training room: readiness check, regulation primer, primary skill rep, cross country transfer rep, and short reflection. It is not a public SaaS product, coach dashboard, medical product, or generic wellness tracker.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Browser localStorage persistence
- Optional Vercel + Upstash Redis cloud sync
- Mobile-first design
- Vercel-ready deployment

## What The App Does

- Recommends a daily mental workout from the current season phase, upcoming races, recent check-ins, adherence, stress, focus, confidence, and prior usefulness.
- Periodizes mental training from base work through London travel, UCLA reporting transition, Big Bear altitude camp, Nuttycombe, Big Tens, and West Regional.
- Guides a complete daily session with readiness ratings, breathing, skill practice, XC-specific transfer, and reflection.
- Tracks weekly adherence, recent trends, carryover cues, and session history.
- Provides skill stations for breathing, attention, self-talk, imagery, process goals, routine rehearsal, and reset/refocus.
- Stores data locally and supports JSON export, import, and reset.
- Optionally syncs data between phone and computer with a private passcode.

## Running Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Data Persistence

V1 uses `localStorage` through `lib/storage.ts`.

Stored data includes:

- readiness check-ins
- completed sessions
- reflections
- carryover cues
- skill levels
- settings

Cloud sync is optional. When configured, the app stores one JSON document in Upstash Redis through a protected Vercel API route.

Required environment variables:

- `KV_REST_API_URL` or `UPSTASH_REDIS_REST_URL`
- `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_TOKEN`
- `MENTAL_GYM_SYNC_SECRET`

The sync passcode typed in Settings must match `MENTAL_GYM_SYNC_SECRET`.

## Project Structure

```txt
app/
  globals.css
  layout.tsx
  page.tsx
components/
  app/
    MentalGymApp.tsx
docs/
  app-flow.md
  codex-rules.md
  database-schema.md
  product-brief.md
lib/
  analytics.ts
  recommendation.ts
  season.ts
  stations.ts
  storage.ts
types/
  mental-gym.ts
```

## Deployment To Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Use the default Next.js settings.
4. For local-only mode, no environment variables are required.
5. For cross-device sync, add an Upstash Redis store from the Vercel Marketplace and set `MENTAL_GYM_SYNC_SECRET`.
6. Deploy.

Because data is local-first, each browser/device keeps its own copy. Use Settings to push/pull cloud sync or manually export/import JSON.
