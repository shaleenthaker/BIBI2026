# Sniper — Design System

**Product:** Sniper · Devpost-first recruiting platform
**Aesthetic:** GitHub-inspired (Primer) · dense but breathable · professional with subtle motion
**Default surface:** Dark mode (light supported)

---

## 1. Color tokens

All colors live in `src/app/globals.css` as CSS variables in `oklch`. Never hardcode color values in components — always reference tokens via Tailwind's semantic classes (`bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-gem`, etc.).

| Token              | Light                  | Dark                   | Use                                       |
| ------------------ | ---------------------- | ---------------------- | ----------------------------------------- |
| `background`       | near-white             | `oklch(0.14 0.01 270)` | App canvas                                |
| `foreground`       | deep neutral           | near-white             | Primary text                              |
| `card`             | white                  | `oklch(0.18 0.01 270)` | Surfaces above canvas                     |
| `muted`            | very light gray        | `oklch(0.22 0.01 270)` | Inactive surfaces                         |
| `muted-foreground` | mid gray               | mid gray               | Secondary text                            |
| `border`           | `oklch(0.92 …)`        | `1 0 0 / 8%`           | Hairlines (1px), GitHub-style             |
| `primary`          | violet `oklch(0.55 …)` | violet `oklch(0.7 …)`  | CTAs, focus, links                        |
| `gem`              | violet (saturated)     | violet (saturated)     | Gem-flagged candidates, alert toasts      |
| `gem-soft`         | violet 95              | violet 28              | Gem badge backgrounds                     |
| `destructive`      | red                    | red                    | Errors, irreversible actions              |

**Accent:** a single violet hue (≈ hue 287). Never introduce a second saturated accent — gems and primary share the same hue but differ in lightness/saturation.

---

## 2. Typography

| Family           | Variable               | Use                                   |
| ---------------- | ---------------------- | ------------------------------------- |
| Inter            | `--font-inter`         | UI, body, headings                    |
| JetBrains Mono   | `--font-jetbrains-mono`| Scores, IDs, timers, code             |

**Scale (Primer-inspired):**

- `text-xs` (12px) — meta labels, badges
- `text-sm` (14px) — body, table cells, default UI
- `text-base` (16px) — emphasized body
- `text-lg` (18px) — section labels
- `text-xl` (20px) — card titles
- `text-2xl` (24px) — page titles
- `text-3xl` (30px) — hero subhead
- `text-5xl` (48px) / `text-6xl` (60px) — hero display only

**Numerals:** all scores, counts, IDs, and timers use `tabular-nums` and `font-mono` for stable column alignment.

---

## 3. Spacing & density

GitHub-dense: prefer `gap-2`, `gap-3`, `p-3`, `p-4` for most containers. Reserve `p-6+` for hero sections and modals only.

- Card padding: `p-4` or `p-5`
- List row padding: `px-4 py-3`
- Sidebar gutter: `px-3`
- Section vertical rhythm: `py-12 md:py-20` on landing, `py-6` on dashboard

---

## 4. Radius

`--radius: 0.5rem` (8px). Subtle, GitHub-like — avoid pill-shaped containers except for `Badge` and gem dots.

- `rounded-md` — buttons, inputs, badges
- `rounded-lg` — cards
- `rounded-xl` — modals, hero panels
- `rounded-full` — avatars, status dots, gem indicator

---

## 5. Motion

All durations in milliseconds. Respect `prefers-reduced-motion`.

| Token      | Duration | Easing       | Use                                 |
| ---------- | -------- | ------------ | ----------------------------------- |
| Hover      | 150ms    | ease-out     | Buttons, links, interactive states  |
| Reveal     | 220ms    | ease-out     | List items, blur fades              |
| Layout     | spring   | s:280, d:28  | Pipeline reshuffle, candidate sort  |
| Toast      | 280ms    | spring soft  | Gem alerts, sonner                  |

**Stagger:** 40ms between siblings in animated lists.
**Reveal pattern:** `opacity 0→1` + `y 12→0`.
**Layout pattern:** wrap reorderable lists in `<LayoutGroup>` with `motion.div layout`.
**Reduce-motion override:** disables layout transitions and animation durations globally via `globals.css` media query.

---

## 6. Components vocabulary

**Score visualization** — `<ScoreBar value label />` with framer-motion `width` animation on mount and on weight changes. Mono numerals on the right.

**Weight controls** — three sliders that auto-normalize to sum to 1; reflect changes immediately in the candidate list and detail panel. The reshuffle is the demo's hero moment — never block it on confirms or modals.

**Gem alert** — toast slides from top-right, violet glow, never auto-dismiss without user action. Always shows candidate name + role + a "View" CTA.

**Empty states** — every list has one. Pattern: muted icon (lucide), one-line headline, one-line subtext, one CTA. Never a wall of text.

---

## 7. Accessibility (pre-delivery checklist)

- [x] All clickable elements have `cursor-pointer`
- [x] Body text contrast ≥ 4.5:1 in both modes
- [x] Focus rings on every interactive element (`outline-ring/50`)
- [x] `prefers-reduced-motion` respected
- [x] Tab order matches visual order on dashboard
- [x] Form labels paired (`<label htmlFor>`)
- [x] Responsive at 375 / 768 / 1024 / 1440

---

## 8. What we avoid

- Heavy gradient backgrounds (only the violet primary glow on hero / gem alert)
- Drop shadows beyond `shadow-sm` for resting states
- Bright saturated colors except violet primary and the violet gem accent
- Center-aligned dense content (always left-aligned for tables and pipelines)
- Custom font weights below 400 (Inter looks anemic under that)

---

_Component files reference this doc by path comment when their styling deviates from defaults. Update this file when introducing new tokens._
