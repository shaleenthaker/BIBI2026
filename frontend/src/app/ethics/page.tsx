import Link from "next/link";
import {
  ArrowLeft,
  Database,
  EyeOff,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteMark } from "@/components/site-mark";
import { ThemeToggle } from "@/components/theme-toggle";

const SECTIONS = [
  {
    id: "scrape",
    icon: Database,
    title: "What we scrape",
    body:
      "Only public Devpost submission pages — the same pages a hackathon judge or visitor sees. We never crawl member directories, never log in, and never consume Devpost's private APIs. Public GitHub data is pulled only when a candidate links it themselves.",
    bullet: "public submission pages only",
  },
  {
    id: "store",
    icon: Lock,
    title: "What we store",
    body:
      "For sourcing, we keep aggregate signals: project name, hackathon, public repo links, and derived scores. PII (email, resume, real name) is only stored when an applicant opts in by completing the OA we send.",
    bullet: "aggregate signals only until applicant opts in",
  },
  {
    id: "control",
    icon: Trash2,
    title: "How candidates control their data",
    body:
      "Every Sniper-sent email includes a one-click unsubscribe and a one-click data deletion request. Deletion is processed within 7 days. Candidates can also email privacy@sniper.dev to remove themselves from sourcing entirely.",
    bullet: "one-click unsubscribe · 7-day deletion SLA",
  },
  {
    id: "grading",
    icon: Scale,
    title: "How grading works",
    body:
      "Grading uses a transparent rubric attached to every role. Free-response answers are anonymized before LLM scoring — no name, school, or hackathon attached. Recruiters can override any score, and every override is captured in an audit log visible to the workspace.",
    bullet: "transparent rubric · anonymized · audited overrides",
  },
  {
    id: "boundaries",
    icon: XCircle,
    title: "What we don't do",
    body:
      "We don't scrape resumes, LinkedIn, or any social feed. We don't infer or use protected-class signals — gender, race, age, religion, disability status — for ranking. We don't sell candidate data, full stop.",
    bullet: "no resume scraping · no protected-class signals · no data sale",
  },
];

export default function EthicsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <Link href="/">
            <SiteMark />
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="cursor-pointer">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-14">
        <ScrollReveal>
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            Back to landing
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-info-soft px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-accent">
            <ShieldCheck className="size-3" />
            Sourcing & ethics
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Sourcing the right way — without making candidates feel surveilled.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Sniper exists because hackathon winners deserve faster recruiter contact, not because
            their data should travel further. This page is what we tell ourselves before we ship
            anything new.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-10 md:grid-cols-[200px_minmax(0,1fr)]">
          {/* Sticky section nav */}
          <nav aria-label="Sections" className="hidden md:block">
            <div className="sticky top-20 space-y-1">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                On this page
              </div>
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
                >
                  {s.title}
                </a>
              ))}
              <a
                href="#contact"
                className="mt-3 block rounded-md border border-border px-2 py-1.5 text-xs text-foreground transition-colors duration-150 hover:bg-secondary"
              >
                Need data removed?
              </a>
            </div>
          </nav>

          <div className="space-y-3">
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <ScrollReveal key={s.id} delay={0.04 * i}>
                  <section
                    id={s.id}
                    className="scroll-mt-20 rounded-lg border border-border bg-card p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="grid size-10 shrink-0 place-items-center rounded-md bg-info-soft text-accent">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold tracking-tight">{s.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                          {s.body}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-[11px] text-foreground">
                          <Sparkles className="size-3 text-accent" />
                          {s.bullet}
                        </div>
                      </div>
                    </div>
                  </section>
                </ScrollReveal>
              );
            })}

            <ScrollReveal>
              <section
                id="contact"
                className="scroll-mt-20 rounded-lg border border-accent/30 bg-info-soft p-7"
              >
                <div className="flex items-start gap-3">
                  <EyeOff className="mt-1 size-5 text-accent" />
                  <div>
                    <h2 className="text-lg font-semibold">Need data removed?</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Email{" "}
                      <span className="font-mono text-foreground">privacy@sniper.dev</span> from
                      the email you used on Devpost or GitHub. We process within 7 days and
                      confirm by reply.
                    </p>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            <p className="pt-6 text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              v0.2 · This page is the spec. We update it before we ship anything new.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
