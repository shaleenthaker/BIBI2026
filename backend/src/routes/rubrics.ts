import { Hono } from "hono";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any {
  return supabaseAdmin();
}

export const rubricsRoute = new Hono();

// All routes are scoped to the seeded recruiter for now. When auth lands,
// swap this out for the authenticated recruiter id.
const SEEDED_RECRUITER_ID = "11111111-1111-1111-1111-111111111111";

const weightsSchema = z.object({
  craft: z.number().int().min(0).max(100),
  signal: z.number().int().min(0).max(100),
  depth: z.number().int().min(0).max(100),
  fit: z.number().int().min(0).max(100),
});

const upsertSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(800).optional().default(""),
  weights: weightsSchema,
});

const slugRe = /^[a-z0-9](?:[a-z0-9-]{0,40}[a-z0-9])?$/;

// ── GET /api/rubrics ─────────────────────────────────────────────────────────
rubricsRoute.get("/", async (c) => {
  const { data, error } = await db()
    .from("rubrics")
    .select("id, slug, title, description, weights, is_default, updated_at")
    .eq("recruiter_id", SEEDED_RECRUITER_ID)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ data: (data ?? []).map(toRubric) });
});

// ── GET /api/rubrics/:slug ───────────────────────────────────────────────────
rubricsRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!slugRe.test(slug)) return c.json({ error: "invalid_slug" }, 400);

  const { data, error } = await db()
    .from("rubrics")
    .select("id, slug, title, description, weights, is_default, updated_at")
    .eq("recruiter_id", SEEDED_RECRUITER_ID)
    .eq("slug", slug)
    .maybeSingle();

  if (error) return c.json({ error: error.message }, 500);
  if (!data) return c.json({ error: "rubric_not_found" }, 404);
  return c.json({ data: toRubric(data as Record<string, unknown>) });
});

// ── PUT /api/rubrics/:slug ───────────────────────────────────────────────────
// Upsert (create or update) the rubric at this slug for the seeded recruiter.
rubricsRoute.put("/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!slugRe.test(slug)) return c.json({ error: "invalid_slug" }, 400);

  const body = await c.req.json().catch(() => null);
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid_body", details: parsed.error.flatten() }, 400);
  }

  const row = {
    recruiter_id: SEEDED_RECRUITER_ID,
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    weights: parsed.data.weights,
  };

  const { data, error } = await db()
    .from("rubrics")
    .upsert(row, { onConflict: "recruiter_id,slug" })
    .select("id, slug, title, description, weights, is_default, updated_at")
    .maybeSingle();

  if (error) return c.json({ error: error.message }, 500);
  if (!data) return c.json({ error: "rubric_upsert_failed" }, 500);
  return c.json({ data: toRubric(data as Record<string, unknown>) });
});

// ── POST /api/rubrics/:slug/set-default ──────────────────────────────────────
rubricsRoute.post("/:slug/set-default", async (c) => {
  const slug = c.req.param("slug");
  if (!slugRe.test(slug)) return c.json({ error: "invalid_slug" }, 400);

  // Clear existing default, then set this one. Two writes; the unique
  // partial index would block setting two defaults if anything ever races.
  const { error: clearErr } = await db()
    .from("rubrics")
    .update({ is_default: false })
    .eq("recruiter_id", SEEDED_RECRUITER_ID)
    .eq("is_default", true);
  if (clearErr) return c.json({ error: clearErr.message }, 500);

  const { data, error } = await db()
    .from("rubrics")
    .update({ is_default: true })
    .eq("recruiter_id", SEEDED_RECRUITER_ID)
    .eq("slug", slug)
    .select("id, slug, title, description, weights, is_default, updated_at")
    .maybeSingle();

  if (error) return c.json({ error: error.message }, 500);
  if (!data) return c.json({ error: "rubric_not_found" }, 404);
  return c.json({ data: toRubric(data as Record<string, unknown>) });
});

function toRubric(r: Record<string, unknown>) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    weights: r.weights,
    isDefault: r.is_default,
    updatedAt: r.updated_at,
  };
}
