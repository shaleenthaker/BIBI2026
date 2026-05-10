"use client";

import { motion, useInView, type MotionProps } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * IntersectionObserver-driven reveal wrapper. Once-only, respectful of reduced
 * motion via globals.css `@media (prefers-reduced-motion)`.
 */
export function ScrollReveal({
  children,
  delay = 0,
  y = 16,
  className,
  once = true,
  ...props
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
} & MotionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
