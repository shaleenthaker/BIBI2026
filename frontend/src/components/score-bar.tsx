"use client";

// Score visualization. See design-system/MASTER.md §6.
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "neutral" | "gem";

const trackTone: Record<Variant, string> = {
  primary: "bg-primary",
  neutral: "bg-foreground/70",
  gem: "bg-gem",
};

export function ScoreBar({
  value,
  label,
  hint,
  variant = "primary",
  className,
  showValue = true,
}: {
  value: number; // 0-1
  label: string;
  hint?: string;
  variant?: Variant;
  className?: string;
  showValue?: boolean;
}) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-foreground/90">{label}</span>
          {hint && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
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
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", trackTone[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        />
      </div>
    </div>
  );
}
