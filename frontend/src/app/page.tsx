import Link from "next/link";
import { Counter } from "@/components/editorial/counter";
import { LiveConsole } from "@/components/editorial/live-console";
import { EditorialFooter } from "@/components/editorial/footer";
import { Reveal } from "@/components/editorial/reveal";
import { SectionHead } from "@/components/editorial/section-head";

const STATS = [
  { n: 184293, l: "Devpost submissions indexed" },
  { n: 4127,   l: "Gems surfaced to recruiters" },
  { n: 36,     l: "Hours ahead of LinkedIn, on average", suffix: " hrs" },
  { n: 92,     l: "Of teams hired pass our gem filter", suffix: "%" },
];

const DISPATCHES = [
  { t: "09:41:08", g: true,  src: "devpost · souphack-26", who: "maya_ostrowski",   score: 91.4, line: "diffusion fine-tune · 31 commits / 48h · 240ms demo" },
  { t: "09:33:42", g: false, src: "github · hackmit",       who: "team_heat-death", score: 74.2, line: "raw WebGPU rewrite · placed · 11pm pivot" },
  { t: "09:21:17", g: true,  src: "devpost · hackmit",      who: "devon_bryce",     score: 88.0, line: "crdt notes · solo author · 240ms on 3G" },
  { t: "09:08:55", g: false, src: "mlh · hackgt",           who: "andre_okafor",    score: 79.3, line: "ppo from scratch · trained on macbook" },
  { t: "08:54:02", g: true,  src: "devpost · treehacks",    who: "priya_anand",     score: 88.7, line: "hand-rolled tokenizer · rust · zero deps" },
  { t: "08:30:11", g: false, src: "github · brunohack",     who: "quentin_marsh",   score: 71.0, line: "ssg in zig · footnote in latin · suspect" },
  { t: "06:14:38", g: false, src: "ethglobal · paris",      who: "sara_linden",     score: 89.0, line: "two audits / weekend · contract rewrite x2" },
];

const STEPS = [
  {
    t: "We index every public hackathon.",
    p: "Devpost, MLH, school events, niche jams. Submissions are read the moment they land — including the GitHub linked from the project page.",
  },
  {
    t: "We read the commits, not the slides.",
    p: "Authorship is reconstructed per file. We weight late-night work, refactor depth, test coverage, and demo legibility against role-specific rubrics you control.",
  },
  {
    t: "We surface gems, you weight the rubric.",
    p: "Move three sliders. The pipeline reshuffles in front of you — within seconds, not days. The scores are explainable; every weight is named.",
  },
  {
    t: "You reach out, in your own voice.",
    p: "We do not send outreach in your name. We give you a builder, their work, and a window of about 36 hours before they appear anywhere else.",
  },
];

const ROOMS = [
  { k: "The pipeline",   l: "For triage. Move three sliders and watch the rank reshuffle.",            a: "/dashboard",            cta: "Open the pipeline" },
  { k: "The assessment", l: "A commissioned reading. One question per page. No timer in view.",        a: "/oa/demo",              cta: "Read the invite" },
  { k: "The ethics",     l: "Our public policy, written long-form. Two columns, drop caps, footnotes.", a: "/ethics",               cta: "Read the policy" },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="shell relative pb-48 pt-36 md:pb-48">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 flex items-baseline justify-between border-t border-rule pt-4 t-meta">
            <span className="font-mono text-[11px] tracking-[0.04em] normal-case">
              sniper / v.2026.05.14 · model: rubric-04 · region: us-west-2
            </span>
            <span className="font-mono text-[11px] tracking-[0.04em] normal-case">
              412 dispatches today · 7 gems open
            </span>
          </div>

          <Reveal as="div" className="col-span-12">
            <h1 className="t-display m-0 -ml-2 mt-14">
              We read the<br />
              commits<br />
              <span style={{ fontStyle: "italic", color: "var(--ink-mid)" }}>before</span> the résumé.
            </h1>
          </Reveal>

          <Reveal as="p" delay={120} className="t-lead col-span-12 mt-14 md:col-span-6 md:col-start-4">
            Sniper is a recruiter agent that indexes every public hackathon
            artifact — Devpost, GitHub, demo reels — and ranks the builders
            worth a call. The cold inbox stays cold. The good ones never reach
            LinkedIn.
          </Reveal>

          <Reveal
            as="div"
            delay={220}
            className="col-span-12 mt-10 flex flex-wrap items-center gap-10 md:col-span-6 md:col-start-4"
          >
            <Link
              data-cursor="link"
              data-cursor-label="Begin"
              href="/dashboard"
              className="u-link cta-accent text-lg"
            >
              Open the pipeline →
            </Link>
            <Link
              data-cursor="link"
              data-cursor-label="Read"
              href="/ethics"
              className="u-link font-mono text-xs text-ink-soft"
            >
              read /ethics.md
            </Link>
            <span className="ml-auto font-mono text-[11px] text-ink-soft">
              <span className="border border-rule px-1.5 py-0.5">⌘ K</span> command
            </span>
          </Reveal>
        </div>

        {/* live console + sniper console */}
        <div className="mt-20 grid gap-6 md:grid-cols-2">
          <Reveal delay={300}>
            <LiveConsole />
          </Reveal>
          <Reveal delay={380} className="flex flex-col gap-4">
            <div className="cmd-row">
              <span className="prompt">sniper&gt;</span>
              <span className="text-ink">rank --rubric=founding-eng --since=7d</span>
              <span className="caret" />
              <span className="ml-auto text-ink-mid">↵ run</span>
            </div>
            <div className="grid grid-cols-3 gap-6 border border-rule px-6 py-5">
              {([
                ["ingest.rate", "1,284 /min", 78, false],
                ["queue.depth", "412", 24, false],
                ["gems.today", "07", 92, true],
              ] as const).map(([k, v, p, a]) => (
                <div key={k}>
                  <div className="t-mono mb-1.5 text-ink-soft">{k}</div>
                  <div className="t-num mb-2 text-[28px] leading-none">{v}</div>
                  <div className={"bar" + (a ? " accent" : "")}>
                    <div className="fill" style={{ width: `${p}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-between gap-3 border border-rule px-5 py-4 font-mono text-[11px] text-ink-soft">
              <span>connected · devpost.com</span>
              <span>connected · github.com</span>
              <span>connected · mlh.io</span>
              <span className="text-ink">p50 latency 412ms</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Section 01 — A note from the editors ── */}
      <section className="shell border-t border-rule py-32">
        <Reveal><SectionHead index={1} kicker="A note from the editors" title="By the time a hackathon project hits LinkedIn, it has already been seen by 14,000 recruiters. The good ones — the ones building at 2am on a Sunday — are not interested in being seen." /></Reveal>

        <div className="grid items-start gap-14 md:grid-cols-[200px_1fr]">
          <Reveal as="aside" className="t-meta-italic border-t border-rule pt-2 text-ink-soft md:border-t md:pt-2">
            <span className="block">
              &ldquo;Recruiters used to read the school paper. Now they read pull requests.&rdquo;
            </span>
            <span className="t-meta mt-4 block text-ink-soft">— Field note, March</span>
          </Reveal>
          <Reveal as="div" delay={80} className="t-body max-w-[60ch] text-lg leading-[30px]">
            <p>
              Sniper indexes Devpost submissions the moment they are pushed,
              then cross-references commit histories, demo videos, and
              teammate graphs to build a confidence score for every builder
              on every team. A score is not a person — but it is a reason to
              say hello before everyone else does.
            </p>
            <p className="text-ink-mid">
              We do this slowly, transparently, and with a posted ethics policy.
              No private repos. No résumés purchased from third parties. No
              automated outreach in our name.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Pull quote ── */}
      <section className="shell">
        <Reveal as="div" className="grid grid-cols-12 gap-6 py-24">
          <span className="col-start-2 col-span-1 self-stretch bg-accent" style={{ width: 2 }} />
          <blockquote
            className="col-start-4 col-span-9 m-0 text-balance"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 4.4vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontVariationSettings: '"opsz" 144',
            }}
          >
            The best engineer on the team is rarely the one who wrote the
            README. <em style={{ color: "var(--accent)" }}>We learned to read what they actually built.</em>
          </blockquote>
          <cite className="t-meta col-start-4 col-span-9 mt-8 block not-italic text-ink-soft">
            — Sniper, on confidence scoring
          </cite>
        </Reveal>
      </section>

      {/* ── Section 02 — Dispatches live ── */}
      <section className="shell border-t border-rule py-32">
        <Reveal><SectionHead index={2} kicker="Dispatches — live" title="A reading of the wire, this morning. Gems are marked in vermillion." /></Reveal>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 sticky top-24 self-start">
            <p className="font-mono text-xs leading-relaxed text-ink-mid">
              <span className="text-ink">// stream.log</span>
              <br />
              <span className="mt-2 inline-block">
                Latest gem flags across the index. Refreshes every 7s.
              </span>
              <br />
              <br />
              <span className="text-accent">● live</span> &nbsp; 412 dispatches today
            </p>
          </div>
          <div className="col-span-12 border border-rule md:col-span-7 md:col-start-6">
            {DISPATCHES.map((d, i) => (
              <Reveal
                key={i}
                as="article"
                delay={i * 30}
                className="grid grid-cols-[96px_200px_1fr_auto] items-baseline gap-6 px-6 py-4 font-mono text-xs text-ink-mid"
                {...{ style: { borderBottom: i < DISPATCHES.length - 1 ? "1px solid var(--rule)" : 0 } }}
              >
                <span className="text-ink-soft">{d.t}</span>
                <span className="flex items-center gap-2">
                  {d.g && <span className="inline-block size-2 bg-accent" />}
                  <span className="text-ink">{d.who}</span>
                </span>
                <span className="text-ink-mid">
                  <span className="tag mr-2.5">{d.src}</span>
                  {d.line}
                </span>
                <span
                  className="t-num text-lg"
                  style={{ color: d.g ? "var(--accent)" : "var(--ink)" }}
                >
                  {d.score.toFixed(1)}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 03 — Stats ── */}
      <section className="shell border-t border-rule py-32">
        <Reveal><SectionHead index={3} kicker="By the numbers" title="What we have read, on your behalf, this season." /></Reveal>

        <div className="grid grid-cols-1 border-y border-rule sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="border-rule px-0 py-16 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-r lg:[&:not(:last-child)]:border-b-0"
              style={{ paddingRight: 24 }}
            >
              <span
                className="t-num mb-4 block"
                style={{
                  fontSize: "clamp(56px, 7vw, 96px)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                <Counter to={s.n} suffix={s.suffix ?? ""} />
              </span>
              <span className="t-meta text-ink-soft">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 04 — How it works ── */}
      <section className="shell border-t border-rule py-32">
        <Reveal><SectionHead index={4} kicker="How it works" title="Four steps from a pushed commit to a warm conversation." /></Reveal>

        <ol className="m-0 list-none p-0">
          {STEPS.map((h, i) => (
            <Reveal as="li" delay={i * 70} key={i}>
              <div
                className="grid grid-cols-[80px_1fr] gap-8 border-t border-rule py-10"
                style={{ borderBottom: i === STEPS.length - 1 ? "1px solid var(--rule)" : undefined }}
              >
                <span className="t-num text-[72px] leading-none">0{i + 1}</span>
                <div className="grid items-start gap-8 md:grid-cols-[2fr_3fr]">
                  <h3 className="t-h3 m-0">{h.t}</h3>
                  <p className="t-body m-0">{h.p}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Section 05 — Rooms ── */}
      <section className="shell border-t border-rule py-32">
        <Reveal><SectionHead index={5} kicker="Try the room" title="Three rooms. Each one is laid out like a periodical, not a SaaS." /></Reveal>

        <div className="grid grid-cols-1 border-t border-rule md:grid-cols-3">
          {ROOMS.map((r, i) => (
            <Reveal key={i} delay={i * 70}>
              <Link
                data-cursor="card"
                data-cursor-label="Open"
                href={r.a}
                className={
                  "flex h-full min-h-[280px] flex-col p-6 py-14 transition-colors duration-300 hover:bg-paper-deep " +
                  (i < ROOMS.length - 1 ? "md:border-r md:border-rule" : "")
                }
              >
                <div className="t-meta mb-6 text-ink-soft">Room {String.fromCharCode(65 + i)}</div>
                <div className="t-h3 mb-4">{r.k}</div>
                <p className="t-body max-w-[34ch]">{r.l}</p>
                <div className="mt-auto pt-10">
                  <span className="u-link cta-accent t-meta">{r.cta} →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <EditorialFooter />
    </>
  );
}
