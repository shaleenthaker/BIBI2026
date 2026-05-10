-- ============================================================
-- sniper · initial schema
-- ============================================================

-- ── enums ────────────────────────────────────────────────────
create type candidate_source as enum ('Devpost', 'GitHub', 'Direct');
create type oa_status as enum ('Pending', 'In Progress', 'Submitted', 'Graded');

-- ── recruiters ───────────────────────────────────────────────
create table recruiters (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  workspace   text not null,
  created_at  timestamptz not null default now()
);

-- ── roles ────────────────────────────────────────────────────
create table roles (
  id            text primary key,        -- slug: "frontend" | "ml" | "designer"
  recruiter_id  uuid references recruiters (id) on delete cascade,
  title         text not null,
  team          text not null,
  description   text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── candidates ───────────────────────────────────────────────
create table candidates (
  id              text primary key,
  role_id         text not null references roles (id) on delete cascade,
  name            text not null,
  handle          text not null,
  avatar_seed     text not null default '',
  source          candidate_source not null,
  oa_score        numeric(4, 2) not null default 0 check (oa_score between 0 and 1),
  devpost_score   numeric(4, 2) not null default 0 check (devpost_score between 0 and 1),
  github_score    numeric(4, 2) not null default 0 check (github_score between 0 and 1),
  oa_status       oa_status not null default 'Pending',
  is_gem          boolean not null default false,
  signals         jsonb not null default '{}',
  -- { wins: int, stackMatch: float, commitFrequency: float, starsNormalized: float }
  top_project     jsonb not null default '{}',
  -- { name: text, hackathon: text, url: text }
  why_explainer   text not null default '',
  oa_response_url text not null default '',
  submitted_at    timestamptz,
  created_at      timestamptz not null default now()
);

create index candidates_role_id_idx on candidates (role_id);
create index candidates_is_gem_idx  on candidates (is_gem) where is_gem = true;

-- ── oa_questions ─────────────────────────────────────────────
-- question bank; type drives which optional columns are used
create table oa_questions (
  id                text primary key,
  role_id           text not null references roles (id) on delete cascade,
  type              text not null check (type in ('multiple-choice', 'free-response')),
  prompt            text not null,
  sort_order        int  not null default 0,
  -- multiple-choice only
  choices           jsonb,     -- string[]
  correct_index     int,
  -- free-response only
  personalized_from text,
  placeholder       text
);

create index oa_questions_role_id_idx on oa_questions (role_id, sort_order);

-- ── oa_tokens ────────────────────────────────────────────────
-- one-time links dispatched to candidates
create table oa_tokens (
  token         uuid primary key default gen_random_uuid(),
  candidate_id  text not null references candidates (id) on delete cascade,
  expires_at    timestamptz not null,
  used_at       timestamptz,
  created_at    timestamptz not null default now()
);

-- ── oa_responses ─────────────────────────────────────────────
create table oa_responses (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  text not null references candidates (id) on delete cascade,
  question_id   text not null references oa_questions (id) on delete cascade,
  answer        text not null,
  submitted_at  timestamptz not null default now(),
  unique (candidate_id, question_id)
);

-- ── devpost_submissions ──────────────────────────────────────
-- raw scraped Devpost entries (Devpost watcher writes here)
create table devpost_submissions (
  id              uuid primary key default gen_random_uuid(),
  candidate_name  text not null,
  candidate_handle text not null,
  project_name    text not null,
  hackathon_name  text not null,
  devpost_url     text not null unique,
  role_match_id   text references roles (id) on delete set null,
  match_pct       int  not null default 0 check (match_pct between 0 and 100),
  raw_json        jsonb,
  discovered_at   timestamptz not null default now(),
  notified_at     timestamptz
);

create index devpost_submissions_role_match_id_idx on devpost_submissions (role_match_id);
create index devpost_submissions_notified_at_idx   on devpost_submissions (notified_at) where notified_at is null;

-- ── roles_with_stats (view) ──────────────────────────────────
create view roles_with_stats as
select
  r.*,
  coalesce(count(c.id), 0)                                                   as candidates_in_pipeline,
  coalesce(count(c.id) filter (where c.is_gem),                         0)   as gems_flagged,
  coalesce(count(c.id) filter (where c.oa_status <> 'Pending'),         0)   as oas_out,
  max(c.submitted_at)                                                         as last_activity_at
from roles r
left join candidates c on c.role_id = r.id
group by r.id;

-- ── updated_at trigger ───────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger roles_updated_at
  before update on roles
  for each row execute function set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
-- All access goes through the service-role key (backend). Enable RLS so the
-- anon key (frontend SSR) can only read non-sensitive tables if ever needed.
alter table recruiters         enable row level security;
alter table roles              enable row level security;
alter table candidates         enable row level security;
alter table oa_questions       enable row level security;
alter table oa_tokens          enable row level security;
alter table oa_responses       enable row level security;
alter table devpost_submissions enable row level security;

-- service role bypasses RLS automatically in Supabase — no policy needed.
-- Anon read policies (safe subsets only):
create policy "anon can read roles"
  on roles for select to anon using (true);

create policy "anon can read candidates"
  on candidates for select to anon using (true);

create policy "anon can read oa_questions"
  on oa_questions for select to anon using (true);

-- Candidates can submit OA responses if they hold a valid, unexpired, unused token
create policy "token holder can insert oa_response"
  on oa_responses for insert to anon
  with check (
    exists (
      select 1 from oa_tokens t
      where t.token    = (current_setting('request.jwt.claims', true)::jsonb ->> 'oa_token')::uuid
        and t.candidate_id = oa_responses.candidate_id
        and t.expires_at   > now()
        and t.used_at     is null
    )
  );
