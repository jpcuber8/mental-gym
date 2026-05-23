# Codex Rules

## Product Boundaries

- Build a personal NCAA cross country mental performance app.
- Do not turn it into a public wellness SaaS product.
- Do not add coach dashboards, billing, team features, admin panels, or enterprise auth.
- Do not add Supabase unless a future request clearly needs sync, backup, or authentication.
- Do not add AI or paid APIs.
- Keep the app deployable to Vercel.

## Technical Rules

- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS.
- Keep persistence behind `lib/storage.ts`.
- Keep recommendation logic in `lib/recommendation.ts`.
- Keep season calendar and phase logic in `lib/season.ts`.
- Keep station content and scripts in `lib/stations.ts`.
- Keep shared types in `types/mental-gym.ts`.
- Prefer local-first data and simple browser APIs.

## Recommendation Rules

The engine should remain clear and auditable.

Rules to preserve:

- If race is within 24 hours, use only regulation, imagery, and routine rehearsal.
- If stress is high for three recent sessions, prescribe regulation.
- If confidence is low but stress is moderate, prescribe imagery plus self-talk.
- If focus is low, prescribe attention anchors.
- If adherence is low this week, shrink to a 3-minute maintenance session.
- If usefulness or execution is poor twice in a row, regress or switch station.
- If a module succeeds three times, increase one level.
- If transition phase is active, prioritize grounding, controllables, and stable routine.
- If travel phase is active, prioritize short, forgiving sessions and sleep/downshift.
- If Big Bear phase is active, prioritize patience, adaptation, and group composure.
- Near key races, reduce novelty and complexity.

## Design Rules

- Mobile-first.
- No landing page as the first screen.
- Use real app UI immediately.
- Keep copy short during guided sessions.
- Use non-punitive adherence language.
- Make the app feel calm, focused, athletic, and personal.
- Avoid clinical framing unless it is a safety disclaimer.

## Content Rules

- Session content must be specific to distance running and cross country.
- Avoid lorem ipsum.
- Avoid generic self-help copy.
- Avoid brain games and cognitive-fatigue drills as the core product.

## Safety Rules

- The app is not mental health care.
- Do not add clinical screening unless there is a qualified referral path.
- Keep performance logs private by default.
- Include clear crisis language in Settings.
