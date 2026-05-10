import { Hono } from "hono";
import { supabaseAdmin } from "../lib/supabase.js";

export const rolesRoute = new Hono();

rolesRoute.get("/", async (c) => {
  const { data, error } = await supabaseAdmin()
    .from("roles_with_stats")
    .select("*")
    .order("created_at");
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ data: data.map(toRole) });
});

rolesRoute.get("/:id", async (c) => {
  const { data, error } = await supabaseAdmin()
    .from("roles_with_stats")
    .select("*")
    .eq("id", c.req.param("id"))
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 500);
  if (!data) return c.json({ error: "role_not_found" }, 404);
  return c.json({ data: toRole(data) });
});

function toRole(r: Record<string, unknown>) {
  return {
    id: r.id,
    title: r.title,
    team: r.team,
    description: r.description,
    candidatesInPipeline: Number(r.candidates_in_pipeline),
    gemsFlagged: Number(r.gems_flagged),
    oasOut: Number(r.oas_out),
    lastActivityAt: r.last_activity_at,
    createdAt: r.created_at,
  };
}
