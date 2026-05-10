// Editorial rubric — 4 axes mapped from our Candidate model.
// Weights in 0..100, the composite is renormalized so any weight set produces
// a 0..100 score. This is what the dashboard sliders + detail panel use.

import type { Candidate } from "./mock-data";

export type RubricKey = "craft" | "signal" | "depth" | "fit";

export type Weights = Record<RubricKey, number>;

export const DEFAULT_WEIGHTS: Weights = { craft: 35, signal: 35, depth: 20, fit: 10 };

export const RUBRIC_AXES: Record<RubricKey, { label: string; note: string }> = {
  craft: {
    label: "Craft",
    note: "OA assessment + stack-match. The hand of the writer.",
  },
  signal: {
    label: "Signal",
    note: "Wins, commit cadence, late-night work. The pulse.",
  },
  depth: {
    label: "Depth",
    note: "Devpost track record + OSS reach. Substance over volume.",
  },
  fit: {
    label: "Fit",
    note: "Stack match scaled by recency. How close to the role.",
  },
};

// Per-candidate per-axis score 0..100.
export function axisScores(c: Candidate): Record<RubricKey, number> {
  const wins = c.signals?.wins ?? 0;
  const stackMatch = c.signals?.stackMatch ?? 0;
  const commit = c.signals?.commitFrequency ?? 0;
  const stars = c.signals?.starsNormalized ?? 0;

  return {
    craft: clamp(((c.oaScore ?? 0) * 0.55 + stackMatch * 0.45) * 100),
    signal: clamp(((commit * 0.55) + Math.min(wins / 4, 1) * 0.45) * 100),
    depth: clamp(((c.devpostScore ?? 0) * 0.55 + (c.githubScore ?? 0) * 0.25 + stars * 0.2) * 100),
    fit: clamp(stackMatch * 100),
  };
}

export function composite(c: Candidate, w: Weights): number {
  const a = axisScores(c);
  const sum = w.craft + w.signal + w.depth + w.fit || 1;
  return (
    (a.craft * w.craft + a.signal * w.signal + a.depth * w.depth + a.fit * w.fit) / sum
  );
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}
