# Data Model

Mental Gym V1 is local-first and does not use Supabase.

Data is stored in browser `localStorage` through `lib/storage.ts`. This keeps the personal app simple, private by default, and deployable to Vercel without backend setup.

Optional cross-device sync stores one JSON document in Upstash Redis through `app/api/sync/route.ts`.

## Stored Shape

### settings

- `name`
- `reducedMotion`

### sessions

Completed guided mental workouts.

Fields:

- `id`
- `date`
- `completedAt`
- `phaseId`
- `stationId`
- `stationTitle`
- `level`
- `mode`
- `title`
- `durationMinutes`
- `readiness`
- `reflection`

### readiness

Fields:

- `stress`
- `focus`
- `confidence`
- `freshness`
- `workoutType`
- `notes`

### reflection

Fields:

- `usefulness`
- `execution`
- `carryoverCue`
- `note`

### customCues

Recent carryover cues saved from reflections.

### skillProgress

Per-station level and success streak.

Stations:

- `breathing`
- `attention`
- `selfTalk`
- `imagery`
- `processGoals`
- `routine`
- `reset`

## Export / Import

The Settings page supports JSON export and import.

Export is useful for:

- manual backups
- moving data to another browser
- preserving data before clearing browser storage

## Cloud Sync

Cloud sync is intentionally small:

- one Redis key: `mental-gym:v1:data`
- one protected API route: `/api/sync`
- one shared secret: `MENTAL_GYM_SYNC_SECRET`
- no account system
- no coach dashboard
- no Supabase

The client still saves locally first. Settings can push local data to the cloud or pull and merge cloud data onto the current device.

## Why No Full Backend In V1

The app is for one user and does not need authentication, multi-user data, coach sharing, billing, or server-side analytics.

Supabase or another backend may become useful later if the app needs:

- sync across devices
- encrypted cloud backup
- login-gated private deployment
- server-side recommendations
- long-term storage that survives browser resets

The current minimal backend mirrors the local data model rather than redesigning the app around a SaaS schema.
