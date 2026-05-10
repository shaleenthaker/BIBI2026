import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
        <span className="size-1 rounded-full bg-accent" />
        {eyebrow}
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-balance text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
