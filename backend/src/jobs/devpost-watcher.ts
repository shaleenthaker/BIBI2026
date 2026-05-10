import cron from "node-cron";
import { supabaseAdmin } from "../lib/supabase.js";
import { fetchRecentSubmissions, scoreAgainstRole } from "../lib/devpost.js";

const ROLE_QUERIES: Record<string, string> = {
  frontend: "react typescript hackathon",
  ml: "pytorch llm machine learning hackathon",
  designer: "figma design prototype hackathon",
};

const MIN_MATCH_PCT = 55;

export async function runDevpostWatcher(): Promise<void> {
  console.log("[devpost-watcher] scan started");

  for (const [roleId, query] of Object.entries(ROLE_QUERIES)) {
    let projects;
    try {
      projects = await fetchRecentSubmissions(query);
    } catch (err) {
      console.error(`[devpost-watcher] fetch failed for role "${roleId}":`, err);
      continue;
    }

    for (const project of projects) {
      const matchPct = scoreAgainstRole(project, roleId);
      if (matchPct < MIN_MATCH_PCT) continue;

      const handle = (project.memberNames[0] ?? "unknown")
        .toLowerCase()
        .replace(/\s+/g, "");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin().from("devpost_submissions") as any)
        .upsert(
          {
            candidate_name: project.memberNames[0] ?? "Unknown",
            candidate_handle: handle,
            project_name: project.title,
            hackathon_name: "Recent",
            devpost_url: project.url,
            role_match_id: roleId,
            match_pct: matchPct,
            raw_json: project,
          },
          { onConflict: "devpost_url", ignoreDuplicates: true },
        );

      if (error) {
        console.error("[devpost-watcher] upsert error:", error.message);
      }
    }

    console.log(
      `[devpost-watcher] role="${roleId}" scanned ${projects.length} projects`,
    );
  }

  console.log("[devpost-watcher] scan complete");
}

export function startDevpostWatcher(): void {
  // Every 15 minutes
  cron.schedule("*/15 * * * *", () => {
    runDevpostWatcher().catch((err) =>
      console.error("[devpost-watcher] unhandled error:", err),
    );
  });
  console.log("[devpost-watcher] scheduled — runs every 15 min");
}
