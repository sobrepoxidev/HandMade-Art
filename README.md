# Handmade Art

Handmade Art is a bilingual e-commerce site for Costa Rican handmade art.
It serves two domains:

- `handmadeart.store` for English
- `artehechoamano.com` for Spanish

The store sells handcrafts such as carved wood mirrors, painted frames and
coffee drippers made by residents in a social reintegration program. The
project combines commerce, storytelling and localized SEO around that mission.

## Stack

- Next.js 15.5.18 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase for auth and data
- PayPal integration for checkout and payment links
- `next-intl` for localized routing and messages

## Project Structure

- `src/app/[locale]` - localized app routes for `es` and `en`
- `src/app/api` - server API routes for PayPal, email, quotes and admin flows
- `src/components` - reusable UI and commerce components
- `src/context` - React context providers such as cart and home products
- `src/i18n` - localized navigation and routing helpers
- `src/lib` and `src/utils` - Supabase clients and shared utilities
- `messages` - locale message JSON files
- `public` - images and static assets
- `supabase` - Supabase project files

## Local Development

Use Node.js 20 or newer.

Install dependencies from the lockfile:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verification

Use these commands before handing off changes:

```bash
npm run lint
npm run build
```

The current baseline passes ESLint without warnings and builds successfully.

## Environment

The app expects local environment variables in `.env.local`. Do not commit
environment files, production credentials, PayPal secrets or Supabase service
role keys.

## Important Notes

- Product URLs use the product `name` as the slug. There is no separate slug
  column.
- Use `@/i18n/navigation` for localized links.
- Use `@/lib/supabaseClient` in browser/client code and
  `@/utils/supabase/server` in server components.
- Follow `DESIGN.md` before changing visual UI.
- Do not run Supabase migrations, deploy, commit or push unless explicitly
  requested.
