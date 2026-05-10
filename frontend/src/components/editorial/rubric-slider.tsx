"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Editorial slider. 1px track, 12px ink handle. Drag-to-set with pointer-
 * capture, keyboard arrow-keys for accessibility. The serif numeral on the
 * right is the value — 00..99 padded.
 */
export function RubricSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number; // 0..100
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const setFromX = useCallback(
    (clientX: number) => {
      const t = trackRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      const v = Math.max(0, Math.min(100, Math.round(((clientX - r.left) / r.width) * 100)));
      onChange(v);
    },
    [onChange],
  );

  useEffect(() => {
    const up = () => {
      draggingRef.current = false;
    };
    const move = (e: PointerEvent) => {
      if (draggingRef.current) setFromX(e.clientX);
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointermove", move);
    };
  }, [setFromX]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="t-meta text-ink-soft">{label}</span>
        <span
          className="t-num text-[32px] leading-none tabular-nums"
        >
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        tabIndex={0}
        data-cursor="link"
        data-cursor-label="Drag"
        onPointerDown={(e) => {
          draggingRef.current = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setFromX(e.clientX);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowDown")
            onChange(Math.max(0, value - 1));
          if (e.key === "ArrowRight" || e.key === "ArrowUp")
            onChange(Math.min(100, value + 1));
          if (e.key === "Home") onChange(0);
          if (e.key === "End") onChange(100);
          if (e.key === "PageUp") onChange(Math.min(100, value + 10));
          if (e.key === "PageDown") onChange(Math.max(0, value - 10));
        }}
        className="relative flex h-7 cursor-pointer items-center select-none focus:outline-none"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-px bg-rule"
        />
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-px bg-ink will-change-[width]"
          style={{
            width: `${value}%`,
            transition: draggingRef.current ? "none" : "width 220ms var(--ease-editorial)",
          }}
        />
        <span
          aria-hidden
          className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_4px_var(--paper)] will-change-transform"
          style={{
            top: "50%",
            left: `${value}%`,
            transition: draggingRef.current ? "none" : "left 220ms var(--ease-editorial)",
          }}
        />
      </div>
    </div>
  );
}
