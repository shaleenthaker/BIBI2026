"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated score-distribution histogram. Bars rebuild with spring animations
 * whenever the score input changes — i.e., when weight sliders move.
 */
export function ScoreDistribution({
  scores,
  bins = 10,
  className,
  threshold = 0.8,
}: {
  scores: number[]; // 0..1
  bins?: number;
  className?: string;
  threshold?: number;
}) {
  const buckets = useMemo(() => {
    const arr = new Array(bins).fill(0);
    scores.forEach((s) => {
      const idx = Math.min(bins - 1, Math.max(0, Math.floor(s * bins)));
      arr[idx] += 1;
    });
    return arr;
  }, [scores, bins]);

  const max = Math.max(1, ...buckets);
  const thresholdBin = Math.floor(threshold * bins);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-end gap-1 h-20">
        {buckets.map((count, i) => {
          const pct = count / max;
          const isGem = i >= thresholdBin;
          return (
            <div key={i} className="flex flex-1 flex-col justify-end">
              <motion.div
                key={`${i}-${count}`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(4, pct * 100)}%` }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                  delay: i * 0.015,
                }}
                className={cn(
                  "rounded-t-sm",
                  isGem ? "bg-success" : "bg-accent/70",
                )}
                aria-label={`${count} candidate${count === 1 ? "" : "s"} in bin ${i}`}
              />
            </div>
          );
        })}
      </div>
      <div
        className="relative h-px bg-border"
        style={
          {
            // dashed marker at threshold
            backgroundImage: `linear-gradient(to right, var(--color-success) 0 1px, transparent 1px 100%)`,
            backgroundSize: `${(1 / bins) * 100}% 100%`,
            backgroundPosition: `${threshold * 100}% 0`,
            backgroundRepeat: "no-repeat",
          } as React.CSSProperties
        }
      />
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>0</span>
        <span className="text-success">gem threshold {(threshold * 100).toFixed(0)}</span>
        <span>100</span>
      </div>
    </div>
  );
}
