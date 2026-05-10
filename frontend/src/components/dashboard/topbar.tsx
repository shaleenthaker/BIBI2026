"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LivePulse } from "@/components/live-pulse";
import { ThemeToggle } from "@/components/theme-toggle";
import { mockRecruiter } from "@/lib/mock-data";

export function DashboardTopbar({
  gemCount,
  onBellClick,
}: {
  gemCount: number;
  onBellClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-background/90 px-5 backdrop-blur">
      <button
        type="button"
        className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-secondary cursor-pointer"
      >
        <span className="grid size-5 place-items-center rounded-sm bg-primary text-[10px] font-mono font-semibold text-primary-foreground">
          {mockRecruiter.workspace.slice(0, 1)}
        </span>
        <span className="hidden sm:inline">{mockRecruiter.workspace}</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </button>

      <div className="hidden flex-1 max-w-md md:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidates, roles, projects…"
            className="h-8 pl-8 font-mono text-xs"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <span className="ml-auto hidden items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] sm:inline-flex">
        <LivePulse tone="success" />
        <span className="font-mono uppercase tracking-wider text-muted-foreground">
          Watching 47 hackathons
        </span>
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer"
          aria-label={`${gemCount} gem alerts`}
          onClick={onBellClick}
        >
          <Bell className="size-4" />
          {gemCount > 0 && (
            <motion.span
              key={gemCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
              className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-success font-mono text-[9px] font-medium text-success-foreground tabular-nums"
            >
              {gemCount}
            </motion.span>
          )}
        </Button>
        <ThemeToggle />
        <div className="ml-2 flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1">
          <Avatar className="size-6">
            <AvatarFallback className="bg-secondary font-mono text-[10px]">
              {mockRecruiter.initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-xs font-medium md:inline">{mockRecruiter.name}</span>
        </div>
      </div>
    </header>
  );
}
