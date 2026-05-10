import { cn } from "@/lib/utils";

export function SiteMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "size-6 text-[10px]", md: "size-7 text-xs", lg: "size-9 text-sm" };
  const labelSize = { sm: "text-sm", md: "text-base", lg: "text-lg" };
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "grid place-items-center rounded-md bg-primary text-primary-foreground font-mono font-semibold",
          sizes[size],
        )}
        aria-hidden
      >
        S
      </div>
      <span className={cn("font-semibold tracking-tight", labelSize[size])}>sniper</span>
    </div>
  );
}
