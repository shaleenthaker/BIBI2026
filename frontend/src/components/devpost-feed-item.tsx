"use client";

// Landing-page feed row. Flat, navy/blue. See design-system §5.
import { Sparkles, Trophy } from "lucide-react";
import type { DevpostFeedItem as Item } from "@/lib/mock-data";

export function DevpostFeedItem({ item }: { item: Item }) {
  return (
    <figure className="flex w-full items-center gap-3 rounded-md border border-border bg-card px-3.5 py-2.5">
      <div className="grid size-9 shrink-0 place-items-center rounded-md bg-info-soft text-accent">
        <Sparkles className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{item.candidate}</span>
          <span className="text-xs text-muted-foreground">submitted</span>
          <span className="truncate font-mono text-sm">{item.project}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Trophy className="size-3" />
          <span>{item.hackathon}</span>
          <span aria-hidden>·</span>
          <span className="font-mono tabular-nums">{item.receivedAt}</span>
        </div>
      </div>
      <div className="shrink-0 rounded-md border border-accent/20 bg-info-soft px-2 py-1 text-right">
        <div className="font-mono text-[9px] font-medium uppercase tracking-wider text-accent">
          {item.role}
        </div>
        <div className="font-mono text-sm font-semibold tabular-nums text-accent">
          {item.matchPct}%
        </div>
      </div>
    </figure>
  );
}
