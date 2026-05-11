import { Hono } from "hono";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any {
  return supabaseAdmin();
}

export const candidatesRoute = new Hono();

const querySchema = z.object({
  roleId: z.enum(["frontend", "ml", "designer"]).optional(),
});

candidatesRoute.get("/", async (c) => {
  const parsed = querySchema.safeParse({ roleId: c.req.query("roleId") });
  if (!parsed.success) return c.json({ error: "invalid_query" }, 400);

  let query = supabaseAdmin()
    .from("candidates")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (parsed.data.roleId) {
    query = query.eq("role_id", parsed.data.roleId);
  }

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ data: (data ?? []).map(toCandidate) });
});

candidatesRoute.get("/:id", async (c) => {
  const { data, error } = await supabaseAdmin()
    .from("candidates")
    .select("*")
    .eq("id", c.req.param("id"))
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 500);
  if (!data) return c.json({ error: "candidate_not_found" }, 404);
  return c.json({ data: toCandidate(data) });
});

// ── GET /api/candidates/:id/projects ─────────────────────────────────────────
candidatesRoute.get("/:id/projects", async (c) => {
  const id = c.req.param("id");
  const { data, error } = await supabaseAdmin()
    .from("candidate_projects")
    .select("id, title, hackathon, body, url, occurred_on, sort_order")
    .eq("candidate_id", id)
    .order("sort_order", { ascending: true });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({
    data: (data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id,
      title: r.title,
      hackathon: r.hackathon,
      body: r.body,
      url: r.url,
      occurredOn: r.occurred_on,
      sortOrder: r.sort_order,
    })),
  });
});

// ── POST /api/candidates/:id/gem ─────────────────────────────────────────────
// Toggle the is_gem flag. Idempotent if `isGem` is provided explicitly.
const gemSchema = z.object({ isGem: z.boolean().optional() });

candidatesRoute.post("/:id/gem", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const parsed = gemSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "invalid_body" }, 400);

  let next = parsed.data.isGem;
  if (next === undefined) {
    const { data: current, error } = await supabaseAdmin()
      .from("candidates")
      .select("is_gem")
      .eq("id", id)
      .maybeSingle();
    if (error) return c.json({ error: error.message }, 500);
    if (!current) return c.json({ error: "candidate_not_found" }, 404);
    next = !(current as { is_gem: boolean }).is_gem;
  }

  const { data, error } = await db()
    .from("candidates")
    .update({ is_gem: next })
    .eq("id", id)
    .select("id, is_gem")
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 500);
  if (!data) return c.json({ error: "candidate_not_found" }, 404);
  return c.json({ data: { id: (data as { id: string }).id, isGem: (data as { is_gem: boolean }).is_gem } });
});

function toCandidate(r: Record<string, unknown>) {
  return {
    id: r.id,
    roleId: r.role_id,
    name: r.name,
    handle: r.handle,
    avatarSeed: r.avatar_seed,
    source: r.source,
    oaScore: Number(r.oa_score),
    devpostScore: Number(r.devpost_score),
    githubScore: Number(r.github_score),
    oaStatus: r.oa_status,
    isGem: r.is_gem,
    signals: r.signals,
    topProject: r.top_project,
    whyExplainer: r.why_explainer,
    oaResponseUrl: r.oa_response_url,
    submittedAt: r.submitted_at,
    email: (r.email as string | null) ?? null,
  };
}
