import { cn } from "@/lib/utils";

/**
 * Numbered editorial section head. 12-col grid: vermillion serial number on
 * the left, kicker meta, headline taking the remaining 8 columns.
 */
export function SectionHead({
  index,
  kicker,
  title,
  className,
}: {
  index: number;
  kicker: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-16 grid grid-cols-12 gap-6",
        className,
      )}
    >
      <span
        className="t-num col-span-1"
        style={{
          fontFamily: "var(--font-serif)",
          fontVariationSettings: '"opsz" 144',
          fontSize: 56,
          lineHeight: 0.9,
          color: "var(--accent)",
          letterSpacing: "-0.02em",
        }}
      >
        {String(index).padStart(2, "0")}
      </span>
      <div className="t-meta col-span-3 self-start text-ink-soft">{kicker}</div>
      <h2 className="t-h2 col-span-12 m-0 md:col-span-8">{title}</h2>
    </div>
  );
}
