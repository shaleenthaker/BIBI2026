"use client";

// Gem alert toast. See design-system/MASTER.md §6.
import { AnimatePresence, motion } from "framer-motion";
import { Gem, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type GemAlertPayload = {
  id: string;
  candidate: string;
  role: string;
  reason: string;
};

export function GemAlert({
  alert,
  onDismiss,
  onView,
}: {
  alert: GemAlertPayload | null;
  onDismiss: () => void;
  onView: () => void;
}) {
  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          key={alert.id}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -16, x: 16 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -8, x: 8 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="pointer-events-auto fixed right-6 top-20 z-50 w-80 overflow-hidden rounded-xl border border-gem/40 bg-card shadow-2xl shadow-gem/10"
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gem to-transparent"
          />
          <div className="flex items-start gap-3 p-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gem-soft text-gem">
              <Gem className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-gem">
                  Gem detected
                </span>
                <span className="text-[10px] font-mono tabular-nums text-muted-foreground">
                  now
                </span>
              </div>
              <p className="mt-1 text-sm font-medium leading-tight">{alert.candidate}</p>
              <p className="text-xs text-muted-foreground">
                {alert.role} · {alert.reason}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" className="h-7 px-2.5 text-xs" onClick={onView}>
                  View candidate
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-muted-foreground"
                  onClick={onDismiss}
                >
                  Dismiss
                </Button>
              </div>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={onDismiss}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
