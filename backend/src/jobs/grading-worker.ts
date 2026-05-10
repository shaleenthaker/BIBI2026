import cron from "node-cron";
import { supabaseAdmin } from "../lib/supabase.js";
import { gradeFreeResponse } from "../lib/openai.js";

// Candidates above this threshold get flagged as gems
const GEM_THRESHOLD = 0.80;

// MC answers count for 40% of the score; free-response for 60%
const MC_WEIGHT = 0.4;
const FR_WEIGHT = 0.6;

type ResponseRow = {
  id: string;
  candidate_id: string;
  question_id: string;
  answer: string;
};

type QuestionRow = {
  id: string;
  role_id: string;
  type: string;
  prompt: string;
  correct_index: number | null;
};

type CandidateRow = {
  id: string;
  role_id: string;
};

type RoleRow = {
  id: string;
  title: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => supabaseAdmin() as any;

export async function runGradingWorker(): Promise<void> {
  console.log("[grading-worker] scan started");

  // Find submitted but ungraded candidates
  const { data: candidates, error: candErr } = await db()
    .from("candidates")
    .select("id, role_id")
    .eq("oa_status", "Submitted");

  if (candErr) {
    console.error("[grading-worker] candidate fetch error:", candErr.message);
    return;
  }

  const batch = (candidates ?? []) as CandidateRow[];
  if (batch.length === 0) {
    console.log("[grading-worker] no submitted candidates — nothing to grade");
    return;
  }

  for (const candidate of batch) {
    try {
      await gradeCandidate(candidate);
    } catch (err) {
      console.error(`[grading-worker] failed to grade ${candidate.id}:`, err);
    }
  }

  console.log(`[grading-worker] graded ${batch.length} candidate(s)`);
}

async function gradeCandidate(candidate: CandidateRow): Promise<void> {
  // Fetch role title (for the LLM prompt)
  const { data: roleData } = await db()
    .from("roles")
    .select("id, title")
    .eq("id", candidate.role_id)
    .maybeSingle();
  const role = roleData as RoleRow | null;
  const roleTitle = role?.title ?? "Software Engineer";

  // Fetch responses
  const { data: responsesData, error: rErr } = await db()
    .from("oa_responses")
    .select("id, candidate_id, question_id, answer")
    .eq("candidate_id", candidate.id);

  if (rErr || !responsesData?.length) return;
  const responses = responsesData as ResponseRow[];

  // Fetch corresponding questions
  const questionIds = responses.map((r: ResponseRow) => r.question_id);
  const { data: questionsData, error: qErr } = await db()
    .from("oa_questions")
    .select("id, role_id, type, prompt, correct_index")
    .in("id", questionIds);

  if (qErr || !questionsData?.length) return;
  const questions = questionsData as QuestionRow[];
  const questionMap = new Map(questions.map((q: QuestionRow) => [q.id, q]));

  const mcScores: number[] = [];
  const frScores: number[] = [];

  for (const response of responses) {
    const question = questionMap.get(response.question_id);
    if (!question) continue;

    if (question.type === "multiple-choice") {
      // Auto-grade: parse the answer as a choice index
      const chosen = parseInt(response.answer, 10);
      const correct = question.correct_index ?? -1;
      const score = chosen === correct ? 1.0 : 0.0;
      mcScores.push(score);

      await db()
        .from("oa_responses")
        .update({ llm_score: score, llm_reasoning: "auto-graded" })
        .eq("id", response.id);
    } else {
      // Free-response: send to LLM with anonymized input
      const { score, reasoning } = await gradeFreeResponse(
        roleTitle,
        question.prompt,
        response.answer,
      );
      frScores.push(score);

      await db()
        .from("oa_responses")
        .update({ llm_score: score, llm_reasoning: reasoning })
        .eq("id", response.id);
    }
  }

  // Weighted overall score
  const mcAvg = mcScores.length ? mcScores.reduce((a, b) => a + b, 0) / mcScores.length : null;
  const frAvg = frScores.length ? frScores.reduce((a, b) => a + b, 0) / frScores.length : null;

  let oaScore: number;
  if (mcAvg !== null && frAvg !== null) {
    oaScore = mcAvg * MC_WEIGHT + frAvg * FR_WEIGHT;
  } else {
    oaScore = mcAvg ?? frAvg ?? 0;
  }

  oaScore = Math.round(oaScore * 100) / 100;
  const isGem = oaScore >= GEM_THRESHOLD;

  await db()
    .from("candidates")
    .update({ oa_score: oaScore, oa_status: "Graded", is_gem: isGem })
    .eq("id", candidate.id);

  console.log(
    `[grading-worker] candidate=${candidate.id} oa_score=${oaScore} gem=${isGem}`,
  );
}

export function startGradingWorker(): void {
  // Every 5 minutes
  cron.schedule("*/5 * * * *", () => {
    runGradingWorker().catch((err) =>
      console.error("[grading-worker] unhandled error:", err),
    );
  });
  console.log("[grading-worker] scheduled — runs every 5 min");
}
