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
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteMark } from "@/components/site-mark";
import { ThemeToggle } from "@/components/theme-toggle";

const SECTIONS = [
  {
    icon: Database,
    title: "What we scrape",
    body:
      "Only public Devpost submission pages — the same pages a hackathon judge or visitor sees. We never crawl member directories, never log in, and never consume Devpost's private APIs. We also pull public GitHub data when a candidate links it themselves.",
    bullet: "public submission pages only",
  },
  {
    icon: Lock,
    title: "What we store",
    body:
      "For sourcing, we keep aggregate signals (project name, hackathon, public repo links, derived scores) — never personal data beyond the public-display name. PII (email, resume, real name) is only stored when an applicant opts in by completing the OA we send.",
    bullet: "aggregate signals only until applicant opts in",
  },
  {
    icon: Trash2,
    title: "How candidates control their data",
    body:
      "Every Sniper-sent email includes a one-click unsubscribe and a one-click data deletion request. Deletion is processed within 7 days. Candidates can also email privacy@sniper.dev to remove themselves from sourcing entirely.",
    bullet: "one-click unsubscribe · 7-day deletion SLA",
  },
  {
    icon: Scale,
    title: "How grading works",
    body:
      "Grading uses a transparent rubric attached to every role. Free-response answers are anonymized before LLM scoring — no name, school, or hackathon attached. Recruiters can override any score, and every override is captured in an audit log visible to the workspace.",
    bullet: "transparent rubric · anonymized · audited overrides",
  },
  {
    icon: XCircle,
    title: "What we don't do",
    body:
      "We don't scrape resumes, LinkedIn, or any social feed. We don't infer or use protected-class signals — gender, race, age, religion, disability status — for ranking. We don't sell candidate data, full stop.",
    bullet: "no resume scraping · no protected-class signals · no data sale",
  },
];

export default function EthicsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6">
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

      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <BlurFade>
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            Back to landing
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="size-3" />
            Sourcing & ethics
          </div>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Sourcing the right way — without making candidates feel surveilled.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Sniper exists because hackathon winners deserve faster recruiter contact, not because
            their data should travel further. This page is what we tell ourselves before we ship
            anything new.
          </p>
        </BlurFade>

        <div className="mt-14 space-y-3">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <BlurFade key={s.title} delay={0.04 * i}>
                <section className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold tracking-tight">{s.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.body}</p>
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-background/40 px-2 py-1 text-[11px] font-mono text-muted-foreground">
                        <Sparkles className="size-3 text-primary" />
                        {s.bullet}
                      </div>
                    </div>
                  </div>
                </section>
              </BlurFade>
            );
          })}
        </div>

        <BlurFade>
          <div className="mt-14 rounded-xl border border-border bg-gradient-to-br from-primary/10 via-transparent to-transparent p-7">
            <div className="flex items-start gap-3">
              <EyeOff className="mt-1 size-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Need data removed?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Email{" "}
                  <span className="font-mono text-foreground">privacy@sniper.dev</span> from the
                  email you used on Devpost or GitHub. We process within 7 days and confirm by
                  reply.
                </p>
              </div>
            </div>
          </div>
        </BlurFade>

        <p className="mt-10 text-center text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          v0.1 · This page is the spec. We update it before we ship anything new.
        </p>
      </main>
    </div>
  );
}
