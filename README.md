# sniper

A Devpost-first recruiting platform that camps hackathon submissions, surfaces high-signal candidates before they post wins to LinkedIn, and auto-dispatches role-specific OAs.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind v4** + **shadcn/ui** (neutral base, violet accent)
- **Magic UI** — `BlurFade`, `NumberTicker`, `MagicCard`, `AnimatedList`, `ShimmerButton`, `Marquee`
- **framer-motion** for layout animations and the weight-slider reshuffle
- **Supabase** (`@supabase/ssr`) — wired up, ready for data
- **next-themes** for dark/light toggle

## Routes

- `/` — landing
- `/dashboard` — recruiter cockpit (roles, pipeline, weight controls, gem alerts)
- `/oa/[token]` — applicant assessment
- `/ethics` — sourcing & data ethics

## Getting started

```bash
cp .env.local.example .env.local   # add Supabase keys when wiring real data
npm install
npm run dev
```

Open <http://localhost:3000>.

## Design system

See [`design-system/MASTER.md`](./design-system/MASTER.md) — GitHub-inspired density, Inter + JetBrains Mono, dark mode primary, single violet accent for CTAs and gem alerts.

## What's a "gem"?

A candidate that clears your composite-score threshold. The dashboard highlights them with the violet `Gem` icon and pings recruiters via toast in real time. The dashboard ships with a "Simulate gem alert" debug button to demo the animation.

## What's not built yet

- Live Devpost scraping
- Real OA email dispatch
- LLM grading
- Auth (mock recruiter)
- Database migrations
