-- ============================================================
-- sniper · dashboard write-back tables
--   - rubrics              : saved scoring stances per recruiter
--   - outreach_drafts      : per-candidate notes the recruiter is composing
--   - candidate_projects   : real "recent projects" for the reading room
-- plus a candidates.email column so OA dispatch can look up the recipient
-- without taking it as request input every time.
-- ============================================================

-- ── candidates.email ─────────────────────────────────────────
alter table candidates
  add column if not exists email text;

-- ── rubrics ──────────────────────────────────────────────────
create table if not exists rubrics (
  id            uuid primary key default gen_random_uuid(),
  recruiter_id  uuid references recruiters (id) on delete cascade,
  slug          text not null,
  title         text not null,
  description   text not null default '',
  weights       jsonb not null,                                    -- { craft, signal, depth, fit }
  is_default    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (recruiter_id, slug)
);

create index if not exists rubrics_recruiter_id_idx on rubrics (recruiter_id);

-- only one default per recruiter
create unique index if not exists rubrics_one_default_idx
  on rubrics (recruiter_id) where is_default;

-- ── outreach_drafts ──────────────────────────────────────────
create table if not exists outreach_drafts (
  id            uuid primary key default gen_random_uuid(),
  recruiter_id  uuid references recruiters (id) on delete cascade,
  candidate_id  text not null references candidates (id) on delete cascade,
  body          text not null default '',
  status        text not null default 'draft' check (status in ('draft', 'copied', 'sent')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (recruiter_id, candidate_id)
);

create index if not exists outreach_drafts_recruiter_id_idx on outreach_drafts (recruiter_id);
create index if not exists outreach_drafts_candidate_id_idx on outreach_drafts (candidate_id);

-- ── candidate_projects ───────────────────────────────────────
create table if not exists candidate_projects (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  text not null references candidates (id) on delete cascade,
  title         text not null,
  hackathon     text not null,
  url           text,
  body          text not null,
  occurred_on   date,
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists candidate_projects_candidate_id_idx
  on candidate_projects (candidate_id, sort_order);

-- ── updated_at triggers ──────────────────────────────────────
drop trigger if exists rubrics_updated_at on rubrics;
create trigger rubrics_updated_at
  before update on rubrics
  for each row execute function set_updated_at();

drop trigger if exists outreach_drafts_updated_at on outreach_drafts;
create trigger outreach_drafts_updated_at
  before update on outreach_drafts
  for each row execute function set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
alter table rubrics            enable row level security;
alter table outreach_drafts    enable row level security;
alter table candidate_projects enable row level security;

-- anon read on candidate_projects is safe (recruiter-facing display data)
create policy "anon can read candidate_projects"
  on candidate_projects for select to anon using (true);
