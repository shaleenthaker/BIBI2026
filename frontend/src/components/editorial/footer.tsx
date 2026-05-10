import Link from "next/link";

export function EditorialFooter() {
  return (
    <footer className="shell mt-24 grid grid-cols-[2fr_repeat(4,1fr)] gap-6 border-t border-rule py-16">
      <div className="pr-12">
        <div
          className="font-serif text-[32px]"
          style={{ fontVariationSettings: '"opsz" 72', letterSpacing: "-0.02em" }}
        >
          Sniper<span className="text-accent">.</span>
        </div>
        <p className="t-body mt-4 max-w-[36ch]">
          A weekly digest for recruiters who get there before the post. Published from Oakland.
        </p>
      </div>

      {[
        {
          h: "The room",
          items: [
            { l: "Pipeline", href: "/dashboard" },
            { l: "Gems", href: "/dashboard/gems" },
            { l: "Rubrics", href: "/dashboard/rubrics" },
            { l: "Outreach", href: "/dashboard/outreach" },
          ],
        },
        {
          h: "Sources",
          items: [
            { l: "Devpost", href: "#" },
            { l: "MLH", href: "#" },
            { l: "Public GitHub", href: "#" },
            { l: "Public demo reels", href: "#" },
          ],
        },
        {
          h: "Masthead",
          items: [
            { l: "Editor — S. Thaker", href: "#" },
            { l: "Engineering — open seat", href: "#" },
            { l: "Ethics — A. Reyes", href: "/ethics" },
            { l: "Print — yes, actually", href: "#" },
          ],
        },
        {
          h: "Subscribe",
          items: [
            { l: "Friday digest", href: "#" },
            { l: "Live wire (beta)", href: "#" },
            { l: "Print quarterly", href: "#" },
          ],
        },
      ].map((col) => (
        <div key={col.h}>
          <h4 className="t-meta mb-4 text-ink-soft">{col.h}</h4>
          <ul className="m-0 flex flex-col gap-2 p-0">
            {col.items.map((it) => (
              <li key={it.l} className="text-ink-mid">
                <Link
                  data-cursor="link"
                  href={it.href}
                  className="u-link"
                >
                  {it.l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="t-meta col-span-full mt-14 flex justify-between border-t border-rule pt-6 text-ink-soft">
        <span>© 2026 Sniper Co. — All rights reserved.</span>
        <span>Set in Fraunces &amp; Inter. Composed in California.</span>
      </div>
    </footer>
  );
}
