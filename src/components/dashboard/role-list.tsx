"use client";

import { motion } from "framer-motion";
import { ChevronRight, Gem, Send, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockRoles, type Role } from "@/lib/mock-data";

export function RoleList({
  onOpen,
  onCreate,
}: {
  onOpen: (role: Role) => void;
  onCreate: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Each role has its own scoring rubric and gem-detection thresholds.
          </p>
        </div>
        <Button className="cursor-pointer" onClick={onCreate}>
          <Sparkles className="size-3.5" />
          Create role
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {mockRoles.map((role, i) => (
          <motion.button
            key={role.id}
            type="button"
            onClick={() => onOpen(role)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.22, ease: "easeOut" }}
            className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-left transition-all duration-150 cursor-pointer hover:border-primary/50 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-mono text-muted-foreground">{role.team}</div>
                <h3 className="truncate text-base font-semibold">{role.title}</h3>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {role.description}
            </p>
            <div className="mt-auto flex items-center gap-3 border-t border-border/60 pt-3 text-xs">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Users className="size-3.5" />
                <span className="font-mono tabular-nums text-foreground">
                  {role.candidatesInPipeline}
                </span>
                in pipeline
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Send className="size-3.5" />
                <span className="font-mono tabular-nums text-foreground">{role.oasOut}</span>
                OAs
              </span>
              {role.gemsFlagged > 0 && (
                <Badge className="ml-auto h-5 gap-1 bg-gem-soft px-1.5 font-medium text-gem hover:bg-gem-soft">
                  <Gem className="size-2.5" />
                  <span className="font-mono tabular-nums">{role.gemsFlagged}</span>
                </Badge>
              )}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Last activity · <span className="font-mono">{role.lastActivity}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
