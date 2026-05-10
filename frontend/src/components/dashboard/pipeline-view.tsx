"use client";

import { LayoutGroup, motion } from "framer-motion";
import {
  ExternalLink,
  Gem,
  RefreshCw,
  Send,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CandidateCard } from "@/components/candidate-card";
import { ScoreBar } from "@/components/score-bar";
import { ScoreDistribution } from "@/components/score-distribution";
import { LivePulse } from "@/components/live-pulse";
import {
  WeightSliders,
  compositeScore,
  defaultWeights,
  type Weights,
} from "@/components/weight-slider";
import {
  type Candidate,
  type Role,
} from "@/lib/mock-data";
import { fetchCandidates } from "@/lib/api";

export function PipelineView({
  role,
  onBack,
  initialCandidateId,
}: {
  role: Role;
  onBack: () => void;
  initialCandidateId?: string;
}) {
  const [weights, setWeights] = useState<Weights>(defaultWeights);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    setCandidates([]);
    fetchCandidates(role.id).then(setCandidates).catch(console.error);
  }, [role.id]);

  const scored = useMemo(
    () =>
      candidates
        .map((c) => ({ candidate: c, composite: compositeScore(c, weights) }))
        .sort((a, b) => b.composite - a.composite),
    [candidates, weights],
  );

  const [selectedId, setSelectedId] = useState<string>(
    initialCandidateId ?? scored[0]?.candidate.id ?? "",
  );
  const selected = scored.find((s) => s.candidate.id === selectedId) ?? scored[0];

  const gemsCount = candidates.filter((c) => c.isGem).length;
  const distributionScores = useMemo(() => scored.map((s) => s.composite), [scored]);

  return (
    <div className="space-y-5">
      {/* === Header with breadcrumbs === */}
      <div className="space-y-2.5">
        <Breadcrumbs
          items={[
            { label: "Workspace" },
            { label: "Roles", onClick: onBack },
            { label: role.title },
          ]}
        />
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {role.team}
            </div>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">{role.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px]">
              <LivePulse tone="success" />
              <span className="font-mono uppercase tracking-wider text-muted-foreground">
                Watcher live
              </span>
            </span>
            <Button size="sm" variant="outline" className="cursor-pointer gap-1.5">
              <RefreshCw className="size-3.5" />
              Refresh
            </Button>
            <Button size="sm" className="cursor-pointer gap-1.5">
              <Send className="size-3.5" />
              Send OAs
            </Button>
          </div>
        </div>
      </div>

      {/* === KPI strip — role-specific === */}
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
        <Kpi label="Candidates" value={candidates.length} icon={Users} />
        <Kpi label="Gems" value={gemsCount} icon={Gem} tone="success" />
        <Kpi label="OAs sent" value={role.oasOut} icon={Send} tone="info" />
        <Kpi
          label="Last activity"
          stringValue={role.lastActivity}
          icon={Trophy}
        />
      </ul>

      {/* === Weights + distribution panel === */}
      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Sliders */}
        <div className="bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Composite weights</h2>
              <p className="text-xs text-muted-foreground">
                Drag any slider — the others auto-normalize.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-xs text-muted-foreground"
              onClick={() => setWeights(defaultWeights)}
            >
              Reset
            </Button>
          </div>
          <WeightSliders weights={weights} onChange={setWeights} />
        </div>

        {/* Distribution */}
        <div className="bg-card p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <h2 className="text-sm font-semibold">Score distribution</h2>
              <p className="text-xs text-muted-foreground">
                Bars to the right of the line clear the gem threshold.
              </p>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              n = {scored.length}
            </span>
          </div>
          <ScoreDistribution scores={distributionScores} bins={10} threshold={0.8} />
        </div>
      </div>

      {/* === Pipeline + detail === */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-wider text-muted-foreground">
              Pipeline · sorted by composite
            </span>
            <span className="font-mono tabular-nums text-muted-foreground">
              {scored.length} candidates
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <LayoutGroup>
              <motion.div className="divide-y divide-border">
                {scored.map(({ candidate, composite }) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    composite={composite}
                    selected={candidate.id === selectedId}
                    onClick={() => setSelectedId(candidate.id)}
                  />
                ))}
              </motion.div>
            </LayoutGroup>
            {scored.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-secondary text-muted-foreground">
                  <Users className="size-5" />
                </div>
                <p className="text-sm font-medium">No candidates yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pipeline fills automatically as Devpost matches stream in.
                </p>
              </div>
            )}
          </div>
        </div>

        {selected && <CandidateDetail entry={selected} />}
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  stringValue,
  icon: Icon,
  tone,
}: {
  label: string;
  value?: number;
  stringValue?: string;
  icon: typeof Users;
  tone?: "success" | "info";
}) {
  const tint =
    tone === "success" ? "text-success" : tone === "info" ? "text-accent" : "text-foreground";
  return (
    <li className="flex items-center justify-between gap-3 bg-card px-4 py-3">
      <div className="space-y-0.5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className={`font-mono text-2xl font-semibold tabular-nums ${tint}`}>
          {value !== undefined ? value : stringValue}
        </div>
      </div>
      <Icon className={`size-4 ${tint} opacity-70`} />
    </li>
  );
}

function CandidateDetail({
  entry,
}: {
  entry: { candidate: Candidate; composite: number };
}) {
  const { candidate: c, composite } = entry;
  const initials = c.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.aside
      key={c.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="sticky top-[72px] h-fit overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border bg-secondary/40 px-5 py-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-11">
            <AvatarFallback className="bg-card font-mono text-sm">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold">{c.name}</h3>
              {c.isGem && (
                <span className="inline-flex items-center gap-0.5 rounded-sm bg-success-soft px-1.5 py-0 font-mono text-[10px] font-medium uppercase text-success">
                  <Gem className="size-2.5" />
                  gem
                </span>
              )}
            </div>
            <div className="mt-0.5 font-mono text-xs text-muted-foreground">
              @{c.handle} · {c.source}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-semibold tabular-nums">
            {(composite * 100).toFixed(0)}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            composite
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Score breakdown
          </div>
          <ScoreBar value={c.oaScore} label="OA" hint="online assessment" tone="accent" />
          <ScoreBar
            value={c.devpostScore}
            label="Devpost"
            hint="hackathon signals"
            tone="accent"
          />
          <ScoreBar
            value={c.githubScore}
            label="GitHub"
            hint="commit + OSS"
            tone="accent"
          />
        </div>

        <div className="space-y-2 rounded-md border border-border bg-secondary/40 p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Why this score
          </div>
          <p className="text-xs leading-relaxed">{c.whyExplainer}</p>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
            <SignalStat label="Wins" value={c.signals.wins.toString()} />
            <SignalStat
              label="Stack match"
              value={`${(c.signals.stackMatch * 100).toFixed(0)}%`}
            />
            <SignalStat
              label="Commits"
              value={`${(c.signals.commitFrequency * 100).toFixed(0)}%`}
            />
            <SignalStat
              label="Stars (norm)"
              value={`${(c.signals.starsNormalized * 100).toFixed(0)}%`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Top project
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2">
            <div>
              <div className="font-mono text-sm">{c.topProject.name}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Trophy className="size-3" />
                {c.topProject.hackathon}
              </div>
            </div>
            <a
              href={c.topProject.url}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] transition-colors duration-150 hover:bg-muted"
            >
              Devpost
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1 cursor-pointer gap-1.5">
            <Sparkles className="size-3.5" />
            Reach out
          </Button>
          <Button size="sm" variant="outline" className="cursor-pointer">
            OA response
          </Button>
        </div>

        <Badge
          variant="outline"
          className="w-full justify-center border-border bg-transparent font-mono text-[10px] tabular-nums text-muted-foreground"
        >
          Submitted {new Date(c.submittedAt).toLocaleString()}
        </Badge>
      </div>
    </motion.aside>
  );
}

function SignalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between rounded-sm border border-border bg-card px-2 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}
