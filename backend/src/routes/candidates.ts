import { Hono } from "hono";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";

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
  return c.json({ data: data.map(toCandidate) });
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
  };
}
