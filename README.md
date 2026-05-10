# sniper

Devpost-first recruiting platform. Camps hackathon submissions, surfaces high-signal candidates before they post wins to LinkedIn, and auto-dispatches role-specific OAs.

## Layout

```
sniper/
├── frontend/   # Next.js 16 — landing, dashboard, OA, ethics
└── backend/    # Hono + TypeScript — REST API, mock today, Supabase soon
```

Each side is a self-contained npm project with its own README.

## Run both sides

In two terminals:

```bash
# terminal 1 — backend (port 8080)
cd backend && npm install && npm run dev

# terminal 2 — frontend (port 3000)
cd frontend && npm install && npm run dev
```

Open <http://localhost:3000>.

## Per-folder docs

- [`frontend/README.md`](./frontend/README.md) — UI, routes, design system, build
- [`backend/README.md`](./backend/README.md) — API endpoints, env vars, scripts

## Roadmap

The current cut is the UI shell + a mock API. Next:

1. Supabase schema + migrations
2. Devpost watcher (cron job in `backend/`)
3. Personalized OA generation + email dispatch
4. LLM grading worker with anonymized inputs and audit log

See [`frontend/design-system/MASTER.md`](./frontend/design-system/MASTER.md) for the visual language.
