import { Hono } from "hono";
import { supabaseAdmin } from "../lib/supabase.js";

export const gemsRoute = new Hono();

gemsRoute.get("/", async (c) => {
  const { data, error } = await supabaseAdmin()
    .from("candidates")
    .select("*")
    .eq("is_gem", true)
    .order("oa_score", { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  const rows = (data ?? []) as Record<string, unknown>[];
  return c.json({
    data: rows.map((r) => ({
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
    })),
  });
});
