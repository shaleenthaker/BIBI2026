"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchCandidates } from "@/lib/api";
import {
  composite,
  DEFAULT_WEIGHTS,
  RUBRIC_AXES,
  type RubricKey,
  type Weights,
} from "@/lib/rubric";
import type { Candidate } from "@/lib/mock-data";
import {
  DashboardChrome,
  DashboardCommand,
  ExportLink,
} from "@/components/editorial/dashboard-chrome";
import { RubricSlider } from "@/components/editorial/rubric-slider";

type Preset = { id: string; label: string; description: string; weights: Weights };

const PRESETS: Preset[] = [
  {
    id: "founding-eng",
    label: "Founding engineer",
    description: "Hand of the writer over volume. Craft 35 / signal 35 / depth 20 / fit 10.",
    weights: { craft: 35, signal: 35, depth: 20, fit: 10 },
  },
  {
    id: "forward-deployed",
    label: "Forward-deployed",
    description: "Velocity and adaptability. Signal 40 / fit 25 / craft 20 / depth 15.",
    weights: { craft: 20, signal: 40, depth: 15, fit: 25 },
  },
  {
    id: "design-engineer",
    label: "Design engineer",
    description: "Demo legibility weighted into craft. Craft 45 / depth 25 / signal 20 / fit 10.",
    weights: { craft: 45, signal: 20, depth: 25, fit: 10 },
  },
  {
    id: "research",
    label: "Research-leaning",
    description: "Depth of investigation, not throughput. Depth 45 / craft 30 / signal 15 / fit 10.",
    weights: { craft: 30, signal: 15, depth: 45, fit: 10 },
  },
];

export default function RubricsPage() {
  const [selected, setSelected] = useState<string>(PRESETS[0].id);
  const [weights, setWeights] = useState<Weights>(PRESETS[0].weights);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [name, setName] = useState<string>(PRESETS[0].label);

  useEffect(() => {
    let alive = true;
    fetchCandidates().then((c) => alive && setCandidates(c));
    return () => {
      alive = false;
    };
  }, []);

  const preview = useMemo(() => {
    return candidates
      .map((c) => ({ c, total: composite(c, weights) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [candidates, weights]);

  const setPreset = (p: Preset) => {
    setSelected(p.id);
    setWeights(p.weights);
    setName(p.label);
  };

  const total = weights.craft + weights.signal + weights.depth + weights.fit;
  const dirty = !PRESETS.find((p) => p.id === selected && sameWeights(p.weights, weights));

  return (
    <DashboardChrome
      kicker="workbench · the rubric is the heart of the room"
      title="The rubric workbench."
      sub="Compose a rubric the way you would compose a piece. Name the axes, set the weights, watch the index reconsider. Every preset on the left is a stance."
      actions={
        <>
          <DashboardCommand placeholder="search axes, presets, saved rubrics…" />
          <ExportLink>publish rubric</ExportLink>
        </>
      }
    >
      <div className="grid gap-12 md:grid-cols-[240px_1fr]">
        {/* ── Presets column ── */}
        <aside className="border-r border-rule pr-6">
          <h3 className="t-meta mb-4 text-ink-soft">Presets</h3>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {PRESETS.map((p) => {
              const cur = p.id === selected;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    data-cursor="link"
                    onClick={() => setPreset(p)}
                    className={
                      "group flex w-full flex-col items-start gap-1 border-b border-rule py-3 text-left cursor-pointer transition-colors duration-200 " +
                      (cur ? "text-ink" : "text-ink-mid hover:text-ink")
                    }
                  >
                    <span className="text-sm font-medium">
                      {p.label}
                      {cur && <span className="ml-2 text-accent">●</span>}
                    </span>
                    <span className="text-[11px] text-ink-soft">{p.description}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <Link
            data-cursor="link"
            href="#"
            className="u-link cta-accent t-meta mt-6 inline-block"
          >
            + new rubric
          </Link>
        </aside>

        {/* ── Body: name, axes, weights, preview ── */}
        <div className="min-w-0">
          {/* Title block */}
          <div className="mb-10">
            <label
              htmlFor="rubric-name"
              className="t-meta mb-2 block text-ink-soft"
            >
              Rubric title
            </label>
            <input
              id="rubric-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-cursor="link"
              className="w-full max-w-[640px] border-b border-rule bg-transparent pb-2 text-ink outline-none transition-colors duration-200 focus:border-ink"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 44,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                fontVariationSettings: '"opsz" 96',
              }}
            />
            <div className="t-meta mt-3 flex items-center gap-3 text-ink-soft">
              <span>weights sum {total}</span>
              <span aria-hidden>·</span>
              <span>{dirty ? "unsaved · drafts auto-save every 30s" : "saved · clean"}</span>
            </div>
          </div>

          {/* Axes */}
          <div className="grid grid-cols-1 gap-10 border-t border-rule pt-8 md:grid-cols-2">
            {(Object.keys(RUBRIC_AXES) as RubricKey[]).map((k) => (
              <article key={k}>
                <h4 className="t-meta mb-1 text-ink-soft">{RUBRIC_AXES[k].label}</h4>
                <p
                  className="m-0 mb-4 text-[15px] leading-6 text-ink-mid"
                  style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                >
                  {RUBRIC_AXES[k].note}
                </p>
                <RubricSlider
                  label={k}
                  value={weights[k]}
                  onChange={(v) => setWeights({ ...weights, [k]: v })}
                />
              </article>
            ))}
          </div>

          {/* Preview */}
          <section className="mt-14 border-t border-rule pt-8">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="t-meta text-ink-soft">Preview · top 8 under this rubric</h3>
              <span className="font-mono text-[11px] text-ink-soft">
                live · {candidates.length} indexed
              </span>
            </div>
            <ol className="m-0 grid list-none grid-cols-1 gap-0 border-t border-rule p-0">
              {preview.map((row, idx) => (
                <li
                  key={row.c.id}
                  className="grid grid-cols-[40px_1fr_120px_64px] items-baseline gap-4 border-b border-rule py-4"
                  data-cursor="link"
                >
                  <span className="t-num text-[24px] text-ink-soft">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-medium text-[15px] tracking-[-0.005em] text-ink">
                      {row.c.name}
                      {row.c.isGem && (
                        <span
                          aria-label="gem"
                          className="ml-2 inline-block size-1.5 align-middle bg-accent"
                        />
                      )}
                    </div>
                    <div className="mt-0.5 text-[12px] text-ink-soft">
                      {row.c.topProject?.name ?? ""} · @{row.c.handle}
                    </div>
                  </div>
                  <div className="bar" style={{ width: 100 }}>
                    <div
                      className="fill"
                      style={{
                        width: `${row.total}%`,
                        background: row.c.isGem ? "var(--accent)" : "var(--ink)",
                        transition: "width 360ms var(--ease-editorial)",
                      }}
                    />
                  </div>
                  <span
                    className="text-right"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 20,
                      fontVariationSettings: '"opsz" 144',
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {row.total.toFixed(1)}
                  </span>
                </li>
              ))}
              {preview.length === 0 && (
                <li className="py-6 text-center font-mono text-xs text-ink-soft">
                  loading preview…
                </li>
              )}
            </ol>
          </section>

          {/* Footnotes */}
          <p
            className="mt-10 max-w-[60ch] text-[15px] leading-7 text-ink-mid"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            <em>A note on rubrics.</em> A rubric is a stance, not a setting. The
            preset on the left is what we&apos;d recommend for the role described;
            the work, as ever, is making it yours. Sniper publishes the weight
            distribution of every active rubric in{" "}
            <Link href="/ethics" data-cursor="link" className="u-link">
              §III of the ethics policy
            </Link>
            .
          </p>
        </div>
      </div>
    </DashboardChrome>
  );
}

function sameWeights(a: Weights, b: Weights) {
  return a.craft === b.craft && a.signal === b.signal && a.depth === b.depth && a.fit === b.fit;
}
