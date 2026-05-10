# sniper · backend

A Hono + TypeScript HTTP service. Today it serves mock data so the frontend has something to call; the same routes will read from Supabase once the schema lands.

## Stack

- Hono 4 (running on `@hono/node-server`)
- TypeScript (ESM, `tsx` for dev/start)
- `@supabase/supabase-js` (service-role client, lazy-loaded)
- `zod` for input validation

## Run

```bash
cd backend
cp .env.example .env             # not required for boot — only DB-backed routes need keys
npm install
npm run dev                      # http://localhost:8080
```

Other scripts:

```bash
npm run start       # one-shot start (no watch)
npm run typecheck   # tsc --noEmit
npm run build       # emit JS to dist/
```

## Endpoints

| Method | Path                              | Returns                                          |
| ------ | --------------------------------- | ------------------------------------------------ |
| GET    | `/`                               | service banner + version                         |
| GET    | `/health`                         | `{ status, uptime, now }` for liveness checks    |
| GET    | `/api/roles`                      | all roles                                        |
| GET    | `/api/roles/:id`                  | single role                                      |
| GET    | `/api/candidates?roleId=frontend` | candidates filtered by role (optional)           |
| GET    | `/api/candidates/:id`             | single candidate                                 |
| GET    | `/api/gems`                       | gem-flagged candidates only                      |

Quick check:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/roles
curl 'http://localhost:8080/api/candidates?roleId=frontend'
curl http://localhost:8080/api/gems
```

## Layout

```
backend/
├── src/
│   ├── index.ts          # Hono app + server bootstrap
│   ├── routes/           # one file per resource
│   └── lib/
│       ├── mock-data.ts  # swap with Supabase queries when schema lands
│       └── supabase.ts   # service-role client (lazy)
├── tsconfig.json
└── package.json
```

## Env

| Var                          | Required for          |
| ---------------------------- | --------------------- |
| `PORT`                       | optional (default 8080) |
| `NEXT_PUBLIC_SUPABASE_URL`   | Supabase reads/writes |
| `SUPABASE_SERVICE_ROLE_KEY`  | Supabase reads/writes |
| `OPENAI_API_KEY`             | LLM grading (later)   |
| `RESEND_API_KEY`             | OA email dispatch (later) |
| `DEVPOST_USER_AGENT`         | Devpost scraper (later)   |

## What lives here next

- Devpost watcher (cron + scraper)
- Personalized OA generation + email dispatch
- LLM grading worker (anonymized inputs, audit log)
- Webhook for gem-detection notifications
