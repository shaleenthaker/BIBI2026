"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Inline SVG sparkline with mount-time draw-in. Communicates trend at a glance.
 */
export function Sparkline({
  data,
  className,
  stroke = "currentColor",
  fill = true,
  width = 96,
  height = 28,
}: {
  data: number[];
  className?: string;
  stroke?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}) {
  const id = useId();
  const { path, area, last } = useMemo(() => {
    if (data.length < 2) return { path: "", area: "", last: 0 };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const points = data.map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return [x, y] as const;
    });
    const path = points
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ");
    const area = `${path} L${width.toFixed(1)} ${height} L0 ${height} Z`;
    return { path, area, last: points[points.length - 1][1] };
  }, [data, width, height]);

  return (
    <svg
      role="img"
      aria-label="Trend sparkline"
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      style={{ color: stroke, width, height }}
    >
      {fill && (
        <defs>
          <linearGradient id={`spark-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && area && (
        <motion.path
          d={area}
          fill={`url(#spark-fill-${id})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        />
      )}
      <motion.path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <motion.circle
        cx={width}
        cy={last}
        r={2.5}
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring" }}
      />
    </svg>
  );
}
