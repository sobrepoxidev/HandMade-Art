# CLAUDE.md

> Project-scoped instructions for Claude Code. Loaded automatically.
> Complements (does not replace) the user's global `~/.claude/CLAUDE.md`.

## Project

**Handmade Art** — Next.js 15.5.18 App Router + React 19 + TypeScript +
Tailwind 4 + Supabase. Bi-domain e-commerce: handmadeart.store (EN) /
artehechoamano.com (ES). Sells handmade Costa Rican art (carved wood
mirrors, painted frames, coffee drippers) produced by residents in a
social reintegration program. Every purchase supports that program —
this is the brand's real differentiator.

## Required reading before any visual change

**`DESIGN.md`** at the repo root is the single source of truth for the
visual system (color tokens, typography, spacing, radius, shadows,
component patterns, motion, a11y). Read it. Apply it. If you need a
pattern that isn't there, add it to DESIGN.md in the same change set.

`AGENTS.md` mirrors this file for non-Claude agents (Cursor, Windsurf,
Cline, etc.). Keep them in sync when the project's contract changes.

`.impeccable.md` holds the brand context consumed by the `impeccable`
design skill. When invoking `impeccable craft`, that file is the
starting point.

## Coding conventions

- TypeScript strict. `interface` for object shapes, `type` for unions.
- React functional components only, hooks for state/effects.
- `'use client'` only when needed (hooks, browser APIs, event
  handlers). Default to server components.
- Variables/functions/types/comments → English. UI strings → Spanish
  for ES locale, English for EN, via `useLocale()` from `next-intl`.
- Imports use `@/` alias.
- Conventional commits with scope (`fix(product):`, `feat(seo):`,
  `refactor(brand):`).
- Tailwind: use HM design tokens only. **No raw color classes**
  (`bg-gray-X`, `text-teal-X`, `from-indigo-X`). **No decorative
  gradients on accents** (gold-to-darker-gold is banned).

## What requires human approval

- Database schema, Supabase RLS policies, migrations
- Environment variables, `next.config.ts`, `tailwind.config.*`
- Public routing changes
- Payment / checkout flow logic
- Email templates and transactional copy

## Safe without asking

- UI components in `src/components/`
- Tailwind refactors that respect DESIGN.md
- A11y improvements (aria-*, semantic HTML, focus rings)
- Lazy-loading with `next/dynamic`
- `generateMetadata` additions where missing
- Performance optimizations
- Off-brand color replacements (per DESIGN.md token map)

## Never automatic

- `git commit` / `git push` unless explicitly asked
- Database migrations
- Production deploys
- Skip git hooks (`--no-verify`)
- Force push to `master`
- Install new npm dependencies without proposing first

## Project gotchas

- **Product slug is the `name` column** in `products` (no separate
  `slug`). Build URLs as
  `/${locale}/product/${encodeURIComponent(product.name)}`.
- **Supabase clients**: `@/lib/supabaseClient` (browser),
  `@/utils/supabase/server` (server, cookie-aware),
  `@/lib/supabaseServer` (server, service-role bypass).
- **`Link` for i18n** comes from `@/i18n/navigation`, not `next/link`.
- **Fonts**: `next/font` variables are `--font-display-family`
  (Libre Caslon Display) and `--font-sans-family` (Manrope), defined in
  `src/app/layout.tsx`.
- **The address and phone live in ONE place**: `src/lib/businessInfo.ts`.
  The workshop is in San Isidro de Vásquez de Coronado, San José —
  **not** San Ramón, Alajuela, which was wrong sitewide until Sept 2026
  and is still the name of an unrelated event page. Never retype the
  address or the phone (+506 8585 0000) as free text; import the
  constant. Wrong or inconsistent NAP is the single most damaging thing
  for local search.
- **Category SEO is DB-driven, not a hardcoded list**:
  `src/lib/content/categoryResolver.ts` reads the `categories` table and
  uses `src/lib/content/categories.ts` only as an optional editorial
  copy layer. A category created in the admin gets its landing page,
  slug, FAQ, sitemap entry and llms.txt line automatically. The admin
  product routes call `revalidateCategorySeo()` so it is immediate. Do
  not reintroduce a fixed category array.
- **`buildMetadata` takes `alternatePathname` WITHOUT the locale
  prefix** and adds it itself. Passing `/es/...` there produced hreflang
  URLs that 308-redirect, which invalidates the whole language cluster.
- **Product images are transparent PNG cutouts.** Always render them on
  a cream tile (`bg-[#F1E7D6]`) with `object-contain`; on the dark theme
  they disappear otherwise.
- **Brand photography rule**: no human faces in any image under
  `public/taller/`. The generator produced a deformed face once, and the
  artisans are residents of a social reintegration program whose
  identity should not be exposed. Hands, backs, or empty workshop only.
- **Never invent facts in content or structured data.** There is no
  fixed shipping rate and no written return policy (the business is
  quote-only), so `shippingDetails` and `hasMerchantReturnPolicy` are
  deliberately absent from the Product JSON-LD. A previous version
  declared a fake 14-day return and $6.99 shipping. Counts and prices in
  copy must come from a live query, not from memory.
- **A new quote POSTs to `NOTIFY_WEBHOOK_URL`** (set in Vercel) which
  bridges into aisolutions-saas → Ben's outbox → WhatsApp. See
  `src/lib/notifications.ts` and `notifyQuoteWebhook` in
  `src/app/api/create-interest-request/route.ts`.
- **RSC ↔ Client**: Server Components can be passed as `children` to
  Client Components. RelatedProducts (server) lives inside
  ProductDetail (client) via this pattern.
- **CSS overflow guard**: `html, body { overflow-x: clip; }` is set
  globally — do not undo it.

## Plan-mode preference

For tasks larger than a single targeted change, enter plan mode first.
Default to writing/updating the plan at
`~/.claude/plans/<task-slug>.md` and asking for approval via
`ExitPlanMode` before touching code.

## Verification flow

When the local environment allows it, run:

1. `npm ci`
2. `npm run lint`
3. `npm run build`

If local Node/npm execution is blocked, use the Vercel build result as
the source of truth and fix any TypeScript, lint or build errors from
that log.

For visual / a11y verification, use Lighthouse Mobile and manual
screen-reader checks when the change affects UI.

## Skills available

- `anthropic-skills:impeccable` — pulls from `.impeccable.md`. Use modes
  `craft`, `teach`, `extract` as appropriate.
- `design:design-system`, `design:design-critique`,
  `design:accessibility-review`, `design:design-handoff` — for design
  work.
- `humanizer` — for any copy that comes out reading "AI-generated".
- External skills installed by the user via `npx skills add`:
  `vercel-react-best-practices`, `web-design-guidelines`,
  `ui-ux-pro-max`. Consult them during implementation.
