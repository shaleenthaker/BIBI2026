"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SweepState = "" | "in" | "out";

/**
 * Page-transition sweep — a 1px horizontal ink line that scales right then
 * collapses left. Used between routes so navigation feels deliberate, not
 * instant. We only call the navigation callback at the midpoint so the wipe
 * masks the route change.
 */
export function useSweep() {
  const [state, setState] = useState<SweepState>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const sweep = useCallback((onMid: () => void) => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onMid();
      return;
    }
    setState("out");
    timeoutRef.current = setTimeout(() => {
      onMid();
      // small delay before the inbound sweep so the route DOM has time to render
      setState("in");
      timeoutRef.current = setTimeout(() => setState(""), 900);
    }, 420);
  }, []);

  return { state, sweep };
}

export function SweepTransition({ state }: { state: SweepState }) {
  return (
    <div
      aria-hidden
      className={"pointer-events-none fixed left-0 right-0 top-1/2 z-[9000] h-px bg-ink"}
      style={{
        transform: "scaleX(0)",
        transformOrigin: "left",
        animation:
          state === "in"
            ? "sweep-in 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards"
            : state === "out"
              ? "sweep-out 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards"
              : "none",
      }}
    />
  );
}
