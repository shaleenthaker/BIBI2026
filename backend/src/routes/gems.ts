import { Hono } from "hono";
import { mockCandidates } from "../lib/mock-data.js";

export const gemsRoute = new Hono();

gemsRoute.get("/", (c) => c.json({ data: mockCandidates.filter((x) => x.isGem) }));
