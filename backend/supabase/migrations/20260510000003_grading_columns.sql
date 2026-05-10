-- ============================================================
-- sniper · grading audit columns on oa_responses
-- ============================================================

alter table oa_responses
  add column if not exists llm_score     numeric(4, 2),   -- 0.00–1.00, null until graded
  add column if not exists llm_reasoning text;            -- anonymized LLM rationale
