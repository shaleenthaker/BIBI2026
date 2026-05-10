import { cn } from "@/lib/utils";

/**
 * Crosshair-glyph mark — concentric rings + center dot. Reads as "sniper"
 * (precision, targeting) without being literal. Pure SVG.
 */
export function SiteMark({
  className,
  size = "md",
  showLabel = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const sizes = {
    sm: { box: "size-5", label: "text-sm" },
    md: { box: "size-6", label: "text-[15px]" },
    lg: { box: "size-8", label: "text-lg" },
  };
  const { box, label } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 24 24"
        className={cn(box, "text-primary")}
        fill="none"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="0.5" x2="12" y2="4.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="19.5" x2="12" y2="23.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0.5" y1="12" x2="4.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="19.5" y1="12" x2="23.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
      {showLabel && (
        <span className={cn("font-semibold tracking-tight text-foreground", label)}>
          sniper
        </span>
      )}
    </div>
  );
}
