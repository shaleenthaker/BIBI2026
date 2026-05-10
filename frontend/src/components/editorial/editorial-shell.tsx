"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CustomCursor } from "./custom-cursor";
import { ScrollProgressHairline } from "./scroll-progress";
import { SweepTransition, useSweep } from "./sweep-transition";
import { Statusrail } from "./statusrail";
import { ThemeToggle } from "./theme-toggle";
import { TweaksDrawer } from "./tweaks-drawer";

/**
 * Editorial app shell:
 *   ┌──── topbar (brand · crumbs · status pill · ⌘K · theme) ─────┐
 *   │                       statusrail                            │
 *   ├─────────────────────────────────────────────────────────────┤
 *   │  scroll-progress hairline (fixed left)                      │
 *   │  custom cursor (mix-blend-difference)                       │
 *   │  page                                                       │
 *   │                                                             │
 *   └─────────────────────────────────────────────────────────────┘
 */

const ROUTES = [
  { id: "landing", path: "/", label: "landing" },
  { id: "dashboard", path: "/dashboard", label: "dashboard" },
  { id: "oa", path: "/oa/demo", label: "oa" },
  { id: "ethics", path: "/ethics", label: "ethics" },
];

export function EditorialShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state: sweepState, sweep } = useSweep();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const active = currentRouteId(pathname);

  // Sweep on navigation. Pre-load the route during the wipe so the page is
  // ready the moment the wipe finishes — no flash.
  const navigate = (path: string) => {
    if (pathname === path) return;
    sweep(() => router.push(path));
  };

  return (
    <>
      <CustomCursor />
      <ScrollProgressHairline />
      <SweepTransition state={sweepState} />

      <header className="topbar sticky top-0 z-40 bg-paper border-b border-rule font-mono text-[11px]">
        <div className="shell topbar-inner">
          <button
            type="button"
            data-cursor="link"
            onClick={() => navigate("/")}
            className="brand cursor-pointer flex items-center gap-[10px]"
          >
            <span className="mark relative block size-[14px] bg-ink">
              <span className="absolute left-[3px] top-[3px] size-1 bg-accent" />
            </span>
            <span className="name text-ink font-medium tracking-[0.04em]">sniper</span>
            <span className="ver text-ink-soft text-[10px] tracking-[0.04em]">v.2026.05.14</span>
          </button>

          <nav className="breadcrumbs flex items-center gap-2 text-ink-soft">
            <span>~</span>
            <span className="sep opacity-50">/</span>
            {ROUTES.map((r, i) => (
              <span key={r.id} className="flex items-center gap-2">
                <button
                  type="button"
                  data-cursor="link"
                  onClick={() => navigate(r.path)}
                  className={
                    "cursor-pointer transition-colors duration-200 " +
                    (active === r.id ? "text-ink" : "text-ink-mid hover:text-ink")
                  }
                >
                  {r.label}
                </button>
                {i < ROUTES.length - 1 && <span className="sep opacity-50">·</span>}
              </span>
            ))}
          </nav>

          <div className="right flex items-center gap-[18px] text-ink-soft">
            <span className="pill inline-flex items-center gap-1.5 px-2 py-1 border border-rule text-ink-mid text-[10px] tracking-[0.04em]">
              <span className="dot inline-block size-1.5 bg-accent motion-safe:animate-blink" />
              live · 412/d
            </span>
            <Link
              href="#"
              className="kbd inline-flex items-center gap-1.5 px-2 py-1 border border-rule text-ink-mid"
              data-cursor="link"
            >
              <span>cmd</span>
              <span className="text-ink">⌘ K</span>
            </Link>
            {mounted && <ThemeToggle />}
          </div>
        </div>
        <Statusrail />
      </header>

      {/* page */}
      <main className="relative">{children}</main>

      {/* dev-only tweaks drawer */}
      {process.env.NODE_ENV !== "production" && <TweaksDrawer />}
    </>
  );
}

function currentRouteId(pathname: string | null): string {
  if (!pathname || pathname === "/") return "landing";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/oa")) return "oa";
  if (pathname.startsWith("/ethics")) return "ethics";
  return "";
}
