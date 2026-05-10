"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SiteMark } from "@/components/site-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { mockOAQuestions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Stage = "welcome" | "questions" | "submitted";

export default function OAPage() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteEvents, setPasteEvents] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);

  const current = mockOAQuestions[questionIndex];
  const totalQuestions = mockOAQuestions.length;

  // Integrity signals — visible, not punitive.
  useEffect(() => {
    if (stage !== "questions") return;

    const onVis = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitches((n) => n + 1);
      }
    };
    const onPaste = () => setPasteEvents((n) => n + 1);

    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("paste", onPaste);
    };
  }, [stage]);

  // Countdown timer.
  useEffect(() => {
    if (stage !== "questions") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [stage]);

  const minutesLeft = Math.floor(secondsLeft / 60);
  const secsLeft = secondsLeft % 60;

  const advance = () => {
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((i) => i + 1);
    } else {
      setStage("submitted");
    }
  };

  const canAdvance = useMemo(() => {
    if (!current) return false;
    const a = answers[current.id];
    if (current.type === "multiple-choice") return typeof a === "number";
    return typeof a === "string" && a.trim().length > 0;
  }, [current, answers]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 px-5 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <SiteMark size="sm" />
            <span className="text-muted-foreground">·</span>
            <span className="text-sm font-medium">Senior Frontend Engineer</span>
            <span className="hidden text-xs font-mono text-muted-foreground sm:inline">
              · Acme Talent
            </span>
          </div>
          <div className="flex items-center gap-3">
            {stage === "questions" && (
              <div className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs">
                <Clock className="size-3.5 text-muted-foreground" />
                <span className="font-mono tabular-nums">
                  <NumberTicker value={minutesLeft} />:
                  {secsLeft.toString().padStart(2, "0")}
                </span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-12">
        {stage === "welcome" && (
          <BlurFade>
            <div className="space-y-6 rounded-xl border border-border bg-card p-8">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <Sparkles className="size-3" />
                  Personalized assessment
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                  Welcome — let&apos;s get started.
                </h1>
                <p className="mt-3 text-base text-muted-foreground">
                  This assessment takes ~45 minutes. {totalQuestions} questions total. The last
                  question is generated specifically based on the project you submitted to
                  Devpost.
                </p>
              </div>

              <div className="grid gap-2 text-sm">
                <Bullet>
                  <strong className="font-medium">{totalQuestions} questions.</strong>{" "}
                  {totalQuestions - 1} multiple-choice, 1 free-response.
                </Bullet>
                <Bullet>
                  Inline save — close the tab, your progress is kept.
                </Bullet>
                <Bullet>
                  We track integrity signals (tab switches, paste events) for{" "}
                  <em>fairness</em>, not disqualification.
                </Bullet>
              </div>

              <Button
                size="lg"
                className="w-full cursor-pointer"
                onClick={() => setStage("questions")}
              >
                Begin assessment
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </BlurFade>
        )}

        {stage === "questions" && current && (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono tabular-nums">
                Question {questionIndex + 1} / {totalQuestions}
              </span>
              <IntegritySignals tabSwitches={tabSwitches} pasteEvents={pasteEvents} />
            </div>

            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={false}
                animate={{
                  width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
              />
            </div>

            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-5 rounded-xl border border-border bg-card p-7"
            >
              {current.type === "free-response" && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gem-soft px-2.5 py-1 text-[11px] font-medium text-gem">
                  <Sparkles className="size-3" />
                  This question was generated specifically based on your Devpost project:{" "}
                  <span className="font-mono">{current.personalizedFrom}</span>
                </div>
              )}
              <h2 className="text-xl font-semibold leading-snug">{current.prompt}</h2>

              {current.type === "multiple-choice" ? (
                <div className="space-y-2">
                  {current.choices.map((choice, idx) => {
                    const checked = answers[current.id] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setAnswers((a) => ({ ...a, [current.id]: idx }))
                        }
                        className={cn(
                          "group flex w-full items-start gap-3 rounded-lg border bg-background/30 px-4 py-3 text-left text-sm transition-colors duration-150 cursor-pointer hover:bg-accent/40",
                          checked
                            ? "border-primary/60 bg-accent/40"
                            : "border-border",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                            checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background",
                          )}
                          aria-hidden
                        >
                          <span className="font-mono text-[10px]">
                            {String.fromCharCode(65 + idx)}
                          </span>
                        </span>
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={(answers[current.id] as string | undefined) ?? ""}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [current.id]: e.target.value }))
                  }
                  placeholder={current.placeholder}
                  rows={8}
                  className="w-full rounded-lg border border-border bg-background/50 p-3 text-sm leading-relaxed outline-none focus:border-primary"
                />
              )}

              <div className="flex justify-between gap-2 border-t border-border pt-4">
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  disabled={questionIndex === 0}
                  onClick={() => setQuestionIndex((i) => Math.max(0, i - 1))}
                >
                  Back
                </Button>
                <Button
                  className="cursor-pointer"
                  disabled={!canAdvance}
                  onClick={advance}
                >
                  {questionIndex + 1 === totalQuestions ? "Submit" : "Next"}
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {stage === "submitted" && (
          <BlurFade>
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-6" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Thanks — your submission is in.
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
                The recruiting team will be in touch shortly. You don&apos;t need to do anything
                else.
              </p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Submission id ·{" "}
                <span className="text-foreground">oa_{Date.now().toString(36)}</span>
              </p>
            </div>
          </BlurFade>
        )}
      </main>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-border bg-background/40 px-3 py-2 text-sm text-muted-foreground">
      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <span>{children}</span>
    </div>
  );
}

function IntegritySignals({
  tabSwitches,
  pasteEvents,
}: {
  tabSwitches: number;
  pasteEvents: number;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground"
      title="Tracked for fairness, not disqualification"
    >
      <Eye className="size-3" />
      <span>
        Tab switches:{" "}
        <span className="font-mono tabular-nums text-foreground">{tabSwitches}</span>
      </span>
      <span aria-hidden>·</span>
      <span>
        Paste:{" "}
        <span className="font-mono tabular-nums text-foreground">{pasteEvents}</span>
      </span>
    </div>
  );
}
