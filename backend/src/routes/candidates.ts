import { Hono } from "hono";
import { z } from "zod";
import { mockCandidates } from "../lib/mock-data.js";

export const candidatesRoute = new Hono();

const querySchema = z.object({
  roleId: z.enum(["frontend", "ml", "designer"]).optional(),
});

candidatesRoute.get("/", (c) => {
  const parsed = querySchema.safeParse({ roleId: c.req.query("roleId") });
  if (!parsed.success) return c.json({ error: "invalid_query" }, 400);
  const { roleId } = parsed.data;
  const data = roleId ? mockCandidates.filter((x) => x.roleId === roleId) : mockCandidates;
  return c.json({ data });
});

candidatesRoute.get("/:id", (c) => {
  const candidate = mockCandidates.find((x) => x.id === c.req.param("id"));
  if (!candidate) return c.json({ error: "candidate_not_found" }, 404);
  return c.json({ data: candidate });
});
