"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOA, submitOA, apiOAQuestionToOAQuestion } from "@/lib/api";
import type { OAQuestion } from "@/lib/mock-data";

type Stage = "loading" | "error" | "answering" | "submitted";

export default function OAPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";

  const [stage, setStage] = useState<Stage>("loading");
  const [questions, setQuestions] = useState<OAQuestion[]>([]);
  const [candidateName, setCandidateName] = useState("M. Ostrowski");
  const [projectName, setProjectName] = useState("NeuralCanvas");

  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchOA(token)
      .then((data) => {
        setQuestions(data.questions.map(apiOAQuestionToOAQuestion));
        setCandidateName(data.candidate?.name ?? "M. Ostrowski");
        setProjectName(data.candidate?.top_project?.name ?? "NeuralCanvas");
        setStage("answering");
      })
      .catch(() => setStage("error"));
  }, [token]);

  const q = questions[i];
  const total = questions.length;
  const value = q ? answers[q.id] ?? "" : "";
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const lastInitial = useMemo(
    () => {
      const parts = candidateName.split(" ");
      const first = parts[0]?.[0] ?? "M";
      const last = parts[parts.length - 1] ?? "Ostrowski";
      return `${first}. ${last}`;
    },
    [candidateName],
  );

  const setText = (v: string) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: v }));
  };

  const next = async () => {
    if (i < total - 1) {
      setI(i + 1);
      return;
    }
    setSubmitting(true);
    try {
      const responses = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      await submitOA(token, responses);
      setStage("submitted");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-72px)] grid-rows-[auto_1fr_auto]">
      {/* header rail */}
      <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-rule px-14 py-8">
        <span className="t-meta text-ink-soft">Sniper — commissioned assessment</span>
        <span
          className="font-serif italic text-ink-mid"
          style={{ fontSize: 14 }}
        >
          For the consideration of{" "}
          <em className="text-ink not-italic">{lastInitial}</em>{" "}
          · on behalf of Pearl Labs
        </span>
        <span className="t-meta text-right text-ink-soft">
          {String(i + 1).padStart(2, "0")} / {String(total || 1).padStart(2, "0")}
        </span>
      </header>

      {/* body */}
      <section className="grid grid-cols-12 content-center gap-6 px-14 py-24">
        {stage === "loading" && (
          <div className="col-span-12 text-center font-mono text-xs text-ink-soft">
            preparing your invitation…
          </div>
        )}

        {stage === "error" && (
          <div className="col-span-12 text-center">
            <p
              className="m-0"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 22,
                color: "var(--ink-mid)",
              }}
            >
              This invitation is not currently valid. If you believe this is a mistake, please
              write to the recruiting team that sent it.
            </p>
          </div>
        )}

        {stage === "submitted" && (
          <div className="col-span-12 text-center">
            <p
              className="m-0"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 44,
                lineHeight: "50px",
                letterSpacing: "-0.02em",
                fontVariationSettings: '"opsz" 96',
              }}
            >
              Thank you. Your reading is in.
            </p>
            <p
              className="m-0 mt-6"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 20,
                color: "var(--ink-mid)",
              }}
            >
              You will hear back from a human, not an automated message.
            </p>
          </div>
        )}

        {stage === "answering" && q && (
          <>
            {/* Invite letter */}
            <aside className="col-span-12 border-rule pr-8 md:col-span-4 md:col-start-2 md:border-r">
              <div className="t-meta mb-4 text-ink-soft">An invitation</div>
              <p
                className="m-0 mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 20,
                  lineHeight: "30px",
                  color: "var(--ink-mid)",
                }}
              >
                You have been invited to consider the following. There is no
                timer in view. We would rather you think slowly than answer
                quickly.
              </p>
              <p
                className="m-0 mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 20,
                  lineHeight: "30px",
                  color: "var(--ink-mid)",
                }}
              >
                We are reading <em>{projectName}</em>, not your résumé. Please
                write in your own voice — not the one you save for cover letters.
              </p>
              <div className="t-meta-italic mt-6 text-ink">
                — Sara, on behalf of Pearl Labs
                <br />
                <span className="t-meta text-ink-soft">Posted via Sniper, ed. 14</span>
              </div>
            </aside>

            {/* Question column */}
            <div className="col-span-12 md:col-span-5 md:col-start-7">
              <div
                className="t-num mb-8"
                style={{
                  fontSize: 80,
                  lineHeight: 1,
                  color: "var(--accent)",
                  letterSpacing: "-0.03em",
                }}
              >
                {String(i + 1).padStart(2, "0")}.
              </div>
              <h2
                className="m-0 mb-6 text-balance"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 40,
                  lineHeight: "46px",
                  letterSpacing: "-0.015em",
                  fontVariationSettings: '"opsz" 96',
                }}
              >
                {q.prompt}
              </h2>

              {q.type === "free-response" && (
                <div className="t-meta mb-14 text-ink-soft">
                  Free response · roughly 12 minutes · no timer in view ·{" "}
                  <em
                    className="not-italic text-ink"
                    style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                  >
                    drawn from your project
                  </em>
                </div>
              )}
              {q.type === "multiple-choice" && (
                <div className="t-meta mb-14 text-ink-soft">
                  Choose one · roughly 4 minutes · no timer in view
                </div>
              )}

              {q.type === "free-response" ? (
                <>
                  <textarea
                    value={value}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Begin writing. Drafts save themselves."
                    data-cursor="link"
                    rows={8}
                    className="w-full resize-y bg-transparent text-[18px] leading-[30px] text-ink outline-none border-b border-rule transition-colors duration-200 focus:border-ink"
                    style={{
                      fontFamily: "var(--font-sans)",
                      padding: "12px 0",
                      minHeight: 200,
                    }}
                  />
                  <div className="t-meta mt-2 flex justify-between text-ink-soft">
                    <span>{words} words</span>
                    <span>Saved · 2 minutes ago</span>
                  </div>
                </>
              ) : (
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {q.choices.map((choice, idx) => {
                    const selected = answers[q.id] === String(idx);
                    return (
                      <li key={idx}>
                        <button
                          type="button"
                          data-cursor="link"
                          onClick={() => setText(String(idx))}
                          className={
                            "group flex w-full cursor-pointer items-start gap-4 border-b border-rule py-4 text-left transition-colors duration-200 " +
                            (selected ? "text-ink" : "text-ink-mid hover:text-ink")
                          }
                        >
                          <span
                            className="t-num mt-1 text-[28px] leading-none"
                            style={{
                              color: selected ? "var(--accent)" : "var(--ink-soft)",
                            }}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span
                            className="text-[18px] leading-[28px]"
                            style={{ fontFamily: "var(--font-sans)" }}
                          >
                            {choice}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </section>

      {/* footer */}
      <footer className="grid grid-cols-3 items-center border-t border-rule px-14 py-6">
        <div>
          {stage === "answering" && (
            <button
              type="button"
              data-cursor="link"
              onClick={() => setI(Math.max(0, i - 1))}
              disabled={i === 0}
              className={
                "u-link t-meta " +
                (i === 0 ? "cursor-not-allowed text-ink-soft opacity-50" : "cursor-pointer text-ink-soft")
              }
            >
              ← Previous question
            </button>
          )}
        </div>
        <div className="t-meta-italic justify-self-center text-ink-soft">
          {stage === "answering" ? (
            <>
              Question {i + 1} of {total}
            </>
          ) : (
            <>—</>
          )}
        </div>
        <div className="justify-self-end">
          {stage === "answering" &&
            (i < total - 1 ? (
              <button
                type="button"
                data-cursor="link"
                data-cursor-label="Next"
                onClick={next}
                disabled={!value && q?.type !== "multiple-choice"}
                className="u-link cta-accent t-meta cursor-pointer"
              >
                Continue to {String(i + 2).padStart(2, "0")} →
              </button>
            ) : (
              <button
                type="button"
                data-cursor="link"
                data-cursor-label="Send"
                onClick={next}
                disabled={submitting}
                className="u-link cta-accent t-meta cursor-pointer"
              >
                {submitting ? "Submitting…" : "Submit for reading →"}
              </button>
            ))}
        </div>
      </footer>
    </div>
  );
}
