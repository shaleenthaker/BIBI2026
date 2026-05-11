import Link from "next/link";

export function EditorialFooter() {
  return (
    <footer className="shell mt-32 flex flex-wrap items-center justify-between gap-6 border-t border-rule py-8 text-[12px] text-ink-soft">
      <Link
        href="/"
        className="font-serif text-[18px] leading-none text-ink"
        style={{
          fontVariationSettings: '"opsz" 72',
          letterSpacing: "-0.02em",
        }}
      >
        Sniper<span className="text-accent">.</span>
      </Link>
      <nav className="flex gap-6">
        <Link href="/dashboard" className="u-link">
          Pipeline
        </Link>
        <Link href="/oa/demo" className="u-link">
          Assessment
        </Link>
        <Link href="/ethics" className="u-link">
          Ethics
        </Link>
      </nav>
      <span className="font-mono text-[11px]">
        © 2026 · Set in Fraunces &amp; Inter
      </span>
    </footer>
  );
}
