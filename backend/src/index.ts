import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { rolesRoute } from "./routes/roles.js";
import { candidatesRoute } from "./routes/candidates.js";
import { gemsRoute } from "./routes/gems.js";
import { startDevpostWatcher } from "./jobs/devpost-watcher.js";
import { startGradingWorker } from "./jobs/grading-worker.js";
import { oaRoute } from "./routes/oa.js";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    credentials: true,
  }),
);

app.get("/", (c) =>
  c.json({
    name: "sniper-backend",
    version: "0.1.0",
    docs: "/health for liveness; see README.md for endpoints.",
  }),
);

app.get("/health", (c) =>
  c.json({ status: "ok", uptime: process.uptime(), now: new Date().toISOString() }),
);

app.route("/api/roles", rolesRoute);
app.route("/api/candidates", candidatesRoute);
app.route("/api/gems", gemsRoute);
app.route("/api/oa", oaRoute);

const port = Number(process.env.PORT ?? 8080);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`sniper-backend listening on http://localhost:${info.port}`);
  startDevpostWatcher();
  startGradingWorker();
});
