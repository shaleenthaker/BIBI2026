"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor. Two modes driven by `data-cursor="link" | "card"` on any
 * ancestor element. RAF-tracked so it never visibly lags. We never use scale
 * transforms on the body — the cursor element itself is GPU-translated.
 *
 * Auto-disabled on coarse-pointer / touch devices and when the user prefers
 * reduced motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on real cursor hardware that doesn't ask for reduced motion.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.body.classList.add("cursor-active");
    return () => {
      document.body.classList.remove("cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;

      const t = (e.target as HTMLElement) ?? null;
      const host = t?.closest("[data-cursor]");
      const mode = host?.getAttribute("data-cursor") ?? "";
      const label = host?.getAttribute("data-cursor-label") ?? "";

      const dot = dotRef.current;
      const lbl = labelRef.current;
      if (!dot || !lbl) return;
      dot.dataset.mode = mode;
      lbl.textContent = label;
    };

    const tick = () => {
      const dot = dotRef.current;
      if (dot) {
        // light easing so it feels alive without lagging behind
        pos.current.x += (pos.current.tx - pos.current.x) * 0.32;
        pos.current.y += (pos.current.ty - pos.current.y) * 0.32;
        dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      data-mode=""
      className="pointer-events-none fixed left-0 top-0 z-[10000] flex items-center justify-center will-change-transform"
      style={{
        width: 6,
        height: 6,
        borderRadius: 999,
        background: "var(--ink)",
        mixBlendMode: "difference",
        filter: "invert(1)",
        transition:
          "width 240ms var(--ease-editorial), height 240ms var(--ease-editorial), background-color 240ms var(--ease-editorial), border-color 240ms var(--ease-editorial)",
        fontFamily: "var(--font-sans)",
        fontSize: 9,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--ink)",
      }}
    >
      <span
        ref={labelRef}
        style={{
          opacity: 0,
          transition: "opacity 200ms",
        }}
      />
      <style jsx>{`
        div[data-mode="link"] {
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid var(--ink);
        }
        div[data-mode="card"] {
          width: 56px;
          height: 56px;
          background: transparent;
          border: 1px solid var(--ink);
        }
        div[data-mode="link"] span,
        div[data-mode="card"] span {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
