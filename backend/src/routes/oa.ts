import { Hono } from "hono";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";
import { resendClient, FROM_ADDRESS } from "../lib/resend.js";
import { buildOAEmail } from "../lib/oa-email.js";

export const oaRoute = new Hono();

const OA_EXPIRES_HOURS = 72;

// Local row shapes (no generated DB types)
type TokenRow = { token: string; candidate_id: string; expires_at: string; used_at: string | null };
type CandidateRow = { id: string; name: string; role_id: string; top_project: { name?: string } | null };
type RoleRow = { id: string; title: string };

// ── helpers ──────────────────────────────────────────────────────────────────

function db() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return supabaseAdmin() as any;
}

// ── POST /api/oa/dispatch ─────────────────────────────────────────────────────
// Creates an OA token and emails it to the candidate.

const dispatchSchema = z.object({
  candidateId: z.string(),
  toEmail: z.string().email(),
  frontendBaseUrl: z.string().url().optional().default("http://localhost:3000"),
});

oaRoute.post("/dispatch", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = dispatchSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid_body", details: parsed.error.flatten() }, 400);
  }

  const { candidateId, toEmail, frontendBaseUrl } = parsed.data;

  const { data: candidate, error: candErr } = await db()
    .from("candidates")
    .select("id, name, role_id, top_project")
    .eq("id", candidateId)
    .maybeSingle();

  if (candErr) return c.json({ error: candErr.message }, 500);
  if (!candidate) return c.json({ error: "candidate_not_found" }, 404);

  const cand = candidate as CandidateRow;

  const { data: role, error: roleErr } = await db()
    .from("roles")
    .select("id, title")
    .eq("id", cand.role_id)
    .maybeSingle();

  if (roleErr) return c.json({ error: roleErr.message }, 500);
  if (!role) return c.json({ error: "role_not_found" }, 404);

  const r = role as RoleRow;

  // Create token (expires in OA_EXPIRES_HOURS)
  const expiresAt = new Date(Date.now() + OA_EXPIRES_HOURS * 60 * 60 * 1000).toISOString();
  const { data: tokenRow, error: tokenErr } = await db()
    .from("oa_tokens")
    .insert({ candidate_id: candidateId, expires_at: expiresAt })
    .select("token")
    .single();

  if (tokenErr) return c.json({ error: tokenErr.message }, 500);

  const t = tokenRow as { token: string };
  const oaUrl = `${frontendBaseUrl}/oa/${t.token}`;
  const topProjectName = cand.top_project?.name ?? "your project";

  const { subject, html } = buildOAEmail({
    candidateName: cand.name,
    roleTitle: r.title,
    topProjectName,
    oaUrl,
    expiresHours: OA_EXPIRES_HOURS,
  });

  try {
    await resendClient().emails.send({ from: FROM_ADDRESS, to: toEmail, subject, html });
  } catch (err) {
    await db().from("oa_tokens").delete().eq("token", t.token);
    return c.json({ error: "email_send_failed", detail: String(err) }, 502);
  }

  return c.json({ ok: true, token: t.token, expiresAt, oaUrl });
});

// ── GET /api/oa/:token ────────────────────────────────────────────────────────
// Validates a token and returns candidate + questions.

oaRoute.get("/:token", async (c) => {
  const token = c.req.param("token");

  const { data: tokenRow, error: tokenErr } = await db()
    .from("oa_tokens")
    .select("token, candidate_id, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (tokenErr) return c.json({ error: tokenErr.message }, 500);
  if (!tokenRow) return c.json({ error: "token_not_found" }, 404);

  const tr = tokenRow as TokenRow;
  if (tr.used_at) return c.json({ error: "token_already_used" }, 410);
  if (new Date(tr.expires_at) < new Date()) return c.json({ error: "token_expired" }, 410);

  const { data: candidate, error: candErr } = await db()
    .from("candidates")
    .select("id, name, role_id, top_project")
    .eq("id", tr.candidate_id)
    .maybeSingle();

  if (candErr) return c.json({ error: candErr.message }, 500);
  const cand = candidate as CandidateRow | null;

  const { data: questions, error: qErr } = await db()
    .from("oa_questions")
    .select("id, type, prompt, choices, correct_index, personalized_from, placeholder, sort_order")
    .eq("role_id", cand?.role_id ?? "")
    .order("sort_order");

  if (qErr) return c.json({ error: qErr.message }, 500);

  return c.json({ data: { token, candidate: cand, questions: questions ?? [] } });
});

// ── POST /api/oa/:token/submit ────────────────────────────────────────────────
// Saves responses and marks the token used.

const submitSchema = z.object({
  responses: z.array(z.object({ questionId: z.string(), answer: z.string() })).min(1),
});

oaRoute.post("/:token/submit", async (c) => {
  const token = c.req.param("token");
  const body = await c.req.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid_body", details: parsed.error.flatten() }, 400);
  }

  const { data: tokenRow, error: tokenErr } = await db()
    .from("oa_tokens")
    .select("token, candidate_id, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (tokenErr) return c.json({ error: tokenErr.message }, 500);
  if (!tokenRow) return c.json({ error: "token_not_found" }, 404);

  const tr = tokenRow as TokenRow;
  if (tr.used_at) return c.json({ error: "token_already_used" }, 410);
  if (new Date(tr.expires_at) < new Date()) return c.json({ error: "token_expired" }, 410);

  const rows = parsed.data.responses.map((r) => ({
    candidate_id: tr.candidate_id,
    question_id: r.questionId,
    answer: r.answer,
  }));

  const { error: insertErr } = await db().from("oa_responses").insert(rows);
  if (insertErr) return c.json({ error: insertErr.message }, 500);

  await Promise.all([
    db().from("oa_tokens").update({ used_at: new Date().toISOString() }).eq("token", token),
    db().from("candidates").update({ oa_status: "Submitted" }).eq("id", tr.candidate_id),
  ]);

  return c.json({ ok: true });
});
