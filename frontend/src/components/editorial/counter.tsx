"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Number that counts up once it enters the viewport. Eased so big numbers feel
 * less mechanical. Locale-formatted on the way up.
 */
export function Counter({
  to,
  durationMs = 1400,
  className,
  suffix = "",
  prefix = "",
}: {
  to: number;
  durationMs?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        const start = performance.now();
        let raf: number;
        const tick = (t: number) => {
          const k = Math.min(1, (t - start) / durationMs);
          const eased = 1 - Math.pow(1 - k, 3);
          setValue(Math.round(to * eased));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
