# sniper · frontend

The Next.js 16 app — landing, recruiter dashboard, applicant assessment, and the ethics page.

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript · Tailwind v4 · shadcn/ui (neutral base, violet accent)
- Magic UI: `BlurFade`, `NumberTicker`, `MagicCard`, `AnimatedList`, `ShimmerButton`, `Marquee`
- framer-motion · next-themes · @supabase/ssr

## Routes

- `/` — landing
- `/dashboard` — roles list → pipeline view, weight controls reshuffle the candidate list with framer-motion `layout`, gem-alert toast (Simulate button bottom-right)
- `/oa/[token]` — applicant assessment (welcome → questions → submitted)
- `/ethics` — sourcing & data ethics

## Run

```bash
cd frontend
cp .env.local.example .env.local   # add Supabase keys when wiring real data
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build / verify

```bash
npm run build   # type-check + production build
npm run lint
```

## Wiring up the backend

The frontend currently reads from `src/lib/mock-data.ts`. To switch to the live API, point `fetch` calls at the backend (default `http://localhost:8080/api/*`). See `../backend/README.md`.

## Design system

[`design-system/MASTER.md`](./design-system/MASTER.md) — GitHub-inspired density, Inter + JetBrains Mono, dark mode primary, single violet accent.
