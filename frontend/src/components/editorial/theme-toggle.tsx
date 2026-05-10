"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="inline-flex border border-rule">
      <button
        data-cursor="link"
        onClick={() => setTheme("light")}
        className={
          "px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] cursor-pointer transition-colors " +
          (!isDark ? "bg-ink text-paper" : "text-ink-soft hover:text-ink")
        }
      >
        day
      </button>
      <button
        data-cursor="link"
        onClick={() => setTheme("dark")}
        className={
          "px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] cursor-pointer transition-colors " +
          (isDark ? "bg-ink text-paper" : "text-ink-soft hover:text-ink")
        }
      >
        night
      </button>
    </div>
  );
}
