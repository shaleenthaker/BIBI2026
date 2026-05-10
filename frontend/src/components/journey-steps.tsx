"use client";

// First-run / empty-state user-journey ribbon. See design-system §6.
import { motion } from "framer-motion";
import { Briefcase, Check, Radar, Send } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type JourneyStep = {
  id: string;
  title: string;
  description: string;
  icon: typeof Briefcase;
  status: "done" | "active" | "todo";
  cta?: ReactNode;
};

export const defaultJourneySteps: Omit<JourneyStep, "status" | "cta">[] = [
  {
    id: "define",
    title: "Define a role",
    description: "Set the rubric — stack, signals, weights.",
    icon: Briefcase,
  },
  {
    id: "watch",
    title: "Watch matches arrive",
    description: "Devpost submissions stream in, scored against your role.",
    icon: Radar,
  },
  {
    id: "send",
    title: "Send the OA",
    description: "Personalized assessments dispatch in minutes.",
    icon: Send,
  },
];

export function JourneySteps({
  steps,
  className,
}: {
  steps: JourneyStep[];
  className?: string;
}) {
  const activeIndex = steps.findIndex((s) => s.status === "active");
  const doneCount = steps.filter((s) => s.status === "done").length;
  const progress = steps.length > 0 ? doneCount / steps.length : 0;

  return (
    <section
      aria-label="Onboarding journey"
      className={cn(
        "rounded-lg border border-border bg-card",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-accent">
            Get set up
          </div>
          <p className="mt-0.5 text-sm font-medium">
            Three steps to your first gem alert
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-1.5 w-32 overflow-hidden rounded-full bg-muted"
            aria-label="Setup progress"
          >
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {doneCount} / {steps.length}
          </span>
        </div>
      </header>

      <ol className="grid gap-px bg-border md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const active = step.status === "active";
          const done = step.status === "done";
          return (
            <li
              key={step.id}
              className={cn(
                "flex flex-col gap-3 bg-card px-5 py-5",
                active && "bg-secondary/40",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-md border transition-colors",
                    done
                      ? "border-success/30 bg-success-soft text-success"
                      : active
                        ? "border-accent/30 bg-info-soft text-accent"
                        : "border-border bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {done ? <Check className="size-4" /> : <Icon className="size-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        active && "text-foreground",
                        done && "text-muted-foreground line-through",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              {step.cta && i === activeIndex && (
                <div className="pl-11">{step.cta}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
