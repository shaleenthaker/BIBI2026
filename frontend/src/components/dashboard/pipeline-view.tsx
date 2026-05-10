"use client";

import { LayoutGroup, motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Gem,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CandidateCard } from "@/components/candidate-card";
import { ScoreBar } from "@/components/score-bar";
import {
  WeightSliders,
  compositeScore,
  defaultWeights,
  type Weights,
} from "@/components/weight-slider";
import {
  mockCandidates,
  type Candidate,
  type Role,
} from "@/lib/mock-data";

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
  const candidates = useMemo(
    () => mockCandidates.filter((c) => c.roleId === role.id),
    [role.id],
  );

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

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={onBack}
        >
          <ArrowLeft className="size-3.5" />
          Roles
        </Button>
        <span className="text-muted-foreground">/</span>
        <div>
          <div className="text-xs font-mono text-muted-foreground">{role.team}</div>
          <h1 className="-mt-0.5 text-lg font-semibold tracking-tight">{role.title}</h1>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" />
            <span className="font-mono tabular-nums text-foreground">{candidates.length}</span> in
            pipeline
          </span>
          <span className="inline-flex items-center gap-1">
            <Gem className="size-3.5 text-gem" />
            <span className="font-mono tabular-nums text-foreground">
              {candidates.filter((c) => c.isGem).length}
            </span>{" "}
            gems
          </span>
        </div>
      </div>

      {/* Weight controls */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Composite weights</h2>
            <p className="text-xs text-muted-foreground">
              Drag any slider — the others auto-normalize. Pipeline reshuffles in real time.
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        {/* Candidate list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Sorted by composite score</span>
            <span className="font-mono tabular-nums">
              {scored.length} candidates
            </span>
          </div>
          <LayoutGroup>
            <motion.div className="space-y-1.5">
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
            <div className="rounded-lg border border-dashed border-border bg-card/40 p-10 text-center">
              <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                <Users className="size-5" />
              </div>
              <p className="text-sm font-medium">No candidates yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pipeline fills automatically as Devpost matches stream in.
              </p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && <CandidateDetail entry={selected} />}
      </div>
    </div>
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
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="sticky top-[72px] h-fit space-y-4 rounded-lg border border-border bg-card p-5"
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="font-mono text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{c.name}</h3>
            {c.isGem && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gem-soft px-1.5 py-0.5 text-[10px] font-medium text-gem">
                <Gem className="size-3" />
                gem
              </span>
            )}
          </div>
          <div className="mt-0.5 font-mono text-xs text-muted-foreground">
            @{c.handle} · {c.source}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-semibold tabular-nums">
            {(composite * 100).toFixed(0)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Composite
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-md border border-border bg-background/40 p-3">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Score breakdown
        </div>
        <ScoreBar value={c.oaScore} label="OA" hint="online assessment" />
        <ScoreBar value={c.devpostScore} label="Devpost" hint="hackathon signals" />
        <ScoreBar value={c.githubScore} label="GitHub" hint="commit + OSS" />
      </div>

      <div className="space-y-2 rounded-md border border-border bg-background/40 p-3">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Why this score
        </div>
        <p className="text-xs leading-relaxed text-foreground/90">{c.whyExplainer}</p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <Stat label="Wins" value={c.signals.wins.toString()} />
          <Stat
            label="Stack match"
            value={`${(c.signals.stackMatch * 100).toFixed(0)}%`}
          />
          <Stat
            label="Commits"
            value={`${(c.signals.commitFrequency * 100).toFixed(0)}%`}
          />
          <Stat
            label="Stars (norm)"
            value={`${(c.signals.starsNormalized * 100).toFixed(0)}%`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Top project
        </div>
        <div className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
          <div>
            <div className="font-mono text-sm">{c.topProject.name}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Trophy className="size-3" />
              {c.topProject.hackathon}
            </div>
          </div>
          <a
            href={c.topProject.url}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] hover:bg-accent"
          >
            Devpost
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="flex-1 cursor-pointer">
          <Sparkles className="size-3.5" />
          Reach out
        </Button>
        <Button size="sm" variant="outline" className="cursor-pointer">
          OA response
        </Button>
      </div>

      <Badge
        variant="outline"
        className="w-full justify-center border-border text-[10px] font-mono tabular-nums text-muted-foreground"
      >
        Submitted {new Date(c.submittedAt).toLocaleString()}
      </Badge>
    </motion.aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between rounded-sm bg-muted/50 px-2 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}
