import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Briefcase,
  CheckCircle2,
  Gem,
  Quote,
  Radar,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedList } from "@/components/ui/animated-list";
import { ProductPreview } from "@/components/product-preview";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeader } from "@/components/section-header";
import { LivePulse } from "@/components/live-pulse";
import { MagicNumberStat } from "@/components/magic-number-stat";
import { DevpostFeedItem } from "@/components/devpost-feed-item";
import { SiteMark } from "@/components/site-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { mockDevpostFeed, mockHackathons } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Briefcase,
    title: "Define a role",
    body: "Describe the role and stack. Sniper turns it into a weighted scoring rubric.",
    deliverable: "Rubric ready in 60 seconds.",
  },
  {
    icon: Radar,
    title: "Devpost surfaces matches",
    body: "Public submissions stream in live, scored against your rubric — never a member directory.",
    deliverable: "Matches arrive within minutes of submission.",
  },
  {
    icon: Send,
    title: "Auto-dispatch the OA",
    body: "Personalized assessments go out — free-response questions reference the candidate's project.",
    deliverable: "First OA out before the closing ceremony ends.",
  },
  {
    icon: Bell,
    title: "Gem alerts in real time",
    body: "When a candidate clears your bar, we ping you. Reach out before Monday's LinkedIn post.",
    deliverable: "Median time-to-first-message: 47 minutes.",
  },
];

const TESTIMONIAL = {
  body: "We used to learn about hackathon winners on LinkedIn three days later. Now we have a meeting booked before the awards ceremony.",
  author: "Maya Chen",
  role: "Head of Recruiting · Acme Talent",
};

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Subtle dot grid backdrop only at top — nothing decorative scrolling */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-dot-grid"
      />

      {/* === HEADER === */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
          <SiteMark />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <Link className="transition-colors duration-150 hover:text-foreground" href="#how">
              How it works
            </Link>
            <Link className="transition-colors duration-150 hover:text-foreground" href="#feed">
              Live feed
            </Link>
            <Link
              className="transition-colors duration-150 hover:text-foreground"
              href="#proof"
            >
              Customers
            </Link>
            <Link
              className="transition-colors duration-150 hover:text-foreground"
              href="/ethics"
            >
              Ethics
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm" className="cursor-pointer gap-1.5">
                Open dashboard
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* === HERO === */}
      <section className="px-6 pb-16 pt-16 md:pt-24">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center">
          <div className="max-w-xl">
            <ScrollReveal>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
                <LivePulse tone="success" />
                <span className="font-mono uppercase tracking-wider text-muted-foreground">
                  Live · 47 hackathons watched
                </span>
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <h1 className="text-balance text-[44px] font-semibold leading-[1.05] tracking-tight md:text-6xl">
                Reach hackathon winners{" "}
                <span className="text-accent">before LinkedIn does.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="mt-5 text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
                Sniper scores public Devpost submissions against your role in real time, dispatches
                personalized assessments within minutes, and pings you the second a candidate
                clears your bar.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="cursor-pointer gap-2">
                    Open the dashboard
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="#how">
                  <Button size="lg" variant="outline" className="cursor-pointer">
                    See how it works
                  </Button>
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                <ProofChip>No Devpost member-directory scraping</ProofChip>
                <ProofChip>One-click candidate unsubscribe</ProofChip>
                <ProofChip>SOC 2 in progress</ProofChip>
              </div>
            </ScrollReveal>
          </div>

          <ProductPreview />
        </div>

        {/* hero stats */}
        <ScrollReveal delay={0.4}>
          <div className="mx-auto mt-20 grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {[
              { value: 47, label: "Hackathons watched" },
              { value: 12, suffix: "k+", label: "Candidates surfaced" },
              { value: 92, suffix: "%", label: "Time-to-OA reduced" },
              { value: 47, suffix: "min", label: "Median first-message" },
            ].map((s) => (
              <div key={s.label} className="bg-card px-5 py-5">
                <MagicNumberStat value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* === HOW IT WORKS — vertical timeline === */}
      <section id="how" className="border-t border-border bg-secondary/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <SectionHeader
              eyebrow="The journey"
              title="From submission to scheduled call in under an hour."
              description="Sniper handles the four steps that used to live in a recruiter's spreadsheet. You sign off on the role and the offer — we handle everything in between."
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <ScrollReveal key={s.title} delay={i * 0.06}>
                  <article className="group relative h-full rounded-lg border border-border bg-card p-5 transition-colors duration-150 hover:border-accent/40">
                    {/* connector line on desktop */}
                    {i < STEPS.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute right-[-13px] top-9 hidden h-px w-6 bg-border md:block"
                      />
                    )}
                    <div className="flex items-center justify-between">
                      <div className="grid size-9 place-items-center rounded-md bg-info-soft text-accent">
                        <Icon className="size-4" />
                      </div>
                      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                        STEP {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-[11px] text-foreground">
                      <CheckCircle2 className="size-3 text-success" />
                      {s.deliverable}
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* === LIVE FEED === */}
      <section id="feed" className="border-t border-border px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Live feed"
              title="Submissions stream in. Matches surface in seconds."
              description="This is the moment a candidate hits 'submit' on Devpost. No refresh, no overnight digest — every match is scored against your active roles in real time."
            />
            <ul className="mt-7 space-y-2.5">
              {[
                "Scored against the role you defined",
                "Stack match weighted by your rubric",
                "OA queues automatically if score clears your bar",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="relative h-[460px] overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <LivePulse tone="success" />
                  Recent matches
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  refreshes every 4s
                </span>
              </div>
              <div className="relative h-[calc(100%-37px)] p-3">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-card to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-card to-transparent" />
                <AnimatedList delay={1500}>
                  {mockDevpostFeed.map((item) => (
                    <DevpostFeedItem key={item.id} item={item} />
                  ))}
                </AnimatedList>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* === SOCIAL PROOF + TESTIMONIAL === */}
      <section id="proof" className="border-t border-border bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <p className="mb-8 text-center font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Watching submissions across the top student hackathons
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Marquee pauseOnHover className="[--duration:42s]">
              {mockHackathons.map((h) => (
                <div
                  key={h}
                  className="mx-2 flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground/80"
                >
                  <Trophy className="size-3.5 text-accent" />
                  {h}
                </div>
              ))}
            </Marquee>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <figure className="mx-auto mt-16 max-w-3xl rounded-lg border border-border bg-card p-8">
              <Quote className="size-5 text-accent" aria-hidden />
              <blockquote className="mt-3 text-balance text-xl leading-relaxed text-foreground md:text-2xl">
                &ldquo;{TESTIMONIAL.body}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid size-9 place-items-center rounded-full bg-secondary font-mono text-xs font-semibold">
                  {TESTIMONIAL.author
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-medium">{TESTIMONIAL.author}</div>
                  <div className="text-xs text-muted-foreground">{TESTIMONIAL.role}</div>
                </div>
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>
      </section>

      {/* === BOTTOM CTA === */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-success">
              <Gem className="size-3" />
              First-contact recruiting
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              The first 24 hours after a hackathon are everything.
            </h2>
            <p className="mt-5 text-balance text-base text-muted-foreground md:text-lg">
              Don&apos;t be the recruiter who sees the LinkedIn post on Monday. Be the message in
              their inbox before the closing ceremony ends.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="cursor-pointer gap-2">
                  Open the dashboard
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/ethics">
                <Button size="lg" variant="ghost" className="cursor-pointer gap-2">
                  <ShieldCheck className="size-4" />
                  Sourcing & ethics
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="mt-auto border-t border-border bg-secondary/40 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <SiteMark size="sm" />
          <div className="flex items-center gap-5">
            <Link href="/ethics" className="hover:text-foreground">
              Sourcing & ethics
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span className="font-mono text-xs tabular-nums">v0.2 · scaffold</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProofChip({ children }: { children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5")}>
      <Sparkles className="size-3 text-accent" />
      {children}
    </span>
  );
}
