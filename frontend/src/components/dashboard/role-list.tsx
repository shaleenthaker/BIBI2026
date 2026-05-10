"use client";

import { motion } from "framer-motion";
import { Briefcase, ChevronRight, Gem, Send, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/sparkline";
import { type Role } from "@/lib/mock-data";

const PIPELINE_TREND: Record<string, number[]> = {
  frontend: [4, 5, 6, 7, 9, 10, 11, 12],
  ml: [2, 3, 4, 6, 7, 7, 8, 9],
  designer: [1, 1, 2, 3, 4, 5, 5, 6],
};

export function RoleList({
  roles,
  onOpen,
  onCreate,
}: {
  roles: Role[];
  onOpen: (role: Role) => void;
  onCreate: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Each role has its own scoring rubric and gem-detection threshold.
          </p>
        </div>
        <Button className="cursor-pointer gap-2" onClick={onCreate}>
          <Sparkles className="size-3.5" />
          Create role
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role, i) => (
          <motion.button
            key={role.id}
            type="button"
            onClick={() => onOpen(role)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.32, ease: "easeOut" }}
            className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors duration-150 cursor-pointer hover:border-accent/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {role.team}
                </div>
                <h3 className="mt-0.5 truncate text-base font-semibold">{role.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {role.gemsFlagged > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-success-soft px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase text-success">
                    <Gem className="size-2.5" />
                    {role.gemsFlagged}
                  </span>
                )}
                <ChevronRight className="size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {role.description}
            </p>

            <div className="mt-auto grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
              <Stat
                icon={Users}
                label="pipeline"
                value={role.candidatesInPipeline.toString()}
              />
              <Stat icon={Send} label="OAs" value={role.oasOut.toString()} />
              <Stat icon={Briefcase} label="active" value={role.lastActivity} mono={false} />
            </div>

            <div className="-mb-1 flex items-center justify-between text-[10px]">
              <span className="font-mono uppercase tracking-wider text-muted-foreground">
                Pipeline trend
              </span>
              <Sparkline
                data={PIPELINE_TREND[role.id] ?? [1, 2, 3, 4, 5]}
                width={84}
                height={20}
                className="text-accent"
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  mono = true,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 bg-card px-2.5 py-1.5">
      <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="size-2.5" />
        {label}
      </div>
      <div className={mono ? "font-mono text-sm tabular-nums" : "text-xs"}>{value}</div>
    </div>
  );
}
