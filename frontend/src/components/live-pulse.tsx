import { cn } from "@/lib/utils";

/**
 * Live status dot with an outward pulse-ring animation. Used to communicate
 * "the watcher is running" — never decorative.
 */
export function LivePulse({
  label,
  className,
  tone = "success",
}: {
  label?: string;
  className?: string;
  tone?: "success" | "info";
}) {
  const dot = tone === "success" ? "bg-success" : "bg-accent";
  const ring = tone === "success" ? "bg-success/40" : "bg-accent/40";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium",
        className,
      )}
    >
      <span className="relative grid size-2 place-items-center">
        <span className={cn("size-2 rounded-full", dot)} />
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-full motion-safe:animate-pulse-ring",
            ring,
          )}
        />
      </span>
      {label && <span className="font-mono uppercase tracking-wider">{label}</span>}
    </span>
  );
}
