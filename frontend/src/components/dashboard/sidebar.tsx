"use client";

import Link from "next/link";
import {
  Briefcase,
  ChevronsLeft,
  ChevronsRight,
  Gem,
  Inbox,
  LayoutDashboard,
  Radar,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { SiteMark } from "@/components/site-mark";
import { Button } from "@/components/ui/button";
import { LivePulse } from "@/components/live-pulse";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { label: "Roles", icon: Briefcase, active: true },
  { label: "Pipeline", icon: LayoutDashboard },
  { label: "Gems", icon: Gem, count: 3 },
  { label: "Inbox", icon: Inbox },
];

const SECONDARY = [
  { label: "Sourcing", icon: Radar },
  { label: "Candidates", icon: Users },
  { label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 z-10 flex h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200",
        collapsed ? "w-14" : "w-56",
      )}
    >
      {/* logo + collapse toggle */}
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!collapsed ? (
          <SiteMark />
        ) : (
          <SiteMark size="sm" showLabel={false} />
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((c) => !c)}
          className="size-7 cursor-pointer"
        >
          {collapsed ? (
            <ChevronsRight className="size-3.5" />
          ) : (
            <ChevronsLeft className="size-3.5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 text-sm">
        <SidebarGroup label="Workflows" collapsed={collapsed} items={PRIMARY} />
        <SidebarGroup label="Resources" collapsed={collapsed} items={SECONDARY} />
      </nav>

      <div className="space-y-2 border-t border-border p-3">
        <Link
          href="/ethics"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center",
          )}
        >
          <ShieldCheck className="size-3.5 shrink-0" />
          {!collapsed && <span>Sourcing & ethics</span>}
        </Link>
        {!collapsed && (
          <div className="rounded-md border border-border bg-card p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Watcher
              </span>
              <LivePulse tone="success" />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-foreground/80">
              Live · 47 hackathons · 2 in finals
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

type Item = { label: string; icon: typeof Briefcase; active?: boolean; count?: number };

function SidebarGroup({
  label,
  items,
  collapsed,
}: {
  label: string;
  items: Item[];
  collapsed: boolean;
}) {
  return (
    <div className="mb-4">
      {!collapsed && (
        <div className="mb-1 px-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}
      <div className="space-y-0.5">
        {items.map((n) => {
          const Icon = n.icon;
          return (
            <Link
              key={n.label}
              href="#"
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                n.active && "bg-sidebar-accent text-sidebar-accent-foreground",
                collapsed && "justify-center",
              )}
              aria-current={n.active ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{n.label}</span>
                  {n.count !== undefined && (
                    <span className="rounded-sm bg-success-soft px-1.5 py-0 font-mono text-[10px] font-medium tabular-nums text-success">
                      {n.count}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
