"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll-driven reveal: opacity 0→1, translateY 16→0, blur 6→0. Hardware-
 * accelerated via transform/opacity/filter. Honors prefers-reduced-motion.
 * One-shot.
 *
 * The initial hidden state is applied INLINE so first paint is already
 * correct — no flash-of-visible-content before the observer attaches.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span" | "p" | "aside";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.filter = "none";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        // single rAF defers to the next paint so the transition is observable
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.filter = "blur(0px)";
        });
        io.disconnect();
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const initialStyle: CSSProperties = {
    opacity: 0,
    transform: "translateY(16px)",
    filter: "blur(6px)",
    transition: `opacity 600ms var(--ease-editorial) ${delay}ms, transform 600ms var(--ease-editorial) ${delay}ms, filter 600ms var(--ease-editorial) ${delay}ms`,
    willChange: "opacity, transform, filter",
  };

  const Tag = As;
  return (
    // @ts-expect-error generic tag with ref
    <Tag ref={ref} className={className} style={initialStyle}>
      {children}
    </Tag>
  );
}
