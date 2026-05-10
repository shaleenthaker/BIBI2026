"use client";

import Link from "next/link";
import { useEffect } from "react";
import { axisScores, type Weights } from "@/lib/rubric";
import type { Candidate } from "@/lib/mock-data";

/**
 * Slides in from the right over a translucent paper scrim. Closes on Esc, on
 * scrim click, or the close affordance. Reading-room link goes deeper.
 */
export function CandidateDetailPanel({
  candidate,
  weights,
  onClose,
}: {
  candidate: Candidate | null;
  weights: Weights;
  onClose: () => void;
}) {
  // Esc-to-close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = !!candidate;
  const c = candidate;
  const axes = c ? axisScores(c) : null;

  return (
    <div
      aria-hidden={!open}
      className={
        "fixed inset-0 z-[80] grid transition-opacity duration-300 " +
        (open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
      }
      style={{
        gridTemplateColumns: "1fr min(880px, 92vw)",
        background: "color-mix(in srgb, var(--paper) 80%, transparent)",
        transitionTimingFunction: "var(--ease-editorial)",
      }}
    >
      <button
        type="button"
        aria-label="Close panel"
        data-cursor="link"
        onClick={onClose}
        className="cursor-pointer bg-transparent"
      />

      <aside
        className="h-screen overflow-y-auto border-l border-rule bg-paper px-14 pb-20 pt-10 will-change-transform"
        style={{
          transform: open ? "translateX(0)" : "translateX(40px)",
          opacity: open ? 1 : 0,
          transition:
            "transform 600ms var(--ease-editorial), opacity 420ms var(--ease-editorial)",
        }}
      >
        {c && axes && (
          <>
            <div className="flex items-center justify-between">
              <span className="t-meta text-ink-soft">
                Dispatch — {c.source} · {c.topProject?.hackathon ?? ""}
              </span>
              <button
                type="button"
                data-cursor="link"
                onClick={onClose}
                className="t-meta cursor-pointer text-ink-soft hover:text-ink"
              >
                Close ×
              </button>
            </div>

            <h2 className="t-h2 mb-1 mt-4">{c.name}</h2>
            <p className="t-body m-0 text-ink-soft">
              @{c.handle} · {c.source} · last signal{" "}
              {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : "—"}
            </p>

            <div className="my-8 grid grid-cols-4 border-y border-rule">
              {(["craft", "signal", "depth", "fit"] as const).map((k) => (
                <div
                  key={k}
                  className="py-6 pr-4 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-rule"
                >
                  <span
                    className="mb-2 block leading-none"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 44,
                      letterSpacing: "-0.025em",
                      fontVariationSettings: '"opsz" 144',
                    }}
                  >
                    {Math.round(axes[k])}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                    {k}{" "}
                    <span className="text-ink-soft/70">· w {weights[k]}</span>
                  </span>
                </div>
              ))}
            </div>

            <h3 className="t-meta mt-8 mb-2 text-ink-soft">The reading</h3>
            <p className="t-body m-0">
              {c.whyExplainer} The work shows up consistently across multiple
              submissions; commit timestamps cluster after midnight, which we
              read as agency, not desperation.
            </p>
            <p className="t-body text-ink-mid">
              Confidence band: ±4.1. Sample size: {c.signals.wins} indexed wins,{" "}
              {Math.round((c.signals.commitFrequency ?? 0) * 1000)} commits,
              {c.signals.starsNormalized ? " repos starred" : " no public stars"}.
            </p>

            <h3 className="t-meta mt-8 mb-2 text-ink-soft">Top project</h3>
            <div className="border-t border-rule">
              <article className="grid grid-cols-[80px_1fr_auto] gap-6 border-b border-rule py-6">
                <div className="text-xs text-ink-soft">{c.topProject.hackathon}</div>
                <div>
                  <h4
                    className="m-0 mb-1"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 22,
                      fontVariationSettings: '"opsz" 72',
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.topProject.name}
                  </h4>
                  <p className="m-0 text-ink-mid">
                    Submitted {c.submittedAt ? new Date(c.submittedAt).toLocaleString() : "—"}
                  </p>
                </div>
                <Link
                  href={c.topProject.url ?? "#"}
                  data-cursor="link"
                  data-cursor-label="Open"
                  className="u-link t-meta self-start"
                >
                  Devpost →
                </Link>
              </article>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-10">
              <Link
                href={`/dashboard/candidates/${c.id}`}
                data-cursor="link"
                data-cursor-label="Read"
                className="u-link cta-accent t-meta"
                onClick={() => onClose()}
              >
                Open the reading room →
              </Link>
              <Link
                href="/dashboard/outreach"
                data-cursor="link"
                className="u-link t-meta text-ink-soft"
              >
                Draft outreach
              </Link>
              <Link
                href={`/oa/${c.id}`}
                data-cursor="link"
                className="u-link t-meta text-ink-soft"
              >
                Send assessment
              </Link>
              <Link
                href="#"
                data-cursor="link"
                className="u-link t-meta text-ink-soft"
              >
                Move to watchlist
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
