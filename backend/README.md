# sniper · backend

A Hono + TypeScript HTTP service backed by Supabase Postgres. All routes read
from and write back to the database — the frontend has a graceful mock-data
fallback if the API is unreachable, but the canonical state lives here.

## Stack

- Hono 4 on `@hono/node-server`
- TypeScript (ESM, `tsx` for dev/start)
- `@supabase/supabase-js` (service-role, lazy-loaded)
- `zod` for input validation
- `node-cron` for the Devpost watcher + grading worker

## Run

```bash
cd backend
cp .env.example .env       # fill in Supabase URL + service role key
npm install
npm run dev                # http://localhost:8080
```

Other scripts:

```bash
npm run start       # one-shot start (no watch)
npm run typecheck   # tsc --noEmit
npm run build       # emit JS to dist/
```

## Database setup

The schema lives in `supabase/migrations/`. To apply migrations to your
Supabase project, pick one:

### Option A · Supabase CLI (recommended)

```bash
# from the backend/ directory, with the project linked
supabase db push
```

### Option B · Supabase Studio SQL editor

Open SQL editor → New query → paste each migration file in order:

1. `20260510000001_initial_schema.sql`
2. `20260510000002_seed_data.sql`
3. `20260510000003_grading_columns.sql`
4. `20260510000004_dashboard_writeback.sql`  *(new — rubrics, outreach drafts, candidate projects, candidate emails)*
5. `20260510000005_dashboard_seed.sql`       *(new — 4 rubric presets + projects + emails for seeded candidates)*

After applying, `select count(*) from rubrics, candidate_projects` should be non-zero.

## Endpoints

| Method | Path                                       | Purpose                                            |
| ------ | ------------------------------------------ | -------------------------------------------------- |
| GET    | `/`                                        | service banner                                     |
| GET    | `/health`                                  | liveness                                           |
| GET    | `/api/roles`                               | all roles (with stats: pipeline / gems / OAs)      |
| GET    | `/api/roles/:id`                           | single role                                        |
| GET    | `/api/candidates?roleId=frontend`          | candidates (optional filter)                       |
| GET    | `/api/candidates/:id`                      | single candidate                                   |
| GET    | `/api/candidates/:id/projects`             | recent indexed projects (Reading Room)             |
| POST   | `/api/candidates/:id/gem`                  | toggle is_gem (body: `{ isGem? }`)                 |
| GET    | `/api/gems`                                | flagged gems across all roles                      |
| GET    | `/api/rubrics`                             | saved rubrics for the workspace                    |
| GET    | `/api/rubrics/:slug`                       | single rubric                                      |
| PUT    | `/api/rubrics/:slug`                       | upsert (auto-save from the workbench)              |
| POST   | `/api/rubrics/:slug/set-default`           | mark this rubric the workspace default             |
| GET    | `/api/outreach`                            | list drafts (per recruiter)                        |
| GET    | `/api/outreach/:candidateId`               | single draft (null if untouched)                   |
| PUT    | `/api/outreach/:candidateId`               | upsert draft (`{ body, status? }`)                 |
| DELETE | `/api/outreach/:candidateId`               | remove draft                                       |
| POST   | `/api/oa/dispatch`                         | create token + email candidate                     |
| GET    | `/api/oa/:token`                           | validate token + return questions                  |
| POST   | `/api/oa/:token/submit`                    | save responses, mark token used                    |
| POST   | `/dev/grade`                               | dev-only: run the grading worker once              |

Quick check (server must be running with a configured Supabase):

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/roles
curl http://localhost:8080/api/rubrics
curl http://localhost:8080/api/candidates/cand_01/projects
```

## Layout

```
backend/
├── src/
│   ├── index.ts            # Hono app + server bootstrap + cron starters
│   ├── routes/
│   │   ├── roles.ts        # roles + stats view
│   │   ├── candidates.ts   # list/get/projects/gem-toggle
│   │   ├── gems.ts         # flagged candidates
│   │   ├── rubrics.ts      # GET, PUT (auto-save), set-default
│   │   ├── outreach.ts     # GET, PUT (auto-save), DELETE drafts
│   │   └── oa.ts           # dispatch, token validation, submit
│   ├── jobs/
│   │   ├── devpost-watcher.ts   # cron: poll Devpost (gated on env)
│   │   └── grading-worker.ts    # cron: LLM-grade pending OA responses
│   └── lib/
│       ├── supabase.ts     # service-role client (lazy, throws if missing env)
│       ├── openai.ts       # client wrapper
│       ├── resend.ts       # email transport
│       ├── oa-email.ts     # OA invite template
│       └── devpost.ts      # scraper helpers
└── supabase/migrations/    # numbered SQL files; apply in order
```

## Env

| Var                          | Used by                                |
| ---------------------------- | -------------------------------------- |
| `PORT`                       | server (optional, default 8080)        |
| `NEXT_PUBLIC_SUPABASE_URL`   | all DB-backed routes                   |
| `SUPABASE_SERVICE_ROLE_KEY`  | all DB-backed routes                   |
| `OPENAI_API_KEY`             | grading worker                         |
| `RESEND_API_KEY`             | OA email dispatch                      |
| `DEVPOST_USER_AGENT`         | Devpost watcher (when scraping is on)  |

## Frontend integration

The frontend (`../frontend`) reads `NEXT_PUBLIC_API_URL` (defaults to
`http://localhost:8080`). Each fetch wraps the API call in a `tryOr` —
if the backend or DB is unreachable, the UI falls back to mock data and
flips a "demo mode" banner. Once your `.env` is in place and migrations
have been applied, everything reads from Postgres.
