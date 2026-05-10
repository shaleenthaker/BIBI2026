"use client";

// Pipeline list row. See design-system/MASTER.md §6.
import { motion } from "framer-motion";
import { Gem, GitBranch, Globe2, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";
import type { Candidate, OAStatus } from "@/lib/mock-data";

const sourceIcon: Record<Candidate["source"], React.ComponentType<{ className?: string }>> = {
  Devpost: Sparkles,
  GitHub: GitBranch,
  Direct: Globe2,
};

const oaStatusTone: Record<OAStatus, string> = {
  Pending: "bg-muted text-muted-foreground border-border",
  "In Progress": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Submitted: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  Graded: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
};

export function CandidateCard({
  candidate,
  composite,
  selected = false,
  onClick,
}: {
  candidate: Candidate;
  composite: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  const SourceIcon = sourceIcon[candidate.source];
  const initials = candidate.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.button
      layout
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      onClick={onClick}
      type="button"
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-md border bg-card px-3 py-2.5 text-left transition-colors duration-150 cursor-pointer",
        "hover:border-primary/40 hover:bg-accent/40",
        selected ? "border-primary/60 bg-accent/40" : "border-border",
      )}
    >
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="bg-muted font-mono text-xs">{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium">{candidate.name}</span>
          {candidate.isGem && (
            <span
              aria-label="Gem candidate"
              title="Gem candidate"
              className="inline-flex items-center gap-1 rounded-full bg-gem-soft px-1.5 py-0.5 text-[10px] font-medium text-gem"
            >
              <Gem className="size-3" />
              gem
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <SourceIcon className="size-3" />
            {candidate.source}
          </span>
          <span aria-hidden>·</span>
          <span className="font-mono tabular-nums">@{candidate.handle}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-baseline gap-1">
          <NumberTicker
            value={Number((composite * 100).toFixed(0))}
            className="font-mono text-sm font-medium tabular-nums text-foreground"
          />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">/100</span>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "h-5 px-1.5 text-[10px] font-medium",
            oaStatusTone[candidate.oaStatus],
          )}
        >
          {candidate.oaStatus}
        </Badge>
      </div>
    </motion.button>
  );
}
