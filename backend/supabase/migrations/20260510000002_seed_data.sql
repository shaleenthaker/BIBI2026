-- ============================================================
-- sniper · seed data (mirrors mock-data.ts for local dev)
-- ============================================================

-- ── recruiter ────────────────────────────────────────────────
insert into recruiters (id, name, email, workspace) values
  ('11111111-1111-1111-1111-111111111111', 'Maya Chen', 'maya@sniper.dev', 'Acme Talent');

-- ── roles ────────────────────────────────────────────────────
insert into roles (id, recruiter_id, title, team, description) values
  ('frontend', '11111111-1111-1111-1111-111111111111',
   'Senior Frontend Engineer', 'Platform',
   'React 18+, design-systems experience, ships fast. Hackathon-trained, not bootcamp-trained.'),
  ('ml', '11111111-1111-1111-1111-111111111111',
   'ML Engineer', 'Models',
   'PyTorch, applied research, comfortable shipping evals. We weight Devpost ML wins heavily.'),
  ('designer', '11111111-1111-1111-1111-111111111111',
   'Product Designer', 'Design',
   'Hackathon designers who can ship a Figma file and a prototype before judging.');

-- ── candidates ───────────────────────────────────────────────
insert into candidates
  (id, role_id, name, handle, avatar_seed, source,
   oa_score, devpost_score, github_score,
   oa_status, is_gem,
   signals, top_project,
   why_explainer, oa_response_url, submitted_at)
values
  -- Frontend --
  ('cand_01', 'frontend', 'Sarah Khan', 'sarahk', 'sarahk', 'Devpost',
   0.94, 0.92, 0.71, 'Graded', true,
   '{"wins":3,"stackMatch":0.97,"commitFrequency":0.62,"starsNormalized":0.55}',
   '{"name":"NeuralCanvas","hackathon":"HackMIT 2025","url":"#"}',
   '94% OA score with the highest free-response answer this week. NeuralCanvas (HackMIT 1st place, Frontend track) used React 19 + WebGPU — exact stack match.',
   '#', '2026-05-09T18:42:00Z'),

  ('cand_02', 'frontend', 'Diego Alvarez', 'dalvarez', 'dalvarez', 'Devpost',
   0.81, 0.88, 0.62, 'Submitted', false,
   '{"wins":2,"stackMatch":0.84,"commitFrequency":0.71,"starsNormalized":0.34}',
   '{"name":"InboxZero","hackathon":"TreeHacks 2026","url":"#"}',
   'Two TreeHacks wins, ships under deadline pressure. Stack match strong on React + Tailwind.',
   '#', '2026-05-09T16:11:00Z'),

  ('cand_03', 'frontend', 'Priya Raman', 'praman', 'praman', 'GitHub',
   0.76, 0.55, 0.91, 'Submitted', false,
   '{"wins":0,"stackMatch":0.78,"commitFrequency":0.94,"starsNormalized":0.88}',
   '{"name":"shadcn-charts","hackathon":"PennApps 2025","url":"#"}',
   'Maintains a popular OSS chart library — exceptional commit cadence and stars. Lower hackathon presence but the OSS depth compensates.',
   '#', '2026-05-09T14:02:00Z'),

  ('cand_04', 'frontend', 'Ben Walters', 'bwalters', 'bwalters', 'Devpost',
   0.62, 0.74, 0.40, 'In Progress', false,
   '{"wins":1,"stackMatch":0.71,"commitFrequency":0.42,"starsNormalized":0.21}',
   '{"name":"Lapse","hackathon":"Calhacks 2025","url":"#"}',
   'Solid hackathon design execution. Mid-pack on engineering signals — worth watching the OA for free-response depth.',
   '#', '2026-05-09T11:55:00Z'),

  ('cand_05', 'frontend', 'Hana Sato', 'hsato', 'hsato', 'Direct',
   0.71, 0.35, 0.68, 'Pending', false,
   '{"wins":0,"stackMatch":0.66,"commitFrequency":0.61,"starsNormalized":0.41}',
   '{"name":"ferry-ui","hackathon":"Personal","url":"#"}',
   'Strong portfolio site, OA pending. Lower Devpost weight here — applied directly.',
   '#', '2026-05-08T22:30:00Z'),

  -- ML --
  ('cand_06', 'ml', 'Mateo Ferreira', 'mferreira', 'mferreira', 'Devpost',
   0.89, 0.93, 0.78, 'Graded', true,
   '{"wins":4,"stackMatch":0.92,"commitFrequency":0.55,"starsNormalized":0.67}',
   '{"name":"EvalGuard","hackathon":"HackTX 2025","url":"#"}',
   'Four hackathon ML wins in a year, including HackTX 1st (Eval track). PyTorch-native, ships evals.',
   '#', '2026-05-09T19:21:00Z'),

  ('cand_07', 'ml', 'Anika Joshi', 'ajoshi', 'ajoshi', 'GitHub',
   0.82, 0.60, 0.89, 'Submitted', false,
   '{"wins":1,"stackMatch":0.81,"commitFrequency":0.78,"starsNormalized":0.74}',
   '{"name":"ragmate","hackathon":"TreeHacks 2026","url":"#"}',
   'Strong applied-RAG OSS work. OA strong on retrieval reasoning. One Devpost win — keep an eye on free-response.',
   '#', '2026-05-09T15:48:00Z'),

  ('cand_08', 'ml', 'Jonah Park', 'jpark', 'jpark', 'Devpost',
   0.66, 0.71, 0.58, 'Submitted', false,
   '{"wins":1,"stackMatch":0.70,"commitFrequency":0.50,"starsNormalized":0.35}',
   '{"name":"voice2task","hackathon":"PennApps 2025","url":"#"}',
   'Applied-LLM project shipped at PennApps. Mid-pack, but free-response showed clarity.',
   '#', '2026-05-09T12:32:00Z'),

  ('cand_09', 'ml', 'Lila Okafor', 'lokafor', 'lokafor', 'Devpost',
   0.74, 0.79, 0.51, 'In Progress', false,
   '{"wins":2,"stackMatch":0.77,"commitFrequency":0.48,"starsNormalized":0.30}',
   '{"name":"AnomalyHive","hackathon":"Calhacks 2025","url":"#"}',
   'Two Calhacks wins in anomaly detection. Lower GitHub footprint — hackathon-native.',
   '#', '2026-05-09T10:11:00Z'),

  ('cand_10', 'ml', 'Tomás Rivera', 'trivera', 'trivera', 'Direct',
   0.58, 0.40, 0.55, 'Pending', false,
   '{"wins":0,"stackMatch":0.60,"commitFrequency":0.44,"starsNormalized":0.22}',
   '{"name":"embed-bench","hackathon":"Personal","url":"#"}',
   'Direct application. Modest signals — OA pending will determine the call.',
   '#', '2026-05-08T19:00:00Z'),

  -- Designer --
  ('cand_11', 'designer', 'Ava Lindholm', 'alindholm', 'alindholm', 'Devpost',
   0.85, 0.90, 0.32, 'Graded', false,
   '{"wins":3,"stackMatch":0.88,"commitFrequency":0.18,"starsNormalized":0.12}',
   '{"name":"Ferment","hackathon":"HackMIT 2025","url":"#"}',
   'Three Devpost design-track wins. Ships Figma + Framer prototype reliably under hackathon deadline pressure.',
   '#', '2026-05-09T18:00:00Z'),

  ('cand_12', 'designer', 'Rohan Mehta', 'rmehta', 'rmehta', 'Devpost',
   0.72, 0.78, 0.28, 'Submitted', false,
   '{"wins":2,"stackMatch":0.74,"commitFrequency":0.20,"starsNormalized":0.15}',
   '{"name":"Stillframe","hackathon":"TreeHacks 2026","url":"#"}',
   'TreeHacks UX win. Strong narrative skill in OA free-response.',
   '#', '2026-05-09T13:24:00Z'),

  ('cand_13', 'designer', 'Yuki Tanaka', 'ytanaka', 'ytanaka', 'Direct',
   0.68, 0.42, 0.36, 'Submitted', false,
   '{"wins":0,"stackMatch":0.67,"commitFrequency":0.31,"starsNormalized":0.18}',
   '{"name":"Atlas Type","hackathon":"Personal","url":"#"}',
   'Direct apply with strong type-design portfolio. No hackathon record — OA carrying the score.',
   '#', '2026-05-09T09:50:00Z'),

  ('cand_14', 'designer', 'Marcus Bell', 'mbell', 'mbell', 'Devpost',
   0.61, 0.66, 0.41, 'In Progress', false,
   '{"wins":1,"stackMatch":0.65,"commitFrequency":0.36,"starsNormalized":0.22}',
   '{"name":"Loft","hackathon":"Calhacks 2025","url":"#"}',
   'Calhacks design win. Mid-pack — waiting on free-response to land.',
   '#', '2026-05-08T20:14:00Z'),

  ('cand_15', 'designer', 'Elena Voss', 'evoss', 'evoss', 'Direct',
   0.55, 0.30, 0.40, 'Pending', false,
   '{"wins":0,"stackMatch":0.58,"commitFrequency":0.40,"starsNormalized":0.20}',
   '{"name":"Glide UI Kit","hackathon":"Personal","url":"#"}',
   'Direct apply. OA still pending.',
   '#', '2026-05-08T17:00:00Z');

-- ── oa_questions ─────────────────────────────────────────────
-- Frontend role questions (match mockOAQuestions in frontend mock-data.ts)
insert into oa_questions
  (id, role_id, type, prompt, sort_order, choices, correct_index, personalized_from, placeholder)
values
  ('q1', 'frontend', 'multiple-choice',
   'Your team ships a React 19 app and Lighthouse flags 320ms of long-tasks during route changes. What''s the first thing you investigate?',
   1,
   '["Adding more `useMemo` calls in the affected components","Moving the route logic into a Web Worker","Server-rendering more of the route and using a `<Suspense>` boundary on the client work","Switching to a different bundler"]',
   2, null, null),

  ('q2', 'frontend', 'multiple-choice',
   'You''re designing a candidate-facing form with a 6-step wizard. Which strategy minimizes drop-off?',
   2,
   '["Show all steps on one page so users can scan ahead","Show one step at a time with a persistent progress indicator and inline save","Email each step as a separate link","Hide the step count to reduce intimidation"]',
   1, null, null),

  ('q3', 'frontend', 'multiple-choice',
   'When animating list reorders triggered by user input, which approach feels best at 60fps?',
   3,
   '["Animate `top`/`left` on each item","Use the FLIP technique (or `layout` props in framer-motion) to animate transforms","Re-render the list after a `setTimeout`","Disable animation when the list has > 10 items"]',
   1, null, null),

  ('q4', 'frontend', 'free-response',
   'Walk us through the most surprising tradeoff you made in this project. What did you give up, and would you make the same call again?',
   4,
   null, null,
   'NeuralCanvas',
   'Be specific about the constraint, the choice, and what you learned. 4–8 sentences is plenty.');

-- ── devpost_submissions seed ──────────────────────────────────
-- Mirrors mockDevpostFeed for local dev
insert into devpost_submissions
  (candidate_name, candidate_handle, project_name, hackathon_name,
   devpost_url, role_match_id, match_pct, discovered_at)
values
  ('Sarah K.',  'sarahk',    'NeuralCanvas',  'HackMIT',   'https://devpost.com/seed/neuralcanvas',  'frontend', 94, now() - interval '1 minute'),
  ('Mateo F.',  'mferreira', 'EvalGuard',     'HackTX',    'https://devpost.com/seed/evalguard',    'ml',       89, now() - interval '2 minutes'),
  ('Anika J.',  'ajoshi',    'ragmate',       'TreeHacks', 'https://devpost.com/seed/ragmate',      'ml',       82, now() - interval '3 minutes'),
  ('Diego A.',  'dalvarez',  'InboxZero',     'TreeHacks', 'https://devpost.com/seed/inboxzero',    'frontend', 81, now() - interval '4 minutes'),
  ('Ava L.',    'alindholm', 'Ferment',       'HackMIT',   'https://devpost.com/seed/ferment',      'designer', 85, now() - interval '5 minutes'),
  ('Lila O.',   'lokafor',   'AnomalyHive',   'Calhacks',  'https://devpost.com/seed/anomalyhive',  'ml',       74, now() - interval '6 minutes'),
  ('Priya R.',  'praman',    'shadcn-charts', 'PennApps',  'https://devpost.com/seed/shadcn-charts','frontend', 76, now() - interval '7 minutes'),
  ('Rohan M.',  'rmehta',    'Stillframe',    'TreeHacks', 'https://devpost.com/seed/stillframe',   'designer', 72, now() - interval '8 minutes');
