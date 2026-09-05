# Handmade Art — Design System

> Single source of truth for the visual language of handmadeart.store /
> artehechoamano.com. Any visual decision — color, type, spacing, motion,
> patterns — should be checked against this document **before** writing
> a Tailwind class. If a choice isn't covered here, propose an addition
> instead of inventing inline.

This document is referenced by:
- `CLAUDE.md` (Claude Code)
- `AGENTS.md` (Cursor / Windsurf / Cline / Aider / Codex)
- `.impeccable.md` (impeccable design skill)

---

## 0. Concept — "Taller nocturno" (dark warm workshop)

We are **not a generic e-commerce**. We are a boutique selling
**handmade Costa Rican art** (carved wood mirrors, painted frames,
coffee drippers, sculptures) where every piece supports a social
reintegration program. The product is craft, made after hours in a
lamp-lit workshop. The brand reads like the **workshop itself at
night**: warm timber tones, a single amber work-light, tools and
cedar shavings in chiaroscuro.

### The two anchors

1. **The workshop at night** — `public/taller/hero-taller.webp`: an
   artisan carving a mirror frame lit by a single warm lamp against a
   near-black room. This is the **atmosphere reference**.
2. **The amber work-light** — one accent color (`#E0A83A`) used the
   way a single bulb lights a bench: sparingly, for the thing that
   matters (price, CTA, active state). Everything else stays in the
   dark register.

The whole site is the **bridge** between those two: a dark, textural
ground (cedar, char, iron) with one warm light source picking out
what's for sale and what matters.

### Reference brands (study their sites)

- **Aesop (dark variant)** — chiaroscuro photography, deep neutral
  grounds, restrained serif headlines
- **Blackbird / dark editorial furniture sites** — timber tones on
  near-black, generous breathing room
- **Kinfolk magazine** — typographic rhythm, generous spacing, a
  single accent
- **Hermès home** — premium without screaming, no gradient CTAs

### Anti-references (DO NOT look like)

- Shopify default themes — boxed chips, blue CTAs, gray everything
- Tech-y dashboard dark mode (Notion / Linear / Vercel marketing) —
  too cold, too blue-black. We are warm brown-black, not slate.
- "Luxury" tropes — gold gradients, glass effects, particles,
  embossed leather textures
- Festive corporate (pink-purple-blue gradients) — we are not a
  sale-flyer

---

## 1. Color tokens

All colors live as CSS variables in `src/app/globals.css` and are
exposed to Tailwind via `@theme inline`. **Never** use a raw color
class (`bg-gray-100`, `text-teal-600`, `from-indigo-50`). Always use
the tokens below. `color-scheme: dark` is set on `<html>`; there is no
`prefers-color-scheme` light fallback — the site is dark by design,
not by OS preference.

### Surface (backgrounds, darkest to raised)

| Token | Hex | Use |
|---|---|---|
| `--hm-deep` | **#0F0C0A** | Footer, hero letterbox gradients, deepest ground |
| `--hm-bg` | **#161210** | Default page background (`body`) |
| `--hm-raised` | **#1E1813** | Cards, secondary surfaces, section bands (impact split, drawers) |
| `--hm-line` | **#3A2E24** | Borders, dividers, input borders |
| `--hm-line-soft` | **#2A2119** | Softer hairline — list rows, FAQ dividers |
| `--hm-tile` | **#F1E7D6** | Cream tile behind every product photo (see §7 Product tiles) |

### Ink (text + foreground)

| Token | Hex | Use |
|---|---|---|
| `--hm-ink` | **#F1E7D6** | Default body / heading color on dark surfaces |
| `--hm-ink-2` / `--hm-ink-soft` | **#C9BBA5** | Secondary body text |
| `--hm-ink-mute` | **#8C7F6E** | Tertiary/caption text only — **never** body copy (fails AA at body sizes) |
| `--hm-paper-ink` | **#161210** | Text on amber or tile (light) surfaces |

### Accent (amber — used sparingly)

| Token | Hex | Use |
|---|---|---|
| `--hm-amber` | **#E0A83A** | Primary accent — CTAs, prices, active states, eyebrows |
| `--hm-amber-2` | **#F3C56B** | Hover / lighter accent (button hover, link hover) |

### Status seals (category & availability dots)

| Token | Hex | Use |
|---|---|---|
| `--hm-selva` | **#3C9A70** | In stock / success / "available" seal |
| `--hm-barro` | **#D9563B** | One-of-a-kind / low-stock / error |
| `--hm-cobalto` | **#4C7BD1** | Mirrors / info seal |

### Rules

- **Never `bg-white`** — use `bg-[#1E1813]` (raised) for surfaces.
- **Never neutral Tailwind grays** (`gray-X`, `slate-X`, `zinc-X`,
  `neutral-X`, `stone-X`).
- **No off-brand accents**: no `teal`, `indigo`, `blue`, `purple`,
  `rose`, `pink`, `cyan`. Mirrors' info-seal blue is the one named
  exception (`--hm-cobalto`), used only as a small status dot.
- **Gradients**: only dark-to-darker letterbox gradients on photos
  (`rgba(22,18,16,x)`) and the amber ticker's own flat fill. **No
  gradient text. No amber-to-darker-amber CTA gradients** — flat
  `#E0A83A` only, `#F3C56B` on hover.
- **Product photos are transparent cutouts**: they must always sit on
  a `bg-[#F1E7D6]` tile (never directly on the dark page bg — a
  cutout without a tile disappears into the background).
- **Contrast minimums** (WCAG AA): body 4.5:1 (`--hm-ink` /
  `--hm-ink-2` on `--hm-bg`/`--hm-raised` both pass comfortably),
  large/UI 3:1. `--hm-ink-mute` passes only at caption sizes — do not
  use it for paragraphs.

---

## 2. Typography

### Families

- **Display**: `Libre Caslon Display` — `var(--font-display-family)`.
  Loaded via `next/font/google` in `src/app/layout.tsx`. Single static
  weight (400); rely on size and letter-spacing for hierarchy, not
  weight.
- **Sans (body)**: `Manrope` — `var(--font-sans-family)`. Weights
  400/500/600/700 loaded.

**Rule:** all headings (`<h1>`, `<h2>`, `<h3>` of sections, prices,
big numbers, the eyebrow-adjacent number) use `.font-display` /
`font-display`. Body text, captions, labels, UI text, buttons use
Manrope (the default sans).

We do **not** use `Frank Ruhl Libre`, `Playfair Display`,
`Cormorant`, `Lora`, `Newsreader`, `Fraunces`, `Crimson`, `Inter`,
`DM Sans`, `Outfit`, `Plus Jakarta`, `Instrument Sans`, or `Geist`.
These are retired from this project or in the AI-monoculture banned
list per the impeccable skill.

### Scale (modular, fluid where it matters)

| Token | Size | Use |
|---|---|---|
| Hero H1 (desktop) | 64–96px, `leading-[0.96]` | Home hero only |
| Hero H1 (mobile) | 42–50px, `leading-[0.98]` | Home hero, mobile |
| Section H2 | `clamp(32px, 4vw, 52px)` | Section headings (categories, featured, process) |
| Product title | 18–21px | Card / list product name |
| Price | 17–42px, `.font-display tabular-nums` | Always amber (`text-[#E0A83A]`) |
| Eyebrow | 10–11px uppercase, `tracking-[0.22em]` | Amber, above every section heading |
| Micro | 10px uppercase, `tracking-[0.08–0.16em]` | Badges, seals, category labels |

### Tracking & line-height

- Display: `tracking-[-0.012em]` baseline (set globally on `.display`
  utility / `font-display`)
- Eyebrow: `tracking-[0.22em]` — this is the site's strongest
  editorial signature, keep it consistent everywhere
- Long-form text: `leading-relaxed` (1.6–1.7) on paragraphs
- Line length: max ~65-70ch

### Numerals

Always `tabular-nums` for prices, quantities, dimensions, dates.

---

## 3. Layout & space

Unchanged from the previous system — 4pt-based spacing scale,
`py-16 md:py-24` default section padding (this redesign leans denser:
hero/category/featured sections use `py-14/16` desktop, `py-24` for
the two-column impact/process sections), `max-w-screen-2xl` for
product grids, CSS Grid for all card grids.

---

## 4. Shape — borders, radius, shadows

### Border radius

**2px everywhere** (`rounded-sm`). This redesign is sharper than the
previous rustic-premium system — no soft pills except the quote-count
badge and status dots, which are `rounded-full`.

### Border colors

- Default: `border-[#3A2E24]` (`--hm-line`)
- Softer hairline: `border-[#2A2119]` (`--hm-line-soft`)
- Accent on hover: `border-[#E0A83A]/45`
- **Never** `border-gray-X` or `border-black`.

### Shadows

Shadows read differently on dark: use them sparingly, mostly to lift
a raised card off the page (`shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]`)
or for drawers/modals (`shadow-[0_12px_36px_-18px_rgba(0,0,0,0.5)]`).
No gold-tinted shadows on dark surfaces — they don't read.

---

## 5. Iconography

- **Library**: `lucide-react`, imported by name.
- **`strokeWidth`**: 1.5–1.8 for all icons (never 2 — reads
  "dashboard").
- **Sizes**: `h-4 w-4` inline UI, `h-5 w-5` buttons, `h-6 w-6` section
  heads.
- **Decorative icons**: always `aria-hidden`.
- **No emojis** as decoration.
- **Color**: `text-[#E0A83A]` on dark surfaces; `text-[#161210]` on
  amber surfaces.

---

## 6. Motion

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart) default.
- Duration: micro 150–200ms, standard 300–500ms, editorial 600–800ms.
- **Marquee**: `.hm-marquee-track` in `globals.css` — pure CSS
  `translateX` loop, `28s linear infinite`, disabled entirely under
  `prefers-reduced-motion: reduce`.
- Respect `prefers-reduced-motion` globally (already wired in
  `globals.css`) — never build a component-local infinite animation
  that skips this check.
- Product card hover: `translateY(-2px)` lift + `scale(1.02–1.04)` on
  the image, border shifts to `#E0A83A/45`.

---

## 7. Patterns

### Buttons

| Variant | Background | Text | Radius / height | Use |
|---|---|---|---|---|
| Primary | `bg-[#E0A83A]` → hover `bg-[#F3C56B]` | `text-[#161210]` (always, base **and** hover) | `rounded-sm`, `min-h-[50px]` (54px for hero/primary CTAs) | Main CTAs |
| Secondary (on dark) | transparent + `border border-[#F1E7D6]/45` → hover `border-[#F1E7D6]` | `text-[#F1E7D6]` | same | Secondary actions |
| Secondary (on amber section) | transparent + `border border-[#161210]` | `text-[#161210]` | same | CTA blocks that sit on an amber background |
| Outline accent | transparent + `border border-[#E0A83A]` → hover fills `bg-[#E0A83A]` | `text-[#E0A83A]` → hover `text-[#161210]` | same | "Leer la historia", secondary nav CTA |
| Dark neutral | `bg-[#161210]` → hover `bg-[#0F0C0A]` | `text-[#F1E7D6]` | same | Utility buttons on a raised (`#1E1813`) card, where amber would be too loud |
| Link-style | no bg, `underline decoration-2 decoration-[#E0A83A] underline-offset-[7px]` | `text-[#E0A83A]` hover `text-[#F3C56B]` | — | "Ver todas las categorías", inline nav |

**Non-negotiable rule:** any button whose background is amber or
amber-2 (base or hover) uses `#161210` text, never `#F1E7D6`. Mixing
light text onto an amber hover state is the single most common bug in
this system — check both the base **and** the `hover:` classes
together, not in isolation.

**Banned:**
- Any gradient background on a button
- `bg-gray-X`, `bg-blue-X`, `bg-green-X`
- `rounded-md`/`lg` on buttons

### Product tiles (critical pattern)

Every product photo in this system is a transparent PNG cutout. It
**always** renders inside a cream tile so it reads against the dark
page:

```
bg-[#F1E7D6]                          ← the tile, never the dark page bg
aspect-square | aspect-[4/5]
overflow-hidden
```

`<Image>` inside: `object-contain`, with padding (`p-2`–`p-7`
depending on tile size) so the cutout doesn't touch the tile edges.

Small overlay controls that sit **on top of** the tile (favorite
heart, add-to-list plus button) may keep light/cream styling
(`bg-[#F1E7D6]/95`) since they're on the cream tile, not the dark
page — check which surface a control sits on before choosing its
color.

### Category / seal dots

Small `h-[7–10px] w-[7–10px] rounded-full` dots in `--hm-selva`,
`--hm-barro`, `--hm-cobalto` or `--hm-amber` precede category labels
and availability text. Pick the seal color per category/status, not
arbitrarily.

### Cards

```
bg-[#1E1813]                          ← raised, not the page bg
border border-[#3A2E24]
rounded-sm
overflow-hidden
transition-[border-color,box-shadow,transform] duration-300
hover:-translate-y-0.5
hover:border-[#E0A83A]/45
hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]
```

### Inputs

```
bg-[#1E1813]
border border-[#3A2E24]
rounded-sm
px-3 py-2.5
text-[#F1E7D6]
placeholder:text-[#8C7F6E]
focus:outline-none focus:border-[#F3C56B] focus:ring-2 focus:ring-[#F3C56B]/25
```

Labels: `text-xs uppercase tracking-[0.06em] font-medium text-[#8C7F6E] mb-1.5`.
Always pair a `<select>` with a visible or `sr-only` `<label>` **and**
`aria-label` — a bare `<select>` is a recurring a11y miss in this
codebase, check for it whenever you touch a filter/sort control.

Errors: `text-[#D9563B]` + `border-[#D9563B]/40` + `AlertCircle`
icon, message wrapped in `aria-describedby`.

### Marquee strip

Flat `bg-[#E0A83A]` band, `text-[#161210]`, `font-display`,
category names separated by `◆`. Implemented with `.hm-marquee-track`
(see §6 Motion) — duplicate the content string once so the
`translateX(-50%)` loop is seamless, and never add a flex `gap`
between the two copies (bake the separator into the string itself).

### Category tiles

Full-bleed photo (`object-cover`), bottom scrim
(`linear-gradient(180deg, transparent 0%, rgba(22,18,16,0.92) 100%)`),
`font-display` title + piece count + "desde $X" in `--hm-ink-2`, and
a `40×40` outlined arrow badge (`border-[#E0A83A] text-[#E0A83A]`) in
the bottom-right corner. Counts and starting prices are always **live
Supabase data** — never hardcode a number here.

### Mobile sticky bar

Two-column `grid grid-cols-2` fixed to `bottom-0`: amber "Pedir
cotización" + outline-selva "WhatsApp" (`border-[#3C9A70]`). Respects
`env(safe-area-inset-bottom)`. Only rendered on the home page per the
approved artboard; product/catalog pages keep their own
quote-count sticky bar.

### Headers (page header / hero)

- Home hero: full-bleed photo, dark left-to-right gradient (desktop)
  or bottom scrim (mobile), eyebrow + display H1 + body + 2 CTAs (1
  amber primary, 1 outline secondary), trust row, and a small
  "en el taller esta semana" 3-tile rail (desktop only — real
  featured products, not placeholders).
- Category/catalog header: breadcrumb, `h1` at 68px desktop, stat row
  (piece count, starting price, "sale del taller en 48h" — all live
  data), full-bleed category photo on the right.

### Footer

`bg-[#0F0C0A]` (deepest ground), 4 columns (brand / Tienda / Taller /
Ayuda), amber `w-12 h-[3px]` rule under the brand name, `text-[#C9BBA5]`
body, `text-[#F1E7D6]` links on hover → `#E0A83A`. English/Spanish
cross-domain link lives in the Ayuda column.

### Empty states

Centered, generous whitespace, lucide icon in an amber-tinted circle
(`bg-[#E0A83A]/18 text-[#F3C56B]`), display S headline, one CTA.

---

## 8. Accessibility (non-negotiable)

- All interactive elements: `min-height: 44px` (mobile touch target).
- Visible `:focus-visible` ring: `outline: 2px solid #F3C56B;
  outline-offset: 2px` (wired globally in `globals.css` via
  `--hm-gold-dark`, which now resolves to amber-2).
- One `<h1>` per page; nested `h2`/`h3` respect hierarchy.
- Every `<select>` needs a label: a visible `<label htmlFor>` or, at
  minimum, `aria-label` — check sort/filter controls specifically,
  they are the recurring miss.
- `aria-controls` must reference an id that actually exists in the
  DOM — a stale reference (e.g. a thumbnail tablist pointing at a
  gallery image that has no matching `id`) fails automated audits
  even though it looks fine visually. Grep for `aria-controls="` and
  confirm the target id exists whenever you touch gallery/tab code.
- Toggle buttons: `aria-pressed`. Tabs: `role="tab"` +
  `aria-selected`. Modals: `role="dialog" aria-modal="true"` + focus
  trap + ESC to close.
- Live regions: `aria-live="polite"` for quote-list additions,
  success/error toasts.
- `prefers-reduced-motion: reduce` kills the marquee, carousels, and
  any looping animation.
- Contrast: AA minimum. `--hm-ink-mute` (#8C7F6E) is caption-only —
  never run body copy in it on `--hm-bg`/`--hm-raised`.

---

## 9. Performance

- All images via `next/image` with explicit `sizes`. Hero image and
  first product image get `priority`.
- `next/font/google` for both families (`Libre_Caslon_Display`,
  `Manrope`), `display: swap`, variable mode, loaded once in
  `src/app/layout.tsx`.
- Home page sections (`HomePageData.tsx` → `HeroSection`, `Marquee`,
  `CategoryTiles`, `FeaturedPieces`, `ImpactSplit`, `ProcessSteps`,
  `QuoteCTA`) are server components — no client fetch on mount.
- Long components below the fold (reviews) stay `next/dynamic({ ssr:
  false })`.
- SEO: every page has `generateMetadata`.

---

## 10. Anti-patterns we have committed (do not repeat)

- Cream/paper tokens (`#FAF6EF`, `#F5F1EB`, `#E8E4E0`) left over from
  the pre-"Taller nocturno" system — if you find one, it's a bug, not
  an intentional light surface.
- A dark button that keeps light/cream text on `hover:bg-[#F3C56B]`
  (amber hover) — this was a real, repeated bug during the dark
  migration. The rule in §7 exists because of it.
- `bg-white` anywhere.
- A product `<Image>` sitting directly on the dark page background
  with no `bg-[#F1E7D6]` tile — the cutout disappears.
- Gradient CTAs, `rounded-lg`/`xl`, `shadow-lg`/`md` generic gray.
- Emojis as decoration.
- Multiple `<h1>` per page.
- A `<select>` with no label.

---

## 11. Implementation cheat-sheet (most-used decisions)

| Need | Use |
|---|---|
| Page background | `bg-[#161210]` |
| Card / raised surface | `bg-[#1E1813]` |
| Deepest ground (footer, hero letterbox) | `bg-[#0F0C0A]` |
| Product image tile | `bg-[#F1E7D6]` + `object-contain` |
| Body text | `text-[#F1E7D6]` (default) or `text-[#C9BBA5]` (soft) |
| Caption / tertiary text | `text-[#8C7F6E]` (never for body copy) |
| Border | `border-[#3A2E24]` |
| Hover border / accent | `border-[#E0A83A]/45` |
| Heading | `.font-display` |
| Eyebrow above heading | `text-[11px] uppercase tracking-[0.22em] text-[#E0A83A]` |
| Price | `.font-display tabular-nums text-[#E0A83A]` |
| Primary CTA | `bg-[#E0A83A] text-[#161210] hover:bg-[#F3C56B]` (text stays `#161210` on hover too) |
| Secondary CTA (on dark) | `border border-[#F1E7D6]/45 text-[#F1E7D6]` |
| Card hover shadow | `shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]` |
| Section padding | `py-14 md:py-24` |
| Border radius | `rounded-sm` (2px) everywhere |

---

## 12. Living document

This file evolves. When a new pattern emerges (a new seal color, a
new component, a different heading scale), **update DESIGN.md in the
same PR that introduces the pattern**. Don't let one-off variations
rot the system.

When this document and the code disagree, the document wins. Refactor
the code.
