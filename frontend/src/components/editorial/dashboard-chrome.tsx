"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = { label: string; href: string; count?: string };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "Sourcing",
    items: [
      { label: "Pipeline", href: "/dashboard", count: "10" },
      { label: "Gems", href: "/dashboard/gems", count: "03" },
      { label: "Rubrics", href: "/dashboard/rubrics", count: "04" },
      { label: "Outreach", href: "/dashboard/outreach", count: "02" },
    ],
  },
  {
    title: "Sources",
    items: [
      { label: "Devpost", href: "/dashboard", count: "live" },
      { label: "MLH", href: "/dashboard", count: "live" },
      { label: "GitHub graph", href: "/dashboard", count: "live" },
      { label: "Demo videos", href: "/dashboard", count: "queued" },
    ],
  },
  {
    title: "Saved rubrics",
    items: [
      { label: "Founding engineer", href: "/dashboard/rubrics" },
      { label: "Forward-deployed", href: "/dashboard/rubrics" },
      { label: "Design engineer", href: "/dashboard/rubrics" },
      { label: "+ new rubric", href: "/dashboard/rubrics" },
    ],
  },
];

export function DashboardChrome({
  title,
  kicker,
  sub,
  actions,
  children,
}: {
  title: ReactNode;
  kicker?: string;
  sub?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-72px)] grid-cols-[200px_1fr] gap-0">
      <DashboardSidebar />
      <main className="min-w-0 px-10 py-8 pb-20">
        <header className="grid grid-cols-1 items-end gap-6 border-b border-rule pb-6 md:grid-cols-[1fr_auto]">
          <div>
            {kicker && (
              <div className="mb-3.5 font-mono text-[11px] tracking-[0.04em] text-ink-soft">
                <span className="text-accent">●</span> {kicker}
              </div>
            )}
            <h1
              className="m-0"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 56,
                lineHeight: 1,
                letterSpacing: "-0.025em",
                fontVariationSettings: '"opsz" 144',
              }}
            >
              {title}
            </h1>
            {sub && <p className="t-body mt-2">{sub}</p>}
          </div>
          {actions && <div className="flex items-center gap-8">{actions}</div>}
        </header>

        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sticky top-[72px] flex h-[calc(100vh-72px)] flex-col gap-8 self-start border-r border-rule px-8 py-10">
      {NAV.map((group) => (
        <div key={group.title}>
          <h5 className="m-0 mb-3 text-[10px] font-medium uppercase tracking-[0.12em] text-ink-soft">
            {group.title}
          </h5>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {group.items.map((it) => {
              const isCurrent =
                pathname === it.href ||
                (it.href !== "/dashboard" && pathname?.startsWith(it.href));
              return (
                <li key={`${group.title}-${it.label}`} className="relative">
                  <button
                    type="button"
                    data-cursor="link"
                    onClick={() => router.push(it.href)}
                    className={
                      "relative flex w-full items-baseline justify-between gap-2 py-1.5 text-sm transition-colors duration-200 cursor-pointer " +
                      (isCurrent ? "text-ink" : "text-ink-mid hover:text-ink")
                    }
                  >
                    {isCurrent && (
                      <span
                        aria-hidden
                        className="absolute -left-8 top-1/2 -translate-y-1/2 bg-accent"
                        style={{ width: 16, height: 1 }}
                      />
                    )}
                    <span className="text-left">{it.label}</span>
                    {it.count !== undefined && (
                      <span className="font-mono text-[11px] text-ink-soft">{it.count}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="mt-auto t-meta text-ink-soft">Edition 14 · Fri 09:42 PT</div>
    </aside>
  );
}

export function DashboardCommand({ placeholder = "search builders, stacks, sources…" }: { placeholder?: string }) {
  return (
    <span className="cmd-row min-w-[260px]">
      <span className="prompt">/</span>
      <span className="text-ink-mid">{placeholder}</span>
      <span className="ml-auto text-ink-mid">⌘ K</span>
    </span>
  );
}

export function ExportLink({ children = "export.csv" }: { children?: ReactNode }) {
  return (
    <Link
      href="#"
      data-cursor="link"
      data-cursor-label="Send"
      className="u-link cta-accent t-meta"
    >
      {children}
    </Link>
  );
}
