"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed 1px left-edge hairline that fills downward as the page scrolls.
 * RAF-throttled so it stays buttery; `transform: scaleY` is GPU-cheap.
 */
export function ScrollProgressHairline() {
  const fillRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const el = fillRef.current;
      if (!el) return;
      const doc = document.documentElement;
      const reach = doc.scrollHeight - window.innerHeight;
      const p = reach <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / reach));
      el.style.transform = `scaleY(${p})`;
      rafRef.current = null;
    };
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 h-screen w-px bg-rule"
    >
      <div
        ref={fillRef}
        className="h-full w-px bg-ink origin-top will-change-transform"
        style={{ transform: "scaleY(0)" }}
      />
    </div>
  );
}
