"use client";

/**
 * Terminal-style status rail under the topbar. Left side = fixed cells (env,
 * model, queue, p50, gems today). Right side = horizontal infinite ticker.
 * The ticker is doubled so the linear translate seam is invisible.
 */
export function Statusrail() {
  const cells: [string, string, boolean?][] = [
    ["env", "prod-us-west-2"],
    ["model", "rubric-04"],
    ["queue", "412"],
    ["p50", "412ms"],
    ["gems · today", "07", true],
  ];

  const tickerItems = [
    "devpost.connected",
    "github.connected",
    "mlh.connected",
    "demo.queue 14",
    "last.gem maya_ostrowski @ 91.4",
    "rubric founding-eng",
  ];

  return (
    <div className="border-b border-rule bg-paper font-mono text-[10px] tracking-[0.04em] text-ink-soft">
      <div className="shell flex h-7 items-center gap-0 overflow-hidden">
        {cells.map(([k, v, accent]) => (
          <span
            key={k}
            className="flex h-full items-center gap-2 whitespace-nowrap border-r border-rule px-4 first:pl-0 last:border-r-0"
          >
            <span className="text-ink-mid">{k}</span>
            <span
              className="text-ink"
              style={accent ? { color: "var(--accent)" } : undefined}
            >
              {v}
            </span>
          </span>
        ))}
        <span className="grow overflow-hidden">
          <span
            className="flex gap-6 whitespace-nowrap motion-safe:animate-[ticker_60s_linear_infinite] will-change-transform"
          >
            {tickerItems.concat(tickerItems).map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}
