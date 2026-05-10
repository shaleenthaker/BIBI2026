"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  Save,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SiteMark } from "@/components/site-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { type OAQuestion } from "@/lib/mock-data";
import { fetchOA, submitOA, apiOAQuestionToOAQuestion } from "@/lib/api";
import { cn } from "@/lib/utils";

type Stage = "loading" | "error" | "welcome" | "questions" | "submitted";

export default function OAPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";

  const [stage, setStage] = useState<Stage>("loading");
  const [questions, setQuestions] = useState<OAQuestion[]>([]);
  const [roleTitle, setRoleTitle] = useState("Assessment");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteEvents, setPasteEvents] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchOA(token)
      .then((data) => {
        setQuestions(data.questions.map(apiOAQuestionToOAQuestion));
        setRoleTitle(data.candidate?.role_id ?? "Assessment");
        setStage("welcome");
      })
      .catch(() => setStage("error"));
  }, [token]);

  const current = questions[questionIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    if (stage !== "questions") return;
    const onVis = () => {
      if (document.visibilityState === "hidden") setTabSwitches((n) => n + 1);
    };
    const onPaste = () => setPasteEvents((n) => n + 1);
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("paste", onPaste);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "questions") return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [stage]);

  const minutesLeft = Math.floor(secondsLeft / 60);
  const secsLeft = secondsLeft % 60;

  const advance = async () => {
    setDirection(1);
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((i) => i + 1);
    } else {
      const responses = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer: String(answer),
      }));
      try {
        await submitOA(token, responses);
        setStage("submitted");
      } catch {
        setSubmitError("Submission failed — please try again.");
      }
    }
  };

  const goBack = () => {
    setDirection(-1);
    setQuestionIndex((i) => Math.max(0, i - 1));
  };

  const canAdvance = useMemo(() => {
    if (!current) return false;
    const a = answers[current.id];
    if (current.type === "multiple-choice") return typeof a === "number";
    return typeof a === "string" && a.trim().length > 0;
  }, [current, answers]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top frame */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <SiteMark size="sm" />
            <span className="text-muted-foreground">·</span>
            <span className="text-sm font-medium">{roleTitle}</span>
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
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

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-10">
        <AnimatePresence mode="wait">
          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground"
            >
              Loading assessment…
            </motion.div>
          )}

          {stage === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-border bg-card p-8 text-center"
            >
              <p className="text-sm font-medium">This link is invalid or has already been used.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Contact the recruiting team if you believe this is a mistake.
              </p>
            </motion.div>
          )}

          {stage === "welcome" && <WelcomeStage key="welcome" onBegin={() => setStage("questions")} totalQuestions={totalQuestions} />}

          {stage === "questions" && current && (
            <motion.section
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              <Stepper
                total={totalQuestions}
                index={questionIndex}
                tabSwitches={tabSwitches}
                pasteEvents={pasteEvents}
              />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-5 rounded-lg border border-border bg-card p-7"
                >
                  {current.type === "free-response" && (
                    <div className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-info-soft px-2.5 py-1.5 text-[11px] text-foreground">
                      <Sparkles className="size-3 text-accent" />
                      Generated specifically from your Devpost project:{" "}
                      <span className="font-mono font-medium">
                        {current.personalizedFrom}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-accent">
                      Question {questionIndex + 1} of {totalQuestions}
                    </div>
                    <h2 className="mt-2 text-xl font-semibold leading-snug">{current.prompt}</h2>
                  </div>

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
                              "group flex w-full items-start gap-3 rounded-md border bg-background px-4 py-3 text-left text-sm transition-colors duration-150 cursor-pointer",
                              checked
                                ? "border-accent bg-info-soft"
                                : "border-border hover:bg-secondary",
                            )}
                          >
                            <span
                              className={cn(
                                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                                checked
                                  ? "border-accent bg-accent text-accent-foreground"
                                  : "border-border bg-card text-muted-foreground",
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
                      placeholder="Be specific about the constraint, the choice, and what you learned. 4–8 sentences is plenty."
                      rows={8}
                      className="w-full rounded-md border border-border bg-background p-3 text-sm leading-relaxed outline-none transition-colors duration-150 focus:border-accent"
                    />
                  )}

                  <div className="space-y-3 border-t border-border pt-4">
                    {submitError && (
                      <p className="text-center text-xs text-destructive">{submitError}</p>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant="ghost"
                        className="cursor-pointer gap-1.5"
                        disabled={questionIndex === 0}
                        onClick={goBack}
                      >
                        <ArrowLeft className="size-3.5" />
                        Back
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" className="cursor-pointer gap-1.5 text-xs">
                          <Save className="size-3.5" />
                          Saved
                        </Button>
                        <Button
                          className="cursor-pointer gap-1.5"
                          disabled={!canAdvance}
                          onClick={advance}
                        >
                          {questionIndex + 1 === totalQuestions ? "Submit" : "Next"}
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.section>
          )}

          {stage === "submitted" && (
            <motion.section
              key="submitted"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-lg border border-border bg-card p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16 }}
                className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-success-soft text-success"
              >
                <CheckCircle2 className="size-6" />
              </motion.div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Thanks — your submission is in.
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
                The recruiting team will be in touch shortly. You don&apos;t need to do anything
                else.
              </p>
              <p className="mt-7 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Submission id ·{" "}
                <span className="text-foreground">oa_{Date.now().toString(36)}</span>
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const slideVariants = {
  enter: (dir: 1 | -1) => ({ opacity: 0, x: dir * 30 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: 1 | -1) => ({ opacity: 0, x: dir * -30 }),
};

function WelcomeStage({
  onBegin,
  totalQuestions,
}: {
  onBegin: () => void;
  totalQuestions: number;
}) {
  return (
    <motion.section
      key="welcome"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 rounded-lg border border-border bg-card p-8"
    >
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-info-soft px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-accent">
          <Sparkles className="size-3" />
          Personalized assessment
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Welcome — let&apos;s get started.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          This assessment takes ~45 minutes. {totalQuestions} questions total. The last question
          is generated specifically from the project you submitted to Devpost.
        </p>
      </div>

      <ul className="grid gap-2 text-sm">
        <Bullet>
          <strong className="font-medium">{totalQuestions} questions.</strong>{" "}
          {totalQuestions - 1} multiple-choice, 1 free-response.
        </Bullet>
        <Bullet>Inline save — close the tab and your progress is kept.</Bullet>
        <Bullet>
          We track integrity signals (tab switches, paste events) for{" "}
          <em>fairness</em>, not disqualification.
        </Bullet>
      </ul>

      <Button size="lg" className="w-full cursor-pointer gap-2" onClick={onBegin}>
        Begin assessment
        <ArrowRight className="size-4" />
      </Button>
    </motion.section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 rounded-md border border-border bg-background px-3 py-2 text-sm">
      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
      <span>{children}</span>
    </li>
  );
}

function Stepper({
  total,
  index,
  tabSwitches,
  pasteEvents,
}: {
  total: number;
  index: number;
  tabSwitches: number;
  pasteEvents: number;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono uppercase tracking-wider text-muted-foreground">
          Progress
        </span>
        <IntegritySignals tabSwitches={tabSwitches} pasteEvents={pasteEvents} />
      </div>
      <ol className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const done = i < index;
          const active = i === index;
          return (
            <li key={i} className="flex flex-1 items-center gap-1.5">
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full border font-mono text-[10px] font-medium transition-colors duration-150",
                  done && "border-success bg-success text-success-foreground",
                  active && "border-accent bg-card text-accent",
                  !done && !active && "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <CheckCircle2 className="size-3" /> : i + 1}
              </span>
              {i < total - 1 && (
                <span
                  className={cn(
                    "h-px flex-1 transition-colors duration-150",
                    done ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
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
    <span
      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground"
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
    </span>
  );
}
