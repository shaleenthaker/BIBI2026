"use client";

// Auto-normalizing weight controls. See design-system/MASTER.md §6.
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export type Weights = {
  oa: number;
  devpost: number;
  github: number;
};

export const defaultWeights: Weights = { oa: 0.5, devpost: 0.3, github: 0.2 };

const KEYS: (keyof Weights)[] = ["oa", "devpost", "github"];

function normalize(weights: Weights): Weights {
  const sum = weights.oa + weights.devpost + weights.github;
  if (sum <= 0) return { oa: 1 / 3, devpost: 1 / 3, github: 1 / 3 };
  return {
    oa: weights.oa / sum,
    devpost: weights.devpost / sum,
    github: weights.github / sum,
  };
}

// Adjust the changed key, keep ratio of the other two intact, then renormalize.
function adjustWeights(current: Weights, key: keyof Weights, next: number): Weights {
  const clamped = Math.max(0, Math.min(1, next));
  const others = KEYS.filter((k) => k !== key);
  const remaining = 1 - clamped;
  const otherSum = current[others[0]] + current[others[1]];

  let nextWeights: Weights;
  if (otherSum <= 0.0001) {
    nextWeights = { ...current, [key]: clamped } as Weights;
    nextWeights[others[0]] = remaining / 2;
    nextWeights[others[1]] = remaining / 2;
  } else {
    nextWeights = {
      ...current,
      [key]: clamped,
      [others[0]]: (current[others[0]] / otherSum) * remaining,
      [others[1]]: (current[others[1]] / otherSum) * remaining,
    } as Weights;
  }

  return normalize(nextWeights);
}

const ROW_LABELS: Record<keyof Weights, { label: string; hint: string }> = {
  oa: { label: "OA", hint: "Online assessment score" },
  devpost: { label: "Devpost", hint: "Hackathon wins, stack match" },
  github: { label: "GitHub", hint: "Commit cadence, OSS reach" },
};

export function WeightSliders({
  weights,
  onChange,
  className,
}: {
  weights: Weights;
  onChange: (next: Weights) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
      {KEYS.map((k) => {
        const v = weights[k];
        const meta = ROW_LABELS[k];
        return (
          <div key={k} className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-medium">{meta.label}</span>
                <span className="text-[10px] text-muted-foreground">{meta.hint}</span>
              </div>
              <span className="font-mono text-xs tabular-nums text-foreground/80">
                {(v * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[v * 100]}
              max={100}
              step={1}
              onValueChange={(next) => {
                const raw = Array.isArray(next) ? next[0] ?? 0 : next ?? 0;
                onChange(adjustWeights(weights, k, raw / 100));
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function compositeScore(
  c: { oaScore: number; devpostScore: number; githubScore: number },
  w: Weights,
) {
  return c.oaScore * w.oa + c.devpostScore * w.devpost + c.githubScore * w.github;
}
