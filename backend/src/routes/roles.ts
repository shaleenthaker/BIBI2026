import { Hono } from "hono";
import { mockRoles } from "../lib/mock-data.js";

export const rolesRoute = new Hono();

rolesRoute.get("/", (c) => c.json({ data: mockRoles }));

rolesRoute.get("/:id", (c) => {
  const role = mockRoles.find((r) => r.id === c.req.param("id"));
  if (!role) return c.json({ error: "role_not_found" }, 404);
  return c.json({ data: role });
});
