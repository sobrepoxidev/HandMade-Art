# CLAUDE.md

> Project-scoped instructions for Claude Code. Loaded automatically.
> Complements (does not replace) the user's global `~/.claude/CLAUDE.md`.

## Project

**Handmade Art** — Next.js 16 App Router + React 19 + TypeScript +
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
  (Frank Ruhl Libre) and `--font-sans-family` (Geist), defined in
  `src/app/[locale]/layout.tsx`.
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

Sandbox blocks `node`/`npm`, so I cannot run TypeScript / lint /
Lighthouse locally. After pushing:
1. The user verifies Vercel build is green
2. Reports back any TS / lint failures with the log block
3. We fix and re-push

For visual / a11y verification, the user runs Lighthouse Mobile and
manual screen-reader tests.

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
