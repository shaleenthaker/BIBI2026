"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * Hairline sparkline. Stroke draws on mount via stroke-dasharray once it
 * enters the viewport. Pure SVG, accent variant for gems.
 */
export function EditorialSparkline({
  data,
  width = 80,
  height = 18,
  accent = false,
  className,
}: {
  data?: number[];
  width?: number;
  height?: number;
  accent?: boolean;
  className?: string;
}) {
  const id = useId();
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  const pts = useMemo(() => {
    if (data && data.length >= 2) return data;
    // deterministic-ish placeholder when no data
    const arr: number[] = [];
    const seed = (id.charCodeAt(id.length - 2) ?? 1) % 10;
    for (let i = 0; i < 16; i++) {
      arr.push(20 + Math.abs(Math.sin(i * 0.6 + seed)) * 14 + (i / 16) * 4);
    }
    return arr;
  }, [data, id]);

  const { line, area, length } = useMemo(() => {
    const step = width / (pts.length - 1);
    const max = Math.max(...pts);
    const min = Math.min(...pts);
    const range = max - min || 1;
    const y = (v: number) => height - 2 - ((v - min) / range) * (height - 4);
    const segs: string[] = [];
    let total = 0;
    let prev: [number, number] | null = null;
    pts.forEach((v, i) => {
      const x = i * step;
      const yv = y(v);
      segs.push(`${i ? "L" : "M"}${x.toFixed(1)} ${yv.toFixed(1)}`);
      if (prev) total += Math.hypot(x - prev[0], yv - prev[1]);
      prev = [x, yv];
    });
    const line = segs.join(" ");
    const area = `${line} L${width.toFixed(1)} ${height} L0 ${height} Z`;
    return { line, area, length: Math.ceil(total) + 4 };
  }, [pts, width, height]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width={width}
      height={height}
      className={"inline-block align-middle " + (className ?? "")}
      aria-hidden
    >
      <path d={area} fill="var(--rule)" />
      <path
        d={line}
        fill="none"
        stroke={accent ? "var(--accent)" : "var(--ink)"}
        strokeWidth={accent ? 1.25 : 1}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={length}
        strokeDashoffset={drawn ? 0 : length}
        style={{ transition: "stroke-dashoffset 900ms var(--ease-editorial)" }}
      />
    </svg>
  );
}
