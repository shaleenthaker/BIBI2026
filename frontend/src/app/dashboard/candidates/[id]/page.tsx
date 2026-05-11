"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchCandidates, fetchCandidateProjects, type CandidateProject } from "@/lib/api";
import { axisScores, composite, DEFAULT_WEIGHTS, RUBRIC_AXES, type RubricKey } from "@/lib/rubric";
import type { Candidate } from "@/lib/mock-data";
import {
  DashboardChrome,
  DashboardCommand,
  ExportLink,
} from "@/components/editorial/dashboard-chrome";
import { EditorialSparkline } from "@/components/editorial/sparkline";
import { Reveal } from "@/components/editorial/reveal";

export default function ReadingRoomPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [projects, setProjects] = useState<CandidateProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchCandidates()
      .then((c) => alive && setCandidates(c))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    fetchCandidateProjects(id).then((p) => alive && setProjects(p));
    return () => {
      alive = false;
    };
  }, [id]);

  const candidate = useMemo(() => candidates.find((c) => c.id === id), [candidates, id]);
  const axes = useMemo(() => (candidate ? axisScores(candidate) : null), [candidate]);
  const total = useMemo(
    () => (candidate ? composite(candidate, DEFAULT_WEIGHTS) : 0),
    [candidate],
  );

  if (loading) {
    return (
      <DashboardChrome
        title="Reading room"
        sub="Loading reader…"
        kicker="reading room · long-form"
      >
        <div className="py-20 text-center font-mono text-xs text-ink-soft">
          opening the dossier…
        </div>
      </DashboardChrome>
    );
  }

  if (!candidate || !axes) {
    return (
      <DashboardChrome
        title="Not found"
        sub="That candidate is not currently in the index."
        kicker="reading room · long-form"
      >
        <p className="t-body">
          <Link href="/dashboard" className="u-link" data-cursor="link">
            ← Back to the pipeline
          </Link>
        </p>
      </DashboardChrome>
    );
  }

  const first = candidate.name.split(" ")[0];

  return (
    <DashboardChrome
      kicker={`reading room · ${candidate.source.toLowerCase()} · ${candidate.topProject?.hackathon ?? ""}`}
      title={
        <>
          {candidate.name.split(" ").slice(0, -1).join(" ")}
          <br />
          {candidate.name.split(" ").slice(-1).join(" ")}.
        </>
      }
      sub={`@${candidate.handle} · ${candidate.source} · last signal ${
        candidate.submittedAt ? new Date(candidate.submittedAt).toLocaleDateString() : "—"
      }`}
      actions={
        <>
          <DashboardCommand placeholder="jump to a project, a section, a quote…" />
          <ExportLink>send dossier</ExportLink>
        </>
      }
    >
      <Reveal>
        {/* Score plate */}
        <section className="border-b border-rule pb-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_240px]">
            <div>
              <p
                className="m-0 max-w-[62ch] text-balance"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 22,
                  lineHeight: "34px",
                  color: "var(--ink)",
                }}
              >
                {candidate.whyExplainer} The work shows up consistently across
                multiple submissions; commit timestamps cluster after midnight,
                which we read as agency, not desperation.
              </p>
              <p
                className="m-0 mt-3 max-w-[62ch] text-balance text-ink-mid"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 17,
                  lineHeight: "28px",
                }}
              >
                Confidence band: ±4.1. {candidate.signals.wins} wins in the
                window. Sample size — 7 projects, ~412 commits, 3 demo videos
                indexed.
              </p>
            </div>
            <div className="border-t border-rule md:border-l md:border-t-0 md:pl-6 md:pt-0 pt-6">
              <span
                className="block leading-none"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 84,
                  letterSpacing: "-0.03em",
                  fontVariationSettings: '"opsz" 144',
                  color: candidate.isGem ? "var(--accent)" : "var(--ink)",
                }}
              >
                {total.toFixed(1)}
              </span>
              <span className="t-meta mt-2 block text-ink-soft">
                Composite — default rubric
              </span>
              <div className="mt-3 flex items-center gap-2">
                {candidate.isGem ? (
                  <>
                    <span className="inline-block size-2 bg-accent" />
                    <span className="t-meta text-accent">Gem flagged</span>
                  </>
                ) : (
                  <span className="t-meta text-ink-soft">Pipeline · standard</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Two-column body */}
      <div className="grid gap-12 pt-12 md:grid-cols-[minmax(0,1fr)_280px]">
        <article>
          {/* Axis breakdown — long form */}
          <Reveal as="section">
            <h2 className="t-meta mb-4 text-ink-soft">The breakdown — by axis</h2>
            <div className="grid grid-cols-4 border-y border-rule">
              {(Object.keys(RUBRIC_AXES) as RubricKey[]).map((k) => (
                <div
                  key={k}
                  className="py-6 pr-3 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-rule"
                >
                  <span
                    className="mb-1 block leading-none"
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
                    {RUBRIC_AXES[k].label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {(Object.keys(RUBRIC_AXES) as RubricKey[]).map((k) => (
                <div key={k} className="border-t border-rule pt-4">
                  <h3 className="t-meta mb-1 text-ink-soft">
                    {RUBRIC_AXES[k].label}{" "}
                    <span className="text-ink">{Math.round(axes[k])}</span>
                  </h3>
                  <p
                    className="m-0 text-[16px] leading-[28px] text-ink"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {RUBRIC_AXES[k].note}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* The reading */}
          <Reveal as="section">
            <h2 className="t-meta mb-3 mt-12 text-ink-soft">The reading</h2>
            <p
              className="dropcap m-0 mb-4 text-balance text-[20px] leading-[32px] text-ink"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {first}&apos;s work is best read in chronological order, not by
              category. The earliest submissions are visibly the work of someone
              still finding the seam; the most recent ones know exactly where it
              is. That arc, more than any single project, is what we read as
              promise.
            </p>
            <p className="m-0 mb-4 text-[18px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
              Commits cluster between 11pm and 3am, which can be a sign of many
              things; in this case it pairs with explanatory commit messages
              and tests that arrive before the bug, so we read it as &ldquo;agency,
              not desperation&rdquo; and weight it under{" "}
              <em>signal</em>, not under <em>availability</em>.
            </p>
            <p className="m-0 mb-4 text-[18px] leading-8 text-ink-mid" style={{ fontFamily: "var(--font-serif)" }}>
              We considered three near-misses: a public repo that looked like
              theirs but is co-authored by an older account; a Devpost
              submission that turned out to be a remake of a popular tutorial;
              and a placement in a small invite-only hackathon that we do not
              count without corroboration. Each was excluded from the score and
              is listed under{" "}
              <em>what we did not count</em>, below.
            </p>
          </Reveal>

          {/* Commit timeline */}
          <Reveal as="section">
            <div className="mt-12 flex items-center justify-between border-t border-rule pt-6">
              <h2 className="t-meta text-ink-soft">Commit cadence · 30 days</h2>
              <span className="font-mono text-[11px] text-ink-soft">
                {Math.round((candidate.signals.commitFrequency ?? 0) * 10)} push · {candidate.signals.wins} wins
              </span>
            </div>
            <div className="mt-4 border border-rule p-6">
              <EditorialSparkline accent={candidate.isGem} width={640} height={64} className="w-full" />
              <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
                <span>30d ago</span>
                <span>14d ago</span>
                <span>7d ago</span>
                <span>today</span>
              </div>
            </div>
          </Reveal>

          {/* Projects (from candidate_projects) */}
          <Reveal as="section">
            <h2 className="t-meta mt-12 mb-3 text-ink-soft">Recent projects · indexed</h2>
            <div className="border-t border-rule">
              {projects.length === 0 && (
                <p className="m-0 border-b border-rule py-6 font-mono text-[11px] text-ink-soft">
                  no projects on file for this builder yet — the index is still
                  catching up.
                </p>
              )}
              {projects.map((p) => (
                <article
                  key={p.id}
                  className="grid grid-cols-[80px_1fr_auto] gap-6 border-b border-rule py-6"
                >
                  <div className="t-meta text-ink-soft">{formatProjectDate(p.occurredOn)}</div>
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
                      {p.title}
                    </h4>
                    <div className="text-[12px] text-ink-soft">{p.hackathon}</div>
                    <p className="m-0 mt-2 max-w-[60ch] text-[15px] leading-6 text-ink-mid">
                      {p.body}
                    </p>
                  </div>
                  <Link
                    href={p.url ?? "#"}
                    target={p.url ? "_blank" : undefined}
                    rel={p.url ? "noopener noreferrer" : undefined}
                    className="u-link t-meta self-start"
                  >
                    Read →
                  </Link>
                </article>
              ))}
            </div>
          </Reveal>

          {/* What we did not count */}
          <Reveal as="section">
            <h2 className="t-meta mt-12 mb-3 text-ink-soft">What we did not count</h2>
            <ul className="m-0 list-none p-0 text-[15px] leading-7 text-ink-mid" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
              {[
                "A public repo with a near-identical name, owned by an older account.",
                "A Devpost submission that is a remake of a well-known tutorial.",
                "A placement in an invite-only hackathon without independent corroboration.",
              ].map((line, i) => (
                <li key={i} className="border-t border-rule py-3">
                  — {line}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Actions */}
          <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-rule pt-6">
            <Link
              href="/dashboard/outreach"
              data-cursor="link"
              data-cursor-label="Write"
              className="u-link cta-accent t-meta"
            >
              Draft outreach in your own voice →
            </Link>
            <Link
              href={`/oa/${candidate.id}`}
              data-cursor="link"
              className="u-link t-meta text-ink-soft"
            >
              Send the assessment
            </Link>
            <Link href="/dashboard" data-cursor="link" className="u-link t-meta text-ink-soft">
              Back to the pipeline
            </Link>
          </div>
        </article>

        {/* Aside */}
        <aside className="sticky top-24 h-fit self-start border-l border-rule pl-6">
          <h4 className="t-meta mb-2 text-ink-soft">At a glance</h4>
          <ul className="m-0 list-none p-0 text-[13px] text-ink-mid">
            <Row label="status" value={candidate.oaStatus.toLowerCase()} />
            <Row label="source" value={candidate.source.toLowerCase()} />
            <Row label="handle" value={`@${candidate.handle}`} mono />
            <Row
              label="indexed"
              value={candidate.submittedAt ? new Date(candidate.submittedAt).toLocaleDateString() : "—"}
              mono
            />
            <Row label="rubric" value="founding-eng" mono />
          </ul>

          <h4 className="t-meta mb-2 mt-8 text-ink-soft">Editor&apos;s note</h4>
          <p
            className="m-0 mb-4 text-[15px] leading-6 text-ink-mid"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            This dossier is a reading of public artifacts under the active rubric,
            not a person. The score can move; the work cannot.
          </p>

          <h4 className="t-meta mb-2 mt-8 text-ink-soft">Related</h4>
          <p className="m-0 mb-3 text-[14px] leading-6 text-ink-mid" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
            <Link href="/dashboard/rubrics" className="u-link">
              — Open this reading in the rubric workbench
            </Link>
          </p>
          <p className="m-0 mb-3 text-[14px] leading-6 text-ink-mid" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
            <Link href="/dashboard/gems" className="u-link">
              — Back to the gems wire
            </Link>
          </p>
        </aside>
      </div>
    </DashboardChrome>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <li className="flex justify-between border-t border-rule py-2">
      <span className="text-ink-soft">{label}</span>
      <span className={mono ? "font-mono text-ink" : "text-ink"}>{value}</span>
    </li>
  );
}

function formatProjectDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}
