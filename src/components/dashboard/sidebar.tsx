"use client";

import Link from "next/link";
import {
  Briefcase,
  ChevronsLeft,
  ChevronsRight,
  Gem,
  LayoutDashboard,
  Radar,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { SiteMark } from "@/components/site-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Roles", icon: Briefcase, href: "#", active: true },
  { label: "Pipeline", icon: LayoutDashboard, href: "#" },
  { label: "Gems", icon: Gem, href: "#", count: 3 },
  { label: "Sourcing", icon: Radar, href: "#" },
  { label: "Candidates", icon: Users, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200",
        collapsed ? "w-14" : "w-56",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!collapsed ? (
          <SiteMark />
        ) : (
          <div className="grid size-7 place-items-center rounded-md bg-primary text-xs font-mono font-semibold text-primary-foreground">
            S
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((c) => !c)}
          className="size-7 cursor-pointer"
        >
          {collapsed ? <ChevronsRight className="size-3.5" /> : <ChevronsLeft className="size-3.5" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3 text-sm">
        {NAV.map((n) => {
          const Icon = n.icon;
          return (
            <Link
              key={n.label}
              href={n.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                n.active && "bg-sidebar-accent text-sidebar-accent-foreground",
                collapsed && "justify-center",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{n.label}</span>
                  {n.count !== undefined && (
                    <span className="rounded-full bg-gem-soft px-1.5 text-[10px] font-medium text-gem tabular-nums">
                      {n.count}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 text-[11px]">
        <Link
          href="/ethics"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center",
          )}
        >
          <ShieldCheck className="size-3.5 shrink-0" />
          {!collapsed && <span>Sourcing & ethics</span>}
        </Link>
      </div>
    </aside>
  );
}
