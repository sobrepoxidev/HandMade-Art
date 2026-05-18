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

## 0. Concept — "Rustic-Premium"

We are **not a generic e-commerce**. We are a boutique selling
**handmade Costa Rican art** (carved wood mirrors, painted resin
frames, coffee drippers, sculptures) where every piece supports a
social reintegration program. The product is craft. The brand must
read **craft**.

### The two anchors

1. **The hero image** — `public/home/hero.webp`: a still-life of carved
   wooden artworks (jaguar, monkey, frog) on a workshop bench with
   leather, chisels and shavings in chiaroscuro warm lighting. This is
   the **material reference**.
2. **The logo** — H/M monogram in white serif on charcoal. Clean,
   editorial, atemporal. This is the **rigor reference**.

The whole site is the **bridge** between those two: warm, tactile,
honest materials (from #1) framed with editorial discipline (from #2).

### Reference brands (study their sites)

- **Aesop** — chiaroscuro photography, cream backgrounds, restrained
  serif headlines, big breathing room
- **Margaret Howell** — calm e-commerce, paper-cream surfaces,
  unhurried pace, editorial product description style
- **Toast** — handcraft aesthetics, warm tones, real photography
- **Kinfolk magazine** — typographic rhythm, generous spacing, muted
  tones with a single accent
- **Hermès home** — premium without screaming, no gold-gradient CTAs

### Anti-references (DO NOT look like)

- Shopify default themes — boxed chips, blue CTAs, gray everything
- Tech-y dashboard look (Notion / Linear / Vercel marketing) — too
  cold, too minimal-clinical
- Dark mode "tech" — we are warm, not LED
- "Luxury" tropes — gold gradients, glass effects, particles,
  embossed leather textures
- Festive corporate (pink-purple-blue gradients) — we are not a
  sale-flyer

---

## 1. Color tokens

All colors live as CSS variables in `src/app/globals.css` and are
exposed to Tailwind via `@theme inline`. **Never** use a raw color
class (`bg-gray-100`, `text-teal-600`, `from-indigo-50`). Always use
the tokens below.

### Surface (backgrounds, from coldest to warmest)

| Token | Hex | Use |
|---|---|---|
| `--hm-paper` | **#FAF6EF** | Default page surface (replaces ivory in most places) — warmer than #FAF8F5, has a paper-cream feel |
| `--hm-ivory` | #FAF8F5 | Still used in subtle gradients with paper |
| `--hm-cream` | #F5F1EB | Secondary surface (cards on paper) |
| `--hm-stone` | #E8E4E0 | Borders, dividers, skeletons |
| `--hm-walnut-light` | **#8B6B4A** | Earthy mid-tone — borders on dark, decorative |
| `--hm-walnut` | **#5C4530** | Deep warm brown — section backgrounds, footer |
| `--hm-charcoal` | #2D2D2D | Primary dark surface, body text on light |
| `--hm-darker` | #1A1A1A | Hover/active state for charcoal |

### Ink (text + foreground)

| Token | Hex | Use |
|---|---|---|
| `--hm-ink` | #2D2D2D | Default body / heading color on light surfaces |
| `--hm-ink-soft` | #4A4A4A | Secondary body text |
| `--hm-ink-mute` | **#6B6459** | Tertiary text (passes AA on cream). Replaces #9C9589 in body. |
| `--hm-paper-ink` | #F5F1EB | Body text on charcoal/walnut backgrounds |

### Accent (gold — used sparingly)

| Token | Hex | Use |
|---|---|---|
| `--hm-gold` | #C9A962 | Primary accent — CTAs, active states, key icons |
| `--hm-gold-dark` | #A08848 | Hover, small-text accent (passes AA on cream) |
| `--hm-gold-light` | #D4C4A8 | Subtle ornament, hover-tone-on-dark |

### Status

| Token | Hex | Use |
|---|---|---|
| `--hm-success` | #4A7C59 | In-stock, success |
| `--hm-success-dark` | **#2F5F3E** | Status text on light (passes AA) |
| `--hm-error` | #C44536 | Errors |
| `--hm-error-dark` | **#9F2D24** | Error text on light (passes AA) |
| `--hm-warning` | #D4A84B | Low-stock |
| `--hm-warning-dark` | **#7A5E18** | Warning text on light (passes AA) |

### Decorative (new — earth tones)

| Token | Hex | Use |
|---|---|---|
| `--hm-terracotta` | **#A85E3F** | Rare third accent for editorial moments only — not CTAs |
| `--hm-jade` | **#5C7459** | Subtle nature tone for the social-impact narrative section |

### Rules

- **Never use `bg-white` (#FFF) — it's too cold.** Always `bg-[--hm-paper]` or `bg-[#FAF6EF]`.
- **Never use neutral grays from Tailwind** (`gray-X`, `slate-X`, `zinc-X`, `neutral-X`, `stone-X`).
- **No off-brand accents**: zero `teal`, `indigo`, `blue`, `purple`, `rose`, `pink`, `cyan`, `emerald`, `amber-X`, `yellow-X`. Use the tokens above.
- **Gradients**: only `linear-gradient(to bottom, --hm-paper, --hm-ivory)` style transitions of OWN paper colors. **No gradient text. No `from-X to-Y` accent gradients.** Especially no `from-[#C9A962] to-[#A08848]` (this looks like a casino).
- **Contrast minimums** (WCAG AA): body 4.5:1, large/UI 3:1. The `*-dark` variants exist exactly so we never break this on cream surfaces.

---

## 2. Typography

### Families

- **Display**: `Frank Ruhl Libre` — `var(--font-display-family)`. Loaded via `next/font` in `src/app/[locale]/layout.tsx`.
- **Sans (body)**: `Geist Sans` — `var(--font-sans-family)`. Same.

**Rule:** **all headings** (`<h1>`, `<h2>`, `<h3>` of sections, prices, big numbers) use `.font-display`. Body text, captions, labels, UI text use Geist.

We do **not** use `Playfair Display`, `Cormorant`, `Lora`, `Newsreader`, `Fraunces`, `Crimson`, `Inter`, `DM Sans`, `Outfit`, `Plus Jakarta`, or `Instrument Sans`. These are in the AI-monoculture banned list per impeccable skill.

### Scale (modular, fluid where it matters)

| Token | Class | Size | Use |
|---|---|---|---|
| Display XL | `text-[clamp(40px,7vw,68px)]` | 40–68 | Hero h1 |
| Display L | `text-[clamp(28px,4vw,42px)]` | 28–42 | Section h2 |
| Display M | `text-2xl md:text-3xl` | 24–30 | Page title (non-hero) |
| Display S | `text-xl md:text-2xl` | 20–24 | Sub-section h3, product name |
| Body L | `text-base md:text-[17px]` | 16–17 | Long-form paragraphs |
| Body | `text-[15px]` / `text-sm` | 14–15 | UI body |
| Caption | `text-[13px]` | 13 | Captions, meta |
| Eyebrow | `text-[11px] uppercase tracking-[0.18em]` | 11 | Eyebrows over h1/h2 (use sparingly — they signal "editorial") |
| Micro | `text-[10px] uppercase tracking-[0.08em]` | 10 | Badges, tags, category pills |

### Tracking & line-height

- Display: `tracking-[-0.005em]` (subtle tight) for sizes ≥28, `tracking-[-0.01em]` for ≥48
- Body: default Tailwind
- Eyebrow / Micro: `tracking-[0.08em]` minimum, `0.18em` for hero eyebrow
- Long-form text: `leading-relaxed` (1.625) on paragraphs ≥body L
- Line length: **max ~70ch** (`max-w-prose` or `max-w-[65ch]`). Beyond ~75ch eyes lose the line.

### Weight

- Display: `font-medium` (500) default; `font-semibold` (600) only when emphasis is needed
- Body: `font-normal` (400) for paragraphs; `font-medium` (500) for UI labels and emphasis
- **Never `font-bold` (700+)** unless it's truly an UI element that needs to scream (rarely — prefer color/size shift)

### Numerals

Always `tabular-nums` for prices, quantities, dimensions, dates. Stops jitter when values change.

---

## 3. Layout & space

### Spacing scale (4pt-based, semantic)

| Token | Tailwind class | px |
|---|---|---|
| xs | `space-1` / `gap-1` | 4 |
| sm | `space-2` / `gap-2` | 8 |
| md | `space-4` / `gap-4` | 16 |
| lg | `space-6` / `gap-6` | 24 |
| xl | `space-10` / `gap-10` | 40 |
| 2xl | `space-16` / `gap-16` | 64 |
| 3xl | `space-24` / `gap-24` | 96 |

### Section vertical padding

- Default section: `py-16 md:py-24` (was `py-8` — too tight for editorial)
- Hero: `py-20 sm:py-28 lg:py-36`
- Tight (e.g. category nav, footer mini): `py-6 md:py-8`

### Container widths

- Marketing/editorial sections: `max-w-screen-xl` (1280px) inside `mx-auto px-4 sm:px-8 lg:px-12`
- Product grid pages: `max-w-screen-2xl` (1536px) — needs the width
- Long-form prose (legal, about, story sections): `max-w-[65ch]` centered

### Grid

- Use CSS Grid for product grids: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`
- **Never** use plain `block` + `float` or table layouts

### Gap, not margin

For sibling spacing inside a container, use `gap-X` on the parent. Margins are for breaking out of the flow.

---

## 4. Shape — borders, radius, shadows

### Border radius

| Token | Class | Use |
|---|---|---|
| Sharp | `rounded-none` | Editorial blocks, full-bleed sections |
| Default | `rounded-sm` (2px) | Cards, buttons, inputs — **this is our house default** |
| Soft | `rounded-md` (6px) | **Avoid by default** — only for tags/chips/pills where soft reads warmer |
| Pill | `rounded-full` | Avatars, small indicators, "back to top" |

**No `rounded-lg`/`rounded-xl`/`rounded-2xl`** anywhere in the project. They read SaaS / dashboard.

### Border colors

- Default: `border-[#E8E4E0]` (stone)
- Subtle: `border-[#E8E4E0]/70`
- Accent on hover: `border-[#C9A962]/45`
- On dark surfaces: `border-[#F5F1EB]/12`
- **Never** `border-gray-X` or `border-black`.

### Shadows — tinted walnut, not neutral gray

Replace all generic `shadow-sm`, `shadow-md`, `shadow-lg`. Use these:

| Class | Use |
|---|---|
| `shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]` | Resting card |
| `shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)]` | Card hover |
| `shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)]` | Modal / drawer |
| `shadow-[0_2px_8px_-4px_rgba(160,136,72,0.40)]` | Gold-tinted CTA shadow (use only on primary CTAs) |

Tailwind 4 lets us also define these as named utilities in `globals.css` if we get tired of writing them — to be added in implementation.

### Texture — paper grain

Optional SVG noise overlay at 5-8% opacity on `--hm-paper` and `--hm-ivory` backgrounds. Apply via:

```css
.paper-grain::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,..."); /* noise svg */
  opacity: 0.06;
  mix-blend-mode: multiply;
  pointer-events: none;
}
```

Use sparingly: hero background, footer, key story sections. Not on every card.

---

## 5. Iconography

- **Library**: `lucide-react`, imported by name (tree-shakable).
- **Default `strokeWidth={1.5}`** for all icons — `2` is too "dashboard". `1` reads delicate but works for editorial flourishes.
- **Sizes**: `h-4 w-4` (16px) for UI inline, `h-5 w-5` (20px) for buttons, `h-6 w-6` for section heads only.
- **Decorative icons**: always `aria-hidden`. Functional icons need `aria-label`.
- **No emojis as decoration** (⚖️, 🏛️, ✨…). Replace with lucide or custom SVG. Emojis read childish on a premium boutique.
- **Color**: `text-[#A08848]` for gold accents on light; `text-[#C9A962]` on dark.

---

## 6. Motion

### Easing

- Default: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart) — natural deceleration
- Slow / luxurious: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- **Never** bounce, elastic, or spring with overshoot. They feel toy.

### Duration

- Micro (hover color, icon flip): 150–200ms
- Standard (card lift, image scale): 300–500ms
- Editorial (hero fade-in, section reveal): 600–800ms

### Respect prefers-reduced-motion

`globals.css` has the global query. **All custom motion must check `useReducedMotion()` (framer-motion) or `@media (prefers-reduced-motion: reduce)` when it would otherwise loop or animate continuously.**

### Transforms only — not layout

Animate `transform` and `opacity`. **Never** animate `width`, `height`, `padding`, `margin`. (Use `transform: scale()` if you need a size change.)

### Default hover for product cards

- `transform: translateY(-2px)` (lift)
- `scale(1.02)` on image inside card
- shadow shift from resting → hover (see Shape § shadows)
- transition `300ms ease-out-quart`

---

## 7. Patterns

### Buttons

| Variant | Background | Text | Use |
|---|---|---|---|
| Primary | `bg-[#2D2D2D]` → hover `bg-[#1A1A1A]` | `text-[#F5F1EB]` | Main CTAs (Add to cart, Buy now, Submit form) |
| Primary gold | `bg-[#C9A962]` → hover `bg-[#A08848] text-[#F5F1EB]` | `text-[#1A1A1A]` | Hero CTA, "Explore catalog" — use **once per view** |
| Secondary | `bg-transparent` + `border border-[#E8E4E0]` → hover `border-[#A08848]` | `text-[#2D2D2D]` | Secondary actions, ghost CTAs |
| On dark | `bg-transparent` + `border border-[#F5F1EB]/30` → hover `bg-[#F5F1EB]/10` | `text-[#F5F1EB]` | Buttons on charcoal/walnut sections |
| Link-style | (no bg) + `underline decoration-2 decoration-[#C9A962] underline-offset-4` | `text-[#2D2D2D]` hover `text-[#A08848]` | Inline navigation, "View more" |

**Banned:**
- `bg-gradient-to-r from-[#C9A962] to-[#A08848]` — casino gold gradient
- `bg-teal-X`, `bg-blue-X`, `bg-green-X` — off brand
- `rounded-lg` or larger on buttons

All buttons: `min-h-[44px]`, `rounded-sm`, `text-sm font-semibold tracking-wide`, `px-5 py-2.5`.

### Cards

```
bg-[#FAF6EF]                         ← paper, not white
border border-[#E8E4E0]/70
rounded-sm                            ← 2px
overflow-hidden
transition-[box-shadow,border-color,transform] duration-300 ease-out-quart
hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)]
hover:border-[#C9A962]/45
hover:-translate-y-0.5
```

Image inside: `aspect-square` on product cards; `aspect-[4/5]` on editorial cards.

### Inputs

```
bg-white
border border-[#E8E4E0]
rounded-sm
px-3 py-2.5
text-[#2D2D2D]
placeholder:text-[#9C9589]
focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25
```

Labels: `text-xs uppercase tracking-[0.06em] font-medium text-[#6B6459] mb-1.5`.

Errors: `text-[#9F2D24]` + `border-[#C44536]` + AlertCircle icon. Wrap error message in `aria-describedby` linked region.

### Category navigation (the one we discussed)

Editorial-functional hybrid:
- Background: `bg-[#FAF6EF]` (paper cream)
- Items: `text-sm tracking-[0.06em] text-[#2D2D2D] hover:text-[#A08848]`
- Active item: `text-[#A08848] underline decoration-2 decoration-[#C9A962] underline-offset-[6px]`
- Separators between items (desktop): `border-l border-[#E8E4E0]` with `px-4 py-3`
- Mobile: scroll horizontal with snap-x, no separators
- Min-height row: 56px (clean touch target)
- **No background pills.** No `bg-[#2D2D2D]` boxes.

### Headers (page header / hero)

- Hero: full-bleed image with dark gradient overlay LEFT (where text goes), eyebrow + display XL + body + 2 CTAs (1 primary gold, 1 secondary outline on dark). See `HeroSection.tsx` for the reference implementation.
- Page headers (non-hero): `pt-12 md:pt-20 pb-8` with breadcrumb on top, then h1 display M, then short intro. Centered on long-form pages; left-aligned on listing pages.

### Footer

`bg-[#1A1A1A]` (darker) for stronger ground; `text-[#B5AC9D]` for body text (passes AA contrast 4.7:1); `text-[#F5F1EB]` for titles; gold accent on micro details (HM monogram, social icons hover).

### Empty states

Centered, generous whitespace. Lucide icon (24px, gold), display S headline, body paragraph (1 sentence), one CTA. No illustrations of cartoon characters — keep it editorial.

---

## 8. Accessibility (non-negotiable)

- All interactive elements: `min-height: 44px` (mobile touch target).
- **Visible `:focus-visible`** ring: `outline: 2px solid #A08848; outline-offset: 2px`. Already in `globals.css`.
- Headings: one `<h1>` per page; nested `h2`/`h3` respect hierarchy.
- Form inputs: `<label htmlFor>` (or `aria-label`), errors with `aria-describedby`, required marked with both visual `*` (`aria-hidden`) and screen reader text (`sr-only "(required)"`).
- Toggle buttons: `aria-pressed`. Tabs: `role="tab" + aria-selected`. Modals: `role="dialog" aria-modal="true"` + focus trap + ESC to close.
- Live regions: `aria-live="polite"` for cart additions, success messages, error appearances.
- `prefers-reduced-motion: reduce` MUST kill any autoplay, looping animation, parallax.
- Contrast: AA minimum, AAA preferred where copy is heavy (legal, about).

---

## 9. Performance

- All images via `next/image` with explicit `sizes`. Above-the-fold (hero, first product image on detail) gets `priority`.
- `next/font` for both display and sans families, `display: swap`, variable mode.
- No `framer-motion` outside places that need it. For one-shot CSS transitions, plain Tailwind.
- Long components below the fold: `next/dynamic({ ssr: false })` (we did this with ReviewsSection).
- SEO: every page has `generateMetadata` with title, description, OG image specific to the page.

---

## 10. Anti-patterns we have committed (do not repeat)

Documented from the audit before this system existed:

- `bg-teal-600` CTAs in checkout / drawer (purged in phase 1)
- `bg-gradient-to-r from-[#C9A962] to-[#A08848]` on every CTA (purged in product detail + home)
- `text-[#9C9589]` on cream surfaces (2.08:1, fails AA) → use `text-[#6B6459]`
- `rounded-md` / `rounded-lg` everywhere — SaaS feel
- `<div className="container">` with no semantic `<main>` (fixed)
- Multiple `<h1>` per page (was happening in carousel banners) (fixed)
- Emojis ⚖️ 🏛️ as decoration (replaced with lucide)
- `bg-white` (#FFF) on product cards — too cold (now `bg-[#FAF6EF]`)
- Spinners as loading state (replaced with skeletons in Reviews)
- `Playfair Display`, `Cormorant Garamond`, `Inter` — banned by impeccable
- `shadow-lg` / `shadow-md` generic gray — use walnut-tinted

---

## 11. Implementation cheat-sheet (most-used decisions)

When you need to write a Tailwind class quickly:

| Need | Use |
|---|---|
| Page background | `bg-[#FAF6EF]` |
| Body text | `text-[#2D2D2D]` (default) or `text-[#4A4A4A]` (soft) |
| Tertiary / caption text | `text-[#6B6459]` (NOT `text-[#9C9589]` — fails contrast) |
| Card background | `bg-[#FAF6EF]` or `bg-white` only if card is on a charcoal section |
| Border | `border-[#E8E4E0]` |
| Hover border / accent | `border-[#C9A962]/45` |
| Heading | `.font-display tracking-[-0.005em]` |
| Eyebrow above heading | `text-[11px] uppercase tracking-[0.18em] text-[#A08848]` |
| Price | `.font-display font-semibold tabular-nums` |
| Primary CTA | `bg-[#2D2D2D] text-[#F5F1EB] hover:bg-[#1A1A1A]` |
| Hero gold CTA (rare) | `bg-[#C9A962] text-[#1A1A1A] hover:bg-[#A08848] hover:text-[#F5F1EB]` |
| Card hover shadow | `shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)]` |
| Section padding | `py-16 md:py-24` |
| Transition | `transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` |
| Border radius default | `rounded-sm` |

---

## 12. Living document

This file evolves. When a new pattern emerges (a third accent color, a new component, a different heading scale), **update DESIGN.md in the same PR that introduces the pattern**. Don't let one-off variations rot the system.

When this document and the code disagree, the document wins. Refactor the code.
