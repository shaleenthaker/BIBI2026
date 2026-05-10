"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Dev-only floating tweaks drawer. Theme · Motion · Accent · Density.
 * Only mounted when NODE_ENV !== "production". State persists to localStorage
 * so refreshes don't reset your preview.
 */

const ACCENTS = ["#B23A1F", "#1F4FB2", "#3D5A3A", "#1A1A1A"];

type Motion = "full" | "medium" | "minimal";
type Density = "editorial" | "compact";

export function TweaksDrawer() {
  const { setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState<string>("#B23A1F");
  const [motion, setMotion] = useState<Motion>("full");
  const [density, setDensity] = useState<Density>("editorial");

  // restore
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sniper.tweaks") ?? "{}");
      if (saved.accent) setAccent(saved.accent);
      if (saved.motion) setMotion(saved.motion);
      if (saved.density) setDensity(saved.density);
    } catch {
      // ignore
    }
  }, []);

  // apply + persist
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-soft", accent + "14");
    document.documentElement.dataset.density = density;
    document.documentElement.dataset.motion = motion;
    try {
      localStorage.setItem("sniper.tweaks", JSON.stringify({ accent, motion, density }));
    } catch {
      // ignore
    }
  }, [accent, motion, density]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-cursor="link"
        data-cursor-label={open ? "Close" : "Tweak"}
        className="fixed bottom-5 right-5 z-50 border border-rule bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.06em] text-ink hover:bg-paper-deep transition-colors duration-200 cursor-pointer"
      >
        <span className="mr-2 inline-block size-1.5 align-middle" style={{ background: accent }} />
        tweaks
      </button>

      <aside
        aria-hidden={!open}
        className={
          "fixed bottom-5 right-5 z-40 w-[320px] origin-bottom-right border border-rule bg-paper transition-all duration-300 " +
          (open
            ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
            : "pointer-events-none translate-y-2 opacity-0 scale-95")
        }
        style={{ transitionTimingFunction: "var(--ease-editorial)" }}
      >
        <header className="flex items-center justify-between border-b border-rule px-4 py-3">
          <span className="t-meta text-ink-soft">tweaks · dev</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            data-cursor="link"
            className="t-meta text-ink-mid hover:text-ink cursor-pointer"
          >
            close ×
          </button>
        </header>
        <div className="space-y-5 px-4 py-4">
          <Section title="Theme">
            <Radio
              value={resolvedTheme === "dark" ? "dark" : "light"}
              onChange={(v) => setTheme(v)}
              options={[
                { value: "light", label: "Day" },
                { value: "dark", label: "Night" },
              ]}
            />
          </Section>
          <Section title="Motion">
            <Radio
              value={motion}
              onChange={(v) => setMotion(v as Motion)}
              options={[
                { value: "full", label: "Full" },
                { value: "medium", label: "Medium" },
                { value: "minimal", label: "Minimal" },
              ]}
            />
          </Section>
          <Section title="Accent">
            <div className="flex gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAccent(c)}
                  data-cursor="link"
                  aria-label={`Accent ${c}`}
                  className={
                    "size-7 cursor-pointer border transition-transform duration-200 " +
                    (accent === c ? "border-ink scale-110" : "border-rule")
                  }
                  style={{ background: c }}
                />
              ))}
            </div>
          </Section>
          <Section title="Density">
            <Radio
              value={density}
              onChange={(v) => setDensity(v as Density)}
              options={[
                { value: "editorial", label: "Editorial" },
                { value: "compact", label: "Compact" },
              ]}
            />
          </Section>
        </div>
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="t-meta mb-2 text-ink-soft">{title}</div>
      {children}
    </div>
  );
}

function Radio({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex border border-rule">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          data-cursor="link"
          className={
            "flex-1 cursor-pointer px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors " +
            (value === o.value ? "bg-ink text-paper" : "text-ink-mid hover:text-ink")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
