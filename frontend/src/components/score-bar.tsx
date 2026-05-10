"use client";

// Score visualization — flat, navy/blue palette. See design-system/MASTER.md §5.
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tone = "accent" | "success" | "neutral";

const TONE: Record<Tone, string> = {
  accent: "bg-accent",
  success: "bg-success",
  neutral: "bg-foreground/70",
};

export function ScoreBar({
  value,
  label,
  hint,
  tone = "accent",
  className,
  showValue = true,
  size = "md",
}: {
  value: number; // 0..1
  label: string;
  hint?: string;
  tone?: Tone;
  className?: string;
  showValue?: boolean;
  size?: "sm" | "md";
}) {
  const pct = Math.max(0, Math.min(1, value));
  const trackHeight = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-foreground/90">{label}</span>
          {hint && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {hint}
            </span>
          )}
        </div>
        {showValue && (
          <span className="font-mono text-xs tabular-nums text-foreground/80">
            {(pct * 100).toFixed(0)}
          </span>
        )}
      </div>
      <div className={cn("mt-1.5 w-full overflow-hidden rounded-full bg-muted", trackHeight)}>
        <motion.div
          className={cn("h-full rounded-full", TONE[tone])}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        />
      </div>
    </div>
  );
}
