"use client";

// Gem alert toast — green, professional, never decorative. See design-system §6.
import { AnimatePresence, motion } from "framer-motion";
import { Gem, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivePulse } from "@/components/live-pulse";

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
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="pointer-events-auto fixed right-6 top-20 z-50 w-[340px] overflow-hidden rounded-lg border border-success/30 bg-card shadow-md"
        >
          <div className="flex items-start gap-3 p-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-md bg-success-soft text-success">
              <Gem className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-success">
                  Gem detected
                </span>
                <LivePulse tone="success" />
              </div>
              <p className="mt-1 text-sm font-medium leading-tight">{alert.candidate}</p>
              <p className="text-xs text-muted-foreground">
                {alert.role}
                <span aria-hidden className="mx-1">
                  ·
                </span>
                {alert.reason}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-7 px-2.5 text-xs cursor-pointer"
                  onClick={onView}
                >
                  Open candidate
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-muted-foreground cursor-pointer"
                  onClick={onDismiss}
                >
                  Snooze
                </Button>
              </div>
            </div>
            <button
              type="button"
              aria-label="Dismiss alert"
              onClick={onDismiss}
              className="rounded-md p-1 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
