"use client";

// Pipeline list row — flat, dense, drill-down affordance. See design-system §3, §5.
import { motion } from "framer-motion";
import {
  ChevronRight,
  Gem,
  GitBranch,
  Globe2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";
import type { Candidate, OAStatus } from "@/lib/mock-data";

const sourceIcon: Record<Candidate["source"], LucideIcon> = {
  Devpost: Sparkles,
  GitHub: GitBranch,
  Direct: Globe2,
};

const oaStatusTone: Record<OAStatus, string> = {
  Pending: "bg-muted text-muted-foreground border-border",
  "In Progress": "bg-warning-soft text-warning-foreground border-warning/30",
  Submitted: "bg-info-soft text-accent border-accent/30",
  Graded: "bg-success-soft text-success border-success/30",
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
        "group relative grid w-full grid-cols-[36px_minmax(0,1fr)_auto_auto] items-center gap-3 border-l-2 bg-card px-3 py-2.5 text-left transition-colors duration-150 cursor-pointer",
        "hover:bg-muted/40",
        selected
          ? "border-l-accent bg-info-soft/40"
          : candidate.isGem
            ? "border-l-success/60"
            : "border-l-transparent",
      )}
    >
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="bg-secondary font-mono text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium">{candidate.name}</span>
          {candidate.isGem && (
            <span
              aria-label="Gem candidate"
              className="inline-flex items-center gap-0.5 rounded-sm bg-success-soft px-1 py-0 font-mono text-[9px] font-medium uppercase text-success"
            >
              <Gem className="size-2.5" />
              gem
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <SourceIcon className="size-3" aria-hidden />
          <span>{candidate.source}</span>
          <span aria-hidden>·</span>
          <span className="truncate font-mono">{candidate.topProject.name}</span>
        </div>
      </div>

      <Badge
        variant="outline"
        className={cn(
          "h-5 shrink-0 px-1.5 font-mono text-[10px] uppercase tracking-wider",
          oaStatusTone[candidate.oaStatus],
        )}
      >
        {candidate.oaStatus}
      </Badge>

      <div className="flex shrink-0 items-center gap-2.5 pl-1">
        <div className="flex items-baseline gap-0.5 text-right">
          <NumberTicker
            value={Number((composite * 100).toFixed(0))}
            className="font-mono text-sm font-semibold tabular-nums text-foreground"
          />
          <span className="font-mono text-[10px] text-muted-foreground">/100</span>
        </div>
        <ChevronRight
          className={cn(
            "size-3.5 text-muted-foreground transition-transform duration-150",
            selected ? "translate-x-0 text-foreground" : "group-hover:translate-x-0.5",
          )}
          aria-hidden
        />
      </div>
    </motion.button>
  );
}
