"use client";

import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Sparkline } from "@/components/sparkline";
import { cn } from "@/lib/utils";

export type Kpi = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  delta?: { value: number; period: string };
  trend?: number[];
  icon: LucideIcon;
  tone?: "default" | "success" | "info" | "warning";
  decimals?: number;
};

const toneAccent: Record<NonNullable<Kpi["tone"]>, string> = {
  default: "text-foreground",
  success: "text-success",
  info: "text-accent",
  warning: "text-warning",
};

export function KpiStrip({ items, className }: { items: Kpi[]; className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((k, i) => {
        const Icon = k.icon;
        const accent = toneAccent[k.tone ?? "default"];
        const positive = (k.delta?.value ?? 0) >= 0;
        return (
          <motion.li
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
            className="flex flex-col gap-2 bg-card px-4 py-3.5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {k.label}
              </span>
              <Icon className={cn("size-3.5", accent)} aria-hidden />
            </div>
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-baseline gap-1">
                {k.prefix && (
                  <span className="font-mono text-base text-muted-foreground">{k.prefix}</span>
                )}
                <NumberTicker
                  value={k.value}
                  decimalPlaces={k.decimals ?? 0}
                  className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground"
                />
                {k.suffix && (
                  <span className="font-mono text-base text-muted-foreground">{k.suffix}</span>
                )}
              </div>
              {k.trend && k.trend.length > 1 && (
                <Sparkline
                  data={k.trend}
                  className={accent}
                  width={84}
                  height={28}
                />
              )}
            </div>
            {k.delta && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-sm px-1 py-0.5 font-mono font-medium tabular-nums",
                    positive
                      ? "bg-success-soft text-success"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {positive ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {positive ? "+" : ""}
                  {k.delta.value}
                </span>
                <span>{k.delta.period}</span>
              </div>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}
