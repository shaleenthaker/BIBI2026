import Link from "next/link";
import { EditorialFooter } from "@/components/editorial/footer";

const STEPS = [
  {
    n: "01",
    t: "We index every public hackathon.",
    p: "Devpost, MLH, school events. Submissions are read as they land.",
  },
  {
    n: "02",
    t: "We read the commits, not the slides.",
    p: "Authorship, refactor depth, test coverage — weighted to a rubric you control.",
  },
  {
    n: "03",
    t: "You reach out, in your own voice.",
    p: "We never message in your name. We just hand you the builder, early.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="shell pt-32 pb-32 md:pt-40 md:pb-40">
        <div className="max-w-[860px]">
          <h1
            className="m-0 text-balance"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(44px, 7vw, 88px)",
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              fontVariationSettings: '"opsz" 144, "SOFT" 0',
            }}
          >
            We read the commits<br />
            <span style={{ fontStyle: "italic", color: "var(--ink-mid)" }}>before</span> the résumé.
          </h1>
          <p
            className="mt-10 max-w-[56ch] text-balance"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 20,
              lineHeight: "32px",
              color: "var(--ink-mid)",
            }}
          >
            Sniper ranks the builders worth a call by reading every public hackathon
            artifact — Devpost, GitHub, demo reels. The cold inbox stays cold.
          </p>

          <div className="mt-12 flex flex-wrap items-baseline gap-8">
            <Link
              href="/dashboard"
              className="u-link cta-accent text-lg"
            >
              Open the pipeline →
            </Link>
            <Link
              href="/ethics"
              className="u-link text-[13px] text-ink-soft"
            >
              read /ethics →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works — three short lines */}
      <section className="shell border-t border-rule py-24">
        <div className="t-meta mb-12 text-ink-soft">How it works</div>
        <ol className="m-0 list-none p-0">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="grid grid-cols-[80px_1fr] gap-8 border-t border-rule py-8"
            >
              <span
                className="t-num"
                style={{
                  fontSize: 40,
                  lineHeight: 1,
                  color: "var(--ink-soft)",
                }}
              >
                {s.n}
              </span>
              <div>
                <h3
                  className="m-0 mb-1.5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 26,
                    lineHeight: "32px",
                    letterSpacing: "-0.01em",
                    fontVariationSettings: '"opsz" 36',
                  }}
                >
                  {s.t}
                </h3>
                <p
                  className="m-0 max-w-[58ch]"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 16,
                    lineHeight: "26px",
                    color: "var(--ink-mid)",
                  }}
                >
                  {s.p}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <EditorialFooter />
    </>
  );
}
