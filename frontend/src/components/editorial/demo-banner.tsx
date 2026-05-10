"use client";

import { useEffect, useState } from "react";
import { isDemoMode } from "@/lib/api";

/**
 * Slim banner that lights up when api.ts fell back to mock data. Dismissible
 * for the session. Lives in dashboard chrome so it doesn't intrude on landing.
 */
export function DemoBanner() {
  const [active, setActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setActive(isDemoMode());
    const onFlag = () => setActive(true);
    window.addEventListener("sniper.demoMode", onFlag);
    return () => window.removeEventListener("sniper.demoMode", onFlag);
  }, []);

  if (!active || dismissed) return null;

  return (
    <div className="border-b border-rule bg-paper-deep">
      <div className="shell flex h-9 items-center gap-4 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-mid">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block size-1.5 bg-accent motion-safe:animate-blink" />
          demo mode
        </span>
        <span className="text-ink-soft">
          api offline · serving mock data · set backend/.env to connect supabase
        </span>
        <button
          type="button"
          data-cursor="link"
          onClick={() => setDismissed(true)}
          className="ml-auto cursor-pointer text-ink-soft hover:text-ink"
        >
          dismiss ×
        </button>
      </div>
    </div>
  );
}
