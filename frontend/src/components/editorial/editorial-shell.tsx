"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";
import { TweaksDrawer } from "./tweaks-drawer";

const NAV = [
  { label: "Pipeline", href: "/dashboard" },
  { label: "Assessment", href: "/oa/demo" },
  { label: "Ethics", href: "/ethics" },
];

export function EditorialShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rule bg-paper">
        <div className="shell flex h-14 items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[20px] leading-none"
            style={{
              fontVariationSettings: '"opsz" 72',
              letterSpacing: "-0.02em",
            }}
          >
            Sniper<span className="text-accent">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => {
              const active =
                pathname === n.href ||
                (n.href !== "/" && pathname?.startsWith(n.href.replace(/\/[^/]+$/, "")));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={
                    "text-[13px] transition-colors duration-200 " +
                    (active ? "text-ink" : "text-ink-soft hover:text-ink")
                  }
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {mounted && <ThemeToggle />}
        </div>
      </header>

      <main>{children}</main>

      {process.env.NODE_ENV !== "production" && <TweaksDrawer />}
    </>
  );
}
