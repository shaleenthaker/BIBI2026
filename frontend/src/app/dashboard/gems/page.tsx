"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchGems } from "@/lib/api";
import { axisScores, composite, DEFAULT_WEIGHTS } from "@/lib/rubric";
import type { Candidate } from "@/lib/mock-data";
import {
  DashboardChrome,
  DashboardCommand,
  ExportLink,
} from "@/components/editorial/dashboard-chrome";
import { EditorialSparkline } from "@/components/editorial/sparkline";

export default function GemsPage() {
  const [gems, setGems] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const weights = DEFAULT_WEIGHTS;

  useEffect(() => {
    let alive = true;
    fetchGems()
      .then((g) => alive && setGems(g))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const ranked = useMemo(
    () =>
      gems
        .map((c) => ({ candidate: c, total: composite(c, weights), axes: axisScores(c) }))
        .sort((a, b) => b.total - a.total),
    [gems, weights],
  );

  const median = ranked.length ? ranked[Math.floor(ranked.length / 2)].total.toFixed(1) : "—";
  const top = ranked[0]?.total.toFixed(1) ?? "—";

  return (
    <DashboardChrome
      kicker="live · gems index · all roles, all rubrics"
      title={
        <>
          The gems<br />
          wire.
        </>
      }
      sub="Every candidate currently flagged. A gem is conservative on purpose — we would rather miss one than crowd your inbox."
      actions={
        <>
          <DashboardCommand placeholder="filter gems by stack, source, rubric…" />
          <ExportLink>export gems.csv</ExportLink>
        </>
      }
    >
      {/* ── Stat strip ── */}
      <section className="grid grid-cols-3 border-y border-rule">
        {[
          { l: "On the wire", n: String(ranked.length).padStart(2, "0") },
          { l: "Top score", n: top },
          { l: "Median score", n: median },
        ].map((s) => (
          <div
            key={s.l}
            className="py-8 pr-6 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-rule"
          >
            <span
              className="mb-3 block leading-none"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 64,
                letterSpacing: "-0.03em",
                fontVariationSettings: '"opsz" 144',
              }}
            >
              {s.n}
            </span>
            <span className="t-meta text-ink-soft">{s.l}</span>
          </div>
        ))}
      </section>

      {/* ── Editorial: latest dispatch ── */}
      <section className="grid gap-10 border-b border-rule py-10 md:grid-cols-[200px_1fr]">
        <aside className="t-meta-italic border-t border-rule pt-2 text-ink-soft">
          From the editor&apos;s desk · this morning.
        </aside>
        <div className="t-body max-w-[60ch] text-lg leading-[30px]">
          <p>
            Today&apos;s wire is short, by design. The gem flag is a conservative
            instrument — we would rather miss a worthy builder than crowd your
            inbox with maybes. Each line below is a person we believe is worth
            an introduction this week.
          </p>
          <p className="text-ink-mid">
            A gem ages out of the wire after fourteen days unless you pin it.
            We do this so the page doesn&apos;t accumulate stale recommendations.
            Pinned gems appear under{" "}
            <Link href="#" className="u-link" data-cursor="link">
              watchlist
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Gems table — wider cells, axis-mini-bars ── */}
      <section className="mt-8">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Builder", "Stack & source", "Craft · Signal · Depth · Fit", "Signal · 30d", "Score"].map(
                (h, i) => (
                  <th
                    key={h}
                    className="border-b border-rule px-3 py-4 font-medium text-[10px] uppercase tracking-[0.12em] text-ink-soft"
                    style={{
                      textAlign: i === 4 ? "right" : "left",
                      paddingLeft: i === 0 ? 0 : undefined,
                      paddingRight: i === 4 ? 0 : undefined,
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center font-mono text-xs text-ink-soft">
                  loading the wire…
                </td>
              </tr>
            )}
            {!loading && ranked.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center font-mono text-xs text-ink-soft">
                  The wire is quiet right now. Check back in a few hours.
                </td>
              </tr>
            )}
            {ranked.map(({ candidate: c, total, axes }) => (
              <tr
                key={c.id}
                className="border-b border-rule transition-colors duration-200 hover:bg-paper-deep"
                data-cursor="card"
                data-cursor-label="Read"
              >
                <td className="relative px-3 py-5 align-top pl-0">
                  <span
                    aria-label="gem"
                    className="absolute size-2 bg-accent"
                    style={{ left: -22, top: 26 }}
                  />
                  <Link
                    href={`/dashboard/candidates/${c.id}`}
                    className="font-medium text-[15px] tracking-[-0.005em] text-ink u-link"
                    data-cursor="link"
                  >
                    {c.name}
                  </Link>
                  <span className="mt-0.5 block text-[13px] text-ink-soft">
                    @{c.handle} · {c.topProject?.name ?? ""}
                  </span>
                </td>
                <td className="px-3 py-5 align-top">
                  <div className="font-mono text-[11px] tracking-[0.02em] text-ink-mid">
                    stack-match {Math.round((c.signals?.stackMatch ?? 0) * 100)}%
                  </div>
                  <span className="tag mt-1.5 inline-block">{c.source.toLowerCase()}</span>
                </td>
                <td className="px-3 py-5 align-top">
                  <div className="grid grid-cols-4 gap-3 max-w-[280px]">
                    {(["craft", "signal", "depth", "fit"] as const).map((k) => (
                      <div key={k}>
                        <div className="bar" style={{ width: 56 }}>
                          <div
                            className={"fill"}
                            style={{
                              width: `${axes[k]}%`,
                              background: "var(--ink)",
                              transition: "width 320ms var(--ease-editorial)",
                            }}
                          />
                        </div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
                          {k} {Math.round(axes[k])}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-5 align-top">
                  <EditorialSparkline accent />
                  <div className="mt-1 font-mono text-[11px] text-ink-soft">
                    {Math.round((c.signals?.commitFrequency ?? 0) * 10)} push ·{" "}
                    {Math.round((c.signals?.starsNormalized ?? 0) * 10)} repo
                  </div>
                </td>
                <td className="px-3 py-5 align-top text-right pr-0">
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontVariationSettings: '"opsz" 144',
                      fontSize: 28,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: "var(--accent)",
                    }}
                  >
                    {total.toFixed(1)}
                    <span className="ml-1 font-sans text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                      /100
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardChrome>
  );
}
