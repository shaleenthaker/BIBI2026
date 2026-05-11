"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchGems, fetchOutreachDraft, saveOutreachDraft, type OutreachDraft } from "@/lib/api";
import type { Candidate } from "@/lib/mock-data";
import {
  DashboardChrome,
  DashboardCommand,
  ExportLink,
} from "@/components/editorial/dashboard-chrome";

type DraftStatus = OutreachDraft["status"];
type SaveState = "idle" | "saving" | "saved" | "offline";

const SUGGESTED_OPENERS = [
  "I read your project on {{project}} this morning — the part that caught me was",
  "We just saw {{name}}'s submission to {{hackathon}}. Two minutes in and",
  "Most cold notes start with the résumé. I'd rather start with the commit history of",
];

export default function OutreachPage() {
  const [gems, setGems] = useState<Candidate[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Local state per candidate so typing stays responsive while the DB
  // upsert is in flight.
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, DraftStatus>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");

  // Load gems
  useEffect(() => {
    let alive = true;
    fetchGems().then((g) => {
      if (!alive) return;
      setGems(g);
      if (!activeId && g[0]) setActiveId(g[0].id);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the draft when the active candidate changes (once per candidate)
  const loadedFor = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!activeId || loadedFor.current.has(activeId)) return;
    loadedFor.current.add(activeId);
    fetchOutreachDraft(activeId).then((d) => {
      if (!d) return;
      setDrafts((cur) => (cur[activeId] === undefined ? { ...cur, [activeId]: d.body } : cur));
      setStatuses((cur) => ({ ...cur, [activeId]: d.status }));
    });
  }, [activeId]);

  // Debounced save on draft text change
  const lastSavedBodies = useRef<Record<string, string>>({});
  useEffect(() => {
    if (!activeId) return;
    const body = drafts[activeId];
    if (body === undefined) return;
    if (lastSavedBodies.current[activeId] === body) return;

    setSaveState("saving");
    const id = setTimeout(async () => {
      const saved = await saveOutreachDraft(activeId, { body });
      if (saved) {
        setStatuses((cur) => ({ ...cur, [activeId]: saved.status }));
        setSaveState("saved");
        lastSavedBodies.current[activeId] = body;
      } else {
        setSaveState("offline");
      }
    }, 700);
    return () => clearTimeout(id);
  }, [drafts, activeId]);

  const active = useMemo(() => gems.find((g) => g.id === activeId) ?? null, [gems, activeId]);
  const value = active ? drafts[active.id] ?? "" : "";
  const status = active ? statuses[active.id] ?? "draft" : "draft";
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  const setDraft = useCallback(
    (v: string) => {
      if (!active) return;
      setDrafts((d) => ({ ...d, [active.id]: v }));
    },
    [active],
  );

  const insertOpener = (template: string) => {
    if (!active) return;
    const text = template
      .replace("{{project}}", active.topProject?.name ?? "this project")
      .replace("{{name}}", active.name.split(" ")[0])
      .replace("{{hackathon}}", active.topProject?.hackathon ?? "the hackathon");
    setDraft(`${text} `);
  };

  const markCopied = async () => {
    if (!active) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(value).catch(() => undefined);
    }
    const saved = await saveOutreachDraft(active.id, { body: value, status: "copied" });
    if (saved) {
      setStatuses((cur) => ({ ...cur, [active.id]: "copied" }));
    }
  };

  return (
    <DashboardChrome
      kicker="composer · we do not send in your name · ever"
      title="Outreach drafts."
      sub="Write the first note yourself, in your voice. We line up the context and stay out of the message. Drafts save to your workspace automatically."
      actions={
        <>
          <DashboardCommand placeholder="search drafts, gems, templates…" />
          <ExportLink>{status === "copied" ? "copied ✓" : "copy to clipboard"}</ExportLink>
        </>
      }
    >
      <div className="grid gap-10 md:grid-cols-[240px_minmax(0,1fr)_320px]">
        {/* Queue */}
        <aside className="border-r border-rule pr-6">
          <h3 className="t-meta mb-4 text-ink-soft">Queue · {gems.length} gems</h3>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {gems.map((c) => {
              const cur = c.id === activeId;
              const draftedBody = drafts[c.id];
              const draftStatus = statuses[c.id];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={
                      "group flex w-full flex-col items-start gap-0.5 border-b border-rule py-3 text-left cursor-pointer transition-colors duration-200 " +
                      (cur ? "text-ink" : "text-ink-mid hover:text-ink")
                    }
                  >
                    <span className="flex w-full items-baseline justify-between gap-2">
                      <span className="text-sm font-medium">
                        {c.name}
                        {cur && <span className="ml-2 text-accent">●</span>}
                      </span>
                      <span className="font-mono text-[10px] text-ink-soft">
                        {draftStatus === "copied"
                          ? "copied"
                          : draftedBody
                            ? "drafted"
                            : "—"}
                      </span>
                    </span>
                    <span className="text-[11px] text-ink-soft">
                      {c.topProject?.name ?? ""} · {c.source}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href="/dashboard/gems"
            className="u-link t-meta mt-4 inline-block text-ink-soft"
          >
            View the gems wire →
          </Link>
        </aside>

        {/* Composer */}
        <div className="min-w-0">
          {active ? (
            <>
              <header className="mb-6 border-b border-rule pb-6">
                <div className="t-meta text-ink-soft">Draft for</div>
                <h2
                  className="m-0 mt-1"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 40,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    fontVariationSettings: '"opsz" 96',
                  }}
                >
                  {active.name}
                </h2>
                <p className="m-0 mt-2 text-sm text-ink-soft">
                  {active.topProject?.name ?? ""} · {active.topProject?.hackathon ?? ""} · @{active.handle}
                </p>
              </header>

              <div className="mb-3 flex flex-wrap gap-4 text-[12px]">
                <span className="t-meta text-ink-soft">Try an opener</span>
                {SUGGESTED_OPENERS.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertOpener(tpl)}
                    className="u-link text-ink-mid hover:text-ink cursor-pointer"
                  >
                    suggestion {String(i + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>

              <textarea
                value={value}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Write your own. We will not edit it, we will not send it. (Try mentioning ${active.topProject?.name ?? "the project"}.)`}
                rows={14}
                className="w-full resize-y bg-transparent text-[18px] leading-[30px] text-ink outline-none border border-rule p-5 transition-colors duration-200 focus:border-ink"
                style={{ fontFamily: "var(--font-sans)", minHeight: 260 }}
              />
              <div className="t-meta mt-2 flex justify-between text-ink-soft">
                <span>{words} words · plain text</span>
                <span>{describeSave(saveState)}</span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-8">
                <button
                  type="button"
                  onClick={markCopied}
                  className="u-link cta-accent t-meta cursor-pointer"
                >
                  Copy draft to clipboard →
                </button>
                <Link
                  href={`/dashboard/candidates/${active.id}`}
                  className="u-link t-meta text-ink-soft"
                >
                  Open the reading room
                </Link>
                <button
                  type="button"
                  className="u-link t-meta text-ink-soft cursor-pointer"
                  onClick={() => setDraft("")}
                >
                  Clear draft
                </button>
              </div>

              <p
                className="mt-10 max-w-[60ch] text-[15px] leading-7 text-ink-mid"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                A note on outreach. Sniper never sends a message on your behalf —
                see{" "}
                <Link href="/ethics#ii" className="u-link">
                  §II of the policy
                </Link>
                . The warmness of the first message is yours; we are only here
                to set the table.
              </p>
            </>
          ) : (
            <p className="font-mono text-xs text-ink-soft">no gems queued.</p>
          )}
        </div>

        {/* Context */}
        <aside className="sticky top-24 h-fit self-start border-l border-rule pl-6">
          {active ? (
            <>
              <h4 className="t-meta mb-2 text-ink-soft">Context for this draft</h4>
              <p
                className="m-0 mb-4 text-[15px] leading-6 text-ink-mid"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                {active.whyExplainer}
              </p>
              <h4 className="t-meta mt-6 mb-2 text-ink-soft">Top project</h4>
              <p
                className="m-0 mb-1 text-[15px] leading-6 text-ink"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {active.topProject?.name}
              </p>
              <p className="m-0 mb-4 font-mono text-[11px] text-ink-soft">
                {active.topProject?.hackathon}
              </p>
              <h4 className="t-meta mt-6 mb-2 text-ink-soft">Signal</h4>
              <ul className="m-0 list-none p-0 text-[13px] text-ink-mid">
                <li className="border-t border-rule py-2 flex justify-between">
                  <span>wins</span>
                  <span className="font-mono text-ink">{active.signals.wins}</span>
                </li>
                <li className="border-t border-rule py-2 flex justify-between">
                  <span>commit cadence</span>
                  <span className="font-mono text-ink">
                    {Math.round((active.signals.commitFrequency ?? 0) * 100)}
                  </span>
                </li>
                <li className="border-t border-rule py-2 flex justify-between">
                  <span>stack match</span>
                  <span className="font-mono text-ink">
                    {Math.round((active.signals.stackMatch ?? 0) * 100)}%
                  </span>
                </li>
                <li className="border-t border-rule py-2 flex justify-between">
                  <span>stars (norm)</span>
                  <span className="font-mono text-ink">
                    {Math.round((active.signals.starsNormalized ?? 0) * 100)}
                  </span>
                </li>
              </ul>
            </>
          ) : (
            <p className="font-mono text-xs text-ink-soft">No context loaded.</p>
          )}
        </aside>
      </div>
    </DashboardChrome>
  );
}

function describeSave(s: SaveState): string {
  switch (s) {
    case "saving":
      return "saving…";
    case "saved":
      return "saved · just now";
    case "offline":
      return "offline · changes kept locally";
    default:
      return "drafts auto-save";
  }
}
