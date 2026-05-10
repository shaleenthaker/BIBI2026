import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Code2,
  Gem,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { MagicCard } from "@/components/ui/magic-card";
import { AnimatedList } from "@/components/ui/animated-list";
import { Marquee } from "@/components/ui/marquee";
import { DevpostFeedItem } from "@/components/devpost-feed-item";
import { MagicNumberStat } from "@/components/magic-number-stat";
import { SiteMark } from "@/components/site-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { mockDevpostFeed, mockHackathons } from "@/lib/mock-data";

const HOW_IT_WORKS = [
  {
    icon: Sparkles,
    step: "01",
    title: "Define the role",
    body: "Describe the role and stack. Sniper turns it into a weighted scoring rubric in seconds.",
  },
  {
    icon: Trophy,
    step: "02",
    title: "Devpost surfaces matches",
    body: "We camp Devpost submissions live and rank candidates by stack, wins, and project quality.",
  },
  {
    icon: Send,
    step: "03",
    title: "Auto-dispatch the OA",
    body: "Personalized OAs go out within minutes — free-response questions reference the candidate's project.",
  },
  {
    icon: Bell,
    step: "04",
    title: "Gem alerts in real time",
    body: "When a candidate clears your bar, we ping you instantly. Hire before LinkedIn knows they won.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,oklch(0.7_0.22_287/0.18),transparent_70%)]"
      />

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <SiteMark />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link className="hover:text-foreground" href="#how-it-works">
              How it works
            </Link>
            <Link className="hover:text-foreground" href="#live-feed">
              Live feed
            </Link>
            <Link className="hover:text-foreground" href="/ethics">
              Ethics
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm" className="cursor-pointer">
                Open dashboard
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative px-6 pb-20 pt-24 md:pt-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <BlurFade delay={0} duration={0.5}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono tabular-nums">live · 47 hackathons watched</span>
            </div>
          </BlurFade>
          <BlurFade delay={0.06} duration={0.6}>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Hire the hackathon winners{" "}
              <span className="bg-gradient-to-br from-primary via-primary to-foreground/80 bg-clip-text text-transparent">
                before LinkedIn does.
              </span>
            </h1>
          </BlurFade>
          <BlurFade delay={0.14} duration={0.6}>
            <p className="mt-5 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
              Sniper camps Devpost submissions in real time, scores candidates against your role,
              and dispatches personalized assessments — so you reach winners before they post the
              trophy.
            </p>
          </BlurFade>
          <BlurFade delay={0.22} duration={0.6}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/dashboard">
                <ShimmerButton className="cursor-pointer shadow-2xl">
                  <span className="text-sm font-medium tracking-tight text-white">
                    Start sourcing
                  </span>
                  <ArrowRight className="ml-1.5 size-3.5 text-white" />
                </ShimmerButton>
              </Link>
              <Link href="#live-feed">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  See it in action
                </Button>
              </Link>
            </div>
          </BlurFade>
          <BlurFade delay={0.32} duration={0.6}>
            <div className="mt-14 grid w-full grid-cols-3 gap-8 border-t border-border pt-8 md:gap-16">
              <MagicNumberStat value={47} label="Hackathons watched" />
              <MagicNumberStat value={12} suffix="k+" label="Candidates surfaced" />
              <MagicNumberStat value={92} suffix="%" label="Time-to-OA reduced" />
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border bg-muted/20 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <BlurFade>
            <div className="mb-10 max-w-2xl">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">
                How it works
              </div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Four steps from submission to &ldquo;you have a meeting Tuesday.&rdquo;
              </h2>
            </div>
          </BlurFade>
          <div className="grid gap-4 md:grid-cols-4">
            {HOW_IT_WORKS.map((s, i) => {
              const Icon = s.icon;
              return (
                <BlurFade key={s.step} delay={0.05 * i} className="h-full">
                  <MagicCard className="h-full rounded-xl">
                    <div className="flex h-full flex-col gap-3 p-5">
                      <div className="flex items-center justify-between">
                        <div className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </div>
                        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                          {s.step}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.body}</p>
                    </div>
                  </MagicCard>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </section>

      <section id="live-feed" className="border-t border-border px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <BlurFade>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">
                Live feed
              </div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Submissions stream in. Matches surface in seconds.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                This is what your team sees the moment a candidate hits &ldquo;submit&rdquo; on
                Devpost. No refresh, no inbox digest — every match scored against your roles in
                real time.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Tag>scored against role</Tag>
                <Tag>stack-matched</Tag>
                <Tag>auto-OA queued</Tag>
              </div>
            </BlurFade>
          </div>
          <div className="relative h-[460px] overflow-hidden rounded-xl border border-border bg-card/40 p-4">
            <div className="absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-card/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-card/70 to-transparent" />
            <AnimatedList delay={1400}>
              {mockDevpostFeed.map((item) => (
                <DevpostFeedItem key={item.id} item={item} />
              ))}
            </AnimatedList>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/10 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 px-6 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Watching submissions across the top student hackathons
          </p>
          <Marquee pauseOnHover className="[--duration:36s]">
            {mockHackathons.map((h) => (
              <div
                key={h}
                className="mx-2 flex h-10 items-center gap-2 rounded-md border border-border bg-card/60 px-4 text-sm font-medium text-muted-foreground"
              >
                <Trophy className="size-3.5 text-primary/70" />
                {h}
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <BlurFade>
            <div className="mb-2 inline-flex items-center justify-center gap-2 rounded-full bg-gem-soft px-3 py-1 text-xs font-medium text-gem">
              <Gem className="size-3" />
              For recruiting teams who want first contact
            </div>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              The first 24 hours after a hackathon are everything.
            </h2>
            <p className="mt-5 text-balance text-muted-foreground">
              Don&apos;t be the recruiter who sees the LinkedIn post on Monday. Be the message in
              their inbox before the closing ceremony ends.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="cursor-pointer">
                  Open the dashboard
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/ethics">
                <Button size="lg" variant="ghost" className="cursor-pointer">
                  <ShieldCheck className="size-4" />
                  Sourcing & ethics
                </Button>
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      <footer className="mt-auto border-t border-border bg-card/20 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <SiteMark size="sm" />
          <div className="flex items-center gap-5">
            <Link href="/ethics" className="hover:text-foreground">
              Sourcing & ethics
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span className="font-mono text-xs tabular-nums">v0.1 · scaffold</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1">
      <Code2 className="size-3 text-primary/70" />
      {children}
    </span>
  );
}
