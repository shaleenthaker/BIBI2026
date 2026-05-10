"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCandidates } from "@/lib/api";
import { composite, DEFAULT_WEIGHTS, type Weights, type RubricKey } from "@/lib/rubric";
import type { Candidate } from "@/lib/mock-data";
import {
  DashboardChrome,
  DashboardCommand,
  ExportLink,
} from "@/components/editorial/dashboard-chrome";
import { RubricSlider } from "@/components/editorial/rubric-slider";
import { EditorialSparkline } from "@/components/editorial/sparkline";
import { CandidateDetailPanel } from "@/components/editorial/candidate-detail-panel";

type FilterKey = "all" | "gems" | "graded" | "submitted" | "in_progress" | "pending";

const STATUS_MAP: Record<string, FilterKey> = {
  Graded: "graded",
  Submitted: "submitted",
  "In Progress": "in_progress",
  Pending: "pending",
};

const STATUS_LABEL: Record<FilterKey, string> = {
  all: "All",
  gems: "Gems",
  graded: "Reviewed",
  submitted: "Submitted",
  in_progress: "In progress",
  pending: "Pending",
};

export default function PipelinePage() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [tab, setTab] = useState<FilterKey>("all");
  const [open, setOpen] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchCandidates()
      .then((rows) => {
        if (!alive) return;
        setCandidates(rows);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const ranked = useMemo(() => {
    const arr = candidates.map((c) => ({ ...c, total: composite(c, weights) }));
    arr.sort((a, b) => b.total - a.total);
    return arr.filter((c) => {
      if (tab === "all") return true;
      if (tab === "gems") return c.isGem;
      return STATUS_MAP[c.oaStatus] === tab;
    });
  }, [candidates, weights, tab]);

  return (
    <DashboardChrome
      kicker={`live · rubric: founding-eng · indexed 184,293 builders · last sync 12s ago`}
      title={
        <>
          184,293 read.<br />
          {String(candidates.length).padStart(2, "0")} shown.
        </>
      }
      sub="Reshuffle the rubric and watch the order reconsider itself. Gems are flagged in the left margin; sparklines show 30-day signal velocity."
      actions={
        <>
          <DashboardCommand />
          <ExportLink />
        </>
      }
    >
      {/* ── Controls: sliders + filter chips ── */}
      <section className="grid grid-cols-[320px_1fr] gap-14 border-b border-rule py-8">
        <div>
          <div className="t-meta mb-4 text-ink-soft">Rubric — weight, 0 to 100</div>
          <div className="grid grid-cols-3 gap-10">
            {(["craft", "signal", "depth"] as RubricKey[]).map((k) => (
              <RubricSlider
                key={k}
                label={k}
                value={weights[k]}
                onChange={(v) => setWeights({ ...weights, [k]: v })}
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-10">
            <RubricSlider
              label="fit"
              value={weights.fit}
              onChange={(v) => setWeights({ ...weights, fit: v })}
            />
            <div />
            <div />
          </div>
        </div>
        <div className="flex flex-wrap items-end justify-end gap-6 self-end">
          {(["all", "gems", "graded", "submitted", "in_progress", "pending"] as FilterKey[]).map(
            (k) => (
              <button
                key={k}
                type="button"
                data-cursor="link"
                onClick={() => setTab(k)}
                className={
                  "cursor-pointer border-b text-[11px] uppercase tracking-[0.08em] py-1.5 transition-colors duration-200 " +
                  (tab === k
                    ? "border-ink text-ink"
                    : "border-transparent text-ink-mid hover:text-ink")
                }
              >
                {STATUS_LABEL[k]}
              </button>
            ),
          )}
        </div>
      </section>

      {/* ── Pipeline table ── */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {[
              ["Builder", "26%"],
              ["Stack"],
              ["Source"],
              ["Signal · 30d"],
              ["Status"],
              ["Score", "140px", "right"],
            ].map(([h, w, a]) => (
              <th
                key={h as string}
                className="border-b border-rule px-3 py-4 font-medium text-[10px] uppercase tracking-[0.12em] text-ink-soft"
                style={{
                  width: w as string | undefined,
                  textAlign: a === "right" ? "right" : "left",
                  paddingLeft: h === "Builder" ? 0 : undefined,
                  paddingRight: a === "right" ? 0 : undefined,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center font-mono text-xs text-ink-soft">
                indexing…
              </td>
            </tr>
          )}
          {!loading &&
            ranked.map((c) => (
              <tr
                key={c.id}
                onClick={() => setOpen(c)}
                data-cursor="card"
                data-cursor-label="Open"
                className="cursor-pointer border-b border-rule transition-colors duration-200 hover:bg-paper-deep"
              >
                <td className="relative px-3 py-5 align-top pl-0">
                  {c.isGem && (
                    <span
                      aria-label="gem"
                      className="absolute size-2 bg-accent"
                      style={{ left: -22, top: 26 }}
                    />
                  )}
                  <span
                    className="font-medium text-[15px] tracking-[-0.005em] text-ink"
                  >
                    {c.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ink-soft">
                    {c.topProject?.name ?? ""} · @{c.handle}
                  </span>
                </td>
                <td className="px-3 py-5 align-top">
                  <span className="font-mono text-[11px] tracking-[0.02em] text-ink-mid">
                    {c.signals?.stackMatch
                      ? "stack-match " + Math.round((c.signals.stackMatch ?? 0) * 100) + "%"
                      : "—"}
                  </span>
                </td>
                <td className="px-3 py-5 align-top">
                  <span className="tag">{c.source.toLowerCase()}</span>
                  <div className="mt-1.5 font-mono text-[11px] text-ink-soft">
                    {c.submittedAt
                      ? new Date(c.submittedAt).toLocaleDateString()
                      : "—"}
                  </div>
                </td>
                <td className="px-3 py-5 align-top">
                  <EditorialSparkline accent={c.isGem} />
                  <div className="mt-1 font-mono text-[11px] text-ink-soft">
                    {Math.round((c.signals?.commitFrequency ?? 0) * 10)} push ·{" "}
                    {Math.round((c.signals?.starsNormalized ?? 0) * 10)} repo
                  </div>
                </td>
                <td className="px-3 py-5 align-top">
                  <span className={"tag" + (c.isGem ? " accent" : "")}>
                    {c.oaStatus.toLowerCase()}
                  </span>
                </td>
                <td className="px-3 py-5 align-top text-right pr-0">
                  <div className="flex items-baseline justify-end gap-3">
                    <div className="bar" style={{ width: 64 }}>
                      <div
                        className="fill"
                        style={{
                          width: `${c.total}%`,
                          background: c.isGem ? "var(--accent)" : "var(--ink)",
                          transition: "width 240ms var(--ease-editorial)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontVariationSettings: '"opsz" 144',
                        fontSize: 28,
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {c.total.toFixed(1)}
                      <span className="ml-1 font-sans text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                        /100
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          {!loading && ranked.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center font-mono text-xs text-ink-soft">
                no builders match this filter — try widening the rubric or another tab.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* status footer */}
      <div className="mt-8 flex items-center justify-between border border-rule px-5 py-3 font-mono text-[11px] text-ink-soft">
        <span>
          <span className="text-accent">●</span> indexing · 1,284 /min · 412 in queue
        </span>
        <span>
          showing {ranked.length} of {candidates.length} · sorted by total · desc
        </span>
        <span>next sync in 6s</span>
      </div>

      <CandidateDetailPanel candidate={open} weights={weights} onClose={() => setOpen(null)} />
    </DashboardChrome>
  );
}
