"use client";

import { useEffect, useState } from "react";

/**
 * "tail -f" panel. Streaming log lines with gem highlights, animated caret.
 * Drives home that the watcher is actually running.
 */
type Line = { t: string; lvl: "GEM" | "ok" | "info"; msg: React.ReactNode };

const SEEDS: Line[] = [
  { t: "09:42:18", lvl: "GEM", msg: <>scored <Arg>maya_ostrowski</Arg> @ 91.4 · 31 commits / 48h</> },
  { t: "09:42:11", lvl: "ok",  msg: <>indexed <Url>devpost.com/souphack-26/maya-ostrowski</Url></> },
  { t: "09:42:04", lvl: "ok",  msg: <>commit graph rebuilt · <Arg>+312 nodes</Arg> · 412ms</> },
  { t: "09:41:57", lvl: "info",msg: <>fetching demo reel · <Arg>yuki_tanaka.mp4</Arg> · 14.2MB</> },
  { t: "09:41:49", lvl: "GEM", msg: <>scored <Arg>priya_anand</Arg> @ 88.7 · rust · zero deps</> },
  { t: "09:41:42", lvl: "ok",  msg: <>rubric:founding-eng · weights craft 35 / sig 35 / dep 20 / fit 10</> },
  { t: "09:41:36", lvl: "ok",  msg: <>indexed <Url>github.com/devon-b/yjs-notes</Url></> },
  { t: "09:41:29", lvl: "info",msg: <>3 candidates entered watchlist via auto-pin</> },
  { t: "09:41:22", lvl: "ok",  msg: <>devpost.poll · 1,284/min · queue 412</> },
  { t: "09:41:15", lvl: "GEM", msg: <>scored <Arg>sara_linden</Arg> @ 89.0 · 2 audits / weekend</> },
];

function Arg({ children }: { children: React.ReactNode }) {
  return <span className="text-ink-mid">{children}</span>;
}
function Url({ children }: { children: React.ReactNode }) {
  return <span className="text-accent underline underline-offset-[3px]">{children}</span>;
}

export function LiveConsole() {
  const [lines, setLines] = useState<Line[]>(SEEDS);

  useEffect(() => {
    const t = setInterval(() => {
      setLines((prev) => {
        const [h, m, s] = prev[0].t.split(":").map(Number);
        const next = new Date(2000, 0, 1, h, m, s + 7);
        const tt = next.toTimeString().slice(0, 8);
        const sample = SEEDS[Math.floor(Math.random() * SEEDS.length)];
        return [{ t: tt, lvl: sample.lvl, msg: sample.msg }, ...prev.slice(0, 9)];
      });
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="console-shell">
      <div className="flex items-center gap-3 border-b border-rule px-3.5 py-2 text-[10px] uppercase tracking-[0.06em] text-ink-soft">
        <span className="inline-flex gap-1.5">
          <i className="inline-block size-[7px] bg-accent" />
          <i className="inline-block size-[7px] bg-rule" />
          <i className="inline-block size-[7px] bg-rule" />
        </span>
        <span className="flex-1 text-ink-mid">~ / sniper / live · stream.log</span>
        <span className="border border-rule px-1.5 py-0.5 text-ink">tail -f</span>
      </div>
      <div className="relative max-h-[360px] overflow-hidden p-3.5">
        {lines.map((l, i) => (
          <div
            key={i}
            className="grid grid-cols-[60px_72px_1fr] items-baseline gap-3 py-px"
          >
            <span className="text-ink-soft">{l.t}</span>
            <span
              className={
                l.lvl === "GEM"
                  ? "font-medium text-accent"
                  : l.lvl === "ok"
                    ? "text-ink"
                    : "text-ink-mid"
              }
            >
              {l.lvl}
            </span>
            <span className="text-ink">{l.msg}</span>
          </div>
        ))}
        <div className="grid grid-cols-[60px_72px_1fr] items-baseline gap-3 py-px">
          <span>&nbsp;</span>
          <span>&nbsp;</span>
          <span>
            <span className="text-accent">sniper&gt;</span>
            <span className="ml-1.5 inline-block h-3 w-[7px] bg-ink align-[-1px] motion-safe:animate-caret" />
          </span>
        </div>
        {/* fade-out gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
          style={{
            backgroundImage: "linear-gradient(to bottom, transparent, var(--paper-deep))",
          }}
        />
      </div>
    </div>
  );
}
