"use client";

// Hero stat. Flat — no glow. See design-system §5.
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

export function MagicNumberStat({
  value,
  label,
  suffix,
  className,
}: {
  value: number;
  label: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-baseline gap-1">
        <NumberTicker
          value={value}
          className="font-mono text-3xl font-semibold tabular-nums tracking-tight text-foreground"
        />
        {suffix && (
          <span className="font-mono text-xl font-medium text-muted-foreground">{suffix}</span>
        )}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
