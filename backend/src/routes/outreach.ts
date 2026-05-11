import { Hono } from "hono";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any {
  return supabaseAdmin();
}

export const outreachRoute = new Hono();

const SEEDED_RECRUITER_ID = "11111111-1111-1111-1111-111111111111";

// ── GET /api/outreach ────────────────────────────────────────────────────────
// List drafts for the recruiter.
outreachRoute.get("/", async (c) => {
  const { data, error } = await db()
    .from("outreach_drafts")
    .select("id, candidate_id, body, status, updated_at")
    .eq("recruiter_id", SEEDED_RECRUITER_ID)
    .order("updated_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ data: (data ?? []).map(toDraft) });
});

// ── GET /api/outreach/:candidateId ──────────────────────────────────────────
outreachRoute.get("/:candidateId", async (c) => {
  const candidateId = c.req.param("candidateId");
  const { data, error } = await db()
    .from("outreach_drafts")
    .select("id, candidate_id, body, status, updated_at")
    .eq("recruiter_id", SEEDED_RECRUITER_ID)
    .eq("candidate_id", candidateId)
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 500);
  // a missing draft is a valid empty state — return null rather than 404
  return c.json({ data: data ? toDraft(data as Record<string, unknown>) : null });
});

// ── PUT /api/outreach/:candidateId ──────────────────────────────────────────
// Upsert the draft body for this candidate.
const upsertSchema = z.object({
  body: z.string().max(10_000),
  status: z.enum(["draft", "copied", "sent"]).optional(),
});

outreachRoute.put("/:candidateId", async (c) => {
  const candidateId = c.req.param("candidateId");
  const json = await c.req.json().catch(() => null);
  const parsed = upsertSchema.safeParse(json);
  if (!parsed.success) {
    return c.json({ error: "invalid_body", details: parsed.error.flatten() }, 400);
  }

  // Confirm candidate exists so we don't quietly orphan drafts.
  const { data: candExists, error: candErr } = await db()
    .from("candidates")
    .select("id")
    .eq("id", candidateId)
    .maybeSingle();
  if (candErr) return c.json({ error: candErr.message }, 500);
  if (!candExists) return c.json({ error: "candidate_not_found" }, 404);

  const row = {
    recruiter_id: SEEDED_RECRUITER_ID,
    candidate_id: candidateId,
    body: parsed.data.body,
    ...(parsed.data.status ? { status: parsed.data.status } : {}),
  };

  const { data, error } = await db()
    .from("outreach_drafts")
    .upsert(row, { onConflict: "recruiter_id,candidate_id" })
    .select("id, candidate_id, body, status, updated_at")
    .maybeSingle();

  if (error) return c.json({ error: error.message }, 500);
  if (!data) return c.json({ error: "draft_upsert_failed" }, 500);
  return c.json({ data: toDraft(data as Record<string, unknown>) });
});

// ── DELETE /api/outreach/:candidateId ───────────────────────────────────────
outreachRoute.delete("/:candidateId", async (c) => {
  const candidateId = c.req.param("candidateId");
  const { error } = await db()
    .from("outreach_drafts")
    .delete()
    .eq("recruiter_id", SEEDED_RECRUITER_ID)
    .eq("candidate_id", candidateId);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ ok: true });
});

function toDraft(r: Record<string, unknown>) {
  return {
    id: r.id,
    candidateId: r.candidate_id,
    body: r.body,
    status: r.status,
    updatedAt: r.updated_at,
  };
}
