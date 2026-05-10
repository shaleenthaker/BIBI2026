"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-xs", className)}>
      {items.map((c, i) => {
        const last = i === items.length - 1;
        const inner = (
          <span
            className={cn(
              "rounded px-1.5 py-0.5 transition-colors duration-150",
              last
                ? "text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {c.label}
          </span>
        );
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1">
            {c.href && !last ? (
              <Link href={c.href}>{inner}</Link>
            ) : c.onClick && !last ? (
              <button type="button" onClick={c.onClick} className="cursor-pointer">
                {inner}
              </button>
            ) : (
              inner
            )}
            {!last && <ChevronRight className="size-3 text-muted-foreground" aria-hidden />}
          </span>
        );
      })}
    </nav>
  );
}
