import Link from "next/link";
import { Reveal } from "@/components/editorial/reveal";
import { EditorialFooter } from "@/components/editorial/footer";

const SECTIONS = [
  { id: "i", title: "I. What we read" },
  { id: "ii", title: "II. What we will not read" },
  { id: "iii", title: "III. The score" },
  { id: "iv", title: "IV. Disputes & removal" },
  { id: "v", title: "V. A short list of rules" },
];

export default function EthicsPage() {
  return (
    <>
      <section className="grid gap-14 px-14 pt-24 pb-40 md:grid-cols-[240px_minmax(0,720px)_1fr]">
        {/* TOC */}
        <nav className="sticky top-24 flex h-fit flex-col gap-1 self-start">
          <div className="t-meta mb-4 text-ink-soft">In this issue</div>
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              href={`#${s.id}`}
              data-cursor="link"
              className="u-link block border-t border-rule py-1.5 text-[13px] text-ink-mid hover:text-ink"
            >
              {s.title}
            </Link>
          ))}
          <div className="t-meta mt-8 text-ink-soft">
            v.2026.05 — Last revised 4 days ago.
          </div>
        </nav>

        {/* Article */}
        <article className="max-w-[720px]">
          <Reveal>
            <div className="t-meta mb-6 text-ink-soft">Ethics — long form</div>
            <h1
              className="m-0"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(48px, 6vw, 80px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
                fontVariationSettings: '"opsz" 144',
              }}
            >
              On reading the work, and not the worker.
            </h1>
            <p
              className="mt-4 mb-14 max-w-[56ch]"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 22,
                lineHeight: "30px",
                color: "var(--ink-mid)",
              }}
            >
              A policy, written long-form, on what Sniper indexes — and what it
              refuses to. Posted in full, revised in public, signed by name.
            </p>
            <div className="mb-14 flex gap-8 border-t border-ink border-b border-rule py-4 t-meta text-ink-soft">
              <span>By A. Reyes, ethics</span>
              <span>May 6, 2026</span>
              <span>Eight minutes</span>
            </div>
          </Reveal>

          <Reveal>
            <section id="i">
              <h2
                className="m-0 mt-16 mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 32,
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  fontVariationSettings: '"opsz" 96',
                }}
              >
                I. What we read
              </h2>
              <p className="dropcap m-0 mb-4 text-balance text-[22px] leading-[34px] text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                Sniper indexes the public artifacts of public hackathons —
                Devpost submission pages, the GitHub repositories linked from
                those pages, demo videos posted to public channels, and the
                event programs themselves.
              </p>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                We read commits the way a publication reads a galley: as evidence
                of the writer&apos;s hand. We are not interested in commit volume on
                its own. We are interested in authorship continuity, refactor
                depth, test coverage that arrives before the bug, and the small
                craft signals — file headers, sane names, comments written for a
                stranger — that distinguish a builder who has done this before
                from a builder who is doing it for the first time.
              </p>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                We do this slowly. A new Devpost submission enters the index
                within a few minutes; a confidence score takes hours. We would
                rather be wrong less often than be early in every case.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section id="ii">
              <h2
                className="m-0 mt-16 mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 32,
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  fontVariationSettings: '"opsz" 96',
                }}
              >
                II. What we will not read
              </h2>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                We do not index private repositories. We do not buy résumé
                databases from third parties. We do not infer protected
                attributes — race, gender, age, citizenship, disability — and we
                do not allow recruiters using Sniper to weight on them, even by
                proxy.
              </p>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                We do not send outreach in a recruiter&apos;s name, ever. The
                warmness of the first message is the recruiter&apos;s, not ours; if
                we wrote it for them, the candidate would be reading a form
                letter again.
              </p>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                We do not index minors. If a builder&apos;s listed age is under 18,
                their submissions remain in their Devpost listing and are not
                surfaced in any pipeline.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section id="iii">
              <h2
                className="m-0 mt-16 mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 32,
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  fontVariationSettings: '"opsz" 96',
                }}
              >
                III. The score is a reading, not a person.
              </h2>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                A confidence score is exactly that: a confidence interval
                attached to a reading of the public record. It is explainable —
                every weight is named, every input is logged, and every
                candidate can request their own report in plain language.
              </p>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                We publish the weights distribution monthly. We publish the
                rate at which our gem flag agrees with eventual hiring
                outcomes — currently 64% over a one-year window — and we
                publish the cases where it does not. Both numbers matter.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section id="iv">
              <h2
                className="m-0 mt-16 mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 32,
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  fontVariationSettings: '"opsz" 96',
                }}
              >
                IV. If a builder asks us to stop.
              </h2>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                Any builder may request to be removed from the index. The
                request is honored within 24 hours and is logged. We will not
                re-index a removed builder without a fresh, explicit opt-in,
                even if their public artifacts change.
              </p>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                Builders may also request a correction. We treat corrections
                the way a periodical treats them: in public, with a dated
                note, and with the editor&apos;s name attached.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section id="v">
              <h2
                className="m-0 mt-16 mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 32,
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  fontVariationSettings: '"opsz" 96',
                }}
              >
                V. A short list of rules.
              </h2>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink" style={{ fontFamily: "var(--font-serif)" }}>
                <em>One.</em> Public artifacts, slowly read. <em>Two.</em> No
                buying résumés. <em>Three.</em> No outreach in our name.
                <em> Four.</em> No protected attributes, not even by proxy.
                <em> Five.</em> The score is a reading, not a person. <em>Six.</em>{" "}
                Anyone can ask us to stop, and we will.
              </p>
              <p className="m-0 mb-4 text-balance text-[19px] leading-8 text-ink-mid" style={{ fontFamily: "var(--font-serif)" }}>
                If any of the above stops being true, this page will say so before
                anything else changes.
              </p>
            </section>
          </Reveal>

          <div className="mt-20 flex justify-between border-t border-ink pt-6 t-meta text-ink-soft">
            <span>Signed — A. Reyes, Ethics</span>
            <span>
              Disagree?{" "}
              <Link href="#" data-cursor="link" className="u-link text-ink-soft">
                Write to the editor →
              </Link>
            </span>
          </div>
        </article>

        {/* Marginalia */}
        <aside className="sticky top-24 h-fit self-start border-l border-rule pl-6">
          <h4 className="m-0 mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-ink-soft">
            Margin notes
          </h4>
          <p
            className="m-0 mb-4 text-[15px] leading-6 text-ink-mid"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            &ldquo;Volume&rdquo; is the easiest signal to game; it sits at 11% of the rubric
            and is capped.
          </p>
          <p
            className="m-0 mb-4 text-[15px] leading-6 text-ink-mid"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            Our gem rate against eventual hires has improved from 41% (v.1) to
            64% (v.5). The misses are studied weekly.
          </p>
          <p
            className="m-0 mb-4 text-[15px] leading-6 text-ink-mid"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            Builders who request removal stay removed. We have not made an
            exception, and would have to publish a notice if we did.
          </p>

          <h4 className="m-0 mb-2 mt-8 text-[10px] font-medium uppercase tracking-[0.12em] text-ink-soft">
            Related dispatches
          </h4>
          <p className="m-0 mb-4 text-[15px] leading-6 text-ink-mid" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
            <Link href="#" data-cursor="link" className="u-link">
              — On the difference between a hard problem and an annoying one.
            </Link>
          </p>
          <p className="m-0 mb-4 text-[15px] leading-6 text-ink-mid" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
            <Link href="#" data-cursor="link" className="u-link">
              — Why the gem flag is conservative on purpose.
            </Link>
          </p>
        </aside>
      </section>

      <EditorialFooter />
    </>
  );
}
