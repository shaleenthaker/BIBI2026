"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchCandidates, fetchRubrics, saveRubric, type Rubric } from "@/lib/api";
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

type SaveState = "idle" | "saving" | "saved" | "offline";

export default function RubricsPage() {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [loading, setLoading] = useState(true);

  // Load rubrics + candidates on mount
  useEffect(() => {
    let alive = true;
    Promise.all([fetchRubrics(), fetchCandidates()])
      .then(([rs, cs]) => {
        if (!alive) return;
        setCandidates(cs);
        setRubrics(rs);
        const first = rs.find((r) => r.isDefault) ?? rs[0];
        if (first) {
          setSelectedSlug(first.slug);
          setTitle(first.title);
          setWeights(first.weights);
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // Debounced auto-save on weight/title changes
  const lastSaved = useRef<{ slug: string; title: string; weights: Weights } | null>(null);
  useEffect(() => {
    if (!selectedSlug || loading) return;
    const cur = rubrics.find((r) => r.slug === selectedSlug);
    if (!cur) return;
    // Skip the initial settle (loading from server)
    if (
      cur.title === title &&
      sameWeights(cur.weights, weights) &&
      lastSaved.current === null
    ) {
      lastSaved.current = { slug: selectedSlug, title, weights };
      return;
    }
    // Skip if already saved with same payload
    const last = lastSaved.current;
    if (
      last &&
      last.slug === selectedSlug &&
      last.title === title &&
      sameWeights(last.weights, weights)
    )
      return;

    setSaveState("saving");
    const id = setTimeout(async () => {
      const saved = await saveRubric(selectedSlug, {
        title,
        description: cur.description,
        weights,
      });
      if (saved) {
        setRubrics((rs) => rs.map((r) => (r.slug === selectedSlug ? saved : r)));
        setSaveState("saved");
        lastSaved.current = { slug: selectedSlug, title, weights };
      } else {
        setSaveState("offline");
      }
    }, 600);
    return () => clearTimeout(id);
  }, [title, weights, selectedSlug, rubrics, loading]);

  const preview = useMemo(() => {
    return candidates
      .map((c) => ({ c, total: composite(c, weights) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [candidates, weights]);

  const total = weights.craft + weights.signal + weights.depth + weights.fit;

  const selectRubric = (r: Rubric) => {
    setSelectedSlug(r.slug);
    setTitle(r.title);
    setWeights(r.weights);
    setSaveState("idle");
    lastSaved.current = { slug: r.slug, title: r.title, weights: r.weights };
  };

  return (
    <DashboardChrome
      kicker="workbench · the rubric is the heart of the room"
      title="The rubric workbench."
      sub="Compose a rubric the way you would compose a piece. Name the axes, set the weights, watch the index reconsider. Edits save themselves."
      actions={
        <>
          <DashboardCommand placeholder="search axes, presets, saved rubrics…" />
          <ExportLink>publish rubric</ExportLink>
        </>
      }
    >
      <div className="grid gap-12 md:grid-cols-[240px_1fr]">
        {/* ── Saved rubrics column ── */}
        <aside className="border-r border-rule pr-6">
          <h3 className="t-meta mb-4 text-ink-soft">Saved rubrics</h3>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {rubrics.map((r) => {
              const cur = r.slug === selectedSlug;
              return (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => selectRubric(r)}
                    className={
                      "group flex w-full flex-col items-start gap-1 border-b border-rule py-3 text-left cursor-pointer transition-colors duration-200 " +
                      (cur ? "text-ink" : "text-ink-mid hover:text-ink")
                    }
                  >
                    <span className="text-sm font-medium">
                      {r.title}
                      {cur && <span className="ml-2 text-accent">●</span>}
                      {r.isDefault && !cur && (
                        <span className="ml-2 text-[10px] font-mono text-ink-soft">
                          default
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-ink-soft">{r.description}</span>
                  </button>
                </li>
              );
            })}
            {rubrics.length === 0 && (
              <li className="py-3 font-mono text-[11px] text-ink-soft">
                {loading ? "loading…" : "no rubrics yet"}
              </li>
            )}
          </ul>

          <Link
            href="#"
            className="u-link cta-accent t-meta mt-6 inline-block"
          >
            + new rubric
          </Link>
        </aside>

        {/* ── Body ── */}
        <div className="min-w-0">
          <div className="mb-10">
            <label htmlFor="rubric-name" className="t-meta mb-2 block text-ink-soft">
              Rubric title
            </label>
            <input
              id="rubric-name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!selectedSlug}
              className="w-full max-w-[640px] border-b border-rule bg-transparent pb-2 text-ink outline-none transition-colors duration-200 focus:border-ink disabled:opacity-50"
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
              <span>{describeSaveState(saveState)}</span>
            </div>
          </div>

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

          <p
            className="mt-10 max-w-[60ch] text-[15px] leading-7 text-ink-mid"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            <em>A note on rubrics.</em> A rubric is a stance, not a setting. Every
            edit you make above writes back to your saved rubric — there is no
            &ldquo;save&rdquo; button on purpose. Published distributions live in{" "}
            <Link href="/ethics" className="u-link">
              §III of the ethics policy
            </Link>
            .
          </p>
        </div>
      </div>
    </DashboardChrome>
  );
}

function describeSaveState(s: SaveState): string {
  switch (s) {
    case "saving":
      return "saving…";
    case "saved":
      return "saved · clean";
    case "offline":
      return "offline · changes kept locally";
    default:
      return "drafts auto-save";
  }
}

function sameWeights(a: Weights, b: Weights) {
  return a.craft === b.craft && a.signal === b.signal && a.depth === b.depth && a.fit === b.fit;
}
