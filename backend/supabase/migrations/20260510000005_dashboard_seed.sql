-- ============================================================
-- sniper · dashboard seed data
--   - 4 rubric presets for the seeded recruiter
--   - candidate emails (placeholder {handle}@example.com)
--   - candidate_projects: 2–3 per indexed candidate
-- ============================================================

-- ── candidate emails ─────────────────────────────────────────
update candidates set email = handle || '@example.com' where email is null;

-- ── rubrics ──────────────────────────────────────────────────
insert into rubrics (recruiter_id, slug, title, description, weights, is_default)
values
  ('11111111-1111-1111-1111-111111111111', 'founding-eng',
   'Founding engineer',
   'Hand of the writer over volume. Craft 35 / signal 35 / depth 20 / fit 10.',
   '{"craft": 35, "signal": 35, "depth": 20, "fit": 10}'::jsonb,
   true),
  ('11111111-1111-1111-1111-111111111111', 'forward-deployed',
   'Forward-deployed',
   'Velocity and adaptability. Signal 40 / fit 25 / craft 20 / depth 15.',
   '{"craft": 20, "signal": 40, "depth": 15, "fit": 25}'::jsonb,
   false),
  ('11111111-1111-1111-1111-111111111111', 'design-engineer',
   'Design engineer',
   'Demo legibility weighted into craft. Craft 45 / depth 25 / signal 20 / fit 10.',
   '{"craft": 45, "signal": 20, "depth": 25, "fit": 10}'::jsonb,
   false),
  ('11111111-1111-1111-1111-111111111111', 'research',
   'Research-leaning',
   'Depth of investigation, not throughput. Depth 45 / craft 30 / signal 15 / fit 10.',
   '{"craft": 30, "signal": 15, "depth": 45, "fit": 10}'::jsonb,
   false)
on conflict (recruiter_id, slug) do nothing;

-- ── candidate_projects ───────────────────────────────────────
-- Each candidate gets a top project (matching their candidates.top_project)
-- plus two older entries, so the reading room has a real timeline.

insert into candidate_projects (candidate_id, title, hackathon, body, occurred_on, sort_order)
values
  -- cand_01 · Sarah Khan (frontend gem)
  ('cand_01', 'NeuralCanvas',                'HackMIT 2025',     'WebGPU + React 19 sketch surface. 31 commits in 48h, README is short, demo ships at 240ms on 3G.', '2026-05-04', 0),
  ('cand_01', 'shadcn-charts patches',       'OSS · Mar',        'Sent three accepted PRs that cut bundle size 18%. Tests written before bugs.',                  '2026-03-11', 1),
  ('cand_01', 'CRDT note prototype',         'TreeHacks 2025',   'First public CRDT writeup. Solo author, public Loom of the architecture.',                     '2025-02-21', 2),

  -- cand_02 · Diego Alvarez (frontend)
  ('cand_02', 'InboxZero',                   'TreeHacks 2026',   'Ships under 24h. Two TreeHacks wins on the trot, both with clean commit graphs.',              '2026-05-09', 0),
  ('cand_02', 'spotify-skip-trainer',        'Personal',         'Tiny ML weighted skip-classifier with a hand-rolled visualizer.',                              '2026-02-15', 1),

  -- cand_03 · Priya Raman (frontend, OSS-heavy)
  ('cand_03', 'shadcn-charts',               'PennApps 2025',    'Maintains the chart library that 1.2k people star. Refactor depth is rare.',                    '2025-09-04', 0),
  ('cand_03', 'crdtland · talks',            'OSS · Jan',        'Wrote up Yjs vs Automerge for production teams. Sober, not promotional.',                       '2026-01-10', 1),

  -- cand_06 · Mateo Ferreira (ML gem)
  ('cand_06', 'EvalGuard',                   'HackTX 2025',      'Eval-track 1st. PyTorch-native, ships an actual eval harness, not just a notebook.',           '2025-11-19', 0),
  ('cand_06', 'rotate-quant',                'Personal',         'Quantization experiments with reproducible benchmarks. Includes the failures.',                '2026-02-04', 1),
  ('cand_06', 'embed-bench',                 'TreeHacks 2026',   'Benchmark suite for retrieval embeddings. Picked up by two labs.',                              '2026-04-22', 2),

  -- cand_07 · Anika Joshi (ML)
  ('cand_07', 'ragmate',                     'TreeHacks 2026',   'Retrieval-aware LLM with a single-page demo. Numbers reproduce.',                              '2026-04-12', 0),
  ('cand_07', 'llm-as-judge calibration',    'OSS · Feb',        'Quantified bias in judge-LLMs and shipped corrected templates.',                                '2026-02-28', 1),

  -- cand_09 · Lila Okafor (ML)
  ('cand_09', 'AnomalyHive',                 'Calhacks 2025',    'Two Calhacks wins, both anomaly-detection on streaming logs.',                                  '2025-10-08', 0),
  ('cand_09', 'tinygrad notebooks',          'Personal',         'Three notebooks ported to tinygrad for clarity. Excellent comments.',                          '2026-01-14', 1),

  -- cand_11 · Ava Lindholm (designer)
  ('cand_11', 'Ferment',                     'HackMIT 2025',     'Three design-track wins. Figma file is judged-quality before judging starts.',                  '2025-10-15', 0),
  ('cand_11', 'type-as-product',             'Talk · Nov',       'Talk on type as product, not decoration. Slides themselves are typed.',                        '2025-11-22', 1),

  -- cand_12 · Rohan Mehta (designer)
  ('cand_12', 'Stillframe',                  'TreeHacks 2026',   'TreeHacks UX win. Narrative writing in the OA is strong.',                                     '2026-04-10', 0),
  ('cand_12', 'editorial-mobile',            'Personal',         'Mobile reading patterns paper. Sober, not performative.',                                       '2026-03-04', 1)

on conflict do nothing;
