# AGENTS.md

> Standardized agent context per https://agents.md — read by Cursor,
> Windsurf, Cline, Aider, OpenAI Codex and other AI coding tools.
> Claude Code reads this **and** `CLAUDE.md`.

## Project

**Handmade Art** — Next.js 15.5.18 + React 19 + TypeScript + Tailwind 4 + Supabase
e-commerce for Costa Rican handmade art. Bi-domain SEO
(handmadeart.store EN, artehechoamano.com ES). Sells handcraft (carved
wood mirrors, painted frames, coffee drippers) made by residents in a
social reintegration program.

Stack details: `package.json`. Routing: App Router with `[locale]`
segment. Auth: Supabase. State: React context (CartContext,
HomeProductsContext). Forms via plain React + Supabase.

## Coding conventions

- **TypeScript strict.** Prefer explicit types over `any`. Use
  `interface` for object shapes, `type` for unions.
- **React functional components only.** Hooks for state/effects.
  `'use client'` directive at top of client components.
- **i18n locale-aware**: never hardcode strings; use `useLocale()` from
  `next-intl` and ternary `locale === 'es' ? '...' : '...'` (the
  project's existing pattern).
- **Variables, functions, types, comments → English.**
- **UI-facing strings (labels, toasts, errors) → Spanish for ES locale,
  English for EN locale.**
- **Imports**: use `@/` alias for `src/` paths.
- **Commits**: conventional commits with scope when relevant
  (`fix(product):`, `feat(seo):`, `refactor(brand):`).
- **No `bg-gradient-to-X from-Y to-Z` decorative gradients**, **no
  Tailwind raw colors** (`bg-gray-X`, `bg-teal-X`, `text-blue-X` etc.).
  Always use the HM design tokens — see DESIGN.md.

## Design system

**The visual language is locked down in `DESIGN.md` at the repo root.**
Read it before touching any visual element. It covers:
- Color tokens (charcoal/cream/walnut/gold + status)
- Typography (Frank Ruhl Libre display, Geist body)
- Spacing, radius, shadows
- Component patterns (buttons, cards, inputs, navigation)
- Motion (easings, reduced-motion respect)
- A11y minimums (WCAG AA, 44px touch targets, focus rings)

**If a visual decision isn't covered in DESIGN.md, propose an addition
there in the same change set.** Don't invent inline.

## What requires human approval before changes

- Database schema (`supabase/migrations`), Supabase RLS policies
- Environment variables (`.env*`)
- `next.config.ts`, `tailwind.config.*`, `tsconfig.json`
- Routing changes that affect public URLs
- Any payment / checkout flow logic
- Email templates, transactional copy

## What is safe to change without asking

- UI components in `src/components/`
- Tailwind class refactors that respect DESIGN.md tokens
- Adding `aria-*` attributes for accessibility
- Adding `next/dynamic` lazy-loading
- Adding `generateMetadata` to pages that lack it
- Performance optimizations (`useCallback`, `useRef`, memoization)
- Replacing off-brand colors with HM tokens

## Never do automatically

- `git commit` or `git push` unless explicitly asked
- Run database migrations
- Deploy
- Skip git hooks (`--no-verify`)
- Force push to `master`
- Install new npm dependencies without proposing first

## Project-specific gotchas

- The `slug` of a product is the `name` column in `products` (no
  separate `slug` field). Build product URLs as
  `/${locale}/product/${encodeURIComponent(product.name)}`.
- `supabase` client (`@/lib/supabaseClient`) is browser; for server
  components use `@/utils/supabase/server` (cookie-aware).
- `i18n` Link comes from `@/i18n/navigation`, not `next/link`.
- `next/font` variables are `--font-display-family` (Libre Caslon
  Display) and `--font-sans-family` (Manrope), defined in
  `src/app/layout.tsx`.
- The address and phone live in ONE place: `src/lib/businessInfo.ts`.
  The workshop is in San Isidro de Vásquez de Coronado, San José — not
  San Ramón, Alajuela. Import the constant; never retype it.
- Category SEO is DB-driven: `src/lib/content/categoryResolver.ts`
  reads the `categories` table; `categories.ts` is only an optional
  editorial copy layer. Do not reintroduce a hardcoded category list.
- `buildMetadata` takes `alternatePathname` WITHOUT the locale prefix
  and adds it itself.
- Product images are transparent PNG cutouts: render on a cream tile
  (`bg-[#F1E7D6]`) with `object-contain`.
- No human faces in `public/taller/` imagery.
- Never invent facts in copy or structured data. The business is
  quote-only: there is no fixed shipping rate and no written return
  policy, so those fields stay out of the Product JSON-LD.
- React Server Components can be passed as `children` to Client
  Components — this is how RelatedProducts (server) lives inside
  ProductDetail (client).

## See also

- `DESIGN.md` — visual system (required reading before UI work)
- `CLAUDE.md` — same as this file, expanded for Claude Code specifics
- `.impeccable.md` — brand context consumed by the impeccable skill
