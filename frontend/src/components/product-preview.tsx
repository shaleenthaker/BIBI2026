"use client";

// A mini, authentic-looking dashboard preview that anchors the landing hero.
// Animates on mount: top stat tickers, sparkline draw-in, score bars filling,
// list-row staggered enter, and a steady live-pulse on the topbar.
import { motion } from "framer-motion";
import { Bell, ChevronRight, Gem, Sparkles, Trophy } from "lucide-react";
import { LivePulse } from "@/components/live-pulse";
import { Sparkline } from "@/components/sparkline";
import { NumberTicker } from "@/components/ui/number-ticker";

const PREVIEW_KPIS = [
  { label: "watching", value: 47, suffix: "", trend: [22, 24, 28, 30, 33, 38, 41, 44, 47] },
  { label: "matched", value: 312, suffix: "", trend: [180, 199, 222, 240, 268, 280, 295, 312] },
  { label: "gems", value: 9, suffix: "", trend: [3, 3, 4, 5, 6, 7, 8, 9] },
];

const PREVIEW_ROWS = [
  {
    id: "p1",
    name: "Sarah Khan",
    role: "Frontend",
    project: "NeuralCanvas",
    score: 94,
    gem: true,
    delay: 0.05,
  },
  {
    id: "p2",
    name: "Mateo Ferreira",
    role: "ML",
    project: "EvalGuard",
    score: 89,
    gem: true,
    delay: 0.12,
  },
  {
    id: "p3",
    name: "Priya Raman",
    role: "Frontend",
    project: "shadcn-charts",
    score: 76,
    gem: false,
    delay: 0.19,
  },
  {
    id: "p4",
    name: "Diego Alvarez",
    role: "Frontend",
    project: "InboxZero",
    score: 81,
    gem: false,
    delay: 0.26,
  },
];

export function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative w-full"
    >
      {/* soft shadow plate for depth without glassiness */}
      <div
        aria-hidden
        className="absolute inset-x-6 top-6 -z-10 h-[calc(100%-1.5rem)] rounded-2xl bg-foreground/5"
      />
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* topbar */}
        <div className="flex items-center justify-between border-b border-border bg-background/60 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded-sm bg-primary text-[10px] font-mono font-semibold text-primary-foreground">
              S
            </span>
            <span className="text-xs font-medium">Acme Talent</span>
            <ChevronRight className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Frontend Engineer</span>
          </div>
          <div className="flex items-center gap-3">
            <LivePulse label="watching" />
            <div className="relative">
              <Bell className="size-3.5 text-muted-foreground" />
              <span className="absolute -right-1 -top-1 grid size-3 place-items-center rounded-full bg-success font-mono text-[8px] font-medium text-success-foreground tabular-nums">
                3
              </span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-px bg-border">
          {PREVIEW_KPIS.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.06, duration: 0.4 }}
              className="flex items-center justify-between gap-3 bg-card px-3 py-2.5"
            >
              <div className="space-y-0.5">
                <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </div>
                <NumberTicker
                  value={k.value}
                  className="font-mono text-lg font-semibold tabular-nums"
                />
              </div>
              <Sparkline
                data={k.trend}
                width={56}
                height={20}
                className="text-accent"
              />
            </motion.div>
          ))}
        </div>

        {/* candidate list */}
        <div className="divide-y divide-border">
          {PREVIEW_ROWS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + r.delay, duration: 0.35 }}
              className="grid grid-cols-[28px_1fr_auto] items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40"
            >
              <div className="grid size-7 place-items-center rounded-md bg-secondary text-[10px] font-mono font-semibold text-foreground/80">
                {r.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-medium">{r.name}</span>
                  {r.gem && (
                    <span className="inline-flex items-center gap-0.5 rounded-sm bg-success-soft px-1 py-0 font-mono text-[9px] font-medium uppercase text-success">
                      <Gem className="size-2.5" />
                      gem
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Sparkles className="size-2.5" />
                  <span className="font-mono">{r.project}</span>
                  <span aria-hidden>·</span>
                  <Trophy className="size-2.5" />
                  <span>{r.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-20 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.score}%` }}
                    transition={{
                      delay: 0.7 + r.delay,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                    className={r.gem ? "h-full bg-success" : "h-full bg-accent"}
                  />
                </div>
                <span className="w-8 text-right font-mono text-xs font-semibold tabular-nums">
                  {r.score}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* footer hint */}
        <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-3 py-2 text-[10px]">
          <span className="font-mono uppercase tracking-wider text-muted-foreground">
            sorted by composite score
          </span>
          <span className="font-mono text-muted-foreground">12 candidates</span>
        </div>
      </div>

      {/* gem alert popping in */}
      <motion.div
        initial={{ opacity: 0, y: -12, x: 12 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1.4, duration: 0.5, type: "spring", damping: 22 }}
        className="absolute -right-2 top-2 hidden w-[220px] rounded-lg border border-success/30 bg-card p-3 shadow-md sm:block"
      >
        <div className="flex items-start gap-2">
          <span className="mt-0.5 grid size-7 place-items-center rounded-full bg-success-soft text-success">
            <Gem className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[9px] uppercase tracking-wider text-success">
              Gem detected · just now
            </div>
            <div className="mt-0.5 text-xs font-medium leading-tight">Sarah Khan</div>
            <div className="text-[10px] text-muted-foreground">
              composite 94 · 3 wins
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
